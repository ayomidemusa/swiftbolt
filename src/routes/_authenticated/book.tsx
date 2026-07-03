import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { RideMap } from "@/components/RideMap";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { geocodeAddress, reverseGeocode } from "@/lib/maps.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Navigation, Loader2, Car, Users, Package, CreditCard, Wallet, Smartphone, Lock, X } from "lucide-react";
import { ensureNotificationPermission, pushNotify } from "@/lib/notifications";
import { payWithPaystack } from "@/lib/paystack";

export const Route = createFileRoute("/_authenticated/book")({
  component: BookPage,
});

type LatLng = { lat: number; lng: number };
type Place = { address: string; lat: number; lng: number };

const DEFAULT_CENTER: LatLng = { lat: 6.5244, lng: 3.3792 }; // Lagos, Nigeria

const CAR_CLASSES = [
  { id: "economy" as const, label: "Economy", icon: Car, mult: 1.0, eta: 3, capacity: "4 seats" },
  { id: "comfort" as const, label: "Comfort", icon: Users, mult: 1.4, eta: 5, capacity: "4 seats" },
  { id: "xl" as const, label: "XL", icon: Package, mult: 1.8, eta: 7, capacity: "6 seats" },
];

function distanceKm(a: LatLng, b: LatLng) {
  const R = 6371, toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function jitterDrivers(center: LatLng, n: number): LatLng[] {
  const seed = Math.floor(center.lat * 100) + Math.floor(center.lng * 100);
  const out: LatLng[] = [];
  for (let i = 0; i < n; i++) {
    const a = ((seed + i * 97) % 360) * (Math.PI / 180);
    const r = 0.003 + ((seed + i * 31) % 50) / 10000;
    out.push({ lat: center.lat + Math.cos(a) * r, lng: center.lng + Math.sin(a) * r });
  }
  return out;
}

function BookPage() {
  const navigate = useNavigate();
  const [center, setCenter] = useState<LatLng>(DEFAULT_CENTER);
  const [pickup, setPickup] = useState<Place | null>(null);
  const [destination, setDestination] = useState<Place | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [focusField, setFocusField] = useState<"pickup" | "destination">("destination");
  const [carClass, setCarClass] = useState<"economy" | "comfort" | "xl">("economy");
  const [payMethod, setPayMethod] =
  useState<"card" | "paystack" | "cash">("paystack");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [booking, setBooking] = useState(false);

  const geocode = useServerFn(geocodeAddress);
  const reverse = useServerFn(reverseGeocode);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const here = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(here);
        try {
          const { address } = await reverse({ data: here });
          setPickup({ address, ...here });
        } catch {
          setPickup({ address: "Current location", ...here });
        }
      },
      () => {
        setCenter(DEFAULT_CENTER);
        setPickup(null);
    },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, [reverse]);

  const drivers = useMemo(() => jitterDrivers(center, 7), [center]);

  const search = useMutation({
    mutationFn: async (q: string) => geocode({ data: { query: q, near: center } }),
    onSuccess: (d) => setResults(d.results),
    onError: () => toast.error("Couldn't search that address"),
  });

  useEffect(() => {
    if (query.trim().length < 3) { setResults([]); return; }
    const t = setTimeout(() => search.mutate(query), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const distance = pickup && destination ? distanceKm(pickup, destination) : 0;
  const duration = Math.max(5, Math.round(distance * 2.5));
  const baseFare = 1000;     // ₦1000 starting fare
  const pricePerKm = 250;   // ₦250 per km
  
  const basePrice = baseFare + distance * pricePerKm;

  function pickResult(p: Place) {
    if (focusField === "pickup") setPickup(p);
    else setDestination(p);
    setQuery(""); setResults([]);
  }

  async function confirmRide() {
    if (!pickup || !destination) return;
  
    setBooking(true);
  
    try {
      const { data: u } = await supabase.auth.getUser();
  
      if (!u.user) {
        throw new Error("Not signed in");
      }
  
      const cls = CAR_CLASSES.find(
        (c) => c.id === carClass
      )!;
  
      const price = +(
        basePrice * cls.mult
      ).toFixed(2);
  
      // PAYSTACK PAYMENT
      if (payMethod === "paystack") {
        await new Promise<void>((resolve, reject) => {
          payWithPaystack(
            u.user.email!,
            price,
  
            () => resolve(),
  
            () =>
              reject(
                new Error("Payment cancelled")
              )
          );
        });
      }
  
      const { data: inserted, error } =
        await supabase
          .from("rides")
          .insert({
            user_id: u.user.id,
            pickup_address: pickup.address,
            pickup_lat: pickup.lat,
            pickup_lng: pickup.lng,
  
            destination_address:
              destination.address,
            destination_lat:
              destination.lat,
            destination_lng:
              destination.lng,
  
            distance_km:
              +distance.toFixed(2),
  
            duration_min: duration,
  
            car_class: carClass,
            price,
            status: "confirmed",
          })
          .select("id")
          .single();
  
      if (error) throw error;
  
      await ensureNotificationPermission();
  
      toast.success(
        `Payment authorized • Driver arriving in ${cls.eta} min`
      );
  
      pushNotify(
        "Swift",
        `Ride confirmed — driver arriving in ${cls.eta} min`
      );
  
      setCheckoutOpen(false);
  
      navigate({
        to: "/track/$rideId",
        params: {
          rideId: inserted!.id,
        },
      });
  
    } catch (e: any) {
      toast.error(
        e.message ?? "Payment failed"
      );
    } finally {
      setBooking(false);
    }
  }
  const ready = pickup && destination;

  return (
    <AppShell active="book">
      <RideMap
        center={pickup ?? center}
        pickup={pickup}
        destination={destination}
        drivers={drivers}
        onMapClick={async (p) => {
          try {
            const { address } = await reverse({ data: p });
            const place = { address, ...p };
            if (!destination) setDestination(place); else setPickup(place);
          } catch {}
        }}
      />

      {/* Bottom sheet */}
      <div className="absolute inset-x-0 bottom-0 z-[2000] rounded-t-3xl border-t border-border bg-surface shadow-sheet">
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border" />
        <div className="px-5 pt-3 pb-5">
          {!ready ? (
            <>
              <h2 className="text-lg font-semibold">Where to?</h2>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3 rounded-2xl bg-surface-elevated px-3 py-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-foreground" />
                  <Input
                    placeholder={pickup ? pickup.address : "Pickup location"}
                    value={focusField === "pickup" ? query : ""}
                    onChange={(e) => { setFocusField("pickup"); setQuery(e.target.value); }}
                    onFocus={() => setFocusField("pickup")}
                    className="h-9 border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
                  />
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-surface-elevated px-3 py-2.5">
                  <div className="h-2.5 w-2.5 rounded-sm bg-primary" />
                  <Input
                    placeholder={destination ? destination.address : "Where are you going?"}
                    value={focusField === "destination" ? query : ""}
                    onChange={(e) => { setFocusField("destination"); setQuery(e.target.value); }}
                    onFocus={() => setFocusField("destination")}
                    autoFocus
                    className="h-9 border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
                  />
                </div>
              </div>

              <div className="mt-3 max-h-64 overflow-auto">
                {search.isPending && (
                  <div className="flex items-center gap-2 px-1 py-3 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Searching…
                  </div>
                )}
                {!search.isPending && results.length === 0 && query.length < 3 && (
                  <p className="px-1 pt-3 text-xs text-muted-foreground">
                    Type at least 3 characters, or tap anywhere on the map to drop a pin.
                  </p>
                )}
                {results.map((r) => (
                  <button
                    key={`${r.lat}-${r.lng}`}
                    onClick={() => pickResult(r)}
                    className="flex w-full items-start gap-3 rounded-xl px-2 py-3 text-left hover:bg-surface-elevated"
                  >
                    <Search className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="text-sm">{r.address}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="rounded-2xl bg-surface-elevated p-3">
                <Row dot="bg-foreground" text={pickup.address} onClear={() => setPickup(null)} />
                <div className="ml-[5px] h-3 w-px bg-border" />
                <Row dot="bg-primary square" text={destination.address} onClear={() => setDestination(null)} />
              </div>

              <div className="mt-4 space-y-2">
                {CAR_CLASSES.map((c) => {
                  const price = (basePrice * c.mult).toFixed(2);
                  const selected = carClass === c.id;
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCarClass(c.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${selected ? "border-primary bg-primary/10" : "border-border bg-surface-elevated"}`}
                    >
                      <div className={`grid h-11 w-11 place-items-center rounded-xl ${selected ? "bg-primary text-primary-foreground" : "bg-surface text-foreground"}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{c.label}</span>
                          <span className="font-semibold">₦{Number(price).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{c.capacity} · {duration} min</span>
                          <span>{c.eta} min away</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <Button onClick={() => setCheckoutOpen(true)} className="mt-4 h-12 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90">
                <Navigation className="mr-2 h-4 w-4" /> Continue to payment · ₦{(
  basePrice *
  CAR_CLASSES.find((c) => c.id === carClass)!.mult
).toLocaleString()}
              </Button>
            </>
          )}
        </div>
      </div>

      {checkoutOpen && ready && (
        <CheckoutSheet
          total={+(basePrice * CAR_CLASSES.find((c) => c.id === carClass)!.mult).toFixed(2)}
          method={payMethod}
          setMethod={setPayMethod}
          onClose={() => setCheckoutOpen(false)}
          onPay={confirmRide}
          loading={booking}
        />
      )}
    </AppShell>
  );
}

function CheckoutSheet({
  total, method, setMethod, onClose, onPay, loading,
}: {
  total: number;
  method: "card" | "paystack" | "cash";
  setMethod: (m: "card" | "paystack" | "cash") => void;
  onClose: () => void;
  onPay: () => void;
  loading: boolean;
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-[2000] rounded-t-3xl border-t border-border bg-surface shadow-sheet" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full rounded-t-3xl border-t border-border bg-surface p-5 shadow-sheet">
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Checkout</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-surface-elevated text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Choose a payment method. You'll be charged when the trip completes.</p>

        <div className="mt-4 space-y-2">
          {[
            { id: "card" as const, icon: CreditCard, label: "Visa •••• 4242", sub: "Default card" },
            { id: "paystack" as const, icon: Smartphone, label: "paystack Pay", sub: "Face ID" },
            { id: "cash" as const, icon: Wallet, label: "Cash", sub: "Pay driver directly" },
          ].map((m) => {
            const Icon = m.icon;
            const selected = method === m.id;
            return (
              <button key={m.id} onClick={() => setMethod(m.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${selected ? "border-primary bg-primary/10" : "border-border bg-surface-elevated"}`}>
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${selected ? "bg-primary text-primary-foreground" : "bg-surface"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.sub}</p>
                </div>
                <div className={`h-4 w-4 rounded-full border ${selected ? "border-primary bg-primary" : "border-border"}`} />
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl bg-surface-elevated p-3">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-lg font-semibold">N{total.toFixed(2)}</span>
        </div>

        <Button onClick={onPay} disabled={loading} className="mt-4 h-12 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Lock className="mr-2 h-4 w-4" /> Pay  ₦{total.toLocaleString()}</>}
        </Button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">Secured checkout · demo mode</p>
      </div>
    </div>
  );
}

function Row({ dot, text, onClear }: { dot: string; text: string; onClear: () => void }) {
  const isSquare = dot.includes("square");
  return (
    <div className="flex items-center gap-3 py-1">
      <div className={`h-2.5 w-2.5 ${isSquare ? "rounded-sm bg-primary" : "rounded-full bg-foreground"}`} />
      <span className="flex-1 truncate text-sm">{text}</span>
      <button onClick={onClear} className="text-xs text-muted-foreground hover:text-foreground">Change</button>
    </div>
  );
}
