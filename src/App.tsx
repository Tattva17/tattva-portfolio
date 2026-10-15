import { useEffect, useRef, useState } from "react";
import Explorer from "./Explorer";
import Game from "./Game";
import Profile from "./Profile";
import { loadProgress, saveProgress } from "./gameLogic";
type Screen = "intro" | "chooser" | "explore" | "game";
export default function App() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [unlocked, setUnlocked] = useState(loadProgress);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    saveProgress(unlocked);
  }, [unlocked]);
  useEffect(() => {
    main.current?.focus();
    window.scrollTo?.({ top: 0, behavior: "instant" });
  }, [screen]);
  const choose = () => setScreen("chooser");
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {(screen === "explore" || screen === "game") && (
        <header className="header mode-header">
          <button
            className="brand"
            onClick={choose}
            aria-label="Home — choose a mode"
          >
            TH<span>.</span>
          </button>
          <nav aria-label="Portfolio mode">
            <button onClick={choose}>Home</button>
            <button
              aria-pressed={screen === "explore"}
              onClick={() => setScreen("explore")}
            >
              Explore
            </button>
            <button
              aria-pressed={screen === "game"}
              onClick={() => setScreen("game")}
            >
              Game
            </button>
          </nav>
          {screen === "explore" && (
            <nav className="section-nav" aria-label="Main navigation">
              <a href="#about">About</a>
              <a href="#projects">Projects</a>
              <a href="#experience">Experience</a>
              <a href="#contact">Contact ↗</a>
            </nav>
          )}
        </header>
      )}
      <main id="main" ref={main} tabIndex={-1} className={`screen-${screen}`}>
        {screen === "intro" && (
          <section className="intro-screen">
            <h1 aria-label="Tattva Ishaan Harish">
              <span>Tattva Ishaan</span>
              <br />
              <span className="intro-surname">
                Harish
                <button
                  className="intro-period"
                  aria-label="Enter portfolio"
                  onClick={choose}
                >
                  .
                </button>
              </span>
            </h1>
          </section>
        )}
        {screen === "chooser" && (
          <section className="chooser">
            <p className="eyebrow">TATTVA ISHAAN HARISH</p>
            <h1>
              Follow your
              <br />
              <em>curiosity.</em>
            </h1>
            <p>Two ways to get to know my work. Pick your pace.</p>
            <div className="mode-cards">
              <button
                className="mode-card"
                onClick={() => setScreen("explore")}
              >
                <span className="mode-symbol" aria-hidden="true">
                  ✳
                </span>
                <span className="mode-card-title">
                  Explore <span>↗</span>
                </span>
                <span>Get to know my work, projects, and experience.</span>
              </button>
              <button
                className="mode-card game-mode-card"
                onClick={() => setScreen("game")}
              >
                <span
                  className="mode-symbol basketball-symbol"
                  aria-hidden="true"
                >
                  ◉
                </span>
                <span className="mode-card-title">
                  Game mode <span>↗</span>
                </span>
                <span>Make shots. Unlock the stories behind my work.</span>
              </button>
            </div>
            <p className="small-note">
              All project content is freely available in Explore. Switch modes
              anytime.
            </p>
          </section>
        )}
        {screen === "explore" && (
          <>
            <Explorer>
              <Profile />
            </Explorer>
          </>
        )}
        {screen === "game" && (
          <>
            <Game
              unlocked={unlocked}
              onUnlock={(id) =>
                setUnlocked((current) =>
                  current.includes(id) ? current : [...current, id],
                )
              }
              onReset={() => setUnlocked([])}
            />
            <div className="game-contact">
              <a href="mailto:tattva.i.harish@gmail.com">Email ↗</a>
              <a
                href="https://github.com/Tattva17"
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            </div>
          </>
        )}
      </main>
      {screen !== "intro" && (
        <footer>
          <span>© {new Date().getFullYear()} Tattva Ishaan Harish</span>
          <span>Built with curiosity. And a little basketball.</span>
        </footer>
      )}
    </>
  );
}
