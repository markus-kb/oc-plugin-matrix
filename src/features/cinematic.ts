/**
 * Pure helpers for the cinematic burst effect and home-route detection.
 *
 * Kept in a separate module so they can be unit-tested without pulling in any
 * JSX runtime or TUI dependencies.
 */

/** Duration of a single cinematic burst in milliseconds. */
export const BURST_DURATION_MS = 4500;

/**
 * The discriminated-union shape that OpenCode's api.route.current returns.
 * Only the fields we care about are declared here; extra params are ignored.
 */
export type RouteShape =
  | { name: "home" }
  | { name: "session"; params: { sessionID: string; [key: string]: unknown } }
  | { name: string; params?: Record<string, unknown> };

/**
 * Returns true only when the current route is the home screen.
 * Used to gate the background rain so it doesn't render during sessions.
 */
export const isHomeRoute = (route: RouteShape): boolean => route.name === "home";

/**
 * Returns a [0, 1] ramp value representing how far through the burst we are.
 *
 * - Returns 1 at the instant of trigger (now === deadline - BURST_DURATION_MS)
 * - Decreases linearly toward 0 as `now` approaches `deadline`
 * - Returns 0 when `deadline` is 0 (no burst triggered) or has already passed
 *
 * This is intentionally a pure function so it can be called in tests with
 * arbitrary timestamps rather than relying on real wall-clock time.
 */
export const burstRamp = (now: number, deadline: number): number => {
  if (deadline <= 0) return 0;
  const remaining = deadline - now;
  if (remaining <= 0) return 0;
  return Math.min(1, remaining / BURST_DURATION_MS);
};
