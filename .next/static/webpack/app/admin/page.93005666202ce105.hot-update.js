/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/admin/page",{

/***/ "(app-pages-browser)/./src/components/Spinner.tsx":
/*!************************************!*\
  !*** ./src/components/Spinner.tsx ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



;
    // Wrapped in an IIFE to avoid polluting the global scope
    ;
    (function () {
        var _a, _b;
        // Legacy CSS implementations will `eval` browser code in a Node.js context
        // to extract CSS. For backwards compatibility, we need to check we're in a
        // browser context before continuing.
        if (typeof self !== 'undefined' &&
            // AMP / No-JS mode does not inject these helpers:
            '$RefreshHelpers$' in self) {
            // @ts-ignore __webpack_module__ is global
            var currentExports = module.exports;
            // @ts-ignore __webpack_module__ is global
            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;
            // This cannot happen in MainTemplate because the exports mismatch between
            // templating and execution.
            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);
            // A module can be accepted automatically based on its exports, e.g. when
            // it is a Refresh Boundary.
            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {
                // Save the previous exports signature on update so we can compare the boundary
                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)
                module.hot.dispose(function (data) {
                    data.prevSignature =
                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);
                });
                // Unconditionally accept an update to this module, we'll check if it's
                // still a Refresh Boundary later.
                // @ts-ignore importMeta is replaced in the loader
                module.hot.accept();
                // This field is set when the previous version of this module was a
                // Refresh Boundary, letting us know we need to check for invalidation or
                // enqueue an update.
                if (prevSignature !== null) {
                    // A boundary can become ineligible if its exports are incompatible
                    // with the previous exports.
                    //
                    // For example, if you add/remove/change exports, we'll want to
                    // re-execute the importing modules, and force those components to
                    // re-render. Similarly, if you convert a class component to a
                    // function, we want to invalidate the boundary.
                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {
                        module.hot.invalidate();
                    }
                    else {
                        self.$RefreshHelpers$.scheduleUpdate();
                    }
                }
            }
            else {
                // Since we just executed the code for the module, it's possible that the
                // new exports made it ineligible for being a boundary.
                // We only care about the case when we were _previously_ a boundary,
                // because we already accepted this update (accidental side effect).
                var isNoLongerABoundary = prevSignature !== null;
                if (isNoLongerABoundary) {
                    module.hot.invalidate();
                }
            }
        }
    })();


/***/ }),

/***/ "(app-pages-browser)/./src/components/withAdminAuth.tsx":
/*!******************************************!*\
  !*** ./src/components/withAdminAuth.tsx ***!
  \******************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ withAdminAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth/react */ \"(app-pages-browser)/./node_modules/next-auth/react/index.js\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/navigation */ \"(app-pages-browser)/./node_modules/next/dist/api/navigation.js\");\n/* harmony import */ var _Spinner__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Spinner */ \"(app-pages-browser)/./src/components/Spinner.tsx\");\n/* harmony import */ var _Spinner__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Spinner__WEBPACK_IMPORTED_MODULE_3__);\n/* __next_internal_client_entry_do_not_use__ default auto */ \n\n\n\nfunction withAdminAuth(Component) {\n    var _s = $RefreshSig$();\n    return _s(function WithAdminAuth(props) {\n        var _session_user, _session_user1;\n        _s();\n        const { data: session, status } = (0,next_auth_react__WEBPACK_IMPORTED_MODULE_1__.useSession)();\n        const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n        console.log('Session status:', status);\n        console.log('Session data:', session);\n        if (status === 'loading') {\n            console.log('Đang tải session...');\n            return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"flex justify-center items-center min-h-screen\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((_Spinner__WEBPACK_IMPORTED_MODULE_3___default()), {\n                    size: \"lg\"\n                }, void 0, false, {\n                    fileName: \"C:\\\\VF\\\\0.Tool\\\\XLab_Web\\\\src\\\\components\\\\withAdminAuth.tsx\",\n                    lineNumber: 21,\n                    columnNumber: 21\n                }, this)\n            }, void 0, false, {\n                fileName: \"C:\\\\VF\\\\0.Tool\\\\XLab_Web\\\\src\\\\components\\\\withAdminAuth.tsx\",\n                lineNumber: 20,\n                columnNumber: 17\n            }, this);\n        }\n        // User không đăng nhập, chuyển về trang login\n        if (status === 'unauthenticated' || !session) {\n            console.log('Người dùng chưa đăng nhập');\n            router.push('/login?callbackUrl=/admin');\n            return null;\n        }\n        console.log('Email của người dùng:', (_session_user = session.user) === null || _session_user === void 0 ? void 0 : _session_user.email);\n        // Kiểm tra quyền admin\n        const isAdmin = ((_session_user1 = session.user) === null || _session_user1 === void 0 ? void 0 : _session_user1.isAdmin) === true;\n        console.log('Admin status:', isAdmin);\n        if (!isAdmin) {\n            console.log('Người dùng không có quyền admin');\n            router.push('/access-denied');\n            return null;\n        }\n        // Người dùng có quyền admin, trả về component\n        return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...props\n        }, void 0, false, {\n            fileName: \"C:\\\\VF\\\\0.Tool\\\\XLab_Web\\\\src\\\\components\\\\withAdminAuth.tsx\",\n            lineNumber: 46,\n            columnNumber: 16\n        }, this);\n    }, \"MjqiMjtatd9LiD3Cp5ZtwJSts4s=\", false, function() {\n        return [\n            next_auth_react__WEBPACK_IMPORTED_MODULE_1__.useSession,\n            next_navigation__WEBPACK_IMPORTED_MODULE_2__.useRouter\n        ];\n    });\n}\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9jb21wb25lbnRzL3dpdGhBZG1pbkF1dGgudHN4IiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBRTZDO0FBQ0Q7QUFDWjtBQUVqQixTQUFTRyxjQUNwQkMsU0FBaUM7O0lBRWpDLFVBQU8sU0FBU0MsY0FBY0MsS0FBUTtZQXVCR0MsZUFHckJBOztRQXpCaEIsTUFBTSxFQUFFQyxNQUFNRCxPQUFPLEVBQUVFLE1BQU0sRUFBRSxHQUFHVCwyREFBVUE7UUFDNUMsTUFBTVUsU0FBU1QsMERBQVNBO1FBRXhCVSxRQUFRQyxHQUFHLENBQUMsbUJBQW1CSDtRQUMvQkUsUUFBUUMsR0FBRyxDQUFDLGlCQUFpQkw7UUFFN0IsSUFBSUUsV0FBVyxXQUFXO1lBQ3RCRSxRQUFRQyxHQUFHLENBQUM7WUFDWixxQkFDSSw4REFBQ0M7Z0JBQUlDLFdBQVU7MEJBQ1gsNEVBQUNaLGlEQUFPQTtvQkFBQ2EsTUFBSzs7Ozs7Ozs7Ozs7UUFHMUI7UUFFQSw4Q0FBOEM7UUFDOUMsSUFBSU4sV0FBVyxxQkFBcUIsQ0FBQ0YsU0FBUztZQUMxQ0ksUUFBUUMsR0FBRyxDQUFDO1lBQ1pGLE9BQU9NLElBQUksQ0FBQztZQUNaLE9BQU87UUFDWDtRQUVBTCxRQUFRQyxHQUFHLENBQUMsMEJBQXlCTCxnQkFBQUEsUUFBUVUsSUFBSSxjQUFaVixvQ0FBQUEsY0FBY1csS0FBSztRQUV4RCx1QkFBdUI7UUFDdkIsTUFBTUMsVUFBVVosRUFBQUEsaUJBQUFBLFFBQVFVLElBQUksY0FBWlYscUNBQUFBLGVBQWNZLE9BQU8sTUFBSztRQUMxQ1IsUUFBUUMsR0FBRyxDQUFDLGlCQUFpQk87UUFFN0IsSUFBSSxDQUFDQSxTQUFTO1lBQ1ZSLFFBQVFDLEdBQUcsQ0FBQztZQUNaRixPQUFPTSxJQUFJLENBQUM7WUFDWixPQUFPO1FBQ1g7UUFFQSw4Q0FBOEM7UUFDOUMscUJBQU8sOERBQUNaO1lBQVcsR0FBR0UsS0FBSzs7Ozs7O0lBQy9COztZQXBDc0NOLHVEQUFVQTtZQUM3QkMsc0RBQVNBOzs7QUFvQ2hDIiwic291cmNlcyI6WyJDOlxcVkZcXDAuVG9vbFxcWExhYl9XZWJcXHNyY1xcY29tcG9uZW50c1xcd2l0aEFkbWluQXV0aC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnO1xyXG5cclxuaW1wb3J0IHsgdXNlU2Vzc2lvbiB9IGZyb20gJ25leHQtYXV0aC9yZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvbmF2aWdhdGlvbic7XHJcbmltcG9ydCBTcGlubmVyIGZyb20gJy4vU3Bpbm5lcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB3aXRoQWRtaW5BdXRoPFAgZXh0ZW5kcyBvYmplY3Q+KFxyXG4gICAgQ29tcG9uZW50OiBSZWFjdC5Db21wb25lbnRUeXBlPFA+XHJcbikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIFdpdGhBZG1pbkF1dGgocHJvcHM6IFApIHtcclxuICAgICAgICBjb25zdCB7IGRhdGE6IHNlc3Npb24sIHN0YXR1cyB9ID0gdXNlU2Vzc2lvbigpO1xyXG4gICAgICAgIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZygnU2Vzc2lvbiBzdGF0dXM6Jywgc3RhdHVzKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnU2Vzc2lvbiBkYXRhOicsIHNlc3Npb24pO1xyXG5cclxuICAgICAgICBpZiAoc3RhdHVzID09PSAnbG9hZGluZycpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ8SQYW5nIHThuqNpIHNlc3Npb24uLi4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBqdXN0aWZ5LWNlbnRlciBpdGVtcy1jZW50ZXIgbWluLWgtc2NyZWVuXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPFNwaW5uZXIgc2l6ZT1cImxnXCIgLz5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVXNlciBraMO0bmcgxJHEg25nIG5o4bqtcCwgY2h1eeG7g24gduG7gSB0cmFuZyBsb2dpblxyXG4gICAgICAgIGlmIChzdGF0dXMgPT09ICd1bmF1dGhlbnRpY2F0ZWQnIHx8ICFzZXNzaW9uKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdOZ8aw4budaSBkw7luZyBjaMawYSDEkcSDbmcgbmjhuq1wJyk7XHJcbiAgICAgICAgICAgIHJvdXRlci5wdXNoKCcvbG9naW4/Y2FsbGJhY2tVcmw9L2FkbWluJyk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ0VtYWlsIGPhu6dhIG5nxrDhu51pIGTDuW5nOicsIHNlc3Npb24udXNlcj8uZW1haWwpO1xyXG5cclxuICAgICAgICAvLyBLaeG7g20gdHJhIHF1eeG7gW4gYWRtaW5cclxuICAgICAgICBjb25zdCBpc0FkbWluID0gc2Vzc2lvbi51c2VyPy5pc0FkbWluID09PSB0cnVlO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdBZG1pbiBzdGF0dXM6JywgaXNBZG1pbik7XHJcblxyXG4gICAgICAgIGlmICghaXNBZG1pbikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnTmfGsOG7nWkgZMO5bmcga2jDtG5nIGPDsyBxdXnhu4FuIGFkbWluJyk7XHJcbiAgICAgICAgICAgIHJvdXRlci5wdXNoKCcvYWNjZXNzLWRlbmllZCcpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE5nxrDhu51pIGTDuW5nIGPDsyBxdXnhu4FuIGFkbWluLCB0cuG6oyB24buBIGNvbXBvbmVudFxyXG4gICAgICAgIHJldHVybiA8Q29tcG9uZW50IHsuLi5wcm9wc30gLz47XHJcbiAgICB9O1xyXG59ICJdLCJuYW1lcyI6WyJ1c2VTZXNzaW9uIiwidXNlUm91dGVyIiwiU3Bpbm5lciIsIndpdGhBZG1pbkF1dGgiLCJDb21wb25lbnQiLCJXaXRoQWRtaW5BdXRoIiwicHJvcHMiLCJzZXNzaW9uIiwiZGF0YSIsInN0YXR1cyIsInJvdXRlciIsImNvbnNvbGUiLCJsb2ciLCJkaXYiLCJjbGFzc05hbWUiLCJzaXplIiwicHVzaCIsInVzZXIiLCJlbWFpbCIsImlzQWRtaW4iXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/components/withAdminAuth.tsx\n"));

/***/ })

});