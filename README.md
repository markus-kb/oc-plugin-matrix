# oc-plugin-matrix

A visual-only OpenCode plugin that adds a Matrix-style atmosphere (rain, glow, vignette, home/sidebar styling) while keeping coding surfaces readable.

Inspired by [`kommander/oc-plugin-vault-tec`](https://github.com/kommander/oc-plugin-vault-tec).

## Features

- Matrix theme preset for OpenCode TUI
- Home-screen rain backdrop with readable foreground banner
- Optional sidebar ambience
- Configurable intensity via presets and advanced controls
- `/matrix` command for short cinematic takeover

## Installation (Local)

This plugin is currently intended for local package installation via `file:///`.

### Windows (PowerShell)

```powershell
$repo = "C:/path/to/oc-plugin-matrix"
opencode plugin "file:///$repo"
```

### macOS / Linux (bash/zsh)

```bash
repo="/path/to/oc-plugin-matrix"
opencode plugin "file://$repo"
```

OpenCode writes project-level plugin config into `.opencode/`.

## Commands

- `Matrix settings` (from command palette): presets and advanced controls
- `/matrix`: short cinematic burst

## Configuration

Defaults are shipped through the `./tui` export config in `package.json`.

TUI options:

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

## Development

```bash
npm ci
npm run fmt:check
npm run test:unit
```

Optional local E2E (requires `opencode` CLI available in PATH):

```bash
npm run test:e2e
```

## License

MIT
