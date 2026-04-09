(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/ClerkClientProvider.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClerkClientProvider",
    ()=>ClerkClientProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$themes$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/themes/dist/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function ClerkClientProvider({ children }) {
    _s();
    const [isDarkMode, setIsDarkMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ClerkClientProvider.useEffect": ()=>{
            setIsDarkMode(!document.body.classList.contains('light-mode'));
            const observer = new MutationObserver({
                "ClerkClientProvider.useEffect": (mutations)=>{
                    mutations.forEach({
                        "ClerkClientProvider.useEffect": (mutation)=>{
                            if (mutation.attributeName === 'class') {
                                setIsDarkMode(!document.body.classList.contains('light-mode'));
                            }
                        }
                    }["ClerkClientProvider.useEffect"]);
                }
            }["ClerkClientProvider.useEffect"]);
            observer.observe(document.body, {
                attributes: true
            });
            return ({
                "ClerkClientProvider.useEffect": ()=>observer.disconnect()
            })["ClerkClientProvider.useEffect"];
        }
    }["ClerkClientProvider.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["ClerkProvider"], {
        appearance: {
            baseTheme: isDarkMode ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$themes$2f$dist$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dark"] : undefined
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/app/ClerkClientProvider.jsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_s(ClerkClientProvider, "wcg0iE8CdipV533flP6RCfuqOPI=");
_c = ClerkClientProvider;
var _c;
__turbopack_context__.k.register(_c, "ClerkClientProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_ClerkClientProvider_jsx_0fsg6vx._.js.map