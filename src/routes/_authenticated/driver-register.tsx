import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/driver-register")({
  component: DriverRegisterPage,
});

function DriverRegisterPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    car_model: "",
    plate_number: "",
    hourly_rate: "",
    price_per_km: "",
  });

  // If this user already has a driver row, skip straight to the dashboard
  // instead of letting them create a second (duplicate) row.
  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please login first");
        setChecking(false);
        return;
      }

      const { data } = await supabase
        .from("drivers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        navigate({ to: "/driver/dashboard" });
        return;
      }

      setChecking(false);
    })();
  }, [navigate]);

  async function registerDriver() {
    if (!form.full_name.trim()) {
      toast.error("Full name is required");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please login first");
      setSaving(false);
      return;
    }

    // upsert on user_id: if a row somehow already exists, update it
    // instead of throwing a duplicate-key error.
    const { error } = await supabase
      .from("drivers")
      .upsert(
        {
          user_id: user.id,
          full_name: form.full_name,
          phone: form.phone || null,
          car_model: form.car_model || null,
          plate_number: form.plate_number || null,
          hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
          price_per_km: form.price_per_km ? Number(form.price_per_km) : null,
          status: "offline",
        },
        { onConflict: "user_id" }
      );

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Driver registration successful!");
    navigate({ to: "/driver/dashboard" });
  }

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Driver Registration</h1>

      <div className="space-y-4">
        <Input
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        />

        <Input
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <Input
          placeholder="Car Model"
          value={form.car_model}
          onChange={(e) => setForm({ ...form, car_model: e.target.value })}
        />

        <Input
          placeholder="Plate Number"
          value={form.plate_number}
          onChange={(e) => setForm({ ...form, plate_number: e.target.value })}
        />

        <Input
          type="number"
          placeholder="Hourly Rate (₦)"
          value={form.hourly_rate}
          onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })}
        />

        <Input
          type="number"
          placeholder="Price per KM (₦)"
          value={form.price_per_km}
          onChange={(e) => setForm({ ...form, price_per_km: e.target.value })}
        />

        <Button onClick={registerDriver} disabled={saving} className="w-full">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register Driver"}
        </Button>
      </div>
    </div>
  );
}