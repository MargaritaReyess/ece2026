
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


// ---------- Bloque 4: Hypervolume ----------
const HV_STATE = {set:"A",rx:1.10,ry:1.10,addDominated:false,selectedIndex:null};

function getHVPoints(){
  const pts=SETS[HV_STATE.set].map(p=>[p[0],p[1]]);
  if(HV_STATE.addDominated) pts.push([0.80,0.80]);
  return pts;
}

function nondominated2D(points){
  return points.filter((p,i)=>!points.some((q,j)=>{
    if(i===j) return false;
    return q[0]<=p[0] && q[1]<=p[1] && (q[0]<p[0] || q[1]<p[1]);
  }));
}

function hv2D(points,ref){
  const valid=nondominated2D(points)
    .filter(p=>p[0]<ref[0] && p[1]<ref[1])
    .sort((a,b)=>a[0]-b[0]);

  let hv=0, prevY=ref[1];
  valid.forEach(([x,y])=>{
    if(y<prevY){
      hv+=(ref[0]-x)*(prevY-y);
      prevY=y;
    }
  });
  return hv;
}

function hvContribution(points,index,ref){
  return Math.max(0,hv2D(points,ref)-hv2D(points.filter((_,i)=>i!==index),ref));
}

function hvPolygon(points,ref){
  const nd=nondominated2D(points)
    .filter(p=>p[0]<ref[0] && p[1]<ref[1])
    .sort((a,b)=>a[0]-b[0]);
  if(!nd.length) return [];

  const poly=[[nd[0][0],ref[1]],[nd[0][0],nd[0][1]]];
  for(let i=1;i<nd.length;i++){
    poly.push([nd[i][0],nd[i-1][1]],[nd[i][0],nd[i][1]]);
  }
  poly.push([ref[0],nd[nd.length-1][1]],[ref[0],ref[1]]);
  return poly;
}


function hvExclusiveRect(points,index,ref){
  if(index===null || index<0 || index>=points.length) return null;

  const p=points[index];

  // If another point dominates p, its exclusive contribution is zero.
  const dominated=points.some((q,j)=>{
    if(j===index) return false;
    return q[0]<=p[0] && q[1]<=p[1] && (q[0]<p[0] || q[1]<p[1]);
  });
  if(dominated || p[0]>=ref[0] || p[1]>=ref[1]) return null;

  const nd=nondominated2D(points)
    .filter(q=>q[0]<ref[0] && q[1]<ref[1])
    .sort((a,b)=>a[0]-b[0]);

  const pos=nd.findIndex(q=>Math.abs(q[0]-p[0])<1e-12 && Math.abs(q[1]-p[1])<1e-12);
  if(pos<0) return null;

  const prevY=pos===0 ? ref[1] : nd[pos-1][1];
  const nextX=pos===nd.length-1 ? ref[0] : nd[pos+1][0];

  if(nextX<=p[0] || prevY<=p[1]) return null;
  return {x0:p[0],x1:nextX,y0:p[1],y1:prevY};
}

function makeHVSVG(){
  const width=700,height=470,pad=52,maxAxis=1.45;
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox",`0 0 ${width} ${height}`);
  const sx=x=>pad+(x/maxAxis)*(width-2*pad);
  const sy=y=>height-pad-(y/maxAxis)*(height-2*pad);

  [0,.25,.5,.75,1,1.25].forEach(t=>{
    const v=document.createElementNS(NS,"line");
    v.setAttribute("x1",sx(t));v.setAttribute("x2",sx(t));
    v.setAttribute("y1",sy(0));v.setAttribute("y2",sy(maxAxis));
    v.setAttribute("class","grid");svg.appendChild(v);
    const h=document.createElementNS(NS,"line");
    h.setAttribute("x1",sx(0));h.setAttribute("x2",sx(maxAxis));
    h.setAttribute("y1",sy(t));h.setAttribute("y2",sy(t));
    h.setAttribute("class","grid");svg.appendChild(h);
  });

  const ax=document.createElementNS(NS,"line");
  ax.setAttribute("x1",sx(0));ax.setAttribute("x2",sx(maxAxis));
  ax.setAttribute("y1",sy(0));ax.setAttribute("y2",sy(0));ax.setAttribute("class","axis");svg.appendChild(ax);
  const ay=document.createElementNS(NS,"line");
  ay.setAttribute("x1",sx(0));ay.setAttribute("x2",sx(0));
  ay.setAttribute("y1",sy(0));ay.setAttribute("y2",sy(maxAxis));ay.setAttribute("class","axis");svg.appendChild(ay);

  let fd="";
  for(let i=0;i<=140;i++){
    const x=i/140,y=paretoY(x);
    fd+=(i===0?"M":"L")+sx(x)+" "+sy(y)+" ";
  }
  const front=document.createElementNS(NS,"path");
  front.setAttribute("d",fd);front.setAttribute("class","front");svg.appendChild(front);

  const points=getHVPoints(),ref=[HV_STATE.rx,HV_STATE.ry];
  const poly=hvPolygon(points,ref);
  if(poly.length){
    const pg=document.createElementNS(NS,"polygon");
    pg.setAttribute("points",poly.map(p=>`${sx(p[0])},${sy(p[1])}`).join(" "));
    pg.setAttribute("class","hv-region");svg.appendChild(pg);
  }

  // Highlight the exclusive hypervolume contribution of the selected solution.
  if(HV_STATE.selectedIndex!==null){
    const er=hvExclusiveRect(points,HV_STATE.selectedIndex,ref);
    if(er){
      const rect=document.createElementNS(NS,"rect");
      rect.setAttribute("x",sx(er.x0));
      rect.setAttribute("y",sy(er.y1));
      rect.setAttribute("width",sx(er.x1)-sx(er.x0));
      rect.setAttribute("height",sy(er.y0)-sy(er.y1));
      rect.setAttribute("class","hv-exclusive");
      svg.appendChild(rect);

      const lab=document.createElementNS(NS,"text");
      lab.setAttribute("x",(sx(er.x0)+sx(er.x1))/2);
      lab.setAttribute("y",(sy(er.y0)+sy(er.y1))/2);
      lab.setAttribute("text-anchor","middle");
      lab.setAttribute("class","hv-exclusive-label");
      lab.textContent="ΔHV";
      svg.appendChild(lab);
    }
  }

  const gx=document.createElementNS(NS,"line");
  gx.setAttribute("x1",sx(ref[0]));gx.setAttribute("x2",sx(ref[0]));
  gx.setAttribute("y1",sy(0));gx.setAttribute("y2",sy(ref[1]));
  gx.setAttribute("class","hv-ref-guides");svg.appendChild(gx);
  const gy=document.createElementNS(NS,"line");
  gy.setAttribute("x1",sx(0));gy.setAttribute("x2",sx(ref[0]));
  gy.setAttribute("y1",sy(ref[1]));gy.setAttribute("y2",sy(ref[1]));
  gy.setAttribute("class","hv-ref-guides");svg.appendChild(gy);

  points.forEach((p,i)=>{
    const isDom=HV_STATE.addDominated && i===points.length-1;
    const c=document.createElementNS(NS,"circle");
    c.setAttribute("cx",sx(p[0]));c.setAttribute("cy",sy(p[1]));c.setAttribute("r",isDom?7:8);
    c.setAttribute("class",`hv-point${isDom?" dominated":""}${HV_STATE.selectedIndex===i?" selected":""}`);
    c.addEventListener("click",()=>{HV_STATE.selectedIndex=i;renderHVLab();});
    svg.appendChild(c);
  });

  const rc=document.createElementNS(NS,"circle");
  rc.setAttribute("cx",sx(ref[0]));rc.setAttribute("cy",sy(ref[1]));rc.setAttribute("r",8);rc.setAttribute("class","hv-ref");svg.appendChild(rc);
  const rt=document.createElementNS(NS,"text");
  rt.setAttribute("x",sx(ref[0])+10);rt.setAttribute("y",sy(ref[1])-10);rt.textContent="r";svg.appendChild(rt);

  const tx=document.createElementNS(NS,"text");
  tx.setAttribute("x",width-28);tx.setAttribute("y",height-14);tx.textContent="f₁";svg.appendChild(tx);
  const ty=document.createElementNS(NS,"text");
  ty.setAttribute("x",14);ty.setAttribute("y",27);ty.textContent="f₂";svg.appendChild(ty);
  return svg;
}

function renderHVLab(){
  const mount=document.querySelector("#hv-plot");
  if(!mount) return;
  mount.innerHTML="";mount.appendChild(makeHVSVG());

  const points=getHVPoints(),ref=[HV_STATE.rx,HV_STATE.ry];
  document.querySelector("#hv-value").textContent=hv2D(points,ref).toFixed(4);
  document.querySelector("#hv-rx-value").textContent=HV_STATE.rx.toFixed(2);
  document.querySelector("#hv-ry-value").textContent=HV_STATE.ry.toFixed(2);

  document.querySelectorAll(".hv-set").forEach(b=>b.classList.toggle("active",b.dataset.set===HV_STATE.set));
  document.querySelector("#hv-dominated-toggle").textContent=
    HV_STATE.addDominated?"Quitar punto dominado":"Añadir punto dominado";

  const msg=document.querySelector("#hv-point-message"),val=document.querySelector("#hv-contribution");
  if(HV_STATE.selectedIndex===null || HV_STATE.selectedIndex>=points.length){
    msg.textContent="Haz clic en una solución para ver cuánto HV se perdería al eliminarla.";
    val.textContent="ΔHV = —";
  }else{
    const p=points[HV_STATE.selectedIndex];
    const d=hvContribution(points,HV_STATE.selectedIndex,ref);
    const isDom=HV_STATE.addDominated && HV_STATE.selectedIndex===points.length-1;
    msg.textContent=isDom
      ?`Punto dominado a = (${p[0].toFixed(2)}, ${p[1].toFixed(2)}): no agrega región nueva.`
      :`Solución a = (${p[0].toFixed(3)}, ${p[1].toFixed(3)}).`;
    val.textContent=`ΔHV = ${d.toFixed(4)}`;
  }
}

document.querySelectorAll(".hv-set").forEach(btn=>btn.addEventListener("click",()=>{
  HV_STATE.set=btn.dataset.set;HV_STATE.selectedIndex=null;renderHVLab();
}));

const hvRx=document.querySelector("#hv-rx"),hvRy=document.querySelector("#hv-ry");
if(hvRx) hvRx.addEventListener("input",()=>{HV_STATE.rx=parseFloat(hvRx.value);renderHVLab();});
if(hvRy) hvRy.addEventListener("input",()=>{HV_STATE.ry=parseFloat(hvRy.value);renderHVLab();});

const hvDom=document.querySelector("#hv-dominated-toggle");
if(hvDom) hvDom.addEventListener("click",()=>{
  HV_STATE.addDominated=!HV_STATE.addDominated;HV_STATE.selectedIndex=null;renderHVLab();
});

renderHVLab();


// ---------- Figura fija: Hypervolume en 3D ----------
function renderHV3DFigure(){
  const mount=document.querySelector("#hv3d-figure");
  if(!mount) return;

  const NS3="http://www.w3.org/2000/svg";
  const W=650,H=500;
  const svg=document.createElementNS(NS3,"svg");
  svg.setAttribute("viewBox",`0 0 ${W} ${H}`);

  // Isometric projection for a schematic 3D view.
  const project=([x,y,z])=>{
    const ox=315, oy=395;
    const sx=165, sy=68, sz=190;
    return [
      ox + (x-y)*sx,
      oy - (x+y)*sy - z*sz
    ];
  };

  const line=(a,b,cls)=>{
    const A=project(a),B=project(b);
    const l=document.createElementNS(NS3,"line");
    l.setAttribute("x1",A[0]);l.setAttribute("y1",A[1]);
    l.setAttribute("x2",B[0]);l.setAttribute("y2",B[1]);
    l.setAttribute("class",cls);
    svg.appendChild(l);
  };

  // Axes and faint bounding guides.
  line([0,0,0],[1.12,0,0],"axis3d");
  line([0,0,0],[0,1.12,0],"axis3d");
  line([0,0,0],[0,0,1.12],"axis3d");
  line([1.05,1.05,0],[1.05,1.05,1.05],"axis3d-guide");
  line([1.05,0,1.05],[1.05,1.05,1.05],"axis3d-guide");
  line([0,1.05,1.05],[1.05,1.05,1.05],"axis3d-guide");

  const addText=(p,text,dx=0,dy=0)=>{
    const P=project(p);
    const t=document.createElementNS(NS3,"text");
    t.setAttribute("x",P[0]+dx);t.setAttribute("y",P[1]+dy);
    t.textContent=text;svg.appendChild(t);
  };

  addText([1.12,0,0],"f₁",9,8);
  addText([0,1.12,0],"f₂",-24,9);
  addText([0,0,1.12],"f₃",7,-5);

  const r=[1.05,1.05,1.05];
  const pts=[
    [0.20,0.76,0.62],
    [0.46,0.48,0.49],
    [0.73,0.25,0.35]
  ];

  // Draw a few visible faces for each rectangular prism.
  // The transparency intentionally reveals overlaps.
  const facesForBox=(p,r)=>{
    const [x0,y0,z0]=p,[x1,y1,z1]=r;
    return [
      [[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0]],
      [[x0,y0,z0],[x1,y0,z0],[x1,y0,z1],[x0,y0,z1]],
      [[x0,y0,z0],[x0,y1,z0],[x0,y1,z1],[x0,y0,z1]],
      [[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]],
      [[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],[x1,y0,z1]],
      [[x0,y1,z0],[x1,y1,z0],[x1,y1,z1],[x0,y1,z1]]
    ];
  };

  pts.forEach((p,idx)=>{
    facesForBox(p,r).forEach((face,fi)=>{
      const poly=document.createElementNS(NS3,"polygon");
      poly.setAttribute("points",face.map(q=>project(q).join(",")).join(" "));
      poly.setAttribute("class", idx===1 ? "prism-face-b" : "prism-face-a");
      poly.style.opacity = fi<3 ? "0.78" : "0.46";
      svg.appendChild(poly);
    });
  });

  // Solution points on top.
  pts.forEach((p,i)=>{
    const P=project(p);
    const c=document.createElementNS(NS3,"circle");
    c.setAttribute("cx",P[0]);c.setAttribute("cy",P[1]);
    c.setAttribute("r",7);c.setAttribute("class","solution3d");
    svg.appendChild(c);
    const t=document.createElementNS(NS3,"text");
    t.setAttribute("x",P[0]+9);t.setAttribute("y",P[1]-8);
    t.textContent=`a${i+1}`;svg.appendChild(t);
  });

  const R=project(r);
  const rc=document.createElementNS(NS3,"circle");
  rc.setAttribute("cx",R[0]);rc.setAttribute("cy",R[1]);
  rc.setAttribute("r",8);rc.setAttribute("class","ref3d");
  svg.appendChild(rc);
  const rt=document.createElementNS(NS3,"text");
  rt.setAttribute("x",R[0]+10);rt.setAttribute("y",R[1]-8);
  rt.textContent="r";svg.appendChild(rt);

  mount.innerHTML="";
  mount.appendChild(svg);
}
renderHV3DFigure();


// ---------- Bloque 5: comparador de métricas ----------
const COMP_STATE={metric:"GD"};
const COMP_R=referenceSet(401);

function additiveEpsilon(A,R){
  let worst=-Infinity;
  R.forEach(r=>{
    let best=Infinity;
    A.forEach(a=>{
      const eps=Math.max(a[0]-r[0],a[1]-r[1]);
      if(eps<best) best=eps;
    });
    if(best>worst) worst=best;
  });
  return worst;
}

function r2Indicator(A,nWeights=101){
  const z=[0,0];
  let sum=0;
  for(let i=1;i<=nWeights;i++){
    const w1=i/(nWeights+1),w2=1-w1;
    let best=Infinity;
    A.forEach(a=>{
      const u=Math.max(
        w1*Math.abs(a[0]-z[0]),
        w2*Math.abs(a[1]-z[1])
      );
      if(u<best) best=u;
    });
    sum+=best;
  }
  return sum/nWeights;
}

function compareMetrics(){
  return {
    GD:{
      name:"Generational Distance (GD)",
      question:"¿Qué tan cerca están mis soluciones del frente?",
      direction:"min",
      A:metricValue("A","GD"),
      B:metricValue("B","GD"),
      interpretation:"GD sólo mira convergencia. A está prácticamente sobre el frente, aunque cubre una región más pequeña."
    },
    "IGD+":{
      name:"Inverted Generational Distance Plus (IGD+)",
      question:"¿Qué tan bien represento el frente sin penalizar mejoras Pareto?",
      direction:"min",
      A:metricValue("A","IGD+"),
      B:metricValue("B","IGD+"),
      interpretation:"IGD+ penaliza los huecos de A. B cubre una región mucho más amplia y por eso obtiene un valor menor."
    },
    HV:{
      name:"Hypervolume (HV)",
      question:"¿Cuánto espacio domina el conjunto respecto a r = (1.10, 1.10)?",
      direction:"max",
      A:hv2D(SETS.A,[1.10,1.10]),
      B:hv2D(SETS.B,[1.10,1.10]),
      interpretation:"HV favorece a B porque su mayor extensión produce más región dominada, pese a su pequeña pérdida de convergencia."
    },
    EPS:{
      name:"Indicador epsilon aditivo (ε+)",
      question:"¿Cuál es el peor desplazamiento aditivo necesario para cubrir la referencia?",
      direction:"min",
      A:additiveEpsilon(SETS.A,COMP_R),
      B:additiveEpsilon(SETS.B,COMP_R),
      interpretation:"ε+ se concentra en el peor caso. Los extremos ausentes de A producen una penalización mayor."
    },
    R2:{
      name:"Indicador R2",
      question:"¿Qué conjunto ofrece mejores compromisos a lo largo de múltiples preferencias?",
      direction:"min",
      A:r2Indicator(SETS.A),
      B:r2Indicator(SETS.B),
      interpretation:"R2 integra una familia de funciones de escalarización. En este escenario, la mayor cobertura de B le da mejores compromisos globales."
    }
  };
}

const COMP_DATA=compareMetrics();

function makeComparePlot(){
  const width=680,height=430,pad=52;
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

  SETS.A.forEach(p=>{
    const c=document.createElementNS(NS,"circle");
    c.setAttribute("cx",sx(p[0]));c.setAttribute("cy",sy(p[1]));
    c.setAttribute("r",7);c.setAttribute("class","pt-a");svg.appendChild(c);
  });
  SETS.B.forEach(p=>{
    const c=document.createElementNS(NS,"circle");
    c.setAttribute("cx",sx(p[0]));c.setAttribute("cy",sy(p[1]));
    c.setAttribute("r",6.5);c.setAttribute("class","pt-b");svg.appendChild(c);
  });

  const tx=document.createElementNS(NS,"text");
  tx.setAttribute("x",width-28);tx.setAttribute("y",height-14);tx.textContent="f₁";svg.appendChild(tx);
  const ty=document.createElementNS(NS,"text");
  ty.setAttribute("x",14);ty.setAttribute("y",27);ty.textContent="f₂";svg.appendChild(ty);

  return svg;
}

function metricWinner(info){
  if(info.direction==="min") return info.A<info.B ? "A" : "B";
  return info.A>info.B ? "A" : "B";
}

function renderComparator(){
  const mount=document.querySelector("#compare-plot");
  if(!mount) return;

  if(!mount.hasChildNodes()) mount.appendChild(makeComparePlot());

  const info=COMP_DATA[COMP_STATE.metric];
  document.querySelector("#compare-title").textContent=info.name;
  document.querySelector("#compare-question").textContent=info.question;
  document.querySelector("#compare-a-value").textContent=info.A.toFixed(4);
  document.querySelector("#compare-b-value").textContent=info.B.toFixed(4);
  document.querySelector("#compare-direction").textContent=info.direction==="min"?"menor es mejor":"mayor es mejor";
  document.querySelector("#compare-winner").textContent=`Favorece a ${metricWinner(info)}`;
  document.querySelector("#compare-interpretation").textContent=info.interpretation;

  // Bars now reflect the raw magnitude of the indicator.
  // Therefore, for minimization metrics the shorter bar is better,
  // while for maximization metrics the longer bar is better.
  const max=Math.max(info.A,info.B) || 1;
  const aPct=100*info.A/max;
  const bPct=100*info.B/max;
  document.querySelector("#compare-a-bar").style.width=`${aPct}%`;
  document.querySelector("#compare-b-bar").style.width=`${bPct}%`;

  const winner=metricWinner(info);
  const cardA=document.querySelector("#ab-card-a");
  const cardB=document.querySelector("#ab-card-b");
  const badgeA=document.querySelector("#ab-badge-a");
  const badgeB=document.querySelector("#ab-badge-b");
  cardA.classList.toggle("winner", winner==="A");
  cardB.classList.toggle("winner", winner==="B");
  badgeA.classList.toggle("hidden", winner!=="A");
  badgeB.classList.toggle("hidden", winner!=="B");

  document.querySelector("#bar-note").textContent =
    info.direction==="min"
      ? "Las barras representan la magnitud del indicador: la barra más corta es mejor."
      : "Las barras representan la magnitud del indicador: la barra más larga es mejor.";

  document.querySelectorAll(".compare-metric").forEach(btn=>{
    btn.classList.toggle("active",btn.dataset.metric===COMP_STATE.metric);
  });
}

document.querySelectorAll(".compare-metric").forEach(btn=>{
  btn.addEventListener("click",()=>{
    COMP_STATE.metric=btn.dataset.metric;
    renderComparator();
  });
});

const revealMatrix=document.querySelector("#reveal-matrix");
if(revealMatrix){
  revealMatrix.addEventListener("click",()=>{
    const matrix=document.querySelector("#compare-matrix");
    const hidden=matrix.classList.toggle("hidden");
    revealMatrix.textContent=hidden?"Revelar resumen":"Ocultar resumen";
  });
}

function fillCompareMatrix(){
  const ids={
    GD:["m-gd-a","m-gd-b"],
    "IGD+":["m-igdp-a","m-igdp-b"],
    HV:["m-hv-a","m-hv-b"],
    EPS:["m-eps-a","m-eps-b"],
    R2:["m-r2-a","m-r2-b"]
  };
  Object.entries(ids).forEach(([k,[aId,bId]])=>{
    document.getElementById(aId).textContent=COMP_DATA[k].A.toFixed(4);
    document.getElementById(bId).textContent=COMP_DATA[k].B.toFixed(4);
  });
}

fillCompareMatrix();
renderComparator();


// ---------- Detalles expandibles: epsilon+ y R2 ----------
document.querySelectorAll(".metric-more").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const panel=document.getElementById(btn.dataset.target);
    const hidden=panel.classList.toggle("hidden");
    btn.textContent=hidden ? "Ver un poco más" : "Ocultar detalle";
  });
});


// ---------- Bloque 6: Las trampas ----------
const TRAP_STATE={
  scale:1,
  refset:"uniform",
  dominated:false,
  dim:2
};

function trapScaleSVG(scale){
  const W=520,H=320,pad=48;
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox",`0 0 ${W} ${H}`);
  const r=[0.5,0.5],p=[0.62,0.53],q=[0.53,0.62];

  const pts=[r,p,q].map(([x,y])=>[x,y*scale]);
  const maxY=Math.max(...pts.map(v=>v[1]))*1.15;
  const sx=x=>pad+x*(W-2*pad);
  const sy=y=>H-pad-(y/maxY)*(H-2*pad);

  [0,.25,.5,.75,1].forEach(t=>{
    const v=document.createElementNS(NS,"line");
    v.setAttribute("x1",sx(t));v.setAttribute("x2",sx(t));
    v.setAttribute("y1",pad);v.setAttribute("y2",H-pad);
    v.setAttribute("class","grid");svg.appendChild(v);
  });
  [0,.25,.5,.75,1].forEach(t=>{
    const yy=t*maxY;
    const h=document.createElementNS(NS,"line");
    h.setAttribute("x1",pad);h.setAttribute("x2",W-pad);
    h.setAttribute("y1",sy(yy));h.setAttribute("y2",sy(yy));
    h.setAttribute("class","grid");svg.appendChild(h);
  });

  const ax=document.createElementNS(NS,"line");
  ax.setAttribute("x1",pad);ax.setAttribute("x2",W-pad);
  ax.setAttribute("y1",H-pad);ax.setAttribute("y2",H-pad);
  ax.setAttribute("class","axis");svg.appendChild(ax);
  const ay=document.createElementNS(NS,"line");
  ay.setAttribute("x1",pad);ay.setAttribute("x2",pad);
  ay.setAttribute("y1",pad);ay.setAttribute("y2",H-pad);
  ay.setAttribute("class","axis");svg.appendChild(ay);

  const drawLink=(a,b)=>{
    const l=document.createElementNS(NS,"line");
    l.setAttribute("x1",sx(a[0]));l.setAttribute("y1",sy(a[1]));
    l.setAttribute("x2",sx(b[0]));l.setAttribute("y2",sy(b[1]));
    l.setAttribute("class","link");svg.appendChild(l);
  };
  drawLink(pts[0],pts[1]);drawLink(pts[0],pts[2]);

  [
    [pts[0],"refpt","r"],
    [pts[1],"p-a","p"],
    [pts[2],"p-b","q"]
  ].forEach(([pt,cls,label])=>{
    const c=document.createElementNS(NS,"circle");
    c.setAttribute("cx",sx(pt[0]));c.setAttribute("cy",sy(pt[1]));
    c.setAttribute("r",7);c.setAttribute("class",cls);svg.appendChild(c);
    const t=document.createElementNS(NS,"text");
    t.setAttribute("x",sx(pt[0])+9);t.setAttribute("y",sy(pt[1])-8);
    t.textContent=label;svg.appendChild(t);
  });

  return svg;
}

function renderScaleTrap(){
  const mount=document.querySelector("#scale-plot");
  if(!mount) return;
  mount.innerHTML="";
  mount.appendChild(trapScaleSVG(TRAP_STATE.scale));

  const r=[0.5,0.5*TRAP_STATE.scale];
  const p=[0.62,0.53*TRAP_STATE.scale];
  const q=[0.53,0.62*TRAP_STATE.scale];
  const dp=euclidean(r,p),dq=euclidean(r,q);

  document.querySelector("#scale-dp").textContent=dp.toFixed(3);
  document.querySelector("#scale-dq").textContent=dq.toFixed(3);

  let msg;
  if(Math.abs(dp-dq)<1e-9){
    msg="Con escalas comparables, p y q están a la misma distancia de r.";
  }else{
    const best=dp<dq?"p":"q";
    msg=`Al ampliar f₂, ese objetivo domina la distancia: ahora ${best} parece mucho más cercano.`;
  }
  document.querySelector("#scale-message").textContent=msg;
  document.querySelectorAll(".scale-mode").forEach(b=>b.classList.toggle("active",+b.dataset.scale===TRAP_STATE.scale));
}
document.querySelectorAll(".scale-mode").forEach(btn=>btn.addEventListener("click",()=>{
  TRAP_STATE.scale=+btn.dataset.scale;renderScaleTrap();
}));

function trapReferenceSet(kind){
  const xs=kind==="uniform"
    ? Array.from({length:41},(_,i)=>i/40)
    : Array.from({length:31},(_,i)=>0.25+i*(0.50/30));
  return xs.map(x=>[x,paretoY(x)]);
}

function igdPlusFor(A,R){
  return R.reduce((sum,r)=>sum+Math.min(...A.map(a=>dPlus(r,a))),0)/R.length;
}

function refsetSVG(kind){
  const W=520,H=320,pad=46;
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox",`0 0 ${W} ${H}`);
  const {sx,sy}=scaleFactory(W,H,pad);

  let d="";
  for(let i=0;i<=120;i++){
    const x=i/120,y=paretoY(x);
    d+=(i===0?"M":"L")+sx(x)+" "+sy(y)+" ";
  }
  const front=document.createElementNS(NS,"path");
  front.setAttribute("d",d);front.setAttribute("class","front");svg.appendChild(front);

  trapReferenceSet(kind).forEach(r=>{
    const c=document.createElementNS(NS,"circle");
    c.setAttribute("cx",sx(r[0]));c.setAttribute("cy",sy(r[1]));
    c.setAttribute("r",3);c.setAttribute("class","refsetpt");svg.appendChild(c);
  });

  SETS.A.forEach(p=>{
    const c=document.createElementNS(NS,"circle");
    c.setAttribute("cx",sx(p[0]));c.setAttribute("cy",sy(p[1]));
    c.setAttribute("r",5.5);c.setAttribute("class","p-a");svg.appendChild(c);
  });
  SETS.B.forEach(p=>{
    const c=document.createElementNS(NS,"circle");
    c.setAttribute("cx",sx(p[0]));c.setAttribute("cy",sy(p[1]));
    c.setAttribute("r",5.5);c.setAttribute("class","p-b");svg.appendChild(c);
  });
  return svg;
}

function renderRefsetTrap(){
  const mount=document.querySelector("#refset-plot");
  if(!mount) return;
  mount.innerHTML="";
  mount.appendChild(refsetSVG(TRAP_STATE.refset));

  const R=trapReferenceSet(TRAP_STATE.refset);
  const a=igdPlusFor(SETS.A,R),b=igdPlusFor(SETS.B,R);
  document.querySelector("#refset-a").textContent=a.toFixed(4);
  document.querySelector("#refset-b").textContent=b.toFixed(4);
  document.querySelector("#refset-message").textContent =
    a<b
      ? "Con una referencia concentrada en el centro, A resulta favorecido."
      : "Con una referencia que cubre todo el PF, B resulta favorecido.";
  document.querySelectorAll(".refset-mode").forEach(btn=>btn.classList.toggle("active",btn.dataset.refset===TRAP_STATE.refset));
}
document.querySelectorAll(".refset-mode").forEach(btn=>btn.addEventListener("click",()=>{
  TRAP_STATE.refset=btn.dataset.refset;renderRefsetTrap();
}));

function igdPlain(A,R){
  return R.reduce((sum,r)=>sum+Math.min(...A.map(a=>euclidean(r,a))),0)/R.length;
}

function dominatedSVG(show){
  const W=520,H=320,pad=46;
  const svg=document.createElementNS(NS,"svg");
  svg.setAttribute("viewBox",`0 0 ${W} ${H}`);
  const {sx,sy}=scaleFactory(W,H,pad);

  let d="";
  for(let i=0;i<=120;i++){
    const x=i/120,y=paretoY(x);
    d+=(i===0?"M":"L")+sx(x)+" "+sy(y)+" ";
  }
  const front=document.createElementNS(NS,"path");
  front.setAttribute("d",d);front.setAttribute("class","front");svg.appendChild(front);

  SETS.A.forEach(p=>{
    const c=document.createElementNS(NS,"circle");
    c.setAttribute("cx",sx(p[0]));c.setAttribute("cy",sy(p[1]));
    c.setAttribute("r",6);c.setAttribute("class","p-a");svg.appendChild(c);
  });

  if(show){
    const p=[0.25,0.73];
    const c=document.createElementNS(NS,"circle");
    c.setAttribute("cx",sx(p[0]));c.setAttribute("cy",sy(p[1]));
    c.setAttribute("r",7);c.setAttribute("class","dompt");svg.appendChild(c);
    const t=document.createElementNS(NS,"text");
    t.setAttribute("x",sx(p[0])+9);t.setAttribute("y",sy(p[1])-8);
    t.textContent="dominado";svg.appendChild(t);
  }
  return svg;
}

function renderDominatedTrap(){
  const mount=document.querySelector("#dominated-plot");
  if(!mount) return;
  mount.innerHTML="";
  mount.appendChild(dominatedSVG(TRAP_STATE.dominated));

  const R=referenceSet(101);
  const Abase=SETS.A.map(p=>[...p]);
  const Aplus=[...Abase,[0.25,0.73]];

  const vals={
    igd0:igdPlain(Abase,R), igd1:igdPlain(Aplus,R),
    igdp0:igdPlusFor(Abase,R), igdp1:igdPlusFor(Aplus,R),
    hv0:hv2D(Abase,[1.10,1.10]), hv1:hv2D(Aplus,[1.10,1.10])
  };

  document.querySelector("#dom-igd-before").textContent=vals.igd0.toFixed(4);
  document.querySelector("#dom-igdp-before").textContent=vals.igdp0.toFixed(4);
  document.querySelector("#dom-hv-before").textContent=vals.hv0.toFixed(4);

  document.querySelector("#dom-igd-after").textContent=
    TRAP_STATE.dominated ? vals.igd1.toFixed(4) : "—";
  document.querySelector("#dom-igdp-after").textContent=
    TRAP_STATE.dominated ? vals.igdp1.toFixed(4) : "—";
  document.querySelector("#dom-hv-after").textContent=
    TRAP_STATE.dominated ? vals.hv1.toFixed(4) : "—";

  document.querySelector("#dominated-toggle").textContent=
    TRAP_STATE.dominated?"Quitar punto dominado":"Añadir punto dominado";

  document.querySelector("#dominated-message").textContent=
    TRAP_STATE.dominated
      ? "IGD mejora aunque añadimos una solución dominada; IGD+ y HV permanecen iguales."
      : "Añade el punto gris y observa qué indicador cambia.";
}
const domBtn=document.querySelector("#dominated-toggle");
if(domBtn) domBtn.addEventListener("click",()=>{
  TRAP_STATE.dominated=!TRAP_STATE.dominated;renderDominatedTrap();
});

// Reproducible simulation of distance concentration.
// 80 points are sampled uniformly in [0,1]^d using a fixed pseudo-random seed.
function mulberry32(seed){
  return function(){
    let t=seed+=0x6D2B79F5;
    t=Math.imul(t^(t>>>15),t|1);
    t^=t+Math.imul(t^(t>>>7),t|61);
    return ((t^(t>>>14))>>>0)/4294967296;
  };
}

function averageNearestFarthestRatio(dim,n=80){
  const rand=mulberry32(2026+dim);
  const pts=Array.from({length:n},()=>Array.from({length:dim},()=>rand()));
  let total=0;

  for(let i=0;i<n;i++){
    let nearest=Infinity, farthest=0;
    for(let j=0;j<n;j++){
      if(i===j) continue;
      let sum=0;
      for(let k=0;k<dim;k++){
        const delta=pts[i][k]-pts[j][k];
        sum+=delta*delta;
      }
      const dist=Math.sqrt(sum);
      if(dist<nearest) nearest=dist;
      if(dist>farthest) farthest=dist;
    }
    total+=nearest/farthest;
  }
  return total/n;
}

const DIM_RATIOS={};
[2,5,10,20,50].forEach(d=>{
  DIM_RATIOS[d]=averageNearestFarthestRatio(d);
});

function renderDimensionTrap(){
  const ratio=DIM_RATIOS[TRAP_STATE.dim];
  document.querySelector("#dimension-ratio").textContent=ratio.toFixed(2);
  document.querySelector("#dimension-fill").style.width=`${ratio*100}%`;
  document.querySelectorAll(".dim-btn").forEach(btn=>btn.classList.toggle("active",+btn.dataset.dim===TRAP_STATE.dim));
}
document.querySelectorAll(".dim-btn").forEach(btn=>btn.addEventListener("click",()=>{
  TRAP_STATE.dim=+btn.dataset.dim;renderDimensionTrap();
}));

renderScaleTrap();
renderRefsetTrap();
renderDominatedTrap();
renderDimensionTrap();
