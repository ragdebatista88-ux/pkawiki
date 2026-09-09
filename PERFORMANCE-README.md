# Optimización de rendimiento

Esta versión mantiene el diseño y el sistema ES / PT-BR, pero reduce trabajo y descargas bloqueantes:

- `i18n.js` carga primero solo `common.json` + el JSON de la página actual.
- `dynamic.json` (el catálogo grande) se difiere hasta después del primer render y solo se carga cuando el idioma es PT-BR.
- Los JSON se reutilizan con caché en memoria y caché HTTP (`force-cache`).
- Las mutaciones del DOM se agrupan por frame para evitar recorrer la página repetidamente.
- Se eliminaron los dos barridos globales diferidos que antes se ejecutaban a los 150 ms y 600 ms.
- El Service Worker usa stale-while-revalidate para CSS, JS, JSON e imágenes: las visitas siguientes responden desde caché y actualizan en segundo plano.
- Los JSON estáticos que usaban `no-store` ahora pueden beneficiarse de caché.

No se alteró la estructura visual ni el contenido de la wiki.
