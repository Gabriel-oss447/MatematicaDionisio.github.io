"use strict";
/* Núcleo compartido: fracciones exactas, matrices y utilidades de pantalla */
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a};
const F=(n,d=1)=>{if(d<0){n=-n;d=-d}const g=gcd(n,d)||1;return{n:n/g,d:d/g}};
const add=(a,b)=>F(a.n*b.d+b.n*a.d,a.d*b.d),sub=(a,b)=>F(a.n*b.d-b.n*a.d,a.d*b.d);
const mul=(a,b)=>F(a.n*b.n,a.d*b.d),div=(a,b)=>F(a.n*b.d,a.d*b.n),neg=a=>F(-a.n,a.d);
const cero=a=>a.n===0,fs=a=>a.d===1?String(a.n):a.n+"/"+a.d;
const fh=a=>a.d===1?`${a.n}`:`<span class="fr"><i>${a.n}</i><b>${a.d}</b></span>`;
function leer(s){s=String(s).trim().replace(",",".");if(s==="")return F(0);
 if(s.includes("/")){const[p,q]=s.split("/");const b=leer(q);if(cero(b))throw Error("División entre cero");return div(leer(p),b)}
 if(!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(s))throw Error("Valor inválido: "+s);
 const k=(s.split(".")[1]||"").length;return F(Math.round(parseFloat(s)*10**k),10**k)}
/* ---- pantalla ---- */
let LOG=[];
const paso=(t,h="")=>LOG.push(`<div class="paso"><h4>${t}</h4>${h}</div>`);
const resp=h=>LOG.push(`<div class="resp"><span>✔ Respuesta</span>${h}</div>`);
const mostrar=()=>{const s=document.getElementById("salida");s.innerHTML=LOG.join("");LOG=[];s.scrollIntoView({behavior:"smooth",block:"start"})};
const ejecutar=fn=>{try{LOG=[];fn();mostrar()}catch(e){LOG=[`<div class="err">⚠ ${e.message}</div>`];mostrar()}};
const mh=(M,aug=-1)=>`<table class="mat">`+M.map(r=>`<tr>${r.map((x,j)=>`<td${j===aug-1?' class="sep"':""}>${fh(x)}</td>`).join("")}</tr>`).join("")+`</table>`;
const eq=t=>`<div class="eq">${t}</div>`;
function crear(id,f,c,datos){const g=document.getElementById(id);g.dataset.f=f;g.dataset.c=c;g.style.setProperty("--c",c);g.innerHTML="";
 for(let i=0;i<f;i++)for(let j=0;j<c;j++){const e=document.createElement("input");
  e.value=datos?datos[i][j]:Math.floor(Math.random()*7)-3;g.appendChild(e)}}
function leerGrid(id){const g=document.getElementById(id),f=+g.dataset.f,c=+g.dataset.c,v=[...g.children].map(e=>leer(e.value));
 return Array.from({length:f},(_,i)=>v.slice(i*c,i*c+c))}
/* ---- álgebra ---- */
const clon=M=>M.map(r=>r.slice()),ident=n=>Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>F(i===j?1:0)));
const trans=M=>M[0].map((_,j)=>M.map(r=>r[j])),Z=F(0);
const mmul=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((s,x,k)=>add(s,mul(x,B[k][j])),Z)));
const menor=(M,i,j)=>M.filter((_,r)=>r!==i).map(r=>r.filter((_,c)=>c!==j));
function det(M){const n=M.length;if(n===1)return M[0][0];
 if(n===2)return sub(mul(M[0][0],M[1][1]),mul(M[0][1],M[1][0]));
 return M[0].reduce((s,x,j)=>add(s,mul(F(j%2?-1:1),mul(x,det(menor(M,0,j))))),Z)}
const cuadrada=M=>{if(M.length!==M[0].length)throw Error("La matriz debe ser cuadrada.")};
/* Gauss / Gauss-Jordan con pasos. col = columnas donde buscar pivotes; aug = separador visual */
function eliminar(M,{jordan=false,col=null,aug=-1}={}){
 M=clon(M);const f=M.length,c=M[0].length,lim=col??c;let r=0,piv=[],swaps=0;
 for(let j=0;j<lim&&r<f;j++){
  let p=-1;for(let i=r;i<f;i++)if(!cero(M[i][j])){p=i;break}
  if(p<0)continue;
  if(p!==r){[M[p],M[r]]=[M[r],M[p]];swaps++;paso(`Intercambio F${r+1} ↔ F${p+1}`,mh(M,aug))}
  if(jordan&&!(M[r][j].n===1&&M[r][j].d===1)){const k=div(F(1),M[r][j]);M[r]=M[r].map(x=>mul(x,k));
   paso(`F${r+1} → (${fs(k)})·F${r+1}  (pivote = 1)`,mh(M,aug))}
  for(let i=jordan?0:r+1;i<f;i++){if(i===r||cero(M[i][j]))continue;
   const m=div(M[i][j],M[r][j]);M[i]=M[i].map((x,k)=>sub(x,mul(m,M[r][k])));
   paso(`F${i+1} → F${i+1} − (${fs(m)})·F${r+1}`,mh(M,aug))}
  piv.push(j);r++}
 return{M,piv,swaps}}
