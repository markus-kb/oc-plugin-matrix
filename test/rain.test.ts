import { describe, expect, it } from "vitest";

import { glyphPool, renderRainFrame } from "../src/features/rain";

describe("glyphPool", () => {
  it("returns a richer mixed preset than ascii", () => {
    expect(glyphPool("mixed").length).toBeGreaterThan(glyphPool("ascii").length);
    expect(glyphPool("mixed")).toContain("M");
  });
});

describe("renderRainFrame", () => {
  it("returns the requested frame dimensions", () => {
    expect(renderRainFrame({ width: 6, height: 3, tick: 0, density: 0.5, glyphs: "ABC" })).toEqual([
      expect.any(String),
      expect.any(String),
      expect.any(String),
    ]);
    expect(
      renderRainFrame({ width: 6, height: 3, tick: 0, density: 0.5, glyphs: "ABC" }),
    ).toSatisfy((lines) => lines.every((line: string) => line.length === 6));
  });

  it("renders empty space when density is zero", () => {
    expect(renderRainFrame({ width: 4, height: 3, tick: 12, density: 0, glyphs: "ABC" })).toEqual([
      "    ",
      "    ",
      "    ",
    ]);
  });

  it("changes over time for active rain", () => {
    const first = renderRainFrame({ width: 8, height: 4, tick: 1, density: 1, glyphs: "AB" });
    const second = renderRainFrame({ width: 8, height: 4, tick: 2, density: 1, glyphs: "AB" });

    expect(second).not.toEqual(first);
  });

  it("produces visible glyphs at default home-screen params across a range of ticks", () => {
    // Regression: at density=0.32, width=72, height=16 the frame must contain
    // at least one non-space character so the home rain component shows output.
    const glyphs = glyphPool("mixed");
    let foundGlyph = false;
    // Test multiple ticks to account for head positions cycling through
    for (let tick = 0; tick < 200; tick += 10) {
      const frame = renderRainFrame({ width: 72, height: 16, tick, density: 0.32, glyphs });
      if (frame.some((line) => line.trim().length > 0)) {
        foundGlyph = true;
        break;
      }
    }
    expect(foundGlyph).toBe(true);
  });
});
