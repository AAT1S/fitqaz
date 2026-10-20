/* Хранилище аккаунтов + вход/регистрация. Если в config.js указан Firebase — данные общие для всех устройств. */
const UK='fitqaz_users',SK='fitqaz_session',DBURL=(window.FITQAZ_DB_URL||'').replace(/\/$/,'');
const UNIS=['KSTU','Университет Астана','КазНУ','ЕНУ им. Л.Н. Гумилева','КБТУ','SATB','КазНПУ','МУИТ','Другой вуз'];
let U={};const touched={};
const enc=k=>[...k].map(c=>/[a-z0-9_]/.test(c)?c:'-'+c.charCodeAt(0).toString(36)+'-').join('');
const curKey=()=>localStorage.getItem(SK);
const localISO=()=>new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
const newSalt=()=>[...crypto.getRandomValues(new Uint8Array(12))].map(x=>x.toString(16).padStart(2,'0')).join('');
async function hash(pw,salt){
 if(window.crypto&&crypto.subtle){const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveBits']);
  const b=await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:100000,hash:'SHA-256'},k,256);
  return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
 let h=5381;for(const c of salt+pw)h=((h*33)^c.charCodeAt(0))>>>0;return 'w'+h}
async function loadUsers(){let raw={};
 try{if(DBURL){const r=await fetch(DBURL+'/fitqaz/users.json');raw=(await r.json())||{}}else raw=JSON.parse(localStorage.getItem(UK))||{}}catch(e){}
 const n={};for(const[k,r]of Object.entries(raw))if(r){r.k=r.k||k;n[r.k]=r}return n}
async function refresh(){const n=await loadUsers();for(const k in n)if(!touched[k]||Date.now()-touched[k]>4000)U[k]=n[k]}
function putUser(k){touched[k]=Date.now();U[k].k=k;
 if(DBURL)fetch(`${DBURL}/fitqaz/users/${enc(k)}.json`,{method:'PUT',body:JSON.stringify(U[k])}).catch(()=>{});
 else localStorage.setItem(UK,JSON.stringify(U))}
const DEMO=[
 {k:'student',name:'student',fio:'Ержан С.',role:'student',uni:'KSTU',pw:'student123',s:{xp:0}},
 {k:'teacher',name:'teacher',fio:'Алия Серикова',role:'teacher',uni:'KSTU',pw:'teacher123'}];
async function seed(){for(const d of DEMO)if(!U[d.k]){const{pw,...r}=d,salt=newSalt();U[d.k]={...r,salt,hash:await hash(pw,salt),v:2,created:localISO()};putUser(d.k)}}
const READY=(async()=>{U=await loadUsers();await seed()})();

if(document.body.dataset.page==='auth')READY.then(()=>{
 if(U[curKey()]){location.replace('index.html');return}
 const app=document.getElementById('app');app.className='auth';let mode='choose';
 const fld=(id,ph,t,ac)=>`<input id="${id}" type="${t||'text'}" placeholder="${ph}" autocomplete="${ac||'off'}" required>`;
 const logo='<div class="logo" style="text-align:center">FIT<b>Q</b>AZ</div><p class="muted" style="text-align:center">Двигайся. Развивайся. Достигай.</p>';
 const V={
  choose:()=>`${logo}<div class="card stack"><h2>Добро пожаловать!</h2><small>Выберите, как продолжить</small>
   <button class="btn big" data-m="reg">Я новый пользователь — регистрация</button>
   <button class="btn big ghost" data-m="login">У меня уже есть аккаунт — войти</button></div>`,
  reg:()=>`${logo}<div class="card"><h2 style="margin-bottom:12px">Регистрация студента</h2><form id="f">
   ${fld('n','Имя (например, Асылхан Б.)','text','username')}
   <select id="u">${UNIS.map(x=>`<option>${x}</option>`).join('')}</select>
   ${fld('p','Пароль (от 6 символов)','password','new-password')}${fld('p2','Повторите пароль','password','new-password')}
   <div class="err" id="er"></div><button class="btn big">Создать аккаунт</button></form></div>
   <button class="lnk" data-m="login">Уже есть аккаунт? Войти</button><button class="lnk" data-m="choose">‹ Назад</button>`,
  login:()=>`${logo}<div class="card"><h2 style="margin-bottom:12px">Вход</h2><form id="f">
   ${fld('n','Имя','text','username')}${fld('p','Пароль','password','current-password')}
   <div class="err" id="er"></div><button class="btn big">Войти</button></form>
   <div class="stack" style="margin-top:14px"><small>Демо-аккаунты (нажмите, чтобы подставить):</small>
   <button class="btn sm ghost" data-fill="student">🎓 Студент: student / student123</button>
   <button class="btn sm ghost" data-fill="teacher">👩‍🏫 Преподаватель: teacher / teacher123</button></div></div>
   <button class="lnk" data-m="reg">Нет аккаунта? Регистрация</button><button class="lnk" data-m="choose">‹ Назад</button>`};
 const draw=()=>{app.innerHTML=V[mode]();const n=document.getElementById('n');if(n)n.focus()};
 const v=id=>document.getElementById(id).value,fail=m=>document.getElementById('er').textContent=m;
 app.addEventListener('click',e=>{const b=e.target.closest('[data-m]'),f=e.target.closest('[data-fill]');
  if(b){mode=b.dataset.m;draw()}
  if(f){const d=DEMO.find(x=>x.k===f.dataset.fill);document.getElementById('n').value=d.name;document.getElementById('p').value=d.pw}});
 app.addEventListener('submit',async e=>{e.preventDefault();
  await refresh();const name=v('n').trim(),k=name.toLowerCase(),pw=v('p');
  if(mode==='reg'){
   if(name.length<2||name.length>20)return fail('Имя: от 2 до 20 символов');
   if(U[k])return fail('Такое имя уже занято — выберите другое или войдите');
   if(pw.length<6)return fail('Пароль: минимум 6 символов');
   if(pw!==v('p2'))return fail('Пароли не совпадают');
   const salt=newSalt();U[k]={k,name,uni:v('u'),role:'student',salt,hash:await hash(pw,salt),s:{xp:0},v:2,created:localISO()};putUser(k);
  }else{const r=U[k];if(!r||await hash(pw,r.salt)!==r.hash)return fail('Неверное имя или пароль')}
  localStorage.setItem(SK,k);location.replace('index.html')});
 draw();
});
