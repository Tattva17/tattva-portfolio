import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { PROGRESS_KEY } from "./gameLogic";
beforeEach(() => {
  localStorage.clear();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});
async function enterGame() {
  await userEvent.click(
    screen.getByRole("button", { name: "Enter portfolio" }),
  );
  await userEvent.click(screen.getByRole("button", { name: /Game mode/ }));
}
describe("portfolio screens and progress", () => {
  it.each(["pointer", "keyboard"])(
    "name-only period entrance works with %s",
    async (input) => {
      render(<App />);
      const entry = screen.getByRole("button", { name: "Enter portfolio" });
      expect(entry).toHaveTextContent(".");
      expect(screen.getByRole("main").textContent).toMatch(
        /^Tattva IshaanHarish\.$/,
      );
      expect(
        screen.queryByText(/Built with curiosity/),
      ).not.toBeInTheDocument();
      if (input === "keyboard") {
        entry.focus();
        await userEvent.keyboard("{Enter}");
      } else await userEvent.click(entry);
      expect(
        screen.getByRole("button", { name: /Get to know my work/ }),
      ).toBeVisible();
      expect(screen.getByRole("button", { name: /Make shots/ })).toBeVisible();
    },
  );
  it("enters Explore, switches modes and returns Home with focus management", async () => {
    render(<App />);
    await userEvent.click(
      screen.getByRole("button", { name: "Enter portfolio" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Get to know my work/ }),
    );
    expect(
      screen.getByRole("heading", { name: /I like turning complicated/ }),
    ).toBeVisible();
    const nav = within(
      screen.getByRole("navigation", { name: "Portfolio mode" }),
    );
    await userEvent.click(nav.getByRole("button", { name: "Game" }));
    expect(
      screen.getByRole("heading", { name: "Find your spot." }),
    ).toBeVisible();
    expect(screen.getByRole("main")).toHaveFocus();
    await userEvent.click(nav.getByRole("button", { name: "Home" }));
    expect(screen.getByRole("button", { name: /Game mode/ })).toBeVisible();
  });
  it("restores validated saved progress and preserves it across mode changes", async () => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(["fab", "fake", "fab"]));
    render(<App />);
    await enterGame();
    expect(screen.getByText("1 of 6 unlocked")).toBeVisible();
    await userEvent.click(
      within(
        screen.getByRole("navigation", { name: "Portfolio mode" }),
      ).getByRole("button", { name: "Explore" }),
    );
    await userEvent.click(
      within(
        screen.getByRole("navigation", { name: "Portfolio mode" }),
      ).getByRole("button", { name: "Game" }),
    );
    expect(screen.getByText("1 of 6 unlocked")).toBeVisible();
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!)).toEqual(["fab"]);
  });
  it("handles malformed or unavailable storage safely", async () => {
    localStorage.setItem(PROGRESS_KEY, "{broken");
    const { unmount } = render(<App />);
    await enterGame();
    expect(screen.getByText("0 of 6 unlocked")).toBeVisible();
    unmount();
    const get = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("blocked");
      });
    const set = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("blocked");
      });
    render(<App />);
    await enterGame();
    expect(screen.getByText("0 of 6 unlocked")).toBeVisible();
    get.mockRestore();
    set.mockRestore();
  });
  it("stores a successful manual shot and restores it after remount", async () => {
    const media = vi
      .spyOn(window, "matchMedia")
      .mockReturnValue({ matches: true } as MediaQueryList);
    const { unmount } = render(<App />);
    await enterGame();
    const picker = within(screen.getByRole("group", { name: "Select a spot" }));
    await userEvent.click(picker.getByRole("button", { name: /Tutoropia/ }));
    await userEvent.click(screen.getByRole("button", { name: "Start shot" }));
    fireEvent.change(screen.getByRole("slider"), { target: { value: "50" } });
    await userEvent.click(screen.getByRole("button", { name: "Shoot" }));
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!)).toEqual([
      "tutoropia",
    ]);
    unmount();
    render(<App />);
    await enterGame();
    expect(screen.getByText("1 of 6 unlocked")).toBeVisible();
    media.mockRestore();
  });
});
