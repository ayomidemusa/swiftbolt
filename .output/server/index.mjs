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
	"/assets/admin-BuyvGrMJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d0b-LI/ZigCcEGzHRcP+AWQo5uoB4fI\"",
		"mtime": "2026-07-20T11:44:39.994Z",
		"size": 7435,
		"path": "../public/assets/admin-BuyvGrMJ.js"
	},
	"/assets/account-CsfuE6uQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"862-AErU0691MM2By9Xil9Nd8AayimY\"",
		"mtime": "2026-07-20T11:44:39.993Z",
		"size": 2146,
		"path": "../public/assets/account-CsfuE6uQ.js"
	},
	"/assets/AppShell-BPIewyaW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a47-EKl9/4DhQlYmOzlzJjvWMu1j69Q\"",
		"mtime": "2026-07-20T11:44:39.992Z",
		"size": 2631,
		"path": "../public/assets/AppShell-BPIewyaW.js"
	},
	"/assets/auth-D77L56Vq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13c8-X3uYLCuX94SxiMYIz76pAkb/fos\"",
		"mtime": "2026-07-20T11:44:39.994Z",
		"size": 5064,
		"path": "../public/assets/auth-D77L56Vq.js"
	},
	"/assets/book-CpFz-6GM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20bb2-h/8cwzlRgeZ/w7lwq37rAOH76l4\"",
		"mtime": "2026-07-20T11:44:39.995Z",
		"size": 134066,
		"path": "../public/assets/book-CpFz-6GM.js"
	},
	"/assets/button-BJvcJF_n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7a9a-gqDtNv1VZvBULMudu3YN6xrn2gc\"",
		"mtime": "2026-07-20T11:44:39.996Z",
		"size": 31386,
		"path": "../public/assets/button-BJvcJF_n.js"
	},
	"/assets/car-BrxrXv4m.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"197-mvRY1fQgWVGkBo5w94+I32nT6zI\"",
		"mtime": "2026-07-20T11:44:39.996Z",
		"size": 407,
		"path": "../public/assets/car-BrxrXv4m.js"
	},
	"/assets/createLucideIcon-DeQrcgrh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4ab-cR1PODv03KUfJz4HloEEypYngbs\"",
		"mtime": "2026-07-20T11:44:39.997Z",
		"size": 1195,
		"path": "../public/assets/createLucideIcon-DeQrcgrh.js"
	},
	"/assets/dist-Se6WrK2N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20d-+9AH93HTBnKZE9j0iNhOqTZYjvM\"",
		"mtime": "2026-07-20T11:44:39.999Z",
		"size": 525,
		"path": "../public/assets/dist-Se6WrK2N.js"
	},
	"/assets/client-CNMrkXkB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3277a-+j6dB8QJjNbJqKJFi8uoea08DuA\"",
		"mtime": "2026-07-20T11:44:39.997Z",
		"size": 206714,
		"path": "../public/assets/client-CNMrkXkB.js"
	},
	"/assets/dashboard-CFH81_ir.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c28-3xaqzgivMD30GcfzWp1DgkATutc\"",
		"mtime": "2026-07-20T11:44:39.998Z",
		"size": 15400,
		"path": "../public/assets/dashboard-CFH81_ir.js"
	},
	"/assets/dollar-sign-E-ITF6jN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"db-9U4h9FedPnBi3YunDsfRpPmcfHk\"",
		"mtime": "2026-07-20T11:44:40.000Z",
		"size": 219,
		"path": "../public/assets/dollar-sign-E-ITF6jN.js"
	},
	"/assets/driver-register-CiO_nyPy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9eb-FiI2WmZNCzRIl/TnUgXe4FvV2c8\"",
		"mtime": "2026-07-20T11:44:40.001Z",
		"size": 2539,
		"path": "../public/assets/driver-register-CiO_nyPy.js"
	},
	"/assets/history-COWy-WmD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d91-NpIPHOo4JjD9CRMDSOZk2W+qFvE\"",
		"mtime": "2026-07-20T11:44:40.001Z",
		"size": 11665,
		"path": "../public/assets/history-COWy-WmD.js"
	},
	"/assets/input-ezsf7SLN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26e-EM0UONLJyar3oHi5lhLzy/M6O8s\"",
		"mtime": "2026-07-20T11:44:40.002Z",
		"size": 622,
		"path": "../public/assets/input-ezsf7SLN.js"
	},
	"/assets/jsx-runtime-bzQ4Vb5N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"20d8-vMfP+4a4ykIjbw4InHkj3E5HWt0\"",
		"mtime": "2026-07-20T11:44:40.003Z",
		"size": 8408,
		"path": "../public/assets/jsx-runtime-bzQ4Vb5N.js"
	},
	"/assets/index-Cf1Z3q1S.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5567e-OJPZBYZioSIuYNL2Duy7lJNu9no\"",
		"mtime": "2026-07-20T11:44:39.992Z",
		"size": 349822,
		"path": "../public/assets/index-Cf1Z3q1S.js"
	},
	"/assets/loader-circle-aedxAz1-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-oRwsLr02YXjb+KE/IkQkjsNEMmU\"",
		"mtime": "2026-07-20T11:44:40.003Z",
		"size": 144,
		"path": "../public/assets/loader-circle-aedxAz1-.js"
	},
	"/assets/phone-e_0VIek9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"142-5lGnOhoMeXIq6IDtoa8zOjKrtTA\"",
		"mtime": "2026-07-20T11:44:40.005Z",
		"size": 322,
		"path": "../public/assets/phone-e_0VIek9.js"
	},
	"/assets/notifications-C6xuQcd8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"259c4-isjpXRVrpxoi9Zp1QShKaZ+q5n8\"",
		"mtime": "2026-07-20T11:44:40.004Z",
		"size": 154052,
		"path": "../public/assets/notifications-C6xuQcd8.js"
	},
	"/assets/route-DTaVM4bm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d-1hu1/RmkW9J1hcDrtjUQW63NvtQ\"",
		"mtime": "2026-07-20T11:44:40.005Z",
		"size": 141,
		"path": "../public/assets/route-DTaVM4bm.js"
	},
	"/assets/routes-DJ7LAi8J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-SoFMfAHVJ5oqB5t+mpFRoQvFIoc\"",
		"mtime": "2026-07-20T11:44:40.006Z",
		"size": 38,
		"path": "../public/assets/routes-DJ7LAi8J.js"
	},
	"/assets/shield-gJsHrqqo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"110-XIYGRXHx71qUo14UcQ2snHpkqMk\"",
		"mtime": "2026-07-20T11:44:40.007Z",
		"size": 272,
		"path": "../public/assets/shield-gJsHrqqo.js"
	},
	"/assets/track._rideId-0wEZT41F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d4f-pISt2DfNzhYs/VA0GMM6Wzy9zkA\"",
		"mtime": "2026-07-20T11:44:40.007Z",
		"size": 7503,
		"path": "../public/assets/track._rideId-0wEZT41F.js"
	},
	"/assets/styles-Biq3HMTg.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"15d50-Y5slct81W8N+crFbq1DVONtcYeg\"",
		"mtime": "2026-07-20T11:44:40.012Z",
		"size": 89424,
		"path": "../public/assets/styles-Biq3HMTg.css"
	},
	"/assets/users-CG7u0fQJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-wWfimSN61SYTEe2q/H2sFjGBhIM\"",
		"mtime": "2026-07-20T11:44:40.009Z",
		"size": 306,
		"path": "../public/assets/users-CG7u0fQJ.js"
	},
	"/assets/useStore-lDx2cSw4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4821-2U6JpcvrFqqIhfSlhwM0mUifVUY\"",
		"mtime": "2026-07-20T11:44:40.009Z",
		"size": 18465,
		"path": "../public/assets/useStore-lDx2cSw4.js"
	},
	"/assets/x-DSHPaOOl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-9TrLs6zesrrKO5/Jp4+l+qQ540I\"",
		"mtime": "2026-07-20T11:44:40.011Z",
		"size": 154,
		"path": "../public/assets/x-DSHPaOOl.js"
	},
	"/assets/zap-Bq62vwpD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"106-jmIJyOHnZ3by8CFJAIY6f3dSuNY\"",
		"mtime": "2026-07-20T11:44:40.011Z",
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
