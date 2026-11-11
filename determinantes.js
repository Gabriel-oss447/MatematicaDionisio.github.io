"use strict";
const $=id=>document.getElementById(id);
document.addEventListener("DOMContentLoaded",()=>{
 crear("gA",3,3,[[2,1,-1],[1,3,2],[1,0,1]]);
 $("btnA").onclick=()=>crear("gA",+$("n").value,+$("n").value);
 document.querySelectorAll("[data-op]").forEach(b=>b.onclick=()=>ejecutar(()=>{const X=leerGrid("gA");cuadrada(X);paso("Matriz A",mh(X));ops[b.dataset.op](X)}))});
const sg=(i,j)=>(i+j)%2?-1:1;
const ops={
 laplace(X){const n=X.length;
  if(n===1)return resp("det(A) = "+fh(X[0][0]));
  paso("Desarrollo por cofactores (Laplace) por la fila 1: det(A) = Σ (−1)¹⁺ʲ · a₁ⱼ · det(M₁ⱼ)");
  let tot=Z,partes=[];
  X[0].forEach((x,j)=>{const m=menor(X,0,j),d=det(m),t=mul(F(sg(0,j)),mul(x,d));tot=add(tot,t);
   paso(`Elemento a₁${j+1} = ${fs(x)} · signo ${sg(0,j)>0?"+":"−"} · menor M₁${j+1}`,mh(m)+eq(`det(M₁${j+1}) = ${fs(d)} → aporte = (${sg(0,j)})(${fs(x)})(${fs(d)}) = <b>${fs(t)}</b>`));partes.push(fs(t))});
  paso("Sumar aportes",eq(partes.join(" + ")+` = <b>${fs(tot)}</b>`));resp("det(A) = "+fh(tot))},
 sarrus(X){if(X.length!==3)throw Error("Sarrus solo aplica a matrices 3×3.");
  const a=X,p=[mul(mul(a[0][0],a[1][1]),a[2][2]),mul(mul(a[0][1],a[1][2]),a[2][0]),mul(mul(a[0][2],a[1][0]),a[2][1])],
  q=[mul(mul(a[0][2],a[1][1]),a[2][0]),mul(mul(a[0][0],a[1][2]),a[2][1]),mul(mul(a[0][1],a[1][0]),a[2][2])];
  paso("Diagonales principales (se suman)",eq(`a₁₁a₂₂a₃₃ + a₁₂a₂₃a₃₁ + a₁₃a₂₁a₃₂ = ${p.map(fs).join(" + ")} = <b>${fs(p.reduce(add))}</b>`));
  paso("Diagonales secundarias (se restan)",eq(`a₁₃a₂₂a₃₁ + a₁₁a₂₃a₃₂ + a₁₂a₂₁a₃₃ = ${q.map(fs).join(" + ")} = <b>${fs(q.reduce(add))}</b>`));
  const d=sub(p.reduce(add),q.reduce(add));paso("Restar",eq(`${fs(p.reduce(add))} − (${fs(q.reduce(add))}) = <b>${fs(d)}</b>`));resp("det(A) = "+fh(d))},
 gauss(X){paso("Triangular superior con operaciones de fila (el det no cambia al restar múltiplos; cada intercambio cambia el signo)");
  const{M,swaps}=eliminar(X);const dg=M.map((r,i)=>r[i]);let d=dg.reduce(mul,F(1));if(swaps%2)d=neg(d);
  paso("Producto de la diagonal",eq(`${dg.map(x=>`(${fs(x)})`).join("·")} · (−1)^${swaps} = <b>${fs(d)}</b>`));resp("det(A) = "+fh(d))},
 cofactores(X){const C=cof(X,true);resp("Cof(A) ="+mh(C))},
 adjunta(X){const C=cof(X,true);paso("Cof(A)",mh(C));paso("Adjunta = transpuesta de la matriz de cofactores");resp("Adj(A) = Cof(A)ᵀ ="+mh(trans(C)))},
 inversaAdj(X){const d=det(X);paso("Determinante",eq("det(A) = "+fs(d)));
  if(cero(d))return resp("det(A) = 0 → <b>A no tiene inversa</b> (matriz singular).");
  const C=cof(X,true);paso("Matriz de cofactores",mh(C));const Ad=trans(C);paso("Adjunta = Cof(A)ᵀ",mh(Ad));
  paso("A⁻¹ = (1/det A) · Adj(A)",eq(`(1/${fs(d)}) · Adj(A)`));const I=Ad.map(r=>r.map(x=>div(x,d)));
  paso("Verificación A·A⁻¹ = I",mh(mmul(X,I)));resp("A⁻¹ ="+mh(I))},
 inversaGJ(X){const n=X.length,M=X.map((r,i)=>[...r,...ident(n)[i]]);paso("Matriz ampliada [A | I]",mh(M,n));
  const R=eliminar(M,{jordan:true,col:n,aug:n}).M;
  if(R.some((r,i)=>!(r[i].n===1&&r[i].d===1)||r.slice(0,n).some((x,j)=>j!==i&&!cero(x))))return resp("No se logra la identidad a la izquierda → <b>A no tiene inversa</b>.");
  const I=R.map(r=>r.slice(n));paso("Verificación A·A⁻¹ = I",mh(mmul(X,I)));resp("A⁻¹ ="+mh(I))}};
function cof(X,pasos){const n=X.length;if(n<2)throw Error("Se necesita al menos 2×2.");const lineas=[];
 const C=X.map((r,i)=>r.map((_,j)=>{const d=det(menor(X,i,j)),c=mul(F(sg(i,j)),d);lineas.push(`C${i+1}${j+1} = (−1)^${i+j+2} · det(M${i+1}${j+1}) = (${sg(i,j)})(${fs(d)}) = <b>${fs(c)}</b>`);return c}));
 if(pasos)paso("Cofactores Cᵢⱼ = (−1)ⁱ⁺ʲ · det(Mᵢⱼ)",eq(lineas.join("<br>")));return C}
