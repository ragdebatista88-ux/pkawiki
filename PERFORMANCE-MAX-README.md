# Optimización máxima segura

- Eliminado `data/wiki-data.js` (~726 KB) de la carga global.
- Índice Pokémon global ligero: 11.3 KB.
- Datos divididos por página en `data/page-data/`.
- Home usa estadísticas precomputadas, no el dataset completo.
- ES/PT-BR base (common + página actual) va inline: cero fetch inicial para traducciones visibles.
- `dynamic.json` queda diferido/idle solo para PT-BR cuando hace falta.
- Imágenes estáticas no críticas usan lazy loading + async decoding.
- Logo del header reducido de 1053px a 192px manteniendo el mismo archivo/nombre.
- Service Worker v13 cachea solo shell ligero y bundles conforme se usan.
- HTML sigue network-first para no mostrar despliegues viejos.
