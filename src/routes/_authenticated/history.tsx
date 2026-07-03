import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { Clock, MapPin, Car } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["rides"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rides")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });
  const navigate = useNavigate();

  return (
    <AppShell active="history">
      <div className="absolute inset-0 overflow-auto pt-20 pb-6">
        <div className="mx-auto max-w-md px-5">
          <h1 className="text-2xl font-bold tracking-tight">Your rides</h1>
          <p className="mt-1 text-sm text-muted-foreground">A history of every trip you've booked.</p>

          <div className="mt-5 space-y-3">
            {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {data?.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                <Car className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">No rides yet. Book your first ride from the Ride tab.</p>
              </div>
            )}
            {data?.map((r) => (
              <div
              key={r.id}
              className="rounded-2xl bg-surface border border-border p-4 cursor-pointer"
              onClick={() => {
            
                if (r.status !== "completed") {
            
                  navigate({
                    to: "/track/$rideId",
                    params: {
                      rideId: r.id,
                    },
                  });
            
                }
            
              }}
            >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {new Date(r.created_at).toLocaleString()}</span>
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 font-medium uppercase tracking-wide text-primary">{r.car_class}</span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-1.5 h-2 w-2 rounded-full bg-foreground" />
                    <span className="text-sm">{r.pickup_address}</span>
                  </div>
                  <div className="ml-[3px] h-3 w-px bg-border" />
                  <div className="flex items-start gap-2.5">
                    <div className="mt-1.5 h-2 w-2 rounded-sm bg-primary" />
                    <span className="text-sm">{r.destination_address}</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {r.distance_km} km · {r.duration_min} min
                  </span>
                  <div className="text-right">

  <p className="font-semibold">
    ₦{Number(r.price).toLocaleString()}
  </p>

  <p className="text-xs text-primary uppercase">
    {r.status}
  </p>

</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
