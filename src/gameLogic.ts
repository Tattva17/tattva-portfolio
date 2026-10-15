import { projects } from "./projects";
export interface Point {
  x: number;
  y: number;
}
export const COURT_MIN = 7;
export const COURT_MAX = 93;
export const PLAYER_SPEED = 26; // Court units per second in the shared 100 × 100 space.
export const ACTIVATION_RADIUS = 11;
export const PROGRESS_KEY = "tattva-portfolio-unlocks-v1";
export function movePlayer(
  position: Point,
  direction: Point,
  elapsedSeconds: number,
): Point {
  const length = Math.hypot(direction.x, direction.y);
  if (!length) return position;
  const distance = PLAYER_SPEED * Math.max(0, elapsedSeconds);
  const clamp = (value: number) =>
    Math.max(COURT_MIN, Math.min(COURT_MAX, value));
  return {
    x: clamp(position.x + (direction.x / length) * distance),
    y: clamp(position.y + (direction.y / length) * distance),
  };
}
export function nearestSpot<T extends Point>(
  position: Point,
  spots: readonly T[],
  radius = ACTIVATION_RADIUS,
): T | null {
  let nearest: T | null = null;
  let distance = radius;
  // Array order breaks exact ties, so proximity is deterministic.
  for (const spot of spots) {
    const candidate = Math.hypot(position.x - spot.x, position.y - spot.y);
    if (candidate <= radius && (nearest === null || candidate < distance)) {
      nearest = spot;
      distance = candidate;
    }
  }
  return nearest;
}
export function meterPosition(elapsedMs: number): number {
  const cycle = (Math.max(0, elapsedMs) % 2400) / 1200;
  return (cycle <= 1 ? cycle : 2 - cycle) * 100;
}
export function isHit(position: number): boolean {
  return position >= 35 && position <= 65;
}
export function validateProgress(value: unknown): string[] {
  return Array.isArray(value)
    ? [
        ...new Set(
          value.filter(
            (id): id is string =>
              typeof id === "string" &&
              projects.some((project) => project.id === id),
          ),
        ),
      ]
    : [];
}
export function loadProgress(): string[] {
  try {
    return validateProgress(
      JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "[]"),
    );
  } catch {
    return [];
  }
}
export function saveProgress(ids: string[]) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(ids));
  } catch {
    /* Keep in-memory progress when storage is unavailable. */
  }
}
