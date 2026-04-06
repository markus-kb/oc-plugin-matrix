export type MatrixPreset = "subtle" | "balanced" | "cinematic";

export type MatrixConfig = {
  enabled: boolean;
  theme: string;
  setTheme: boolean;
  preset: MatrixPreset;
  home: boolean;
  sidebar: boolean;
  rain: boolean;
  rainSpeed: number;
  rainDensity: number;
  vignette: number;
  glow: number;
};

type MatrixTuning = Pick<MatrixConfig, "rainSpeed" | "rainDensity" | "vignette" | "glow">;

const DEFAULT_THEME = "matrix";

const PRESETS: Record<MatrixPreset, MatrixTuning> = {
  subtle: {
    rainSpeed: 0.045,
    rainDensity: 0.32,
    vignette: 0.22,
    glow: 0.12,
  },
  balanced: {
    rainSpeed: 0.065,
    rainDensity: 0.48,
    vignette: 0.28,
    glow: 0.18,
  },
  cinematic: {
    rainSpeed: 0.085,
    rainDensity: 0.72,
    vignette: 0.38,
    glow: 0.28,
  },
};

const asRecord = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value));
};

const asBool = (value: unknown, fallback: boolean) => {
  return typeof value === "boolean" ? value : fallback;
};

const asString = (value: unknown, fallback: string) => {
  if (typeof value !== "string") return fallback;
  return value.trim() ? value : fallback;
};

const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const asNumber = (value: unknown, fallback: number, min: number, max: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return clamp(value, min, max);
};

const asPreset = (value: unknown, fallback: MatrixPreset): MatrixPreset => {
  return value === "balanced" || value === "cinematic" || value === "subtle" ? value : fallback;
};

export const presetValues = (preset: MatrixPreset): MatrixTuning => {
  return { ...PRESETS[preset] };
};

export const applyPreset = (config: MatrixConfig, preset: MatrixPreset): MatrixConfig => {
  return {
    ...config,
    preset,
    ...presetValues(preset),
  };
};

export const resolveConfig = (options?: unknown, stored?: unknown): MatrixConfig => {
  const file = asRecord(options);
  const persisted = asRecord(stored);

  const preset = asPreset(persisted.preset ?? file.preset, "subtle");
  const tuning = presetValues(preset);

  return {
    enabled: asBool(persisted.enabled ?? file.enabled, true),
    theme: asString(persisted.theme ?? file.theme, DEFAULT_THEME),
    setTheme: asBool(persisted.set_theme ?? file.set_theme, true),
    preset,
    home: asBool(persisted.home ?? file.home, true),
    sidebar: asBool(persisted.sidebar ?? file.sidebar, true),
    rain: asBool(persisted.rain ?? file.rain, true),
    rainSpeed: asNumber(persisted.rain_speed ?? file.rain_speed, tuning.rainSpeed, 0, 1),
    rainDensity: asNumber(persisted.rain_density ?? file.rain_density, tuning.rainDensity, 0, 1),
    vignette: asNumber(persisted.vignette ?? file.vignette, tuning.vignette, 0, 1),
    glow: asNumber(persisted.glow ?? file.glow, tuning.glow, 0, 1),
  };
};
