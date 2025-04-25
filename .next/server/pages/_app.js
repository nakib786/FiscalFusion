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
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./components/TawkToChat.js":
/*!**********************************!*\
  !*** ./components/TawkToChat.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ TawkToChat)\n/* harmony export */ });\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/router */ \"(pages-dir-node)/./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nfunction TawkToChat() {\n  var router = (0,next_router__WEBPACK_IMPORTED_MODULE_0__.useRouter)();\n\n  // Check if current page is dashboard or related pages\n  var isDashboardArea = router.pathname.includes('/dashboard') || router.pathname.includes('/clients') || router.pathname.includes('/invoices') || router.pathname.includes('/expenses') || router.pathname.includes('/reports') || router.pathname.includes('/cashflow') || router.pathname.includes('/performance') || router.pathname.includes('/planner') || router.pathname.includes('/projects') || router.pathname.includes('/transactions') || router.pathname.includes('/accounts') || router.pathname.includes('/budgeting');\n  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {\n    // Only load tawk.to if not in dashboard area\n    if (!isDashboardArea) {\n      var s1 = document.createElement('script');\n      s1.async = true;\n      s1.src = 'https://embed.tawk.to/67ffeda8d825181910e0cd9c/1ip12mtt0';\n      s1.charset = 'UTF-8';\n      s1.setAttribute('crossorigin', '*');\n      document.body.appendChild(s1);\n      return function () {\n        // Clean up script when component unmounts\n        if (document.body.contains(s1)) {\n          document.body.removeChild(s1);\n        }\n\n        // Also remove any tawk.to elements that might be created\n        var tawkElements = document.querySelectorAll('iframe[title*=\"chat\"]');\n        tawkElements.forEach(function (el) {\n          if (el.parentNode) {\n            el.parentNode.removeChild(el);\n          }\n        });\n      };\n    }\n  }, [router.pathname, isDashboardArea]);\n\n  // This component doesn't render anything visible\n  return null;\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL2NvbXBvbmVudHMvVGF3a1RvQ2hhdC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUF3QztBQUNOO0FBRW5CLFNBQVNFLFVBQVVBLENBQUEsRUFBRztFQUNuQyxJQUFNQyxNQUFNLEdBQUdILHNEQUFTLENBQUMsQ0FBQzs7RUFFMUI7RUFDQSxJQUFNSSxlQUFlLEdBQUdELE1BQU0sQ0FBQ0UsUUFBUSxDQUFDQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQ3RDSCxNQUFNLENBQUNFLFFBQVEsQ0FBQ0MsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUNwQ0gsTUFBTSxDQUFDRSxRQUFRLENBQUNDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFDckNILE1BQU0sQ0FBQ0UsUUFBUSxDQUFDQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQ3JDSCxNQUFNLENBQUNFLFFBQVEsQ0FBQ0MsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUNwQ0gsTUFBTSxDQUFDRSxRQUFRLENBQUNDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFDckNILE1BQU0sQ0FBQ0UsUUFBUSxDQUFDQyxRQUFRLENBQUMsY0FBYyxDQUFDLElBQ3hDSCxNQUFNLENBQUNFLFFBQVEsQ0FBQ0MsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUNwQ0gsTUFBTSxDQUFDRSxRQUFRLENBQUNDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFDckNILE1BQU0sQ0FBQ0UsUUFBUSxDQUFDQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQ3pDSCxNQUFNLENBQUNFLFFBQVEsQ0FBQ0MsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUNyQ0gsTUFBTSxDQUFDRSxRQUFRLENBQUNDLFFBQVEsQ0FBQyxZQUFZLENBQUM7RUFFOURMLGdEQUFTLENBQUMsWUFBTTtJQUNkO0lBQ0EsSUFBSSxDQUFDRyxlQUFlLEVBQUU7TUFDcEIsSUFBTUcsRUFBRSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxRQUFRLENBQUM7TUFDM0NGLEVBQUUsQ0FBQ0csS0FBSyxHQUFHLElBQUk7TUFDZkgsRUFBRSxDQUFDSSxHQUFHLEdBQUcsMERBQTBEO01BQ25FSixFQUFFLENBQUNLLE9BQU8sR0FBRyxPQUFPO01BQ3BCTCxFQUFFLENBQUNNLFlBQVksQ0FBQyxhQUFhLEVBQUUsR0FBRyxDQUFDO01BRW5DTCxRQUFRLENBQUNNLElBQUksQ0FBQ0MsV0FBVyxDQUFDUixFQUFFLENBQUM7TUFFN0IsT0FBTyxZQUFNO1FBQ1g7UUFDQSxJQUFJQyxRQUFRLENBQUNNLElBQUksQ0FBQ0UsUUFBUSxDQUFDVCxFQUFFLENBQUMsRUFBRTtVQUM5QkMsUUFBUSxDQUFDTSxJQUFJLENBQUNHLFdBQVcsQ0FBQ1YsRUFBRSxDQUFDO1FBQy9COztRQUVBO1FBQ0EsSUFBTVcsWUFBWSxHQUFHVixRQUFRLENBQUNXLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDO1FBQ3ZFRCxZQUFZLENBQUNFLE9BQU8sQ0FBQyxVQUFBQyxFQUFFLEVBQUk7VUFDekIsSUFBSUEsRUFBRSxDQUFDQyxVQUFVLEVBQUU7WUFDakJELEVBQUUsQ0FBQ0MsVUFBVSxDQUFDTCxXQUFXLENBQUNJLEVBQUUsQ0FBQztVQUMvQjtRQUNGLENBQUMsQ0FBQztNQUNKLENBQUM7SUFDSDtFQUNGLENBQUMsRUFBRSxDQUFDbEIsTUFBTSxDQUFDRSxRQUFRLEVBQUVELGVBQWUsQ0FBQyxDQUFDOztFQUV0QztFQUNBLE9BQU8sSUFBSTtBQUNiIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXG5ha2liXFxPbmVEcml2ZVxcRGVza3RvcFxcRmlzY2FsRnVzaW9uXFxjb21wb25lbnRzXFxUYXdrVG9DaGF0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJztcclxuaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVGF3a1RvQ2hhdCgpIHtcclxuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKTtcclxuICBcclxuICAvLyBDaGVjayBpZiBjdXJyZW50IHBhZ2UgaXMgZGFzaGJvYXJkIG9yIHJlbGF0ZWQgcGFnZXNcclxuICBjb25zdCBpc0Rhc2hib2FyZEFyZWEgPSByb3V0ZXIucGF0aG5hbWUuaW5jbHVkZXMoJy9kYXNoYm9hcmQnKSB8fCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXIucGF0aG5hbWUuaW5jbHVkZXMoJy9jbGllbnRzJykgfHwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVyLnBhdGhuYW1lLmluY2x1ZGVzKCcvaW52b2ljZXMnKSB8fCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXIucGF0aG5hbWUuaW5jbHVkZXMoJy9leHBlbnNlcycpIHx8IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlci5wYXRobmFtZS5pbmNsdWRlcygnL3JlcG9ydHMnKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlci5wYXRobmFtZS5pbmNsdWRlcygnL2Nhc2hmbG93JykgfHxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXIucGF0aG5hbWUuaW5jbHVkZXMoJy9wZXJmb3JtYW5jZScpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVyLnBhdGhuYW1lLmluY2x1ZGVzKCcvcGxhbm5lcicpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVyLnBhdGhuYW1lLmluY2x1ZGVzKCcvcHJvamVjdHMnKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlci5wYXRobmFtZS5pbmNsdWRlcygnL3RyYW5zYWN0aW9ucycpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcm91dGVyLnBhdGhuYW1lLmluY2x1ZGVzKCcvYWNjb3VudHMnKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJvdXRlci5wYXRobmFtZS5pbmNsdWRlcygnL2J1ZGdldGluZycpO1xyXG5cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgLy8gT25seSBsb2FkIHRhd2sudG8gaWYgbm90IGluIGRhc2hib2FyZCBhcmVhXHJcbiAgICBpZiAoIWlzRGFzaGJvYXJkQXJlYSkge1xyXG4gICAgICBjb25zdCBzMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgICBzMS5hc3luYyA9IHRydWU7XHJcbiAgICAgIHMxLnNyYyA9ICdodHRwczovL2VtYmVkLnRhd2sudG8vNjdmZmVkYThkODI1MTgxOTEwZTBjZDljLzFpcDEybXR0MCc7XHJcbiAgICAgIHMxLmNoYXJzZXQgPSAnVVRGLTgnO1xyXG4gICAgICBzMS5zZXRBdHRyaWJ1dGUoJ2Nyb3Nzb3JpZ2luJywgJyonKTtcclxuICAgICAgXHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoczEpO1xyXG4gICAgICBcclxuICAgICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICAvLyBDbGVhbiB1cCBzY3JpcHQgd2hlbiBjb21wb25lbnQgdW5tb3VudHNcclxuICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5jb250YWlucyhzMSkpIHtcclxuICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoczEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBBbHNvIHJlbW92ZSBhbnkgdGF3ay50byBlbGVtZW50cyB0aGF0IG1pZ2h0IGJlIGNyZWF0ZWRcclxuICAgICAgICBjb25zdCB0YXdrRWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdpZnJhbWVbdGl0bGUqPVwiY2hhdFwiXScpO1xyXG4gICAgICAgIHRhd2tFbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcclxuICAgICAgICAgIGlmIChlbC5wYXJlbnROb2RlKSB7XHJcbiAgICAgICAgICAgIGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWwpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0sIFtyb3V0ZXIucGF0aG5hbWUsIGlzRGFzaGJvYXJkQXJlYV0pO1xyXG5cclxuICAvLyBUaGlzIGNvbXBvbmVudCBkb2Vzbid0IHJlbmRlciBhbnl0aGluZyB2aXNpYmxlXHJcbiAgcmV0dXJuIG51bGw7XHJcbn0gIl0sIm5hbWVzIjpbInVzZVJvdXRlciIsInVzZUVmZmVjdCIsIlRhd2tUb0NoYXQiLCJyb3V0ZXIiLCJpc0Rhc2hib2FyZEFyZWEiLCJwYXRobmFtZSIsImluY2x1ZGVzIiwiczEiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJhc3luYyIsInNyYyIsImNoYXJzZXQiLCJzZXRBdHRyaWJ1dGUiLCJib2R5IiwiYXBwZW5kQ2hpbGQiLCJjb250YWlucyIsInJlbW92ZUNoaWxkIiwidGF3a0VsZW1lbnRzIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJlbCIsInBhcmVudE5vZGUiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./components/TawkToChat.js\n");

/***/ }),

/***/ "(pages-dir-node)/./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"(pages-dir-node)/./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _components_TawkToChat__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/TawkToChat */ \"(pages-dir-node)/./components/TawkToChat.js\");\n\n\n\nfunction MyApp(_ref) {\n  var Component = _ref.Component,\n    pageProps = _ref.pageProps;\n  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement((react__WEBPACK_IMPORTED_MODULE_0___default().Fragment), null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(Component, pageProps), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_0___default().createElement(_components_TawkToChat__WEBPACK_IMPORTED_MODULE_2__[\"default\"], null));\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3BhZ2VzL19hcHAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQTBCO0FBQ0s7QUFDbUI7QUFFbEQsU0FBU0UsS0FBS0EsQ0FBQUMsSUFBQSxFQUEyQjtFQUFBLElBQXhCQyxTQUFTLEdBQUFELElBQUEsQ0FBVEMsU0FBUztJQUFFQyxTQUFTLEdBQUFGLElBQUEsQ0FBVEUsU0FBUztFQUNuQyxvQkFDRUwsMERBQUEsQ0FBQUEsdURBQUEscUJBQ0VBLDBEQUFBLENBQUNJLFNBQVMsRUFBS0MsU0FBWSxDQUFDLGVBQzVCTCwwREFBQSxDQUFDQyw4REFBVSxNQUFFLENBQ2IsQ0FBQztBQUVQO0FBRUEsaUVBQWVDLEtBQUsiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcbmFraWJcXE9uZURyaXZlXFxEZXNrdG9wXFxGaXNjYWxGdXNpb25cXHBhZ2VzXFxfYXBwLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgJy4uL3N0eWxlcy9nbG9iYWxzLmNzcyc7XG5pbXBvcnQgVGF3a1RvQ2hhdCBmcm9tICcuLi9jb21wb25lbnRzL1Rhd2tUb0NoYXQnO1xuXG5mdW5jdGlvbiBNeUFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgPFRhd2tUb0NoYXQgLz5cbiAgICA8Lz5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTXlBcHA7ICJdLCJuYW1lcyI6WyJSZWFjdCIsIlRhd2tUb0NoYXQiLCJNeUFwcCIsIl9yZWYiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJjcmVhdGVFbGVtZW50IiwiRnJhZ21lbnQiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./pages/_app.js\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("(pages-dir-node)/./pages/_app.js")));
module.exports = __webpack_exports__;

})();