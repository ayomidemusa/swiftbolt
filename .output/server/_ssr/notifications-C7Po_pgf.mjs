import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as useMapEvents, i as MapContainer, n as Polyline, r as Marker, t as TileLayer } from "../_libs/react-leaflet.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-C7Po_pgf.js
var import_jsx_runtime = require_jsx_runtime();
function MapClickHandler({ onMapClick }) {
	useMapEvents({ click(e) {
		if (onMapClick) onMapClick({
			lat: e.latlng.lat,
			lng: e.latlng.lng
		});
	} });
	return null;
}
function RideMap({ center, pickup, destination, drivers = [], route = [], onMapClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MapContainer, {
		center: [center.lat, center.lng],
		zoom: 14,
		style: {
			height: "100%",
			width: "100%",
			position: "absolute"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TileLayer, {
				attribution: "© OpenStreetMap contributors",
				url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapClickHandler, { onMapClick }),
			drivers.map((driver, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marker, { position: [driver.lat, driver.lng] }, index)),
			pickup && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marker, { position: [pickup.lat, pickup.lng] }),
			destination && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Marker, { position: [destination.lat, destination.lng] }),
			route.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Polyline, {
				positions: route.map((p) => [p.lat, p.lng]),
				color: "blue",
				weight: 5
			})
		]
	});
}
async function ensureNotificationPermission() {
	if (typeof window === "undefined" || !("Notification" in window)) return false;
	if (Notification.permission === "granted") return true;
	if (Notification.permission === "denied") return false;
	return await Notification.requestPermission() === "granted";
}
function pushNotify(title, body) {
	if (typeof window === "undefined" || !("Notification" in window)) return;
	if (Notification.permission !== "granted") return;
	try {
		new Notification(title, {
			body,
			icon: "/favicon.ico",
			badge: "/favicon.ico"
		});
	} catch {}
}
//#endregion
export { ensureNotificationPermission as n, pushNotify as r, RideMap as t };
