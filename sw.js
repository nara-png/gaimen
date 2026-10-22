// 一度開いたら電波が弱くても動くように保存しておく（新しい版があればネットから取り直す）
const C='gmk-v2';
self.addEventListener('install',e=>{ self.skipWaiting(); e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png']))); });
self.addEventListener('activate',e=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch',e=>{
  // 録音（mp3）や範囲指定の読み込みは保存しない（容量が大きいため。毎回ネットから）
  if(e.request.method!=='GET' || new URL(e.request.url).origin!==location.origin || e.request.headers.has('range') || /\.mp3$/.test(new URL(e.request.url).pathname)) return;
  e.respondWith(fetch(e.request).then(r=>{ const cp=r.clone(); caches.open(C).then(c=>c.put(e.request,cp)); return r; }).catch(()=>caches.match(e.request).then(m=>m||caches.match('./index.html'))));
});
