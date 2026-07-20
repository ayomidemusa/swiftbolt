import { n as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-F__N42p1.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { A as redirect, _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Route$10 } from "./track._rideId-DkeYM4_V.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CE0ObyPS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BxCzCVTf.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Page not found."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-6 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground",
					children: "Go home"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-semibold",
				children: "Something went wrong"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					router.invalidate();
					reset();
				},
				className: "mt-6 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground",
				children: "Try again"
			})]
		})
	});
}
var Route$9 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: "Swift — Book a ride in seconds" },
			{
				name: "description",
				content: "Book a ride and see the nearest cars on a live map."
			},
			{
				name: "theme-color",
				content: "#1a1f24"
			},
			{
				property: "og:title",
				content: "Swift — Book a ride in seconds"
			},
			{
				name: "twitter:title",
				content: "Swift — Book a ride in seconds"
			},
			{
				property: "og:description",
				content: "Book a ride and see the nearest cars on a live map."
			},
			{
				name: "twitter:description",
				content: "Book a ride and see the nearest cars on a live map."
			},
			{
				property: "og:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1411b21b-c0ca-4583-8751-a901212f5a0a/id-preview-d2492d5e--50ab02e8-437f-4cd4-acf3-a297d27d0eba.lovable.app-1782729080042.png"
			},
			{
				name: "twitter:image",
				content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1411b21b-c0ca-4583-8751-a901212f5a0a/id-preview-d2492d5e--50ab02e8-437f-4cd4-acf3-a297d27d0eba.lovable.app-1782729080042.png"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				property: "og:type",
				content: "website"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$9.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => sub.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			theme: "dark",
			position: "top-center"
		})]
	});
}
var $$splitComponentImporter$8 = () => import("./routes-DTEZEvkE.mjs");
var Route$8 = createFileRoute("/")({
	ssr: false,
	beforeLoad: async () => {
		const { data } = await supabase.auth.getUser();
		if (data.user) throw redirect({ to: "/book" });
		throw redirect({ to: "/auth" });
	},
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./route-Di7iQBCH.mjs");
var Route$7 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./auth-B3TVQDHa.mjs");
var Route$6 = createFileRoute("/auth")({
	ssr: false,
	beforeLoad: async () => {
		const { data } = await supabase.auth.getUser();
		if (data.user) throw redirect({ to: "/" });
	},
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./account-DqhNVPLY.mjs");
var Route$5 = createFileRoute("/_authenticated/account")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./admin-DDMi609T.mjs");
var Route$4 = createFileRoute("/_authenticated/admin")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./book-Dgwh4wCF.mjs");
var Route$3 = createFileRoute("/_authenticated/book")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./driver-register-BJN4bI80.mjs");
var Route$2 = createFileRoute("/_authenticated/driver-register")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./history-CbrH3Xzp.mjs");
var Route$1 = createFileRoute("/_authenticated/history")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./dashboard-BK-7SWoF.mjs");
var Route = createFileRoute("/driver/dashboard")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$9
});
var AuthenticatedRouteRoute = Route$7.update({
	id: "/_authenticated",
	getParentRoute: () => Route$9
});
var AuthRoute = Route$6.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$9
});
var AuthenticatedAccountRoute = Route$5.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminRoute = Route$4.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedBookRoute = Route$3.update({
	id: "/book",
	path: "/book",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDriverRegisterRoute = Route$2.update({
	id: "/driver-register",
	path: "/driver-register",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedHistoryRoute = Route$1.update({
	id: "/history",
	path: "/history",
	getParentRoute: () => AuthenticatedRouteRoute
});
var DriverDashboardRoute = Route.update({
	id: "/driver/dashboard",
	path: "/driver/dashboard",
	getParentRoute: () => Route$9
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAccountRoute,
	AuthenticatedAdminRoute,
	AuthenticatedBookRoute,
	AuthenticatedDriverRegisterRoute,
	AuthenticatedHistoryRoute,
	AuthenticatedTrackRideIdRoute: Route$10.update({
		id: "/track/$rideId",
		path: "/track/$rideId",
		getParentRoute: () => AuthenticatedRouteRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	DriverDashboardRoute
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
