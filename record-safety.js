/* Record safety UI. Existing browser copies are never removed automatically. */
'use strict';
const verifiedSafetyCopies=new Map();
function safetyCopyKeys(){
 const keys=[];
 for(let i=0;i<localStorage.length;i++){
  const key=localStorage.key(i);
  if(key==='p11122_v60_undo'||key==='p11122_v100_daily_safety'||/^p11122_pre_[a-z0-9_]+$/.test(key))keys.push(key);
 }
 return keys.sort();
}
function safetyCopyLabel(key){return key==='p11122_v60_undo'?'최근 변경 되돌리기':key==='p11122_v100_daily_safety'?'일일 안전본':key.replace('p11122_pre_','이전 안전본 · ')}
function downloadRawRecord(name,raw){
 const url=URL.createObjectURL(new Blob([raw],{type:'application/json'})),a=document.createElement('a');
 a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
}
function exportSafetyCopies(){
 const values={};for(const key of safetyCopyKeys())values[key]=localStorage.getItem(key);
 values[DB_KEY]=localStorage.getItem(DB_KEY);
 if(globalThis.YEOKSANG_FAILED_RAW)values.YEOKSANG_UNSAVED=globalThis.YEOKSANG_FAILED_RAW;
 downloadRawRecord('YEOKSANG_STORAGE_ARCHIVE_'+todayDate()+'.json',JSON.stringify({format:'YEOKSANG_STORAGE_ARCHIVE',version:1,exportedAt:new Date().toISOString(),values}));
}
async function verifySafetyExport(file){
 try{
  const payload=JSON.parse(await file.text());if(!payload.values||typeof payload.values!=='object')throw Error('형식');
  let count=0;for(const key of safetyCopyKeys())if(typeof payload.values[key]==='string'&&payload.values[key]===localStorage.getItem(key)){JSON.parse(payload.values[key]);verifiedSafetyCopies.set(key,payload.values[key]);count++;}
  if(!count)throw Error('일치하는 안전본 없음');
  alert(count+'종류 안전본의 파일 내용이 현재 저장값과 일치합니다. 선택한 안전본만 정리할 수 있습니다.');renderStorageManagement();return true;
 }catch{alert('현재 안전본과 일치하는 내보내기 파일인지 확인하세요. 아무 기록도 삭제하지 않았습니다.');return false;}
}
function deleteVerifiedCopies(keys){
 const allowed=new Set(safetyCopyKeys());
 if(!keys.length||keys.some(k=>!allowed.has(k)||verifiedSafetyCopies.get(k)!==localStorage.getItem(k))){alert('먼저 안전본을 내보내고 받은 파일을 확인하세요.');return false;}
 if(!confirm('선택한 안전본 '+keys.length+'종류를 브라우저에서 삭제할까요? 현재 공부 기록과 미저장 기록은 그대로이며, 안전본은 확인한 파일에 보관됩니다.'))return false;
 for(const key of keys){localStorage.removeItem(key);verifiedSafetyCopies.delete(key);}
 renderStorageManagement();renderUndoList();renderSafetySnapshotsV10();return true;
}
function renderStorageManagement(target){
 const boxes=target?[target]:[document.getElementById('storageManager'),document.getElementById('recoveryStorageManager')].filter(Boolean);
 for(const box of boxes){
  const keys=safetyCopyKeys(),size=key=>((localStorage.getItem(key)?.length||0)*2/1024).toFixed(0);
  box.innerHTML='<h3>저장 공간 관리</h3><p>현재 기록 '+size(DB_KEY)+' KB · 안전본 자동 복제 중지</p><div class="row"><button class="btn ghost safety-export">안전본 내보내기</button><label class="btn ghost">받은 파일 확인<input class="safety-verify" type="file" accept=".json,application/json" hidden></label></div><div class="safety-copy-list">'+keys.map(key=>'<label class="safety-copy"><input type="checkbox" data-safety-key="'+esc(key)+'" '+(verifiedSafetyCopies.get(key)===localStorage.getItem(key)?'':'disabled')+'><span>'+esc(safetyCopyLabel(key))+'</span><b>'+size(key)+' KB</b></label>').join('')+'</div>'+(keys.length?'<button class="btn danger safety-delete">선택 안전본 삭제</button>':'<p>정리할 내부 안전본 없음</p>');
  box.querySelector('.safety-export').onclick=exportSafetyCopies;
  box.querySelector('.safety-verify').onchange=e=>{const file=e.target.files?.[0];if(file)verifySafetyExport(file);};
  const del=box.querySelector('.safety-delete');if(del)del.onclick=()=>deleteVerifiedCopies([...box.querySelectorAll('[data-safety-key]:checked')].map(x=>x.dataset.safetyKey));
 }
}
function retryFailedSave(){
 const raw=globalThis.YEOKSANG_FAILED_RAW;if(!raw)return false;
 if(!safeSetItem(DB_KEY,raw))return false;
 DB=migrateDB(JSON.parse(raw));LAST_SAVED_JSON=raw;globalThis.YEOKSANG_FAILED_RAW=null;
 document.getElementById('y211-recovery')?.remove();navigate('dashboard');alert('미저장 변경을 저장했습니다.');return true;
}
function validateRecordTree(root){
 let count=0;
 function visit(value,depth=0,key=''){
  if(++count>250000||depth>32)return false;
  if(value==null||typeof value==='boolean')return true;
  if(typeof value==='number')return Number.isFinite(value);
  if(typeof value==='string')return value.length<=2000000&&(!/^(id|key|ref|archiveId|packageId|testId|questionId|bookId|courseId|priority)$/.test(key)||!/['"<>\x00-\x1f]/.test(value));
  if(typeof value!=='object')return false;
  if(Array.isArray(value))return value.length<=30000&&value.every(x=>visit(x,depth+1,key));
  return Object.entries(value).every(([k,v])=>!['__proto__','prototype','constructor'].includes(k)&&visit(v,depth+1,k));
 }
 if(!root||!visit(root))return false;
 if(root.app?.name==='曆象')return Array.isArray(root.tasks)||!!root.tasks;
 for(const k of ['tasks','schedules'])if(root[k]!=null&&(!y21Object(root[k])||Object.entries(root[k]).some(([date,rows])=>!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Array.isArray(rows)||rows.some(x=>!y21Object(x)))))return false;
 for(const k of ['waiting','trash','tests','analysisArchive','analysisImports','books','customLectures','automations'])if(root[k]!=null&&(!Array.isArray(root[k])||root[k].some(x=>!y21Object(x))))return false;
 return true;
}
const backupShapeValidator=__impl_validateBackupObject;
__impl_validateBackupObject=function(raw){return backupShapeValidator(raw)&&validateRecordTree(raw);};
const packageShapeValidator=y220ValidatePackage;
y220ValidatePackage=function(raw){return validateRecordTree(raw)&&packageShapeValidator(raw)&&raw.tests.every(t=>{
 const subject=t.subject||raw.subject,limit=QUESTION_LIMITS[subject];if(!limit||!Array.isArray(t.questions||[]))return false;
 if(t.score!=null&&(!Number.isFinite(Number(t.score))||Number(t.score)<0||Number(t.score)>subjectScoreLimit(subject)))return false;
 if(t.grade!=null&&(!Number.isInteger(Number(t.grade))||Number(t.grade)<1||Number(t.grade)>9))return false;
 return (t.questions||[]).every(q=>q.number==null||validQuestionInput([q.number],limit));
});};
function detachArchiveReviews(archiveId,number=null){
 const bundle={tests:[],fragments:[],tasks:[],waiting:[]},pairs=[];
 for(const t of [...DB.tests]){
  if(!t.archiveReviewOnly||t.archiveRef!==archiveId)continue;
  const questions=(t.questionRecords||[]).filter(q=>number==null||Number(q.number)===Number(number));
  for(const q of questions)pairs.push({testId:t.id,questionId:q.id});
  if(number==null||questions.length===(t.questionRecords||[]).length){bundle.tests.push(deep(t));DB.tests=DB.tests.filter(x=>x.id!==t.id);}
  else if(questions.length){bundle.fragments.push({testId:t.id,questions:deep(questions)});t.questionRecords=t.questionRecords.filter(q=>!questions.includes(q));}
 }
 const linked=t=>pairs.some(p=>typeof t.reviewRef==='string'?t.reviewRef===p.testId+':'+p.questionId:t.reviewRef?.testId===p.testId&&t.reviewRef?.questionId===p.questionId);
 for(const [date,rows] of Object.entries(DB.tasks))for(const task of [...rows])if(linked(task)&&!task.done){bundle.tasks.push({date,task:deep(task)});removeTask(date,task.id,false);}
 DB.waiting=DB.waiting.filter(task=>{if(!linked(task))return true;bundle.waiting.push(deep(task));return false;});
 return bundle;
}
function restoreArchiveReviews(bundle){
 if(!bundle)return;
 for(const t of bundle.tests||[])if(!DB.tests.some(x=>x.id===t.id))DB.tests.push(deep(t));
 for(const f of bundle.fragments||[]){const t=DB.tests.find(x=>x.id===f.testId);if(t)for(const q of f.questions||[])if(!t.questionRecords.some(x=>x.id===q.id))t.questionRecords.push(deep(q));}
 for(const {date,task} of bundle.tasks||[])if(!tasksFor(date).some(x=>x.id===task.id))tasksFor(date).push(deep(task));
 for(const task of bundle.waiting||[])if(!DB.waiting.some(x=>x.id===task.id))DB.waiting.push(deep(task));
}
document.addEventListener('DOMContentLoaded',()=>{
 globalThis.addEventListener?.('storage',e=>{
  if(e.key!==DB_KEY||e.newValue===LAST_PERSISTED_RAW)return;
  const badge=document.getElementById('runtimeStatus');if(badge)badge.textContent='다른 탭에서 변경됨 · 새로고침 필요';
 });
});
