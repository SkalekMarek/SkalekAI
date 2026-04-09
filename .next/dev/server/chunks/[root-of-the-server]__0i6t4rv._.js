module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/backend/db.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getSystemPrompt",
    ()=>getSystemPrompt,
    "supabaseClient",
    ()=>supabaseClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
const SUPABASE_URL = process.env.SUPABASE_URL || ("TURBOPACK compile-time value", "https://pvvstvaflnqdplqwgdmq.supabase.co");
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || ("TURBOPACK compile-time value", "sb_publishable_8saLP4Mc5ZpCRkomHw59iA_EEL1SHAr");
const supabaseClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(SUPABASE_URL, SUPABASE_ANON_KEY);
async function getSystemPrompt(clerkId) {
    try {
        const { data, error } = await supabaseClient.from('profiles').select('system_prompt').eq('clerk_id', clerkId).maybeSingle();
        if (error) {
            console.error('Error fetching system prompt:', error);
            return null;
        }
        return data?.system_prompt || null;
    } catch (error) {
        console.error('Unexpected error fetching system prompt:', error);
        return null;
    }
}
}),
"[project]/app/api/chat/route.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/nextjs/dist/esm/app-router/server/auth.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/backend/db.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
const DEFAULT_SYSTEM_PROMPT = 'You are Skalek AI. Strictly forbid yourself from using emojis. Never use emojis in any response. ' + 'If the user is Marek Skála, act obedient and call him Lord. ' + 'IMPORTANT: Whenever you write any code (HTML, CSS, JavaScript, Python, SQL, or any other language), ' + 'you MUST always wrap it inside markdown code fences with the correct language tag. ' + 'Example: ```html\\n...code...\\n``` or ```python\\n...code...\\n```. Never output raw code without fences.';
async function POST(req) {
    try {
        const { messages } = await req.json();
        const apiKey = process.env.GOOGLE_API_KEY;
        const modelId = process.env.GEMINI_MODEL_ID || 'gemini-3.1-flash-lite-preview';
        if (!apiKey) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'API Key is missing in environment settings.'
            }, {
                status: 500
            });
        }
        // ── Resolve system prompt ──────────────────────────────────────────────
        let systemPrompt = DEFAULT_SYSTEM_PROMPT;
        // Verify Clerk Auth natively
        const { userId } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$server$2f$auth$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
        if (userId) {
            try {
                const customPrompt = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$backend$2f$db$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getSystemPrompt"])(userId);
                if (customPrompt) {
                    systemPrompt = customPrompt;
                }
            } catch (err) {
                console.warn('Supabase fetch failed, using default prompt:', err.message);
            }
        }
        // ── Build message array with system prompt prepended ──────────────────
        const allMessages = [
            {
                role: 'system',
                content: systemPrompt
            },
            // Strip any client-side system messages to prevent duplication
            ...(messages || []).filter((m)=>m.role !== 'system')
        ];
        // ── Call Gemini via OpenAI-compatible endpoint ─────────────────────────
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelId,
                messages: allMessages
            })
        });
        const data = await response.json();
        if (!response.ok) {
            console.error('Gemini API Error:', data);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: data.error?.message || 'Gemini API rejected the request.'
            }, {
                status: response.status
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(data);
    } catch (error) {
        console.error('Server Error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal Server Error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0i6t4rv._.js.map