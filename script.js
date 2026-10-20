const PASSCODE = "4503";
const screens = {
  lock: document.getElementById("lockScreen"),
  pass: document.getElementById("passScreen"),
  home: document.getElementById("homeScreen"),
  app: document.getElementById("appScreen")
};
let entered = "";
let currentApp = "";
let lang = "th";
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

function updateClock(){
  const d = new Date();
  const time = d.toLocaleTimeString("th-TH",{hour:"2-digit",minute:"2-digit",hour12:false});
  $("#lockTime").textContent = time;
  $("#statusTime").textContent = time;
  $("#lockDate").textContent = d.toLocaleDateString("th-TH",{weekday:"long",day:"numeric",month:"long"});
  const month = d.toLocaleDateString("en-US",{month:"short"}).toUpperCase();
  $("#homeGreeting").textContent = "A little day, a little wish.";
  $(".widget-label").textContent = `${d.toLocaleDateString("en-US",{weekday:"long"}).toUpperCase()} · ${month} ${d.getDate()}`;
  $$(".calendar strong").forEach(el=>el.textContent=d.getDate());
  $$(".calendar b").forEach(el=>el.textContent=month);
}
setInterval(updateClock,1000); updateClock();

function showScreen(name){
  Object.values(screens).forEach(s=>s.classList.remove("active"));
  screens[name].classList.add("active");
  $("#homeIndicator").style.display = name === "pass" ? "none" : "block";
}
$("#unlockBtn").addEventListener("click",()=>{entered="";drawDots();$("#passError").textContent="";showScreen("pass")});
$("#passBack").addEventListener("click",()=>showScreen("lock"));
function drawDots(){ $$("#dots i").forEach((dot,i)=>dot.classList.toggle("filled",i<entered.length)); }
function keyPress(n){
  if(entered.length>=4)return;
  entered+=n;drawDots();
  if(entered.length===4){
    if(entered===PASSCODE){$("#passError").textContent="";setTimeout(()=>showScreen("home"),180)}
    else{
      $("#passError").textContent=lang==="en"?"Incorrect passcode. Try again.":lang==="ko"?"비밀번호가 틀렸어요.":"รหัสไม่ถูกต้อง ลองอีกครั้งนะ";
      $("#phone").classList.remove("shake");void $("#phone").offsetWidth;$("#phone").classList.add("shake");
      setTimeout(()=>{entered="";drawDots()},550);
    }
  }
}
$$("[data-num]").forEach(b=>b.addEventListener("click",()=>keyPress(b.dataset.num)));
$("#deleteNum").addEventListener("click",()=>{entered=entered.slice(0,-1);drawDots();$("#passError").textContent=""});

const appNames={kakao:"KakaoTalk",photos:"Photos",notes:"Notes",instagram:"Instagram",calendar:"Calendar",music:"Music",safari:"Safari",settings:"Settings"};
function openApp(app){
  currentApp=app;$("#appTitle").textContent=appNames[app]||app;
  $("#appContent").innerHTML=appTemplate(app);
  showScreen("app");
  wireApp(app);
}
$$("[data-app]").forEach(b=>b.addEventListener("click",()=>openApp(b.dataset.app)));
$("#homeBtn").addEventListener("click",()=>showScreen("home"));
$("#homeIndicator").addEventListener("click",()=>{if(screens.pass.classList.contains("active"))return;showScreen("home")});
$("#appMore").addEventListener("click",()=>toast("♡ A little memory, just for you"));

const loveMessage = "리쿠짱~ 보고 싶어~\n리쿠가 있어서 나는 힘을 낼 수 있었던 것 같애 그래서 나는 리쿠가 필요해~\n나는 기다릴게~ 리쿠 사랑해~";
function appTemplate(app){
 switch(app){
 case "kakao": return `<div class="chat-top"><div class="chat-avatar">🐰</div><div><b>리쿠짱 ♡</b><small>online · 우리만의 채팅</small></div></div><div class="muted" style="text-align:center">오늘도 보고 싶은 사람</div><div class="bubble">안녕~ 오늘 뭐 했어? ♡</div><div class="bubble me">${escapeHTML(loveMessage).replace(/\n/g,"<br>")}</div><div class="bubble">ยูชิ짱 fighting! 🫶</div><div class="muted" style="text-align:center;margin-top:15px">— end of today's messages —</div>`;
 case "photos": return `<h3>Memories ♡</h3><p class="muted">รูปภาพในจักรวาลเล็ก ๆ ของ Yushi & Riku</p><div class="photo-grid"><div class="photo-tile">🐰<small>Riku day</small></div><div class="photo-tile">🌙<small>our night</small></div><div class="photo-tile">🌷<small>soft moments</small></div><div class="photo-tile">✨<small>little wish</small></div><div class="photo-tile">🧸<small>cute things</small></div><div class="photo-tile">💌<small>for you</small></div></div><p class="muted">* ภาพตัวอย่างตกแต่งด้วยอีโมจิ สามารถเปลี่ยนเป็นรูปที่ต้องการได้</p>`;
 case "notes": return `<div class="note-paper"><p class="muted">NOTE · 01</p><h3>리쿠에게 ♡</h3><textarea id="noteText" aria-label="โน้ต" placeholder="เขียนข้อความถึงริคุ...">${loveMessage}</textarea></div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px"><span class="muted">บันทึกในเครื่องจำลองนี้</span><button class="note-save" id="saveNote">บันทึกโน้ต</button></div><p class="muted" id="noteStatus"></p>`;
 case "instagram": return `<div class="social-profile"><div class="social-avatar">🐰</div><b style="font-size:13px">yushi_riku.zip</b><div class="social-stats"><span><b>24</b>posts</span><span><b>4503</b>♡</span><span><b>∞</b>love</span></div><p class="muted">a little archive for my favorite people ♡</p><button class="pill-button" id="followBtn">♡ Follow</button></div><div class="post"><div class="post-art">🌷🐰</div><p><b>yushi_riku.zip</b> my comfort people, my happy place ♡ <span style="color:#c17aa7">#YUSHI #RIKU</span></p></div><div class="post"><div class="post-art">🌙✨</div><p><b>yushi_riku.zip</b> 오늘도 보고 싶어~</p></div>`;
 case "calendar": {let cells="";for(let i=1;i<=31;i++)cells+=`<span class="${i===new Date().getDate()?"chosen":""}">${i}</span>`;return `<div class="calendar-month"><button class="pill-button">‹</button><h3 style="margin:0">${new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"})}</h3><button class="pill-button">›</button></div><div class="calendar-days">${["S","M","T","W","T","F","S"].map(d=>`<span class="muted">${d}</span>`).join("")}${cells}</div><div class="card" style="margin-top:20px"><h3>Little reminders ♡</h3><div class="event"><b>♡</b><span>Remember to smile today</span></div><div class="event"><b>✦</b><span>Listen to our playlist</span></div><div class="event"><b>🐰</b><span>Riku appreciation day — every day!</span></div></div>`}
 case "music": return `<div class="music-player"><div class="album-art">🌙♡</div><h3>Our Little Universe</h3><p class="muted">Yushi & Riku playlist</p><div class="track"><span></span></div><div style="display:flex;justify-content:space-between" class="muted"><span>1:24</span><span>3:45</span></div><div class="controls"><button id="prevTrack">◀◀</button><button class="play" id="playTrack">▶</button><button id="nextTrack">▶▶</button></div><p class="muted" id="musicStatus">A pretend player for your favorite songs ♡</p></div>`;
 case "safari": return `<h3>Search the little universe</h3><div class="searchbar">⌕ <input id="searchInput" style="border:0;background:transparent;outline:0;width:85%;font:inherit" placeholder="Search or enter website"></div><button class="pill-button" id="searchBtn">Search</button><p class="muted" style="margin-top:22px">ประวัติการค้นหา</p><div id="searchHistory"><div class="history-item"><span>⌕</span><div>Tokuno Yushi profile<small>recent search</small></div></div><div class="history-item"><span>⌕</span><div>Maeda Riku birthday<small>recent search</small></div></div><div class="history-item"><span>⌕</span><div>NCT WISH cute moments<small>recent search</small></div></div><div class="history-item"><span>⌕</span><div>리쿠짱 보고 싶어<small>recent search</small></div></div></div>`;
 case "settings": return `<h3>Settings</h3><div class="card"><div class="chat-top"><div class="chat-avatar">🐰</div><div><b>Yushi & Riku Phone</b><small>Virtual device · iOS inspired</small></div></div></div><p class="muted">PREFERENCES</p><div class="setting-item"><span class="setting-emoji">🌐</span><span>Language / ภาษา</span><select id="languageSelect"><option value="th">ไทย</option><option value="en">English</option><option value="ko">한국어</option></select></div><div class="setting-item"><span class="setting-emoji">🔊</span><span>Click sound</span><button class="toggle" id="soundToggle" aria-label="เสียงคลิก"></button></div><div class="setting-item"><span class="setting-emoji">🌙</span><span>Soft appearance</span><button class="toggle on" id="themeToggle" aria-label="ธีม"></button></div><div class="setting-item"><span class="setting-emoji">🔐</span><span>Passcode</span><small style="margin-left:auto;color:#a18da6">••••</small></div><div class="card" style="margin-top:17px"><b style="font-size:12px">About this phone ♡</b><p class="muted">A fan-made virtual phone inspired by Yushi & Riku. Not an official app or affiliated with the artists.</p></div>`;
 default:return `<h3>${appNames[app]||"App"}</h3><p>Welcome to your little universe ♡</p>`;
 }
}
function wireApp(app){
 if(app==="notes"){
   $("#saveNote").addEventListener("click",()=>{try{localStorage.setItem("yr_note",$("#noteText").value);$("#noteStatus").textContent="บันทึกแล้ว ♡"}catch(e){$("#noteStatus").textContent="บันทึกในหน้านี้แล้ว ♡"}});
   try{const saved=localStorage.getItem("yr_note");if(saved)$("#noteText").value=saved}catch(e){}
 }
 if(app==="instagram")$("#followBtn").addEventListener("click",e=>{e.currentTarget.textContent=e.currentTarget.textContent.includes("Following")?"♡ Follow":"✓ Following";toast("following with love ♡")});
 if(app==="music"){
   let playing=false;$("#playTrack").addEventListener("click",e=>{playing=!playing;e.currentTarget.textContent=playing?"Ⅱ":"▶";$("#musicStatus").textContent=playing?"Playing pretend playlist ♡":"Paused";clickSound()});
   $("#prevTrack").addEventListener("click",()=>toast("Previous song ♡"));$("#nextTrack").addEventListener("click",()=>toast("Next song ♡"));
 }
 if(app==="safari"){
   $("#searchBtn").addEventListener("click",()=>{const q=$("#searchInput").value.trim();if(!q)return;const row=document.createElement("div");row.className="history-item";row.innerHTML=`<span>⌕</span><div>${escapeHTML(q)}<small>just searched</small></div>`;$("#searchHistory").prepend(row);$("#searchInput").value="";});
   $("#searchInput").addEventListener("keydown",e=>{if(e.key==="Enter")$("#searchBtn").click()});
 }
 if(app==="settings"){
   $("#languageSelect").value=lang;$("#languageSelect").addEventListener("change",e=>{lang=e.target.value;toast(({th:"เปลี่ยนภาษาเป็นไทยแล้ว ♡",en:"Language set to English ♡",ko:"언어가 한국어로 변경됐어요 ♡"})[lang])});
   $("#soundToggle").addEventListener("click",e=>{e.currentTarget.classList.toggle("on");soundEnabled=e.currentTarget.classList.contains("on");toast(soundEnabled?"Click sound on":"Click sound off")});
   $("#themeToggle").addEventListener("click",e=>{e.currentTarget.classList.toggle("on");document.querySelector(".home-screen").style.filter=e.currentTarget.classList.contains("on")?"none":"saturate(.65) grayscale(.1)";toast("Appearance updated ♡")});
 }
}
function escapeHTML(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function toast(msg){const old=$(".toast");if(old)old.remove();const t=document.createElement("div");t.className="toast";t.textContent=msg;$("#phone").append(t);setTimeout(()=>t.remove(),2100)}
let soundEnabled=false;
function clickSound(){if(!soundEnabled)return;try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const osc=ctx.createOscillator(),gain=ctx.createGain();osc.frequency.value=660;gain.gain.value=.025;osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.045)}catch(e){}}
document.addEventListener("click",e=>{if(e.target.closest("button"))clickSound()});
document.addEventListener("keydown",e=>{if(screens.pass.classList.contains("active")){if(/^\d$/.test(e.key))keyPress(e.key);if(e.key==="Backspace"){$("#deleteNum").click()}}if(e.key==="Escape"&&screens.app.classList.contains("active"))showScreen("home")});
