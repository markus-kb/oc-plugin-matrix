import type { MatrixConfig } from "./config";

// Guards for slot rendering decisions.
//
// home_logo is a "replace"-mode slot — when the renderer returns null the host
// falls back to the built-in Logo.  Using <Show when={...}> produces null when
// the condition is false, which triggers that fallback unintentionally.
// slotEnabled() extracts the guard as a pure function so it can be tested and
// called explicitly: `if (!slotEnabled(cfg, "home")) return null;`
type SlotGuardKey = "home" | "sidebar";

export const slotEnabled = (cfg: MatrixConfig, key: SlotGuardKey): boolean => {
  return cfg[key];
};
