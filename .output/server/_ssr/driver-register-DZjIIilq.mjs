import { n as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-F__N42p1.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/driver-register-DZjIIilq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DriverRegisterPage() {
	const [form, setForm] = (0, import_react.useState)({
		full_name: "",
		phone: "",
		car_model: "",
		plate_number: ""
	});
	async function registerDriver() {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) {
			toast.error("Please login first");
			return;
		}
		const { error } = await supabase.from("drivers").insert({
			user_id: user.id,
			full_name: form.full_name,
			phone: form.phone,
			car_model: form.car_model,
			plate_number: form.plate_number,
			status: "offline"
		});
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Driver registration successful!");
	}
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: registerDriver,
					className: "w-full",
					children: "Register Driver"
				})
			]
		})]
	});
}
//#endregion
export { DriverRegisterPage as component };
