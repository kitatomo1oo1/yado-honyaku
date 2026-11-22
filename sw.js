const V='yado-v12';
const SHELL=['./','./index.html','./config.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png','./qr.js','./guest.html','./guest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!=='share-inbox').map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);
 // Androidの共有ボタンから届いた写真を受け取り、アプリの画面に渡す
 if(e.request.method==='POST'&&u.origin===location.origin&&u.pathname.endsWith('/share-target')){
  e.respondWith((async()=>{try{const f=await e.request.formData(),img=f.get('image');
   if(img){const c=await caches.open('share-inbox');await c.put('shared-image',new Response(img,{headers:{'Content-Type':img.type||'image/jpeg'}}))}}catch(err){}
   return Response.redirect(new URL('./?share=1',self.registration.scope).href,303)})());return}
 if(e.request.method!=='GET'||u.origin!==location.origin)return;
 e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(V).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request)))});
