# Nutri Ma Boy — versión 1.0

App web de seguimiento nutricional, gratuita y adaptable a móvil/PC.

## Qué funciona
- Registro manual de alimentos, calorías y macros.
- Lista rápida de alimentos de ejemplo (valores aproximados).
- Panel diario, calorías restantes y macros.
- Historial de peso y promedio de calorías de los últimos 7 días.
- Metas editables.
- Exportación de datos en JSON.
- Almacenamiento local en el navegador.
- Estructura PWA básica para instalar cuando esté publicada con HTTPS.

## Limitaciones importantes
- La foto se puede previsualizar, pero la app NO calcula automáticamente calorías a partir de la imagen ni guarda la imagen con la comida. En esta versión se usa como referencia visual; hay que introducir los valores manualmente.
- Los alimentos de ejemplo son aproximaciones y no sustituyen una etiqueta nutricional.
- Las metas iniciales son ejemplos genéricos; no son una recomendación personalizada.
- Los datos se quedan en el navegador/dispositivo. No se sincronizan automáticamente entre PC y iPhone.

## Cómo probarla en PC
Abrí `index.html` en Chrome, Edge o Firefox. Para que el modo PWA/service worker funcione, publicala por HTTPS o ejecutá un servidor local.

## Cómo instalarla en iPhone
1. Publicá estos archivos en un alojamiento HTTPS (por ejemplo, GitHub Pages).
2. Abrí la URL en Safari en el iPhone.
3. Tocá Compartir → Añadir a pantalla de inicio.

Para uso real en iPhone, los archivos deben estar servidos desde HTTPS; abrir el HTML como archivo local no permite instalarla como PWA.
