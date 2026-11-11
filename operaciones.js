"use strict";
const $=id=>document.getElementById(id);
function crearA(){crear("gA",+$("fa").value,+$("ca").value)}
function crearB(){crear("gB",+$("fb").value,+$("cb").value)}
document.addEventListener("DOMContentLoaded",()=>{
 crear("gA",3,3,[[2,1,-1],[1,3,2],[1,0,1]]);crear("gB",3,3,[[1,0,2],[-1,1,0],[3,2,1]]);
 $("btnA").onclick=crearA;$("btnB").onclick=crearB;
 document.querySelectorAll("[data-op]").forEach(b=>b.onclick=()=>ejecutar(ops[b.dataset.op]))});
const A=()=>leerGrid("gA"),B=()=>leerGrid("gB");
function mismaDim(X,Y){if(X.length!==Y.length||X[0].length!==Y[0].length)throw Error("A y B deben tener las mismas dimensiones.")}
function elemento(X,Y,signo){mismaDim(X,Y);const op=signo>0?add:sub,s=signo>0?"+":"−";
 paso("Operación elemento a elemento: cᵢⱼ = aᵢⱼ "+s+" bᵢⱼ",
  eq(X.map((r,i)=>r.map((x,j)=>`c${i+1}${j+1} = (${fs(x)}) ${s} (${fs(Y[i][j])}) = <b>${fs(op(x,Y[i][j]))}</b>`).join("<br>")).join("<br>")));
 const R=X.map((r,i)=>r.map((x,j)=>op(x,Y[i][j])));resp(mh(R));}
function producto(X,Y,titulo="Producto"){if(X[0].length!==Y.length)throw Error(`No se puede multiplicar: columnas de A (${X[0].length}) ≠ filas de B (${Y.length}).`);
 const Yt=trans(Y);
 paso(titulo+": cᵢⱼ = Σ aᵢₖ·bₖⱼ (fila i de A por columna j de B)",
  eq(X.map((r,i)=>Yt.map((c,j)=>`c${i+1}${j+1} = `+r.map((x,k)=>`(${fs(x)})(${fs(c[k])})`).join(" + ")+` = <b>${fs(r.reduce((s,x,k)=>add(s,mul(x,c[k])),Z))}</b>`).join("<br>")).join("<br>")));
 return mmul(X,Y)}
const ops={
 suma:()=>elemento(A(),B(),1),
 resta:()=>elemento(A(),B(),-1),
 mult:()=>resp(mh(producto(A(),B(),"A · B"))),
 escalar:()=>{const k=leer($("k").value),X=A();
  paso(`Multiplicar cada elemento por k = ${fs(k)}`,eq(X.map((r,i)=>r.map((x,j)=>`${fs(k)}·(${fs(x)}) = <b>${fs(mul(k,x))}</b>`).join(" &nbsp;|&nbsp; ")).join("<br>")));
  resp(mh(X.map(r=>r.map(x=>mul(k,x)))))},
 potencia:()=>{const X=A(),n=parseInt($("n").value);cuadrada(X);
  if(!(n>=0&&n<=10))throw Error("El exponente debe estar entre 0 y 10.");
  if(n===0){paso("A⁰ = I");return resp(mh(ident(X.length)))}
  let P=X;for(let k=2;k<=n;k++){P=producto(P,X,`A${k} = A${k-1} · A`);paso(`Resultado A${k}`,mh(P))}
  if(n===1)paso("A¹ = A");resp(`A<sup>${n}</sup> =`+mh(P))},
 transpuesta:()=>{const X=A();paso("Intercambiar filas por columnas: (Aᵀ)ᵢⱼ = aⱼᵢ",mh(X));resp("Aᵀ ="+mh(trans(X)))},
 traza:()=>{const X=A();cuadrada(X);const t=X.reduce((s,r,i)=>add(s,r[i]),Z);
  paso("Sumar la diagonal principal",eq("tr(A) = "+X.map((r,i)=>`(${fs(r[i])})`).join(" + ")+` = <b>${fs(t)}</b>`));resp("tr(A) = "+fh(t))}};
