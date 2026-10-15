const experience = [
  {
    company: "Talk to Fab",
    role: "AI/ML Product Development Intern",
    text: "Collaborated on a natural-language interface for semiconductor fab data, contributing across product definition, prototyping, testing, and integration.",
  },
  {
    company: "Dextroware Devices",
    role: "Lead Engineering Intern",
    text: "Developed specifications for gesture-based wheelchair controls. Worked on sensor calibration, signal post-processing, and ESD reliability with circuit design engineers.",
  },
  {
    company: "Advanced Trustee Services (ATS) Wealth Management",
    role: "Intern",
    text: "Improved office efficiency by approximately 7% through client-system automation. Collaborated on balance sheets, newsletters, research, and market validation, and shadowed the founder in business meetings.",
  },
];

export default function Profile() {
  return (
    <>
      <section id="about" className="section about" data-reveal>
        <div>
          <p className="eyebrow">02 / OFF THE COURT</p>
          <h2>
            Curiosity is the
            <br />
            common thread<span>.</span>
          </h2>
        </div>
        <div className="about-copy">
          <p>
            I study computer engineering at UIUC and enjoy building useful
            applications across AI, software, and hardware. I’m especially
            interested in semiconductor technology and projects with practical
            impact.
          </p>
          <p>
            I also enjoy bringing people together: as Data Science Club
            president, Model UN treasurer, and a state-level DECA finalist.
            Outside engineering, you’ll find me following basketball and soccer.
          </p>
          <div className="education">
            <span className="eyebrow">EDUCATION</span>
            <h3>University of Illinois Urbana-Champaign</h3>
            <p>B.S. Computer Engineering · Expected May 2030</p>
          </div>
        </div>
      </section>
      <section id="experience" className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 / LEARNING BY BUILDING</p>
            <h2>
              Experience<span>.</span>
            </h2>
          </div>
          <p className="section-note">Different teams. Shared purpose.</p>
        </div>
        <div className="experience-list experience-timeline">
          {experience.map((item, index) => (
            <article key={item.company} data-reveal>
              <span className="entry-number">0{index + 1}</span>
              <div>
                <h3>{item.company}</h3>
                <p className="role">{item.role}</p>
              </div>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section skills" aria-labelledby="skills-heading">
        <div>
          <p className="eyebrow">04 / THE TOOLKIT</p>
          <h2 id="skills-heading">
            Tools I build with<span>.</span>
          </h2>
        </div>
        <div className="skill-grid">
          <div>
            <h3>Software & applications</h3>
            <p>Python · React · FastAPI · Flutter · Firebase · APIs · Java</p>
          </div>
          <div>
            <h3>AI & data</h3>
            <p>
              Machine learning · LLMs · Data modeling · Image recognition ·
              Voice transcription
            </p>
          </div>
          <div>
            <h3>Hardware & systems</h3>
            <p>
              Arduino · Raspberry Pi · RISC-V · Motion sensors · Sensor fusion ·
              ESD reliability
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
