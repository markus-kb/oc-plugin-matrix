# Matrix Plugin Plan

## Goal

Create an OpenCode plugin that delivers a strong Matrix atmosphere without hindering coding. The plugin should be visual-only, keep active coding surfaces readable, and provide configurable intensity.

## Constraints

- Follow strict Red -> Green -> Refactor TDD for all code changes.
- Keep the default experience subtle and productivity-safe.
- Use atomic commits.
- Do not change assistant tone or system prompts.

## Approved Direction

- Scope: visual only
- Intensity: configurable
- Core aesthetic: classic digital rain
- Extra surfaces: home and sidebar decorations are allowed
- Easter egg: optional `/matrix` command
- Rain glyphs: mixed glyphs
- Default motion: subtle motion on
- Settings UX: presets first, advanced controls underneath

## Plugin Shape

### Package structure

- Create an npm-style package named `oc-plugin-matrix`
- Export both `./tui` and `./server` entrypoints from `package.json`
- Keep `./server` as a minimal host-compatible no-op entrypoint required by the loader

### Theme

- Provide a custom Matrix theme JSON
- Use a near-black background with a restrained green ramp
- Keep contrast strong enough for code, diffs, menus, and markdown

### TUI behavior

- Install and optionally activate the Matrix theme
- Persist plugin settings with KV storage
- Add a settings dialog with presets and advanced controls
- Register safe visual slots for home and sidebar atmosphere
- Render the home rain as a backdrop layer so the banner stays readable above it
- Trigger a temporary full-screen cinematic overlay only from `/matrix`
- Keep session and coding panes clean and readable

### Effects

- Use subtle global post-processing only
- Put most digital-rain motion into dedicated home/sidebar components
- Cap animation to a modest frame rate
- Ensure all stronger effects are optional or manually triggered

### Command

- Add `/matrix` as a short cinematic command
- Keep it manual, time-boxed, and easy to clean up on dispose
- Never auto-run it during normal work

## Settings

Planned settings include:

- `enabled`
- `theme`
- `set_theme`
- `preset` (`subtle`, `balanced`, `cinematic`)
- `rain`
- `rain_speed`
- `rain_density`
- `vignette`
- `glow`
- `sidebar`
- `home`

## TDD Execution Order

1. Create tests for configuration parsing and defaults
2. Implement the minimum config logic to pass
3. Create tests for preset behavior and setting overrides
4. Implement the minimum preset/override logic to pass
5. Create tests for any extracted pure effect helpers
6. Implement helpers with the smallest viable logic
7. Add integration-facing TUI files once covered by tests where practical
8. Run relevant tests after each change and keep the suite green

## Verification

- Run the relevant test suite throughout implementation
- Run formatting checks
- Verify the package structure and exported entrypoints
- Confirm the plugin remains non-intrusive during coding
- Confirm local `file:///` installation works through the real host loader
