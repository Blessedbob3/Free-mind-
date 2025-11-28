/* ===============================
   FREEMIND APP - MAIN APP.JS
   Optimized Version (2025)
================================= */

document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {
  console.log("✅ FreeMind App is starting...");

  try {
    await loadUserData();
    await loadMap();
    setupButtons();
    setupNavigation();
  } catch (error) {
    console.error("❌ App failed to load:", error);
  }
}

/* -------------------------------
      LOAD USER DATA
--------------------------------*/
async function loadUserData() {
  console.log("📥 Loading user data...");

  const user = localStorage.getItem("freemindUser");

  if (user) {
    const userData = JSON.parse(user);
    console.log("👤 User loaded:", userData.username);
    document.getElementById("usernameDisplay").innerText = userData.username;
  } else {
    console.log("⚠️ No user found. Guest mode.");
  }
}

/* -------------------------------
      LOAD ARCGIS MAP
--------------------------------*/
async function loadMap() {
  console.log("🗺️ Loading map...");

  require([
    "esri/Map",
    "esri/views/MapView"
  ], function (Map, MapView) {

    const map = new Map({
      basemap: "dark-gray"
    });

    const view = new MapView({
      container: "viewDiv",
      map: map,
      zoom: 5,
      center: [37.9062, 0.0236] // Kenya Default
    });

    console.log("✅ Map loaded successfully");
  });
}

/* -------------------------------
       BUTTON CONTROLS
--------------------------------*/
function setupButtons() {

  const saveBtn = document.getElementById("saveProgress");
  const resetBtn = document.getElementById("resetProgress");

  if (saveBtn) {
    saveBtn.addEventListener("click", saveProgress);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", resetApp);
  }
}

/* -------------------------------
      SAVE PROGRESS
--------------------------------*/
function saveProgress() {
  const progress = {
    streak: 7,
    updated: new Date().toISOString()
  };

  localStorage.setItem("freemindProgress", JSON.stringify(progress));
  alert("✅ Progress saved!");
}

/* -------------------------------
      RESET APP
--------------------------------*/
function resetApp() {
  localStorage.clear();
  alert("App has been reset.");
  location.reload();
}

/* -------------------------------
       PAGE NAVIGATION
--------------------------------*/
function setupNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      loadPage(link.getAttribute("href"));
    });
  });
}

async function loadPage(page) {
  try {
    const res = await fetch(page);
    const data = await res.text();
    document.getElementById("appContainer").innerHTML = data;
    console.log(`✅ ${page} loaded`);
  } catch (err) {
    console.error("❌ Page load failed:", err);
  }
}