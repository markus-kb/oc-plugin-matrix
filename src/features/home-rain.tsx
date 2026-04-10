// @ts-nocheck
/** @jsxImportSource @opentui/solid */
import type { TuiThemeCurrent } from "@opencode-ai/plugin/tui";

import { BANNER_LINES } from "./layout";

/**
 * Static banner rendered in the `home_logo` slot.
 *
 * Only the text content lives here — no rain component. Rain is rendered
 * separately in the `app` slot by HomeBackdrop, which uses position="absolute"
 * so it paints behind this banner and behind the prompt without displacing them.
 *
 * No backgroundColor is set on any box here — that lets the backdrop rain
 * show through cells that aren't covered by text characters.
 */
export const HomeBanner = (props: { theme: TuiThemeCurrent }) => {
  return (
    <box width="100%" flexDirection="column" alignItems="center">
      {BANNER_LINES.map((line) => (
        <text fg={props.theme.text} flexShrink={0}>
          {line}
        </text>
      ))}
      <text fg={props.theme.textMuted} flexShrink={0}>
        Subtle by default. Atmospheric by design. Coding stays readable.
      </text>
    </box>
  );
};
