# Tattva Harish — Two Perspectives

A personal portfolio for Tattva Ishaan Harish, a UIUC computer engineering student, built for the NOBE capstone. Vite, React, TypeScript, and plain CSS; original SVG/CSS artwork and system fonts. No runtime dependencies beyond React and React DOM.

## The experience

The opening screen shows only the name. The orange period at the end is a real, keyboard-accessible button named **Enter portfolio**; it opens the mode chooser. A sticky Home / Explore / Game navigation lets visitors switch freely.

### Explore

- **Think / Build / Connect** changes the introduction, original illustration, and related project buttons.
- Six expanded project stories are freely accessible without playing, arranged in Intelligence, Building, and Impact chapters. Original sticky SVG scenes highlight the current project as it enters view.
- A decorative circuit thread tracks native scrolling on desktop; subtle reveals and an experience timeline use IntersectionObserver. Mobile scenes stay in normal flow, and text is never hidden when APIs are unavailable.
- Category and supported technology filters combine across the chapters. Technology can be selected from a dropdown or expandable tag buttons. The gallery shows the matching count, active filters, Clear filters, and an empty state.
- Each inline case study has independently selectable **The problem / My contribution / The approach** steps. Closing returns focus to the originating control. Excluding a selected project through filtering closes its panel.
- About, education, experience, skills, email, and GitHub use the supplied resume facts. Ending controls return to a relevant project category.

### Game

Focus the court and move the original top-down player with **arrow keys or WASD**. Diagonal input is normalized; elapsed time determines movement. Player, project spots, activation circles, court lines, and shot animation share a 100 × 100 square coordinate system. The player stays within 7–93 court units, leaving room for its drawing inside the boundary.

Walk into a project’s ring to highlight the nearest spot and show its name. Exact distance ties resolve in project-array order. **Enter** opens that spot’s interaction. Keyboard movement is captured only on the focused court itself; keys on buttons, inputs, and other content retain their native behavior.

Touch users can hold direction-pad buttons and select **Interact**. The accessible **Select a spot** buttons (and numbered court buttons) also move the player directly to a spot and open the same interaction. No precise movement is required.

Locked projects open an inline shooting panel. **Start shot** begins an elapsed-time meter; **Shoot** stops it. Positions from 35% through 65%, including both boundaries, succeed. Space also shoots while the panel itself is focused, without overriding native button activation. Space starts aiming from the shooting panel and releases an active shot. Starting with a mouse click also returns focus to the panel so Space is immediately ready. A miss allows retry. A success immediately unlocks the shared story and plays a brief illustrative shot toward the hoop. Unlocked spots open their stories directly.

Movement pauses while a locked shooting panel or reset confirmation is active. Unlocking returns focus to the court immediately: movement and spot controls work while the unlocked story remains visible. Closing a panel also returns focus to the court and leaves the player in place. Blur, hidden tabs, mode changes, and unmount clear held input and cancel movement. Hidden tabs cancel an aiming attempt without recording a miss. Shot frames and decorative ball animations are cancelled on close, reset, mode exit, and unmount.

## Progress and privacy

Only known unlocked project IDs are stored in this browser’s `localStorage`, under `tattva-portfolio-unlocks-v1`. Unknown IDs and duplicates are discarded; malformed or inaccessible storage does not crash the page. Progress remains available in memory if saving fails. Switching modes preserves unlocks; refreshing restores them when storage is available. Reset requires inline confirmation. No private information is saved or sent.

## Accessibility and motion

Real HTML buttons, semantic headings, selected states, visible focus, comfortable controls, and text-based locked/unlocked feedback support keyboard and touch use. Decorative graphics are hidden from assistive technology. Live messages describe proximity and shot outcomes, never animation frames. Reduced motion skips the decorative shot and replaces the moving meter with a labeled manual aim slider, initially outside the target. It uses exactly the same hit evaluation. All stories remain available in Explore.

## Local setup

Use Node.js 24 and npm:

```sh
npm ci
npm run dev
```

Open **http://127.0.0.1:5173/tattva-portfolio/** (or the port printed by Vite). The configured base remains `/tattva-portfolio/` for eventual GitHub Pages hosting.

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

`npm test` runs once and exits. The production build is written to `dist/`.

## Code to understand for the presentation

- `src/App.tsx`: explicit intro / chooser / explore / game screen state and shared unlocked IDs; storage persists across mode switches. Mode changes unmount the previous screen, invoking its cleanup.
- `src/projects.ts`: shared typed project content, story text, supported technology associations, fixed coordinates, and pure filtering.
- `src/Explorer.tsx`: perspective, combined filters, chapter composition, selected story, and focus restoration.
- `src/Chapter.tsx`, `src/ChapterScene.tsx`, and `src/useScrollStory.ts`: original SVG chapter scenes, visibility-driven active project labels, and a single coalesced scroll frame updating CSS properties. Observers, listeners, and frames clean up on exit.
- `src/Story.tsx` and `src/Artwork.tsx`: reusable case studies and original illustrations.
- `src/Game.tsx`: idle / aiming / miss shooting states. Success is represented by the shared unlocked IDs. The meter’s rendered position and hit evaluation use the same elapsed-time function. A synchronous ref prevents duplicate shot results.
- `src/useCourtMovement.ts`: held directions and current position live in refs. A cancellable animation frame updates only the player’s position; React state updates only when the nearest spot changes.
- `src/gameLogic.ts`: small pure movement, proximity, meter, hit, and progress-validation functions.
- `src/Profile.tsx`: preserved about, education, experience, skills, and contact content.
- `src/*.test.tsx` and `src/gameLogic.test.ts`: observable UI tests plus deterministic math and controlled-frame shooting/movement tests. Earlier meaningful filtering, selection, keyboard, and cleanup coverage was adapted to the revised interfaces.

## AI assistance and limitations

Codex assisted with implementation, styling, resume-based copy, and automated tests. This disclosure does not claim human review has happened. The owner should review the content and understand the code before presenting or publishing.

This is a static portfolio: no backend, database, contact form, physics, opponents, or camera system. The shot and medical-document workflow illustrations are illustrative. The portfolio does not process medical documents. No verified project URLs or public resume file were supplied, so those links are omitted. Optional skill-connection graphics were skipped to prioritize the complete core experience. Game progress is local to the browser, not synced between devices.

## GitHub Pages deployment

The public site is intended for **https://tattva17.github.io/tattva-portfolio/**. This is the expected URL, not a claim that deployment has succeeded.

`.github/workflows/portfolio.yml` runs four independently visible checks on **every pull request** and **every push to main**: **Lint**, **Typecheck**, **Tests**, and **Build**. Each installs dependencies with `npm ci` on Node.js 24. Official actions are pinned to verified commit SHAs.

On main, the Build job packages `dist/` with the official Pages artifact action. Deployment has `needs: checks`, so all four checks must succeed for the **same workflow run and commit** before the exact artifact can deploy. PRs have no deployment job or Pages write permissions. The deploy job alone receives `pages: write` and `id-token: write`, uses the `github-pages` environment, and publishes via the official Configure Pages / Deploy Pages actions. No personal access token or repository secret is required by the workflow.

### One-time repository settings (owner/admin)

1. Open repository **Settings → Pages → Build and deployment → Source → GitHub Actions**.
2. If **Settings → Environments → github-pages** exists, set **Deployment branches and tags → Selected branches and tags** to allow only `main`. If it does not exist yet, create it and apply the same restriction.
3. Open the feature-branch pull request and wait for its first check run. Check names become selectable after GitHub has seen them.
4. In **Settings → Branches → Add classic branch protection rule**, use branch pattern `main`. Enable **Require a pull request before merging**, **Require status checks to pass before merging**, and **Require branches to be up to date before merging**.
5. Add exactly **Lint**, **Typecheck**, **Tests**, and **Build** as required checks; choose **GitHub Actions** as their source when offered. Enable **Do not allow bypassing the above settings** (including administrators). Leave force pushes and deletions disabled. Preserve any stricter existing review rules. For a solo-owned repository, do not add a required reviewer unless another eligible reviewer is available.
6. Save the rule and verify all four checks pass on the latest PR commit. Resolve any requested changes or merge conflicts through the feature branch. Do not bypass or disable protections.
7. Merge using the normal PR merge control. The push of the merge commit to main starts fresh validation, then Pages deployment. Do not push application changes directly to main.
8. In **Actions → Portfolio CI and Pages**, verify the main run and **Deploy GitHub Pages** job succeed. Follow the environment URL, open the public site, and check that its CSS, JavaScript, favicon, both modes, and interactions load under `/tattva-portfolio/`.

For later releases, repeat the feature-branch → PR → required checks → normal merge flow. To redeploy manually, choose **Actions → Portfolio CI and Pages → Run workflow → main**; validation still runs before deployment.

If GitHub CLI is unavailable, after pushing `portfolio-build`, open **https://github.com/Tattva17/tattva-portfolio/compare/main...portfolio-build**, confirm **base: main / compare: portfolio-build**, then **Create pull request**. Do not merge until protection and passing checks are verified.

### Delivery evidence checklist

- [x] CI and same-commit Pages deployment workflow implemented locally.
- [x] Vite base verified as `/tattva-portfolio/`.
- [ ] Feature branch pushed and PR URL recorded.
- [ ] Actual GitHub-hosted passing checks verified.
- [ ] Required checks and no-bypass branch protection configured and verified.
- [ ] Genuine failed-check followed by corrected-pass pipeline evidence produced.
- [ ] Owner content/presentation review completed.
- [ ] Normal protected PR merge completed.
- [ ] Pages deployment and public URL verified.

A local passing test suite is not GitHub pipeline evidence. The failed-check/corrected-pass requirement remains incomplete unless actual workflow run links are recorded. Deployment is not complete until the public site is verified.

## Local verification — October 15, 2026

Lint, strict TypeScript, the deterministic/UI test suite, and production build were run locally. The development URL responds with HTTP 200. Desktop Chrome verified the revised period entrance and mode chooser. Full Game-mode and mobile visual checks remain pending: browser automation was repeatedly interrupted by window changes and returned an unusable screenshot. Automated movement, proximity, input, shooting, storage, and cleanup checks are included; they do not replace visual/touch review.
