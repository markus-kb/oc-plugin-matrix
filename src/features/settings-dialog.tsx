// @ts-nocheck
/** @jsxImportSource @opentui/solid */
import { useKeyboard } from "@opentui/solid";
import type { TuiPlugin } from "@opencode-ai/plugin/tui";
import { createMemo, createSignal } from "solid-js";

import type { MatrixConfig, MatrixPreset } from "./config";

type Api = Parameters<TuiPlugin>[0];

export type ToggleField = "setTheme" | "home" | "sidebar" | "rain";
export type NumberField = "rainSpeed" | "rainDensity" | "vignette" | "glow";
export type SelectField = "preset";
export type Field = ToggleField | NumberField | SelectField;

type SettingRow = {
  key: Field;
  title: string;
  description: string;
  category: string;
  kind: "toggle" | "number" | "select";
  step?: number;
  min?: number;
  max?: number;
  digits?: number;
};

const PRESETS: MatrixPreset[] = ["subtle", "balanced", "cinematic"];

const rows: SettingRow[] = [
  {
    key: "preset",
    title: "Intensity preset",
    description: "Primary Matrix mood control",
    category: "Presets",
    kind: "select",
  },
  {
    key: "setTheme",
    title: "Apply Matrix theme",
    description: "Set the configured theme when enabled",
    category: "Visual",
    kind: "toggle",
  },
  {
    key: "home",
    title: "Home rain",
    description: "Show digital rain on the home screen",
    category: "Layout",
    kind: "toggle",
  },
  {
    key: "sidebar",
    title: "Sidebar panel",
    description: "Show the ambient Matrix side panel",
    category: "Layout",
    kind: "toggle",
  },
  {
    key: "rain",
    title: "Ambient shimmer",
    description: "Enable subtle animated motion during coding",
    category: "Visual",
    kind: "toggle",
  },
  {
    key: "rainSpeed",
    title: "Rain speed",
    description: "Animation rate for digital rain and shimmer",
    category: "Advanced",
    kind: "number",
    step: 0.01,
    min: 0,
    max: 1,
    digits: 2,
  },
  {
    key: "rainDensity",
    title: "Rain density",
    description: "How many columns of rain remain active",
    category: "Advanced",
    kind: "number",
    step: 0.05,
    min: 0,
    max: 1,
    digits: 2,
  },
  {
    key: "vignette",
    title: "Vignette",
    description: "Edge darkening strength",
    category: "Advanced",
    kind: "number",
    step: 0.05,
    min: 0,
    max: 1,
    digits: 2,
  },
  {
    key: "glow",
    title: "Glow",
    description: "Overall green phosphor lift",
    category: "Advanced",
    kind: "number",
    step: 0.05,
    min: 0,
    max: 1,
    digits: 2,
  },
];

export const settingByField = Object.fromEntries(rows.map((item) => [item.key, item])) as Record<
  Field,
  SettingRow
>;

export const createSettingKey = (id: string) => {
  return {
    preset: `${id}.setting.preset`,
    setTheme: `${id}.setting.set_theme`,
    home: `${id}.setting.home`,
    sidebar: `${id}.setting.sidebar`,
    rain: `${id}.setting.rain`,
    rainSpeed: `${id}.setting.rain_speed`,
    rainDensity: `${id}.setting.rain_density`,
    vignette: `${id}.setting.vignette`,
    glow: `${id}.setting.glow`,
  } as const;
};

const status = (value: boolean) => {
  return value ? "ON" : "OFF";
};

const metric = (value: MatrixConfig, key: NumberField) => {
  return value[key].toFixed(settingByField[key].digits ?? 2);
};

const presetLabel = (value: MatrixPreset) => {
  return value.toUpperCase();
};

export const cyclePreset = (value: MatrixPreset, dir: -1 | 1): MatrixPreset => {
  const index = PRESETS.indexOf(value);
  const next = (index + dir + PRESETS.length) % PRESETS.length;
  return PRESETS[next] ?? "subtle";
};

export const SettingsDialog = (props: {
  api: Api;
  value: () => MatrixConfig;
  flip: (key: ToggleField) => void;
  tune: (key: NumberField, dir: -1 | 1) => void;
  shiftPreset: (dir: -1 | 1) => void;
}) => {
  const [cur, setCur] = createSignal<Field>(rows[0]?.key ?? "preset");
  const theme = createMemo(() => props.api.theme.current);

  const current = createMemo(() => settingByField[cur()] ?? settingByField.preset);
  const options = createMemo(() => {
    const value = props.value();
    return rows.map((item) => {
      let footer = "";
      if (item.kind === "toggle") footer = status(value[item.key]);
      if (item.kind === "number") footer = metric(value, item.key);
      if (item.kind === "select") footer = presetLabel(value.preset);

      return {
        title: item.title,
        value: item.key,
        description: item.description,
        category: item.category,
        footer,
      };
    });
  });

  useKeyboard((evt) => {
    const item = current();
    if (!item) return;

    if (evt.name === "space") {
      evt.preventDefault();
      evt.stopPropagation();
      if (item.kind === "toggle") props.flip(item.key);
      if (item.kind === "select") props.shiftPreset(1);
      return;
    }

    if (evt.name !== "left" && evt.name !== "right") return;
    evt.preventDefault();
    evt.stopPropagation();

    if (item.kind === "toggle") {
      props.flip(item.key);
      return;
    }

    if (item.kind === "number") {
      props.tune(item.key, evt.name === "left" ? -1 : 1);
      return;
    }

    props.shiftPreset(evt.name === "left" ? -1 : 1);
  });

  return (
    <box flexDirection="column">
      <props.api.ui.DialogSelect
        title="Matrix settings"
        placeholder="Filter settings"
        options={options()}
        current={cur()}
        onMove={(item) => setCur(item.value)}
        onSelect={(item) => {
          setCur(item.value);
          const next = settingByField[item.value];
          if (next?.kind === "toggle") props.flip(next.key);
          if (next?.kind === "select") props.shiftPreset(1);
        }}
      />
      <box
        paddingRight={2}
        paddingLeft={4}
        flexDirection="row"
        gap={2}
        paddingTop={1}
        paddingBottom={1}
        flexShrink={0}
      >
        <text>
          <span style={{ fg: theme().text }}>
            <b>toggle</b>{" "}
          </span>
          <span style={{ fg: theme().textMuted }}>space enter left/right</span>
        </text>
        <text>
          <span style={{ fg: theme().text }}>
            <b>adjust</b>{" "}
          </span>
          <span style={{ fg: theme().textMuted }}>left/right</span>
        </text>
      </box>
    </box>
  );
};
