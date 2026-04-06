// @ts-nocheck
/** @jsxImportSource @opentui/solid */
import type { TuiThemeCurrent } from "@opencode-ai/plugin/tui";

import type { MatrixConfig } from "./config";
import { MatrixRain } from "./matrix-rain";

const pct = (value: number) => `${Math.round(value * 100)}%`;

export const Side = (props: { theme: TuiThemeCurrent; value: MatrixConfig }) => {
  return (
    <box paddingLeft={1} paddingRight={1} width="100%" flexDirection="column" gap={1}>
      <text fg={props.theme.text}>
        <b>MATRIX</b>
      </text>
      <text fg={props.theme.textMuted}>Preset {props.value.preset}</text>
      <MatrixRain
        theme={props.theme}
        density={props.value.rainDensity}
        speed={props.value.rainSpeed}
        compact
      />
      <text fg={props.theme.textMuted}>Rain {pct(props.value.rainDensity)}</text>
      <text fg={props.theme.textMuted}>Glow {pct(props.value.glow)}</text>
      <text fg={props.theme.textMuted}>Vignette {pct(props.value.vignette)}</text>
      <text fg={props.theme.primary}>/matrix</text>
    </box>
  );
};
