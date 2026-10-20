READY.then(()=>{
const $=(s,r=document)=>r.querySelector(s);
const KEY=curKey();let USER=U[KEY];
if(!USER){location.replace('auth.html');return}
if(USER.v!==2){U[KEY]=USER={...USER,s:{xp:0},v:2,created:localISO()};putUser(KEY)}
const T=USER.role==='teacher',nm=r=>r.fio||r.name,page=document.body.dataset.page;
if(T?['progress','quests','rating'].includes(page):page==='students'){location.replace('index.html');return}
const DB={
 quests:[
  {id:1,n:'Пробежать 15 км за неделю',xp:800,max:15,u:'км',step:5},
  {id:2,n:'Посетить 3 занятия',xp:600,max:3,u:'зан.',step:1},
  {id:3,n:'100 приседаний',xp:400,max:100,u:'',step:25},
  {id:4,n:'Пройти 50 000 шагов',xp:700,max:50,u:'тыс.',step:10}],
 students:[['Асылхан Б.','СИБ-24-3',2480],['Нурлан К.','СИБ-25-6',2020],['Айгерим С.','АРХ-24-2',1480],['Данияр М.','МАШ-25-4',1250],['Аружан Т.','СБ-24-2',750],['Тимур А.','СИБ-25-4',540],['Мадина Е.','DS-25-7',400]],
 groups:{
  1:[['Бекзат Ж.','СИБ-25-7',1380],['Сабина К.','СИБ-25-7',1210],['Мирас Д.','СИБ-25-7',980]],
  2:[['Нурлан К.','СИБ-25-6',2360],['Данияр М.','СИБ-25-6',2210],['Алина С.','СИБ-25-6',1760]],
  3:[['Айгерим С.','СБ-24-2',2290],['Тимур А.','СБ-24-2',2050],['Диас Р.','СБ-24-2',1600]],
  4:[['Аружан Т.','DS-25-7',2180],['Мадина Е.','DS-25-7',1990],['Ерлан Б.','DS-25-7',1450]],
  5:[['Камила Ж.','СИБ-25-4',1900],['Рустем Н.','СИБ-25-4',1720],['Дана О.','СИБ-25-4',1540]]},
 norms:[['Бег 100 м',0],['Подтягивания',0],['Пресс (1 мин)',0],['Прыжок в длину',0]]
};
const dflt=s=>{const o={xp:0,goals:[],qd:[],...(s||{})};o.qp={...o.qp};o.att={...o.att};o.mk={...o.mk};o.qd=[...o.qd];o.goals=[...o.goals];return o};
let S=dflt(USER.s);
const save=()=>{USER.s=S;U[KEY]=USER;putUser(KEY)};
const lvl=(x=S.xp)=>({l:1+Math.floor(x/500),x:x%500});
const scoreOf=x=>(x||0),score=()=>scoreOf(S.xp);
const reals=()=>Object.values(U).filter(r=>r.role==='student');
const board=()=>[...DB.students.map(s=>({n:s[0],u:s[1],p:s[2]})),...reals().filter(r=>r.k!==KEY).map(r=>({n:nm(r),u:r.uni,p:scoreOf(r.s&&r.s.xp)})),...(T?[]:[{n:nm(USER)+' (вы)',u:USER.uni,p:score(),me:1}])].sort((a,b)=>b.p-a.p);
const row=(s,i)=>`<div class="st ${s.me?'me':''}"><span class="rk r${i+1}">${i+1}</span><span class="av">${s.n[0]}</span><div><b>${s.n}</b><small>${s.u}</small></div><em>${s.p} 🔥</em></div>`;
const rows=n=>{const b=board(),m=b.findIndex(s=>s.me);let h=b.slice(0,n).map(row).join('');if(m>=n)h+='<div class="sep">• • •</div>'+row(b[m],m);return h};
function rankFx(){const m=$('.st.me');if(!m)return;const r=board().findIndex(s=>s.me)+1,p=S.rank;if(p===r)return;S.rank=r;save();
 if(p&&r<p){m.animate([{transform:`translateY(${(p-r)*Math.min(m.offsetHeight,64)}px)`,opacity:.3},{transform:'none',opacity:1}],{duration:800,easing:'ease-out'});setTimeout(()=>toast(`Вы поднялись на ${r} место! 🚀`),1900)}}
const head=t=>`<div class="page-h"><a class="back" href="index.html">‹</a><h1>${t}</h1></div>`;
const headB=(t,a)=>`<div class="page-h"><button class="back" data-a="${a}">‹</button><h1>${t}</h1></div>`;
function toast(m){const t=document.createElement('div');t.id='toast';t.textContent=m;document.body.append(t);setTimeout(()=>t.remove(),2200)}
function addXp(n){S.xp+=n;S.log={...S.log};S.log[TODAY]=(S.log[TODAY]||0)+n;save();toast('+'+n+' XP 🔥')}

const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const TODAY=iso(new Date()),START='2026-09-01',END='2026-12-25';
const LES={2:['10:00','Футбол','Спортзал №1'],4:['15:30','Плавание','Бассейн'],6:['11:00','Лёгкая атлетика','Стадион']};
const cal={d:new Date(new Date().getFullYear(),new Date().getMonth(),1),sel:TODAY};
const fmt=s=>new Date(s+'T00:00:00').toLocaleDateString('ru-RU',{day:'numeric',month:'short'});
function dayInfo(s){if(s<START||s>END)return null;const w=new Date(s+'T00:00:00').getDay(),l=LES[w];
 if(l){let k='n';if(T)k=s<TODAY?'g':'n';else if(s<TODAY){let h=0;for(const ch of s)h=(h*31+ch.charCodeAt(0))%97;k=(S.mk[s]||h%4)?'g':'r'}else if(s===TODAY&&S.att[s])k='g';return{k,l}}
 return !T&&w===5&&s>=TODAY?{k:'b'}:null}
function each(fn){for(let d=new Date(START+'T00:00:00');iso(d)<TODAY;d.setDate(d.getDate()+1)){const s=iso(d),i=dayInfo(s);if(i&&i.l)fn(s,i)}}
function stats(){let t=0,a=0;each((s,i)=>{t++;if(i.k==='g')a++});return{t,a,p:t?Math.round(a/t*100):0}}
function missed(){const r=[];each((s,i)=>{if(i.k==='r')r.push({s,n:i.l[1]})});return r}
function detail(f,s){
 if(!f)return '<small>В этот день занятий нет</small>';
 if(f.k==='b'){const m=missed();return `<div class="ev"><div><span class="time">16:00</span><b>Отработка пропусков</b><small>Спортзал №1</small></div></div>`+(m.length?m.map(x=>`<div class="ev" style="margin-top:12px"><small>${x.n}, ${fmt(x.s)}</small><button class="btn sm" data-a="mk" data-id="${x.s}">Отработать</button></div>`).join(''):'<p class="muted" style="margin-top:10px">Пропусков нет, отрабатывать нечего 👍</p>')}
 const st={n:'Предстоит',g:T?'Проведено':S.mk[s]?'Отработано':'Посещено',r:'Пропуск'}[f.k];
 return `<div class="ev"><div><span class="time">${f.l[0]}</span><b>${f.l[1]}</b><small>${f.l[2]} · ${st}</small></div>${!T&&s===TODAY&&f.k==='n'?`<button class="btn sm" data-a="here" data-id="${s}">Я пришёл</button>`:''}</div>`}
function weekData(){const r=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);r.push([['Вс','Пн','Вт','Ср','Чт','Пт','Сб'][d.getDay()],(S.log||{})[iso(d)]||0])}return r}
const qcard=(q,qp,qd,btn)=>{const c=qp[q.id]||0,d=qd.includes(q.id);return `<div class="card"><div class="row"><b>${q.n}</b><small>+${q.xp} XP</small></div><i class="bar"><u style="width:${c/q.max*100}%"></u></i>
<div class="row" style="margin:10px 0 0"><small>${c} / ${q.max} ${q.u}</small>${d?'<span class="btn sm on">Выполнено ✓</span>':btn?`<button class="btn sm" data-a="tq" data-id="${q.id}">Подтвердить +${q.step} ${q.u}</button>`:`<small>⏳ ${c?'В процессе':'Ожидает подтверждения'}</small>`}</div></div>`};

const tv={g:null,s:null};
const pts=r=>scoreOf(r.s&&r.s.xp);
const dem=a=>({fio:a[0],uni:a[1],s:{xp:a[2]/10}});
const srow=(r,a)=>{const tg=a?'button':'div';return `<${tg} class="sr" ${a?`data-a="stu" data-id="${r.k}"`:''}><span class="av">${nm(r)[0]}</span><div><b>${nm(r)}</b><small>${r.uni||''}${a?' · '+dflt(r.s).qd.length+'/'+DB.quests.length+' заданий':''}</small></div><em>${pts(r)} 🔥${a?' ›':''}</em></${tg}>`};
const gcount=g=>(g===1?reals().length:0)+DB.groups[g].length;
const tile=(h,i,b,s)=>`<a class="tile" href="${h}"><i>${i}</i><b>${b}</b><small>${s}</small></a>`;
const calTile=tile('calendar.html','📅','Спортивный календарь','Твои тренировки, события и дедлайны');

const P={
home(){const L=lvl();return `
<header class="top"><div><div class="logo">FIT<b>Q</b>AZ</div><p class="muted">Двигайся. Развивайся. Достигай.</p></div>
<a class="lvl" href="progress.html"><span>Уровень ${L.l}</span><i class="bar"><u style="width:${L.x/5}%"></u></i><small>${L.x} / 500</small></a></header>
<section class="hero"><h1>Лучше, чем<br>вчера</h1><p>Твоя цель ближе,<br>чем ты думаешь</p><button class="btn" data-a="timer">Начать тренировку</button></section>
<div class="grid">${calTile}
${tile('progress.html','📊','Успеваемость','Следи за своим прогрессом')}
${tile('profile.html','👤','Профиль','Твои данные, цели и достижения')}
${tile('quests.html','🏆','Еженедельные квесты','Выполняй задания и получай награды')}</div>
<section class="card"><div class="row"><h2>🏆 Топ студентов</h2><a href="rating.html">Весь рейтинг ›</a></div>${rows(5)}</section>`},

Thome(){return `
<header class="top"><div><div class="logo">FIT<b>Q</b>AZ</div><p class="muted">Кабинет преподавателя</p></div>
<a class="lvl" href="profile.html"><span>${nm(USER)}</span><small>Преподаватель · ${USER.uni}</small></a></header>
<section class="hero"><h1>Группы и студенты</h1><p>Подтверждай задания студентов<br>и начисляй им баллы</p><a class="btn" href="students.html">Открыть кабинет</a></section>
<div class="grid">${calTile}
${tile('students.html','🎓','Студенты','Группы 1–5 и их прогресс')}
${tile('students.html','✅','Задания','Подтверждение выполнения')}
${tile('profile.html','👤','Профиль','Данные и смена пароля')}</div>
<section class="card"><div class="row"><h2>СИБ-25-7</h2><a href="students.html">Открыть ›</a></div>${reals().map(r=>srow(r,0)).join('')||'<small>Студентов пока нет</small>'}</section>`},

students(){
 if(tv.s&&U[tv.s]){const r=U[tv.s],s=dflt(r.s),L=lvl(s.xp);
  return headB(nm(r),'tback')+`<div class="card pf"><span class="av">${nm(r)[0]}</span><h2>${nm(r)}</h2><small>${r.uni} · Группа 1</small><b style="font-size:28px">${pts(r)} 🔥</b><small>Уровень ${L.l} · ${L.x} / 500 XP</small></div>
<p class="muted" style="margin:4px 0 10px">Задания студента — подтверждайте выполнение:</p>`+DB.quests.map(q=>qcard(q,s.qp,s.qd,1)).join('')+`<button class="btn ghost" style="width:100%;margin-top:6px" data-a="tres">Сбросить прогресс студента</button>`}
 if(tv.g)return headB('Группа '+tv.g,'tback')+`<section class="card">${tv.g===1?reals().map(r=>srow(r,1)).join(''):''}${DB.groups[tv.g].map(a=>srow(dem(a),0)).join('')}</section>${tv.g===1?'':'<p class="muted">В этой группе нет подключённых аккаунтов студентов.</p>'}`;
 return head('Студенты')+`<p class="muted" style="margin:-6px 0 12px">Выберите группу</p>`+[1,2,3,4,5].map(g=>`<button class="card gcard" data-a="grp" data-id="${g}"><div><b>Группа ${g}</b><small>${gcount(g)} студентов${g===1?' · доступ к заданиям':''}</small></div><span>›</span></button>`).join('')},

calendar(){const y=cal.d.getFullYear(),m=cal.d.getMonth(),off=(new Date(y,m,1).getDay()+6)%7,n=new Date(y,m+1,0).getDate();
let c='<span></span>'.repeat(off);
for(let i=1;i<=n;i++){const s=iso(new Date(y,m,i)),f=dayInfo(s);c+=`<button class="cd ${s===TODAY?'today':''} ${s===cal.sel?'sel':''}" data-a="day" data-id="${s}">${i}${f?`<u class="dot ${f.k}"></u>`:''}</button>`}
const dt=new Date(cal.sel+'T00:00:00').toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'});
return head('Календарь')+`<div class="card"><div class="row"><button class="back" data-a="cm" data-id="-1">‹</button><h2 class="cap">${cal.d.toLocaleDateString('ru-RU',{month:'long',year:'numeric'})}</h2><button class="back" data-a="cm" data-id="1">›</button></div>
<div class="cg wk">${['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(x=>`<small>${x}</small>`).join('')}</div><div class="cg">${c}</div>
<div class="leg"><span><u class="dot n"></u>Предстоит</span>${T?'<span><u class="dot g"></u>Проведено</span>':'<span><u class="dot g"></u>Посещено</span><span><u class="dot r"></u>Пропуск</span><span><u class="dot b"></u>Отработка</span>'}</div></div>
<div class="card"><div class="day" style="margin-top:0">${dt}</div>${detail(dayInfo(cal.sel),cal.sel)}</div>`},

progress(){const L=lvl();
return head('Успеваемость')+`
<div class="stats"><div class="card"><b>${score()}</b><small>всего баллов</small></div><div class="card"><b>${L.l}</b><small>уровень</small></div>
<div class="card"><b>${stats().p}%</b><small>посещаемость</small></div><div class="card"><b>${S.qd.length}/${DB.quests.length}</b><small>квестов выполнено</small></div></div>
<div class="card"><div class="row"><h2>До уровня ${L.l+1}</h2><small>${L.x} / 500</small></div><i class="bar"><u style="width:${L.x/5}%"></u></i></div>
<div class="card"><h2>Активность за неделю (XP)</h2><div class="chart">${(()=>{const w=weekData(),mx=Math.max(1,...w.map(x=>x[1]));return w.map(x=>`<div>${x[1]}<u style="height:${x[1]/mx*100}%"></u>${x[0]}</div>`).join('')})()}</div></div>
<div class="card"><h2>Нормативы</h2><small>Результаты появятся после сдачи нормативов</small>${DB.norms.map(n=>`<div class="nm"><div class="row"><span>${n[0]}</span><small>${n[1]}%</small></div><i class="bar"><u style="width:${n[1]}%"></u></i></div>`).join('')}</div>`},

profile(){const G=['Пробежать 5 км без остановки','Сдать все нормативы','Войти в топ-3 рейтинга','Тренироваться 3 раза в неделю'];
const B=[['🔥','Первый шаг',S.xp>0],['🏃','Бегун',S.xp>=400],['🏆','Квестер',S.qd.length>0],['⭐','Уровень 2',S.xp>=500],['📅','Активист',Object.keys(S.att).length+Object.keys(S.mk).length>=3],['👑','Лидер',S.xp>=1000]];
return head('Профиль')+`
<div class="card pf"><span class="av">${nm(USER)[0]}</span><h2>${nm(USER)}</h2><small>${USER.uni} · Группа 1 · ${score()} баллов</small></div>
<div class="card"><h2>Мои цели</h2>${G.map((g,i)=>`<div class="goal ${S.goals.includes(i)?'on':''}" data-a="goal" data-id="${i}"><span>${S.goals.includes(i)?'✓':''}</span>${g}</div>`).join('')}</div>
<div class="card"><h2 style="margin-bottom:10px">Достижения</h2><div class="badges">${B.map(b=>`<div class="bd ${b[2]?'':'off'}"><i>${b[0]}</i>${b[1]}</div>`).join('')}</div></div>
<div class="stack"><button class="btn" data-a="pwd">🔑 Сменить пароль</button><button class="btn ghost" data-a="reset">Сбросить прогресс</button><button class="btn ghost" data-a="logout">Выйти из аккаунта</button></div>`},

Tprofile(){return head('Профиль')+`
<div class="card pf"><span class="av">${nm(USER)[0]}</span><h2>${nm(USER)}</h2><small>Преподаватель · ${USER.uni}</small></div>
<div class="card"><small>Группы: 1–5 · Студентов в системе: ${reals().length+Object.values(DB.groups).reduce((a,g)=>a+g.length,0)}</small></div>
<div class="stack"><button class="btn" data-a="pwd">🔑 Сменить пароль</button><button class="btn ghost" data-a="logout">Выйти из аккаунта</button></div>`},

quests(){return head('Квесты')+`<p class="muted" style="margin:-6px 0 12px">Задания подтверждает преподаватель — баллы начислятся сразу после подтверждения.</p>`+DB.quests.map(q=>qcard(q,S.qp,S.qd,0)).join('')},
rating(){return head('Рейтинг')+`<section class="card">${rows(20)}</section>`}
};

const NAV=[['index','Главная','🏠','home'],['calendar','Календарь','📅','calendar'],['progress','Успеваемость','📊','progress'],['profile','Профиль','👤','profile']];
const NAVT=[['index','Главная','🏠','home'],['calendar','Календарь','📅','calendar'],['students','Студенты','🎓','students'],['profile','Профиль','👤','profile']];
let lastSig='';const sig=()=>JSON.stringify(U);
function render(){const fn=(T&&P['T'+page])||P[page];
 $('#app').innerHTML=fn()+`<div id="net" class="net ${NET.s}">${netText()}</div><nav>${(T?NAVT:NAV).map(n=>`<a href="${n[0]}.html" class="${n[3]===page?'on':''}"><i>${n[2]}</i>${n[1]}</a>`).join('')}</nav>`;
 rankFx();lastSig=sig()}

async function sync(){await refresh();const nb=$('#net');if(nb){nb.className='net '+NET.s;nb.textContent=netText()}const m=U[KEY];if(!m||document.querySelector('.modal')||sig()===lastSig)return;
 const old=S.xp;USER=m;S=dflt(m.s);
 if(!T&&S.xp>old)toast('+'+(S.xp-old)+' XP — подтвердил преподаватель 🔥');
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
  r.salt=newSalt();r.hash=await hash(v('p1'),r.salt);putUser(KEY);m.remove();toast('Пароль изменён ✓')}}

document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,id=+b.dataset.id;
 if(a==='timer')return timer();
 if(a==='pwd')return pwdModal();
 if(a==='cm')cal.d=new Date(cal.d.getFullYear(),cal.d.getMonth()+id,1);
 if(a==='day')cal.sel=b.dataset.id;
 if(a==='here'){S.att[b.dataset.id]='a';addXp(10)}
 if(a==='mk'){S.mk[b.dataset.id]=cal.sel;addXp(20)}
 if(a==='goal'){S.goals=S.goals.includes(id)?S.goals.filter(x=>x!==id):[...S.goals,id];save()}
 if(a==='grp')tv.g=id;
 if(a==='stu')tv.s=b.dataset.id;
 if(a==='tback'){if(tv.s)tv.s=null;else tv.g=null}
 if(a==='tq'){const r=U[tv.s];if(!r)return;const s=r.s=dflt(r.s),q=DB.quests.find(x=>x.id===id);
  s.qp[id]=Math.min(q.max,(s.qp[id]||0)+q.step);
  if(s.qp[id]>=q.max&&!s.qd.includes(id)){s.qd.push(id);s.xp+=q.xp;s.log={...s.log};s.log[TODAY]=(s.log[TODAY]||0)+q.xp;toast(`${nm(r)}: +${q.xp} XP начислено`)}
  putUser(tv.s)}
 if(a==='tres'&&confirm('Сбросить прогресс студента?')){U[tv.s].s={xp:0};putUser(tv.s)}
 if(a==='reset'&&confirm('Сбросить весь прогресс?')){U[KEY].s={xp:0};putUser(KEY);location.reload();return}
 if(a==='logout'){localStorage.removeItem(SK);location.replace('auth.html');return}
 render()});
render();
});
