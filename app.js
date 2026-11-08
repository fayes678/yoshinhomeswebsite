(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
let on=localStorage.getItem('ya-snd')!=='0',ac;
function unlock(){try{ac=ac||new (window.AudioContext||window.webkitAudioContext)();if(ac.state!=='running')ac.resume()}catch(e){}}
['pointerdown','keydown','touchstart'].forEach(t=>addEventListener(t,unlock,{passive:true}));
function beep(f=520,d=.07,v=.04){if(!on)return;try{unlock();if(!ac||ac.state!=='running')return;const o=ac.createOscillator(),g=ac.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(v,ac.currentTime);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
window.YAbeep=beep;
const pages=[['index','Home'],['about','Community'],['view','View'],['tools','Tools'],['links','Links'],['support','Donasi'],['partnership','Partnership'],['tiktok','TikTok'],['youtube','YouTube'],['spotify','MP3'],['premium','Premium'],['map','Muara Teduh'],['notif','Notifikasi']];
const cur=location.pathname.split('/').pop().replace('.html','')||'index';
const nav=document.createElement('nav');nav.className='top';
nav.innerHTML=`<a class="brand" href="index.html"><i></i>YoshinAce</a><div class="links">${pages.map(p=>`<a href="${p[0]}.html" class="${p[0]==cur?'on':''}">${p[1]}</a>`).join('')}</div><button class="snd" aria-label="Suara">${on?'🔊':'🔇'}</button>`;
document.body.prepend(nav);
$('.snd').onclick=e=>{on=!on;localStorage.setItem('ya-snd',on?1:0);e.target.textContent=on?'🔊':'🔇';beep(700)};
document.addEventListener('mouseover',e=>{const t=e.target.closest('.card,.btn,.links a,.snd');if(t&&!t.contains(e.relatedTarget))beep(640,.05,.05)});
document.addEventListener('pointerdown',e=>{if(e.target.closest('.btn,.card,.links a,.gate,.snd'))beep(880,.12,.08)});
// skeleton shimmer lalu konten
const m=$('main');if(m){const html=m.innerHTML;m.innerHTML='<div class="sk" style="min-height:90px;max-width:420px"></div><br><div class="grid">'+'<div class="sk"></div>'.repeat(6)+'</div>';setTimeout(()=>{m.innerHTML=html;document.body.classList.add('reveal-on');init()},650)}
function init(){
 $$('.card').forEach(c=>{c.onmousemove=e=>{const r=c.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;c.style.setProperty('--mx',x+'px');c.style.setProperty('--my',y+'px');c.style.transform=`perspective(700px) rotateX(${(y/r.height-.5)*-6}deg) rotateY(${(x/r.width-.5)*6}deg) translateY(-4px)`};c.onmouseleave=()=>c.style.transform=''});
 const g=$('.gate');if(g){if(sessionStorage.getItem('ya-in'))g.remove();else g.onclick=()=>{sessionStorage.setItem('ya-in',1);g.classList.add('out');beep(440,.2);setTimeout(()=>beep(660,.25),120);setTimeout(()=>beep(880,.3),260);setTimeout(()=>g.remove(),900)}}
 const f=$('[data-donate]');if(f)donate(f);const n=$('[data-feed]');if(n)feed(n);const d=$('[data-dl]');if(d)dl(d);
 $$('[data-donations]').forEach(showDon);
 $$('[data-ya]').forEach(b=>{const u=YA.map[b.dataset.ya.replace('map','').toLowerCase()];if(u){b.href=u;b.target='_blank'}else b.onclick=e=>{e.preventDefault();toast('Link belum diisi. Isi YA.map di config.js')}});
}
function toast(t){let w=$('.toast-wrap')||document.body.appendChild(Object.assign(document.createElement('div'),{className:'toast-wrap'}));const e=document.createElement('div');e.className='toast';e.textContent=t;w.append(e);beep(990,.15);setTimeout(()=>e.remove(),5000)}
const store=k=>JSON.parse(localStorage.getItem(k)||'[]');
async function getDon(){if(YA.API)try{return await (await fetch(YA.API+'/api/donations')).json()}catch(e){}return store('ya-don')}
async function showDon(el){const l=await getDon();el.innerHTML=l.length?l.slice().reverse().map(d=>`<li><span><b>${d.name}</b> · ${d.via} <small>${d.msg||''}</small></span><b>Rp ${(+d.amount).toLocaleString('id-ID')}</b></li>`).join(''):'<li>Belum ada donasi. Jadi yang pertama!</li>'}
function donate(f){f.querySelector('button').onclick=()=>{const v=k=>f.querySelector('[name='+k+']').value;const amt=+v('amount');if(!v('name')||amt<1000)return toast('Isi nama dan nominal minimal Rp 1.000');window.open(YA.links[v('via')],'_blank');toast('Selesaikan pembayaran di tab baru. Donasi masuk otomatis lewat webhook.');
  if(!YA.API){const l=store('ya-don');l.push({name:v('name'),amount:amt,via:v('via')=='sw'?'Saweria':'Sociabuzz',msg:v('msg')});localStorage.setItem('ya-don',JSON.stringify(l));showDon($('[data-donations]'))}}}
// notif global donasi: polling server
if(YA.API){let last=0;setInterval(async()=>{try{const l=await (await fetch(YA.API+'/api/donations')).json();if(last&&l.length>last)l.slice(last).forEach(d=>toast(`💜 ${d.name} donasi Rp ${(+d.amount).toLocaleString('id-ID')} via ${d.via}`));last=l.length}catch(e){}},8000)}
async function feed(el){let items=[];if(YA.API)try{items=await (await fetch(YA.API+'/api/feed')).json()}catch(e){}
 if(YA.YT_CHANNEL_ID)try{const r=await (await fetch('https://api.rss2json.com/v1/api.json?rss_url='+encodeURIComponent('https://www.youtube.com/feeds/videos.xml?channel_id='+YA.YT_CHANNEL_ID))).json();items=items.concat(r.items.map(i=>({src:'YouTube',title:i.title,url:i.link,date:i.pubDate})))}catch(e){}
 el.innerHTML=items.length?items.map(i=>`<a class="card" href="${i.url}" target="_blank"><span class="tag">${i.src}</span><h3>${i.title}</h3><p>${i.date||''}</p></a>`).join(''):'<div class="card"><h3>Feed masih kosong</h3><p>Isi YT_CHANNEL_ID di config.js dan jalankan server.js agar postingan IG/TikTok/YouTube masuk otomatis.</p></div>'}
function dl(f){f.querySelector('button').onclick=async()=>{const u=f.querySelector('input').value.trim();if(!u)return toast('Tempel link dulu');if(!YA.API)return toast('Downloader butuh server API. Isi YA.API di config.js');try{const r=await fetch(YA.API+'/api/dl?type='+f.dataset.dl+'&url='+encodeURIComponent(u));const j=await r.json();f.querySelector('.out').innerHTML=j.url?`<a class="btn" href="${j.url}" download>Unduh</a>`:j.error}catch(e){toast('Server tidak merespons')}}}
window.addEventListener('DOMContentLoaded',()=>{if(!m)init()});
})();
