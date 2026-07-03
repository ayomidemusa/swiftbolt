import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User, Mail, LogOut } from "lucide-react";

export const Route = createFileRoute("/_authenticated/account")({
  component: AccountPage,
});

function AccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      setEmail(data.user.email ?? "");
      setName((data.user.user_metadata?.full_name as string) ?? "");
    });
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    router.navigate({ to: "/auth", replace: true });
  }

  return (
    <AppShell active="account">
      <div className="absolute inset-0 overflow-auto pt-20 pb-6">
        <div className="mx-auto max-w-md px-5">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {(name || email || "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold">{name || "Rider"}</h1>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>

          <div className="mt-6 space-y-2 rounded-2xl bg-surface border border-border p-2">
            <Row icon={User} label="Name" value={name || "—"} />
            <Row icon={Mail} label="Email" value={email} />
          </div>

          <Button onClick={signOut} variant="outline" className="mt-4 h-12 w-full rounded-2xl border-border bg-surface text-destructive hover:bg-surface-elevated">
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-sm">{value}</div>
      </div>
    </div>
  );
}
