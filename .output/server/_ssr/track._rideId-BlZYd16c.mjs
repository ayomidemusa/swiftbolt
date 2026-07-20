import { n as __toESM } from "../_runtime.mjs";
import { c as performance_default } from "../_libs/h3+rou3+srvx+unenv.mjs";
import { t as supabase } from "./client-F__N42p1.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { P as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { b as LoaderCircle, f as MessageSquare, l as Phone, s as Shield, y as Car } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5kbQcWh.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as ensureNotificationPermission, r as pushNotify, t as RideMap } from "./notifications-C7Po_pgf.mjs";
import { t as Route } from "./track._rideId-FtvEU10V.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/track._rideId-BlZYd16c.js
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
	const [phase, setPhase] = (0, import_react.useState)("arriving");
	const [progress, setProgress] = (0, import_react.useState)(0);
	const notifiedRef = (0, import_react.useRef)({
		arrived: false,
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
		if (!ride) return;
		console.log("LOADING ROUTE...");
		const loadRoute = async () => {
			try {
				const points = await getRoute(ride.pickup_lat, ride.pickup_lng, ride.destination_lat, ride.destination_lng);
				console.log("ROUTE POINTS:", points);
				setRoute(points);
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
		const pickup = {
			lat: ride.pickup_lat,
			lng: ride.pickup_lng
		};
		const dest = {
			lat: ride.destination_lat,
			lng: ride.destination_lng
		};
		const legKm = phase === "arriving" ? distKm(driverStart, pickup) : distKm(pickup, dest);
		Math.max(1, legKm / SPEED_KMH * 60);
		const durationMs = phase === "arriving" ? 2e4 : 3e4;
		const start = performance_default.now();
		let raf = 0;
		const tick = (t) => {
			const p = Math.min(1, (t - start) / durationMs);
			setProgress(p);
			if (p < 1) raf = requestAnimationFrame(tick);
			else if (phase === "arriving") {
				if (!notifiedRef.current.arrived) {
					notifiedRef.current.arrived = true;
					toast.success("Your driver has arrived");
					pushNotify("Swift", "Your driver has arrived at pickup");
				}
				setTimeout(() => {
					setPhase("in_progress");
					setProgress(0);
					if (!notifiedRef.current.started) {
						notifiedRef.current.started = true;
						pushNotify("Swift", "Trip started — enjoy your ride");
					}
					supabase.from("rides").update({ status: "in_progress" }).eq("id", ride.id);
				}, 1500);
			} else if (phase === "in_progress") {
				setPhase("completed");
				if (!notifiedRef.current.completed) {
					notifiedRef.current.completed = true;
					toast.success("You have arrived at your destination");
					pushNotify("Swift", `Arrived — total $${ride.price.toFixed(2)}`);
				}
				supabase.from("rides").update({ status: "completed" }).eq("id", ride.id);
			}
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [
		phase,
		ride,
		driverStart
	]);
	if (!ride || !driverStart) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
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
	const driverPos = phase === "arriving" ? interp(driverStart, pickup, progress) : phase === "in_progress" ? interp(pickup, dest, progress) : dest;
	const remainingKm = phase === "arriving" ? distKm(driverPos, pickup) : distKm(driverPos, dest);
	const etaMin = Math.max(1, Math.round(remainingKm / SPEED_KMH * 60 * (phase === "arriving" ? .4 : 1)));
	const statusLabel = phase === "arriving" ? `Driver arriving in ~${etaMin} min` : phase === "in_progress" ? `On the way • ~${etaMin} min to destination` : "Trip complete";
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
							children: phase === "completed" ? "Completed" : "Live tracking"
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
								children: ["$", ride.price.toFixed(2)]
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
									children: "Alex • Toyota Prius"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: ["ABC-1234 • ", ride.car_class]
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
					phase === "completed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
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
