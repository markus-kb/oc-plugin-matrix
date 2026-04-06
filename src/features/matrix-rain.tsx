// @ts-nocheck
/** @jsxImportSource @opentui/solid */
import type { TuiThemeCurrent } from "@opencode-ai/plugin/tui"
import { createMemo, createSignal, onCleanup } from "solid-js"

import { safeDimensions } from "./layout"
import { glyphPool, renderRainFrame } from "./rain"

export const MatrixRain = (props: {
  theme: TuiThemeCurrent
  density: number
  speed: number
  title?: string
  subtitle?: string
  compact?: boolean
}) => {
  const [size, setSize] = createSignal(
    safeDimensions(props.compact ? 16 : 48, props.compact ? 10 : 16),
  )
  const [tick, setTick] = createSignal(0)
  const glyphs = glyphPool("mixed")

  // boxRef is used inside onSizeChange instead of `this` because the opentui
  // runtime calls onSizeChange as a plain function (not bound to the renderable),
  // so `this` is undefined in strict mode.
  let boxRef: any

  const timer = setInterval(() => {
    setTick((value) => value + Math.max(1, Math.round(props.speed * 24)))
  }, 80)

  onCleanup(() => clearInterval(timer))

  const lines = createMemo(() => {
    const current = size()
    const reserved = props.title ? (props.subtitle ? 2 : 1) : 0
    const height = Math.max(3, current.height - reserved)
    return renderRainFrame({
      width: current.width,
      height,
      tick: tick(),
      density: props.density,
      glyphs,
    })
  })

  return (
    <box
      ref={boxRef}
      width="100%"
      height="100%"
      flexDirection="column"
      overflow="hidden"
      onSizeChange={() => {
        // Access dimensions via the ref, not `this` — see comment above.
        const next = safeDimensions(boxRef?.width ?? 6, boxRef?.height ?? 3)
        setSize((prev) => (prev.width === next.width && prev.height === next.height ? prev : next))
      }}
    >
      {props.title ? (
        <text fg={props.theme.text}>
          <b>{props.title}</b>
        </text>
      ) : null}
      {props.subtitle ? <text fg={props.theme.textMuted}>{props.subtitle}</text> : null}
      {lines().map((line, index) => (
        <text fg={index % 3 === 0 ? props.theme.text : props.theme.primary}>{line}</text>
      ))}
    </box>
  )
}
