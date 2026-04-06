// @ts-nocheck
/** @jsxImportSource @opentui/solid */
import type { TuiThemeCurrent } from "@opencode-ai/plugin/tui"

import type { MatrixConfig } from "./config"
import { MatrixRain } from "./matrix-rain"

/**
 * Full-screen rain backdrop rendered in the `app` slot at zIndex=0.
 *
 * Using position="absolute" means this box is removed from the flex flow of
 * the home screen — it does not push the prompt or any other element. It paints
 * behind everything because zIndex=0 is lower than the prompt's zIndex=1000.
 * overflow="hidden" ensures rain glyphs never escape the terminal boundary.
 */
export const HomeBackdrop = (props: { theme: TuiThemeCurrent; value: MatrixConfig }) => {
  return (
    <box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex={0}
      overflow="hidden"
    >
      <MatrixRain
        theme={props.theme}
        density={props.value.rainDensity}
        speed={props.value.rainSpeed}
      />
    </box>
  )
}

/**
 * Full-screen rain overlay for the cinematic burst (/matrix command).
 *
 * Rendered at zIndex=9999 so it covers the entire terminal — prompt, sidebar,
 * everything — for the duration of the burst. The caller is responsible for
 * unmounting this once the burst expires.
 */
export const CinematicOverlay = (props: { theme: TuiThemeCurrent }) => {
  return (
    <box
      position="absolute"
      top={0}
      left={0}
      width="100%"
      height="100%"
      zIndex={9999}
      overflow="hidden"
    >
      <MatrixRain theme={props.theme} density={1} speed={0.15} />
    </box>
  )
}
