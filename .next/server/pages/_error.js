/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_error";
exports.ids = ["pages/_error"];
exports.modules = {

/***/ "(pages-dir-node)/./components/TawkToChat.js":
/*!**********************************!*\
  !*** ./components/TawkToChat.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ TawkToChat)\n/* harmony export */ });\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/router */ \"(pages-dir-node)/./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nfunction TawkToChat() {\n  var router = (0,next_router__WEBPACK_IMPORTED_MODULE_0__.useRouter)();\n\n  // Check if current page is dashboard or related pages\n  var isDashboardArea = router.pathname.includes('/dashboard') || router.pathname.includes('/clients') || router.pathname.includes('/invoices') || router.pathname.includes('/expenses') || router.pathname.includes('/reports') || router.pathname.includes('/cashflow') || router.pathname.includes('/performance') || router.pathname.includes('/planner') || router.pathname.includes('/projects') || router.pathname.includes('/transactions') || router.pathname.includes('/accounts') || router.pathname.includes('/budgeting');\n  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {\n    // Only load tawk.to if not in dashboard area\n    if (!isDashboardArea) {\n      var s1 = document.createElement('script');\n      s1.async = true;\n      s1.src = 'https://embed.tawk.to/67ffeda8d825181910e0cd9c/1ip12mtt0';\n      s1.charset = 'UTF-8';\n      s1.setAttribute('crossorigin', '*');\n      document.body.appendChild(s1);\n      return function () {\n        // Clean up script when component unmounts\n        if (document.body.contains(s1)) {\n          document.body.removeChild(s1);\n        }\n\n        // Also remove any tawk.to elements that might be created\n        var tawkElements = document.querySelectorAll('iframe[title*=\"chat\"]');\n        tawkElements.forEach(function (el) {\n          if (el.parentNode) {\n            el.parentNode.removeChild(el);\n          }\n        });\n      };\n    }\n  }, [router.pathname, isDashboardArea]);\n\n  // This component doesn't render anything visible\n  return null;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL2NvbXBvbmVudHMvVGF3a1RvQ2hhdC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUF3QztBQUNOO0FBRW5CLFNBQVNFLFVBQVVBLENBQUEsRUFBRztFQUNuQyxJQUFNQyxNQUFNLEdBQUdILHNEQUFTLENBQUMsQ0FBQzs7RUFFMUI7RUFDQSxJQUFNSSxlQUFlLEdBQUdELE1BQU0sQ0FBQ0UsUUFBUSxDQUFDQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQ3RDSCxNQUFNLENBQUNFLFFBQVEsQ0FBQ0MsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUNwQ0gsTUFBTSxDQUFDRSxRQUFRLENBQUNDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFDckNILE1BQU0sQ0FBQ0UsUUFBUSxDQUFDQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQ3JDSCxNQUFNLENBQUNFLFFBQVEsQ0FBQ0MsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUNwQ0gsTUFBTSxDQUFDRSxRQUFRLENBQUNDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFDckNILE1BQU0sQ0FBQ0UsUUFBUSxDQUFDQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQ3hDSCxNQUFNLENBQUNFLFFBQVEsQ0FBQ0MsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUNwQ0gsTUFBTSxDQUFDRSxRQUFRLENBQUNDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFDckNILE1BQU0sQ0FBQ0UsUUFBUSxDQUFDQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQ3pDSCxNQUFNLENBQUNFLFFBQVEsQ0FBQ0MsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUNyQ0gsTUFBTSxDQUFDRSxRQUFRLENBQUNDLFFBQVEsQ0FBQyxZQUFZLENBQUM7RUFFOURMLGdEQUFTLENBQUMsWUFBTTtJQUNkO0lBQ0EsSUFBSSxDQUFDRyxlQUFlLEVBQUU7TUFDcEIsSUFBTUcsRUFBRSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxRQUFRLENBQUM7TUFDM0NGLEVBQUUsQ0FBQ0csS0FBSyxHQUFHLElBQUk7TUFDZkgsRUFBRSxDQUFDSSxHQUFHLEdBQUcsMERBQTBEO01BQ25FSixFQUFFLENBQUNLLE9BQU8sR0FBRyxPQUFPO01BQ3BCTCxFQUFFLENBQUNNLFlBQVksQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDO01BRW5DTCxRQUFRLENBQUNNLElBQUksQ0FBQ0MsV0FBVyxDQUFDUixFQUFFLENBQUM7TUFFN0IsT0FBTyxZQUFNO1FBQ1g7UUFDQSxJQUFJQyxRQUFRLENBQUNNLElBQUksQ0FBQ0UsUUFBUSxDQUFDVCxFQUFFLENBQUMsRUFBRTtVQUM5QkMsUUFBUSxDQUFDTSxJQUFJLENBQUNHLFdBQVcsQ0FBQ1YsRUFBRSxDQUFDO1FBQy9COztRQUVBO1FBQ0EsSUFBTVcsWUFBWSxHQUFHVixRQUFRLENBQUNXLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDO1FBQ3ZFRCxZQUFZLENBQUNFLE9BQU8sQ0FBQyxVQUFBQyxFQUFFLEVBQUk7VUFDekIsSUFBSUEsRUFBRSxDQUFDQyxVQUFVLEVBQUU7WUFDakJELEVBQUUsQ0FBQ0MsVUFBVSxDQUFDTCxXQUFXLENBQUNJLEVBQUUsQ0FBQztVQUMvQjtRQUNGLENBQUMsQ0FBQztNQUNKLENBQUM7SUFDSDtFQUNGLENBQUMsRUFBRSxDQUFDbEIsTUFBTSxDQUFDRSxRQUFRLEVBQUVELGVBQWUsQ0FBQyxDQUFDOztFQUV0QztFQUNBLE9BQU8sSUFBSTtBQUNiIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXG5ha2liXFxPbmVEcml2ZVxcRGVza3RvcFxcRmlzY2FsRnVzaW9uXFxjb21wb25lbnRzXFxUYXdrVG9DaGF0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVGF3a1RvQ2hhdCgpIHtcclxuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKTtcclxuICBcclxuICAvLyBDaGVjayBpZiBjdXJyZW50IHBhZ2UgaXMgZGFzaGJvYXJkIG9yIHJlbGF0ZWQgcGFnZXNcclxuICBjb25zdCBpc0Rhc2hib2FyZEFyZWEgPSByb3V0ZXIucGF0aG5hbWUuaW5jbHVkZXMoJy9kYXNoYm9hcmQnKSB8fCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXIucGF0aG5hbWUuaW5jbHVkZXMoJy9jbGllbnRzJykgfHwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVyLnBhdGhuYW1lLmluY2x1ZGVzKCcvaW52b2ljZXMnKSB8fCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXIucGF0aG5hbWUuaW5jbHVkZXMoJy9leHBlbnNlcycpIHx8IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlci5wYXRobmFtZS5pbmNsdWRlcygnL3JlcG9ydHMnKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlci5wYXRobmFtZS5pbmNsdWRlcygnL2Nhc2hmbG93JykgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXIucGF0aG5hbWUuaW5jbHVkZXMoJy9wZXJmb3JtYW5jZScpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVyLnBhdGhuYW1lLmluY2x1ZGVzKCcvcGxhbm5lcicpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVyLnBhdGhuYW1lLmluY2x1ZGVzKCcvcHJvamVjdHMnKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlci5wYXRobmFtZS5pbmNsdWRlcygnL3RyYW5zYWN0aW9ucycpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVyLnBhdGhuYW1lLmluY2x1ZGVzKCcvYWNjb3VudHMnKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlci5wYXRobmFtZS5pbmNsdWRlcygnL2J1ZGdldGluZycpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgLy8gT25seSBsb2FkIHRhd2sudG8gaWYgbm90IGluIGRhc2hib2FyZCBhcmVhXHJcbiAgICBpZiAoIWlzRGFzaGJvYXJkQXJlYSkge1xyXG4gICAgICBjb25zdCBzMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICBzMS5hc3luYyA9IHRydWU7XHJcbiAgICAgIHMxLnNyYyA9ICdodHRwczovL2VtYmVkLnRhd2sudG8vNjdmZmVkYThkODI1MTgxOTEwZTBjZDljLzFpcDEybXR0MCc7XHJcbiAgICAgIHMxLmNoYXJzZXQgPSAnVVRGLTgnO1xyXG4gICAgICBzMS5zZXRBdHRyaWJ1dGUoJ2Nyb3Nzb3JpZ2luJywgJyonKTtcclxuICAgICAgXHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoczEpO1xyXG4gICAgICBcclxuICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAvLyBDbGVhbiB1cCBzY3JpcHQgd2hlbiBjb21wb25lbnQgdW5tb3VudHNcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5jb250YWlucyhzMSkpIHtcclxuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoczEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBBbHNvIHJlbW92ZSBhbnkgdGF3ay50byBlbGVtZW50cyB0aGF0IG1pZ2h0IGJlIGNyZWF0ZWRcclxuICAgICAgICBjb25zdCB0YXdrRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpZnJhbWVbdGl0bGUqPVwiY2hhdFwiXScpO1xyXG4gICAgICAgIHRhd2tFbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcclxuICAgICAgICAgIGlmIChlbC5wYXJlbnROb2RlKSB7XHJcbiAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0sIFtyb3V0ZXIucGF0aG5hbWUsIGlzRGFzaGJvYXJkQXJlYV0pO1xyXG5cclxuICAvLyBUaGlzIGNvbXBvbmVudCBkb2Vzbid0IHJlbmRlciBhbnl0aGluZyB2aXNpYmxlXHJcbiAgcmV0dXJuIG51bGw7XHJcbn0gIl0sIm5hbWVzIjpbInVzZVJvdXRlciIsInVzZUVmZmVjdCIsIlRhd2tUb0NoYXQiLCJyb3V0ZXIiLCJpc0Rhc2hib2FyZEFyZWEiLCJwYXRobmFtZSIsImluY2x1ZGVzIiwiczEiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJhc3luYyIsInNyYyIsImNoYXJzZXQiLCJzZXRBdHRyaWJ1dGUiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjb250YWlucyIsInJlbW92ZUNoaWxkIiwidGF3a0VsZW1lbnRzIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJlbCIsInBhcmVudE5vZGUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./components/TawkToChat.js\n");

/***/ }),

/***/ "(pages-dir-node)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES&page=%2F_error&preferredRegion=&absolutePagePath=private-next-pages%2F_error&absoluteAppPath=private-next-pages%2F_app&absoluteDocumentPath=private-next-pages%2F_document&middlewareConfigBase64=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES&page=%2F_error&preferredRegion=&absolutePagePath=private-next-pages%2F_error&absoluteAppPath=private-next-pages%2F_app&absoluteDocumentPath=private-next-pages%2F_document&middlewareConfigBase64=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   getServerSideProps: () => (/* binding */ getServerSideProps),\n/* harmony export */   getStaticPaths: () => (/* binding */ getStaticPaths),\n/* harmony export */   getStaticProps: () => (/* binding */ getStaticProps),\n/* harmony export */   reportWebVitals: () => (/* binding */ reportWebVitals),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   unstable_getServerProps: () => (/* binding */ unstable_getServerProps),\n/* harmony export */   unstable_getServerSideProps: () => (/* binding */ unstable_getServerSideProps),\n/* harmony export */   unstable_getStaticParams: () => (/* binding */ unstable_getStaticParams),\n/* harmony export */   unstable_getStaticPaths: () => (/* binding */ unstable_getStaticPaths),\n/* harmony export */   unstable_getStaticProps: () => (/* binding */ unstable_getStaticProps)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_pages_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/pages/module.compiled */ \"(pages-dir-node)/./node_modules/next/dist/server/route-modules/pages/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_pages_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_pages_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(pages-dir-node)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/build/templates/helpers */ \"(pages-dir-node)/./node_modules/next/dist/build/templates/helpers.js\");\n/* harmony import */ var private_next_pages_document__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! private-next-pages/_document */ \"(pages-dir-node)/./pages/_document.js\");\n/* harmony import */ var private_next_pages_app__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! private-next-pages/_app */ \"(pages-dir-node)/./pages/_app.js\");\n/* harmony import */ var private_next_pages_error__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! private-next-pages/_error */ \"(pages-dir-node)/./node_modules/next/dist/pages/_error.js\");\n/* harmony import */ var private_next_pages_error__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(private_next_pages_error__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n// Import the app and document modules.\n\n\n// Import the userland code.\n\n// Re-export the component (should be the default export).\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(private_next_pages_error__WEBPACK_IMPORTED_MODULE_5__, 'default'));\n// Re-export methods.\nconst getStaticProps = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(private_next_pages_error__WEBPACK_IMPORTED_MODULE_5__, 'getStaticProps');\nconst getStaticPaths = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(private_next_pages_error__WEBPACK_IMPORTED_MODULE_5__, 'getStaticPaths');\nconst getServerSideProps = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(private_next_pages_error__WEBPACK_IMPORTED_MODULE_5__, 'getServerSideProps');\nconst config = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(private_next_pages_error__WEBPACK_IMPORTED_MODULE_5__, 'config');\nconst reportWebVitals = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(private_next_pages_error__WEBPACK_IMPORTED_MODULE_5__, 'reportWebVitals');\n// Re-export legacy methods.\nconst unstable_getStaticProps = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(private_next_pages_error__WEBPACK_IMPORTED_MODULE_5__, 'unstable_getStaticProps');\nconst unstable_getStaticPaths = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(private_next_pages_error__WEBPACK_IMPORTED_MODULE_5__, 'unstable_getStaticPaths');\nconst unstable_getStaticParams = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(private_next_pages_error__WEBPACK_IMPORTED_MODULE_5__, 'unstable_getStaticParams');\nconst unstable_getServerProps = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(private_next_pages_error__WEBPACK_IMPORTED_MODULE_5__, 'unstable_getServerProps');\nconst unstable_getServerSideProps = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(private_next_pages_error__WEBPACK_IMPORTED_MODULE_5__, 'unstable_getServerSideProps');\n// Create and export the route module that will be consumed.\nconst routeModule = new next_dist_server_route_modules_pages_module_compiled__WEBPACK_IMPORTED_MODULE_0__.PagesRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.PAGES,\n        page: \"/_error\",\n        pathname: \"/_error\",\n        // The following aren't used in production.\n        bundlePath: '',\n        filename: ''\n    },\n    components: {\n        // default export might not exist when optimized for data only\n        App: private_next_pages_app__WEBPACK_IMPORTED_MODULE_4__[\"default\"],\n        Document: private_next_pages_document__WEBPACK_IMPORTED_MODULE_3__[\"default\"]\n    },\n    userland: private_next_pages_error__WEBPACK_IMPORTED_MODULE_5__\n});\n\n//# sourceMappingURL=pages.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL25vZGVfbW9kdWxlcy9uZXh0L2Rpc3QvYnVpbGQvd2VicGFjay9sb2FkZXJzL25leHQtcm91dGUtbG9hZGVyL2luZGV4LmpzP2tpbmQ9UEFHRVMmcGFnZT0lMkZfZXJyb3ImcHJlZmVycmVkUmVnaW9uPSZhYnNvbHV0ZVBhZ2VQYXRoPXByaXZhdGUtbmV4dC1wYWdlcyUyRl9lcnJvciZhYnNvbHV0ZUFwcFBhdGg9cHJpdmF0ZS1uZXh0LXBhZ2VzJTJGX2FwcCZhYnNvbHV0ZURvY3VtZW50UGF0aD1wcml2YXRlLW5leHQtcGFnZXMlMkZfZG9jdW1lbnQmbWlkZGxld2FyZUNvbmZpZ0Jhc2U2ND1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQXdGO0FBQ2hDO0FBQ0U7QUFDMUQ7QUFDeUQ7QUFDVjtBQUMvQztBQUNzRDtBQUN0RDtBQUNBLGlFQUFlLHdFQUFLLENBQUMscURBQVEsWUFBWSxFQUFDO0FBQzFDO0FBQ08sdUJBQXVCLHdFQUFLLENBQUMscURBQVE7QUFDckMsdUJBQXVCLHdFQUFLLENBQUMscURBQVE7QUFDckMsMkJBQTJCLHdFQUFLLENBQUMscURBQVE7QUFDekMsZUFBZSx3RUFBSyxDQUFDLHFEQUFRO0FBQzdCLHdCQUF3Qix3RUFBSyxDQUFDLHFEQUFRO0FBQzdDO0FBQ08sZ0NBQWdDLHdFQUFLLENBQUMscURBQVE7QUFDOUMsZ0NBQWdDLHdFQUFLLENBQUMscURBQVE7QUFDOUMsaUNBQWlDLHdFQUFLLENBQUMscURBQVE7QUFDL0MsZ0NBQWdDLHdFQUFLLENBQUMscURBQVE7QUFDOUMsb0NBQW9DLHdFQUFLLENBQUMscURBQVE7QUFDekQ7QUFDTyx3QkFBd0Isa0dBQWdCO0FBQy9DO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxhQUFhLDhEQUFXO0FBQ3hCLGtCQUFrQixtRUFBZ0I7QUFDbEMsS0FBSztBQUNMLFlBQVk7QUFDWixDQUFDOztBQUVEIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZXNSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvcGFnZXMvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBob2lzdCB9IGZyb20gXCJuZXh0L2Rpc3QvYnVpbGQvdGVtcGxhdGVzL2hlbHBlcnNcIjtcbi8vIEltcG9ydCB0aGUgYXBwIGFuZCBkb2N1bWVudCBtb2R1bGVzLlxuaW1wb3J0ICogYXMgZG9jdW1lbnQgZnJvbSBcInByaXZhdGUtbmV4dC1wYWdlcy9fZG9jdW1lbnRcIjtcbmltcG9ydCAqIGFzIGFwcCBmcm9tIFwicHJpdmF0ZS1uZXh0LXBhZ2VzL19hcHBcIjtcbi8vIEltcG9ydCB0aGUgdXNlcmxhbmQgY29kZS5cbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJwcml2YXRlLW5leHQtcGFnZXMvX2Vycm9yXCI7XG4vLyBSZS1leHBvcnQgdGhlIGNvbXBvbmVudCAoc2hvdWxkIGJlIHRoZSBkZWZhdWx0IGV4cG9ydCkuXG5leHBvcnQgZGVmYXVsdCBob2lzdCh1c2VybGFuZCwgJ2RlZmF1bHQnKTtcbi8vIFJlLWV4cG9ydCBtZXRob2RzLlxuZXhwb3J0IGNvbnN0IGdldFN0YXRpY1Byb3BzID0gaG9pc3QodXNlcmxhbmQsICdnZXRTdGF0aWNQcm9wcycpO1xuZXhwb3J0IGNvbnN0IGdldFN0YXRpY1BhdGhzID0gaG9pc3QodXNlcmxhbmQsICdnZXRTdGF0aWNQYXRocycpO1xuZXhwb3J0IGNvbnN0IGdldFNlcnZlclNpZGVQcm9wcyA9IGhvaXN0KHVzZXJsYW5kLCAnZ2V0U2VydmVyU2lkZVByb3BzJyk7XG5leHBvcnQgY29uc3QgY29uZmlnID0gaG9pc3QodXNlcmxhbmQsICdjb25maWcnKTtcbmV4cG9ydCBjb25zdCByZXBvcnRXZWJWaXRhbHMgPSBob2lzdCh1c2VybGFuZCwgJ3JlcG9ydFdlYlZpdGFscycpO1xuLy8gUmUtZXhwb3J0IGxlZ2FjeSBtZXRob2RzLlxuZXhwb3J0IGNvbnN0IHVuc3RhYmxlX2dldFN0YXRpY1Byb3BzID0gaG9pc3QodXNlcmxhbmQsICd1bnN0YWJsZV9nZXRTdGF0aWNQcm9wcycpO1xuZXhwb3J0IGNvbnN0IHVuc3RhYmxlX2dldFN0YXRpY1BhdGhzID0gaG9pc3QodXNlcmxhbmQsICd1bnN0YWJsZV9nZXRTdGF0aWNQYXRocycpO1xuZXhwb3J0IGNvbnN0IHVuc3RhYmxlX2dldFN0YXRpY1BhcmFtcyA9IGhvaXN0KHVzZXJsYW5kLCAndW5zdGFibGVfZ2V0U3RhdGljUGFyYW1zJyk7XG5leHBvcnQgY29uc3QgdW5zdGFibGVfZ2V0U2VydmVyUHJvcHMgPSBob2lzdCh1c2VybGFuZCwgJ3Vuc3RhYmxlX2dldFNlcnZlclByb3BzJyk7XG5leHBvcnQgY29uc3QgdW5zdGFibGVfZ2V0U2VydmVyU2lkZVByb3BzID0gaG9pc3QodXNlcmxhbmQsICd1bnN0YWJsZV9nZXRTZXJ2ZXJTaWRlUHJvcHMnKTtcbi8vIENyZWF0ZSBhbmQgZXhwb3J0IHRoZSByb3V0ZSBtb2R1bGUgdGhhdCB3aWxsIGJlIGNvbnN1bWVkLlxuZXhwb3J0IGNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IFBhZ2VzUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLlBBR0VTLFxuICAgICAgICBwYWdlOiBcIi9fZXJyb3JcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL19lcnJvclwiLFxuICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGFyZW4ndCB1c2VkIGluIHByb2R1Y3Rpb24uXG4gICAgICAgIGJ1bmRsZVBhdGg6ICcnLFxuICAgICAgICBmaWxlbmFtZTogJydcbiAgICB9LFxuICAgIGNvbXBvbmVudHM6IHtcbiAgICAgICAgLy8gZGVmYXVsdCBleHBvcnQgbWlnaHQgbm90IGV4aXN0IHdoZW4gb3B0aW1pemVkIGZvciBkYXRhIG9ubHlcbiAgICAgICAgQXBwOiBhcHAuZGVmYXVsdCxcbiAgICAgICAgRG9jdW1lbnQ6IGRvY3VtZW50LmRlZmF1bHRcbiAgICB9LFxuICAgIHVzZXJsYW5kXG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFnZXMuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES&page=%2F_error&preferredRegion=&absolutePagePath=private-next-pages%2F_error&absoluteAppPath=private-next-pages%2F_app&absoluteDocumentPath=private-next-pages%2F_document&middlewareConfigBase64=e30%3D!\n");

/***/ }),

/***/ "(pages-dir-node)/./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"(pages-dir-node)/./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _components_TawkToChat__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/TawkToChat */ \"(pages-dir-node)/./components/TawkToChat.js\");\n\n\n\nfunction MyApp(_ref) {\n  var Component = _ref.Component,\n    pageProps = _ref.pageProps;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Component, pageProps), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_TawkToChat__WEBPACK_IMPORTED_MODULE_2__[\"default\"], null));\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQTBCO0FBQ0s7QUFDbUI7QUFFbEQsU0FBU0UsS0FBS0EsQ0FBQUMsSUFBQSxFQUEyQjtFQUFBLElBQXhCQyxTQUFTLEdBQUFELElBQUEsQ0FBVEMsU0FBUztJQUFFQyxTQUFTLEdBQUFGLElBQUEsQ0FBVEUsU0FBUztFQUNuQyxvQkFDRUwsMERBQUEsQ0FBQUEsdURBQUEscUJBQ0VBLDBEQUFBLENBQUNJLFNBQVMsRUFBS0MsU0FBWSxDQUFDLGVBQzVCTCwwREFBQSxDQUFDQyw4REFBVSxNQUFFLENBQ2IsQ0FBQztBQUVQO0FBRUEsaUVBQWVDLEtBQUsiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbmFraWJcXE9uZURyaXZlXFxEZXNrdG9wXFxGaXNjYWxGdXNpb25cXHBhZ2VzXFxfYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgJy4uL3N0eWxlcy9nbG9iYWxzLmNzcyc7XG5pbXBvcnQgVGF3a1RvQ2hhdCBmcm9tICcuLi9jb21wb25lbnRzL1Rhd2tUb0NoYXQnO1xuXG5mdW5jdGlvbiBNeUFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgPFRhd2tUb0NoYXQgLz5cbiAgICA8Lz5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTXlBcHA7ICJdLCJuYW1lcyI6WyJSZWFjdCIsIlRhd2tUb0NoYXQiLCJNeUFwcCIsIl9yZWYiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJjcmVhdGVFbGVtZW50IiwiRnJhZ21lbnQiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.js\n");

/***/ }),

/***/ "(pages-dir-node)/./pages/_document.js":
/*!****************************!*\
  !*** ./pages/_document.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ Document)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/document */ \"(pages-dir-node)/./node_modules/next/document.js\");\n/* harmony import */ var next_document__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_document__WEBPACK_IMPORTED_MODULE_1__);\n\n\nfunction Document() {\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(next_document__WEBPACK_IMPORTED_MODULE_1__.Html, {\n    lang: \"en\",\n    className: \"dark\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(next_document__WEBPACK_IMPORTED_MODULE_1__.Head, null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"meta\", {\n    charSet: \"utf-8\"\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"meta\", {\n    name: \"description\",\n    content: \"FiscalFusion - Financial Management Application\"\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"link\", {\n    rel: \"icon\",\n    href: \"/favicon.ico\"\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"link\", {\n    rel: \"preconnect\",\n    href: \"https://fonts.googleapis.com\"\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"link\", {\n    rel: \"preconnect\",\n    href: \"https://fonts.gstatic.com\",\n    crossOrigin: \"anonymous\"\n  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"link\", {\n    href: \"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap\",\n    rel: \"stylesheet\"\n  })), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(\"body\", {\n    className: \"bg-[#050505] text-white\"\n  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(next_document__WEBPACK_IMPORTED_MODULE_1__.Main, null), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(next_document__WEBPACK_IMPORTED_MODULE_1__.NextScript, null)));\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19kb2N1bWVudC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUEwQjtBQUNtQztBQUU5QyxTQUFTSyxRQUFRQSxDQUFBLEVBQUc7RUFDakMsb0JBQ0VMLDBEQUFBLENBQUNDLCtDQUFJO0lBQUNNLElBQUksRUFBQyxJQUFJO0lBQUNDLFNBQVMsRUFBQztFQUFNLGdCQUM5QlIsMERBQUEsQ0FBQ0UsK0NBQUkscUJBQ0hGLDBEQUFBO0lBQU1TLE9BQU8sRUFBQztFQUFPLENBQUUsQ0FBQyxlQUN4QlQsMERBQUE7SUFBTVUsSUFBSSxFQUFDLGFBQWE7SUFBQ0MsT0FBTyxFQUFDO0VBQWlELENBQUUsQ0FBQyxlQUNyRlgsMERBQUE7SUFBTVksR0FBRyxFQUFDLE1BQU07SUFBQ0MsSUFBSSxFQUFDO0VBQWMsQ0FBRSxDQUFDLGVBQ3ZDYiwwREFBQTtJQUFNWSxHQUFHLEVBQUMsWUFBWTtJQUFDQyxJQUFJLEVBQUM7RUFBOEIsQ0FBRSxDQUFDLGVBQzdEYiwwREFBQTtJQUFNWSxHQUFHLEVBQUMsWUFBWTtJQUFDQyxJQUFJLEVBQUMsMkJBQTJCO0lBQUNDLFdBQVcsRUFBQztFQUFXLENBQUUsQ0FBQyxlQUNsRmQsMERBQUE7SUFDRWEsSUFBSSxFQUFDLGtGQUFrRjtJQUN2RkQsR0FBRyxFQUFDO0VBQVksQ0FDakIsQ0FDRyxDQUFDLGVBQ1BaLDBEQUFBO0lBQU1RLFNBQVMsRUFBQztFQUF5QixnQkFDdkNSLDBEQUFBLENBQUNHLCtDQUFJLE1BQUUsQ0FBQyxlQUNSSCwwREFBQSxDQUFDSSxxREFBVSxNQUFFLENBQ1QsQ0FDRixDQUFDO0FBRVgiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbmFraWJcXE9uZURyaXZlXFxEZXNrdG9wXFxGaXNjYWxGdXNpb25cXHBhZ2VzXFxfZG9jdW1lbnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgSHRtbCwgSGVhZCwgTWFpbiwgTmV4dFNjcmlwdCB9IGZyb20gJ25leHQvZG9jdW1lbnQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRG9jdW1lbnQoKSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxIdG1sIGxhbmc9XCJlblwiIGNsYXNzTmFtZT1cImRhcmtcIj5cclxuICAgICAgPEhlYWQ+XHJcbiAgICAgICAgPG1ldGEgY2hhclNldD1cInV0Zi04XCIgLz5cclxuICAgICAgICA8bWV0YSBuYW1lPVwiZGVzY3JpcHRpb25cIiBjb250ZW50PVwiRmlzY2FsRnVzaW9uIC0gRmluYW5jaWFsIE1hbmFnZW1lbnQgQXBwbGljYXRpb25cIiAvPlxyXG4gICAgICAgIDxsaW5rIHJlbD1cImljb25cIiBocmVmPVwiL2Zhdmljb24uaWNvXCIgLz5cclxuICAgICAgICA8bGluayByZWw9XCJwcmVjb25uZWN0XCIgaHJlZj1cImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb21cIiAvPlxyXG4gICAgICAgIDxsaW5rIHJlbD1cInByZWNvbm5lY3RcIiBocmVmPVwiaHR0cHM6Ly9mb250cy5nc3RhdGljLmNvbVwiIGNyb3NzT3JpZ2luPVwiYW5vbnltb3VzXCIgLz5cclxuICAgICAgICA8bGlua1xyXG4gICAgICAgICAgaHJlZj1cImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9SW50ZXI6d2dodEA0MDA7NTAwOzYwMDs3MDAmZGlzcGxheT1zd2FwXCJcclxuICAgICAgICAgIHJlbD1cInN0eWxlc2hlZXRcIlxyXG4gICAgICAgIC8+XHJcbiAgICAgIDwvSGVhZD5cclxuICAgICAgPGJvZHkgY2xhc3NOYW1lPVwiYmctWyMwNTA1MDVdIHRleHQtd2hpdGVcIj5cclxuICAgICAgICA8TWFpbiAvPlxyXG4gICAgICAgIDxOZXh0U2NyaXB0IC8+XHJcbiAgICAgIDwvYm9keT5cclxuICAgIDwvSHRtbD5cclxuICApO1xyXG59ICJdLCJuYW1lcyI6WyJSZWFjdCIsIkh0bWwiLCJIZWFkIiwiTWFpbiIsIk5leHRTY3JpcHQiLCJEb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJsYW5nIiwiY2xhc3NOYW1lIiwiY2hhclNldCIsIm5hbWUiLCJjb250ZW50IiwicmVsIiwiaHJlZiIsImNyb3NzT3JpZ2luIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_document.js\n");

/***/ }),

/***/ "(pages-dir-node)/./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("(pages-dir-node)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES&page=%2F_error&preferredRegion=&absolutePagePath=private-next-pages%2F_error&absoluteAppPath=private-next-pages%2F_app&absoluteDocumentPath=private-next-pages%2F_document&middlewareConfigBase64=e30%3D!")));
module.exports = __webpack_exports__;

})();