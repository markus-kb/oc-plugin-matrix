export type GlyphPreset = "mixed" | "ascii" | "digits";

type RainFrameInput = {
  width: number;
  height: number;
  tick: number;
  density: number;
  glyphs: string;
};

const GLYPHS: Record<GlyphPreset, string> = {
  mixed: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$+-*/=<>[]{}|:;ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘ",
  ascii: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$+-*/=<>[]{}|:;",
  digits: "0123456789",
};

const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const hash = (value: number) => {
  const x = Math.sin(value * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const tailLength = (x: number, height: number) => {
  const min = Math.max(2, Math.floor(height * 0.25));
  const max = Math.max(min, Math.floor(height * 0.8));
  return min + Math.floor(hash(x + 17) * (max - min + 1));
};

const glyphAt = (glyphs: string, x: number, y: number, tick: number) => {
  const pool = Array.from(glyphs || GLYPHS.mixed);
  const index = Math.floor(hash((x + 1) * 31 + (y + 1) * 17 + tick * 13) * pool.length);
  return pool[index] ?? " ";
};

export const glyphPool = (preset: GlyphPreset): string => {
  return GLYPHS[preset];
};

export const renderRainFrame = ({
  width,
  height,
  tick,
  density,
  glyphs,
}: RainFrameInput): string[] => {
  const w = Math.max(0, Math.floor(width));
  const h = Math.max(0, Math.floor(height));
  const fill = clamp(density, 0, 1);
  const lines = Array.from({ length: h }, () => Array.from({ length: w }, () => " "));

  if (fill <= 0 || w === 0 || h === 0) {
    return lines.map((line) => line.join(""));
  }

  for (let x = 0; x < w; x++) {
    if (hash(x + 1) > fill) continue;

    const length = tailLength(x, h);
    const head =
      Math.floor((tick * (1 + hash(x + 7) * 2) + hash(x + 11) * h * 3) % (h + length)) - length;

    for (let i = 0; i < length; i++) {
      const y = head + i;
      if (y < 0 || y >= h) continue;
      lines[y]![x] = glyphAt(glyphs, x, y, tick + i);
    }
  }

  return lines.map((line) => line.join(""));
};
