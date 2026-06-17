// Unit tests for task 2.2 — SVG presence and cursor style
// Validates: Requirements 2.1, 2.3

import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read and inject the HTML from index.html before each test
beforeEach(() => {
  const html = readFileSync(resolve(__dirname, "../index.html"), "utf-8");
  // Extract only the <body> content to avoid issues with <head> scripts
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  document.body.innerHTML = bodyMatch ? bodyMatch[1] : html;
});

describe("Cat SVG element — DOM structure (Requirements 2.1, 2.3)", () => {
  it("should have a #cat wrapper element in the DOM", () => {
    const cat = document.querySelector("#cat");
    expect(cat).not.toBeNull();
  });

  it("should have an SVG child element inside #cat", () => {
    const cat = document.querySelector("#cat");
    const svg = cat.querySelector("svg");
    expect(svg).not.toBeNull();
  });

  it("should have cursor-pointer class applied to #cat", () => {
    const cat = document.querySelector("#cat");
    expect(cat.classList.contains("cursor-pointer")).toBe(true);
  });
});
