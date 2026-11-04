let selectedSenateState=null;
const stateDialog=document.getElementById('state-results');
function renderStateResults(){
 if(!selectedSenateState)return;
 const state=stateFeatures?.find(s=>stateCodes[s.id]===selectedSenateState);
 document.getElementById('state-results-title').textContent=(state?.properties.name||selectedSenateState)+' · U.S. Senate';
 const content=document.getElementById('state-results-content');content.replaceChildren();
 const add=(parent,tag,text,className)=>{const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;parent.append(el);return el;};
 const races=Object.entries(data?.senate?.region_results||{}).filter(([key])=>key.toUpperCase().split('-')[0]===selectedSenateState);
 if(!data?.senate){add(content,'p','Statewide results are loading.');return;}
 if(!races.length){add(content,'p','No U.S. Senate race in this state in 2026.');return;}
 for(const [key,race] of races){
  const section=document.createElement('section');content.append(section);
  if(races.length>1)add(section,'h3',key.includes('-')?'Special election':'Regular election');
  const candidates=[...(race.candidates||[])].sort((a,b)=>(+b.votes||0)-(+a.votes||0));
  const total=candidates.reduce((sum,c)=>sum+(+c.votes||0),0);
  add(section,'p',total.toLocaleString()+' total votes reported','state-total');
  const table=document.createElement('table');table.setAttribute('aria-label','Statewide candidate vote totals');section.append(table);
  const header=document.createElement('tr');const thead=document.createElement('thead');thead.append(header);table.append(thead);
  for(const label of ['Candidate','Votes','Share'])add(header,'th',label);
  const body=document.createElement('tbody');table.append(body);
  for(const c of candidates){const row=document.createElement('tr');body.append(row);const cell=add(row,'td',c.name);add(cell,'small',c.party||'');add(row,'td',(+c.votes||0).toLocaleString());add(row,'td',total?((+c.votes||0)/total*100).toFixed(2)+'%':'—');}
  add(section,'p',total?(race.percent_reporting==null?'':race.percent_reporting+'% reporting'):'No votes reported yet.','state-note');
 }
 const time=data.senate.last_updated;
 add(content,'p','Statewide totals · '+(time?new Date(time).toLocaleString('en-US',{timeZone:'America/New_York'})+' ET · ':'')+'civicAPI. Preliminary returns; leads are not race calls.','state-note');
}
function openStateResults(state){
 if(office!=='senate')return;
 selectedSenateState=state;tip.hidden=true;renderStateResults();
 if(!stateDialog.open)stateDialog.showModal();
 if(stateDialog.style.left){const rect=stateDialog.getBoundingClientRect();constrainStateDialog(rect.left,rect.top);}
}
document.getElementById('close-state-results').addEventListener('click',()=>stateDialog.close());
stateDialog.addEventListener('click',event=>{if(event.target!==stateDialog)return;const r=stateDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)stateDialog.close();});
const stateHeader=stateDialog.querySelector('header');
stateHeader.style.cursor='move';
stateHeader.style.touchAction='none';
stateHeader.style.userSelect='none';
let stateDrag=null;
function constrainStateDialog(left,top){
 const rect=stateDialog.getBoundingClientRect();
 stateDialog.style.position='fixed';
 stateDialog.style.right='auto';
 stateDialog.style.bottom='auto';
 stateDialog.style.margin='0';
 stateDialog.style.left=Math.max(8,Math.min(left,innerWidth-rect.width-8))+'px';
 stateDialog.style.top=Math.max(8,Math.min(top,innerHeight-rect.height-8))+'px';
}
stateHeader.addEventListener('pointerdown',event=>{
 if(event.button!==0||event.target.closest('button'))return;
 const rect=stateDialog.getBoundingClientRect();
 stateDrag={id:event.pointerId,offsetX:event.clientX-rect.left,offsetY:event.clientY-rect.top};
 constrainStateDialog(rect.left,rect.top);
 stateHeader.setPointerCapture(event.pointerId);
 event.stopPropagation();
 event.preventDefault();
});
stateHeader.addEventListener('pointermove',event=>{
 if(stateDrag?.id===event.pointerId){event.preventDefault();event.stopPropagation();constrainStateDialog(event.clientX-stateDrag.offsetX,event.clientY-stateDrag.offsetY);}
});
function endStateDrag(event){
 if(stateDrag?.id!==event.pointerId)return;
 stateDrag=null;
 if(stateHeader.hasPointerCapture(event.pointerId))stateHeader.releasePointerCapture(event.pointerId);
}
stateHeader.addEventListener('pointerup',endStateDrag);
stateHeader.addEventListener('pointercancel',endStateDrag);
stateHeader.addEventListener('lostpointercapture',()=>stateDrag=null);
window.addEventListener('resize',()=>{
 if(stateDialog.open&&stateDialog.style.left){const rect=stateDialog.getBoundingClientRect();constrainStateDialog(rect.left,rect.top);}
});
