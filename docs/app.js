
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
