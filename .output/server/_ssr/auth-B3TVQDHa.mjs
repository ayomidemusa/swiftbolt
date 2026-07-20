import { n as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-F__N42p1.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { P as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Root } from "../_libs/@radix-ui/react-label+[...].mjs";
import { t as Zap } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn, t as Button } from "./button-DRsC1qZi.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-DicJzR9-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-B3TVQDHa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
function AuthPage() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
			if (!session) return;
			const { data: driver } = await supabase.from("drivers").select("id").eq("user_id", session.user.id).maybeSingle();
			if (driver) navigate({ to: "/driver/dashboard" });
			else navigate({ to: "/" });
		});
		return () => sub.subscription.unsubscribe();
	}, [navigate]);
	async function handleEmail(e) {
		e.preventDefault();
		setLoading(true);
		try {
			if (mode === "signup") {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: {
						emailRedirectTo: window.location.origin,
						data: { full_name: name }
					}
				});
				if (error) throw error;
				toast.success("Check your email to confirm your account.");
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
			}
		} catch (err) {
			toast.error(err.message ?? "Authentication failed");
		} finally {
			setLoading(false);
		}
	}
	async function handleGoogle() {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: window.location.origin }
		});
		if (error) toast.error(error.message);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center bg-background px-6 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, {
					className: "h-5 w-5",
					strokeWidth: 2.5
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-2xl font-bold tracking-tight",
				children: "Swift"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-3xl border border-border bg-surface p-6 shadow-sheet",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: mode === "signin" ? "Welcome back" : "Create your account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: mode === "signin" ? "Sign in to book your next ride." : "Get moving in seconds."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleGoogle,
					variant: "outline",
					className: "mt-5 h-11 w-full rounded-xl border-border bg-surface-elevated hover:bg-surface-elevated/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						className: "mr-2 h-4 w-4",
						viewBox: "0 0 24 24",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								fill: "#4285F4",
								d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								fill: "#34A853",
								d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								fill: "#FBBC05",
								d: "M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
								fill: "#EA4335",
								d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
							})
						]
					}), "Continue with Google"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "my-4 flex items-center gap-3 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" }),
						" or ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleEmail,
					className: "space-y-3",
					children: [
						mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "name",
								children: "Full name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "name",
								value: name,
								onChange: (e) => setName(e.target.value),
								required: true,
								className: "h-11 rounded-xl bg-surface-elevated"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "email",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "email",
								type: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								required: true,
								className: "h-11 rounded-xl bg-surface-elevated"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "password",
								children: "Password"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								required: true,
								minLength: 6,
								className: "h-11 rounded-xl bg-surface-elevated"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: loading,
							className: "h-11 w-full rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90",
							children: loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 text-center text-sm text-muted-foreground",
					children: [
						mode === "signin" ? "New here?" : "Already have an account?",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setMode(mode === "signin" ? "signup" : "signin"),
							className: "font-semibold text-primary",
							children: mode === "signin" ? "Create account" : "Sign in"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { AuthPage as component };
