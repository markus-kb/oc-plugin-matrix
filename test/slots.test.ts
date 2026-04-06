import { describe, expect, it } from "vitest"

import { resolveConfig } from "../src/features/config"
import { slotEnabled } from "../src/features/slot-guards"

// Regression: home_logo uses "replace" mode — the host falls back to the default
// logo whenever the plugin slot renders null/undefined.  The <Show when={...}>
// pattern returns null when the condition is false, which the host treats as
// "no plugin output" and restores the built-in Logo.
// slotEnabled() is the pure guard that the slot renderer must call to decide
// whether to render or return null — ensuring the decision is tested independently
// of the JSX runtime.
describe("slotEnabled", () => {
  it("home_logo is enabled by default (home=true)", () => {
    const cfg = resolveConfig()
    expect(slotEnabled(cfg, "home")).toBe(true)
  })

  it("home_logo is disabled when home=false", () => {
    const cfg = resolveConfig({ home: false })
    expect(slotEnabled(cfg, "home")).toBe(false)
  })

  it("sidebar_content is enabled by default (sidebar=true)", () => {
    const cfg = resolveConfig()
    expect(slotEnabled(cfg, "sidebar")).toBe(true)
  })

  it("sidebar_content is disabled when sidebar=false", () => {
    const cfg = resolveConfig({ sidebar: false })
    expect(slotEnabled(cfg, "sidebar")).toBe(false)
  })
})
