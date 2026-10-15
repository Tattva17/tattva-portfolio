import { describe, expect, it } from "vitest";
import {
  movePlayer,
  nearestSpot,
  meterPosition,
  isHit,
  validateProgress,
} from "./gameLogic";
describe("court math", () => {
  it("clamps movement to court boundaries", () => {
    expect(movePlayer({ x: 50, y: 50 }, { x: 1, y: 1 }, 100)).toEqual({
      x: 93,
      y: 93,
    });
    expect(movePlayer({ x: 50, y: 50 }, { x: -1, y: -1 }, 100)).toEqual({
      x: 7,
      y: 7,
    });
  });
  it("normalizes diagonals to the same speed as straight movement", () => {
    const start = { x: 50, y: 50 };
    const straight = movePlayer(start, { x: 1, y: 0 }, 0.5);
    const diagonal = movePlayer(start, { x: 1, y: 1 }, 0.5);
    expect(Math.hypot(diagonal.x - 50, diagonal.y - 50)).toBeCloseTo(
      straight.x - 50,
    );
  });
  it("is consistent across elapsed time segments and ignores zero direction", () => {
    const start = { x: 30, y: 30 };
    expect(
      movePlayer(movePlayer(start, { x: 1, y: 0 }, 0.2), { x: 1, y: 0 }, 0.3).x,
    ).toBeCloseTo(movePlayer(start, { x: 1, y: 0 }, 0.5).x);
    expect(movePlayer(start, { x: 0, y: 0 }, 1)).toEqual(start);
  });
  it("selects the nearest in-range spot and breaks ties by input order", () => {
    const spots = [
      { id: "first", x: 40, y: 50 },
      { id: "second", x: 60, y: 50 },
    ];
    expect(nearestSpot({ x: 51, y: 50 }, spots)?.id).toBe("second");
    expect(nearestSpot({ x: 50, y: 50 }, spots)?.id).toBe("first");
    expect(nearestSpot({ x: 10, y: 10 }, spots)).toBeNull();
    expect(nearestSpot({ x: 50, y: 50 }, [])).toBeNull();
  });
});
describe("shooting and storage math", () => {
  it("includes target boundaries and rejects misses", () => {
    [35, 50, 65].forEach((value) => expect(isHit(value)).toBe(true));
    [0, 34.99, 65.01, 100, NaN].forEach((value) =>
      expect(isHit(value)).toBe(false),
    );
  });
  it("uses an elapsed-time triangular meter", () => {
    expect(meterPosition(0)).toBe(0);
    expect(meterPosition(600)).toBe(50);
    expect(meterPosition(1200)).toBe(100);
    expect(meterPosition(1800)).toBe(50);
    expect(meterPosition(2400)).toBe(0);
  });
  it("validates and deduplicates stored IDs", () => {
    expect(validateProgress(["fab", "fake", "fab", 12, "robot"])).toEqual([
      "fab",
      "robot",
    ]);
    expect(validateProgress({ id: "fab" })).toEqual([]);
  });
});
