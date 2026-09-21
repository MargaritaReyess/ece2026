
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
  const W=650,H=430;
  const svg=document.createElementNS(NS3,"svg");
  svg.setAttribute("viewBox",`0 0 ${W} ${H}`);

  // Isometric projection for a schematic 3D view.
  const project=([x,y,z])=>{
    const ox=325, oy=355;
    const sx=185, sy=78, sz=225;
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
