const $=(s,r=document)=>r.querySelector(s);
const DB={
 events:[
  {id:1,d:'2026-10-19',t:'09:00',n:'Футбол',p:'Спортзал №1'},
  {id:2,d:'2026-10-19',t:'15:30',n:'Плавание',p:'Бассейн'},
  {id:3,d:'2026-10-21',t:'11:00',n:'Лёгкая атлетика',p:'Стадион'},
  {id:4,d:'2026-10-22',t:'10:00',n:'Сдача нормативов: бег 100 м',p:'Стадион',dl:1},
  {id:5,d:'2026-10-24',t:'17:00',n:'Волейбол',p:'Спортзал №2'},
  {id:6,d:'2026-10-26',t:'12:00',n:'Дедлайн: отчёт по тренировкам',p:'Онлайн',dl:1}],
 quests:[
  {id:1,n:'Пробежать 15 км за неделю',xp:80,max:15,u:'км',step:5},
  {id:2,n:'Посетить 3 занятия',xp:60,max:3,u:'зан.',step:1},
  {id:3,n:'100 приседаний',xp:40,max:100,u:'',step:25},
  {id:4,n:'Пройти 50 000 шагов',xp:70,max:50,u:'тыс.',step:10}],
 students:[['Асылхан Б.','Университет Астана',2480],['Нурлан К.','КазНУ',2360],['Айгерим С.','ЕНУ им. Л.Н. Гумилева',2290],['Данияр М.','КБТУ',2210],['Аружан Т.','SATB',2180],['Тимур А.','КазНПУ',2050],['Мадина Е.','МУИТ',1990]],
 week:[['Пн',40],['Вт',65],['Ср',30],['Чт',80],['Пт',55],['Сб',90],['Вс',20]],
 norms:[['Бег 100 м',82],['Подтягивания',60],['Пресс (1 мин)',75],['Прыжок в длину',68]]
};
let S={xp:320,going:[],qp:{},qd:[],goals:[0],name:'Студент',timeWorked:0};
try{S={...S,...JSON.parse(localStorage.getItem('fitqaz'))}}catch(e){}
const save=()=>{try{localStorage.setItem('fitqaz',JSON.stringify(S))}catch(e){}};
const lvl=()=>({l:3+Math.floor(S.xp/500),x:S.xp%500});
const board=()=>[...DB.students.map(s=>({n:s[0],u:s[1],p:s[2]})),{n:S.name+' (вы)',u:'FITQAZ',p:1500+S.xp,me:1}].sort((a,b)=>b.p-a.p);
const rows=n=>board().slice(0,n).map((s,i)=>`<div class="st ${s.me?'me':''}"><span class="rk r${i+1}">${i+1}</span><span class="av">${s.n[0]}</span><div><b>${s.n}</b><small>${s.u}</small></div><em>${s.p} 🔥</em></div>`).join('');
const head=t=>`<div class="page-h"><a class="back" href="index.html">‹</a><h1>${t}</h1></div>`;
function toast(m){const t=document.createElement('div');t.id='toast';t.textContent=m;document.body.append(t);setTimeout(()=>t.remove(),1800)}
function addXp(n){S.xp+=n;save();toast('+'+n+' XP 🔥')}

const P={
home(){const {l,x}=lvl();return `
<header class="top"><div><div class="logo">FIT<b>Q</b>AZ</div><p class="muted">Двигайся. Развивайся. Достигай.</p></div>
<a class="lvl" href="progress.html"><span>Уровень ${l}</span><i class="bar"><u style="width:${x/5}%"></u></i><small>${x} / 500</small></a></header>
<section class="hero"><h1>Лучше, чем<br>вчера</h1><p>Твоя цель ближе,<br>чем ты думаешь</p><button class="btn" data-a="timer">Начать тренировку</button></section>
<div class="grid">
<a class="tile" href="calendar.html"><i>📅</i><b>Спортивный календарь</b><small>Твои тренировки, события и дедлайны</small></a>
<a class="tile" href="progress.html"><i>📊</i><b>Успеваемость</b><small>Следи за своим прогрессом</small></a>
<a class="tile" href="profile.html"><i>👤</i><b>Профиль</b><small>Твои данные, цели и достижения</small></a>
<a class="tile" href="quests.html"><i>🏆</i><b>Еженедельные квесты</b><small>Выполняй задания и получай награды</small></a></div>
<section class="card"><div class="row"><h2>🏆 Топ студентов</h2><a href="rating.html">Весь рейтинг ›</a></div>${rows(5)}</section>`},

calendar(){const g={};DB.events.forEach(e=>(g[e.d]=g[e.d]||[]).push(e));
return head('Календарь')+Object.keys(g).sort().map(d=>`<div class="day">${new Date(d).toLocaleDateString('ru-RU',{weekday:'long',day:'numeric',month:'long'})}</div>`+g[d].map(e=>{const on=S.going.includes(e.id);
return `<div class="card ev"><div><span class="time">${e.t}</span><b>${e.dl?'⏰ ':''}${e.n}</b><small>${e.p}</small></div><button class="btn sm ${on?'on':''}" data-a="go" data-id="${e.id}">${on?'Вы идёте ✓':e.dl?'Напомнить':'Записаться'}</button></div>`}).join('')).join('')},

progress(){const {l,x}=lvl();const done=S.going.length;
return head('Успеваемость')+`
<div class="stats"><div class="card"><b>${1900+S.xp}</b><small>всего баллов</small></div><div class="card"><b>${l}</b><small>уровень</small></div>
<div class="card"><b>${86+Math.min(done,14)}%</b><small>посещаемость</small></div><div class="card"><b>${S.qd.length}/${DB.quests.length}</b><small>квестов выполнено</small></div></div>
<div class="card"><div class="row"><h2>До уровня ${l+1}</h2><small>${x} / 500</small></div><i class="bar"><u style="width:${x/5}%"></u></i></div>
<div class="card"><h2>Активность за неделю</h2><div class="chart">${DB.week.map(w=>`<div>${w[1]}<u style="height:${w[1]}%"></u>${w[0]}</div>`).join('')}</div></div>
<div class="card"><h2>Нормативы</h2>${DB.norms.map(n=>`<div class="nm"><div class="row"><span>${n[0]}</span><small>${n[1]}%</small></div><i class="bar"><u style="width:${n[1]}%"></u></i></div>`).join('')}</div>`},

profile(){const G=['Пробежать 5 км без остановки','Сдать все нормативы','Войти в топ-3 рейтинга','Тренироваться 3 раза в неделю'];
const B=[['🔥','Первый шаг',1],['🏃','Бегун',S.xp>=400],['🏆','Квестер',S.qd.length>0],['⭐','Уровень 4',S.xp>=500],['📅','Активист',S.going.length>=2],['👑','Лидер',S.xp>=1000]];
return head('Профиль')+`
<div class="card pf"><span class="av">${S.name[0]}</span><h2>${S.name}</h2><small>KSTU · ${1900+S.xp} баллов</small><button class="btn sm ghost" data-a="name">Изменить имя</button></div>
<div class="card"><h2>Мои цели</h2>${G.map((g,i)=>`<div class="goal ${S.goals.includes(i)?'on':''}" data-a="goal" data-id="${i}"><span>${S.goals.includes(i)?'✓':''}</span>${g}</div>`).join('')}</div>
<div class="card"><h2 style="margin-bottom:10px">Достижения</h2><div class="badges">${B.map(b=>`<div class="bd ${b[2]?'':'off'}"><i>${b[0]}</i>${b[1]}</div>`).join('')}</div></div>
<button class="btn ghost" data-a="reset">Сбросить прогресс</button>`},

quests(){return head('Квесты')+`<p class="muted" style="margin:-6px 0 12px">Обновляются каждый понедельник</p>`+DB.quests.map(q=>{const c=S.qp[q.id]||0,d=S.qd.includes(q.id);
return `<div class="card"><div class="row"><b>${q.n}</b><small>+${q.xp} XP</small></div><i class="bar"><u style="width:${c/q.max*100}%"></u></i>
<div class="row" style="margin:10px 0 0"><small>${c} / ${q.max} ${q.u}</small>${d?'<span class="btn sm on">Выполнено ✓</span>':`<button class="btn sm" data-a="q" data-id="${q.id}">+${q.step} ${q.u}</button>`}</div></div>`}).join('')},

rating(){return head('Рейтинг')+`<section class="card">${rows(20)}</section>`}
};

const NAV=[['index','Главная','🏠','home'],['calendar','Календарь','📅','calendar'],['progress','Успеваемость','📊','progress'],['profile','Профиль','👤','profile']];
const page=document.body.dataset.page;
function render(){$('#app').innerHTML=P[page]();
 $('#app').insertAdjacentHTML('afterend','');document.querySelector('nav')?.remove();
 document.body.insertAdjacentHTML('beforeend',`<nav>${NAV.map(n=>`<a href="${n[0]}.html" class="${n[3]===page?'on':''}"><i>${n[2]}</i>${n[1]}</a>`).join('')}</nav>`)}

function timer(){const m=document.createElement('div');m.className='modal';
 m.innerHTML=`<div class="sheet"><h2>Тренировка</h2><div class="time" id="tm">00:00</div><button class="btn" id="tg">Старт</button><button class="btn ghost" id="fin">Завершить и получить XP</button><button class="btn ghost" id="cl">Закрыть</button></div>`;
 document.body.append(m);let t=0,iv=null;const f=()=>$('#tm',m).textContent=String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0');
 $('#tg',m).onclick=e=>{if(iv){clearInterval(iv);iv=null;e.target.textContent='Продолжить'}else{iv=setInterval(()=>{t++;f()},1000);e.target.textContent='Пауза'}};
 const close=()=>{clearInterval(iv);m.remove()};
 $('#cl',m).onclick=close;
 $('#fin',m).onclick=()=>{close();if(t<5)return toast('Слишком короткая тренировка');addXp(Math.max(10,Math.floor(t/60)*10));render()}}

document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,id=+b.dataset.id;
 if(a==='timer')return timer();
 if(a==='go'){S.going=S.going.includes(id)?S.going.filter(x=>x!==id):[...S.going,id];toast(S.going.includes(id)?'Записано ✓':'Запись отменена')}
 if(a==='goal')S.goals=S.goals.includes(id)?S.goals.filter(x=>x!==id):[...S.goals,id];
 if(a==='q'){const q=DB.quests.find(x=>x.id===id);S.qp[id]=Math.min(q.max,(S.qp[id]||0)+q.step);
  if(S.qp[id]>=q.max){S.qd.push(id);addXp(q.xp)}}
 if(a==='name'){const n=prompt('Ваше имя:',S.name);if(n&&n.trim())S.name=n.trim().slice(0,20)}
 if(a==='reset'&&confirm('Сбросить весь прогресс?')){localStorage.removeItem('fitqaz');location.reload();return}
 save();render()});
render();
