import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Car, DollarSign, Clock3, Star, Phone, Pencil, Check, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/driver/dashboard")({
  component: DriverDashboard,
});

type Ride = {
  id: string;
  pickup_address: string;
  destination_address: string;
  price: number;
  status: string;
  driver_id: string | null;
  car_class: string;
};

type DriverProfile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  car_model: string | null;
  plate_number: string | null;
  status: string;
  hourly_rate: number | null;
  price_per_km: number | null;
};

function DriverDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);

  const [editingRates, setEditingRates] = useState(false);
  const [rateForm, setRateForm] = useState({ hourly_rate: "", price_per_km: "" });
  const [savingRates, setSavingRates] = useState(false);

  const driverId = profile?.id ?? null;

  // Load the driver's own profile. If there isn't one, send them to register.
  useEffect(() => {
    loadProfile();

    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // maybeSingle instead of single: returns null instead of a 406
      // when there's no row (or throws clearly if there's more than one).
      const { data, error } = await supabase
        .from("drivers")
        .select("id, full_name, phone, car_model, plate_number, status, hourly_rate, price_per_km")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (!data) {
        // No driver profile yet — send them to complete registration.
        navigate({ to: "/driver-register" });
        return;
      }

      setProfile(data as DriverProfile);
      setOnline(data.status === "online");
      setRateForm({
        hourly_rate: data.hourly_rate?.toString() ?? "",
        price_per_km: data.price_per_km?.toString() ?? "",
      });
      setLoading(false);
    }
  }, [navigate]);

  // Load pending rides + this driver's active ride, and keep both in sync via realtime
  useEffect(() => {
    if (!driverId) return;

    loadPendingRides();
    loadActiveRide();

    const channel = supabase
      .channel("driver-rides")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rides" },
        () => {
          loadPendingRides();
          loadActiveRide();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driverId]);

  async function loadPendingRides() {
    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRides(data);
    }
  }

  async function loadActiveRide() {
    if (!driverId) return;

    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .eq("driver_id", driverId)
      .in("status", ["accepted", "in_progress"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error) {
      setActiveRide(data ?? null);
    }
  }

  async function toggleStatus(value: boolean) {
    if (!profile) return;
    setOnline(value);

    await supabase
      .from("drivers")
      .update({ status: value ? "online" : "offline" })
      .eq("id", profile.id);
  }

  async function acceptRide(rideId: string) {
    if (!driverId) return;

    if (activeRide) {
      toast.error("Finish your current ride before accepting another.");
      return;
    }

    const { data, error } = await supabase
      .from("rides")
      .update({ status: "accepted", driver_id: driverId })
      .eq("id", rideId)
      .eq("status", "pending")
      .select()
      .single();

    if (error || !data) {
      toast.error("This ride was just taken by another driver.");
      loadPendingRides();
      return;
    }

    toast.success("Ride accepted");
    setRides((prev) => prev.filter((r) => r.id !== rideId));
    setActiveRide(data as Ride);
  }

  async function startTrip(rideId: string) {
    const { data, error } = await supabase
      .from("rides")
      .update({ status: "in_progress" })
      .eq("id", rideId)
      .eq("status", "accepted")
      .select()
      .single();

    if (error || !data) {
      toast.error("Couldn't start the trip.");
      return;
    }

    toast.success("Trip started");
    setActiveRide(data as Ride);
  }

  async function completeTrip(rideId: string) {
    const { data, error } = await supabase
      .from("rides")
      .update({ status: "completed" })
      .eq("id", rideId)
      .eq("status", "in_progress")
      .select()
      .single();

    if (error || !data) {
      toast.error("Couldn't complete the trip.");
      return;
    }

    toast.success("Trip completed");
    setActiveRide(null);
  }

  async function saveRates() {
    if (!profile) return;
    setSavingRates(true);

    const { data, error } = await supabase
      .from("drivers")
      .update({
        hourly_rate: rateForm.hourly_rate ? Number(rateForm.hourly_rate) : null,
        price_per_km: rateForm.price_per_km ? Number(rateForm.price_per_km) : null,
      })
      .eq("id", profile.id)
      .select()
      .single();

    setSavingRates(false);

    if (error || !data) {
      toast.error("Couldn't save rates.");
      return;
    }

    setProfile(data as DriverProfile);
    setEditingRates(false);
    toast.success("Rates updated");
  }

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        Please log in as a driver.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold">Driver Dashboard</h1>
      <p className="text-muted-foreground">Welcome back, {profile.full_name ?? "Driver"} 🚖</p>

      {/* Driver Profile */}
      <div className="mt-8 rounded-xl border p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-semibold">{profile.full_name ?? "—"}</h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" /> {profile.phone ?? "No phone on file"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile.car_model ?? "No car model"} • {profile.plate_number ?? "No plate"}
            </p>
          </div>
          <Switch checked={online} onCheckedChange={toggleStatus} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {online ? "You are online and ready for rides" : "You are offline"}
        </p>

        {/* Rates */}
        <div className="mt-4 border-t pt-4">
          {!editingRates ? (
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p>
                  <span className="text-muted-foreground">Hourly rate:</span>{" "}
                  {profile.hourly_rate != null ? `₦${Number(profile.hourly_rate).toLocaleString()}` : "Not set"}
                </p>
                <p>
                  <span className="text-muted-foreground">Price per km:</span>{" "}
                  {profile.price_per_km != null ? `₦${Number(profile.price_per_km).toLocaleString()}` : "Not set"}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditingRates(true)}>
                <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Hourly Rate (₦)"
                value={rateForm.hourly_rate}
                onChange={(e) => setRateForm({ ...rateForm, hourly_rate: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Price per KM (₦)"
                value={rateForm.price_per_km}
                onChange={(e) => setRateForm({ ...rateForm, price_per_km: e.target.value })}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={saveRates} disabled={savingRates}>
                  {savingRates ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><Check className="mr-1 h-3.5 w-3.5" /> Save</>}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditingRates(false)}>
                  <X className="mr-1 h-3.5 w-3.5" /> Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border p-5">
          <DollarSign className="mb-3 text-green-500" />
          <p className="text-sm text-muted-foreground">Today's Earnings</p>
          <h2 className="text-2xl font-bold">₦0</h2>
        </div>

        <div className="rounded-xl border p-5">
          <Car className="mb-3 text-blue-500" />
          <p className="text-sm text-muted-foreground">Trips Today</p>
          <h2 className="text-2xl font-bold">0</h2>
        </div>

        <div className="rounded-xl border p-5">
          <Clock3 className="mb-3 text-orange-500" />
          <p className="text-sm text-muted-foreground">Hours Online</p>
          <h2 className="text-2xl font-bold">0 hrs</h2>
        </div>

        <div className="rounded-xl border p-5">
          <Star className="mb-3 text-yellow-500" />
          <p className="text-sm text-muted-foreground">Rating</p>
          <h2 className="text-2xl font-bold">5.0</h2>
        </div>
      </div>

      {/* Active Ride — accepted or in progress */}
      {activeRide && (
        <div className="mt-10">
          <h2 className="mb-5 text-2xl font-bold">Your Active Ride</h2>
          <div className="rounded-xl border p-5">
            <p>
              <strong>Pickup:</strong> {activeRide.pickup_address}
            </p>
            <p>
              <strong>Destination:</strong> {activeRide.destination_address}
            </p>
            <p className="font-bold text-green-600">
              ₦{Number(activeRide.price).toLocaleString()}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
              Status: {activeRide.status}
            </p>

            <div className="mt-4 flex gap-3">
              {activeRide.status === "accepted" && (
                <Button onClick={() => startTrip(activeRide.id)}>Start Trip</Button>
              )}
              {activeRide.status === "in_progress" && (
                <Button onClick={() => completeTrip(activeRide.id)}>Complete Trip</Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Incoming Ride Requests */}
      <div className="mt-10">
        <h2 className="mb-5 text-2xl font-bold">Incoming Ride Requests</h2>

        <div className="space-y-4">
          {rides.length === 0 ? (
            <div className="rounded-xl border p-6 text-center">
              No ride requests available.
            </div>
          ) : (
            rides.map((ride) => (
              <div
                key={ride.id}
                className="flex items-center justify-between rounded-xl border p-5"
              >
                <div>
                  <p>
                    <strong>Pickup:</strong> {ride.pickup_address}
                  </p>
                  <p>
                    <strong>Destination:</strong> {ride.destination_address}
                  </p>
                  <p className="font-bold text-green-600">
                    ₦{Number(ride.price).toLocaleString()}
                  </p>
                </div>
                <Button onClick={() => acceptRide(ride.id)} disabled={!!activeRide}>
                  Accept Ride
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}