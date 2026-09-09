# PKA Wiki — arquitectura bilingüe

La traducción ya no depende de sustituciones automáticas por palabras.

- `public/lang/es/common.json` y `public/lang/pt-BR/common.json`: textos compartidos.
- `public/lang/es/pages/*.json` y `public/lang/pt-BR/pages/*.json`: contenido específico de cada página.
- `public/lang/es/dynamic.json` y `public/lang/pt-BR/dynamic.json`: textos renderizados desde datos/JavaScript.
- Pokémon, NPCs, ciudades, ítems, outfits y addons se mantienen como datos compartidos y no se traducen.
- `public/assets/i18n.js` cambia idioma en vivo sin recargar y guarda la preferencia en `localStorage`.
- `scripts/check-translations.js` comprueba que ambos idiomas tengan exactamente las mismas claves.

Validación:
```bash
node scripts/check-translations.js
```
