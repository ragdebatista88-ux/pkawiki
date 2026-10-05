# PKA Casino Worker
Backend de salas en tiempo real para los tres minijuegos del Casino.

## Despliegue
1. Instala Node.js 20+.
2. En esta carpeta: `npm install`
3. Autentica Cloudflare: `npx wrangler login`
4. Despliega sobre el Worker `pka-casino`: `npm run deploy`

El primer deploy crea la clase Durable Object `GameRoom` mediante la migración `v1` y su binding `GAME_ROOMS`.
