// Feature: cat-petting-app, Property 5: Milestone class applied correctly for all counts

import { describe, it, beforeEach } from "vitest";
import * as fc from "fast-check";
import { applyMilestone, MILESTONES } from "../cat-logic.js";

/**
 * Property 5: Milestone class applied correctly for all counts
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4
 *
 * For any integer 0–500, applyMilestone(count) must result in exactly one
 * (or zero) milestone class on <body> matching the correct threshold range:
 *   0–49:   no milestone class present
 *   50–99:  only milestone-1 present
 *   100–199: only milestone-2 present
 *   200+:   only milestone-3 present
 * No two milestone classes may coexist on <body> at any time.
 */
describe("Property 5: Milestone class applied correctly for all counts", () => {
  const allMilestoneClasses = MILESTONES.map((m) => m.class);

  beforeEach(() => {
    // Clean up any milestone classes before each property run
    for (const cls of allMilestoneClasses) {
      document.body.classList.remove(cls);
    }
  });

  it("applies exactly the correct milestone class (or none) for any integer 0–500", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 500 }), (count) => {
        // Act: apply milestone for the generated count
        applyMilestone(count);

        const cls = document.body.classList;
        const active = allMilestoneClasses.filter((c) => cls.contains(c));

        // Assert no two milestone classes coexist
        if (active.length > 1) return false;

        // Assert the correct class (or none) is applied per threshold range
        if (count < 50) {
          return active.length === 0;
        } else if (count < 100) {
          return active.length === 1 && cls.contains("milestone-1");
        } else if (count < 200) {
          return active.length === 1 && cls.contains("milestone-2");
        } else {
          return active.length === 1 && cls.contains("milestone-3");
        }
      }),
      { numRuns: 100 }
    );
  });
});
