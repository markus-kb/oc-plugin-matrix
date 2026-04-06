// @ts-nocheck
/** @jsxImportSource @opentui/solid */
import { TargetChannel, VignetteEffect } from "@opentui/core"
import type { TuiPlugin, TuiPluginModule, TuiSlotPlugin } from "@opencode-ai/plugin/tui"
import { Show, createSignal } from "solid-js"

import { applyPreset, resolveConfig } from "./config"
import { BURST_DURATION_MS, burstRamp, isHomeRoute } from "./cinematic"
import { slotEnabled } from "./slot-guards"
import { CinematicOverlay, HomeBackdrop } from "./home-backdrop"
import { HomeBanner } from "./home-rain"
import { createMatrixCommand } from "./matrix-command"
import {
  createSettingKey,
  cyclePreset,
  settingByField,
  SettingsDialog,
  type Field,
  type NumberField,
  type ToggleField,
} from "./settings-dialog"
import { Side } from "./side"

const id = "matrix"

type Api = Parameters<TuiPlugin>[0]

const GREEN_BOOST_MATRIX = new Float32Array([
  1.02, 0, 0, 0, 0, 1.18, 0, 0, 0, 0, 1.02, 0, 0, 0, 0, 1,
])
const SHIMMER_MATRIX = new Float32Array([1.04, 0, 0, 0, 0, 1.38, 0, 0, 0, 0, 1.04, 0, 0, 0, 0, 1])

const settingKey = createSettingKey(id)

const clamp01 = (value: number) => {
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

const rawState = (api: Api) => {
  return {
    preset: api.kv.get(settingKey.preset),
    set_theme: api.kv.get(settingKey.setTheme),
    home: api.kv.get(settingKey.home),
    sidebar: api.kv.get(settingKey.sidebar),
    rain: api.kv.get(settingKey.rain),
    rain_speed: api.kv.get(settingKey.rainSpeed),
    rain_density: api.kv.get(settingKey.rainDensity),
    vignette: api.kv.get(settingKey.vignette),
    glow: api.kv.get(settingKey.glow),
  }
}

const createAmbientEffect = (
  value: () => ReturnType<typeof resolveConfig>,
  getBurstDeadline: () => number,
) => {
  let fullMaskWidth = -1
  let fullMaskHeight = -1
  let fullMask = new Float32Array(0)
  let rowMaskWidth = -1
  let rowMask = new Float32Array(0)
  let elapsed = 0

  const ensureFullMask = (width: number, height: number) => {
    if (width === fullMaskWidth && height === fullMaskHeight) return
    fullMaskWidth = width
    fullMaskHeight = height
    fullMask = new Float32Array(width * height * 3)
    let index = 0
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        fullMask[index++] = x
        fullMask[index++] = y
        fullMask[index++] = 1
      }
    }
  }

  const ensureRowMask = (width: number) => {
    if (width === rowMaskWidth) return
    rowMaskWidth = width
    rowMask = new Float32Array(width * 3)
    let index = 0
    for (let x = 0; x < width; x++) {
      rowMask[index++] = x
      rowMask[index++] = 0
      rowMask[index++] = 1
    }
  }

  const setRowMask = (y: number) => {
    for (let index = 1; index < rowMask.length; index += 3) {
      rowMask[index] = y
    }
  }

  return (buf: any, dt: number) => {
    const cfg = value()
    elapsed += dt

    if (buf.width <= 0 || buf.height <= 0) return

    ensureFullMask(buf.width, buf.height)
    ensureRowMask(buf.width)

    // burstRamp is a pure function from cinematic.ts — no direct Date.now() call
    // here so the ambient effect stays decoupled from wall-clock time.
    const burstValue = burstRamp(Date.now(), getBurstDeadline())
    const glow = clamp01(cfg.glow + burstValue * 0.4)
    if (glow > 0) {
      buf.colorMatrix(GREEN_BOOST_MATRIX, fullMask, glow, TargetChannel.Both)
    }

    const vignette = cfg.vignette + burstValue * 0.12
    if (vignette > 0) {
      new VignetteEffect(vignette).apply(buf)
    }

    if (!cfg.rain && burstValue <= 0) return

    const row = Math.floor((elapsed * Math.max(0.01, cfg.rainSpeed) * 0.02) % buf.height)
    setRowMask(row)
    buf.colorMatrix(
      SHIMMER_MATRIX,
      rowMask,
      clamp01(0.08 + cfg.glow * 0.2 + burstValue * 0.55),
      TargetChannel.Both,
    )
  }
}

const slots = (
  api: Api,
  value: () => ReturnType<typeof resolveConfig>,
  cinematic: () => boolean,
): TuiSlotPlugin[] => {
  return [
    {
      // The app slot renders at the application level, above all routes.
      // We use it for two purposes:
      //   1. HomeBackdrop: absolutely positioned rain behind the home screen UI.
      //      Gated on isHomeRoute so it only appears when there is no active session.
      //   2. CinematicOverlay: full-screen rain takeover triggered by /matrix.
      //      Rendered at zIndex=9999 so it covers the entire terminal.
      slots: {
        app(ctx) {
          return (
            <>
              <Show when={value().home && value().rain && isHomeRoute(api.route.current)}>
                <HomeBackdrop theme={ctx.theme.current} value={value()} />
              </Show>
              <Show when={cinematic()}>
                <CinematicOverlay theme={ctx.theme.current} />
              </Show>
            </>
          )
        },
      },
    },
    {
      slots: {
        home_logo(ctx) {
          // home_logo is "replace" mode: returning null causes the host to fall
          // back to the built-in Logo.  Never use <Show> here — use an explicit
          // null return so the guard is visible and the fallback is intentional.
          if (!slotEnabled(value(), "home")) return null
          return <HomeBanner theme={ctx.theme.current} />
        },
        home_bottom(_ctx) {
          // home_bottom is "append" mode, but keeping the same pattern for
          // consistency — explicit null rather than a <Show> wrapper.
          if (!slotEnabled(value(), "home")) return null
          return (
            <text fg={_ctx.theme.current.textMuted}>
              /matrix — cinematic burst &nbsp;·&nbsp; ctrl+p → Matrix settings
            </text>
          )
        },
      },
    },
    {
      order: 90,
      slots: {
        sidebar_content(ctx) {
          if (!slotEnabled(value(), "sidebar")) return null
          return <Side theme={ctx.theme.current} value={value()} />
        },
      },
    },
  ]
}

const tui: TuiPlugin = async (api, options) => {
  const [value, setValue] = createSignal(resolveConfig(options, rawState(api)))
  if (!value().enabled) return

  await api.theme.install("./matrix.json")
  if (value().setTheme) {
    api.theme.set(value().theme)
  }

  // burstDeadline is the wall-clock timestamp at which the current burst ends.
  // Kept as a plain number (not a signal) because burstRamp() is called inside
  // the post-process callback every frame — a signal would add reactive overhead
  // with no benefit there. The cinematic signal is reactive because it drives JSX.
  let burstDeadline = 0
  let cinematicTimeout: ReturnType<typeof setTimeout> | undefined
  const [cinematic, setCinematic] = createSignal(false)

  let postProcess: ReturnType<typeof createAmbientEffect> | undefined
  let live = false

  const syncPostProcess = () => {
    if (postProcess) {
      api.renderer.removePostProcessFn(postProcess)
      postProcess = undefined
    }

    const cfg = value()
    const active =
      cfg.rain || cfg.glow > 0 || cfg.vignette > 0 || burstRamp(Date.now(), burstDeadline) > 0
    if (!active) {
      if (live) {
        api.renderer.dropLive()
        live = false
      }
      return
    }

    postProcess = createAmbientEffect(value, () => burstDeadline)
    api.renderer.addPostProcessFn(postProcess)

    if (!live) {
      api.renderer.requestLive()
      live = true
    }
  }

  const persist = (key: Field, next: unknown) => {
    api.kv.set(settingKey[key], next)
  }

  const update = (key: ToggleField | NumberField, next: unknown) => {
    const prev = value()
    if (prev[key] === next) return
    const state = {
      ...prev,
      [key]: next,
    }
    setValue(state)
    persist(key, next)

    if (key === "setTheme" && state.setTheme) {
      api.theme.set(state.theme)
    }

    syncPostProcess()
  }

  const shiftPreset = (dir: -1 | 1) => {
    const nextPreset = cyclePreset(value().preset, dir)
    const state = applyPreset(value(), nextPreset)
    setValue(state)
    persist("preset", state.preset)
    persist("rainSpeed", state.rainSpeed)
    persist("rainDensity", state.rainDensity)
    persist("vignette", state.vignette)
    persist("glow", state.glow)
    syncPostProcess()
  }

  const flip = (key: ToggleField) => {
    update(key, !value()[key])
  }

  const tune = (key: NumberField, dir: -1 | 1) => {
    const row = settingByField[key]
    if (!row || row.kind !== "number") return
    let next = value()[key] + (row.step ?? 1) * dir
    if (typeof row.min === "number") next = Math.max(row.min, next)
    if (typeof row.max === "number") next = Math.min(row.max, next)
    next = Number(next.toFixed(row.digits ?? 2))
    update(key, next)
  }

  const showSettings = () => {
    api.ui.dialog.replace(() => (
      <SettingsDialog api={api} value={value} flip={flip} tune={tune} shiftPreset={shiftPreset} />
    ))
  }

  const runMatrix = () => {
    // Set the post-process burst deadline
    burstDeadline = Date.now() + BURST_DURATION_MS
    syncPostProcess()

    // Trigger the cinematic JSX overlay — full-screen rain covers the terminal
    setCinematic(true)

    // Clear any previous timeout to handle rapid re-triggers correctly
    if (cinematicTimeout !== undefined) clearTimeout(cinematicTimeout)
    cinematicTimeout = setTimeout(() => {
      setCinematic(false)
      cinematicTimeout = undefined
      // Re-sync post-process to drop live mode if no other effect is active
      syncPostProcess()
    }, BURST_DURATION_MS)
  }

  api.command.register(() => [
    {
      title: "Matrix settings",
      value: "matrix.settings",
      category: "System",
      onSelect() {
        showSettings()
      },
    },
    createMatrixCommand(runMatrix),
  ])

  for (const item of slots(api, value, cinematic)) {
    api.slots.register(item)
  }

  syncPostProcess()
  api.renderer.targetFps = 20
  api.renderer.maxFps = 20

  api.lifecycle.onDispose(() => {
    if (cinematicTimeout !== undefined) clearTimeout(cinematicTimeout)
    if (postProcess) {
      api.renderer.removePostProcessFn(postProcess)
    }
    if (live) {
      api.renderer.dropLive()
    }
  })
}

const plugin: TuiPluginModule & { id: string } = {
  id,
  tui,
}

export default plugin
