// Server kecil: node server.js  (butuh Node 18+)
const http=require('http'),fs=require('fs');const F='data.json';
const db=()=>fs.existsSync(F)?JSON.parse(fs.readFileSync(F)):{donations:[],feed:[]};
const save=d=>fs.writeFileSync(F,JSON.stringify(d));
http.createServer((q,s)=>{s.setHeader('Access-Control-Allow-Origin','*');s.setHeader('Content-Type','application/json');
 let b='';q.on('data',c=>b+=c);q.on('end',()=>{const d=db();const j=()=>{try{return JSON.parse(b)}catch(e){return{}}};
  if(q.url=='/api/donations')return s.end(JSON.stringify(d.donations));
  if(q.url=='/api/feed')return s.end(JSON.stringify(d.feed));
  if(q.url=='/webhook/saweria'){const x=j();d.donations.push({name:x.donator_name||'Anon',amount:x.amount_raw||x.amount,msg:x.message,via:'Saweria'});save(d);return s.end('{"ok":1}')}
  if(q.url=='/webhook/sociabuzz'){const x=j();d.donations.push({name:x.supporter||x.name||'Anon',amount:x.amount,msg:x.message,via:'Sociabuzz'});save(d);return s.end('{"ok":1}')}
  if(q.url=='/webhook/feed'){const x=j();d.feed.unshift({src:x.src,title:x.title,url:x.url,date:new Date().toLocaleString('id-ID')});save(d);return s.end('{"ok":1}')}
  s.statusCode=404;s.end('{"error":"Downloader belum dipasang di server"}')})}).listen(3000,()=>console.log('API :3000'));
