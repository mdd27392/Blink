// Blink-ui.js
// Handles focus word list, selection, and per-day storage

(function () {
  const STORAGE_KEY_PREFIX = "blink-focus-";
  const WORDS = [
    "Breathe",
    "Begin",
    "Flow",
    "Focus",
    "Create",
    "Listen",
    "Present",
    "Start",
    "Simplify",
    "Center",
    "Finish",
    "Notice",
    "Steady",
    "Courage",
    "Soft",
    "Patience",
    "Trust",
    "Light",
    "Calm",
    "Explore",
    "Learn",
    "Move",
    "Pause",
    "Grateful",
    "Gentle",
    "Shape",
    "Quiet",
    "Grow",
    "Return",
    "Align"
  ];

  function todayKey() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${STORAGE_KEY_PREFIX}${yyyy}-${mm}-${dd}`;
  }

  function loadToday() {
    try {
      const raw = localStorage.getItem(todayKey());
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn("Failed to parse stored Blink state:", e);
      return null;
    }
  }

  function saveToday(state) {
    try {
      localStorage.setItem(todayKey(), JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save Blink state:", e);
    }
  }

  function pickRandomWord(excludingWord) {
    if (WORDS.length === 0) return "Focus";
    const pool = excludingWord
      ? WORDS.filter((w) => w !== excludingWord)
      : WORDS.slice();
    if (pool.length === 0) return excludingWord;
    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }

  function formatDate() {
    const d = new Date();
    const opts = { month: "short", day: "numeric" };
    return d.toLocaleDateString(undefined, opts);
  }

  function updateBlinkCountLabel(el, count) {
    if (!el) return;
    if (!count || count <= 0) {
      el.textContent = "0 blinks";
      return;
    }
    el.textContent = count === 1 ? "1 blink" : `${count} blinks`;
  }

  function initBlink() {
    const focusWordEl = document.getElementById("focus-word");
    const focusTaglineEl = document.getElementById("focus-tagline");
    const blinkBtn = document.getElementById("blink-btn");
    const dateLabelEl = document.getElementById("date-label");
    const countEl = document.getElementById("blink-count");

    if (!focusWordEl || !blinkBtn || !dateLabelEl) {
      console.warn("Blink UI elements missing");
      return;
    }

    dateLabelEl.textContent = formatDate();

    let state = loadToday();
    if (!state || !state.word) {
      state = {
        word: pickRandomWord(),
        count: 0
      };
      saveToday(state);
    }

    focusWordEl.textContent = state.word;
    updateBlinkCountLabel(countEl, state.count);
    focusTaglineEl.textContent = "Tap Blink whenever you want to reset your attention.";

    blinkBtn.addEventListener("click", () => {
      const newWord = pickRandomWord(state.word);
      state.word = newWord;
      state.count = (state.count || 0) + 1;
      focusWordEl.textContent = newWord;
      focusWordEl.classList.remove("blink-animate");
      void focusWordEl.offsetWidth;
      focusWordEl.classList.add("blink-animate");
      updateBlinkCountLabel(countEl, state.count);
      saveToday(state);
    });
  }

  function injectAnimation() {
    const style = document.createElement("style");
    style.textContent = `
      .blink-animate {{
        animation: blink-pop 260ms ease-out;
      }}
      @keyframes blink-pop {{
        0% {{ transform: translateY(4px) scale(0.96); opacity: 0.0; }}
        60% {{ transform: translateY(0) scale(1.02); opacity: 1; }}
        100% {{ transform: translateY(0) scale(1); opacity: 1; }}
      }}
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      injectAnimation();
      initBlink();
    });
  } else {
    injectAnimation();
    initBlink();
  }
})();
