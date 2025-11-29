/* FreeMind app.js
   - Handles simple navigation (fetch into #appContainer)
   - Adds voiceSpeak / voiceStop APIs using SpeechSynthesis
   - Hooks per-page buttons when present
*/

(function () {
  "use strict";

  // --- Voice system (global) ---
  const synth = window.speechSynthesis;
  let currentUtterance = null;
  window.voiceSpeak = function (text) {
    if (!text) return;
    try {
      window.voiceStop(); // stop any existing
      currentUtterance = new SpeechSynthesisUtterance(String(text));
      // choose default voice and rate for clarity
      currentUtterance.rate = 1;
      currentUtterance.pitch = 1;
      currentUtterance.lang = 'en-US';
      synth.speak(currentUtterance);
    } catch (err) {
      console.warn("Voice error", err);
    }
  };
  window.voiceStop = function () {
    try {
      if (synth.speaking) synth.cancel();
    } catch (e) {}
  };

  // Toggle voice UI button if on page shell
  function initVoiceToggle() {
    const btn = document.getElementById('voiceToggle');
    if (!btn) return;
    btn.onclick = () => {
      // toggle speak mode: just announce current page
      const title = document.querySelector('h1') ? document.querySelector('h1').innerText : document.title;
      window.voiceSpeak(title + ". Voice mode active.");
    };
  }

  // --- Simple navigation: load page into #appContainer if exists ---
  async function loadPage(url, pushState=true) {
    try {
      const el = document.getElementById('appContainer');
      if (!el) {
        // If runtime is not single-shell, just navigate
        window.location.href = url;
        return;
      }
      const res = await fetch(url, {cache: "no-store"});
      if (!res.ok) throw new Error('Fetch failed: ' + res.status);
      let html = await res.text();
      // If returned HTML contains <body>, try to extract the main container content
      // we will extract everything inside <body>...</body> for quick insert
      const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      html = m ? m[1] : html;
      el.innerHTML = html;
      if (pushState) history.pushState({page:url}, '', url);
      // run per-page inline scripts by re-executing any <script> tags within inserted content
      const scripts = el.querySelectorAll('script');
      scripts.forEach(s => {
        const ns = document.createElement('script');
        if (s.src) ns.src = s.src;
        else ns.textContent = s.textContent;
        document.body.appendChild(ns).parentNode.removeChild(ns);
      });
      // after load: initialize voice toggle (if exists), and small hookup
      initVoiceToggle();
    } catch (err) {
      console.error("Page load error:", err);
      window.voiceSpeak("Sorry, that page failed to load.");
      // fallback: navigate directly
      window.location.href = url;
    }
  }

  // attach nav links (delegation)
  function attachNav() {
    document.addEventListener('click', function (e) {
      const a = e.target.closest && e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href) return;
      // if link is external leave it
      if (/^https?:\/\//i.test(href) || href.startsWith('mailto:')) return;
      // if link points to an anchor on same page let it be
      if (href.startsWith('#')) return;
      // intercept internal html page loads to fetch into container
      e.preventDefault();
      loadPage(href);
    });
  }

  // Small init for standalone pages: run any functions on DOMContentLoaded
  function runOnLoad() {
    document.dispatchEvent(new Event('app-ready'));
  }

  // On back/forward, handle single-shell history
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) loadPage(e.state.page, false);
  });

  document.addEventListener('DOMContentLoaded', function () {
    attachNav();
    initVoiceToggle();
    runOnLoad();
    // small hookup: when page has element with id 'playAll', its click will start speech of main text
    const playBtns = document.querySelectorAll('[data-read]');
    playBtns.forEach(b => b.onclick = () => window.voiceSpeak(document.querySelector(b.dataset.read).innerText));
  });

  // Expose a convenience: if scripts want to fetch pages programmatically
  window.FreeMind = { loadPage };

})();
