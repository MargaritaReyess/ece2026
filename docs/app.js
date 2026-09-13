
const NS = "http://www.w3.org/2000/svg";

function paretoY(x){ return 1 - Math.sqrt(x); }

const Axs = Array.from({length:9}, (_,i)=>0.25 + i*(0.50/8));
const Bxs = Array.from({length:9}, (_,i)=>0.05 + i*(0.90/8));
const Cxs = Bxs.slice();

const SETS = {
  A: Axs.map(x => [x, paretoY(x)]),
  B: Bxs.map(x => [x, Math.min(1.05, paretoY(x)+0.04)]),
  C: Cxs.map(x => [x, Math.min(1.05, paretoY(x)+0.12)])
};

function scaleFactory(width,height,pad){
  const sx = x => pad + x*(width-2*pad);
  const sy = y => height-pad - y*(height-2*pad);
  return {sx,sy};
}

function makeSvg(setName){
  const width=560, height=390, pad=52;
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox",`0 0 ${width} ${height}`);
  const {sx,sy}=scaleFactory(width,height,pad);

  [0,.25,.5,.75,1].forEach(t=>{
    const v=document.createElementNS(NS,"line");
    v.setAttribute("x1",sx(t)); v.setAttribute("x2",sx(t));
    v.setAttribute("y1",sy(0)); v.setAttribute("y2",sy(1));
    v.setAttribute("class","grid"); svg.appendChild(v);

    const h=document.createElementNS(NS,"line");
    h.setAttribute("x1",sx(0)); h.setAttribute("x2",sx(1));
    h.setAttribute("y1",sy(t)); h.setAttribute("y2",sy(t));
    h.setAttribute("class","grid"); svg.appendChild(h);
  });

  const ax=document.createElementNS(NS,"line");
  ax.setAttribute("x1",sx(0)); ax.setAttribute("x2",sx(1));
  ax.setAttribute("y1",sy(0)); ax.setAttribute("y2",sy(0));
  ax.setAttribute("class","axis"); svg.appendChild(ax);

  const ay=document.createElementNS(NS,"line");
  ay.setAttribute("x1",sx(0)); ay.setAttribute("x2",sx(0));
  ay.setAttribute("y1",sy(0)); ay.setAttribute("y2",sy(1));
  ay.setAttribute("class","axis"); svg.appendChild(ay);

  let d="";
  for(let i=0;i<=140;i++){
    const x=i/140, y=paretoY(x);
    d += (i===0?"M":"L")+sx(x)+" "+sy(y)+" ";
  }
  const path=document.createElementNS(NS,"path");
  path.setAttribute("d",d); path.setAttribute("class","front");
  svg.appendChild(path);

  SETS[setName].forEach(([x,y])=>{
    const c=document.createElementNS(NS,"circle");
    c.setAttribute("cx",sx(x)); c.setAttribute("cy",sy(y));
    c.setAttribute("r",7); c.setAttribute("class",`point ${setName.toLowerCase()}`);
    svg.appendChild(c);
  });

  const tx=document.createElementNS(NS,"text");
  tx.setAttribute("x",width-30); tx.setAttribute("y",height-18); tx.textContent="f₁";
  svg.appendChild(tx);

  const ty=document.createElementNS(NS,"text");
  ty.setAttribute("x",16); ty.setAttribute("y",30); ty.textContent="f₂";
  svg.appendChild(ty);

  return svg;
}

["A","B","C"].forEach(name=>{
  const mount=document.querySelector(`#plot-${name.toLowerCase()}`);
  if(mount) mount.appendChild(makeSvg(name));
});

document.querySelectorAll(".choice").forEach(btn=>{
  btn.addEventListener("click",()=>{
    document.querySelectorAll(".choice").forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");
    const choice=btn.dataset.choice;
    const msg = choice==="Depende"
      ? "Buena intuición: antes de decidir necesitamos aclarar qué entendemos por calidad."
      : `Has elegido ${choice}. No diremos todavía si es “correcto”: más adelante veremos qué dicen distintos indicadores.`;
    document.querySelector("#vote-feedback").textContent=msg;
  });
});

document.querySelector("#reveal-c").addEventListener("click",(e)=>{
  const card=document.querySelector("#card-c");
  card.classList.toggle("hidden");
  e.target.textContent=card.classList.contains("hidden")
    ? "Añadir un tercer resultado"
    : "Ocultar el tercer resultado";
});

(function hero(){
  const path=document.querySelector("#hero-front");
  const g=document.querySelector("#hero-points");
  const W=520,H=320,p=38;
  const sx=x=>p+x*(W-2*p), sy=y=>H-p-y*(H-2*p);

  let d="";
  for(let i=0;i<=100;i++){
    const x=i/100, y=paretoY(x);
    d+=(i===0?"M":"L")+sx(x)+" "+sy(y)+" ";
  }
  path.setAttribute("d",d);

  SETS.B.forEach(([x,y])=>{
    const c=document.createElementNS(NS,"circle");
    c.setAttribute("cx",sx(x));
    c.setAttribute("cy",sy(y));
    c.setAttribute("r","6");
    c.setAttribute("fill","#2457d6");
    g.appendChild(c);
  });
})();


// ---------- Bloque 2: galería de calidad ----------
function qualitySet(kind){
  if(kind==="convergence"){
    const xs=[0.05,0.17,0.29,0.41,0.53,0.65,0.77,0.89,0.97];
    return xs.map(x=>[x, Math.min(1.04, paretoY(x)+0.13)]);
  }
  if(kind==="coverage"){
    const xs=[0.28,0.335,0.39,0.445,0.50,0.555,0.61,0.665,0.72];
    return xs.map(x=>[x,paretoY(x)]);
  }
  if(kind==="uniformity"){
    const xs=[0.04,0.08,0.11,0.14,0.50,0.82,0.86,0.91,0.97];
    return xs.map(x=>[x,paretoY(x)]);
  }
  return [];
}

function makeQualitySvg(kind){
  const width=520, height=320, pad=46;
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox",`0 0 ${width} ${height}`);
  const {sx,sy}=scaleFactory(width,height,pad);

  [0,.25,.5,.75,1].forEach(t=>{
    const v=document.createElementNS(NS,"line");
    v.setAttribute("x1",sx(t)); v.setAttribute("x2",sx(t));
    v.setAttribute("y1",sy(0)); v.setAttribute("y2",sy(1));
    v.setAttribute("class","grid"); svg.appendChild(v);

    const h=document.createElementNS(NS,"line");
    h.setAttribute("x1",sx(0)); h.setAttribute("x2",sx(1));
    h.setAttribute("y1",sy(t)); h.setAttribute("y2",sy(t));
    h.setAttribute("class","grid"); svg.appendChild(h);
  });

  const ax=document.createElementNS(NS,"line");
  ax.setAttribute("x1",sx(0)); ax.setAttribute("x2",sx(1));
  ax.setAttribute("y1",sy(0)); ax.setAttribute("y2",sy(0));
  ax.setAttribute("class","axis"); svg.appendChild(ax);

  const ay=document.createElementNS(NS,"line");
  ay.setAttribute("x1",sx(0)); ay.setAttribute("x2",sx(0));
  ay.setAttribute("y1",sy(0)); ay.setAttribute("y2",sy(1));
  ay.setAttribute("class","axis"); svg.appendChild(ay);

  let d="";
  for(let i=0;i<=140;i++){
    const x=i/140, y=paretoY(x);
    d+=(i===0?"M":"L")+sx(x)+" "+sy(y)+" ";
  }
  const path=document.createElementNS(NS,"path");
  path.setAttribute("d",d);
  path.setAttribute("class","front");
  svg.appendChild(path);

  if(kind!=="cardinality"){
    qualitySet(kind).forEach(([x,y])=>{
      const c=document.createElementNS(NS,"circle");
      c.setAttribute("cx",sx(x)); c.setAttribute("cy",sy(y));
      c.setAttribute("r",6.5); c.setAttribute("class","point");
      svg.appendChild(c);
    });
  } else {
    // Cardinalidad: dos mini-gráficas separadas para no alterar el frente verdadero.
    while(svg.firstChild) svg.removeChild(svg.firstChild);

    const gap=22, miniW=(width-gap)/2, miniH=height, miniPad=38;
    const drawMini=(x0, label, xs, cls)=>{
      const mx=x=>x0+miniPad+x*(miniW-2*miniPad);
      const my=y=>miniH-miniPad-y*(miniH-2*miniPad);

      [0,.5,1].forEach(t=>{
        const v=document.createElementNS(NS,"line");
        v.setAttribute("x1",mx(t)); v.setAttribute("x2",mx(t));
        v.setAttribute("y1",my(0)); v.setAttribute("y2",my(1));
        v.setAttribute("class","grid"); svg.appendChild(v);

        const h=document.createElementNS(NS,"line");
        h.setAttribute("x1",mx(0)); h.setAttribute("x2",mx(1));
        h.setAttribute("y1",my(t)); h.setAttribute("y2",my(t));
        h.setAttribute("class","grid"); svg.appendChild(h);
      });

      const ax=document.createElementNS(NS,"line");
      ax.setAttribute("x1",mx(0)); ax.setAttribute("x2",mx(1));
      ax.setAttribute("y1",my(0)); ax.setAttribute("y2",my(0));
      ax.setAttribute("class","axis"); svg.appendChild(ax);

      const ay=document.createElementNS(NS,"line");
      ay.setAttribute("x1",mx(0)); ay.setAttribute("x2",mx(0));
      ay.setAttribute("y1",my(0)); ay.setAttribute("y2",my(1));
      ay.setAttribute("class","axis"); svg.appendChild(ay);

      let dd="";
      for(let i=0;i<=100;i++){
        const x=i/100, y=paretoY(x);
        dd+=(i===0?"M":"L")+mx(x)+" "+my(y)+" ";
      }
      const p=document.createElementNS(NS,"path");
      p.setAttribute("d",dd); p.setAttribute("class","front"); svg.appendChild(p);

      xs.forEach(x=>{
        const c=document.createElementNS(NS,"circle");
        c.setAttribute("cx",mx(x)); c.setAttribute("cy",my(paretoY(x)));
        c.setAttribute("r",6); c.setAttribute("class",`point ${cls}`);
        svg.appendChild(c);
      });

      const lab=document.createElementNS(NS,"text");
      lab.setAttribute("x",x0+miniW/2);
      lab.setAttribute("y",22);
      lab.setAttribute("text-anchor","middle");
      lab.textContent=label;
      svg.appendChild(lab);
    };

    drawMini(0, "4 soluciones", [0.05,0.35,0.65,0.95], "");
    drawMini(miniW+gap, "10 soluciones",
      [0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85,0.95], "alt");

    return svg;
  }

  const tx=document.createElementNS(NS,"text");
  tx.setAttribute("x",width-28); tx.setAttribute("y",height-16); tx.textContent="f₁";
  svg.appendChild(tx);

  const ty=document.createElementNS(NS,"text");
  ty.setAttribute("x",14); ty.setAttribute("y",27); ty.textContent="f₂";
  svg.appendChild(ty);

  return svg;
}

[
  ["#quality-convergence","convergence"],
  ["#quality-coverage","coverage"],
  ["#quality-uniformity","uniformity"],
  ["#quality-cardinality","cardinality"]
].forEach(([selector,kind])=>{
  const mount=document.querySelector(selector);
  if(mount) mount.appendChild(makeQualitySvg(kind));
});

document.querySelectorAll(".reveal-quality").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const answer=document.getElementById(btn.dataset.target);
    const isHidden=answer.classList.toggle("hidden");
    btn.textContent=isHidden ? "Descubrir" : "Ocultar explicación";
  });
});


// ---------- Bloque 3: GD, IGD e IGD+ ----------
const DIST_STATE = { set:"A", metric:"GD" };

function referenceSet(n=31){
  return Array.from({length:n},(_,i)=>{
    const x=i/(n-1);
    return [x,paretoY(x)];
  });
}

function euclidean(p,q){
  return Math.hypot(p[0]-q[0],p[1]-q[1]);
}

// Modified distance for minimization used by IGD+:
// only objective components where approximation point a is worse than reference point r.
function dPlus(r,a){
  return Math.hypot(
    Math.max(a[0]-r[0],0),
    Math.max(a[1]-r[1],0)
  );
}

function metricValue(setName,metric){
  const A=SETS[setName], R=referenceSet(101);

  if(metric==="GD"){
    const vals=A.map(a=>Math.min(...R.map(r=>euclidean(a,r))));
    return vals.reduce((s,v)=>s+v,0)/vals.length;
  }

  if(metric==="IGD"){
    const vals=R.map(r=>Math.min(...A.map(a=>euclidean(r,a))));
    return vals.reduce((s,v)=>s+v,0)/vals.length;
  }

  const vals=R.map(r=>Math.min(...A.map(a=>dPlus(r,a))));
  return vals.reduce((s,v)=>s+v,0)/vals.length;
}

function nearestPoint(source,targetSet,distanceFn){
  let best=targetSet[0], bestD=distanceFn(source,best);
  for(let i=1;i<targetSet.length;i++){
    const d=distanceFn(source,targetSet[i]);
    if(d<bestD){bestD=d;best=targetSet[i];}
  }
  return {point:best,distance:bestD};
}

function makeDistanceSvg(setName,metric){
  const width=660,height=420,pad=50;
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox",`0 0 ${width} ${height}`);
  const {sx,sy}=scaleFactory(width,height,pad);

  [0,.25,.5,.75,1].forEach(t=>{
    const v=document.createElementNS(NS,"line");
    v.setAttribute("x1",sx(t));v.setAttribute("x2",sx(t));
    v.setAttribute("y1",sy(0));v.setAttribute("y2",sy(1));
    v.setAttribute("class","grid");svg.appendChild(v);

    const h=document.createElementNS(NS,"line");
    h.setAttribute("x1",sx(0));h.setAttribute("x2",sx(1));
    h.setAttribute("y1",sy(t));h.setAttribute("y2",sy(t));
    h.setAttribute("class","grid");svg.appendChild(h);
  });

  const ax=document.createElementNS(NS,"line");
  ax.setAttribute("x1",sx(0));ax.setAttribute("x2",sx(1));
  ax.setAttribute("y1",sy(0));ax.setAttribute("y2",sy(0));
  ax.setAttribute("class","axis");svg.appendChild(ax);

  const ay=document.createElementNS(NS,"line");
  ay.setAttribute("x1",sx(0));ay.setAttribute("x2",sx(0));
  ay.setAttribute("y1",sy(0));ay.setAttribute("y2",sy(1));
  ay.setAttribute("class","axis");svg.appendChild(ay);

  let d="";
  for(let i=0;i<=140;i++){
    const x=i/140,y=paretoY(x);
    d+=(i===0?"M":"L")+sx(x)+" "+sy(y)+" ";
  }
  const front=document.createElementNS(NS,"path");
  front.setAttribute("d",d);front.setAttribute("class","front");svg.appendChild(front);

  const A=SETS[setName], R=referenceSet(17);

  // draw distance connections first
  if(metric==="GD"){
    A.forEach(a=>{
      const near=nearestPoint(a,R,euclidean).point;
      const line=document.createElementNS(NS,"line");
      line.setAttribute("x1",sx(a[0]));line.setAttribute("y1",sy(a[1]));
      line.setAttribute("x2",sx(near[0]));line.setAttribute("y2",sy(near[1]));
      line.setAttribute("class","distance-line");svg.appendChild(line);
    });
  } else if(metric==="IGD"){
    R.forEach(r=>{
      const near=nearestPoint(r,A,euclidean).point;
      const line=document.createElementNS(NS,"line");
      line.setAttribute("x1",sx(r[0]));line.setAttribute("y1",sy(r[1]));
      line.setAttribute("x2",sx(near[0]));line.setAttribute("y2",sy(near[1]));
      line.setAttribute("class","distance-line");svg.appendChild(line);
    });
  } else {
    R.forEach(r=>{
      const near=nearestPoint(r,A,dPlus).point;
      // L-shaped component-wise path: only positive/worse components count.
      const ex=Math.max(near[0]-r[0],0);
      const ey=Math.max(near[1]-r[1],0);
      const p1=[r[0],r[1]];
      const p2=[r[0]+ex,r[1]];
      const p3=[r[0]+ex,r[1]+ey];

      if(ex>1e-8){
        const l1=document.createElementNS(NS,"line");
        l1.setAttribute("x1",sx(p1[0]));l1.setAttribute("y1",sy(p1[1]));
        l1.setAttribute("x2",sx(p2[0]));l1.setAttribute("y2",sy(p2[1]));
        l1.setAttribute("class","plus-line");svg.appendChild(l1);
      }
      if(ey>1e-8){
        const l2=document.createElementNS(NS,"line");
        l2.setAttribute("x1",sx(p2[0]));l2.setAttribute("y1",sy(p2[1]));
        l2.setAttribute("x2",sx(p3[0]));l2.setAttribute("y2",sy(p3[1]));
        l2.setAttribute("class","plus-line");svg.appendChild(l2);
      }
    });
  }

  R.forEach(r=>{
    const c=document.createElementNS(NS,"circle");
    c.setAttribute("cx",sx(r[0]));c.setAttribute("cy",sy(r[1]));
    c.setAttribute("r",3.7);c.setAttribute("class","reference-point");svg.appendChild(c);
  });

  A.forEach(a=>{
    const c=document.createElementNS(NS,"circle");
    c.setAttribute("cx",sx(a[0]));c.setAttribute("cy",sy(a[1]));
    c.setAttribute("r",7);c.setAttribute("class","approx-point");svg.appendChild(c);
  });

  const tx=document.createElementNS(NS,"text");
  tx.setAttribute("x",width-26);tx.setAttribute("y",height-14);tx.textContent="f₁";svg.appendChild(tx);
  const ty=document.createElementNS(NS,"text");
  ty.setAttribute("x",14);ty.setAttribute("y",26);ty.textContent="f₂";svg.appendChild(ty);

  return svg;
}

const metricInfo={
  "GD":{
    name:"Generational Distance (GD)",
    question:"¿Qué tan lejos están mis soluciones del frente?",
    formula:"GD(A,R) = 1/|A| Σₐ minᵣ ||a − r||₂",
    text:"Las líneas parten de cada solución y buscan su punto de referencia más cercano."
  },
  "IGD":{
    name:"Inverted Generational Distance (IGD)",
    question:"¿Qué tan bien representa mi conjunto todo el frente?",
    formula:"IGD(A,R) = 1/|R| Σᵣ minₐ ||r − a||₂",
    text:"Ahora las líneas parten del reference set. Los huecos de cobertura se vuelven costosos."
  },
  "IGD+":{
    name:"Inverted Generational Distance Plus (IGD+)",
    question:"¿Puedo medir cobertura sin penalizar componentes que son mejoras?",
    formula:"IGD⁺(A,R) = 1/|R| Σᵣ minₐ d⁺(r,a)",
    text:"La distancia modificada sólo cuenta componentes donde la aproximación es peor que la referencia."
  }
};

function renderDistanceLab(){
  const mount=document.querySelector("#distance-plot");
  if(!mount) return;
  mount.innerHTML="";
  mount.appendChild(makeDistanceSvg(DIST_STATE.set,DIST_STATE.metric));

  const info=metricInfo[DIST_STATE.metric];
  document.querySelector("#metric-name").textContent=info.name;
  document.querySelector("#metric-question").textContent=info.question;
  document.querySelector("#metric-formula").textContent=info.formula;
  document.querySelector("#metric-interpretation").textContent=info.text;
  document.querySelector("#metric-value").textContent=metricValue(DIST_STATE.set,DIST_STATE.metric).toFixed(4);

  document.querySelectorAll(".distance-set").forEach(b=>b.classList.toggle("active",b.dataset.set===DIST_STATE.set));
  document.querySelectorAll(".distance-metric").forEach(b=>b.classList.toggle("active",b.dataset.metric===DIST_STATE.metric));
}

document.querySelectorAll(".distance-set").forEach(btn=>{
  btn.addEventListener("click",()=>{
    DIST_STATE.set=btn.dataset.set;
    renderDistanceLab();
  });
});

document.querySelectorAll(".distance-metric").forEach(btn=>{
  btn.addEventListener("click",()=>{
    DIST_STATE.metric=btn.dataset.metric;
    renderDistanceLab();
  });
});

renderDistanceLab();

// Small IGD+ playground
function renderPlusPlayground(){
  const mount=document.querySelector("#plus-plot");
  if(!mount) return;

  const a=[
    parseFloat(document.querySelector("#plus-x").value),
    parseFloat(document.querySelector("#plus-y").value)
  ];
  const r=[0.50,0.50];

  const width=520,height=310,pad=45;
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox",`0 0 ${width} ${height}`);
  const {sx,sy}=scaleFactory(width,height,pad);

  [0,.25,.5,.75,1].forEach(t=>{
    const v=document.createElementNS(NS,"line");
    v.setAttribute("x1",sx(t));v.setAttribute("x2",sx(t));
    v.setAttribute("y1",sy(0));v.setAttribute("y2",sy(1));
    v.setAttribute("class","grid");svg.appendChild(v);
    const h=document.createElementNS(NS,"line");
    h.setAttribute("x1",sx(0));h.setAttribute("x2",sx(1));
    h.setAttribute("y1",sy(t));h.setAttribute("y2",sy(t));
    h.setAttribute("class","grid");svg.appendChild(h);
  });

  const ax=document.createElementNS(NS,"line");
  ax.setAttribute("x1",sx(0));ax.setAttribute("x2",sx(1));
  ax.setAttribute("y1",sy(0));ax.setAttribute("y2",sy(0));
  ax.setAttribute("class","axis");svg.appendChild(ax);
  const ay=document.createElementNS(NS,"line");
  ay.setAttribute("x1",sx(0));ay.setAttribute("x2",sx(0));
  ay.setAttribute("y1",sy(0));ay.setAttribute("y2",sy(1));
  ay.setAttribute("class","axis");svg.appendChild(ay);

  const eu=document.createElementNS(NS,"line");
  eu.setAttribute("x1",sx(r[0]));eu.setAttribute("y1",sy(r[1]));
  eu.setAttribute("x2",sx(a[0]));eu.setAttribute("y2",sy(a[1]));
  eu.setAttribute("class","euclidean");svg.appendChild(eu);

  // Show objective-wise changes: red = counted by d+, grey dashed = ignored improvement.
  const mid=[a[0],r[1]];
  const horizontal=document.createElementNS(NS,"line");
  horizontal.setAttribute("x1",sx(r[0]));horizontal.setAttribute("y1",sy(r[1]));
  horizontal.setAttribute("x2",sx(mid[0]));horizontal.setAttribute("y2",sy(mid[1]));
  horizontal.setAttribute("class", a[0]>r[0] ? "counted" : "ignored");
  svg.appendChild(horizontal);

  const vertical=document.createElementNS(NS,"line");
  vertical.setAttribute("x1",sx(mid[0]));vertical.setAttribute("y1",sy(mid[1]));
  vertical.setAttribute("x2",sx(a[0]));vertical.setAttribute("y2",sy(a[1]));
  vertical.setAttribute("class", a[1]>r[1] ? "counted" : "ignored");
  svg.appendChild(vertical);

  const rc=document.createElementNS(NS,"circle");
  rc.setAttribute("cx",sx(r[0]));rc.setAttribute("cy",sy(r[1]));
  rc.setAttribute("r",7);rc.setAttribute("class","reference");svg.appendChild(rc);

  const ac=document.createElementNS(NS,"circle");
  ac.setAttribute("cx",sx(a[0]));ac.setAttribute("cy",sy(a[1]));
  ac.setAttribute("r",8);ac.setAttribute("class","candidate");svg.appendChild(ac);

  const rt=document.createElementNS(NS,"text");
  rt.setAttribute("x",sx(r[0])+10);rt.setAttribute("y",sy(r[1])-10);rt.textContent="r";
  svg.appendChild(rt);
  const at=document.createElementNS(NS,"text");
  at.setAttribute("x",sx(a[0])+10);at.setAttribute("y",sy(a[1])-10);at.textContent="a";
  svg.appendChild(at);

  mount.innerHTML="";
  mount.appendChild(svg);

  document.querySelector("#euclidean-value").textContent=euclidean(r,a).toFixed(3);
  document.querySelector("#dplus-value").textContent=dPlus(r,a).toFixed(3);
}

["#plus-x","#plus-y"].forEach(sel=>{
  const el=document.querySelector(sel);
  if(el) el.addEventListener("input",renderPlusPlayground);
});
renderPlusPlayground();
