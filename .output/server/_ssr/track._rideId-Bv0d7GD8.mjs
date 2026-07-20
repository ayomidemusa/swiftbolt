import { n as __toESM } from "../_runtime.mjs";
import { c as performance_default } from "../_libs/h3+rou3+srvx+unenv.mjs";
import { t as supabase } from "./client-F__N42p1.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { P as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { O as LoaderCircle, T as Car, d as Phone, h as MessageSquare, l as Shield, u as Search } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5kbQcWh.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as ensureNotificationPermission, r as pushNotify, t as RideMap } from "./notifications-C7Po_pgf.mjs";
import { t as Route } from "./track._rideId-CiCKYor-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/track._rideId-Bv0d7GD8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function getRoute(startLat, startLng, endLat, endLng) {
	const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
	const data = await (await fetch(url)).json();
	if (!data.routes?.length) return [];
	return data.routes[0].geometry.coordinates.map(([lng, lat]) => ({
		lat,
		lng
	}));
}
var SPEED_KMH = 45;
function interp(a, b, t) {
	return {
		lat: a.lat + (b.lat - a.lat) * t,
		lng: a.lng + (b.lng - a.lng) * t
	};
}
function distKm(a, b) {
	const R = 6371, toRad = (d) => d * Math.PI / 180;
	const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(h));
}
function TrackPage() {
	const { rideId } = Route.useParams();
	const navigate = useNavigate();
	const [route, setRoute] = (0, import_react.useState)([]);
	const [ride, setRide] = (0, import_react.useState)(null);
	const [driver, setDriver] = (0, import_react.useState)(null);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const notifiedRef = (0, import_react.useRef)({
		accepted: false,
		started: false,
		completed: false
	});
	(0, import_react.useEffect)(() => {
		ensureNotificationPermission();
	}, []);
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data, error } = await supabase.from("rides").select("*").eq("id", rideId).maybeSingle();
			if (error || !data) {
				toast.error("Ride not found");
				navigate({ to: "/history" });
				return;
			}
			setRide(data);
		})();
	}, [rideId, navigate]);
	(0, import_react.useEffect)(() => {
		if (!rideId) return;
		const channel = supabase.channel(`ride-${rideId}`).on("postgres_changes", {
			event: "UPDATE",
			schema: "public",
			table: "rides",
			filter: `id=eq.${rideId}`
		}, (payload) => {
			setRide(payload.new);
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [rideId]);
	(0, import_react.useEffect)(() => {
		if (!ride?.driver_id) {
			setDriver(null);
			return;
		}
		(async () => {
			const { data } = await supabase.from("drivers").select("id, full_name, vehicle_model, vehicle_plate").eq("id", ride.driver_id).maybeSingle();
			setDriver(data ?? null);
		})();
	}, [ride?.driver_id]);
	(0, import_react.useEffect)(() => {
		if (!ride) return;
		if (ride.status === "accepted" && !notifiedRef.current.accepted) {
			notifiedRef.current.accepted = true;
			toast.success("A driver accepted your ride");
			pushNotify("Swift", "A driver is on the way to pick you up");
		}
		if (ride.status === "in_progress" && !notifiedRef.current.started) {
			notifiedRef.current.started = true;
			toast.success("Trip started");
			pushNotify("Swift", "Trip started — enjoy your ride");
		}
		if (ride.status === "completed" && !notifiedRef.current.completed) {
			notifiedRef.current.completed = true;
			toast.success("You have arrived at your destination");
			pushNotify("Swift", `Arrived — total ₦${Number(ride.price).toLocaleString()}`);
		}
	}, [ride?.status]);
	(0, import_react.useEffect)(() => {
		if (!ride) return;
		const loadRoute = async () => {
			try {
				setRoute(await getRoute(ride.pickup_lat, ride.pickup_lng, ride.destination_lat, ride.destination_lng));
			} catch (error) {
				console.log("OSRM ERROR:", error);
			}
		};
		loadRoute();
	}, [ride]);
	const driverStart = (0, import_react.useMemo)(() => {
		if (!ride) return null;
		const a = (ride.id.charCodeAt(0) + ride.id.charCodeAt(2)) % 360 * (Math.PI / 180);
		return {
			lat: ride.pickup_lat + Math.cos(a) * .013,
			lng: ride.pickup_lng + Math.sin(a) * .013
		};
	}, [ride]);
	(0, import_react.useEffect)(() => {
		if (!ride || !driverStart) return;
		if (ride.status !== "accepted" && ride.status !== "in_progress") return;
		ride.pickup_lat, ride.pickup_lng;
		ride.destination_lat, ride.destination_lng;
		const durationMs = ride.status === "accepted" ? 2e4 : 3e4;
		const start = performance_default.now();
		let raf = 0;
		const tick = (t) => {
			const p = Math.min(1, (t - start) / durationMs);
			setProgress(p);
			if (p < 1) raf = requestAnimationFrame(tick);
		};
		setProgress(0);
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [
		ride?.status,
		ride,
		driverStart
	]);
	if (!ride) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		active: "book",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid h-full place-items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		})
	});
	const pickup = {
		lat: ride.pickup_lat,
		lng: ride.pickup_lng
	};
	const dest = {
		lat: ride.destination_lat,
		lng: ride.destination_lng
	};
	if (ride.status === "pending") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		active: "book",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RideMap, {
			center: pickup,
			pickup,
			destination: dest,
			drivers: [],
			route
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-x-0 bottom-0 z-10 rounded-t-3xl border-t border-border bg-surface shadow-sheet",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-2 h-1 w-10 rounded-full bg-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 pt-3 pb-6 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary/15 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5 animate-pulse" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-lg font-semibold",
						children: "Searching for a nearby driver…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "This can take a moment. We'll notify you the instant a driver accepts."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-lg font-semibold",
						children: ["₦", Number(ride.price).toLocaleString()]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => navigate({ to: "/history" }),
						variant: "outline",
						className: "mt-4 h-11 w-full rounded-2xl",
						children: "Cancel and go back"
					})
				]
			})]
		})]
	});
	const driverPos = ride.status === "accepted" && driverStart ? interp(driverStart, pickup, progress) : ride.status === "in_progress" ? interp(pickup, dest, progress) : dest;
	const remainingKm = ride.status === "accepted" ? distKm(driverPos, pickup) : distKm(driverPos, dest);
	const etaMin = Math.max(1, Math.round(remainingKm / SPEED_KMH * 60 * (ride.status === "accepted" ? .4 : 1)));
	const statusLabel = ride.status === "accepted" ? `Driver arriving in ~${etaMin} min` : ride.status === "in_progress" ? `On the way • ~${etaMin} min to destination` : "Trip complete";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		active: "book",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RideMap, {
			center: driverPos,
			pickup,
			destination: dest,
			drivers: [driverPos],
			route
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-x-0 bottom-0 z-10 rounded-t-3xl border-t border-border bg-surface shadow-sheet",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-2 h-1 w-10 rounded-full bg-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 pt-3 pb-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs uppercase tracking-wide text-muted-foreground",
							children: ride.status === "completed" ? "Completed" : "Live tracking"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: statusLabel
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Fare"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-lg font-semibold",
								children: ["₦", Number(ride.price).toLocaleString()]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-primary transition-[width] duration-200",
							style: { width: `${Math.round(progress * 100)}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center gap-3 rounded-2xl bg-surface-elevated p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-11 w-11 place-items-center rounded-full bg-primary/15 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: driver?.full_name ?? "Your driver"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										driver?.vehicle_plate ?? "—",
										" • ",
										driver?.vehicle_model ?? ride.car_class
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "grid h-10 w-10 place-items-center rounded-full bg-surface text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center gap-2 rounded-2xl bg-surface-elevated p-3 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 text-primary" }), "Trip is being tracked. Share your ETA with a trusted contact."]
					}),
					ride.status === "completed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => navigate({ to: "/history" }),
						className: "mt-4 h-12 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90",
						children: "Done"
					})
				]
			})]
		})]
	});
}
//#endregion
export { TrackPage as component };
