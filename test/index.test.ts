import { describe, expect, it } from "vitest";

import { VERSION } from "../src/version";

describe("plugin version module", () => {
  it("matches the current package release version", () => {
    expect(VERSION).toBe("1.0.0");
  });
});
