import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Loader2,
  Shield,
  Ban,
  CheckCircle2,
  Trash2,
  Car,
  Users,
  Activity,
  DollarSign,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

type Driver = {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  car_model: string | null;
  plate_number: string | null;
  status: string;
  is_banned: boolean;
  hourly_rate: number | null;
  price_per_km: number | null;
  created_at: string;
};

type Ride = {
  id: string;
  pickup_address: string;
  destination_address: string;
  price: number;
  status: string;
  car_class: string;
  driver_id: string | null;
  created_at: string;
};

function AdminPage() {
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Verify the logged-in user is actually an admin before showing anything
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setCheckingAccess(false);
        return;
      }

      const { data } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      setIsAdmin(!!data);
      setCheckingAccess(false);
    })();
  }, []);

  // Load drivers + recent rides, then keep both live via realtime
  useEffect(() => {
    if (!isAdmin) return;

    loadDrivers();
    loadRides();

    const channel = supabase
      .channel("admin-activity")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rides" },
        () => loadRides()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "drivers" },
        () => loadDrivers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  async function loadDrivers() {
    const { data, error } = await supabase
      .from("drivers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setDrivers(data as Driver[]);
    setLoadingData(false);
  }

  async function loadRides() {
    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) setRides(data as Ride[]);
  }

  async function toggleBan(driver: Driver) {
    const nextBanned = !driver.is_banned;

    const { error } = await supabase
      .from("drivers")
      .update({
        is_banned: nextBanned,
        // A banned driver shouldn't stay visible to riders as online
        status: nextBanned ? "offline" : driver.status,
      })
      .eq("id", driver.id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(nextBanned ? "Driver banned" : "Driver unbanned");
    loadDrivers();
  }

  async function deleteDriver(driverId: string) {
    const { error } = await supabase.from("drivers").delete().eq("id", driverId);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Driver deleted");
    setConfirmDeleteId(null);
    loadDrivers();
  }

  if (checkingAccess) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center text-center">
        <div>
          <Shield className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">You don't have access to this page.</p>
        </div>
      </div>
    );
  }

  const onlineCount = drivers.filter((d) => d.status === "online" && !d.is_banned).length;
  const bannedCount = drivers.filter((d) => d.is_banned).length;
  const activeRidesCount = rides.filter((r) => r.status === "accepted" || r.status === "in_progress").length;
  const totalRevenue = rides
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + Number(r.price ?? 0), 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">Manage drivers and monitor app activity.</p>

      {/* Stats */}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border p-5">
          <Users className="mb-3 text-blue-500" />
          <p className="text-sm text-muted-foreground">Drivers Online</p>
          <h2 className="text-2xl font-bold">{onlineCount}</h2>
        </div>
        <div className="rounded-xl border p-5">
          <Ban className="mb-3 text-red-500" />
          <p className="text-sm text-muted-foreground">Banned Drivers</p>
          <h2 className="text-2xl font-bold">{bannedCount}</h2>
        </div>
        <div className="rounded-xl border p-5">
          <Activity className="mb-3 text-orange-500" />
          <p className="text-sm text-muted-foreground">Active Rides</p>
          <h2 className="text-2xl font-bold">{activeRidesCount}</h2>
        </div>
        <div className="rounded-xl border p-5">
          <DollarSign className="mb-3 text-green-500" />
          <p className="text-sm text-muted-foreground">Revenue (last 50 rides)</p>
          <h2 className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</h2>
        </div>
      </div>

      {/* Drivers */}
      <div className="mt-10">
        <h2 className="mb-5 text-2xl font-bold">Drivers</h2>

        {loadingData ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : drivers.length === 0 ? (
          <div className="rounded-xl border p-6 text-center text-muted-foreground">
            No drivers registered yet.
          </div>
        ) : (
          <div className="space-y-3">
            {drivers.map((d) => (
              <div
                key={d.id}
                className={`flex items-center justify-between rounded-xl border p-5 ${
                  d.is_banned ? "border-red-300 bg-red-50" : ""
                }`}
              >
                <div>
                  <p className="font-semibold">
                    {d.full_name ?? "Unnamed driver"}{" "}
                    {d.is_banned && (
                      <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium uppercase text-red-700">
                        Banned
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {d.phone ?? "No phone"} • {d.car_model ?? "No car"} • {d.plate_number ?? "No plate"}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                    Status: {d.status}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={d.is_banned ? "default" : "outline"}
                    onClick={() => toggleBan(d)}
                  >
                    {d.is_banned ? (
                      <>
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Unban
                      </>
                    ) : (
                      <>
                        <Ban className="mr-1 h-3.5 w-3.5" /> Ban
                      </>
                    )}
                  </Button>

                  {confirmDeleteId === d.id ? (
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive" onClick={() => deleteDriver(d.id)}>
                        Confirm delete
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setConfirmDeleteId(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setConfirmDeleteId(d.id)}>
                      <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity feed */}
      <div className="mt-10">
        <h2 className="mb-5 text-2xl font-bold">Recent Ride Activity</h2>

        {rides.length === 0 ? (
          <div className="rounded-xl border p-6 text-center text-muted-foreground">
            No rides yet.
          </div>
        ) : (
          <div className="space-y-3">
            {rides.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <Car className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm">
                      {r.pickup_address} → {r.destination_address}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString()} • {r.car_class}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">₦{Number(r.price).toLocaleString()}</p>
                  <p className="text-xs uppercase tracking-wide text-primary">{r.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}