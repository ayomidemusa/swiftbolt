import { n as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-F__N42p1.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as Car, O as Ban, T as CircleCheck, b as LoaderCircle, i as Users, k as Activity, l as Shield, o as Trash2, x as DollarSign } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DDMi609T.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminPage() {
	const [checkingAccess, setCheckingAccess] = (0, import_react.useState)(true);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	const [drivers, setDrivers] = (0, import_react.useState)([]);
	const [rides, setRides] = (0, import_react.useState)([]);
	const [loadingData, setLoadingData] = (0, import_react.useState)(true);
	const [confirmDeleteId, setConfirmDeleteId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				setCheckingAccess(false);
				return;
			}
			const { data } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
			setIsAdmin(!!data);
			setCheckingAccess(false);
		})();
	}, []);
	(0, import_react.useEffect)(() => {
		if (!isAdmin) return;
		loadDrivers();
		loadRides();
		const channel = supabase.channel("admin-activity").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "rides"
		}, () => loadRides()).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "drivers"
		}, () => loadDrivers()).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [isAdmin]);
	async function loadDrivers() {
		const { data, error } = await supabase.from("drivers").select("*").order("created_at", { ascending: false });
		if (!error && data) setDrivers(data);
		setLoadingData(false);
	}
	async function loadRides() {
		const { data, error } = await supabase.from("rides").select("*").order("created_at", { ascending: false }).limit(50);
		if (!error && data) setRides(data);
	}
	async function toggleBan(driver) {
		const nextBanned = !driver.is_banned;
		const { error } = await supabase.from("drivers").update({
			is_banned: nextBanned,
			status: nextBanned ? "offline" : driver.status
		}).eq("id", driver.id);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success(nextBanned ? "Driver banned" : "Driver unbanned");
		loadDrivers();
	}
	async function deleteDriver(driverId) {
		const { error } = await supabase.from("drivers").delete().eq("id", driverId);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Driver deleted");
		setConfirmDeleteId(null);
		loadDrivers();
	}
	if (checkingAccess) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "mx-auto h-8 w-8 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-muted-foreground",
			children: "You don't have access to this page."
		})] })
	});
	const onlineCount = drivers.filter((d) => d.status === "online" && !d.is_banned).length;
	const bannedCount = drivers.filter((d) => d.is_banned).length;
	const activeRidesCount = rides.filter((r) => r.status === "accepted" || r.status === "in_progress").length;
	const totalRevenue = rides.filter((r) => r.status === "completed").reduce((sum, r) => sum + Number(r.price ?? 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: "Admin Dashboard"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Manage drivers and monitor app activity."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mb-3 text-blue-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Drivers Online"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold",
								children: onlineCount
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "mb-3 text-red-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Banned Drivers"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold",
								children: bannedCount
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "mb-3 text-orange-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Active Rides"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold",
								children: activeRidesCount
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "mb-3 text-green-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Revenue (last 50 rides)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-2xl font-bold",
								children: ["₦", totalRevenue.toLocaleString()]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-5 text-2xl font-bold",
					children: "Drivers"
				}), loadingData ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Loading…"]
				}) : drivers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border p-6 text-center text-muted-foreground",
					children: "No drivers registered yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: drivers.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `flex items-center justify-between rounded-xl border p-5 ${d.is_banned ? "border-red-300 bg-red-50" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold",
								children: [
									d.full_name ?? "Unnamed driver",
									" ",
									d.is_banned && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium uppercase text-red-700",
										children: "Banned"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									d.phone ?? "No phone",
									" • ",
									d.car_model ?? "No car",
									" • ",
									d.plate_number ?? "No plate"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs uppercase tracking-wide text-muted-foreground",
								children: ["Status: ", d.status]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: d.is_banned ? "default" : "outline",
								onClick: () => toggleBan(d),
								children: d.is_banned ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 h-3.5 w-3.5" }), " Unban"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "mr-1 h-3.5 w-3.5" }), " Ban"] })
							}), confirmDeleteId === d.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "destructive",
									onClick: () => deleteDriver(d.id),
									children: "Confirm delete"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setConfirmDeleteId(null),
									children: "Cancel"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => setConfirmDeleteId(d.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1 h-3.5 w-3.5" }), " Delete"]
							})]
						})]
					}, d.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-5 text-2xl font-bold",
					children: "Recent Ride Activity"
				}), rides.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border p-6 text-center text-muted-foreground",
					children: "No rides yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: rides.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm",
								children: [
									r.pickup_address,
									" → ",
									r.destination_address
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									new Date(r.created_at).toLocaleString(),
									" • ",
									r.car_class
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-semibold",
								children: ["₦", Number(r.price).toLocaleString()]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-wide text-primary",
								children: r.status
							})]
						})]
					}, r.id))
				})]
			})
		]
	});
}
//#endregion
export { AdminPage as component };
