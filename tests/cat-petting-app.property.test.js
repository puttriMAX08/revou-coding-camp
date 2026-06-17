// Feature: cat-petting-app, Property 1: Click increments counter by exactly one
// Feature: cat-petting-app, Property 2: Counter display always reflects current state
// Feature: cat-petting-app, Property 3: localStorage round-trip preserves pet count

import { describe, it, beforeEach } from "vitest";
import * as fc from "fast-check";
import * as catLogic from "../cat-logic.js";
const { setPetCount, setCounterEl, updateCounterDisplay, incrementAndSave, saveCount, loadCount } = catLogic;

/**
 * Property 1: Click increments counter by exactly one
 * Validates: Requirements 1.2
 *
 * For any starting petCount from 0–1,000,000, calling incrementAndSave() must
 * result in petCount === startCount + 1.
 */
describe("Property 1: Click increments counter by exactly one", () => {
  let counterEl;

  beforeEach(() => {
    // Set up a DOM element so updateCounterDisplay() inside incrementAndSave() works
    counterEl = document.createElement("p");
    counterEl.id = "counter-prop1";
    document.body.appendChild(counterEl);
    setCounterEl(counterEl);
  });

  it("petCount equals startCount + 1 after incrementAndSave(), for any integer 0–1,000,000", () => {
    // Feature: cat-petting-app, Property 1: Click increments counter by exactly one
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1_000_000 }), (startCount) => {
        // Arrange: set petCount to the generated starting value
        setPetCount(startCount);

        // Act: increment via the real function
        incrementAndSave();

        // Assert: read petCount live from the module — must be exactly startCount + 1
        return catLogic.petCount === startCount + 1;
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 2: Counter display always reflects current state
 * Validates: Requirements 1.3
 *
 * For any integer 0–1,000,000 assigned to petCount, calling updateCounterDisplay()
 * must make the counter DOM element's textContent include that exact numeric value
 * as a string.
 */
describe("Property 2: Counter display always reflects current state", () => {
  let counterEl;

  beforeEach(() => {
    // Create a fresh DOM element for each test run so state doesn't leak
    counterEl = document.createElement("p");
    counterEl.id = "counter";
    document.body.appendChild(counterEl);
    setCounterEl(counterEl);
  });

  it("textContent includes the exact petCount value for any integer 0–1,000,000", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1_000_000 }), (count) => {
        // Arrange: set petCount to the generated value
        setPetCount(count);

        // Act: sync the DOM
        updateCounterDisplay();

        // Assert: the element's text must contain the exact number as a string
        return counterEl.textContent.includes(String(count));
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 3: localStorage round-trip preserves pet count
 * Validates: Requirements 1.4, 6.1, 6.2
 *
 * For any valid non-negative integer n in 0–1,000,000, calling saveCount(n)
 * then loadCount() must return the same value n.
 */
describe("Property 3: localStorage round-trip preserves pet count", () => {
  it("loadCount() returns n after saveCount(n), for any integer 0–1,000,000", () => {
    // Feature: cat-petting-app, Property 3: localStorage round-trip preserves pet count
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 1_000_000 }), (n) => {
        // Act: persist n, then read it back
        saveCount(n);
        return loadCount() === n;
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 4: Invalid localStorage values fall back to zero
 * Validates: Requirements 1.5, 6.3
 *
 * For any value from the set: null, "", "NaN", "-1", and arbitrary non-numeric/negative
 * strings, loadCount() must return exactly 0.
 */
// Feature: cat-petting-app, Property 4: Invalid localStorage values fall back to zero
import { loadCount, STORAGE_KEY } from "../cat-logic.js";

describe("Property 4: Invalid localStorage values fall back to zero", () => {
  it("loadCount() returns 0 for any invalid localStorage value", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(null),
          fc.constant(""),
          fc.constant("NaN"),
          fc.constant("-1"),
          fc.string().filter(
            (s) => isNaN(parseInt(s, 10)) || parseInt(s, 10) < 0
          )
        ),
        (invalidValue) => {
          // Arrange: put the invalid value into localStorage (or remove for null)
          if (invalidValue === null) {
            localStorage.removeItem(STORAGE_KEY);
          } else {
            localStorage.setItem(STORAGE_KEY, invalidValue);
          }

          // Act: load the count
          const result = loadCount();

          // Assert: must always be exactly 0
          return result === 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});
