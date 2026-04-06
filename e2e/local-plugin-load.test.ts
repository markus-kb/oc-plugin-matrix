import { spawnSync, type SpawnSyncReturns } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { afterEach, describe, expect, it } from "vitest";

const created: string[] = [];

const command = process.platform === "win32" ? "opencode.cmd" : "opencode";
const repoSpec = pathToFileURL(resolve(".")).href;

const makeFixture = () => {
  const root = join(
    tmpdir(),
    `oc-plugin-matrix-e2e-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  );
  created.push(root);
  mkdirSync(root, { recursive: true });
  return root;
};

const run = (cwd: string, args: string[], timeout = 120000): SpawnSyncReturns<string> => {
  return spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 10,
    shell: process.platform === "win32",
    timeout,
  });
};

const output = (result: SpawnSyncReturns<string>) => `${result.stdout}\n${result.stderr}`;

afterEach(() => {
  while (created.length) {
    const next = created.pop();
    if (!next) continue;
    try {
      rmSync(next, { recursive: true, force: true });
    } catch {
      // Windows can keep the terminal process handle open briefly after kill.
    }
  }
});

describe("local plugin loading", () => {
  it("installs the local package spec and passes host loading without plugin errors", () => {
    const fixture = makeFixture();

    const install = run(fixture, ["plugin", repoSpec, "--print-logs"]);
    expect(install.status).toBe(0);
    expect(output(install)).toContain("Detected server + tui targets");
    expect(existsSync(join(fixture, ".opencode", "opencode.jsonc"))).toBe(true);
    expect(existsSync(join(fixture, ".opencode", "tui.jsonc"))).toBe(true);
    expect(readFileSync(join(fixture, ".opencode", "opencode.jsonc"), "utf8")).toContain(repoSpec);
    expect(readFileSync(join(fixture, ".opencode", "tui.jsonc"), "utf8")).toContain(
      '"theme": "matrix"',
    );

    const probe = run(fixture, ["debug", "config", "--print-logs"]);
    const probeLog = output(probe);

    expect(probe.status).toBe(0);
    expect(probeLog).toContain(`service=plugin path=${repoSpec} loading plugin`);
    expect(probeLog).not.toMatch(
      /failed to load plugin|plugin has no server entrypoint|Cannot find module/i,
    );
  }, 30000);
});
