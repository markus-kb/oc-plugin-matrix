# Matrix plugin for OpenCode

A visual-only OpenCode plugin that brings a subtle Matrix atmosphere to the terminal without getting in the way of coding.

Credits: this plugin was built with heavy inspiration from [`kommander/oc-plugin-vault-tec`](https://github.com/kommander/oc-plugin-vault-tec).

## Design goals

- Keep active coding surfaces readable
- Make the Matrix feel obvious on home and sidebar surfaces
- Default to subtle motion for long sessions
- Let users dial the effect up or down with presets and advanced controls
- Keep all cinematic behavior optional and manual

## Installation

> **Note:** This plugin is intentionally not being published to npm right now.
> Install it locally using the instructions below.

Install this repository as a local plugin package using its `file:///` path.

### Project-local install on Windows

1. Open PowerShell in the project where you want to use the plugin.

2. Set the path to this repository (replace with your actual path):

   ```powershell
   $repo = "C:/path/to/oc-plugin-matrix"
   ```

3. Install the plugin from that local path:

   ```powershell
   opencode plugin "file:///$repo"
   ```

   The `file:///` prefix tells OpenCode to load from a local directory instead of npm.
   PowerShell replaces `$repo` with the path you set in step 2.

This writes plugin config into your project's `.opencode` directory.

OpenCode creates:

```text
your-project/
  .opencode/
    opencode.jsonc
    tui.jsonc
```

`opencode.jsonc` gets the local package spec.
`tui.jsonc` gets the Matrix TUI config defaults.

Then start OpenCode in that project:

```powershell
opencode
```

### What this does

OpenCode reads this repository as a local package and detects both plugin targets:

```text
./server
./tui
```

That means:

- the package passes the host plugin loader
- the TUI plugin is registered through `tui.jsonc`
- Matrix defaults are applied from the package export config
- the host-compatible `./server` entrypoint is present even though the plugin behavior is visual-only

### Validation

This repository includes an E2E test that validates the local package install path with real OpenCode commands:

- `opencode plugin "file:///.../oc-plugin-matrix"`
- fixture `.opencode/opencode.jsonc` creation
- fixture `.opencode/tui.jsonc` creation
- host plugin loading through `opencode debug config --print-logs`

Run it with:

```powershell
npm test
```

### Package entrypoints

OpenCode reads these exports from `package.json`:

```json
{
  "exports": {
    "./server": {
      "import": "./src/server.ts"
    },
    "./tui": {
      "import": "./src/index.ts"
    }
  }
}
```

`./server` is a minimal no-op entrypoint required by the host loader.
`./tui` is the actual Matrix UI plugin.

## Features

- Custom Matrix theme
- Digital rain behind the home screen banner
- Ambient Matrix sidebar panel
- Subtle phosphor glow and vignette
- Presets-first settings dialog
- Optional `/matrix` cinematic burst command
- Full-screen cinematic takeover only while `/matrix` is active

## Commands

- Open `Matrix settings` from the command palette to adjust presets and advanced controls.
- Run `/matrix` for a short full-screen cinematic burst.

## Options

Plugin options can be configured via `opencode.json` and `tui.json`.

### TUI

- `enabled` (`boolean`, default `true`)
- `theme` (`string`, default `"matrix"`)
- `set_theme` (`boolean`, default `true`)
- `preset` (`"subtle" | "balanced" | "cinematic"`, default `"subtle"`)
- `home` (`boolean`, default `true`)
- `sidebar` (`boolean`, default `true`)
- `rain` (`boolean`, default `true`)
- `rain_speed` (`number`, default `0.045`)
- `rain_density` (`number`, default `0.32`)
- `vignette` (`number`, default `0.22`)
- `glow` (`number`, default `0.12`)

## Usage notes

- The default preset is tuned to stay out of your way during normal coding.
- The home banner is rendered above the backdrop rain so the landing screen stays readable.
- The strongest effect is manual: nothing auto-triggers the cinematic takeover during normal work.

## Release status

- Current package version: `1.0.0`
- `publishConfig.access` is set to `public` for future release work
- The package currently ships the `src/` tree via the `files` field
- npm publication is intentionally deferred

## Development

This repository follows strict Red -> Green -> Refactor TDD.

Run tests:

```bash
npm test
```

Run formatting:

```bash
npm run fmt
```
