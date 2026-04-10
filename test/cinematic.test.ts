import { describe, expect, it } from "vitest";

import { burstRamp, isHomeRoute } from "../src/features/cinematic";

describe("isHomeRoute", () => {
  it("returns true for the home route", () => {
    expect(isHomeRoute({ name: "home" })).toBe(true);
  });

  it("returns false for a session route", () => {
    expect(isHomeRoute({ name: "session", params: { sessionID: "abc" } })).toBe(false);
  });

  it("returns false for any other named route", () => {
    expect(isHomeRoute({ name: "settings" })).toBe(false);
    expect(isHomeRoute({ name: "" })).toBe(false);
  });
});

describe("burstRamp", () => {
  const DURATION = 4500;

  it("returns 1 immediately after trigger", () => {
    const now = 1000;
    const deadline = now + DURATION;
    // At the moment of trigger, full burst
    expect(burstRamp(now, deadline)).toBeCloseTo(1, 5);
  });

  it("returns 0 when deadline has passed", () => {
    const now = 10_000;
    const deadline = 5_000; // already expired
    expect(burstRamp(now, deadline)).toBe(0);
  });

  it("returns 0 when no burst has been triggered (deadline = 0)", () => {
    expect(burstRamp(Date.now(), 0)).toBe(0);
  });

  it("returns a value between 0 and 1 mid-burst", () => {
    const now = 1000;
    const deadline = now + DURATION;
    const midNow = now + DURATION / 2;
    const value = burstRamp(midNow, deadline);
    expect(value).toBeGreaterThan(0);
    expect(value).toBeLessThan(1);
  });

  it("is monotonically decreasing as time advances", () => {
    const start = 1000;
    const deadline = start + DURATION;
    const t1 = burstRamp(start + 100, deadline);
    const t2 = burstRamp(start + 500, deadline);
    const t3 = burstRamp(start + 2000, deadline);
    expect(t1).toBeGreaterThan(t2);
    expect(t2).toBeGreaterThan(t3);
  });
});
