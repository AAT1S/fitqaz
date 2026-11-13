READY.then(()=>{
const $=(s,r=document)=>r.querySelector(s);
const KEY=curKey();let USER=U[KEY];
if(!USER){location.replace('auth.html');return}
if(USER.v!==2){U[KEY]=USER={...USER,s:{xp:0},v:2,created:localISO()};putUser(KEY)}
const T=USER.role==='teacher',AD=USER.role==='admin',nm=r=>r.fio||r.name;
const fname=(location.pathname.split('/').pop()||'').replace('.html',''),page=(!fname||fname==='index')?'home':fname;
const OKP=AD?['home','support','settings']:T?['home','calendar','students','profile','coach','rating','settings','support']:['home','calendar','progress','profile','quests','rating','settings','coach','support'];
if(!OKP.includes(page)){location.replace('index.html');return}
const DB={
 quests:[
  {id:1,n:'Пробежать 15 км за неделю',xp:800,max:15,u:'км',step:5},
  {id:2,n:'Посетить 3 занятия',xp:600,max:3,u:'зан.',step:1},
  {id:3,n:'100 приседаний',xp:400,max:100,u:'',step:25},
  {id:4,n:'Пройти 50 000 шагов',xp:700,max:50,u:'тыс.',step:10}],
 students:[],
 norms:[['Бег 100 м',0],['Подтягивания',0],['Пресс (1 мин)',0],['Прыжок в длину',0]]
};
const dflt=s=>{const o={xp:0,goals:[],qd:[],...(s||{})};o.qp={...o.qp};o.att={...o.att};o.mk={...o.mk};o.qd=[...o.qd];o.goals=[...o.goals];return o};
let S=dflt(USER.s);
let UNR=0,ADX={};
const save=()=>{USER.s=S;U[KEY]=USER;putS(KEY)};
const lvl=(x=S.xp)=>({l:1+Math.floor(x/500),x:x%500});
const scoreOf=x=>(x||0),score=()=>scoreOf(S.xp);
const reals=()=>Object.entries(U).filter(([k,r])=>r.role==='student').map(([k,r])=>({...r,k:r.k||k}));
const board=()=>[...DB.students.map(s=>({n:s[0],u:s[1],p:s[2]})),...reals().filter(r=>r.k!==KEY).map(r=>({n:nm(r),u:gname(r),p:scoreOf(r.s&&r.s.xp)})),...(T?[]:[{n:nm(USER)+' (вы)',u:gname(USER),p:score(),me:1}])].sort((a,b)=>b.p-a.p);
const row=(s,i)=>`<div class="st ${s.me?'me':''}"><span class="rk r${i+1}">${i+1}</span><span class="av">${s.n[0]}</span><div><b>${s.n}</b><small>${s.u}</small></div><em>${s.p}${ic('flame')}</em></div>`;
const rows=n=>{const b=board(),m=b.findIndex(s=>s.me);let h=b.slice(0,n).map(row).join('');if(m>=n)h+='<div class="sep"><i></i><i></i><i></i></div>'+row(b[m],m);return h};
function rankFx(){const m=$('.st.me');if(!m)return;const r=board().findIndex(s=>s.me)+1,p=S.rank;if(p===r)return;S.rank=r;save();
 if(p&&r<p){m.animate([{transform:`translateY(${(p-r)*Math.min(m.offsetHeight,64)}px)`,opacity:.3},{transform:'none',opacity:1}],{duration:800,easing:'ease-out'});setTimeout(()=>toast(`Вы поднялись на ${r} место`),1900)}}
const head=t=>`<div class="page-h"><a class="back" href="index.html">${ic('back')}</a><h1>${t}</h1></div>`;
const headB=(t,a)=>`<div class="page-h"><button class="back" data-a="${a}">${ic('back')}</button><h1>${t}</h1></div>`;
function toast(m){const t=document.createElement('div');t.id='toast';t.textContent=m;document.body.append(t);setTimeout(()=>t.remove(),2200)}
function addXp(n){S.xp+=n;S.log={...S.log};S.log[TODAY]=(S.log[TODAY]||0)+n;save();toast('+'+n+' XP')}

const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const TODAY=iso(new Date()),START='2026-09-01',END='2026-12-25';
const cal={d:new Date(new Date().getFullYear(),new Date().getMonth(),1),sel:TODAY};
const fmt=s=>new Date(s+'T00:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'short'});
function dayInfo(s){if(s<START||s>END)return null;const w=new Date(s+'T00:00:00').getDay();
 if(T){const ls=[];for(const gk in G){const d=schOf(gk)[w];if(d)ls.push({gk,t:d.t,n:d.n})}
  return ls.length?{k:s<TODAY?'g':'n',ls}:null}
 const d=myDays()[w];
 if(d){let k='n';const m=S.att[s];
  if(S.mk[s]||m==='a')k='g';
  else if(m==='m')k='r';
  else if(s<TODAY){let h=0;for(const ch of s)h=(h*31+ch.charCodeAt(0))%97;k=(h%4)?'g':'r'}
  return{k,l:[d.t||'—',d.n,gname(USER)]}}
 return w===5&&s>=TODAY?{k:'b'}:null}
function each(fn){for(let d=new Date(START+'T00:00:00');iso(d)<TODAY;d.setDate(d.getDate()+1)){const s=iso(d),i=dayInfo(s);if(i&&i.l)fn(s,i)}}
function stats(){let t=0,a=0;each((s,i)=>{t++;if(i.k==='g')a++});return{t,a,p:t?Math.round(a/t*100):0}}
function missed(){const r=[];each((s,i)=>{if(i.k==='r')r.push({s,n:i.l[1]})});return r}
function detail(f,s){
 if(!f)return '<small>В этот день занятий нет</small>';
 if(T)return f.ls.map(x=>`<div class="ev" style="margin-top:6px"><div><span class="time">${x.t||'—'}</span><b>${x.n}</b><small>${G[x.gk]}</small></div></div>${attList(s,x.gk)}`).join('');
 if(f.k==='b'){const m=missed();return `<div class="ev"><div><span class="time">16:00</span><b>Отработка пропусков</b><small>Спортзал №1</small></div></div>`+(m.length?m.map(x=>`<div class="ev" style="margin-top:12px"><small>${x.n}, ${fmt(x.s)}</small><button class="btn sm" data-a="mk" data-id="${x.s}">Отработать</button></div>`).join(''):'<p class="muted" style="margin-top:10px">Пропусков нет, отрабатывать нечего</p>')}
 const st={n:'Предстоит',g:S.mk[s]?'Отработано':'Посещено',r:'Пропуск'}[f.k];
 return `<div class="ev"><div><span class="time">${f.l[0]}</span><b>${f.l[1]}</b><small>${[f.l[2],st].filter(Boolean).join(' · ')}</small></div></div>`}
const attList=(s,gk)=>{if(s>TODAY)return '<p class="muted" style="margin:6px 0 12px">Отметка посещаемости будет доступна в день занятия</p>';
 const L=studentsOf(gk);
 if(!L.length)return '<p class="muted" style="margin:6px 0 12px">В этой группе пока нет студентов</p>';
 return '<div class="day" style="margin-top:8px">Отметка посещаемости</div>'+L.map(r=>{const v=((r.s||{}).att||{})[s];return `<div class="ev" style="margin-top:10px"><div><b>${nm(r)}</b></div><span class="mk"><button class="btn sm ${v==='a'?'on':'ghost'}" data-a="att" data-id="${r.k}" data-v="a">Пришёл</button><button class="btn sm ${v==='m'?'':'ghost'}" data-a="att" data-id="${r.k}" data-v="m">Нет</button></span></div>`}).join('')+'<div style="height:10px"></div>'};
function weekData(){const r=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);r.push([['Вс','Пн','Вт','Ср','Чт','Пт','Сб'][d.getDay()],(S.log||{})[iso(d)]||0])}return r}
const qcard=(q,qp,qd,btn)=>{const c=qp[q.id]||0,d=qd.includes(q.id);return `<div class="card"><div class="row"><b>${q.n}</b><small>+${q.xp} XP</small></div><i class="bar"><u style="width:${c/q.max*100}%"></u></i>
<div class="row" style="margin:10px 0 0"><small>${c} / ${q.max} ${q.u}</small>${d?`<span class="btn sm on">${ic('check')}Выполнено</span>`:btn?`<button class="btn sm" data-a="tq" data-id="${q.id}">Подтвердить +${q.step} ${q.u}</button>`:`<small class="pend">${ic('clock')}${c?'В процессе':'Ожидает подтверждения'}</small>`}</div></div>`};


/* ===== QAZ Coach — чат с ИИ =====
   Подключение ИИ — в файле ai.js (подробности там). Здесь менять ничего не нужно. */
const CK='fitqaz_chat_'+KEY;
const hist=()=>{try{return JSON.parse(localStorage.getItem(CK))||[]}catch(e){return[]}};
const saveHist=h=>{try{localStorage.setItem(CK,JSON.stringify(h.slice(-50)))}catch(e){}};
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const bub=m=>`<div class="msg ${m.r}"><div class="bub">${esc(m.t).replace(/\n/g,'<br>')}</div></div>`;
const QS=['Составь план тренировки','Как улучшить бег на 100 м?','Что съесть перед тренировкой?','Как восстановиться после нагрузки?','Сколько воды пить в день?','Упражнения для пресса дома','Как не бросить тренировки?','Как разогреться перед бегом?'];
const HELLO='Привет! Я QAZ Coach — ИИ-тренер FITQAZ. Спрашивайте про тренировки, нагрузку, восстановление и питание.';
/* История чата -> [{role:'user'|'assistant', content}] (роли чередуются, начинается с user) */
function cleanMsgs(h){const out=[];
 for(const m of h.slice(-12)){if(/^(Не удалось получить ответ|QAZ Coach пока в разработке)/.test(m.t))continue;
  const role=m.r==='u'?'user':'assistant';
  if(out.length&&out[out.length-1].role===role)out[out.length-1].content+='\n'+m.t;else out.push({role,content:m.t})}
 while(out.length&&out[0].role!=='user')out.shift();return out}
const STUB='QAZ Coach пока в разработке: скоро здесь появятся ответы ИИ-тренера. Ваше сообщение сохранено.';
/* ЕДИНСТВЕННОЕ место, где чат обращается к ИИ.
   Сам ИИ подключается в файле ai.js (функция window.FITQAZ_askAI) — в этот файл ничего добавлять не нужно. */
async function askAI(h){
 if(typeof window.FITQAZ_askAI!=='function')return STUB;
 const r=await window.FITQAZ_askAI(cleanMsgs(h),{name:nm(USER),role:USER.role||'student',group:gname(USER)});
 return r?String(r):STUB}
let chatBusy=false;
const toBottom=()=>{if(window.scrollTo)window.scrollTo(0,document.body.scrollHeight)};
async function sendChat(text){text=(text||'').trim();if(!text||chatBusy)return;chatBusy=true;
 const h=hist();h.push({r:'u',t:text});saveHist(h);
 const c=$('#chat');if(c)c.insertAdjacentHTML('beforeend',bub({r:'u',t:text})+'<div class="msg a" id="typing"><div class="bub typing">печатает…</div></div>');toBottom();
 let reply;try{reply=await askAI(h)}catch(e){reply='Не удалось получить ответ. '+(e.message==='Failed to fetch'?'Нет связи с ИИ-сервером.':e.message)}
 const t=$('#typing');if(t)t.remove();
 h.push({r:'a',t:reply});saveHist(h);
 const c2=$('#chat');if(c2)c2.insertAdjacentHTML('beforeend',bub({r:'a',t:reply}));toBottom();chatBusy=false}

/* ===== Поддержка: окно переписки ===== */
const SV={k:null,sig:''};
const fmtT=at=>{const d=new Date(at);return d.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})+(iso(d)===TODAY?'':' · '+fmt(iso(d)))};
const sbub=m=>`<div class="msg ${(AD?m.r==='a':m.r==='u')?'u':'a'}"><div class="bub">${esc(m.t).replace(/\n/g,'<br>')}<small class="ts">${fmtT(m.at)}</small></div></div>`;
const SUPHELLO='<div class="msg a"><div class="bub">Здравствуйте! Опишите вопрос или проблему — ответ появится здесь.</div></div>';
const unreadAdmin=()=>Object.values(ADX).filter(x=>x&&x.ua>0).length;
const supItems=(ix,n,click)=>{const L=Object.values(ix).filter(x=>x&&x.lastAt).sort((a,b)=>b.lastAt-a.lastAt).slice(0,n||999);
 return L.length?`<section class="card">${L.map(x=>`<${click?'button':'div'} class="sr conv" ${click?`data-a="sopen" data-id="${esc(x.k)}"`:''}><span class="av">${esc((x.name||x.k||'?')[0])}</span><div><b>${esc(x.name||x.k)}</b><small>${x.role==='teacher'?'Преподаватель':'Студент'} · ${esc(x.last||'')}</small></div><em>${x.ua>0?`<span class="cnt">${x.ua}</span>`:''}${click?ic('chev'):''}</em></${click?'button':'div'}>`).join('')}</section>`:'<div class="card"><small>Обращений пока нет</small></div>'};
async function supPoll(){try{if(AD)ADX=(await supIdx())||{};else{const ix=await supIdx(KEY);UNR=(ix&&ix.uu)||0}}catch(e){}}
async function supTick(){if(page!=='support')return;
 try{
  if(AD&&!SV.k){const ix=(await supIdx())||{};ADX=ix;const el=$('#suplist');if(el)el.innerHTML=supItems(ix,0,true);return}
  const k=AD?SV.k:KEY;if(!k)return;
  const ms=await supMsgs(k),sg=ms.length+':'+(ms.length?ms[ms.length-1].id:'');
  if(sg!==SV.sig){SV.sig=sg;const el=$('#supchat');if(el){el.innerHTML=ms.length?ms.map(sbub).join(''):(AD?'<div class="muted">Сообщений пока нет</div>':SUPHELLO);toBottom()}}
  const ix=await supIdx(k);if(ix&&(AD?ix.ua>0:ix.uu>0))await supRead(k,AD?'a':'u')
 }catch(e){}}
async function supSendForm(){const i=$('#si');if(!i)return;const t=i.value.trim();if(!t)return;i.value='';
 const k=AD?SV.k:KEY;if(!k)return;
 try{await supSend(k,AD?'a':'u',USER,t)}catch(e){toast('Не отправилось: '+(e.message||e));return}
 SV.sig='';supTick()}
setInterval(supTick,2000);

const tv={g:null,s:null};
const pts=r=>scoreOf(r.s&&r.s.xp);
const srow=(r,a)=>{const tg=a?'button':'div';return `<${tg} class="sr" ${a?`data-a="stu" data-id="${r.k}"`:''}><span class="av">${nm(r)[0]}</span><div><b>${nm(r)}</b><small>${[gname(r),a?dflt(r.s).qd.length+'/'+DB.quests.length+' заданий':''].filter(Boolean).join(' · ')}</small></div><em>${pts(r)}${ic('flame')}${a?ic('chev'):''}</em></${tg}>`};
const TR={а:'a',ә:'a',б:'b',в:'v',г:'g',ғ:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',і:'i',й:'i',к:'k',қ:'k',л:'l',м:'m',н:'n',ң:'n',о:'o',ө:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ұ:'u',ү:'u',ф:'f',х:'h',һ:'h',ц:'c',ч:'ch',ш:'sh',щ:'sh',ы:'y',э:'e',ю:'u',я:'a'};
const gnorm=x=>[...String(x).toLowerCase()].map(c=>TR[c]!==undefined?TR[c]:c).join('').replace(/[^a-z0-9]/g,'');
const gKeyOf=r=>{if(r.group==null||r.group==='')return null;const v=String(r.group),nv=gnorm(v);
 for(const k in G)if(k===v||G[k]===v)return k;
 for(const k in G)if(gnorm(G[k])===nv||gnorm(k)===nv)return k;return null};
const unmatched=()=>reals().filter(r=>r.group!=null&&r.group!==''&&!gKeyOf(r));
const studentsOf=g=>reals().filter(r=>gKeyOf(r)===g).sort((a,b)=>nm(a).localeCompare(nm(b)));
const gname=r=>{const k=gKeyOf(r);return k?G[k]:(r.group?String(r.group):'')};
const gcount=g=>studentsOf(g).length;
const plural=n=>n+' '+((n%10===1&&n%100!==11)?'студент':(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20))?'студента':'студентов');
const DW={пн:1,вт:2,ср:3,чт:4,пт:5,сб:6,вс:0,mo:1,tu:2,we:3,th:4,fr:5,sa:6,su:0};
/* Расписание из Firebase: "вт 10:00 Футбол, чт 15:30, сб" -> {2:{t,n},4:{t,n},6:{t,n}} */
function parseDays(str){const out={};String(str).split(/[,\n]/).forEach(tok=>{tok=tok.trim();if(!tok)return;const m=tok.match(/^(\S+)\s*(.*)$/);if(!m)return;
 const w=DW[m[1].toLowerCase().slice(0,2)];if(w===undefined)return;let rest=m[2],t='';const tm=rest.match(/(\d{1,2}):(\d{2})/);
 if(tm){t=tm[1].padStart(2,'0')+':'+tm[2];rest=rest.replace(tm[0],'')}out[w]={t,n:rest.trim()||'Физкультура'}});return out}
const schOf=gk=>{if(!gk)return{};const nk=gnorm(G[gk]),kk=gnorm(gk);for(const k in SCH){const n=gnorm(k);if(n===nk||n===kk)return parseDays(SCH[k])}return{}};
const myDays=()=>schOf(gKeyOf(USER));
const schNote=()=>T?(Object.keys(SCH).length?'':'<p class="muted" style="margin-bottom:12px">Расписание групп не задано в базе данных</p>'):(Object.keys(myDays()).length?'':'<p class="muted" style="margin-bottom:12px">Расписание вашей группы пока не задано</p>');
const tile=(h,i,b,s,n)=>`<a class="tile t-${i}" href="${h}"><span class="orb">${ic(i)}</span><span class="arr">${ic('chev')}</span>${n?`<span class="cnt abs">${n}</span>`:''}<b>${b}</b><small>${s}</small></a>`;
const calTile=tile('calendar.html','calendar','Спортивный календарь','Твои тренировки, события и дедлайны');

const P={
home(){const L=lvl();return `
<header class="top"><div><div class="logo">FIT<b>Q</b>AZ</div><p class="muted">Двигайся. Развивайся. Достигай.</p></div>
<a class="lvl" href="progress.html"><span>Уровень ${L.l}</span><i class="bar"><u style="width:${L.x/5}%"></u></i><small>${L.x} / 500</small></a></header>
<div class="grid">${calTile}
${tile('progress.html','chart','Успеваемость','Следи за своим прогрессом')}
${tile('profile.html','user','Профиль','Твои данные, цели и достижения')}
${tile('quests.html','trophy','Еженедельные квесты','Выполняй задания и получай награды')}
${tile('coach.html','bot','QAZ Coach','ИИ-тренер: тренировки и питание')}
${tile('support.html','chat','Поддержка',UNR>0?'Есть новый ответ':'Напишите нам, мы поможем',UNR)}</div>
<section class="card"><div class="row"><h2>Топ студентов</h2><a class="more" href="rating.html">Весь рейтинг${ic('chev')}</a></div>${rows(5)}</section>`},

Thome(){return `
<header class="top"><div><div class="logo">FIT<b>Q</b>AZ</div><p class="muted">Кабинет преподавателя</p></div>
<a class="lvl" href="profile.html"><span>${nm(USER)}</span><small>Преподаватель</small></a></header>
<div class="grid">${calTile}
${tile('students.html','cap','Студенты','Группы и их прогресс')}
${tile('students.html','task','Задания','Подтверждение выполнения')}
${tile('profile.html','user','Профиль','Данные и смена пароля')}
${tile('coach.html','bot','QAZ Coach','ИИ-тренер: тренировки и питание')}
${tile('support.html','chat','Поддержка',UNR>0?'Есть новый ответ':'Напишите нам, мы поможем',UNR)}</div>
<section class="card"><div class="row"><h2>Топ студентов</h2><a class="more" href="rating.html">Весь рейтинг${ic('chev')}</a></div>${rows(5)}</section>`},

students(){
 if(tv.s&&U[tv.s]){const r=U[tv.s],s=dflt(r.s),L=lvl(s.xp);
  return headB(nm(r),'tback')+`<div class="card pf"><span class="av">${nm(r)[0]}</span><h2>${nm(r)}</h2><small>${gname(r)||'без группы'}</small><b class="big-pts">${pts(r)}${ic('flame')}</b><small>Уровень ${L.l} · ${L.x} / 500 XP</small></div>
<p class="muted" style="margin:4px 0 10px">Задания студента — подтверждайте выполнение:</p>`+DB.quests.map(q=>qcard(q,s.qp,s.qd,1)).join('')+`<button class="btn ghost" style="width:100%;margin-top:6px" data-a="tres">Сбросить прогресс студента</button>`}
 if(tv.g==='__none'){const L=unmatched();return headB('Группа не найдена','tback')+(L.length?`<p class="muted" style="margin:-6px 0 12px">Название группы у этих студентов не совпадает ни с одной группой из списка. Исправьте поле group в Firebase.</p><section class="card">${L.map(r=>srow(r,1)).join('')}</section>`:'<div class="card"><small>Таких студентов нет</small></div>')}
 if(tv.g&&G[tv.g]){const g=tv.g,L=studentsOf(g);
  return headB(G[g],'tback')+(L.length?`<section class="card">${L.map(r=>srow(r,1)).join('')}</section>`:'<div class="card"><small>В этой группе пока нет студентов</small></div>')}
 return head('Студенты')+`<p class="muted" style="margin:-6px 0 12px">Выберите группу</p>`+(Object.keys(G).length?'':'<div class="card"><small>Групп пока нет</small></div>')+Object.keys(G).map(g=>`<button class="card gcard" data-a="grp" data-id="${g}"><div><b>${G[g]}</b><small>${plural(gcount(g))}</small></div><span>${ic('chev')}</span></button>`).join('')+(unmatched().length?`<button class="card gcard" data-a="grp" data-id="__none"><div><b>${ic('warn')}Группа не найдена</b><small>${plural(unmatched().length)}</small></div><span>${ic('chev')}</span></button>`:'')},

calendar(){const y=cal.d.getFullYear(),m=cal.d.getMonth(),off=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate();
let c='<span></span>'.repeat(off);
for(let i=1;i<=n;i++){const s=iso(new Date(y,m,i)),f=dayInfo(s);c+=`<button class="cd ${s===TODAY?'today':''} ${s===cal.sel?'sel':''}" data-a="day" data-id="${s}">${i}${f?`<u class="dot ${f.k}"></u>`:''}</button>`}
const dt=new Date(cal.sel+'T00:00:00').toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'});
return head('Календарь')+`<div class="card"><div class="row"><button class="back" data-a="cm" data-id="-1">${ic('back')}</button><h2 class="cap">${cal.d.toLocaleDateString('ru-RU',{month:'long',year:'numeric'})}</h2><button class="back" data-a="cm" data-id="1">${ic('chev')}</button></div>
<div class="cg wk">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<small>${x}</small>`).join('')}</div><div class="cg">${c}</div>
<div class="leg"><span><u class="dot n"></u>Предстоит</span>${T?'<span><u class="dot g"></u>Проведено</span>':'<span><u class="dot g"></u>Посещено</span><span><u class="dot r"></u>Пропуск</span><span><u class="dot b"></u>Отработка</span>'}</div></div>
${schNote()}<div class="card"><div class="day" style="margin-top:0">${dt}</div>${detail(dayInfo(cal.sel),cal.sel)}</div>`},

progress(){const L=lvl();
return head('Успеваемость')+`
<div class="stats"><div class="card"><b>${score()}</b><small>всего баллов</small></div><div class="card"><b>${L.l}</b><small>уровень</small></div>
<div class="card"><b>${stats().p}%</b><small>посещаемость</small></div><div class="card"><b>${S.qd.length}/${DB.quests.length}</b><small>квестов выполнено</small></div></div>
<div class="card"><div class="row"><h2>До уровня ${L.l+1}</h2><small>${L.x} / 500</small></div><i class="bar"><u style="width:${L.x/5}%"></u></i></div>
<div class="card"><h2>Активность за неделю (XP)</h2><div class="chart">${(()=>{const w=weekData(),mx=Math.max(1,...w.map(x=>x[1]));return w.map(x=>`<div>${x[1]}<u style="height:${x[1]/mx*100}%"></u>${x[0]}</div>`).join('')})()}</div></div>
<div class="card"><h2>Нормативы</h2><small>Результаты появятся после сдачи нормативов</small>${DB.norms.map(n=>`<div class="nm"><div class="row"><span>${n[0]}</span><small>${n[1]}%</small></div><i class="bar"><u style="width:${n[1]}%"></u></i></div>`).join('')}</div>`},

profile(){const G=['Пробежать 5 км без остановки','Сдать все нормативы','Войти в топ-3 рейтинга','Тренироваться 3 раза в неделю'];
const B=[['spark','Первый шаг',S.xp>0],['bolt','Бегун',S.xp>=400],['trophy','Квестер',S.qd.length>0],['star','Уровень 2',S.xp>=500],['calcheck','Активист',Object.keys(S.att).length+Object.keys(S.mk).length>=3],['crown','Лидер',S.xp>=1000]];
return head('Профиль')+`
<div class="card pf"><span class="av">${nm(USER)[0]}</span><h2>${nm(USER)}</h2><small>${gname(USER)?gname(USER)+' · ':''}${score()} баллов</small></div>
<div class="card"><h2>Мои цели</h2>${G.map((g,i)=>`<div class="goal ${S.goals.includes(i)?'on':''}" data-a="goal" data-id="${i}"><span>${S.goals.includes(i)?ic('check'):''}</span>${g}</div>`).join('')}</div>
<div class="card"><h2 style="margin-bottom:10px">Достижения</h2><div class="badges">${B.map(b=>`<div class="bd ${b[2]?'':'off'}"><i>${ic(b[0])}</i>${b[1]}</div>`).join('')}</div></div>
<div class="stack"><a class="btn" href="settings.html">${ic('gear')}Настройки</a></div>`},

Tprofile(){return head('Профиль')+`
<div class="card pf"><span class="av">${nm(USER)[0]}</span><h2>${nm(USER)}</h2><small>Преподаватель</small></div>
<div class="card"><small>Групп: ${Object.keys(G).length} · Студентов в группах: ${Object.keys(G).reduce((a,g)=>a+studentsOf(g).length,0)}</small></div>
<div class="stack"><a class="btn" href="settings.html">${ic('gear')}Настройки</a></div>`},

Ahome(){const n=unreadAdmin();return `
<header class="top"><div><div class="logo">FIT<b>Q</b>AZ</div><p class="muted">Панель администратора</p></div>
<a class="lvl" href="settings.html"><span>${nm(USER)}</span><small>Администратор</small></a></header>
<div class="grid">${tile('support.html','chat','Поддержка',n?'Новых обращений: '+n:'Чаты пользователей',n)}
${tile('settings.html','gear','Настройки','Пароль и оформление')}</div>
<section class="card"><div class="row"><h2>Последние обращения</h2><a class="more" href="support.html">Все${ic('chev')}</a></div></section>${supItems(ADX,5,false)}`},

support(){return head('Поддержка')+`<div id="supchat" class="chat sup"><div class="muted">Загрузка…</div></div>
<form id="sf" class="cbar"><input id="si" placeholder="Напишите сообщение…" autocomplete="off" maxlength="500"><button class="btn send">${ic('send')}</button></form>`},

Asupport(){if(SV.k){const x=ADX[SV.k];return headB(x&&x.name?x.name:SV.k,'aback')+`<div id="supchat" class="chat sup"><div class="muted">Загрузка…</div></div>
<form id="sf" class="cbar"><input id="si" placeholder="Ответить…" autocomplete="off" maxlength="500"><button class="btn send">${ic('send')}</button></form>`}
 return head('Поддержка')+`<p class="muted" style="margin:-6px 0 12px">Обращения пользователей — нажмите, чтобы открыть чат и ответить</p><div id="suplist">${supItems(ADX,0,true)}</div>`},

settings(){const g=(k,d)=>{try{return localStorage.getItem('fitqaz_'+k)||d}catch(e){return d}},th=g('theme','dark'),sz=g('size','normal'),an=g('anim','on');
 const seg=(k,v,l,cur)=>`<button class="seg ${cur===v?'on':''}" data-a="set" data-k="${k}" data-v="${v}">${l}</button>`;
 return head('Настройки')+`
<div class="card"><h2>Тема</h2><div class="segs">${seg('theme','dark',ic('moon')+'Ночная',th)}${seg('theme','light',ic('sun')+'Дневная',th)}${seg('theme','auto',ic('monitor')+'Как на устройстве',th)}</div></div>
<div class="card"><h2>Размер текста</h2><div class="segs">${seg('size','normal','Обычный',sz)}${seg('size','big','Крупный',sz)}</div></div>
<div class="card"><h2>Анимации</h2><div class="segs">${seg('anim','on','Включены',an)}${seg('anim','off','Выключены',an)}</div></div>
<div class="card"><h2>Аккаунт</h2><small>${nm(USER)}${AD?' · администратор':T?' · преподаватель':''}</small></div>
<div class="stack"><button class="btn" data-a="pwd">${ic('key')}Сменить пароль</button>${AD?'':`<a class="btn ghost" href="support.html">${ic('chat')}Поддержка</a>`}${(T||AD)?'':`<button class="btn ghost" data-a="reset">${ic('reset')}Сбросить прогресс</button>`}<button class="btn ghost" data-a="logout">${ic('logout')}Выйти из аккаунта</button></div>`},

coach(){const h=hist();return head('QAZ Coach')+`<div id="chat" class="chat">${(h.length?h:[{r:'a',t:HELLO}]).map(bub).join('')}</div>
<div class="chips"><div class="track">${[...QS,...QS].map(t=>`<button class="chip" data-a="chip" data-t="${t}">${t}</button>`).join('')}</div></div>
<form id="cf" class="cbar"><input id="ci" placeholder="Напишите вопрос…" autocomplete="off"><button class="btn send">${ic('send')}</button></form>`},

quests(){return head('Квесты')+`<p class="muted" style="margin:-6px 0 12px">Задания подтверждает преподаватель — баллы начислятся сразу после подтверждения.</p>`+DB.quests.map(q=>qcard(q,S.qp,S.qd,0)).join('')},
rating(){return head('Рейтинг')+`<section class="card">${rows(20)}</section>`}
};

const NAV=[['index','Главная','home','home'],['calendar','Календарь','calendar','calendar'],['progress','Успеваемость','chart','progress'],['profile','Профиль','user','profile'],['coach','QAZ Coach','bot','coach']];
const NAVA=[['index','Главная','home','home'],['support','Поддержка','chat','support'],['settings','Настройки','gear','settings']];
const NAVT=[['index','Главная','home','home'],['calendar','Календарь','calendar','calendar'],['students','Студенты','cap','students'],['profile','Профиль','user','profile'],['coach','QAZ Coach','bot','coach']];
/* Красная «капсула» в нижнем меню плавно скользит от прежнего раздела к новому */
function slideNav(){const nav=$('nav');if(!nav||!nav.querySelectorAll)return;
 const links=[...nav.querySelectorAll('a')],pill=nav.querySelector('.pill');if(!pill)return;
 const cur=links.findIndex(a=>a.classList.contains('on'));let prev=-1;
 try{const v=sessionStorage.getItem('fitqaz_nav');if(v!==null)prev=+v}catch(e){}
 const pos=i=>{const a=links[i];pill.style.width=a.offsetWidth+'px';pill.style.transform='translateX('+a.offsetLeft+'px)'};
 if(cur<0)pill.style.opacity='0';
 else if(prev>=0&&prev!==cur&&links[prev]){
  pill.style.transition='none';pos(prev);pill.style.opacity='1';links[cur].classList.remove('on');links[prev].classList.add('on');
  if(pill.getBoundingClientRect)pill.getBoundingClientRect();
  requestAnimationFrame(()=>requestAnimationFrame(()=>{pill.style.transition='';pos(cur);links[prev].classList.remove('on');links[cur].classList.add('on')}))}
 else{pill.style.transition='none';pos(cur);pill.style.opacity='1';if(pill.getBoundingClientRect)pill.getBoundingClientRect();pill.style.transition=''}
 try{sessionStorage.setItem('fitqaz_nav',String(cur))}catch(e){}}
if(window.addEventListener)window.addEventListener('resize',()=>{const nav=$('nav');if(!nav)return;const a=nav.querySelector('a.on'),p=nav.querySelector('.pill');if(a&&p){p.style.transition='none';p.style.width=a.offsetWidth+'px';p.style.transform='translateX('+a.offsetLeft+'px)'}});
let lastSig='';const sig=()=>JSON.stringify([U,G,UNR,ADX]);
function render(){const fn=(AD&&P['A'+page])||(T&&P['T'+page])||P[page];
 if(!fn){location.replace('index.html');return}
 $('#app').innerHTML=fn()+`<nav><span class="pill"></span>${(AD?NAVA:T?NAVT:NAV).map(n=>`<a href="${n[0]}.html" class="${n[3]===page?'on':''}">${ic(n[2])}<span>${n[1]}</span></a>`).join('')}</nav>`;
 rankFx();lastSig=sig();slideNav();if(page==='coach')toBottom();if(page==='support')supTick()}

async function sync(){await refresh();await supPoll();const m=U[KEY];if(!m||document.querySelector('.modal')||sig()===lastSig)return;
 const old=S.xp;USER=m;S=dflt(m.s);
 if(!T&&S.xp>old)toast('+'+(S.xp-old)+' XP — подтвердил преподаватель');
 if(page==='coach'||page==='support'){lastSig=sig();return}
 render()}
setInterval(sync,2000);

function timer(){const m=document.createElement('div');m.className='modal';
 m.innerHTML=`<div class="sheet"><h2>Тренировка</h2><div class="time" id="tm">00:00</div><button class="btn" id="tg">Старт</button><button class="btn ghost" id="fin">Завершить и получить XP</button><button class="btn ghost" id="cl">Закрыть</button></div>`;
 document.body.append(m);let t=0,iv=null;const f=()=>$('#tm',m).textContent=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
 $('#tg',m).onclick=e=>{if(iv){clearInterval(iv);iv=null;e.target.textContent='Продолжить'}else{iv=setInterval(()=>{t++;f()},1000);e.target.textContent='Пауза'}};
 const close=()=>{clearInterval(iv);m.remove()};
 $('#cl',m).onclick=close;
 $('#fin',m).onclick=()=>{close();if(t<5)return toast('Слишком короткая тренировка');addXp(Math.max(10,Math.floor(t/60)*10));render()}}

function pwdModal(){const m=document.createElement('div');m.className='modal';
 m.innerHTML=`<form class="sheet" style="text-align:left"><h2>Смена пароля</h2><input id="p0" type="password" placeholder="Текущий пароль" autocomplete="current-password" required><input id="p1" type="password" placeholder="Новый пароль (от 6 символов)" autocomplete="new-password" required><input id="p2" type="password" placeholder="Повторите новый пароль" autocomplete="new-password" required><div class="err" id="er"></div><button class="btn">Сохранить</button><button type="button" class="btn ghost" id="cl">Отмена</button></form>`;
 document.body.append(m);const v=i=>$('#'+i,m).value,er=t=>$('#er',m).textContent=t;
 $('#cl',m).onclick=()=>m.remove();
 $('form',m).onsubmit=async e=>{e.preventDefault();const r=U[KEY];
  if(await hash(v('p0'),r.salt)!==r.hash)return er('Текущий пароль неверный');
  if(v('p1').length<6)return er('Новый пароль: минимум 6 символов');
  if(v('p1')!==v('p2'))return er('Пароли не совпадают');
  if(v('p1')===v('p0'))return er('Новый пароль совпадает со старым');
  r.salt=newSalt();r.hash=await hash(v('p1'),r.salt);putUser(KEY);m.remove();toast('Пароль изменён')}}

document.addEventListener('submit',e=>{if(!e.target)return;if(e.target.id==='sf'){e.preventDefault();supSendForm();return}
 if(e.target.id!=='cf')return;e.preventDefault();const i=$('#ci');if(!i)return;const t=i.value;i.value='';sendChat(t)});
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,id=+b.dataset.id;
 if(a==='timer')return timer();
 if(a==='chip'){sendChat(b.dataset.t);return}
 if(a==='sopen'){SV.k=b.dataset.id;SV.sig=''}
 if(a==='aback'){SV.k=null;SV.sig=''}
 if(a==='pwd')return pwdModal();
 if(a==='set')setPref(b.dataset.k,b.dataset.v);
 if(a==='cm')cal.d=new Date(cal.d.getFullYear(),cal.d.getMonth()+id,1);
 if(a==='day')cal.sel=b.dataset.id;
 if(a==='att'){const r=U[b.dataset.id];if(!r)return;const s=r.s=dflt(r.s),d=cal.sel,v=b.dataset.v,p=s.att[d];if(p===v)return;
  s.att[d]=v;if(v==='a'&&p!=='a'){s.xp+=10;s.log={...s.log};s.log[TODAY]=(s.log[TODAY]||0)+10;toast(`${nm(r)}: пришёл, +10 XP`)}else if(v!=='a'&&p==='a')s.xp=Math.max(0,s.xp-10);
  putS(b.dataset.id)}
 if(a==='mk'){S.mk[b.dataset.id]=cal.sel;addXp(20)}
 if(a==='goal'){S.goals=S.goals.includes(id)?S.goals.filter(x=>x!==id):[...S.goals,id];save()}
 if(a==='grp')tv.g=b.dataset.id;
 if(a==='stu')tv.s=b.dataset.id;
 if(a==='tback'){if(tv.s)tv.s=null;else tv.g=null}
 if(a==='tq'){const r=U[tv.s];if(!r)return;const s=r.s=dflt(r.s),q=DB.quests.find(x=>x.id===id);
  s.qp[id]=Math.min(q.max,(s.qp[id]||0)+q.step);
  if(s.qp[id]>=q.max&&!s.qd.includes(id)){s.qd.push(id);s.xp+=q.xp;s.log={...s.log};s.log[TODAY]=(s.log[TODAY]||0)+q.xp;toast(`${nm(r)}: +${q.xp} XP начислено`)}
  putS(tv.s)}
 if(a==='tres'&&confirm('Сбросить прогресс студента?')){U[tv.s].s={xp:0};putS(tv.s)}
 if(a==='reset'&&confirm('Сбросить весь прогресс?')){U[KEY].s={xp:0};putS(KEY);location.reload();return}
 if(a==='logout'){localStorage.removeItem(SK);location.replace('auth.html');return}
 render()});
render();
supPoll().then(()=>{if(sig()!==lastSig&&page!=='support')render()});
});
