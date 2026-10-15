import { useEffect, type RefObject } from "react";

/** Enhance native scrolling; text and navigation never depend on these effects. */
export function useScrollStory(
  rootRef: RefObject<HTMLDivElement | null>,
  revision: string,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | null = null;
    let observer: IntersectionObserver | null = null;
    const renderProgress = () => {
      frame = null;
      if (media.matches) return;
      const story = root.querySelector<HTMLElement>(".chapter-collection");
      const hero = root.querySelector<HTMLElement>(".creative-hero");
      if (story) {
        const rect = story.getBoundingClientRect();
        const progress = Math.max(
          0,
          Math.min(
            1,
            (window.innerHeight * 0.5 - rect.top) / Math.max(1, rect.height),
          ),
        );
        root.style.setProperty("--story-progress", String(progress));
      }
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const progress = Math.max(
          0,
          Math.min(1, -rect.top / Math.max(1, rect.height)),
        );
        root.style.setProperty("--hero-drift", `${progress * 28}px`);
        root.style.setProperty("--hero-emphasis", String(1 - progress * 0.28));
      }
    };
    const schedule = () => {
      if (!media.matches && frame === null)
        frame = requestAnimationFrame(renderProgress);
    };
    const motionChange = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      root.style.removeProperty("--hero-drift");
      root.style.removeProperty("--hero-emphasis");
      if (media.matches) root.style.removeProperty("--story-progress");
      else schedule();
    };
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add("reveal-seen");
            const chapter = (entry.target as HTMLElement).dataset.chapter;
            if (chapter) root.dataset.activeChapter = chapter;
          }
        },
        { rootMargin: "-12% 0px -18% 0px", threshold: 0.12 },
      );
      root
        .querySelectorAll("[data-reveal], [data-chapter]")
        .forEach((element) => observer?.observe(element));
    }
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener?.("change", motionChange);
    schedule();
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener?.("change", motionChange);
    };
  }, [rootRef, revision]);
}
