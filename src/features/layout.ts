/**
 * Shared layout constants and pure helpers for the Matrix TUI components.
 *
 * Extracted from home-rain.tsx so they can be unit-tested without importing
 * the JSX runtime (@opentui/solid is not available in the vitest environment).
 */

export const BANNER_LINES: readonly string[] = [
  "███╗   ███╗ █████╗ ████████╗██████╗ ██╗██╗  ██╗",
  "████╗ ████║██╔══██╗╚══██╔══╝██╔══██╗██║╚██╗██╔╝",
  "██╔████╔██║███████║   ██║   ██████╔╝██║ ╚███╔╝ ",
  "██║╚██╔╝██║██╔══██║   ██║   ██╔══██╗██║ ██╔██╗ ",
  "██║ ╚═╝ ██║██║  ██║   ██║   ██║  ██║██║██╔╝ ██╗",
  "╚═╝     ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝",
];

/**
 * Clamp a raw width/height pair to the minimum values required by the rain
 * renderer.  Used in onSizeChange callbacks to avoid feeding invalid dimensions
 * to renderRainFrame.
 */
export const safeDimensions = (
  width: number,
  height: number,
): { width: number; height: number } => ({
  width: Math.max(6, width),
  height: Math.max(3, height),
});
