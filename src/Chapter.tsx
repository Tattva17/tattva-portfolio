import { useEffect, useRef, useState } from "react";
import ChapterScene from "./ChapterScene";
import { stories, type Project } from "./projects";
export interface ChapterData {
  id: "intelligence" | "building" | "impact";
  number: string;
  title: string;
  subtitle: string;
  ids: string[];
}
export const chapters: ChapterData[] = [
  {
    id: "intelligence",
    number: "01",
    title: "Intelligence",
    subtitle: "Making complex information useful.",
    ids: ["fab", "research"],
  },
  {
    id: "building",
    number: "02",
    title: "Building",
    subtitle: "Where code meets the physical world.",
    ids: ["robot", "wheelchair"],
  },
  {
    id: "impact",
    number: "03",
    title: "Impact",
    subtitle: "Useful starts with someone’s needs.",
    ids: ["medilog", "tutoropia"],
  },
];
export default function Chapter({
  chapter,
  projects,
  selected,
  onChoose,
}: {
  chapter: ChapterData;
  projects: Project[];
  selected: string | undefined;
  onChoose: (project: Project, source: HTMLElement) => void;
}) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(projects[0].id);
  // Filtering can remove the active project; render a valid fallback immediately.
  const current =
    projects.find((project) => project.id === active) ?? projects[0];
  useEffect(() => {
    const element = root.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        const nearest = [...visible].sort(
          (a, b) =>
            Math.abs(
              a.getBoundingClientRect().top - window.innerHeight * 0.35,
            ) -
            Math.abs(b.getBoundingClientRect().top - window.innerHeight * 0.35),
        )[0];
        if (nearest) setActive((nearest as HTMLElement).dataset.project!);
      },
      { rootMargin: "-20% 0px -35% 0px", threshold: 0 },
    );
    element
      .querySelectorAll("[data-project]")
      .forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [projects]);
  return (
    <section
      id={`chapter-${chapter.id}`}
      ref={root}
      className={`story-chapter chapter-${chapter.id}`}
      data-chapter={chapter.id}
      aria-labelledby={`heading-${chapter.id}`}
    >
      <header className="chapter-heading" data-reveal>
        <span className="chapter-number">{chapter.number}</span>
        <div>
          <p className="eyebrow">FROM IDEA TO IMPACT</p>
          <h3 id={`heading-${chapter.id}`}>
            {chapter.title}
            <span>.</span>
          </h3>
          <p>{chapter.subtitle}</p>
        </div>
      </header>
      <div className="chapter-layout">
        <div className="chapter-visual">
          <ChapterScene chapter={chapter.id} active={current.id} />
          <div className="scene-caption">
            <span className="eyebrow">IN FOCUS</span>
            <strong>{current.name}</strong>
            <small>Illustrative study / {chapter.number}</small>
          </div>
        </div>
        <div className="chapter-stories">
          {projects.map((project) => (
            <article
              key={project.id}
              className="chapter-project"
              data-project={project.id}
              data-reveal
              aria-labelledby={`title-${project.id}`}
            >
              <p className="eyebrow">{project.categories.join(" / ")}</p>
              <h4 id={`title-${project.id}`}>{project.name}</h4>
              <p className="project-lead">{project.overview}</p>
              <div className="chapter-context">
                <h5>The problem</h5>
                <p>{stories[project.id].problem}</p>
                <h5>My part in it</h5>
                <p>{project.contribution}</p>
              </div>
              <ul
                className="technology-list"
                aria-label={
                  project.id === "tutoropia"
                    ? "Focus areas"
                    : "Supported technologies and topics"
                }
              >
                {project.technologies.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button
                className="chapter-detail"
                aria-label={`Explore details: ${project.name}`}
                aria-pressed={selected === project.id}
                onClick={(event) => onChoose(project, event.currentTarget)}
              >
                Explore details <span aria-hidden="true">↗</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
