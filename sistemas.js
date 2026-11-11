"use strict";
const $=id=>document.getElementById(id);
function nueva(){const m=+$("m").value,n=+$("n").value;crear("gA",m,n);crear("gB",m,1)}
document.addEventListener("DOMContentLoaded",()=>{
 crear("gA",3,3,[[1,1,1],[2,-1,1],[1,2,-1]]);crear("gB",3,1,[[6],[3],[2]]);
 $("btnA").onclick=nueva;
 document.querySelectorAll("[data-op]").forEach(b=>b.onclick=()=>ejecutar(()=>ops[b.dataset.op]()))});
const A=()=>leerGrid("gA"),b=()=>leerGrid("gB");
const lin=(c,k)=>cero(c)?"":`${c.n<0?" − ":" + "}${(c.n===-1||c.n===1)&&c.d===1?"":fs(F(Math.abs(c.n),c.d))+" "}t${k}`;
const ops={
 escalonada(){const X=A();paso("Matriz original",mh(X));const{M}=eliminar(X);resp("Forma escalonada (Gauss):"+mh(M))},
 reducida(){const X=A();paso("Matriz original",mh(X));const{M}=eliminar(X,{jordan:true});resp("Forma escalonada reducida (Gauss-Jordan):"+mh(M))},
 rango(){const X=A();paso("Matriz original",mh(X));const{M,piv}=eliminar(X);
  paso("Contar filas no nulas (pivotes en columnas "+piv.map(j=>j+1).join(", ")+")",mh(M));resp(`rango(A) = <b>${piv.length}</b>`)},
 gj(){const X=A(),y=b(),n=X[0].length,M=X.map((r,i)=>[...r,y[i][0]]);paso("Matriz ampliada [A | b]",mh(M,n));
  const{M:R,piv}=eliminar(M,{jordan:true,col:n,aug:n});
  const bad=R.find(r=>r.slice(0,n).every(cero)&&!cero(r[n]));
  if(bad)return resp(`Fila 0 0 … 0 | ${fs(bad[n])} ⇒ 0 = ${fs(bad[n])}, imposible. El sistema es <b>incompatible</b> (sin solución).`);
  const libres=[...Array(n).keys()].filter(j=>!piv.includes(j));
  if(!libres.length)return resp("Sistema compatible determinado (solución única):"+eq(piv.map((j,i)=>`x<sub>${j+1}</sub> = <b>${fs(R[i][n])}</b>`).join("<br>")));
  const sol=Array(n).fill("");libres.forEach((j,k)=>sol[j]=`x${j+1} = t${k+1}  (libre)`);
  piv.forEach((j,i)=>{sol[j]=`x${j+1} = ${fs(R[i][n])}`+libres.map((l,k)=>lin(neg(R[i][l]),k+1)).join("")});
  resp(`Sistema compatible indeterminado: rango ${piv.length} < ${n} incógnitas → infinitas soluciones.`+eq(sol.join("<br>")))},
 cramer(){const X=A(),y=b();cuadrada(X);const n=X.length,d=det(X);paso("Determinante del sistema",mh(X)+eq("det(A) = "+fs(d)));
  if(cero(d))return resp("det(A) = 0 → <b>no se puede aplicar Cramer</b>. Use Gauss-Jordan para clasificar el sistema.");
  const xs=[];for(let j=0;j<n;j++){const Mj=X.map((r,i)=>r.map((v,k)=>k===j?y[i][0]:v)),dj=det(Mj);xs.push(div(dj,d));
   paso(`Reemplazar la columna ${j+1} por b`,mh(Mj)+eq(`det(A${j+1}) = ${fs(dj)} → x${j+1} = ${fs(dj)} / ${fs(d)} = <b>${fs(xs[j])}</b>`))}
  resp("Solución única:"+eq(xs.map((x,j)=>`x<sub>${j+1}</sub> = <b>${fs(x)}</b>`).join("<br>")))},
 nucleo(){const X=A(),n=X[0].length;paso("Resolver A·x = 0: reducir A por Gauss-Jordan",mh(X));
  const{M,piv}=eliminar(X,{jordan:true}),libres=[...Array(n).keys()].filter(j=>!piv.includes(j));
  if(!libres.length)return resp("Solo hay pivotes ⇒ el núcleo es {0} (dimensión 0).");
  paso("Variables libres",eq(`Pivotes: ${piv.map(j=>"x"+(j+1)).join(", ")} · Libres: ${libres.map(j=>"x"+(j+1)).join(", ")}`));
  const base=libres.map(l=>{const v=Array.from({length:n},()=>[Z]);v[l]=[F(1)];piv.forEach((j,i)=>v[j]=[neg(M[i][l])]);return v});
  base.forEach((v,k)=>paso(`Vector base ${k+1} (x${libres[k]+1}=1, demás libres=0)`,mh(v)+eq("Comprobación A·v = 0: "+(mmul(X,v).every(r=>cero(r[0]))?"✔":"✘"))));
  resp(`Núcleo de A, dimensión ${libres.length}: combinaciones de `+base.map(v=>mh(v)).join(" ")+" (Nul A = gen{…})")}};
