import { n as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-F__N42p1.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { D as isRedirect, _ as useRouter, g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { D as Car, S as CreditCard, b as LoaderCircle, c as Smartphone, i as Users, m as Navigation, n as X, p as Package, r as Wallet, u as Search, y as Lock } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-D5kbQcWh.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-D_qHdeTR.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { n as ensureNotificationPermission, r as pushNotify, t as RideMap } from "./notifications-C7Po_pgf.mjs";
import { t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as ve } from "../_libs/paystack__inline-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book-Dgwh4wCF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var geocodeAddress = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("1fa8cd42fb8cf91e966958a3ac686fb89d31e677c59670df4559bc460717c1df"));
var reverseGeocode = createServerFn({ method: "POST" }).validator((d) => d).handler(createSsrRpc("63ee0bac8dc00de0a11b2bfff413e5f6b243c8e8591f03c89a4a988923e507af"));
function payWithPaystack(email, amount, onSuccess, onClose) {
	new ve().newTransaction({
		key: "pk_test_3a23c2d11c272cf8fc92deabf328a106dbb2d843",
		email,
		amount: amount * 100,
		onSuccess() {
			onSuccess();
		},
		onCancel() {
			onClose();
		}
	});
}
var DEFAULT_CENTER = {
	lat: 6.5244,
	lng: 3.3792
};
var CAR_CLASSES = [
	{
		id: "economy",
		label: "Economy",
		icon: Car,
		mult: 1,
		eta: 3,
		capacity: "4 seats"
	},
	{
		id: "comfort",
		label: "Comfort",
		icon: Users,
		mult: 1.4,
		eta: 5,
		capacity: "4 seats"
	},
	{
		id: "xl",
		label: "XL",
		icon: Package,
		mult: 1.8,
		eta: 7,
		capacity: "6 seats"
	}
];
function distanceKm(a, b) {
	const R = 6371, toRad = (d) => d * Math.PI / 180;
	const dLat = toRad(b.lat - a.lat), dLng = toRad(b.lng - a.lng);
	const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
	return 2 * R * Math.asin(Math.sqrt(h));
}
function jitterDrivers(center, n) {
	const seed = Math.floor(center.lat * 100) + Math.floor(center.lng * 100);
	const out = [];
	for (let i = 0; i < n; i++) {
		const a = (seed + i * 97) % 360 * (Math.PI / 180);
		const r = .003 + (seed + i * 31) % 50 / 1e4;
		out.push({
			lat: center.lat + Math.cos(a) * r,
			lng: center.lng + Math.sin(a) * r
		});
	}
	return out;
}
function BookPage() {
	const navigate = useNavigate();
	const [center, setCenter] = (0, import_react.useState)(DEFAULT_CENTER);
	const [pickup, setPickup] = (0, import_react.useState)(null);
	const [destination, setDestination] = (0, import_react.useState)(null);
	const [query, setQuery] = (0, import_react.useState)("");
	const [results, setResults] = (0, import_react.useState)([]);
	const [focusField, setFocusField] = (0, import_react.useState)("destination");
	const [carClass, setCarClass] = (0, import_react.useState)("economy");
	const [payMethod, setPayMethod] = (0, import_react.useState)("paystack");
	const [checkoutOpen, setCheckoutOpen] = (0, import_react.useState)(false);
	const [booking, setBooking] = (0, import_react.useState)(false);
	const geocode = useServerFn(geocodeAddress);
	const reverse = useServerFn(reverseGeocode);
	(0, import_react.useEffect)(() => {
		if (!navigator.geolocation) return;
		navigator.geolocation.getCurrentPosition(async (pos) => {
			const here = {
				lat: pos.coords.latitude,
				lng: pos.coords.longitude
			};
			setCenter(here);
			try {
				const { address } = await reverse({ data: here });
				setPickup({
					address,
					...here
				});
			} catch {
				setPickup({
					address: "Current location",
					...here
				});
			}
		}, () => {
			setCenter(DEFAULT_CENTER);
			setPickup(null);
		}, {
			enableHighAccuracy: true,
			timeout: 8e3
		});
	}, [reverse]);
	const drivers = (0, import_react.useMemo)(() => jitterDrivers(center, 7), [center]);
	const search = useMutation({
		mutationFn: async (q) => geocode({ data: {
			query: q,
			near: center
		} }),
		onSuccess: (d) => setResults(d.results),
		onError: () => toast.error("Couldn't search that address")
	});
	(0, import_react.useEffect)(() => {
		if (query.trim().length < 3) {
			setResults([]);
			return;
		}
		const t = setTimeout(() => search.mutate(query), 350);
		return () => clearTimeout(t);
	}, [query]);
	const distance = pickup && destination ? distanceKm(pickup, destination) : 0;
	const duration = Math.max(5, Math.round(distance * 2.5));
	const basePrice = 1e3 + distance * 250;
	function pickResult(p) {
		if (focusField === "pickup") setPickup(p);
		else setDestination(p);
		setQuery("");
		setResults([]);
	}
	async function confirmRide() {
		if (!pickup || !destination) return;
		setBooking(true);
		try {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) throw new Error("Not signed in");
			const cls = CAR_CLASSES.find((c) => c.id === carClass);
			const price = +(basePrice * cls.mult).toFixed(2);
			if (payMethod === "paystack") await new Promise((resolve, reject) => {
				payWithPaystack(u.user.email, price, () => resolve(), () => reject(/* @__PURE__ */ new Error("Payment cancelled")));
			});
			const { data: inserted, error } = await supabase.from("rides").insert({
				user_id: u.user.id,
				pickup_address: pickup.address,
				pickup_lat: pickup.lat,
				pickup_lng: pickup.lng,
				destination_address: destination.address,
				destination_lat: destination.lat,
				destination_lng: destination.lng,
				distance_km: +distance.toFixed(2),
				duration_min: duration,
				car_class: carClass,
				price,
				status: "pending"
			}).select("id").single();
			if (error) throw error;
			await ensureNotificationPermission();
			toast.success("Searching for nearby drivers...");
			pushNotify("Swift", "Looking for an available driver...");
			setCheckoutOpen(false);
			navigate({
				to: "/track/$rideId",
				params: { rideId: inserted.id }
			});
		} catch (e) {
			toast.error(e.message ?? "Payment failed");
		} finally {
			setBooking(false);
		}
	}
	const ready = pickup && destination;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		active: "book",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RideMap, {
				center: pickup ?? center,
				pickup,
				destination,
				drivers,
				onMapClick: async (p) => {
					try {
						const { address } = await reverse({ data: p });
						const place = {
							address,
							...p
						};
						if (!destination) setDestination(place);
						else setPickup(place);
					} catch {}
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 bottom-0 z-[2000] rounded-t-3xl border-t border-border bg-surface shadow-sheet",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-2 h-1 w-10 rounded-full bg-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 pt-3 pb-5",
					children: !ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold",
							children: "Where to?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 rounded-2xl bg-surface-elevated px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2.5 w-2.5 rounded-full bg-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: pickup ? pickup.address : "Pickup location",
									value: focusField === "pickup" ? query : "",
									onChange: (e) => {
										setFocusField("pickup");
										setQuery(e.target.value);
									},
									onFocus: () => setFocusField("pickup"),
									className: "h-9 border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 rounded-2xl bg-surface-elevated px-3 py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2.5 w-2.5 rounded-sm bg-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: destination ? destination.address : "Where are you going?",
									value: focusField === "destination" ? query : "",
									onChange: (e) => {
										setFocusField("destination");
										setQuery(e.target.value);
									},
									onFocus: () => setFocusField("destination"),
									autoFocus: true,
									className: "h-9 border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 max-h-64 overflow-auto",
							children: [
								search.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 px-1 py-3 text-sm text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Searching…"]
								}),
								!search.isPending && results.length === 0 && query.length < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "px-1 pt-3 text-xs text-muted-foreground",
									children: "Type at least 3 characters, or tap anywhere on the map to drop a pin."
								}),
								results.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => pickResult(r),
									className: "flex w-full items-start gap-3 rounded-xl px-2 py-3 text-left hover:bg-surface-elevated",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm",
										children: r.address
									})]
								}, `${r.lat}-${r.lng}`))
							]
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-surface-elevated p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									dot: "bg-foreground",
									text: pickup.address,
									onClear: () => setPickup(null)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "ml-[5px] h-3 w-px bg-border" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									dot: "bg-primary square",
									text: destination.address,
									onClear: () => setDestination(null)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-2",
							children: CAR_CLASSES.map((c) => {
								const price = (basePrice * c.mult).toFixed(2);
								const selected = carClass === c.id;
								const Icon = c.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setCarClass(c.id),
									className: `flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${selected ? "border-primary bg-primary/10" : "border-border bg-surface-elevated"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `grid h-11 w-11 place-items-center rounded-xl ${selected ? "bg-primary text-primary-foreground" : "bg-surface text-foreground"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold",
												children: c.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold",
												children: ["₦", Number(price).toLocaleString()]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-xs text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												c.capacity,
												" · ",
												duration,
												" min"
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [c.eta, " min away"] })]
										})]
									})]
								}, c.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setCheckoutOpen(true),
							className: "mt-4 h-12 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "mr-2 h-4 w-4" }),
								" Continue to payment · ₦",
								(basePrice * CAR_CLASSES.find((c) => c.id === carClass).mult).toLocaleString()
							]
						})
					] })
				})]
			}),
			checkoutOpen && ready && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckoutSheet, {
				total: +(basePrice * CAR_CLASSES.find((c) => c.id === carClass).mult).toFixed(2),
				method: payMethod,
				setMethod: setPayMethod,
				onClose: () => setCheckoutOpen(false),
				onPay: confirmRide,
				loading: booking
			})
		]
	});
}
function CheckoutSheet({ total, method, setMethod, onClose, onPay, loading }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-x-0 bottom-0 z-[2000] rounded-t-3xl border-t border-border bg-surface shadow-sheet",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: (e) => e.stopPropagation(),
			className: "w-full rounded-t-3xl border-t border-border bg-surface p-5 shadow-sheet",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mb-3 h-1 w-10 rounded-full bg-border" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "Checkout"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "grid h-8 w-8 place-items-center rounded-full bg-surface-elevated text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Choose a payment method. You'll be charged when the trip completes."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-2",
					children: [
						{
							id: "card",
							icon: CreditCard,
							label: "Visa •••• 4242",
							sub: "Default card"
						},
						{
							id: "paystack",
							icon: Smartphone,
							label: "paystack Pay",
							sub: "Face ID"
						},
						{
							id: "cash",
							icon: Wallet,
							label: "Cash",
							sub: "Pay driver directly"
						}
					].map((m) => {
						const Icon = m.icon;
						const selected = method === m.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setMethod(m.id),
							className: `flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${selected ? "border-primary bg-primary/10" : "border-border bg-surface-elevated"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `grid h-10 w-10 place-items-center rounded-xl ${selected ? "bg-primary text-primary-foreground" : "bg-surface"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: m.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: m.sub
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-4 w-4 rounded-full border ${selected ? "border-primary bg-primary" : "border-border"}` })
							]
						}, m.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center justify-between rounded-2xl bg-surface-elevated p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted-foreground",
						children: "Total"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-lg font-semibold",
						children: ["N", total.toFixed(2)]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: onPay,
					disabled: loading,
					className: "mt-4 h-12 w-full rounded-2xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mr-2 h-4 w-4" }),
						" Pay  ₦",
						total.toLocaleString()
					] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-center text-[11px] text-muted-foreground",
					children: "Secured checkout · demo mode"
				})
			]
		})
	});
}
function Row({ dot, text, onClear }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 py-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-2.5 w-2.5 ${dot.includes("square") ? "rounded-sm bg-primary" : "rounded-full bg-foreground"}` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex-1 truncate text-sm",
				children: text
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onClear,
				className: "text-xs text-muted-foreground hover:text-foreground",
				children: "Change"
			})
		]
	});
}
//#endregion
export { BookPage as component };
