const STORAGE='YardBoss-V2-Build03-Academy500-20260629_134858';
const defaults={totalSaved:0,totalXp:0,taskDone:{},academyDone:{},learned:[],reviewLessonId:null};
let state=load();

function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(STORAGE)||'{}')}}catch(e){return {...defaults}}}
function save(){localStorage.setItem(STORAGE,JSON.stringify(state))}
function pct(n,t){return Math.max(0,Math.min(100,Math.round((n/t)*100)))}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove('show'),2200)}

function showError(msg){
 const box=document.getElementById('globalMessage');
 if(box){box.textContent=msg;box.classList.add('show');setTimeout(()=>box.classList.remove('show'),3200);}
 toast(msg);
}

function emptyState(message){
 return `<div class="emptyState">${message}</div>`;
}


function progressFor(index){let remaining=state.totalSaved;for(let i=0;i<index;i++)remaining-=ENVELOPES[i].target;return Math.max(0,Math.min(ENVELOPES[index].target,remaining))}
function currentLesson(index){return LESSONS[index % LESSONS.length]}
function taskCount(index){return TASKS.filter(t=>state.taskDone[index+':'+t.id]).length}
function academyCount(index){const lesson=currentLesson(index);return ACADEMY_STEPS.filter(s=>state.academyDone[index+':'+lesson.id+':'+s.id]).length}
function xpFor(index){let xp=0;TASKS.forEach(t=>{if(state.taskDone[index+':'+t.id])xp+=t.xp});LESSONS.forEach(l=>ACADEMY_STEPS.forEach(s=>{if(state.academyDone[index+':'+l.id+':'+s.id])xp+=s.xp}));return xp}
function mysteryUnlocked(index){const e=ENVELOPES[index];return taskCount(index)>=e.taskRequired&&academyCount(index)>=e.academyRequired&&xpFor(index)>=e.xpRequired}
function envelopeComplete(index){const e=ENVELOPES[index];return progressFor(index)>=e.target&&taskCount(index)>=e.taskRequired&&academyCount(index)>=e.academyRequired&&xpFor(index)>=e.xpRequired&&mysteryUnlocked(index)}
function activeIndex(){for(let i=0;i<ENVELOPES.length;i++)if(!envelopeComplete(i))return i;return ENVELOPES.length-1}
function show(screen){state.reviewLessonId=null;document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===screen));document.querySelectorAll('[data-screen]').forEach(b=>b.classList.toggle('active',b.dataset.screen===screen));render()}

function render(){const idx=activeIndex(),env=ENVELOPES[idx],saved=progressFor(idx),mp=pct(saved,env.target),xp=xpFor(idx),xpP=pct(xp,env.xpRequired);
document.getElementById('currentTier').textContent=env.tier.toUpperCase();
document.getElementById('currentRank').textContent=env.title.toUpperCase();
document.getElementById('tierBadge').textContent=env.tier[0];
document.getElementById('paperBadge').textContent=env.tier[0];
document.getElementById('ringSaved').textContent='$'+saved;
document.getElementById('ringTarget').textContent='of $'+env.target;
document.getElementById('moneyRing').style.setProperty('--p',mp);
document.getElementById('moneyFill').style.width=mp+'%';
document.getElementById('moneyText').textContent='$'+saved+' of $'+env.target;
document.getElementById('moneyPercent').textContent=mp+'%';
document.getElementById('xpFill').style.width=xpP+'%';
document.getElementById('xpText').textContent=xp+' / '+env.xpRequired+' XP';
document.getElementById('totalSaved').textContent='$'+state.totalSaved;
document.getElementById('totalXp').textContent=state.totalXp+' XP';
document.getElementById('paperTitle').textContent=env.tier.toUpperCase()+' ENVELOPE';
renderRequirements(idx);renderBuildersCode(idx);renderBooks(idx);renderEnvelopeCabinet(idx);renderTasks(idx);renderAcademy(idx);renderDictionary();save()}

function renderRequirements(idx){const env=ENVELOPES[idx];const rows=[
{icon:'📋',label:'TASKS',value:taskCount(idx)+' / '+env.taskRequired,done:taskCount(idx)>=env.taskRequired},
{icon:'🎓',label:'ACADEMY',value:academyCount(idx)+' / '+env.academyRequired,done:academyCount(idx)>=env.academyRequired},
{icon:'⭐',label:'XP',value:xpFor(idx)+' / '+env.xpRequired,done:xpFor(idx)>=env.xpRequired},
{icon:'🎁',label:'MYSTERY REWARD',value:mysteryUnlocked(idx)?'UNLOCKED':'LOCKED',done:mysteryUnlocked(idx),lock:!mysteryUnlocked(idx)}
];document.getElementById('requirements').innerHTML=rows.map(r=>`<div class="reqRow"><div class="reqIcon">${r.icon}</div><div>${r.label}</div><div class="reqCount">${r.value}</div><div class="${r.lock?'lock':'check '+(r.done?'done':'')}">${r.lock?'🔒':(r.done?'✓':'')}</div></div>`).join('')}

function renderEnvelopeCabinet(active){let html='';TIERS.forEach(t=>{html+=`<div class="tierTitle">${t.name.toUpperCase()} TIER</div><div class="miniGrid">`;t.ranks.forEach(rank=>{const i=rank-1,e=ENVELOPES[i],status=envelopeComplete(i)?'done':i===active?'active':'locked';html+=`<div class="miniEnv ${e.tier} ${status==='active'?'active':''} ${status==='locked'?'locked':''}"><div>${rank}</div>${status==='done'?'<div class="ok">✓</div>':''}${status==='locked'?'<div class="lockedIcon">🔒</div>':''}${status==='active'?'<small>IN PROGRESS</small>':''}</div>`});html+='</div>'});document.getElementById('envelopeCabinet').innerHTML=html}


function renderBuildersCode(idx){
 const code=getBuilderCode(idx);
 const book=getBookForEnvelope(idx);
 const isUnlocked=idx<=activeIndex();
 const reminder=document.getElementById('builderReminder');
 if(reminder)reminder.textContent=isUnlocked?code.reminder:'🔒 The next Builder’s Code is hidden until the envelope is unlocked.';
 const box=document.getElementById('buildersCode');
 if(!box)return;
 if(!isUnlocked){
  box.className='buildersCode locked';
  box.innerHTML='<div class="codeKicker">🔒 Hidden Builder’s Code</div><div class="codeTheme">?????</div><div class="codeText">Theme, quote, meaning, vocabulary, reflection, and mystery reward will reveal when this envelope opens.</div>';
  return;
 }
 box.className='buildersCode';
 box.innerHTML=`
  <div class="codeKicker">${book.title} • ${book.name}</div>
  <div class="codeTheme">${code.theme}</div>
  <div class="codeQuote">“${code.quote}”</div>
  <div class="codeSource">${code.source}</div>
  <div class="codeText"><b>What it means:</b> ${code.meaning}</div>
  <div class="codeVocab">${code.vocab.map(v=>`<div><b>${v[0]}:</b> ${v[1]}</div>`).join('')}</div>
  <div class="codeText"><b>Builder’s Reflection:</b> ${code.reflection}</div>
  <div class="codeText"><b>Mystery Reward:</b> ${mysteryUnlocked(idx)?'Unlocked — use this principle today.':'🔒 Hidden until requirements are complete.'}</div>
 `;
}

function renderBooks(active){
 const panel=document.getElementById('booksPanel');
 if(!panel)return;
 const currentBookIndex=Math.floor(active/5);
 panel.innerHTML=`
  <div class="booksTitle">THE BUILDER’S BOOKS</div>
  <div class="booksGrid">
   ${BOOKS.map((book,i)=>{
    const unlocked=i<=currentBookIndex;
    return `<div class="bookCard ${unlocked?'':'locked'}"><b>${unlocked?book.title:'🔒 Book '+(i+1)}</b><span>${unlocked?book.name:'Hidden until reached'}</span></div>`;
   }).join('')}
  </div>`;
}


function renderTasks(idx){document.getElementById('taskList').innerHTML=(!TASKS||TASKS.length===0)?emptyState('No tasks found.'):TASKS.map(task=>{const key=idx+':'+task.id;return `<label class="taskItem"><input type="checkbox" data-task="${task.id}" ${state.taskDone[key]?'checked':''}><span><b>${task.label}</b><small>+${task.xp} XP</small></span></label>`}).join('')}

function renderAcademy(idx){const lesson=state.reviewLessonId?LESSONS.find(l=>l.id===state.reviewLessonId):currentLesson(idx),review=!!state.reviewLessonId;let body=`<h2>${review?'Review: ':''}${lesson.word}</h2>`;
body+=`<label class="lessonStep"><input type="checkbox" data-step="words" ${state.academyDone[idx+':'+lesson.id+':words']?'checked':''} ${review?'disabled':''}><span class="content"><b>1. Words and definitions</b><small>+100 XP</small><p>${lesson.words.map(w=>'<b>'+w.term+':</b> '+w.def).join('<br>')}</p></span></label>`;
body+=`<label class="lessonStep"><input type="checkbox" data-step="examples" ${state.academyDone[idx+':'+lesson.id+':examples']?'checked':''} ${review?'disabled':''}><span class="content"><b>2. Examples / explanations</b><small>+100 XP</small><p>${lesson.examples}</p></span></label>`;
body+=`<label class="lessonStep"><input type="checkbox" data-step="implementation" ${state.academyDone[idx+':'+lesson.id+':implementation']?'checked':''} ${review?'disabled':''}><span class="content"><b>3. Real-world personalized implementation</b><small>+100 XP</small><p>${lesson.implementation}</p></span></label>`;
body+=`<label class="lessonStep"><input type="checkbox" data-step="fact" ${state.academyDone[idx+':'+lesson.id+':fact']?'checked':''} ${review?'disabled':''}><span class="content"><b>4. Interesting, fun, or useful fact</b><small>+100 XP</small><p>${lesson.fact}</p></span></label>`;
const quizDone=state.academyDone[idx+':'+lesson.id+':quiz'];body+=`<div class="lessonReview"><b>5. Review Quiz</b><small> +100 XP</small><h3>${lesson.question}</h3>${lesson.answers.map((a,i)=>`<button class="answerBtn" data-answer="${i}" ${quizDone||review?'disabled':''}>${a}</button>`).join('')}</div>`;
if(review)body+=`<button class="answerBtn" id="closeReview">Close Review</button>`;
document.getElementById('lessonBox').innerHTML=body;}

function renderDictionary(){document.getElementById('dictionaryList').innerHTML=(!LESSONS||LESSONS.length===0)?emptyState('No dictionary words found.'):LESSONS.map(l=>{const learned=state.learned.includes(l.id);return `<button class="word ${learned?'':'locked'}" data-word="${l.id}" ${learned?'':'disabled'}><b>${learned?'📖':'🔒'} ${l.word}</b><p>${learned?l.words.map(w=>w.term).join(', '):'Locked'}</p></button>`}).join('')}

function awardAcademyStep(idx,lesson,step){const key=idx+':'+lesson.id+':'+step;if(!state.academyDone[key]){state.academyDone[key]=true;state.totalXp+=100;if(!state.learned.includes(lesson.id))state.learned.push(lesson.id);toast('+100 XP')}}

let moneyMode='add';
document.getElementById('addMoneyBtn').onclick=()=>{moneyMode='add';document.getElementById('moneyModalTitle').textContent='Add Money';document.getElementById('moneyModal').classList.add('show')};
document.getElementById('subtractMoneyBtn').onclick=()=>{moneyMode='subtract';document.getElementById('moneyModalTitle').textContent='Subtract Money';document.getElementById('moneyModal').classList.add('show')};
document.getElementById('cancelMoneyBtn').onclick=()=>document.getElementById('moneyModal').classList.remove('show');
document.getElementById('confirmMoneyBtn').onclick=()=>{const amount=Math.floor(Number(document.getElementById('moneyAmountInput').value||0));if(!Number.isFinite(amount)||amount<=0)return showError('Enter a valid amount.');if(amount>100000)return showError('Amount is too large.');if(moneyMode==='add')state.totalSaved+=amount;else state.totalSaved=Math.max(0,state.totalSaved-amount);document.getElementById('moneyAmountInput').value='';document.getElementById('moneyModal').classList.remove('show');render()};

document.getElementById('taskList').onchange=e=>{if(!e.target.matches('[data-task]'))return;const idx=activeIndex(),task=TASKS.find(t=>t.id===e.target.dataset.task),key=idx+':'+task.id,was=!!state.taskDone[key];state.taskDone[key]=e.target.checked;if(e.target.checked&&!was){state.totalXp+=task.xp;toast('+'+task.xp+' XP')}if(!e.target.checked&&was)state.totalXp=Math.max(0,state.totalXp-task.xp);render()};

document.getElementById('lessonBox').onchange=e=>{if(!e.target.matches('[data-step]'))return;const idx=activeIndex(),lesson=state.reviewLessonId?LESSONS.find(l=>l.id===state.reviewLessonId):currentLesson(idx);if(e.target.checked)awardAcademyStep(idx,lesson,e.target.dataset.step);render()};
document.getElementById('lessonBox').onclick=e=>{if(e.target.id==='closeReview'){state.reviewLessonId=null;show('dictionary');return}if(!e.target.matches('[data-answer]'))return;const idx=activeIndex(),lesson=state.reviewLessonId?LESSONS.find(l=>l.id===state.reviewLessonId):currentLesson(idx),answer=Number(e.target.dataset.answer);if(answer===lesson.correct)awardAcademyStep(idx,lesson,'quiz');else toast('Not quite');render()};

document.getElementById('dictionaryList').onclick=e=>{const btn=e.target.closest('[data-word]');if(!btn)return;state.reviewLessonId=btn.dataset.word;document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id==='academy'));document.querySelectorAll('[data-screen]').forEach(b=>b.classList.toggle('active',b.dataset.screen==='academy'));render()};

document.querySelectorAll('[data-screen]').forEach(btn=>btn.onclick=()=>show(btn.dataset.screen));
document.getElementById('resetBtn').onclick=()=>{if(confirm('Reset progress?')){localStorage.removeItem(STORAGE);location.reload()}};
render();


window.addEventListener('load',()=>{
 const overlay=document.getElementById('appOverlay');
 if(overlay)setTimeout(()=>overlay.classList.add('hide'),250);
});
