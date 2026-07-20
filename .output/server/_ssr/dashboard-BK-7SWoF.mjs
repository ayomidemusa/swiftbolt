import { n as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-F__N42p1.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { P as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as Clock3, O as LoaderCircle, T as Car, b as DollarSign, d as Phone, f as Pencil, n as X, s as Star, w as Check } from "../_libs/lucide-react.mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/@radix-ui/react-switch+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-BK-7SWoF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Switch = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
	className: cn("peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input", className),
	...props,
	ref,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: cn("pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0") })
}));
Switch.displayName = Switch$1.displayName;
function DriverDashboard() {
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [online, setOnline] = (0, import_react.useState)(false);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [rides, setRides] = (0, import_react.useState)([]);
	const [activeRide, setActiveRide] = (0, import_react.useState)(null);
	const [editingRates, setEditingRates] = (0, import_react.useState)(false);
	const [rateForm, setRateForm] = (0, import_react.useState)({
		hourly_rate: "",
		price_per_km: ""
	});
	const [savingRates, setSavingRates] = (0, import_react.useState)(false);
	const driverId = profile?.id ?? null;
	(0, import_react.useEffect)(() => {
		loadProfile();
		async function loadProfile() {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				setLoading(false);
				return;
			}
			const { data, error } = await supabase.from("drivers").select("id, full_name, phone, car_model, plate_number, status, hourly_rate, price_per_km").eq("user_id", user.id).maybeSingle();
			if (error) {
				toast.error(error.message);
				setLoading(false);
				return;
			}
			if (!data) {
				navigate({ to: "/driver-register" });
				return;
			}
			setProfile(data);
			setOnline(data.status === "online");
			setRateForm({
				hourly_rate: data.hourly_rate?.toString() ?? "",
				price_per_km: data.price_per_km?.toString() ?? ""
			});
			setLoading(false);
		}
	}, [navigate]);
	(0, import_react.useEffect)(() => {
		if (!driverId) return;
		loadPendingRides();
		loadActiveRide();
		const channel = supabase.channel("driver-rides").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "rides"
		}, () => {
			loadPendingRides();
			loadActiveRide();
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [driverId]);
	async function loadPendingRides() {
		const { data, error } = await supabase.from("rides").select("*").eq("status", "pending").order("created_at", { ascending: false });
		if (!error && data) setRides(data);
	}
	async function loadActiveRide() {
		if (!driverId) return;
		const { data, error } = await supabase.from("rides").select("*").eq("driver_id", driverId).in("status", ["accepted", "in_progress"]).order("created_at", { ascending: false }).limit(1).maybeSingle();
		if (!error) setActiveRide(data ?? null);
	}
	async function toggleStatus(value) {
		if (!profile) return;
		setOnline(value);
		await supabase.from("drivers").update({ status: value ? "online" : "offline" }).eq("id", profile.id);
	}
	async function acceptRide(rideId) {
		if (!driverId) return;
		if (activeRide) {
			toast.error("Finish your current ride before accepting another.");
			return;
		}
		const { data, error } = await supabase.from("rides").update({
			status: "accepted",
			driver_id: driverId
		}).eq("id", rideId).eq("status", "pending").select().single();
		if (error || !data) {
			toast.error("This ride was just taken by another driver.");
			loadPendingRides();
			return;
		}
		toast.success("Ride accepted");
		setRides((prev) => prev.filter((r) => r.id !== rideId));
		setActiveRide(data);
	}
	async function startTrip(rideId) {
		const { data, error } = await supabase.from("rides").update({ status: "in_progress" }).eq("id", rideId).eq("status", "accepted").select().single();
		if (error || !data) {
			toast.error("Couldn't start the trip.");
			return;
		}
		toast.success("Trip started");
		setActiveRide(data);
	}
	async function completeTrip(rideId) {
		const { data, error } = await supabase.from("rides").update({ status: "completed" }).eq("id", rideId).eq("status", "in_progress").select().single();
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
		const { data, error } = await supabase.from("drivers").update({
			hourly_rate: rateForm.hourly_rate ? Number(rateForm.hourly_rate) : null,
			price_per_km: rateForm.price_per_km ? Number(rateForm.price_per_km) : null
		}).eq("id", profile.id).select().single();
		setSavingRates(false);
		if (error || !data) {
			toast.error("Couldn't save rates.");
			return;
		}
		setProfile(data);
		setEditingRates(false);
		toast.success("Rates updated");
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	if (!profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center text-muted-foreground",
		children: "Please log in as a driver."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: "Driver Dashboard"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-muted-foreground",
				children: [
					"Welcome back, ",
					profile.full_name ?? "Driver",
					" 🚖"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-xl border p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-semibold",
								children: profile.full_name ?? "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 flex items-center gap-1.5 text-sm text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5" }),
									" ",
									profile.phone ?? "No phone on file"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: [
									profile.car_model ?? "No car model",
									" • ",
									profile.plate_number ?? "No plate"
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: online,
							onCheckedChange: toggleStatus
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: online ? "You are online and ready for rides" : "You are offline"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 border-t pt-4",
						children: !editingRates ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Hourly rate:"
									}),
									" ",
									profile.hourly_rate != null ? `₦${Number(profile.hourly_rate).toLocaleString()}` : "Not set"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Price per km:"
									}),
									" ",
									profile.price_per_km != null ? `₦${Number(profile.price_per_km).toLocaleString()}` : "Not set"
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setEditingRates(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-1 h-3.5 w-3.5" }), " Edit"]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									placeholder: "Hourly Rate (₦)",
									value: rateForm.hourly_rate,
									onChange: (e) => setRateForm({
										...rateForm,
										hourly_rate: e.target.value
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									placeholder: "Price per KM (₦)",
									value: rateForm.price_per_km,
									onChange: (e) => setRateForm({
										...rateForm,
										price_per_km: e.target.value
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										onClick: saveRates,
										disabled: savingRates,
										children: savingRates ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1 h-3.5 w-3.5" }), " Save"] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => setEditingRates(false),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mr-1 h-3.5 w-3.5" }), " Cancel"]
									})]
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "mb-3 text-green-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Today's Earnings"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold",
								children: "₦0"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, { className: "mb-3 text-blue-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Trips Today"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold",
								children: "0"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "mb-3 text-orange-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Hours Online"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold",
								children: "0 hrs"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "mb-3 text-yellow-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Rating"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-bold",
								children: "5.0"
							})
						]
					})
				]
			}),
			activeRide && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-5 text-2xl font-bold",
					children: "Your Active Ride"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Pickup:" }),
							" ",
							activeRide.pickup_address
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Destination:" }),
							" ",
							activeRide.destination_address
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-bold text-green-600",
							children: ["₦", Number(activeRide.price).toLocaleString()]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs uppercase tracking-wide text-muted-foreground",
							children: ["Status: ", activeRide.status]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-3",
							children: [activeRide.status === "accepted" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => startTrip(activeRide.id),
								children: "Start Trip"
							}), activeRide.status === "in_progress" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => completeTrip(activeRide.id),
								children: "Complete Trip"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-5 text-2xl font-bold",
					children: "Incoming Ride Requests"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: rides.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border p-6 text-center",
						children: "No ride requests available."
					}) : rides.map((ride) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Pickup:" }),
								" ",
								ride.pickup_address
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Destination:" }),
								" ",
								ride.destination_address
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-bold text-green-600",
								children: ["₦", Number(ride.price).toLocaleString()]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => acceptRide(ride.id),
							disabled: !!activeRide,
							children: "Accept Ride"
						})]
					}, ride.id))
				})]
			})
		]
	});
}
//#endregion
export { DriverDashboard as component };
