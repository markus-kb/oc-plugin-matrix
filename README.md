# Matrix plugin for OpenCode

A visual-only OpenCode plugin that brings a subtle Matrix atmosphere to the terminal without getting in the way of coding.

## Design goals

- Keep active coding surfaces readable
- Make the Matrix feel obvious on home and sidebar surfaces
- Default to subtle motion for long sessions
- Let users dial the effect up or down with presets and advanced controls
- Keep all cinematic behavior optional and manual

## Installation

> **Note:** This plugin is intentionally not being published to npm right now.
> Install it locally using the instructions below.

The validated local install path is to install this repository as a local plugin package using its `file:///` path.

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

### Verified local E2E path

This repository now includes an E2E test that validates the local package install path with real OpenCode commands:

- `opencode plugin "file:///.../oc-plugin-matrix"`
- fixture `.opencode/opencode.jsonc` creation
- fixture `.opencode/tui.jsonc` creation
- host plugin loading through `opencode debug config --print-logs`

Run it with:

```powershell
npm test
```

### Why the old folder-copy method was wrong here

Copying this repository into `.opencode/plugins/` does not match how this plugin is packaged.

This repository is an OpenCode plugin package with `./server` and `./tui` exports in `package.json`, so the correct local path is package installation by `file:///...`, not blind folder copying.

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
- Use the command palette and open `Matrix settings` to adjust the look interactively.
- Run `/matrix` whenever you want a short burst of stronger atmosphere.
- The home banner is rendered above the backdrop rain so the landing screen stays readable.

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
