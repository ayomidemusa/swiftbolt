import { t as supabase } from "./client-F__N42p1.mjs";
import { F as useRouter, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { a as User, h as LogOut, p as MapPin, t as Zap, v as Clock } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AppShell-D5kbQcWh.js
var import_jsx_runtime = require_jsx_runtime();
function AppShell({ children, active }) {
	const router = useRouter();
	async function signOut() {
		await supabase.auth.signOut();
		router.navigate({
			to: "/auth",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-[100dvh] flex-col bg-background overflow-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "absolute left-0 right-0 top-0 z-20 flex items-center justify-between p-4 pointer-events-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto flex items-center gap-2 rounded-full bg-surface/90 backdrop-blur px-3 py-2 shadow-pill border border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
							className: "h-4 w-4",
							strokeWidth: 2.5
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold tracking-tight",
						children: "Swift"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: signOut,
					className: "pointer-events-auto grid h-10 w-10 place-items-center rounded-full bg-surface/90 backdrop-blur shadow-pill border border-border text-muted-foreground hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "relative flex-1 overflow-hidden",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "z-20 grid grid-cols-3 border-t border-border bg-surface/95 backdrop-blur pb-[env(safe-area-inset-bottom)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
						to: "/book",
						label: "Ride",
						icon: MapPin,
						active: active === "book"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
						to: "/history",
						label: "History",
						icon: Clock,
						active: active === "history"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
						to: "/account",
						label: "Account",
						icon: User,
						active: active === "account"
					})
				]
			})
		]
	});
}
function NavItem({ to, label, icon: Icon, active }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: `flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${active ? "text-primary" : "text-muted-foreground"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "h-5 w-5",
			strokeWidth: active ? 2.5 : 2
		}), label]
	});
}
//#endregion
export { AppShell as t };
