const STORAGE='YardBoss-V2-Build02-FULL-20260628_204331';
const defaults={totalSaved:0,totalXp:0,taskDone:{},academyDone:{},learned:[]};
let state=load();

function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(STORAGE)||'{}')}}catch(e){return {...defaults}}}
function save(){localStorage.setItem(STORAGE,JSON.stringify(state))}
function pct(n,t){return Math.max(0,Math.min(100,Math.round((n/t)*100)))}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.tt);window.tt=setTimeout(()=>t.classList.remove('show'),2200)}

function progressFor(index){let remaining=state.totalSaved;for(let i=0;i<index;i++)remaining-=ENVELOPES[i].target;return Math.max(0,Math.min(ENVELOPES[index].target,remaining))}
function taskCount(index){return TASKS.filter(t=>state.taskDone[index+':'+t.id]).length}
function academyCount(index){return LESSONS.filter(l=>state.academyDone[index+':'+l.id]).length}
function xpFor(index){let xp=0;TASKS.forEach(t=>{if(state.taskDone[index+':'+t.id])xp+=t.xp});LESSONS.forEach(l=>{if(state.academyDone[index+':'+l.id])xp+=l.xp});return xp}
function mysteryUnlocked(index){const e=ENVELOPES[index];return taskCount(index)>=e.taskRequired&&academyCount(index)>=e.academyRequired&&xpFor(index)>=e.xpRequired}
function envelopeComplete(index){const e=ENVELOPES[index];return progressFor(index)>=e.target&&taskCount(index)>=e.taskRequired&&academyCount(index)>=e.academyRequired&&xpFor(index)>=e.xpRequired&&mysteryUnlocked(index)}
function activeIndex(){for(let i=0;i<ENVELOPES.length;i++){if(!envelopeComplete(i))return i}return ENVELOPES.length-1}

function show(screen){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===screen));document.querySelectorAll('[data-screen]').forEach(b=>b.classList.toggle('active',b.dataset.screen===screen))}

function render(){const idx=activeIndex();const env=ENVELOPES[idx];const saved=progressFor(idx);const mp=pct(saved,env.target);const xp=xpFor(idx);const xpP=pct(xp,env.xpRequired);
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
renderRequirements(idx);renderEnvelopeCabinet(idx);renderTasks(idx);renderAcademy(idx);renderDictionary();save()}

function renderRequirements(idx){const env=ENVELOPES[idx];const rows=[
{icon:'📋',label:'TASKS',value:taskCount(idx)+' / '+env.taskRequired,done:taskCount(idx)>=env.taskRequired},
{icon:'🎓',label:'ACADEMY',value:academyCount(idx)+' / '+env.academyRequired,done:academyCount(idx)>=env.academyRequired},
{icon:'⭐',label:'XP',value:xpFor(idx)+' / '+env.xpRequired,done:xpFor(idx)>=env.xpRequired},
{icon:'🎁',label:'MYSTERY REWARD',value:mysteryUnlocked(idx)?'UNLOCKED':'LOCKED',done:mysteryUnlocked(idx),lock:!mysteryUnlocked(idx)}
];document.getElementById('requirements').innerHTML=rows.map(r=>`<div class="reqRow"><div class="reqIcon">${r.icon}</div><div>${r.label}</div><div class="reqCount">${r.value}</div><div class="${r.lock?'lock':'check '+(r.done?'done':'')}">${r.lock?'🔒':(r.done?'✓':'')}</div></div>`).join('')}

function renderEnvelopeCabinet(active){let html='';TIERS.forEach(t=>{html+=`<div class="tierTitle">${t.name.toUpperCase()} TIER</div><div class="miniGrid">`;t.ranks.forEach(rank=>{const i=rank-1,e=ENVELOPES[i];const status=envelopeComplete(i)?'done':i===active?'active':'locked';html+=`<div class="miniEnv ${e.tier} ${status==='active'?'active':''} ${status==='locked'?'locked':''}"><div>${rank}</div>${status==='done'?'<div class="ok">✓</div>':''}${status==='locked'?'<div class="lockedIcon">🔒</div>':''}${status==='active'?'<small>IN PROGRESS</small>':''}</div>`});html+='</div>'});document.getElementById('envelopeCabinet').innerHTML=html}

function renderTasks(idx){document.getElementById('taskList').innerHTML=TASKS.map(task=>{const key=idx+':'+task.id;return `<label class="taskItem"><input type="checkbox" data-task="${task.id}" ${state.taskDone[key]?'checked':''}><span><b>${task.label}</b><small>+${task.xp} XP</small></span></label>`}).join('')}

function renderAcademy(idx){const completed=academyCount(idx);const lesson=LESSONS[completed%LESSONS.length];const key=idx+':'+lesson.id;const done=!!state.academyDone[key];document.getElementById('lessonBox').innerHTML=`<h2>${lesson.word}</h2><p>${lesson.definition}</p><h3>${lesson.question}</h3>${lesson.answers.map((a,i)=>`<button class="answerBtn" data-answer="${i}" ${done?'disabled':''}>${a}</button>`).join('')}`}

function renderDictionary(){document.getElementById('dictionaryList').innerHTML=LESSONS.map(l=>{const learned=state.learned.includes(l.id);return `<div class="word ${learned?'':'locked'}"><b>${learned?'📖':'🔒'} ${l.word}</b><p>${learned?l.definition:'Locked'}</p></div>`}).join('')}

let moneyMode='add';
document.getElementById('addMoneyBtn').onclick=()=>{moneyMode='add';document.getElementById('moneyModalTitle').textContent='Add Money';document.getElementById('moneyModal').classList.add('show')};
document.getElementById('subtractMoneyBtn').onclick=()=>{moneyMode='subtract';document.getElementById('moneyModalTitle').textContent='Subtract Money';document.getElementById('moneyModal').classList.add('show')};
document.getElementById('cancelMoneyBtn').onclick=()=>document.getElementById('moneyModal').classList.remove('show');
document.getElementById('confirmMoneyBtn').onclick=()=>{const amount=Math.floor(Number(document.getElementById('moneyAmountInput').value||0));if(amount<=0)return toast('Enter amount');if(moneyMode==='add')state.totalSaved+=amount;else state.totalSaved=Math.max(0,state.totalSaved-amount);document.getElementById('moneyAmountInput').value='';document.getElementById('moneyModal').classList.remove('show');render()};

document.getElementById('taskList').onchange=e=>{if(!e.target.matches('[data-task]'))return;const idx=activeIndex();const key=idx+':'+e.target.dataset.task;const was=!!state.taskDone[key];state.taskDone[key]=e.target.checked;if(e.target.checked&&!was){state.totalXp+=25;toast('+25 XP')}if(!e.target.checked&&was)state.totalXp=Math.max(0,state.totalXp-25);render()};

document.getElementById('lessonBox').onclick=e=>{if(!e.target.matches('[data-answer]'))return;const idx=activeIndex();const lesson=LESSONS[academyCount(idx)%LESSONS.length];const answer=Number(e.target.dataset.answer);if(answer===lesson.correct){const key=idx+':'+lesson.id;if(!state.academyDone[key]){state.academyDone[key]=true;state.totalXp+=lesson.xp;if(!state.learned.includes(lesson.id))state.learned.push(lesson.id);toast('Correct! +'+lesson.xp+' XP')}}else toast('Not quite');render()};

document.querySelectorAll('[data-screen]').forEach(btn=>btn.onclick=()=>show(btn.dataset.screen));
document.getElementById('resetBtn').onclick=()=>{if(confirm('Reset progress?')){localStorage.removeItem(STORAGE);location.reload()}};
render();
