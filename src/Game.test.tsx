import { useState } from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Game from "./Game";
let now = 0;
let frames: Map<number, FrameRequestCallback>;
let nextFrame = 0;
function advance(ms: number) {
  act(() => {
    now += ms;
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(now));
  });
}
function Harness({ initial = [] }: { initial?: string[] }) {
  const [unlocked, setUnlocked] = useState(initial);
  return (
    <Game
      unlocked={unlocked}
      onUnlock={(id) => setUnlocked((current) => [...current, id])}
      onReset={() => setUnlocked([])}
    />
  );
}
const court = () =>
  screen.getByRole("group", { name: "Basketball movement court" });
const spot = (name: string) =>
  within(screen.getByRole("group", { name: "Select a spot" })).getByRole(
    "button",
    { name: new RegExp(name) },
  );
function player() {
  return court().querySelector<HTMLElement>(".court-player")!;
}
beforeEach(() => {
  now = 0;
  nextFrame = 0;
  frames = new Map();
  vi.spyOn(performance, "now").mockImplementation(() => now);
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    const id = ++nextFrame;
    frames.set(id, callback);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => frames.delete(id));
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
describe("movable player", () => {
  it("Enter does nothing out of range, then activates the nearest spot after movement", () => {
    render(<Harness />);
    court().focus();
    fireEvent.keyDown(court(), { key: "Enter" });
    expect(
      screen.queryByRole("button", { name: "Start shot" }),
    ).not.toBeInTheDocument();
    fireEvent.keyDown(court(), { key: "ArrowUp" });
    for (let i = 0; i < 30; i++) advance(16);
    fireEvent.keyUp(court(), { key: "ArrowUp" });
    expect(screen.getByText("Press Enter to start shooting.")).toBeVisible();
    fireEvent.keyDown(court(), { key: "Enter" });
    expect(screen.getByRole("heading", { name: "Talk to Fab" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Start shot" })).toBeVisible();
  });
  it("alternative controls teleport to the chosen spot and pause while shooting, then restore focus and position", async () => {
    render(<Harness />);
    await userEvent.click(spot("MyMediLog"));
    expect(player().style.left).toBe("16%");
    expect(player().style.top).toBe("32%");
    fireEvent.keyDown(court(), { key: "ArrowDown" });
    advance(100);
    expect(player().style.top).toBe("32%");
    await userEvent.click(
      screen.getByRole("button", { name: "Close panel ×" }),
    );
    expect(court()).toHaveFocus();
    expect(player().style.top).toBe("32%");
  });
  it("allows movement while keeping an unlocked story visible", async () => {
    render(<Harness initial={["robot"]} />);
    await userEvent.click(spot("Ball Tracking Robot"));
    expect(
      screen.getByRole("article", { name: "Ball Tracking Robot case study" }),
    ).toBeVisible();
    fireEvent.keyDown(court(), { key: "d" });
    advance(100);
    expect(parseFloat(player().style.left)).toBeGreaterThan(19);
    expect(
      screen.getByRole("article", { name: "Ball Tracking Robot case study" }),
    ).toBeVisible();
    fireEvent.keyUp(court(), { key: "d" });
    expect(
      screen.queryByRole("button", { name: "Start shot" }),
    ).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "Close story ×" }),
    );
    expect(court()).toHaveFocus();
  });
  it("stops held keys on blur, visibility change, and unmount", () => {
    const { unmount } = render(<Harness />);
    court().focus();
    fireEvent.keyDown(court(), { key: "d" });
    advance(16);
    const x = player().style.left;
    fireEvent.blur(court());
    advance(100);
    expect(player().style.left).toBe(x);
    court().focus();
    fireEvent.keyDown(court(), { key: "d" });
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    fireEvent(document, new Event("visibilitychange"));
    advance(100);
    expect(player().style.left).toBe(x);
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    fireEvent.keyDown(court(), { key: "d" });
    expect(frames.size).toBeGreaterThan(0);
    unmount();
    expect(frames.size).toBe(0);
  });
  it("does not capture keys on project buttons or other controls", () => {
    render(<Harness />);
    const button = spot("MyMediLog");
    button.focus();
    const event = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      bubbles: true,
      cancelable: true,
    });
    fireEvent(button, event);
    expect(event.defaultPrevented).toBe(false);
    expect(frames.size).toBe(0);
  });
  it("supports direction pad keyboard steps and Interact without precise movement", async () => {
    render(<Harness />);
    const up = screen.getByRole("button", { name: "Move up" });
    for (let i = 0; i < 3; i++) {
      up.focus();
      await userEvent.keyboard("{Enter}");
    }
    expect(screen.getByRole("button", { name: "Interact ↗" })).toBeEnabled();
    await userEvent.click(screen.getByRole("button", { name: "Interact ↗" }));
    expect(screen.getByRole("heading", { name: "Talk to Fab" })).toBeVisible();
  });
  it("supports held touch movement and stops on release", () => {
    render(<Harness />);
    const right = screen.getByRole("button", { name: "Move right" });
    fireEvent.pointerDown(right, { pointerId: 1 });
    advance(16);
    expect(parseFloat(player().style.left)).toBeGreaterThan(50);
    fireEvent.pointerUp(right, { pointerId: 1 });
    const x = player().style.left;
    advance(100);
    expect(player().style.left).toBe(x);
  });
});
describe("shooting UI", () => {
  it("a timed hit unlocks the selected story immediately", async () => {
    render(<Harness />);
    await userEvent.click(spot("Talk to Fab"));
    await userEvent.click(screen.getByRole("button", { name: "Start shot" }));
    advance(600);
    await userEvent.click(screen.getByRole("button", { name: "Shoot" }));
    expect(screen.getByText("1 of 6 unlocked")).toBeVisible();
    expect(
      screen.getByRole("article", { name: "Talk to Fab case study" }),
    ).toBeVisible();
    expect(frames.size).toBe(0);
  });
  it("a miss stays locked and permits retry without duplicate unlocks", async () => {
    render(<Harness />);
    await userEvent.click(spot("AI Research"));
    await userEvent.click(screen.getByRole("button", { name: "Start shot" }));
    advance(100);
    await userEvent.click(screen.getByRole("button", { name: "Shoot" }));
    expect(
      screen.getByText(/Miss. This project is still locked/),
    ).toBeVisible();
    expect(screen.getByText("0 of 6 unlocked")).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    advance(600);
    await userEvent.dblClick(screen.getByRole("button", { name: "Shoot" }));
    expect(screen.getByText("1 of 6 unlocked")).toBeVisible();
  });
  it("reduced motion uses manual aiming with the same hit rules", async () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
    } as MediaQueryList);
    render(<Harness />);
    await userEvent.click(spot("Tutoropia"));
    await userEvent.click(screen.getByRole("button", { name: "Start shot" }));
    const slider = screen.getByRole("slider", { name: "Manual aim" });
    expect(slider).toHaveValue("0");
    fireEvent.change(slider, { target: { value: "35" } });
    await userEvent.click(screen.getByRole("button", { name: "Shoot" }));
    expect(
      screen.getByRole("article", { name: "Tutoropia case study" }),
    ).toBeVisible();
  });
  it("reset requires explicit confirmation and cancellation preserves progress", async () => {
    render(<Harness initial={["fab"]} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Reset game progress" }),
    );
    expect(screen.getByText("1 of 6 unlocked")).toBeVisible();
    await userEvent.click(
      screen.getByRole("button", { name: "Keep progress" }),
    );
    expect(screen.getByText("1 of 6 unlocked")).toBeVisible();
    await userEvent.click(
      screen.getByRole("button", { name: "Reset game progress" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Confirm reset" }),
    );
    expect(screen.getByText("0 of 6 unlocked")).toBeVisible();
  });
  it("hiding the tab cancels the attempt without a miss and permits restart", async () => {
    render(<Harness />);
    await userEvent.click(spot("Talk to Fab"));
    await userEvent.click(screen.getByRole("button", { name: "Start shot" }));
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    fireEvent(document, new Event("visibilitychange"));
    expect(frames.size).toBe(0);
    expect(screen.getByText(/Attempt paused/)).toBeVisible();
    expect(screen.queryByText(/Miss\./)).not.toBeInTheDocument();
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    await userEvent.click(screen.getByRole("button", { name: "Start shot" }));
    expect(screen.getByRole("button", { name: "Shoot" })).toBeVisible();
  });
  it("closing or unmounting cancels active meter frames", async () => {
    const { unmount } = render(<Harness />);
    await userEvent.click(spot("MyMediLog"));
    await userEvent.click(screen.getByRole("button", { name: "Start shot" }));
    expect(frames.size).toBe(1);
    await userEvent.click(
      screen.getByRole("button", { name: "Close panel ×" }),
    );
    expect(frames.size).toBe(0);
    await userEvent.click(spot("MyMediLog"));
    await userEvent.click(screen.getByRole("button", { name: "Start shot" }));
    unmount();
    expect(frames.size).toBe(0);
  });
  it("Space shoots only when the panel itself is active, without overriding a focused button", async () => {
    render(<Harness />);
    await userEvent.click(spot("MyMediLog"));
    await userEvent.click(screen.getByRole("button", { name: "Start shot" }));
    const shoot = screen.getByRole("button", { name: "Shoot" });
    const event = new KeyboardEvent("keydown", {
      key: " ",
      bubbles: true,
      cancelable: true,
    });
    fireEvent(shoot, event);
    expect(event.defaultPrevented).toBe(false);
    advance(600);
    const panel = screen.getByLabelText("Game interaction");
    panel.focus();
    fireEvent.keyDown(panel, { key: " " });
    expect(
      screen.getByRole("article", { name: "MyMediLog case study" }),
    ).toBeVisible();
  });
  it("cancels the decorative ball on close and reset and never delays story access", async () => {
    const cancel = vi.fn();
    const animate = vi.fn(() => ({ cancel }));
    Object.defineProperty(HTMLElement.prototype, "animate", {
      configurable: true,
      value: animate,
    });
    try {
      render(<Harness />);
      await userEvent.click(spot("MyMediLog"));
      await userEvent.click(screen.getByRole("button", { name: "Start shot" }));
      advance(600);
      await userEvent.click(screen.getByRole("button", { name: "Shoot" }));
      expect(
        screen.getByRole("article", { name: "MyMediLog case study" }),
      ).toBeVisible();
      expect(animate).toHaveBeenCalledTimes(1);
      await userEvent.click(
        screen.getByRole("button", { name: "Close story ×" }),
      );
      expect(cancel).toHaveBeenCalledTimes(1);
      await userEvent.click(spot("Talk to Fab"));
      await userEvent.click(screen.getByRole("button", { name: "Start shot" }));
      advance(600);
      await userEvent.click(screen.getByRole("button", { name: "Shoot" }));
      await userEvent.click(
        screen.getByRole("button", { name: "Reset game progress" }),
      );
      expect(cancel).toHaveBeenCalledTimes(2);
    } finally {
      delete (HTMLElement.prototype as Partial<HTMLElement>).animate;
    }
  });
  it("Space starts aiming and releases the shot, then movement resumes without closing the story", async () => {
    render(<Harness />);
    await userEvent.click(spot("Talk to Fab"));
    expect(screen.getByLabelText("Game interaction")).toHaveFocus();
    await userEvent.keyboard(" ");
    expect(screen.getByRole("button", { name: "Shoot" })).toBeVisible();
    advance(600);
    await userEvent.keyboard(" ");
    expect(
      screen.getByRole("article", { name: "Talk to Fab case study" }),
    ).toBeVisible();
    expect(court()).toHaveFocus();
    const x = parseFloat(player().style.left);
    fireEvent.keyDown(court(), { key: "d" });
    advance(16);
    fireEvent.keyUp(court(), { key: "d" });
    expect(parseFloat(player().style.left)).toBeGreaterThan(x);
    expect(
      screen.getByRole("article", { name: "Talk to Fab case study" }),
    ).toBeVisible();
    await userEvent.click(spot("AI Research"));
    expect(screen.getByRole("heading", { name: "AI Research" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Start shot" })).toBeVisible();
  });
  it("clicking Start shot leaves Space ready to shoot immediately", async () => {
    render(<Harness />);
    await userEvent.click(spot("MyMediLog"));
    await userEvent.click(screen.getByRole("button", { name: "Start shot" }));
    expect(screen.getByLabelText("Game interaction")).toHaveFocus();
    advance(600);
    await userEvent.keyboard(" ");
    expect(
      screen.getByRole("article", { name: "MyMediLog case study" }),
    ).toBeVisible();
  });
});
