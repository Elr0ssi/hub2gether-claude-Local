"use client";
import { useState } from "react";
import { montant } from "@/articles/dette/cadre";
type Poste = {nom:string;md:number};
type Complement = {texte:string;sous?:Poste[]};
export function DetailsPostes({titre,postes,complements={}}:{titre:string;postes:readonly Poste[];complements?:Record<string,Complement>}) {
 const [actif,setActif]=useState<string|null>(null);
 const couleurs=["#4f8c83","#91b5a6","#d2b29c","#a5a5c5","#d6c89d","#8d9dba"];
 return <section aria-label={titre} style={{marginTop:20}}>
  <h4 style={{marginBottom:12,fontSize:"1rem"}}>{titre} <small style={{fontWeight:400,opacity:.7}}>· cliquer sur une catégorie</small></h4>
  {postes.map((p,i)=>{const ouvert=actif===p.nom;const c=complements[p.nom];return <div key={p.nom} style={{borderBottom:"1px solid var(--bordure, #d8d8d8)"}}>
   <button type="button" aria-expanded={ouvert} onClick={()=>setActif(ouvert?null:p.nom)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"13px 4px",border:0,background:"transparent",color:"inherit",textAlign:"left",cursor:"pointer"}}>
    <span style={{width:10,height:10,borderRadius:3,background:couleurs[i%couleurs.length],flexShrink:0}}/>
    <span style={{flex:1}}>{p.nom}</span><strong>{montant(p.md,1)}</strong><span aria-hidden="true">{ouvert?"−":"+"}</span>
   </button>
   {ouvert&&<div style={{padding:"0 8px 18px 26px"}}>
    <p style={{lineHeight:1.6,marginBottom:12}}>{c?.texte||"Ce poste regroupe plusieurs dépenses ou recettes publiques. Son périmètre exact dépend de la classification de comptabilité nationale indiquée dans la source du graphique."}</p>
    {c?.sous&&<><div style={{display:"flex",height:13,overflow:"hidden",borderRadius:8,margin:"14px 0 10px"}}>
     {c.sous.map((s,j)=><span key={s.nom} title={s.nom} style={{flex:Math.max(s.md,0),background:couleurs[j%couleurs.length]}}/>)}
    </div>
    {c.sous.map((s,j)=><div key={s.nom} style={{display:"flex",justifyContent:"space-between",gap:10,padding:"6px 0",fontSize:14}}><span><span style={{display:"inline-block",width:9,height:9,marginRight:8,background:couleurs[j%couleurs.length],borderRadius:2}}/>{s.nom}</span><strong style={{whiteSpace:"nowrap"}}>{montant(s.md,0)}</strong></div>)}
    <p style={{fontSize:12,opacity:.75}}>Ventilation indicative en milliards d’euros, montants arrondis. Les totaux peuvent différer légèrement.</p></>}
   </div>}
  </div>})}
 </section>;
}
