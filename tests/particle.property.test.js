// Feature: cat-petting-app, Property 8: Particle is removed from DOM after animationend

import { describe, it, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import { spawnParticle } from "../cat-logic.js";

/**
 * Property 8: Particle is removed from DOM after animationend
 * Validates: Requirements 4.4
 *
 * For any (x, y) coordinates, after calling spawnParticle(x, y) and dispatching
 * new Event("animationend") on the spawned element, document.body.contains(particle)
 * must return false. No orphaned particle elements should accumulate.
 */
describe("Property 8: Particle is removed from DOM after animationend", () => {
  afterEach(() => {
    // Clean up any leftover particle spans between runs
    document.querySelectorAll(".particle").forEach((el) => el.remove());
  });

  it("document.body.contains(particle) is false after animationend fires, for any (x, y) in 0–500", () => {
    // Feature: cat-petting-app, Property 8: Particle is removed from DOM after animationend
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 500 }),
        fc.integer({ min: 0, max: 500 }),
        (x, y) => {
          // Arrange: spawn the particle at (x, y)
          spawnParticle(x, y);

          // Get a reference to the newly created particle element (last .particle span in body)
          const particles = document.body.querySelectorAll(".particle");
          const particle = particles[particles.length - 1];

          // Act: dispatch animationend to simulate the CSS animation completing
          particle.dispatchEvent(new Event("animationend"));

          // Assert: particle must no longer be in the DOM
          return !document.body.contains(particle);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 7: Particle position reflects click coordinates
 * Validates: Requirements 4.1
 *
 * For any (x, y) coordinates passed to spawnParticle, parseInt(particle.style.left)
 * and parseInt(particle.style.top) must each be within 20px of the input coordinates.
 */
// Feature: cat-petting-app, Property 7: Particle position reflects click coordinates
describe("Property 7: Particle position reflects click coordinates", () => {
  afterEach(() => {
    // Clean up any leftover particle elements after each run
    document.querySelectorAll(".particle").forEach((el) => el.remove());
  });

  it("spawned particle style.left and style.top are within 20px of (x, y) for any coordinates", () => {
    // Feature: cat-petting-app, Property 7: Particle position reflects click coordinates
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1000 }),
        fc.integer({ min: 0, max: 1000 }),
        (x, y) => {
          // Act: spawn a particle at the given coordinates
          spawnParticle(x, y);

          // Find the last appended span with class "particle" in document.body
          const particles = document.body.querySelectorAll("span.particle");
          const particle = particles[particles.length - 1];

          // Read back the position values
          const left = parseInt(particle.style.left, 10);
          const top = parseInt(particle.style.top, 10);

          // Assert: each dimension must be within 20px of the input
          const leftOk = Math.abs(left - x) <= 20;
          const topOk = Math.abs(top - y) <= 20;

          // Clean up the element after assertion
          particle.remove();

          return leftOk && topOk;
        }
      ),
      { numRuns: 100 }
    );
  });
});
