import { Link, useRouter } from "@tanstack/react-router";
import { MapPin, Clock, User, Zap, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function AppShell({ children, active }: { children: React.ReactNode; active: "book" | "history" | "account" }) {
  const router = useRouter();
  async function signOut() {
    await supabase.auth.signOut();
    router.navigate({ to: "/auth", replace: true });
  }
  return (
    <div className="relative flex h-[100dvh] flex-col bg-background overflow-hidden">
      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between p-4 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-surface/90 backdrop-blur px-3 py-2 shadow-pill border border-border">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-semibold tracking-tight">Swift</span>
        </div>
        <button onClick={signOut} className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-surface/90 backdrop-blur shadow-pill border border-border text-muted-foreground hover:text-foreground">
          <LogOut className="h-4 w-4" />
        </button>
      </header>
      <main className="relative flex-1 overflow-hidden">{children}</main>
      <nav className="z-20 grid grid-cols-3 border-t border-border bg-surface/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <NavItem to="/book" label="Ride" icon={MapPin} active={active === "book"} />
        <NavItem to="/history" label="History" icon={Clock} active={active === "history"} />
        <NavItem to="/account" label="Account" icon={User} active={active === "account"} />
      </nav>
    </div>
  );
}

function NavItem({ to, label, icon: Icon, active }: { to: string; label: string; icon: any; active: boolean }) {
  return (
    <Link to={to} className={`flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
      <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
      {label}
    </Link>
  );
}
