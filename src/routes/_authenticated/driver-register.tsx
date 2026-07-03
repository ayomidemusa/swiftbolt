import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/driver-register")({
  component: DriverRegisterPage,
});

function DriverRegisterPage() {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    car_model: "",
    plate_number: "",
  });

  async function registerDriver() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please login first");
      return;
    }

    const { error } = await supabase
      .from("drivers")
      .insert({
        user_id: user.id,
        full_name: form.full_name,
        phone: form.phone,
        car_model: form.car_model,
        plate_number: form.plate_number,
        status: "offline",
      });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Driver registration successful!");
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">
        Driver Registration
      </h1>

      <div className="space-y-4">

        <Input
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) =>
            setForm({
              ...form,
              full_name: e.target.value,
            })
          }
        />

        <Input
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value,
            })
          }
        />

        <Input
          placeholder="Car Model"
          value={form.car_model}
          onChange={(e) =>
            setForm({
              ...form,
              car_model: e.target.value,
            })
          }
        />

        <Input
          placeholder="Plate Number"
          value={form.plate_number}
          onChange={(e) =>
            setForm({
              ...form,
              plate_number: e.target.value,
            })
          }
        />

        <Button
          onClick={registerDriver}
          className="w-full"
        >
          Register Driver
        </Button>

      </div>
    </div>
  );
}