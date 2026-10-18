NUTRI MA BOY v2.1 — IA de fotos (configuración gratuita)
=======================================================

La función de análisis de fotos necesita un servicio de IA. Esta versión incluye la interfaz y un proxy seguro para usar Gemini API desde un Cloudflare Worker. Los niveles gratuitos tienen límites y pueden cambiar; no se garantiza disponibilidad ilimitada ni que todos los modelos estén siempre en el nivel gratis.

ANTES DE EMPEZAR
- No pongás la clave API dentro de index.html ni en GitHub.
- En el nivel gratuito de Gemini API, Google indica que el contenido puede usarse para mejorar sus productos. No subas fotos con información privada, rostros o documentos.
- La IA solo estima porciones y macros desde la imagen; revisá los resultados antes de guardarlos.

PASO 1 — Crear clave de Gemini
1. Abrí https://aistudio.google.com/apikey con tu cuenta Google.
2. Creá una API key para Gemini API y copiála temporalmente en un lugar seguro.
3. No la compartás ni la pegues en el repositorio.

PASO 2 — Crear Cloudflare Worker gratuito
1. Abrí https://dash.cloudflare.com/ y creá una cuenta si no tenés.
2. Entrá a Workers & Pages y creá un Worker nuevo (opción de crear/escribir código).
3. Pegá el contenido completo de cloudflare-worker.js y desplegalo.
4. En la configuración del Worker buscá Variables and Secrets / Secrets y añadí un secret llamado exactamente GEMINI_API_KEY con la clave que creaste. Guardá y redeploy si te lo pide.
5. Copiá la URL pública del Worker; normalmente se parece a https://nombre-del-worker.nombre-de-cuenta.workers.dev.

PASO 3 — Conectar la web
1. Abrí index.html.
2. Buscá esta línea: const AI_ENDPOINT = 'PEGAR_AQUI_URL_DE_CLOUDFLARE_WORKER';
3. Reemplazá solo el texto PEGAR_AQUI_URL_DE_CLOUDFLARE_WORKER por la URL completa de tu Worker, dejando las comillas.
4. Subí el index.html actualizado a la raíz de tu repositorio GitHub y hacé Commit changes.
5. Esperá a que GitHub Pages se actualice y recargá Nutri Ma Boy.

PRUEBA
- Abrí Añadir comida, tomá una foto clara con buena luz y pulsá “Analizar foto con IA”.
- Si aparece un error 429, alcanzaste un límite de uso temporal; esperá y probá después.
- Si aparece error de API, revisá que el secret se llame GEMINI_API_KEY, que la clave esté activa y que tu proyecto tenga acceso al nivel gratuito.
- El Worker permite solicitudes desde https://nk59jrhp96-cpu.github.io. Si cambiás el dominio de GitHub Pages, actualizá ALLOWED_ORIGIN en cloudflare-worker.js.

PRIVACIDAD Y COSTO
- Cloudflare Workers ofrece un plan gratis con límites de solicitudes; Gemini API ofrece un nivel gratuito limitado para algunos modelos/regiones, según su página oficial. Los límites y disponibilidad pueden cambiar.
- El Worker no guarda intencionalmente las fotos ni la respuesta. La imagen se envía a Google para análisis.
- En el nivel gratuito de Gemini, Google señala que el contenido puede usarse para mejorar sus productos; revisá los términos vigentes antes de usarlo.
- Tus registros de comida y peso siguen guardándose localmente en el navegador; no se sincronizan automáticamente entre iPhone y PC.

Documentación oficial:
https://ai.google.dev/gemini-api/docs/pricing
https://ai.google.dev/gemini-api/docs
https://developers.cloudflare.com/workers/platform/limits/
