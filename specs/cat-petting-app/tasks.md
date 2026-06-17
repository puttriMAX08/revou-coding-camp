# Implementation Plan: Cat Petting App

## Overview

Build a single `index.html` file delivering a cat clicker app using inline SVG, Tailwind CSS (CDN), and vanilla JavaScript. Implementation is broken into focused coding steps that build incrementally — scaffolding first, then the cat, then interactivity, then persistence, then polish. Property-based tests (fast-check + Vitest) validate the core logic functions extracted into a testable module.

---

## Tasks

- [x] 1. HTML scaffolding and Tailwind setup
  - Create `index.html` with valid HTML5 boilerplate (`<!DOCTYPE html>`, `<html lang="en">`, `<head>`, `<body>`)
  - Add `<meta charset="UTF-8">` and `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  - Load Tailwind CSS via CDN `<script src="https://cdn.tailwindcss.com"></script>`
  - Apply soft pastel lavender background to `<body>` using Tailwind `bg-[#e9e4f0]` or equivalent
  - Add a centered flex container (`min-h-screen flex flex-col items-center justify-center`) as the main layout wrapper
  - Add section comment blocks for: Layout, Cat Drawing, Counter Logic, Particle System, Milestones, LocalStorage
  - _Requirements: 7.1, 7.3, 7.5, 8.1, 8.2, 8.3_

- [x] 2. Cat SVG element
  - [x] 2.1 Implement the inline SVG cat
    - Create a `<div id="cat">` wrapper with `cursor-pointer` Tailwind class
    - Draw a minimalist cat inside the `<svg>` element: head (circle/ellipse), ears (triangles), eyes (small circles), nose (tiny triangle or dot), whiskers (lines), and a simple mouth curve
    - Size the SVG responsively (e.g., `w-48 h-48` with `viewBox`) so it is fully visible from 320px to 1920px
    - Center the cat wrapper within the layout container
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 2.2 Write unit test — SVG presence and cursor style
    - Set up the Vitest test environment with jsdom
    - Verify the `#cat` wrapper element exists in the DOM
    - Verify the SVG child is present inside `#cat`
    - Verify the `cursor-pointer` class (or equivalent `cursor: pointer` style) is applied to `#cat`
    - _Requirements: 2.1, 2.3_

- [x] 3. Pet counter display
  - [x] 3.1 Implement counter display element and initial render
    - Add a `<p id="counter">` element above the cat displaying "Pets Given: 0" on load
    - Apply prominent styling (large text, soft pink accent color, centered) via Tailwind classes
    - Implement `updateCounterDisplay()` — sets `counterEl.textContent` to `"Pets Given: " + petCount`
    - Call `updateCounterDisplay()` once during initialization
    - _Requirements: 1.1, 1.3_

  - [ ] 3.2 Write property test for counter display (Property 2)
    - **Property 2: Counter display always reflects current state**
    - **Validates: Requirements 1.3**
    - For any integer 0–1,000,000 assigned to `petCount`, calling `updateCounterDisplay()` must make the counter DOM element's `textContent` include that exact numeric value as a string
    - Use `fc.integer({ min: 0, max: 1_000_000 })` as the arbitrary
    - Run minimum 100 iterations

- [x] 4. Click handler, counter increment, and squish animation
  - [x] 4.1 Implement click handler and `incrementAndSave()`
    - Attach a `click` event listener to `#cat`
    - Implement `incrementAndSave()`: increment `petCount` by 1, call `saveCount(petCount)`, call `updateCounterDisplay()`, call `triggerSquish()`, call `spawnParticle(x, y)`, call `applyMilestone(petCount)`
    - Pass `event.clientX` / `event.clientY` from the click event into `spawnParticle`
    - _Requirements: 1.2, 1.3_

  - [x]* 4.2 Write property test for click increment (Property 1)
    - **Property 1: Click increments counter by exactly one**
    - **Validates: Requirements 1.2**
    - For any starting `petCount` from 0–1,000,000, calling `incrementAndSave()` must result in `petCount === startCount + 1`
    - Use `fc.integer({ min: 0, max: 1_000_000 })` as the arbitrary
    - Run minimum 100 iterations

  - [x] 4.3 Implement `triggerSquish()` and squish CSS keyframe
    - Define `@keyframes squish` in the `<style>` block:
      - `0% { transform: scale(1); }`
      - `30% { transform: scale(1.15, 0.85); }`
      - `60% { transform: scale(0.9, 1.1); }`
      - `100% { transform: scale(1); }`
    - Define `.squish { animation: squish 300ms ease forwards; }` CSS rule
    - Implement `triggerSquish()`: add `.squish` class to `#cat`; remove it after 300ms via `setTimeout`
    - _Requirements: 3.1, 3.2, 3.3_

  - [x]* 4.4 Write unit tests for squish animation
    - Verify `.squish` class is added to `#cat` immediately after `triggerSquish()` is called
    - Verify `.squish` class is removed from `#cat` after 300ms (use Vitest fake timers via `vi.useFakeTimers()`)
    - _Requirements: 3.1, 3.2, 3.3_

- [x] 5. LocalStorage persistence
  - [x] 5.1 Implement `loadCount()` and `saveCount()`
    - Define `const STORAGE_KEY = "cat_pet_count"`
    - Implement `loadCount()`:
      - Call `localStorage.getItem(STORAGE_KEY)`
      - Parse with `parseInt(raw, 10)`
      - Return parsed value only if `Number.isFinite(parsed) && parsed >= 0`, otherwise return `0`
      - Wrap entire body in `try/catch`; return `0` on any exception
    - Implement `saveCount(n)`: call `localStorage.setItem(STORAGE_KEY, String(n))` wrapped in `try/catch`; silently swallow errors
    - On page load, call `loadCount()` to initialize `petCount`, then call `updateCounterDisplay()` and `applyMilestone(petCount)`
    - _Requirements: 1.4, 1.5, 6.1, 6.2, 6.3_

  - [x]* 5.2 Write property test for localStorage round-trip (Property 3)
    - **Property 3: localStorage round-trip preserves pet count**
    - **Validates: Requirements 1.4, 6.1, 6.2**
    - For any integer 0–1,000,000, `saveCount(n)` followed by `loadCount()` must return the same value `n`
    - Use `fc.integer({ min: 0, max: 1_000_000 })` as the arbitrary
    - Run minimum 100 iterations

  - [x]* 5.3 Write property test for invalid localStorage fallback (Property 4)
    - **Property 4: Invalid localStorage values fall back to zero**
    - **Validates: Requirements 1.5, 6.3**
    - For any value from the set: `null`, `""`, `"NaN"`, `"-1"`, and arbitrary non-numeric/negative strings, `loadCount()` must return exactly `0`
    - Use `fc.oneof(fc.constant(null), fc.constant(""), fc.constant("NaN"), fc.constant("-1"), fc.string().filter(s => isNaN(parseInt(s, 10)) || parseInt(s, 10) < 0))` as the arbitrary
    - Run minimum 100 iterations

- [x] 6. Checkpoint — core loop complete
  - Ensure all tests pass; ask the user if any questions arise
  - Manually verify: clicking the cat increments the counter, squish plays, value persists on page reload

- [x] 7. Particle system
  - [x] 7.1 Implement `spawnParticle(x, y)` and particle CSS
    - Define `@keyframes floatFade` in the `<style>` block:
      - `0% { transform: translateY(0); opacity: 1; }`
      - `100% { transform: translateY(-80px); opacity: 0; }`
    - Define `.particle { animation: floatFade 1000ms ease forwards; position: fixed; pointer-events: none; }` CSS rule
    - Implement `spawnParticle(x, y)`:
      - Create `<span class="particle">`
      - Set `style.left` to `x + "px"` and `style.top` to `y + "px"`
      - Set `textContent` to a random pick from `["Meow!", "Purr...", "❤️", "✨"]` using `Math.random()`
      - Append element to `document.body`
      - Attach an `animationend` listener that calls `el.remove()`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x]* 7.2 Write property test for particle text (Property 6)
    - **Property 6: Particle text is always from the allowed set**
    - **Validates: Requirements 4.2**
    - For any `(x, y)` coordinate pair, the `textContent` of the spawned particle must be a member of `["Meow!", "Purr...", "❤️", "✨"]`
    - Use `fc.integer({ min: 0, max: 1000 })` for both `x` and `y`
    - Run minimum 100 iterations

  - [x]* 7.3 Write property test for particle position (Property 7)
    - **Property 7: Particle position reflects click coordinates**
    - **Validates: Requirements 4.1**
    - For any `(x, y)` coordinates passed to `spawnParticle`, `parseInt(particle.style.left)` and `parseInt(particle.style.top)` must each be within 20px of the input coordinates
    - Use `fc.integer({ min: 0, max: 1000 })` for both `x` and `y`
    - Run minimum 100 iterations

  - [x]* 7.4 Write property test for particle DOM cleanup (Property 8)
    - **Property 8: Particle is removed from DOM after animationend**
    - **Validates: Requirements 4.4**
    - For any `(x, y)` coordinates, after calling `spawnParticle(x, y)` and dispatching `new Event("animationend")` on the spawned element, `document.body.contains(particle)` must return `false`
    - Use `fc.integer({ min: 0, max: 500 })` for both `x` and `y`
    - Run minimum 100 iterations

- [x] 8. Milestone system
  - [x] 8.1 Implement `applyMilestone(count)` and milestone CSS classes
    - Define in JS: `const MILESTONES = [{ threshold: 50, class: "milestone-1" }, { threshold: 100, class: "milestone-2" }, { threshold: 200, class: "milestone-3" }]`
    - Implement `applyMilestone(count)`:
      - Remove all milestone classes from `document.body.classList`
      - Find the highest entry in `MILESTONES` where `count >= threshold`
      - If one exists, add its class to `document.body`
    - Write CSS rules for each milestone class on `body`:
      - `body.milestone-1`: background shifts to warm peach (`#ffd6b0` or similar)
      - `body.milestone-2`: background shifts to soft mint (`#b0f0d6` or similar); cat gains a happy glow via `filter: drop-shadow(0 0 12px #86efac)`
      - `body.milestone-3`: background becomes golden (`#ffe066` or similar); cat gains a sparkle/crown accent element
    - Add `transition: background-color 0.6s ease` to `body` for smooth milestone transitions
    - Call `applyMilestone(petCount)` on page load (after `loadCount`) and on every click
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x]* 8.2 Write property test for milestone class application (Property 5)
    - **Property 5: Milestone class applied correctly for all counts**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
    - For any integer 0–500, `applyMilestone(count)` must result in exactly one (or zero) milestone class on `<body>` matching the correct threshold range:
      - 0–49: no milestone class present
      - 50–99: only `milestone-1` present
      - 100–199: only `milestone-2` present
      - 200+: only `milestone-3` present
    - No two milestone classes may coexist on `<body>` at any time
    - Use `fc.integer({ min: 0, max: 500 })` as the arbitrary
    - Run minimum 100 iterations

- [x] 9. Visual design, layout polish, and responsiveness
  - [x] 9.1 Finalize visual styling and responsive layout
    - Apply soft pink accent color to the counter text (Tailwind `text-pink-400` or `text-[#f9a8d4]`)
    - Verify centered layout works at 320px and 1920px viewport widths using Tailwind responsive utilities
    - Add hover effect on `#cat` (e.g., `hover:scale-105 transition-transform duration-150`) for interactivity delight
    - Style particle `<span>` elements with readable font size and weight (e.g., `text-lg font-bold` via additional CSS rule)
    - Confirm `transition: background-color 0.6s ease` on `body` produces smooth milestone background changes
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 10. Code comments and final code quality pass
  - [x] 10.1 Add section comments throughout `index.html`
    - Add clear inline comment headers for each logical section:
      - `<!-- === LAYOUT === -->`
      - `<!-- === CAT DRAWING === -->`
      - `<!-- === COUNTER LOGIC === -->`
      - `<!-- === PARTICLE SYSTEM === -->`
      - `<!-- === MILESTONES === -->`
      - `<!-- === LOCALSTORAGE === -->`
    - Add brief inline JS comments above each function explaining its purpose and parameters
    - Verify the file opens and runs correctly in a browser with no build tools, package managers, or local server
    - _Requirements: 8.1, 8.2, 8.3_

- [x] 11. Final checkpoint — all tests pass
  - Ensure all automated tests pass; ask the user if any questions arise
  - Manually open `index.html` in a browser and verify:
    - Counter initializes correctly from localStorage on reload
    - Clicking the cat triggers squish animation + particle spawn + counter increment simultaneously
    - Milestones at 50, 100, and 200 visually change the page background and cat appearance
    - Layout is usable and visually appealing at narrow (320px) and wide (1920px) viewports

---

## Notes

- Tasks marked with `*` are property-based or unit tests and can be skipped for a faster MVP build
- All property-based tests use [fast-check](https://fast-check.io/) and [Vitest](https://vitest.dev/) — the pure logic functions (`loadCount`, `saveCount`, `applyMilestone`, `updateCounterDisplay`, `incrementAndSave`, `spawnParticle`) should be exported or otherwise made importable by the test file
- Each property test includes a comment referencing the exact property number from `design.md` in the format: `// Feature: cat-petting-app, Property {N}: {property_text}`
- Milestones use CSS classes on `<body>` so all child elements can react via CSS descendant selectors without additional JS
- The `animationend` cleanup approach (Property 8) means particles are self-cleaning — no timers or arrays needed
- `localStorage` errors (e.g., private browsing with storage blocked) are caught silently; the counter still works in-memory for the session

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1"] },
    { "id": 2, "tasks": ["2.2", "3.1"] },
    { "id": 3, "tasks": ["3.2", "4.1"] },
    { "id": 4, "tasks": ["4.2", "4.3"] },
    { "id": 5, "tasks": ["4.4", "5.1"] },
    { "id": 6, "tasks": ["5.2", "5.3", "6"] },
    { "id": 7, "tasks": ["7.1"] },
    { "id": 8, "tasks": ["7.2", "7.3", "7.4", "8.1"] },
    { "id": 9, "tasks": ["8.2", "9.1"] },
    { "id": 10, "tasks": ["10.1"] },
    { "id": 11, "tasks": ["11"] }
  ]
}
```
