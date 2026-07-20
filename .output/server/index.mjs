globalThis.__nitro_main__ = import.meta.url;
import { a as FastResponse, n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx+unenv.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/account-DUxSnLry.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"862-E7vfh9ZA0AW1S13J5ZmF8XEWa2Y\"",
		"mtime": "2026-07-20T12:09:01.148Z",
		"size": 2146,
		"path": "../public/assets/account-DUxSnLry.js"
	},
	"/assets/admin-Bp1Hnd6_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d0b-7d8zN4/TuGybD8viUUHvaYcjxJU\"",
		"mtime": "2026-07-20T12:09:01.149Z",
		"size": 7435,
		"path": "../public/assets/admin-Bp1Hnd6_.js"
	},
	"/assets/AppShell-9uLlLp1K.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a47-gq992pagshZq4fs1rXPdRL10vLs\"",
		"mtime": "2026-07-20T12:09:01.148Z",
		"size": 2631,
		"path": "../public/assets/AppShell-9uLlLp1K.js"
	},
	"/assets/auth-CmqYgZOs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1404-r8kbKQIfjd1e/hzpn7frtVygUNQ\"",
		"mtime": "2026-07-20T12:09:01.150Z",
		"size": 5124,
		"path": "../public/assets/auth-CmqYgZOs.js"
	},
	"/assets/book-BPVUcKbw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20bb2-XRTgf4QFEZ/YnxutDTdloU5zx7I\"",
		"mtime": "2026-07-20T12:09:01.151Z",
		"size": 134066,
		"path": "../public/assets/book-BPVUcKbw.js"
	},
	"/assets/button-BJvcJF_n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7a9a-gqDtNv1VZvBULMudu3YN6xrn2gc\"",
		"mtime": "2026-07-20T12:09:01.151Z",
		"size": 31386,
		"path": "../public/assets/button-BJvcJF_n.js"
	},
	"/assets/car-BrxrXv4m.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"197-mvRY1fQgWVGkBo5w94+I32nT6zI\"",
		"mtime": "2026-07-20T12:09:01.152Z",
		"size": 407,
		"path": "../public/assets/car-BrxrXv4m.js"
	},
	"/assets/client-B6KjOWQX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"33353-2ep/RHqLBWt1ACgInkqYvFH27JA\"",
		"mtime": "2026-07-20T12:09:01.152Z",
		"size": 209747,
		"path": "../public/assets/client-B6KjOWQX.js"
	},
	"/assets/createLucideIcon-DeQrcgrh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ab-cR1PODv03KUfJz4HloEEypYngbs\"",
		"mtime": "2026-07-20T12:09:01.153Z",
		"size": 1195,
		"path": "../public/assets/createLucideIcon-DeQrcgrh.js"
	},
	"/assets/dashboard-BWSJKLyg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"43d2-gKKcA4dTqrNm6GIMyKhcbFWCZuU\"",
		"mtime": "2026-07-20T12:09:01.154Z",
		"size": 17362,
		"path": "../public/assets/dashboard-BWSJKLyg.js"
	},
	"/assets/dist-TpAQNY4Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20d-0ExXFul75oI7Aq4CRjwPMJo72q4\"",
		"mtime": "2026-07-20T12:09:01.154Z",
		"size": 525,
		"path": "../public/assets/dist-TpAQNY4Y.js"
	},
	"/assets/dollar-sign-E-ITF6jN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"db-9U4h9FedPnBi3YunDsfRpPmcfHk\"",
		"mtime": "2026-07-20T12:09:01.155Z",
		"size": 219,
		"path": "../public/assets/dollar-sign-E-ITF6jN.js"
	},
	"/assets/driver-register-CEjuF_lx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9eb-IZT4dZwAvcLEddbRY3nw+h4pVI0\"",
		"mtime": "2026-07-20T12:09:01.156Z",
		"size": 2539,
		"path": "../public/assets/driver-register-CEjuF_lx.js"
	},
	"/assets/history-m4b_WXw7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d94-PiN5H7ex6QdOdTM+n6Luj9JscUU\"",
		"mtime": "2026-07-20T12:09:01.157Z",
		"size": 11668,
		"path": "../public/assets/history-m4b_WXw7.js"
	},
	"/assets/input-ezsf7SLN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26e-EM0UONLJyar3oHi5lhLzy/M6O8s\"",
		"mtime": "2026-07-20T12:09:01.157Z",
		"size": 622,
		"path": "../public/assets/input-ezsf7SLN.js"
	},
	"/assets/jsx-runtime-bzQ4Vb5N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20d8-vMfP+4a4ykIjbw4InHkj3E5HWt0\"",
		"mtime": "2026-07-20T12:09:01.158Z",
		"size": 8408,
		"path": "../public/assets/jsx-runtime-bzQ4Vb5N.js"
	},
	"/assets/loader-circle-aedxAz1-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-oRwsLr02YXjb+KE/IkQkjsNEMmU\"",
		"mtime": "2026-07-20T12:09:01.163Z",
		"size": 144,
		"path": "../public/assets/loader-circle-aedxAz1-.js"
	},
	"/assets/index-B5bwpexd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"55571-AGYw0tqE/CGM12nvjXsjOjE6FG8\"",
		"mtime": "2026-07-20T12:09:01.147Z",
		"size": 349553,
		"path": "../public/assets/index-B5bwpexd.js"
	},
	"/assets/notifications-C_wfFVOB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"259c4-69eltUHjh3IjkBghwijelKs9xvI\"",
		"mtime": "2026-07-20T12:09:01.163Z",
		"size": 154052,
		"path": "../public/assets/notifications-C_wfFVOB.js"
	},
	"/assets/phone-e_0VIek9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"142-5lGnOhoMeXIq6IDtoa8zOjKrtTA\"",
		"mtime": "2026-07-20T12:09:01.164Z",
		"size": 322,
		"path": "../public/assets/phone-e_0VIek9.js"
	},
	"/assets/route-BBUhelP1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d-SSYzWLmYllabe56Pp8YnmbUFrZQ\"",
		"mtime": "2026-07-20T12:09:01.164Z",
		"size": 141,
		"path": "../public/assets/route-BBUhelP1.js"
	},
	"/assets/routes-DJ7LAi8J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-SoFMfAHVJ5oqB5t+mpFRoQvFIoc\"",
		"mtime": "2026-07-20T12:09:01.171Z",
		"size": 38,
		"path": "../public/assets/routes-DJ7LAi8J.js"
	},
	"/assets/shield-gJsHrqqo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"110-XIYGRXHx71qUo14UcQ2snHpkqMk\"",
		"mtime": "2026-07-20T12:09:01.173Z",
		"size": 272,
		"path": "../public/assets/shield-gJsHrqqo.js"
	},
	"/assets/styles-BxCzCVTf.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"15df0-vWyXmEa+BFWg/o3Ps7thoTs92S0\"",
		"mtime": "2026-07-20T12:09:01.179Z",
		"size": 89584,
		"path": "../public/assets/styles-BxCzCVTf.css"
	},
	"/assets/track._rideId-CSjrkr7_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d57-rhroA+nTHxfIw7DGS7RYRfsVsRE\"",
		"mtime": "2026-07-20T12:09:01.175Z",
		"size": 7511,
		"path": "../public/assets/track._rideId-CSjrkr7_.js"
	},
	"/assets/users-CG7u0fQJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-wWfimSN61SYTEe2q/H2sFjGBhIM\"",
		"mtime": "2026-07-20T12:09:01.177Z",
		"size": 306,
		"path": "../public/assets/users-CG7u0fQJ.js"
	},
	"/assets/useStore-Bf5KhkHY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a98-6JFJDLeC4qDPg9NgDugvSfLckTc\"",
		"mtime": "2026-07-20T12:09:01.177Z",
		"size": 19096,
		"path": "../public/assets/useStore-Bf5KhkHY.js"
	},
	"/assets/x-DSHPaOOl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-9TrLs6zesrrKO5/Jp4+l+qQ540I\"",
		"mtime": "2026-07-20T12:09:01.178Z",
		"size": 154,
		"path": "../public/assets/x-DSHPaOOl.js"
	},
	"/assets/zap-Bq62vwpD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"106-jmIJyOHnZ3by8CFJAIY6f3dSuNY\"",
		"mtime": "2026-07-20T12:09:01.178Z",
		"size": 262,
		"path": "../public/assets/zap-Bq62vwpD.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_DCy2D7 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_DCy2D7
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
