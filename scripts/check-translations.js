const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'../public/lang');
function walk(dir){let out=[];for(const n of fs.readdirSync(dir)){const p=path.join(dir,n);const s=fs.statSync(p);if(s.isDirectory())out=out.concat(walk(p));else if(n.endsWith('.json'))out.push(p);}return out;}
const es=walk(path.join(root,'es'));let errors=0,total=0;
for(const ep of es){const rel=path.relative(path.join(root,'es'),ep),pp=path.join(root,'pt-BR',rel);if(!fs.existsSync(pp)){console.error('FALTA ARCHIVO PT-BR:',rel);errors++;continue;}const a=JSON.parse(fs.readFileSync(ep,'utf8')),b=JSON.parse(fs.readFileSync(pp,'utf8'));const ak=Object.keys(a),bk=Object.keys(b);total+=ak.length;for(const k of ak)if(!(k in b)){console.error('FALTA CLAVE PT-BR:',rel,k);errors++;}for(const k of bk)if(!(k in a)){console.error('CLAVE EXTRA PT-BR:',rel,k);errors++;}}
console.log(`Claves ES verificadas: ${total}`);console.log(errors?`Errores: ${errors}`:'OK: paridad ES / PT-BR completa');process.exitCode=errors?1:0;
