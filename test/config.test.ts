import { describe, expect, it } from "vitest";

import { applyPreset, presetValues, resolveConfig } from "../src/features/config";

describe("presetValues", () => {
  it("returns subtle defaults", () => {
    expect(presetValues("subtle")).toEqual({
      rainSpeed: 0.045,
      rainDensity: 0.32,
      vignette: 0.22,
      glow: 0.12,
    });
  });

  it("returns cinematic defaults", () => {
    expect(presetValues("cinematic")).toEqual({
      rainSpeed: 0.085,
      rainDensity: 0.72,
      vignette: 0.38,
      glow: 0.28,
    });
  });
});

describe("resolveConfig", () => {
  it("uses subtle defaults when options are missing", () => {
    expect(resolveConfig()).toEqual({
      enabled: true,
      theme: "matrix",
      setTheme: true,
      preset: "subtle",
      home: true,
      sidebar: true,
      rain: true,
      rainSpeed: 0.045,
      rainDensity: 0.32,
      vignette: 0.22,
      glow: 0.12,
    });
  });

  it("applies preset defaults before raw overrides", () => {
    expect(
      resolveConfig({
        preset: "balanced",
        rain_density: 0.61,
        glow: 0.2,
      }),
    ).toEqual({
      enabled: true,
      theme: "matrix",
      setTheme: true,
      preset: "balanced",
      home: true,
      sidebar: true,
      rain: true,
      rainSpeed: 0.065,
      rainDensity: 0.61,
      vignette: 0.28,
      glow: 0.2,
    });
  });

  it("lets persisted settings override file options", () => {
    expect(
      resolveConfig(
        {
          preset: "subtle",
          rain_speed: 0.05,
        },
        {
          preset: "cinematic",
          rain: false,
          rain_speed: 0.11,
        },
      ),
    ).toEqual({
      enabled: true,
      theme: "matrix",
      setTheme: true,
      preset: "cinematic",
      home: true,
      sidebar: true,
      rain: false,
      rainSpeed: 0.11,
      rainDensity: 0.72,
      vignette: 0.38,
      glow: 0.28,
    });
  });

  it("clamps numeric controls and falls back on invalid values", () => {
    expect(
      resolveConfig({
        theme: "",
        rain_speed: -5,
        rain_density: 3,
        vignette: -1,
        glow: 2,
      }),
    ).toEqual({
      enabled: true,
      theme: "matrix",
      setTheme: true,
      preset: "subtle",
      home: true,
      sidebar: true,
      rain: true,
      rainSpeed: 0,
      rainDensity: 1,
      vignette: 0,
      glow: 1,
    });
  });
});

describe("applyPreset", () => {
  it("replaces tuning values while keeping structural settings", () => {
    expect(
      applyPreset(
        {
          enabled: true,
          theme: "matrix",
          setTheme: true,
          preset: "subtle",
          home: false,
          sidebar: true,
          rain: false,
          rainSpeed: 0.01,
          rainDensity: 0.2,
          vignette: 0.1,
          glow: 0.1,
        },
        "cinematic",
      ),
    ).toEqual({
      enabled: true,
      theme: "matrix",
      setTheme: true,
      preset: "cinematic",
      home: false,
      sidebar: true,
      rain: false,
      rainSpeed: 0.085,
      rainDensity: 0.72,
      vignette: 0.38,
      glow: 0.28,
    });
  });
});
