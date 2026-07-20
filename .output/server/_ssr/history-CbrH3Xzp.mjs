import { t as supabase } from "./client-F__N42p1.mjs";
import { P as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { S as Clock, T as Car, g as MapPin } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5kbQcWh.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history-CbrH3Xzp.js
var import_jsx_runtime = require_jsx_runtime();
function HistoryPage() {
	const { data, isLoading } = useQuery({
		queryKey: ["rides"],
		queryFn: async () => {
			const { data, error } = await supabase.from("rides").select("*").order("created_at", { ascending: false }).limit(50);
			if (error) throw error;
			return data;
		}
	});
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		active: "history",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 overflow-auto pt-20 pb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-md px-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold tracking-tight",
						children: "Your rides"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "A history of every trip you've booked."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 space-y-3",
						children: [
							isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Loading…"
							}),
							data?.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-dashed border-border p-8 text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, { className: "mx-auto h-8 w-8 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm text-muted-foreground",
									children: "No rides yet. Book your first ride from the Ride tab."
								})]
							}),
							data?.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-surface border border-border p-4 cursor-pointer",
								onClick: () => {
									if (r.status !== "completed") navigate({
										to: "/track/$rideId",
										params: { rideId: r.id }
									});
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
												" ",
												new Date(r.created_at).toLocaleString()
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-primary/15 px-2 py-0.5 font-medium uppercase tracking-wide text-primary",
											children: r.car_class
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start gap-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-1.5 h-2 w-2 rounded-full bg-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm",
													children: r.pickup_address
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ml-[3px] h-3 w-px bg-border" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start gap-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-1.5 h-2 w-2 rounded-sm bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm",
													children: r.destination_address
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex items-center justify-between border-t border-border pt-3 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5 text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5" }),
												" ",
												r.distance_km,
												" km · ",
												r.duration_min,
												" min"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-semibold",
												children: ["₦", Number(r.price).toLocaleString()]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-primary uppercase",
												children: r.status
											})]
										})]
									})
								]
							}, r.id))
						]
					})
				]
			})
		})
	});
}
//#endregion
export { HistoryPage as component };
