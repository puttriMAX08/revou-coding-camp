// Unit tests for task 4.4 — Squish animation
// Validates: Requirements 3.1, 3.2, 3.3

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { setCatEl, triggerSquish } from "../cat-logic.js";

describe("triggerSquish() — squish animation (Requirements 3.1, 3.2, 3.3)", () => {
  let catEl;

  beforeEach(() => {
    // Create a jsdom div to act as the cat element
    catEl = document.createElement("div");
    catEl.id = "cat";
    document.body.appendChild(catEl);

    // Wire the element into cat-logic
    setCatEl(catEl);

    // Use fake timers so we can control setTimeout
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore real timers and clean up the DOM
    vi.useRealTimers();
    catEl.remove();
  });

  it("should add .squish class to the cat element immediately after triggerSquish() is called", () => {
    triggerSquish();
    expect(catEl.classList.contains("squish")).toBe(true);
  });

  it("should remove .squish class from the cat element after 300ms", () => {
    triggerSquish();

    // Class should be present before the timer fires
    expect(catEl.classList.contains("squish")).toBe(true);

    // Advance fake timers by 300ms to trigger the setTimeout callback
    vi.advanceTimersByTime(300);

    expect(catEl.classList.contains("squish")).toBe(false);
  });
});
