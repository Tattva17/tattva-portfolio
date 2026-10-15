import { act, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Explorer from "./Explorer";
type ObserverRecord = {
  callback: IntersectionObserverCallback;
  elements: Element[];
  disconnect: () => void;
};
const records: ObserverRecord[] = [];
function entry(target: Element): IntersectionObserverEntry {
  const rect = target.getBoundingClientRect();
  return {
    target,
    isIntersecting: true,
    boundingClientRect: rect,
    intersectionRect: rect,
    intersectionRatio: 1,
    rootBounds: null,
    time: 0,
  };
}
function installObserver() {
  records.length = 0;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      record: ObserverRecord;
      constructor(callback: IntersectionObserverCallback) {
        this.record = { callback, elements: [], disconnect: vi.fn() };
        records.push(this.record);
      }
      observe(element: Element) {
        this.record.elements.push(element);
      }
      disconnect() {
        this.record.disconnect();
      }
    },
  );
}
afterEach(() => vi.unstubAllGlobals());
describe("scroll enhancements", () => {
  it("updates the active illustration label from observed project visibility and cleans up observers", () => {
    installObserver();
    const { unmount } = render(<Explorer />);
    const research = screen.getByRole("article", { name: "AI Research" });
    const observer = records.find((record) =>
      record.elements.includes(research),
    )!;
    act(() => observer.callback([entry(research)], {} as IntersectionObserver));
    const intelligence = within(
      screen.getByRole("region", { name: "Intelligence." }),
    );
    expect(
      intelligence.getByText("AI Research", {
        selector: ".scene-caption strong",
      }),
    ).toBeVisible();
    const chapter = screen.getByRole("region", { name: "Building." });
    const thread = records.find((record) => record.elements.includes(chapter))!;
    act(() => thread.callback([entry(chapter)], {} as IntersectionObserver));
    expect(document.querySelector(".scroll-explore")).toHaveAttribute(
      "data-active-chapter",
      "building",
    );
    unmount();
    records.forEach((record) => expect(record.disconnect).toHaveBeenCalled());
  });
  it("keeps every project readable when observation is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    render(<Explorer />);
    const gallery = within(
      screen.getByRole("group", { name: "Project gallery" }),
    );
    expect(
      gallery.getAllByRole("button", { name: /Explore details:/ }),
    ).toHaveLength(6);
    expect(screen.getByRole("article", { name: "Tutoropia" })).toBeVisible();
  });
  it("coalesces scroll frames and removes pending work on unmount", () => {
    let id = 0;
    const pending = new Map<number, FrameRequestCallback>();
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((callback: FrameRequestCallback) => {
        pending.set(++id, callback);
        return id;
      }),
    );
    vi.stubGlobal(
      "cancelAnimationFrame",
      vi.fn((frame: number) => pending.delete(frame)),
    );
    const { unmount } = render(<Explorer />);
    expect(pending.size).toBe(1);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
      window.dispatchEvent(new Event("scroll"));
    });
    expect(pending.size).toBe(1);
    unmount();
    expect(pending.size).toBe(0);
    act(() => window.dispatchEvent(new Event("scroll")));
    expect(pending.size).toBe(0);
  });
});
