import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { RideMap } from "@/components/RideMap";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Phone, MessageSquare, Shield, Car, Loader2 } from "lucide-react";
import { ensureNotificationPermission, pushNotify } from "@/lib/notifications";
import { getRoute } from "@/lib/osrm";



// const [route, setRoute] = useState<LatLng[]>([]);
export const Route = createFileRoute("/_authenticated/track/$rideId")({
  component: TrackPage,
});

type LatLng = { lat: number; lng: number };
type Ride = {
  id: string;
  pickup_address: string; pickup_lat: number; pickup_lng: number;
  destination_address: string; destination_lat: number; destination_lng: number;
  price: number; car_class: string; status: string; duration_min: number | null;
};

const SPEED_KMH = 45;

function interp(a: LatLng, b: LatLng, t: number): LatLng {
  return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t };
}
function distKm(a: LatLng, b: LatLng) {
  const R = 6371, toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function TrackPage() {
  const { rideId } = Route.useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState<LatLng[]>([]);
  const [ride, setRide] = useState<Ride | null>(null);
  const [phase, setPhase] = useState<"arriving" | "in_progress" | "completed">("arriving");
  const [progress, setProgress] = useState(0); // 0..1 within current phase
  const notifiedRef = useRef<{ arrived: boolean; started: boolean; completed: boolean }>({ arrived: false, started: false, completed: false });

  useEffect(() => {
    ensureNotificationPermission();
  }, []);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("rides").select("*").eq("id", rideId).maybeSingle();
      if (error || !data) { toast.error("Ride not found"); navigate({ to: "/history" }); return; }
      setRide(data as any);
    })();
  }, [rideId, navigate]);
  useEffect(() => {

    if (!ride) return;

    console.log("LOADING ROUTE...");

    const loadRoute = async () => {

        try {

            const points = await getRoute(
                ride.pickup_lat,
                ride.pickup_lng,
                ride.destination_lat,
                ride.destination_lng
            );

            console.log("ROUTE POINTS:", points);

            setRoute(points);

        } catch (error) {

            console.log("OSRM ERROR:", error);

        }

    };

    loadRoute();

}, [ride]);
//   if (!ride) return;

// (async () => {
//   const points = await getRoute(
//     ride.pickup_lat,
//     ride.pickup_lng,
//     ride.destination_lat,
//     ride.destination_lng
//   );

//   setRoute(points);
// })();

  // Simulated driver start location: 1.5km offset from pickup
  const driverStart = useMemo<LatLng | null>(() => {
    if (!ride) return null;
    const seed = ride.id.charCodeAt(0) + ride.id.charCodeAt(2);
    const a = (seed % 360) * (Math.PI / 180);
    return { lat: ride.pickup_lat + Math.cos(a) * 0.013, lng: ride.pickup_lng + Math.sin(a) * 0.013 };
  }, [ride]);

  // animate progress
  useEffect(() => {
    if (!ride || !driverStart) return;
    const pickup = { lat: ride.pickup_lat, lng: ride.pickup_lng };
    const dest = { lat: ride.destination_lat, lng: ride.destination_lng };
    const legKm = phase === "arriving" ? distKm(driverStart, pickup) : distKm(pickup, dest);
    const legMin = Math.max(1, (legKm / SPEED_KMH) * 60);
    // For demo speed: compress to seconds. arriving -> 20s, trip -> 30s
    const durationMs = phase === "arriving" ? 20000 : 30000;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        if (phase === "arriving") {
          if (!notifiedRef.current.arrived) {
            notifiedRef.current.arrived = true;
            toast.success("Your driver has arrived");
            pushNotify("Swift", "Your driver has arrived at pickup");
          }
          setTimeout(() => {
            setPhase("in_progress");
            setProgress(0);
            if (!notifiedRef.current.started) {
              notifiedRef.current.started = true;
              pushNotify("Swift", "Trip started — enjoy your ride");
            }
            supabase.from("rides").update({ status: "in_progress" }).eq("id", ride.id);
          }, 1500);
        } else if (phase === "in_progress") {
          setPhase("completed");
          if (!notifiedRef.current.completed) {
            notifiedRef.current.completed = true;
            toast.success("You have arrived at your destination");
            pushNotify("Swift", `Arrived — total $${ride.price.toFixed(2)}`);
          }
          supabase.from("rides").update({ status: "completed" }).eq("id", ride.id);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      void legMin;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, ride, driverStart]);

  if (!ride || !driverStart) {
    return (
      <AppShell active="book">
        <div className="grid h-full place-items-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </AppShell>
    );
  }

  const pickup = { lat: ride.pickup_lat, lng: ride.pickup_lng };
  const dest = { lat: ride.destination_lat, lng: ride.destination_lng };
  const driverPos =
    phase === "arriving" ? interp(driverStart, pickup, progress)
    : phase === "in_progress" ? interp(pickup, dest, progress)
    : dest;

  const remainingKm = phase === "arriving" ? distKm(driverPos, pickup) : distKm(driverPos, dest);
  const etaMin = Math.max(1, Math.round((remainingKm / SPEED_KMH) * 60 * (phase === "arriving" ? 0.4 : 1)));

  const statusLabel =
    phase === "arriving" ? `Driver arriving in ~${etaMin} min` :
    phase === "in_progress" ? `On the way • ~${etaMin} min to destination` :
    "Trip complete";

  return (
    <AppShell active="book">
      <RideMap
  center={driverPos}
  pickup={pickup}
  destination={dest}
  drivers={[driverPos]}
  route={route}
/>
      <div className="absolute inset-x-0 bottom-0 z-10 rounded-t-3xl border-t border-border bg-surface shadow-sheet">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border" />
        <div className="px-5 pt-3 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{phase === "completed" ? "Completed" : "Live tracking"}</p>
              <h2 className="text-lg font-semibold">{statusLabel}</h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Fare</p>
              <p className="text-lg font-semibold">${ride.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
            <div className="h-full bg-primary transition-[width] duration-200" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-surface-elevated p-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 text-primary"><Car className="h-5 w-5" /></div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Alex • Toyota Prius</p>
              <p className="text-xs text-muted-foreground">ABC-1234 • {ride.car_class}</p>
            </div>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-surface text-foreground"><MessageSquare className="h-4 w-4" /></button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground"><Phone className="h-4 w-4" /></button>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-surface-elevated p-3 text-xs text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            Trip is being tracked. Share your ETA with a trusted contact.
          </div>

          {phase === "completed" && (
            <Button onClick={() => navigate({ to: "/history" })} className="mt-4 h-12 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90">
              Done
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}
