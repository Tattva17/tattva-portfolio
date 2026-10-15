import { useEffect, useRef, useState } from "react";
import { projects, type Project } from "./projects";
import { ACTIVATION_RADIUS, isHit, meterPosition } from "./gameLogic";
import { useCourtMovement } from "./useCourtMovement";
import Story from "./Story";
function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(query.matches);
    query.addEventListener?.("change", change);
    return () => query.removeEventListener?.("change", change);
  }, []);
  return reduced;
}
export default function Game({
  unlocked,
  onUnlock,
  onReset,
}: {
  unlocked: string[];
  onUnlock: (id: string) => void;
  onReset: () => void;
}) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [phase, setPhase] = useState<"idle" | "aiming" | "miss">("idle");
  const [message, setMessage] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [manualAim, setManualAim] = useState(0);
  const reduced = useReducedMotion();
  const success = selected !== null && unlocked.includes(selected.id);
  const movementPaused = (selected !== null && !success) || confirmReset;
  const {
    court: courtRef,
    player: playerRef,
    nearby,
    getNearby,
    stop,
    begin,
    release,
    teleport: moveToSpot,
    step,
    isMovementKey,
  } = useCourtMovement(movementPaused);
  const panel = useRef<HTMLDivElement>(null);
  const meter = useRef<HTMLSpanElement>(null);
  const startedAt = useRef(0);
  const frame = useRef<number | null>(null);
  const shotActive = useRef(false);
  const ball = useRef<HTMLDivElement>(null);
  const ballAnimation = useRef<Animation | null>(null);
  function cancelMeter() {
    shotActive.current = false;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
  }
  function cancelBall() {
    ballAnimation.current?.cancel();
    ballAnimation.current = null;
  }
  useEffect(() => {
    if (phase !== "aiming" || reduced) return;
    let cancelled = false;
    const tick = (now: number) => {
      if (cancelled || !shotActive.current) return;
      if (meter.current)
        meter.current.style.left = `${meterPosition(now - startedAt.current)}%`;
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [phase, reduced]);
  useEffect(() => {
    const visibility = () => {
      if (document.hidden) {
        const wasAiming = shotActive.current;
        cancelMeter();
        cancelBall();
        if (wasAiming) {
          setPhase("idle");
          setMessage(
            "Attempt paused while the tab was hidden. Start a new shot when you’re ready.",
          );
        }
      }
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelMeter();
      cancelBall();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  useEffect(() => {
    if (!selected) return;
    // Leave the story visible, but give the court back immediately after unlocking.
    if (success) courtRef.current?.focus();
    else panel.current?.focus();
  }, [selected, success, courtRef]);
  useEffect(() => {
    // A mouse click on Start must also leave Space ready to release the shot.
    if (phase === "aiming" && !reduced) panel.current?.focus();
  }, [phase, reduced]);
  function open(project: Project, teleport = false) {
    cancelMeter();
    cancelBall();
    stop();
    if (teleport) moveToSpot(project);
    setSelected(project);
    setPhase("idle");
    setManualAim(0);
    setMessage("");
  }
  function close() {
    cancelMeter();
    cancelBall();
    setSelected(null);
    setPhase("idle");
    setMessage("");
    courtRef.current?.focus();
  }
  function start() {
    if (!selected || success || confirmReset || document.hidden) return;
    cancelMeter();
    cancelBall();
    setManualAim(0);
    setMessage("");
    startedAt.current = performance.now();
    shotActive.current = true;
    if (meter.current) meter.current.style.left = "0%";
    setPhase("aiming");
  }
  function shoot() {
    // Guard the result synchronously, including rapid clicks before React renders.
    if (!selected || !shotActive.current || phase !== "aiming") return;
    const aim = reduced
      ? manualAim
      : meterPosition(performance.now() - startedAt.current);
    cancelMeter();
    if (meter.current) meter.current.style.left = `${aim}%`;
    if (!isHit(aim)) {
      setPhase("miss");
      setMessage("Miss. This project is still locked. Try again!");
      return;
    }
    onUnlock(selected.id);
    setPhase("idle");
    setMessage(
      `${selected.name} unlocked! Keep moving on the court; the story stays open.`,
    );
    // Decorative animation is independent of access to the story.
    if (!reduced && ball.current?.animate) {
      try {
        ballAnimation.current = ball.current.animate(
          [
            {
              left: `${selected.x}%`,
              top: `${selected.y}%`,
              opacity: 1,
              transform: "translate(-50%, -50%) scale(1)",
            },
            {
              left: `${(selected.x + 50) / 2}%`,
              top: `${Math.max(1, selected.y / 2 - 12)}%`,
              opacity: 1,
              transform: "translate(-50%, -50%) scale(.8)",
            },
            {
              left: "50%",
              top: "16%",
              opacity: 0,
              transform: "translate(-50%, -50%) scale(.5)",
            },
          ],
          { duration: 650, easing: "ease-out" },
        );
      } catch {
        /* A failed decorative shot must never block the story. */
      }
    }
  }

  return (
    <section className="game-section" aria-labelledby="game-title">
      <p className="eyebrow">A DIFFERENT WAY IN</p>
      <div className="section-heading">
        <div>
          <h1 id="game-title">
            Find your spot<span>.</span>
          </h1>
          <p>Make shots. Unlock the stories behind my work.</p>
        </div>
        <span className="progress-count" aria-live="polite">
          {unlocked.length} of 6 unlocked
        </span>
      </div>
      <ol
        id="movement-instructions"
        className="game-instructions"
        aria-label="Game controls"
      >
        <li>
          <strong>Move</strong>
          <span>Arrow keys / WASD.</span>
        </li>
        <li>
          <strong>Interact</strong>
          <span>Enter near a spot.</span>
        </li>
        <li>
          <strong>Shoot</strong>
          <span>Space to start, then Space to release.</span>
        </li>
      </ol>
      <div className="game-layout">
        <div>
          <div
            ref={courtRef}
            className="court game-court"
            role="group"
            tabIndex={0}
            aria-label="Basketball movement court"
            aria-describedby="movement-instructions"
            onBlur={() => stop()}
            onKeyDown={(event) => {
              if (
                event.target !== event.currentTarget ||
                event.altKey ||
                event.ctrlKey ||
                event.metaKey
              )
                return;
              const key =
                event.key.length === 1 ? event.key.toLowerCase() : event.key;
              if (isMovementKey(key)) {
                if (!movementPaused) {
                  event.preventDefault();
                  begin(key);
                }
              } else if (key === "Enter" && !event.repeat && !movementPaused) {
                const spot = getNearby();
                if (spot) {
                  event.preventDefault();
                  open(spot);
                }
              }
            }}
            onKeyUp={(event) => {
              if (event.target === event.currentTarget)
                release(
                  event.key.length === 1 ? event.key.toLowerCase() : event.key,
                );
            }}
          >
            <svg
              className="court-lines"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <path d="M4 4H96V96H4ZM35 4V40H65V4M35 40A15 15 0 0 0 65 40M12 4V21C12 76 88 76 88 21V4M38 96A12 12 0 0 1 62 96" />
              <path className="backboard" d="M43 11H57" />
              <ellipse className="rim" cx="50" cy="16" rx="3.3" ry="2.2" />
              {projects.map((project) => (
                <circle
                  key={project.id}
                  className={`activation-radius ${nearby?.id === project.id ? "in-range" : ""}`}
                  cx={project.x}
                  cy={project.y}
                  r={ACTIVATION_RADIUS}
                />
              ))}
            </svg>
            <span className="court-wordmark" aria-hidden="true">
              THE BUILD COURT
            </span>
            {projects.map((project, index) => (
              <button
                key={project.id}
                className={`court-marker game-spot ${unlocked.includes(project.id) ? "unlocked" : ""}`}
                style={{ left: `${project.x}%`, top: `${project.y}%` }}
                disabled={movementPaused}
                aria-pressed={nearby?.id === project.id}
                aria-label={`${project.name} — ${unlocked.includes(project.id) ? "unlocked" : "locked"}`}
                onClick={() => open(project, true)}
              >
                <span className="marker-number">{index + 1}</span>
                {unlocked.includes(project.id) && (
                  <span className="spot-check" aria-hidden="true">
                    ✓
                  </span>
                )}
              </button>
            ))}
            <div
              ref={playerRef}
              className="court-player"
              style={{ left: "50%", top: "65%" }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 36 36">
                <ellipse
                  cx="18"
                  cy="20"
                  rx="15"
                  ry="9"
                  fill="#102839"
                  stroke="#fff2d9"
                  strokeWidth="2"
                />
                <path d="M12 16v12h12V16" fill="#63ced2" />
                <circle
                  cx="18"
                  cy="12"
                  r="7"
                  fill="#e8b184"
                  stroke="#102839"
                  strokeWidth="2"
                />
                <path
                  d="M12 8q6-7 12 0"
                  stroke="#292323"
                  strokeWidth="4"
                  fill="none"
                />
                <circle cx="29" cy="26" r="5" fill="#ed8d45" stroke="#582f19" />
                <path
                  d="M24 26h10M29 21v10"
                  stroke="#582f19"
                  strokeWidth=".8"
                />
              </svg>
            </div>
            <div ref={ball} className="shot-ball" aria-hidden="true">
              ◉
            </div>
          </div>
          <div className="nearby-prompt" role="status">
            {nearby ? (
              <>
                <strong>{nearby.name}</strong>
                <span>
                  Press Enter to{" "}
                  {unlocked.includes(nearby.id)
                    ? "view project"
                    : "start shooting"}
                  .
                </span>
              </>
            ) : (
              <>
                <strong>Walk into a project’s ring.</strong>
                <span>Or select a spot below to jump straight in.</span>
              </>
            )}
          </div>
          <div className="touch-controls">
            <div
              className="direction-pad"
              role="group"
              aria-label="Direction pad"
            >
              {[
                ["ArrowUp", "Move up", "↑"],
                ["ArrowLeft", "Move left", "←"],
                ["ArrowDown", "Move down", "↓"],
                ["ArrowRight", "Move right", "→"],
              ].map(([key, label, icon]) => (
                <button
                  key={key}
                  className={key}
                  aria-label={label}
                  disabled={movementPaused}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    courtRef.current?.focus();
                    event.currentTarget.setPointerCapture?.(event.pointerId);
                    begin(key);
                  }}
                  onPointerUp={() => stop()}
                  onPointerCancel={() => stop()}
                  onLostPointerCapture={() => stop()}
                  onClick={(event) => {
                    if (event.detail === 0) step(key);
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
            <button
              className="primary-button"
              disabled={!nearby || movementPaused}
              onClick={() => {
                if (nearby) open(nearby);
              }}
            >
              Interact ↗
            </button>
          </div>
          <details className="spot-picker" open>
            <summary>Select a spot</summary>
            <div
              className="project-key"
              role="group"
              aria-label="Select a spot"
            >
              {projects.map((project, index) => (
                <button
                  key={project.id}
                  disabled={movementPaused}
                  onClick={() => open(project, true)}
                >
                  <span className="key-number">{index + 1}</span>
                  <span className="key-project">
                    {project.name}
                    <small className="key-state">
                      {unlocked.includes(project.id) ? "✓ Unlocked" : "Locked"}
                    </small>
                  </span>
                </button>
              ))}
            </div>
          </details>
          <button
            className="subtle-button reset-progress"
            onClick={() => {
              stop();
              cancelMeter();
              cancelBall();
              setPhase("idle");
              setConfirmReset(true);
            }}
          >
            Reset game progress
          </button>
          {confirmReset && (
            <div
              className="reset-confirm"
              role="group"
              aria-label="Confirm progress reset"
            >
              <p>Clear all unlocked projects? This cannot be undone.</p>
              <button
                className="subtle-button"
                autoFocus
                onClick={() => {
                  setConfirmReset(false);
                  courtRef.current?.focus();
                }}
              >
                Keep progress
              </button>
              <button
                className="danger-button"
                onClick={() => {
                  onReset();
                  setConfirmReset(false);
                  close();
                }}
              >
                Confirm reset
              </button>
            </div>
          )}
        </div>
        <div
          className="game-panel"
          ref={panel}
          tabIndex={-1}
          aria-label="Game interaction"
          onKeyDown={(event) => {
            if (
              event.key === " " &&
              event.target === event.currentTarget &&
              selected &&
              !success &&
              !confirmReset
            ) {
              event.preventDefault();
              if (!event.repeat) {
                if (phase === "aiming") shoot();
                else start();
              }
            }
          }}
        >
          <p className="shot-message" role="status">
            {message}
          </p>
          {selected ? (
            success ? (
              <Story key={selected.id} project={selected} onClose={close} />
            ) : (
              <div className="shooting-panel">
                <div className="story-heading">
                  <p className="eyebrow">LOCKED PROJECT</p>
                  <button className="subtle-button" onClick={close}>
                    Close panel ×
                  </button>
                </div>
                <h2>{selected.name}</h2>
                <p>
                  Release inside the green target zone (35–65%) to unlock this
                  project.
                </p>
                {reduced && (
                  <p className="manual-note">
                    Reduced-motion aiming: choose a position with the slider,
                    then Shoot.
                  </p>
                )}
                <div className="shot-meter" aria-hidden="true">
                  <span className="target-zone">TARGET</span>
                  <span
                    ref={meter}
                    className="meter-indicator"
                    style={reduced ? { left: `${manualAim}%` } : undefined}
                  />
                </div>
                {phase === "aiming" ? (
                  <>
                    {reduced && (
                      <label className="aim-label">
                        Manual aim: {manualAim}%
                        <input
                          aria-label="Manual aim"
                          type="range"
                          min="0"
                          max="100"
                          value={manualAim}
                          onChange={(event) =>
                            setManualAim(Number(event.target.value))
                          }
                        />
                      </label>
                    )}
                    <button className="primary-button" onClick={shoot}>
                      Shoot
                    </button>
                    {!reduced && (
                      <p className="small-note">
                        Press Space to shoot, or use the Shoot button.
                      </p>
                    )}
                  </>
                ) : (
                  <button className="primary-button" onClick={start}>
                    {phase === "miss" ? "Try again" : "Start shot"}
                  </button>
                )}
              </div>
            )
          ) : (
            <div className="game-invitation">
              <p className="eyebrow">YOUR COURT. YOUR PACE.</p>
              <h2>
                Every spot has
                <br />a story.
              </h2>
              <p>
                Move into a ring and press Enter. Make a shot to unlock its
                project story, then keep exploring.
              </p>
              <p className="small-note">
                No opponents. No time limit. Just a little curiosity.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
