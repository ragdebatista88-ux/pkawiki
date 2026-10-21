# PKA Casino Worker
Backend de salas en tiempo real para los tres minijuegos del Casino.

## Despliegue
1. Instala Node.js 20+.
2. En esta carpeta: `npm install`
3. Autentica Cloudflare: `npx wrangler login`
4. Despliega sobre el Worker `pka-casino`: `npm run deploy`

El primer deploy crea la clase Durable Object `GameRoom` mediante la migración `v1` y su binding `GAME_ROOMS`.


## PokéMemory (3–4 jugadores)

El frontend se incluye en `public/casino-memory.html`, pero las salas multijugador necesitan desplegar el Worker actualizado: desde `casino-worker`, ejecutar `npm install` y `npx wrangler deploy` con la cuenta Cloudflare que aloja el Worker existente. Subir únicamente la carpeta `public` NO actualiza el backend. El modo individual sí funciona sin desplegar el Worker.
