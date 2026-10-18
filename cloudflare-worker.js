/** Nutri Ma Boy: proxy seguro para Gemini. Desplegalo como Cloudflare Worker.
 * Configurá GEMINI_API_KEY como Secret en el panel de Cloudflare, nunca en el HTML.
 */
const ALLOWED_ORIGIN = "https://nk59jrhp96-cpu.github.io";
const MODEL = "gemini-2.5-flash";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };
    if (origin && origin !== ALLOWED_ORIGIN) {
      return new Response(JSON.stringify({ error: "Origen no permitido." }), { status: 403, headers: { ...cors, "Content-Type": "application/json" } });
    }
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json({ error: "Usá POST para analizar una foto." }, 405, cors);
    if (!env.GEMINI_API_KEY) return json({ error: "Falta configurar el Secret GEMINI_API_KEY en Cloudflare." }, 500, cors);
    try {
      const body = await request.json();
      const imageBase64 = body.imageBase64;
      const mimeType = body.mimeType || "image/jpeg";
      if (typeof imageBase64 !== "string" || imageBase64.length < 100 || imageBase64.length > 8_000_000) return json({ error: "Imagen inválida o demasiado grande. Elegí una foto más pequeña." }, 400, cors);
      if (!["image/jpeg", "image/png", "image/webp"].includes(mimeType)) return json({ error: "Formato de imagen no compatible." }, 400, cors);
      const prompt = `Analizá esta foto de comida para una app personal de seguimiento nutricional. Identificá los alimentos visibles y estimá una porción típica visible; no afirmes que conocés el peso exacto ni ingredientes que no se ven. Devolvé SOLO JSON válido con esta estructura: {"food":{"name":"nombre breve del plato y alimentos","kcal": número, "protein": número en gramos, "carbs": número en gramos, "fat": número en gramos, "items":[{"name":"alimento","portion":"porción aproximada"}],"notes":"breve advertencia sobre incertidumbre y qué convendría corregir"}}. Los macros deben ser coherentes con las calorías. Si no se distingue comida, devolvé una estimación muy baja de confianza en notes y explicá que se necesita otra foto. No uses Markdown ni bloques de código.`;
      const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: imageBase64 } }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2, maxOutputTokens: 700 }
        })
      });
      const apiData = await apiResponse.json();
      if (!apiResponse.ok) return json({ error: apiData.error?.message || "La API de IA no pudo procesar la foto." }, apiResponse.status === 429 ? 429 : 502, cors);
      const raw = apiData.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "";
      let parsed;
      try { parsed = JSON.parse(raw); } catch { return json({ error: "La IA devolvió una respuesta que no pude interpretar. Intentá otra vez." }, 502, cors); }
      const f = parsed.food;
      if (!f || !Number.isFinite(Number(f.kcal))) return json({ error: "La IA no identificó una comida con suficiente claridad." }, 502, cors);
      const food = {
        name: String(f.name || "Comida estimada por IA").slice(0, 180),
        kcal: clamp(f.kcal, 0, 5000), protein: clamp(f.protein, 0, 300), carbs: clamp(f.carbs, 0, 800), fat: clamp(f.fat, 0, 300),
        items: Array.isArray(f.items) ? f.items.slice(0, 12).map(i => ({ name: String(i.name || "Alimento").slice(0, 100), portion: String(i.portion || "porción estimada").slice(0, 100) })) : [],
        notes: String(f.notes || "Estimación visual; revisá la porción.").slice(0, 500)
      };
      return json({ food }, 200, cors);
    } catch (e) {
      return json({ error: "Solicitud inválida o fallo de conexión. Intentá de nuevo." }, 400, cors);
    }
  }
};
function clamp(value, min, max) { const n = Number(value); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : 0; }
function json(data, status, headers = {}) { return new Response(JSON.stringify(data), { status, headers: { ...headers, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } }); }
