/* ===============================
   FREEMIND — app.js (FULL)
   All features integrated, 2025
================================= */

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  console.log("FreeMind initializing...");
  setupNavLinks();
  setupMotivation();
  setupPrayerEngine();
  setupTracker();
  setupStreak();
  setupGoals();
  setupVerses();
  setupEmergency();
  setupAudio();
  setupProfileJournal();
  setupMapSafe();
}

/* Navigation (links are plain pages) */
function setupNavLinks() {}

/* utility */
function $id(id) { return document.getElementById(id); }
function getRandomFrom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

/* MOTIVATION */
const MOTIVATIONS = {
  faith: ["God is with you and gives strength in the struggle.","Lean on Him — small steps matter.","You are being renewed each day."],
  discipline: ["Discipline is daily courage; keep taking steps.","Build the habit: one small choice at a time.","Focus on progress, not perfection."],
  purpose: ["Your life has a purpose greater than any craving.","Every sacrifice prepares you for something better.","Your future self is being shaped today."],
  recovery: ["Every urge you resist breaks another chain.","Healing is slow but lasting. Keep going.","You are stronger than you feel right now."]
};

function setupMotivation(){
  const btn = $id("motivateBtn");
  const out = $id("motivationOutput");
  const chips = document.querySelectorAll(".chip");

  if(btn && out) btn.addEventListener("click", ()=> out.innerText = getRandomFrom(Object.values(MOTIVATIONS).flat()));
  if(chips && chips.length) chips.forEach(c => c.addEventListener("click", ()=> {
    const cat = c.getAttribute("data-category"); if(MOTIVATIONS[cat]) out.innerText = getRandomFrom(MOTIVATIONS[cat]);
  }));

  const dailyBtn = $id("dailyBtn"); const dailyText = $id("dailyText");
  if(dailyBtn && dailyText) dailyBtn.addEventListener("click", ()=> dailyText.innerText = getRandomFrom(Object.values(MOTIVATIONS).flat()));
}

/* PRAYER ENGINE */
function setupPrayerEngine(){
  const prayers = {
    strength: "Lord, grant me strength in this moment to choose what is right. Amen.",
    clarity: "God, bring clarity and peace to my mind. Help me walk in truth.",
    forgiveness: "Lord, forgive me for the times I failed and help me rise."
  };

  const listBtns = document.querySelectorAll(".list-btn[data-prayer]");
  const out = $id("prayerOutput");
  if(listBtns && listBtns.length && out){
    listBtns.forEach(b => b.addEventListener("click", ()=> out.innerText = prayers[b.getAttribute("data-prayer")] || "Prayer not available."));
  }

  const saveBtn = $id("savePrayer");
  if(saveBtn){
    saveBtn.addEventListener("click", ()=>{
      const txt = $id("customPrayer").value.trim();
      if(!txt) return alert("Write a short prayer to save.");
      const list = JSON.parse(localStorage.getItem("fm_prayers")||"[]");
      list.unshift({text: txt, time: new Date().toISOString()});
      localStorage.setItem("fm_prayers", JSON.stringify(list));
      renderSavedPrayers();
      $id("customPrayer").value = "";
    });
    renderSavedPrayers();
  }

  function renderSavedPrayers(){
    const holder = $id("savedPrayers");
    if(!holder) return;
    const list = JSON.parse(localStorage.getItem("fm_prayers")||"[]");
    holder.innerHTML = "";
    list.forEach(p => {
      const el = document.createElement("div");
      el.className = "list-btn";
      el.innerText = p.text + " — " + new Date(p.time).toLocaleString();
      el.addEventListener("click", ()=> { const outEl = $id("prayerOutput"); if(outEl) outEl.innerText = p.text; });
      holder.appendChild(el);
    });
  }
}

/* TRACKER */
function setupTracker(){
  const save = $id("saveChecklist"), status = $id("trackerStatus"), historyHolder = $id("trackerHistory");
  if(save){
    save.addEventListener("click", ()=> {
      const chk1 = $id("chk1") ? $id("chk1").checked : false;
      const chk2 = $id("chk2") ? $id("chk2").checked : false;
      const chk3 = $id("chk3") ? $id("chk3").checked : false;
      const record = { date: new Date().toISOString(), items: [chk1, chk2, chk3] };
      const data = JSON.parse(localStorage.getItem("fm_tracker")||"[]");
      data.unshift(record);
      localStorage.setItem("fm_tracker", JSON.stringify(data));
      if(status) status.innerText = "Saved ✓";
      renderTrackerHistory();
      setTimeout(()=>{ if(status) status.innerText=""; },2000);
    });
    renderTrackerHistory();
  }
  function renderTrackerHistory(){
    if(!historyHolder) return;
    const data = JSON.parse(localStorage.getItem("fm_tracker")||"[]");
    historyHolder.innerHTML = data.map(r => {
      const d = new Date(r.date).toLocaleString();
      const items = r.items.map(v=> v? "✓":"✗").join(" ");
      return `<div style="margin-bottom:8px"><strong>${d}</strong><br>Items: ${items}</div>`;
    }).join("");
  }
}

/* STREAK */
function setupStreak(){
  const countEl = $id("streakCount"), checkIn = $id("checkIn"), resetBtn = $id("resetStreak");
  let data = JSON.parse(localStorage.getItem("fm_streak")||"{}"); if(!data.last) data={last:null,count:0};
  if(countEl) countEl.innerText = `${data.count||0} days`;
  if(checkIn) checkIn.addEventListener("click", ()=>{
    const today = new Date().toDateString();
    if(data.last===today) return alert("You already checked in today. Well done!");
    const lastDate = data.last ? new Date(data.last) : null;
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
    if(lastDate && lastDate.toDateString()===yesterday.toDateString()) data.count=(data.count||0)+1; else data.count=1;
    data.last = today; localStorage.setItem("fm_streak", JSON.stringify(data));
    if(countEl) countEl.innerText = `${data.count} days`; alert("Nice! Streak updated.");
  });
  if(resetBtn) resetBtn.addEventListener("click", ()=> { localStorage.setItem("fm_streak", JSON.stringify({last:null,count:0})); if(countEl) countEl.innerText="0 days"; alert("Streak reset."); });
}

/* GOALS */
function setupGoals(){
  const addBtn = $id("addGoal"), input = $id("goalInput"), listEl = $id("goalList");
  if(addBtn && input){
    addBtn.addEventListener("click", ()=>{
      const txt = input.value.trim(); if(!txt) return alert("Write a short goal.");
      const list = JSON.parse(localStorage.getItem("fm_goals")||"[]"); list.unshift({text:txt,done:false,time:new Date().toISOString()});
      localStorage.setItem("fm_goals", JSON.stringify(list)); input.value=""; renderGoals();
    });
    renderGoals();
  }
  function renderGoals(){
    if(!listEl) return;
    const list = JSON.parse(localStorage.getItem("fm_goals")||"[]");
    listEl.innerHTML = list.map((g,i)=> {
      const done = g.done ? "✓" : "";
      return `<div style="margin-bottom:8px"><button data-index="${i}" class="list-btn goal-btn">${done} ${escapeHtml(g.text)}</button><button data-index="${i}" class="list-btn small remove-goal">Delete</button></div>`;
    }).join("");
    document.querySelectorAll(".goal-btn").forEach(b=> b.addEventListener("click", ()=>{
      const i = parseInt(b.getAttribute("data-index")); const list = JSON.parse(localStorage.getItem("fm_goals")||"[]"); if(list[i]) list[i].done=!list[i].done; localStorage.setItem("fm_goals", JSON.stringify(list)); renderGoals();
    }));
    document.querySelectorAll(".remove-goal").forEach(b=> b.addEventListener("click", ()=>{
      const i = parseInt(b.getAttribute("data-index")); const list = JSON.parse(localStorage.getItem("fm_goals")||"[]"); list.splice(i,1); localStorage.setItem("fm_goals", JSON.stringify(list)); renderGoals();
    }));
  }
}

/* VERSES */
const VERSES = [
  "1 Corinthians 10:13 — No temptation has overtaken you except what is common to man...",
  "Philippians 4:13 — I can do all things through Christ who strengthens me.",
  "Psalm 46:1 — God is our refuge and strength, an ever-present help in trouble.",
  "James 4:7 — Submit yourselves therefore to God. Resist the devil, and he will flee from you."
];
function setupVerses(){ const btn = $id("verseBtn"), out = $id("verseOutput"); if(btn && out) btn.addEventListener("click", ()=> out.innerText = getRandomFrom(VERSES)); }

/* EMERGENCY */
function setupEmergency(){
  const breathBtn = $id("startBreath"), openMotBtn = $id("openMotivation"), status = $id("emergencyStatus");
  if(openMotBtn) openMotBtn.addEventListener("click", ()=> window.location.href = "motivation.html");
  if(breathBtn) breathBtn.addEventListener("click", ()=>{
    let cycles = 8; if(status) status.innerText = "Breathing: 8 breaths — follow the prompt...";
    let i=0; const timer = setInterval(()=>{ i++; if(i>cycles){ clearInterval(timer); if(status) status.innerText="Breathing complete. You did great."; return; } if(status) status.innerText = `Breath ${i} of ${cycles}: Inhale 4s — hold 2s — exhale 6s`; },7000);
  });
}

/* AUDIO */
function setupAudio(){
  const player = $id("player");
  const listBtns = document.querySelectorAll(".list-btn[data-src]");
  if(!player || !listBtns.length){
    document.querySelectorAll("#audioList .list-btn").forEach((b,i)=> b.addEventListener("click", ()=> alert("Audio not configured. Add MP3 links to data-src attribute.")));
    return;
  }
  listBtns.forEach(btn=> btn.addEventListener("click", ()=> {
    const src = btn.getAttribute("data-src"); if(src){ player.src = src; player.play(); } else alert("No audio source set for this affirmation.");
  }));
}

/* PROFILE & JOURNAL */
function setupProfileJournal(){
  const saveBtn = $id("saveJournalBtn"), box = $id("journalBox"), holder = $id("journalEntries");
  if(saveBtn && box){
    saveBtn.addEventListener("click", ()=> {
      const txt = box.value.trim(); if(!txt) return alert("Write something to save.");
      const list = JSON.parse(localStorage.getItem("fm_journal")||"[]"); list.unshift({text:txt,time:new Date().toISOString()}); localStorage.setItem("fm_journal", JSON.stringify(list)); box.value=""; renderJournal();
    });
    renderJournal();
  }
  function renderJournal(){ if(!holder) return; const list = JSON.parse(localStorage.getItem("fm_journal")||"[]"); holder.innerHTML = list.map(e=> `<div style="margin-bottom:12px"><strong>${new Date(e.time).toLocaleString()}</strong><p>${escapeHtml(e.text)}</p></div>`).join(""); }
}

/* MAP safe loader */
function setupMapSafe(){
  const view = $id("viewDiv"); if(!view) return;
  if(typeof require === "function" && window.hasOwnProperty("require")){
    try{ require(["esri/Map","esri/views/MapView"], function(Map, MapView){ const map = new Map({ basemap: "streets" }); new MapView({ container: "viewDiv", map: map, center: [36.8219, -1.2921], zoom: 6 }); }); }
    catch(e){ console.warn("ArcGIS require failed:", e); view.innerHTML = "<p class='muted'>Map library not available.</p>"; }
  } else { view.innerHTML = "<p class='muted'>Map will load when ArcGIS library is available (optional).</p>"; }
}

/* helpers */
function escapeHtml(str){ if(!str) return ""; return str.replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; }); }
<div id="voice-controls" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: white; padding: 10px 20px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
    <button onclick="playAudio()">🔊 Play</button>
    <button onclick="pauseAudio()">⏸ Pause</button>
    <button onclick="stopAudio()">⏹ Stop</button>
</div>
