import { describe, expect, it } from "vitest"

import { BANNER_LINES, safeDimensions } from "../src/features/layout"

describe("BANNER_LINES", () => {
  it("has exactly 6 lines", () => {
    // The MATRIX banner must be exactly 6 rows tall so layout can reserve
    // a fixed number of rows and give the rest to rain.
    expect(BANNER_LINES).toHaveLength(6)
  })

  it("every line is a non-empty string", () => {
    expect(BANNER_LINES.every((l) => typeof l === "string" && l.length > 0)).toBe(true)
  })
})

describe("safeDimensions", () => {
  it("returns minimum 6 wide, 3 tall", () => {
    expect(safeDimensions(0, 0)).toEqual({ width: 6, height: 3 })
    expect(safeDimensions(-1, -5)).toEqual({ width: 6, height: 3 })
  })

  it("passes through values above minimums", () => {
    expect(safeDimensions(80, 24)).toEqual({ width: 80, height: 24 })
  })

  it("clamps only the axis that is below minimum", () => {
    expect(safeDimensions(80, 0)).toEqual({ width: 80, height: 3 })
    expect(safeDimensions(0, 24)).toEqual({ width: 6, height: 24 })
  })
})
