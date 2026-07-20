import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { RideMap } from "@/components/RideMap";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Phone, MessageSquare, Shield, Car, Loader2, Search } from "lucide-react";
import { ensureNotificationPermission, pushNotify } from "@/lib/notifications";
import { getRoute } from "@/lib/osrm";

export const Route = createFileRoute("/_authenticated/track/$rideId")({
  component: TrackPage,
});

type LatLng = { lat: number; lng: number };

type Ride = {
  id: string;
  pickup_address: string; pickup_lat: number; pickup_lng: number;
  destination_address: string; destination_lat: number; destination_lng: number;
  price: number; car_class: string; status: string; duration_min: number | null;
  driver_id: string | null;
};

type Driver = {
  id: string;
  full_name: string | null;
  vehicle_model: string | null;
  vehicle_plate: string | null;
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
  const [driver, setDriver] = useState<Driver | null>(null);
  const [progress, setProgress] = useState(0); // purely cosmetic marker animation, 0..1

  const notifiedRef = useRef<{ accepted: boolean; started: boolean; completed: boolean }>({
    accepted: false,
    started: false,
    completed: false,
  });

  useEffect(() => {
    ensureNotificationPermission();
  }, []);

  // Initial load
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("rides").select("*").eq("id", rideId).maybeSingle();
      if (error || !data) {
        toast.error("Ride not found");
        navigate({ to: "/history" });
        return;
      }
      setRide(data as Ride);
    })();
  }, [rideId, navigate]);

  // Realtime: reflect the ACTUAL status written by the driver dashboard.
  // This replaces the old local timer that faked "arriving" -> "in_progress" -> "completed".
  useEffect(() => {
    if (!rideId) return;

    const channel = supabase
      .channel(`ride-${rideId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rides",
          filter: `id=eq.${rideId}`,
        },
        (payload) => {
          setRide(payload.new as Ride);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rideId]);

  // Fetch driver details once a driver has accepted
  useEffect(() => {
    if (!ride?.driver_id) {
      setDriver(null);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("drivers")
        .select("id, full_name, vehicle_model, vehicle_plate")
        .eq("id", ride.driver_id)
        .maybeSingle();
      setDriver((data as Driver) ?? null);
    })();
  }, [ride?.driver_id]);

  // Notifications on real status transitions
  useEffect(() => {
    if (!ride) return;

    if (ride.status === "accepted" && !notifiedRef.current.accepted) {
      notifiedRef.current.accepted = true;
      toast.success("A driver accepted your ride");
      pushNotify("Swift", "A driver is on the way to pick you up");
    }
    if (ride.status === "in_progress" && !notifiedRef.current.started) {
      notifiedRef.current.started = true;
      toast.success("Trip started");
      pushNotify("Swift", "Trip started — enjoy your ride");
    }
    if (ride.status === "completed" && !notifiedRef.current.completed) {
      notifiedRef.current.completed = true;
      toast.success("You have arrived at your destination");
      pushNotify("Swift", `Arrived — total ₦${Number(ride.price).toLocaleString()}`);
    }
  }, [ride?.status]);

  // Load route once we have the ride
  useEffect(() => {
    if (!ride) return;

    const loadRoute = async () => {
      try {
        const points = await getRoute(
          ride.pickup_lat,
          ride.pickup_lng,
          ride.destination_lat,
          ride.destination_lng
        );
        setRoute(points);
      } catch (error) {
        console.log("OSRM ERROR:", error);
      }
    };

    loadRoute();
  }, [ride]);

  // Simulated driver start location: purely cosmetic, for the marker animation only.
  // It no longer drives any database writes.
  const driverStart = useMemo<LatLng | null>(() => {
    if (!ride) return null;
    const seed = ride.id.charCodeAt(0) + ride.id.charCodeAt(2);
    const a = (seed % 360) * (Math.PI / 180);
    return { lat: ride.pickup_lat + Math.cos(a) * 0.013, lng: ride.pickup_lng + Math.sin(a) * 0.013 };
  }, [ride]);

  // Cosmetic marker animation — loops while "accepted" or "in_progress",
  // but never writes status back to the database. The driver dashboard owns that.
  useEffect(() => {
    if (!ride || !driverStart) return;
    if (ride.status !== "accepted" && ride.status !== "in_progress") return;

    const pickup = { lat: ride.pickup_lat, lng: ride.pickup_lng };
    const dest = { lat: ride.destination_lat, lng: ride.destination_lng };
    const durationMs = ride.status === "accepted" ? 20000 : 30000;
    const start = performance.now();
    let raf = 0;

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      // Intentionally does nothing at p === 1 — waiting for the driver
      // to actually move the ride forward via the dashboard.
    };

    setProgress(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ride?.status, ride, driverStart]);

  if (!ride) {
    return (
      <AppShell active="book">
        <div className="grid h-full place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </AppShell>
    );
  }

  const pickup = { lat: ride.pickup_lat, lng: ride.pickup_lng };
  const dest = { lat: ride.destination_lat, lng: ride.destination_lng };

  // Waiting for a driver to accept — no fake movement, no fake status.
  if (ride.status === "pending") {
    return (
      <AppShell active="book">
        <RideMap center={pickup} pickup={pickup} destination={dest} drivers={[]} route={route} />
        <div className="absolute inset-x-0 bottom-0 z-10 rounded-t-3xl border-t border-border bg-surface shadow-sheet">
          <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border" />
          <div className="px-5 pt-3 pb-6 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-primary">
              <Search className="h-5 w-5 animate-pulse" />
            </div>
            <h2 className="mt-3 text-lg font-semibold">Searching for a nearby driver…</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              This can take a moment. We'll notify you the instant a driver accepts.
            </p>
            <p className="mt-3 text-lg font-semibold">₦{Number(ride.price).toLocaleString()}</p>
            <Button
              onClick={() => navigate({ to: "/history" })}
              variant="outline"
              className="mt-4 h-11 w-full rounded-2xl"
            >
              Cancel and go back
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const driverPos =
    ride.status === "accepted" && driverStart ? interp(driverStart, pickup, progress)
    : ride.status === "in_progress" ? interp(pickup, dest, progress)
    : dest;

  const remainingKm =
    ride.status === "accepted" ? distKm(driverPos, pickup) : distKm(driverPos, dest);
  const etaMin = Math.max(1, Math.round((remainingKm / SPEED_KMH) * 60 * (ride.status === "accepted" ? 0.4 : 1)));

  const statusLabel =
    ride.status === "accepted" ? `Driver arriving in ~${etaMin} min` :
    ride.status === "in_progress" ? `On the way • ~${etaMin} min to destination` :
    "Trip complete";

  return (
    <AppShell active="book">
      <RideMap center={driverPos} pickup={pickup} destination={dest} drivers={[driverPos]} route={route} />
      <div className="absolute inset-x-0 bottom-0 z-10 rounded-t-3xl border-t border-border bg-surface shadow-sheet">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border" />
        <div className="px-5 pt-3 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {ride.status === "completed" ? "Completed" : "Live tracking"}
              </p>
              <h2 className="text-lg font-semibold">{statusLabel}</h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Fare</p>
              <p className="text-lg font-semibold">₦{Number(ride.price).toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
            <div
              className="h-full bg-primary transition-[width] duration-200"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-surface-elevated p-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 text-primary">
              <Car className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{driver?.full_name ?? "Your driver"}</p>
              <p className="text-xs text-muted-foreground">
                {driver?.vehicle_plate ?? "—"} • {driver?.vehicle_model ?? ride.car_class}
              </p>
            </div>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-surface text-foreground">
              <MessageSquare className="h-4 w-4" />
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
              <Phone className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-2xl bg-surface-elevated p-3 text-xs text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            Trip is being tracked. Share your ETA with a trusted contact.
          </div>

          {ride.status === "completed" && (
            <Button
              onClick={() => navigate({ to: "/history" })}
              className="mt-4 h-12 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Done
            </Button>
          )}
        </div>
      </div>
    </AppShell>
  );
}