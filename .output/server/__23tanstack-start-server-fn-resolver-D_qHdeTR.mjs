//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-D_qHdeTR.js
var manifest = {
	"1fa8cd42fb8cf91e966958a3ac686fb89d31e677c59670df4559bc460717c1df": {
		functionName: "geocodeAddress_createServerFn_handler",
		importer: () => import("./_ssr/maps.functions-m2I5xdOs.mjs")
	},
	"63ee0bac8dc00de0a11b2bfff413e5f6b243c8e8591f03c89a4a988923e507af": {
		functionName: "reverseGeocode_createServerFn_handler",
		importer: () => import("./_ssr/maps.functions-m2I5xdOs.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
