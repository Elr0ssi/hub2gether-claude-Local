"use client";
import {useState} from "react";
import {montant,nf} from "@/articles/dette/cadre";
const parts=[
 {nom:"Banques centrales et institutions officielles",md:1026,desc:"Institutions monétaires et détenteurs officiels, notamment au titre des réserves et des opérations monétaires."},
 {nom:"Investisseurs de long terme",md:437,desc:"Fonds, assureurs, gestionnaires d’actifs et investisseurs recherchant des titres liquides et réputés sûrs."},
 {nom:"Banques et courtiers",md:363,desc:"Intermédiaires financiers, établissements bancaires et négociants de titres."},
 {nom:"Titres conservés par l’agence fédérale",md:204,desc:"Titres détenus par l’émetteur pour les opérations de marché et de liquidité ; ce ne sont pas des investisseurs privés."},
 {nom:"Hedge funds",md:21,desc:"Fonds d’investissement utilisant des stratégies de négociation et de couverture."}
];
const couleurs=["#397e75","#78aaa0","#c5a98e","#a6a4c4","#d1bf9e"];
export function PorteursAllemagne(){
 const [actif,setActif]=useState<number|null>(null);
 const total=2052;const R=42,C=2*Math.PI*R;let acc=0;
 const arcs=parts.map((p,i)=>{const a={i,long:p.md/total*C,decal:-acc};acc+=p.md/total*C;return a});
 return <div className="dp-porteurs" style={{marginTop:16}}>
  <div className="dp-anneau-w">
   <svg className="dp-anneau-svg" viewBox="0 0 100 100" role="img" aria-label="Répartition estimée des détenteurs des titres fédéraux allemands au 30 juin 2026">
    {arcs.map(({i,long,decal})=><circle key={parts[i].nom} cx="50" cy="50" r={R} fill="none" stroke={couleurs[i]} strokeWidth={actif===i?14:11} strokeDasharray={`${Math.max(0,long-.8)} ${C}`} strokeDashoffset={decal} transform="rotate(-90 50 50)" onPointerEnter={()=>setActif(i)} onPointerLeave={()=>setActif(null)} onClick={()=>setActif(actif===i?null:i)} style={{cursor:"pointer",opacity:actif!==null&&actif!==i?.4:1}}/>)}
   </svg>
   <span className="dp-anneau-c"><b>{actif===null?"100 %":nf(parts[actif].md/total*100)}{actif===null?"":" %"}</b>{actif===null?"Titres fédéraux":parts[actif].nom}</span>
  </div>
  <ul className="dp-porteurs-l">{parts.map((p,i)=><li key={p.nom} onPointerEnter={()=>setActif(i)} onPointerLeave={()=>setActif(null)} style={{cursor:"pointer",opacity:actif!==null&&actif!==i?.5:1}}><span className="dp-porteurs-p" style={{background:couleurs[i]}}/><span className="dp-porteurs-n">{p.nom}</span><b>{nf(p.md/total*100)} %</b><small style={{display:"block",width:"100%",marginLeft:18}}>{montant(p.md,0,2026)} · {p.desc}</small></li>)}</ul>
  <p className="dos-notule">Total publié : {montant(total,0,2026)} ; somme des catégories arrondies : {montant(parts.reduce((s,p)=>s+p.md,0),0,2026)}. Les pourcentages sont calculés à partir des montants arrondis. Source : BMF / Finanzagentur, structure estimée au 30 juin 2026. Périmètre : titres fédéraux, pas dette Maastricht.</p>
 </div>
}
