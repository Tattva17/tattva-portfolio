import { useCallback, useEffect, useRef, useState } from "react";
import { movePlayer, nearestSpot, type Point } from "./gameLogic";
import { projects, type Project } from "./projects";
const directions: Record<string, Point> = {
  ArrowUp: { x: 0, y: -1 },
  w: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  s: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  a: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  d: { x: 1, y: 0 },
};
export function useCourtMovement(paused: boolean) {
  const court = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLDivElement>(null);
  const position = useRef<Point>({ x: 50, y: 65 });
  const nearbyRef = useRef<Project | null>(null);
  const [nearby, setNearby] = useState<Project | null>(null);
  const held = useRef(new Set<string>());
  const frame = useRef<number | null>(null);
  const lastTime = useRef<number | null>(null);
  const stop = useCallback(() => {
    held.current.clear();
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    lastTime.current = null;
  }, []);
  const place = useCallback((point: Point) => {
    position.current = point;
    if (player.current) {
      player.current.style.left = `${point.x}%`;
      player.current.style.top = `${point.y}%`;
    }
    const next = nearestSpot(point, projects);
    // Only proximity changes need React renders; movement updates one decorative element.
    if (nearbyRef.current?.id !== next?.id) {
      nearbyRef.current = next;
      setNearby(next);
    }
  }, []);
  const begin = useCallback(
    (key: string) => {
      if (paused || document.hidden || !directions[key]) return;
      held.current.add(key);
      if (frame.current !== null) return;
      lastTime.current = performance.now();
      const tick = (now: number) => {
        if (!held.current.size) {
          stop();
          return;
        }
        let x = 0,
          y = 0;
        held.current.forEach((item) => {
          x += directions[item].x;
          y += directions[item].y;
        });
        // Clamp long stalls; a hidden tab cannot cause a large resume jump.
        const elapsed = Math.min(
          (now - (lastTime.current ?? now)) / 1000,
          0.05,
        );
        lastTime.current = now;
        place(movePlayer(position.current, { x, y }, elapsed));
        frame.current = requestAnimationFrame(tick);
      };
      frame.current = requestAnimationFrame(tick);
    },
    [paused, place, stop],
  );
  useEffect(() => {
    const visibility = () => {
      if (document.hidden) stop();
    };
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      stop();
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [stop]);
  useEffect(() => {
    if (paused) stop();
  }, [paused, stop]);
  function release(key: string) {
    held.current.delete(key);
    if (!held.current.size) stop();
  }
  function teleport(project: Project) {
    stop();
    place({ x: project.x, y: project.y });
  }
  function step(key: string) {
    if (!paused && directions[key]) {
      stop();
      place(movePlayer(position.current, directions[key], 0.18));
    }
  }
  return {
    court,
    player,
    nearby,
    getNearby: () => nearbyRef.current,
    stop,
    begin,
    release,
    teleport,
    step,
    isMovementKey: (key: string) => key in directions,
  };
}
