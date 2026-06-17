// cat-logic.js
// Extracted pure logic functions for testability.
// The app's main state and core functions live here so they can be imported
// by the Vitest test suite without requiring a browser or bundler.

// =====================================================================
// === STATE ===
// =====================================================================

// Single source of truth for the pet count
export let petCount = 0;

// Reference to the counter DOM element.
// In test environments (jsdom) this is set via setCounterEl().
// In the browser, index.html sets this via document.getElementById("counter").
let counterEl = null;

/**
 * setCounterEl(el)
 * Injects the DOM element reference used by updateCounterDisplay().
 * Called from tests to wire up jsdom elements, and from index.html on load.
 */
export function setCounterEl(el) {
  counterEl = el;
}

/**
 * setPetCount(n)
 * Directly sets petCount to a given value.
 * Used in tests to set up state before calling updateCounterDisplay().
 */
export function setPetCount(n) {
  petCount = n;
}

// =====================================================================
// === COUNTER LOGIC ===
// =====================================================================

/**
 * updateCounterDisplay()
 * Syncs the counter element's textContent to the current petCount value.
 * Format: "Pets Given: <petCount>"
 * Called on init and after every click.
 */
export function updateCounterDisplay() {
  if (counterEl) {
    counterEl.textContent = "Pets Given: " + petCount;
  }
}

// =====================================================================
// === LOCALSTORAGE ===
// =====================================================================

export const STORAGE_KEY = "cat_pet_count";

/**
 * loadCount()
 * Reads and validates the stored pet count from localStorage.
 * Returns a non-negative integer, or 0 as fallback.
 */
export function loadCount() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch (e) {
    return 0;
  }
}

/**
 * saveCount(n)
 * Persists n to localStorage. Silently swallows errors (e.g. private browsing).
 */
export function saveCount(n) {
  try {
    localStorage.setItem(STORAGE_KEY, String(n));
  } catch (e) {
    // Storage unavailable; continue without persistence
  }
}

/**
 * incrementAndSave()
 * Increments petCount by 1, saves to localStorage, and syncs the counter display.
 * Browser-only side effects (triggerSquish, spawnParticle, applyMilestone) are
 * handled by the click handler in index.html, not here.
 */
export function incrementAndSave() {
  petCount += 1;
  saveCount(petCount);
  updateCounterDisplay();
}

// =====================================================================
// === SQUISH ANIMATION ===
// =====================================================================

// Reference to the cat DOM element.
// In test environments (jsdom) this is set via setCatEl().
// In the browser, index.html uses document.getElementById("cat") directly.
let catEl = null;

/**
 * setCatEl(el)
 * Injects the cat DOM element reference used by triggerSquish().
 * Called from tests to wire up jsdom elements.
 */
export function setCatEl(el) {
  catEl = el;
}

/**
 * triggerSquish()
 * Adds the .squish CSS class to the cat element to play the squish keyframe
 * animation, then removes it after 300ms so the animation can be re-triggered.
 * Requirements: 3.1, 3.2, 3.3
 */
export function triggerSquish() {
  if (!catEl) return;
  catEl.classList.add("squish");
  setTimeout(function () {
    catEl.classList.remove("squish");
  }, 300);
}

// =====================================================================
// === MILESTONE SYSTEM ===
// =====================================================================

/**
 * MILESTONES
 * Static ordered array of milestone thresholds and their corresponding CSS class names.
 * Exported so tests can import and verify milestone logic without hard-coding values.
 */
export const MILESTONES = [
  { threshold: 50,  class: "milestone-1" },
  { threshold: 100, class: "milestone-2" },
  { threshold: 200, class: "milestone-3" },
];

/**
 * applyMilestone(count)
 * Removes all milestone classes from document.body, then adds the CSS class
 * for the highest milestone whose threshold is <= count (if any).
 * Requirements: 5.1, 5.2, 5.3, 5.4
 *
 * @param {number} count - current pet count
 */
export function applyMilestone(count) {
  // Remove all existing milestone classes
  for (const m of MILESTONES) {
    document.body.classList.remove(m.class);
  }

  // Find the highest applicable milestone (iterate in reverse to get highest first)
  let applicable = null;
  for (let i = MILESTONES.length - 1; i >= 0; i--) {
    if (count >= MILESTONES[i].threshold) {
      applicable = MILESTONES[i];
      break;
    }
  }

  // Apply the milestone class if one was found
  if (applicable) {
    document.body.classList.add(applicable.class);
  }
}

// =====================================================================
// === PARTICLE SYSTEM ===
// =====================================================================

/**
 * The set of text strings a particle can display.
 * Exported so tests can verify membership without hard-coding the list.
 */
export const PARTICLE_TEXTS = ["Meow!", "Purr...", "❤️", "✨"];

/**
 * spawnParticle(x, y)
 * Creates a <span class="particle"> at the given fixed position, picks a
 * random text from PARTICLE_TEXTS, appends it to document.body, and
 * attaches an animationend listener that removes the element.
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 *
 * @param {number} x - click clientX (pixels from left)
 * @param {number} y - click clientY (pixels from top)
 */
export function spawnParticle(x, y) {
  const el = document.createElement("span");
  el.className = "particle";
  el.style.left = x + "px";
  el.style.top  = y + "px";
  el.textContent = PARTICLE_TEXTS[Math.floor(Math.random() * PARTICLE_TEXTS.length)];
  document.body.appendChild(el);
  el.addEventListener("animationend", function () {
    el.remove();
  });
}
