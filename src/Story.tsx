import { useState } from "react";
import Artwork from "./Artwork";
import { stories, type Project } from "./projects";
const steps = ["The problem", "My contribution", "The approach"] as const;
export default function Story({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const content = [
    stories[project.id].problem,
    project.contribution,
    stories[project.id].approach,
  ];
  return (
    <article className="story-panel" aria-label={`${project.name} case study`}>
      <div className="story-heading">
        <div>
          <p className="eyebrow">
            PROJECT STORY / {project.categories.join(" + ")}
          </p>
          <h3>{project.name}</h3>
        </div>
        <button className="subtle-button" onClick={onClose}>
          Close story ×
        </button>
      </div>
      <p>{project.overview}</p>
      <div className="story-layout">
        <div className="story-illustration" key={step}>
          <Artwork kind={project.id} step={step} />
        </div>
        <div>
          <div className="story-steps" role="group" aria-label="Story steps">
            {steps.map((label, index) => (
              <button
                key={label}
                aria-pressed={step === index}
                onClick={() => setStep(index)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="story-text" aria-live="polite">
            <h4>{steps[step]}</h4>
            <p>{content[step]}</p>
          </div>
        </div>
      </div>
      <p className="eyebrow">
        {project.id === "tutoropia" ? "FOCUS AREAS" : "TECHNOLOGIES & TOPICS"}
      </p>
      <ul className="technology-list">
        {project.technologies.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {project.id === "medilog" && (
        <p className="small-note">
          Illustrative prescription-to-digital workflow.
        </p>
      )}
    </article>
  );
}
