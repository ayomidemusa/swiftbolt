import { n as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-F__N42p1.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { P as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { O as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/driver-register-BJN4bI80.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DriverRegisterPage() {
	const navigate = useNavigate();
	const [checking, setChecking] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		full_name: "",
		phone: "",
		car_model: "",
		plate_number: "",
		hourly_rate: "",
		price_per_km: ""
	});
	(0, import_react.useEffect)(() => {
		(async () => {
			const { data: { user } } = await supabase.auth.getUser();
			if (!user) {
				toast.error("Please login first");
				setChecking(false);
				return;
			}
			const { data } = await supabase.from("drivers").select("id").eq("user_id", user.id).maybeSingle();
			if (data) {
				navigate({ to: "/driver/dashboard" });
				return;
			}
			setChecking(false);
		})();
	}, [navigate]);
	async function registerDriver() {
		if (!form.full_name.trim()) {
			toast.error("Full name is required");
			return;
		}
		setSaving(true);
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) {
			toast.error("Please login first");
			setSaving(false);
			return;
		}
		const { error } = await supabase.from("drivers").upsert({
			user_id: user.id,
			full_name: form.full_name,
			phone: form.phone || null,
			car_model: form.car_model || null,
			plate_number: form.plate_number || null,
			hourly_rate: form.hourly_rate ? Number(form.hourly_rate) : null,
			price_per_km: form.price_per_km ? Number(form.price_per_km) : null,
			status: "offline"
		}, { onConflict: "user_id" });
		setSaving(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Driver registration successful!");
		navigate({ to: "/driver/dashboard" });
	}
	if (checking) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-6 text-2xl font-bold",
			children: "Driver Registration"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Full Name",
					value: form.full_name,
					onChange: (e) => setForm({
						...form,
						full_name: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Phone Number",
					value: form.phone,
					onChange: (e) => setForm({
						...form,
						phone: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Car Model",
					value: form.car_model,
					onChange: (e) => setForm({
						...form,
						car_model: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Plate Number",
					value: form.plate_number,
					onChange: (e) => setForm({
						...form,
						plate_number: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					placeholder: "Hourly Rate (₦)",
					value: form.hourly_rate,
					onChange: (e) => setForm({
						...form,
						hourly_rate: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					placeholder: "Price per KM (₦)",
					value: form.price_per_km,
					onChange: (e) => setForm({
						...form,
						price_per_km: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: registerDriver,
					disabled: saving,
					className: "w-full",
					children: saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Register Driver"
				})
			]
		})]
	});
}
//#endregion
export { DriverRegisterPage as component };
