import { useEffect, useRef, useState, type ReactNode } from "react";
import Chapter, { chapters } from "./Chapter";
import ChapterScene from "./ChapterScene";
import { useScrollStory } from "./useScrollStory";
import Story from "./Story";
import {
  categories,
  filterStories,
  projects,
  supportedTechnologies,
  type Category,
  type Project,
} from "./projects";
const perspectives = {
  Think: {
    kind: "think",
    text: "I explore how AI can make complex information useful—from financial market research to natural-language analysis of semiconductor fab data.",
    ids: ["research", "fab"],
  },
  Build: {
    kind: "build",
    text: "I enjoy connecting software to the physical world through a ball-tracking robot and engineering work on head-gesture wheelchair control specifications.",
    ids: ["robot", "wheelchair"],
  },
  Connect: {
    kind: "connect",
    text: "I build with people in mind: digitizing prescriptions with MyMediLog and helping students access free tutoring through Tutoropia.",
    ids: ["medilog", "tutoropia"],
  },
};
export default function Explorer({ children }: { children?: ReactNode }) {
  const [perspective, setPerspective] =
    useState<keyof typeof perspectives>("Think");
  const [category, setCategory] = useState<Category>("All");
  const [technology, setTechnology] = useState("");
  const [selected, setSelected] = useState<Project | null>(null);
  const origin = useRef<HTMLElement | null>(null);
  const story = useRef<HTMLDivElement>(null);
  const gallery = useRef<HTMLElement>(null);
  const scrollRoot = useRef<HTMLDivElement>(null);
  useScrollStory(scrollRoot, `${category}:${technology}`);
  const matching = filterStories(projects, category, technology);
  const intro = perspectives[perspective];

  useEffect(() => {
    if (!selected) return;
    // Cancel pending focus work when switching stories or leaving Explore.
    const frame = requestAnimationFrame(() => {
      story.current?.focus();
      story.current?.scrollIntoView?.({ block: "start", behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [selected]);
  function choose(project: Project, source: HTMLElement) {
    origin.current = source;
    setSelected(project);
  }
  function apply(nextCategory: Category, nextTechnology: string) {
    setCategory(nextCategory);
    setTechnology(nextTechnology);
    if (
      selected &&
      !filterStories([selected], nextCategory, nextTechnology).length
    )
      setSelected(null);
  }
  function related(project: Project, source: HTMLElement) {
    apply("All", "");
    choose(project, source);
  }
  return (
    <div
      className="scroll-explore"
      ref={scrollRoot}
      data-active-chapter="intelligence"
    >
      <section className="creative-hero" aria-labelledby="thinking-title">
        <p className="eyebrow">
          TATTVA ISHAAN HARISH / UIUC COMPUTER ENGINEERING
        </p>
        <p className="hero-story-kicker">
          FROM IDEA
          <br />
          <span>TO IMPACT.</span>
        </p>
        <h1 id="thinking-title">
          I like turning complicated problems into{" "}
          <em>things people can use.</em>
        </h1>
        <div className="thinking-layout">
          <div>
            <div
              className="perspectives"
              role="group"
              aria-label="Inside my thinking"
            >
              {Object.keys(perspectives).map((label) => (
                <button
                  key={label}
                  aria-pressed={perspective === label}
                  onClick={() =>
                    setPerspective(label as keyof typeof perspectives)
                  }
                >
                  {label}
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
            <p className="perspective-copy">{intro.text}</p>
            <div className="related-projects">
              {intro.ids.map((id) => {
                const project = projects.find((item) => item.id === id)!;
                return (
                  <button
                    key={id}
                    onClick={(event) => related(project, event.currentTarget)}
                  >
                    {project.name} ↗
                  </button>
                );
              })}
            </div>
          </div>
          <div className="thinking-art">
            <ChapterScene chapter="signal" active={intro.kind} />
            <span>SIGNAL → SYSTEM → SOMETHING USEFUL</span>
          </div>
        </div>
        <div className="hero-bottom">
          <a className="scroll-cue" href="#projects">
            Scroll to explore <span aria-hidden="true">↓</span>
          </a>
          <p>AI / SOFTWARE / HARDWARE / PEOPLE</p>
        </div>
      </section>
      <section
        id="projects"
        tabIndex={-1}
        ref={gallery}
        className="section"
        aria-labelledby="projects-heading"
      >
        <p className="eyebrow">THREE CHAPTERS / SIX PROJECTS</p>
        <h2 id="projects-heading">
          Explore what I’ve built<span>.</span>
        </h2>
        <p className="muted">
          Six stories across AI, software, hardware, and community.
        </p>
        <nav className="chapter-navigation" aria-label="Story chapters">
          {chapters.map((chapter) => (
            <a key={chapter.id} href={`#chapter-${chapter.id}`}>
              {chapter.number} / {chapter.title}
              <span aria-hidden="true">↘</span>
            </a>
          ))}
        </nav>
        <div className="explorer-toolbar">
          <div className="filters" role="group" aria-label="Project category">
            {categories.map((item) => (
              <button
                key={item}
                aria-pressed={category === item}
                onClick={() => apply(item, technology)}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="technology-filter">
            Technology
            <select
              aria-label="Technology"
              value={technology}
              onChange={(event) => apply(category, event.target.value)}
            >
              <option value="">All technologies</option>
              {supportedTechnologies.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
        <details className="technology-tags">
          <summary>Browse technology tags</summary>
          <div role="group" aria-label="Technology tags">
            {supportedTechnologies.map((item) => (
              <button
                key={item}
                aria-pressed={technology === item}
                onClick={() => apply(category, technology === item ? "" : item)}
              >
                {item}
              </button>
            ))}
          </div>
        </details>
        <div className="explorer-meta">
          <span aria-live="polite">
            {matching.length} matching project{matching.length === 1 ? "" : "s"}{" "}
            · {category}
            {technology && ` + ${technology}`}
          </span>
          <button onClick={() => apply("All", "")}>Clear filters</button>
        </div>
        {matching.length ? (
          <div
            className="chapter-collection"
            role="group"
            aria-label="Project gallery"
          >
            <div className="story-thread" aria-hidden="true">
              <div className="thread-track">
                <span />
              </div>
              <div className="thread-stops">
                {chapters.map((chapter) => (
                  <span
                    className={`thread-stop thread-${chapter.id}`}
                    key={chapter.id}
                  >
                    <i />
                    {chapter.number}
                    <small>{chapter.title}</small>
                  </span>
                ))}
              </div>
            </div>
            {chapters.map((chapter) => {
              const chapterProjects = chapter.ids
                .map((id) => matching.find((project) => project.id === id))
                .filter((project): project is Project => Boolean(project));
              return chapterProjects.length ? (
                <Chapter
                  key={chapter.id}
                  chapter={chapter}
                  projects={chapterProjects}
                  selected={selected?.id}
                  onChoose={choose}
                />
              ) : (
                <section
                  key={chapter.id}
                  id={`chapter-${chapter.id}`}
                  className="filtered-chapter"
                >
                  <h3>
                    {chapter.number} / {chapter.title}
                  </h3>
                  <p>No projects in this chapter match the active filters.</p>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="no-projects">
            <h3>No projects match those filters.</h3>
            <p>
              Try another combination or clear filters to see all six stories.
            </p>
          </div>
        )}
        {selected && (
          <div ref={story} tabIndex={-1} className="story-anchor">
            <Story
              key={selected.id}
              project={selected}
              onClose={() => {
                setSelected(null);
                origin.current?.focus();
              }}
            />
          </div>
        )}
      </section>
      {children}
      <section id="contact" className="section next-explore">
        <p className="eyebrow">THE NEXT CHAPTER</p>
        <h2>
          Let’s build <br />
          <em>something useful.</em>
        </h2>
        <p className="contact-invitation">
          I’m interested in AI, semiconductor technology, and projects that
          connect software and hardware with practical needs. If that sounds
          like your kind of work, let’s connect.
        </p>
        <a
          className="browse-all"
          href="#projects"
          onClick={() => apply("All", "")}
        >
          Browse all projects ↑
        </a>
        <div className="ending-controls">
          {(
            [
              ["AI & data", "AI"],
              ["Hardware", "Hardware"],
              ["Community impact", "Community"],
            ] as const
          ).map(([label, item]) => (
            <button
              key={label}
              onClick={() => {
                apply(item, "");
                gallery.current?.scrollIntoView?.({ block: "start" });
                gallery.current?.focus();
              }}
            >
              {label} ↗
            </button>
          ))}
        </div>
        <p className="muted">
          I’d love to talk about useful technology, interesting projects, or a
          good game.
        </p>
        <div className="contact-links">
          <a href="mailto:tattva.i.harish@gmail.com">
            tattva.i.harish@gmail.com ↗
          </a>
          <a
            href="https://github.com/Tattva17"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </section>
    </div>
  );
}
