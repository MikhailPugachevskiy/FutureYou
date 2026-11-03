# Learning Documentation

This folder explains, line by line, how the frontend code of **FutureYou** works. FutureYou is an AI-supported career path recommendation platform that was built as a TechLabs group project. The documentation covers the **frontend**: the React app in `react/` and the early HTML/CSS/JavaScript prototype in `static/`.

The explanations are meant for learning and for job interviews. They are not part of the website: the React app never loads these files.

## What the app does

The user answers seven questions about their experience and preferences. The app then shows:

1. a **profile snapshot** (what the app understood about the user),
2. two **career matches**,
3. a **skill analysis** (skills the user has and skills to build),
4. a week-by-week **learning roadmap** that can be saved and downloaded.

The flow is: `/` → `/questionnaire` → `/snapshot` → `/matches` → `/skills` → `/roadmap`.

## The React app

Read the chapters in this order:

| Chapter | Content | Files in the code |
| --- | --- | --- |
| [0. Foundations](00-foundations.md) | React, JSX, Vite, project structure, entry files | `index.html`, `vite.config.js`, `package.json`, `main.jsx` |
| [1. Routing](01-routing.md) | React Router, routes, redirects, the page flow | `App.jsx` |
| [2. Landing Page](02-landing-page.md) | JSX structure, inline styles, `useNavigate` | `LandingPage.jsx` |
| [3. Questionnaire](03-questionnaire.md) | `useState`, controlled inputs, validation, lists, `useMemo` | `QuestionnairePage.jsx` |
| [4. App State](04-app-state.md) | one shared state object in `localStorage`, safe loading | `loadAppState.js` |
| [5. Backend Integration](05-backend-integration.md) | `fetch`, `async/await`, payload mapping, error handling | `requestCareerPath.js` |
| [6. Result Pages](06-result-pages.md) | props, `useEffect`, fallbacks, data mapping, rule-based matching | `SnapshotPage.jsx`, `ProfileSnapshot.jsx`, `MatchesPage.jsx`, `CareerMatches.jsx`, `quickMatch.js`, `SkillsPage.jsx`, `SkillAnalysis.jsx` |
| [7. Learning Roadmap](07-learning-roadmap.md) | building a plan from different sources, saving, downloading a file | `RoadmapPage.jsx`, `LearningRoadmap.jsx` |
| [8. CSS Architecture](08-css-architecture.md) | global stylesheet, Grid, Flexbox, state classes, media queries | `app.css` |
| [9. Static Prototype](09-static-prototype.md) | the early HTML/CSS/JS version and why the project moved to React | `static/` |

## How the chapters are built

1. **The code** with the original line numbers. For long files, only excerpts are shown; omitted parts are marked with `...` and the line range.
2. **Line by line**: each point starts with the line number (for example “Z. 4”, German “Zeile”) and explains what the line does and why.
3. **Typical questions**, as they could come up in a job interview, with answers.
4. **Try it yourself**: small tasks you can try locally.

Some chapters also contain **notes** and **known limitations**. They describe places where the code could be improved. These are also useful interview topics.

**About the line numbers:** They are correct for the code at the time the chapters were written. If you change the files later, the numbers shift. The code excerpt is always shown directly above the explanations, so the mapping is easy to find even then.

## Running the project

The frontend lives in the `react/` folder. It expects the backend at `http://localhost:3000` (see chapter 5).

```bash
cd react
npm install
npm run dev
```

Vite then prints a local address, usually `http://localhost:5173`. Without the backend, the app still works: the matches page shows an error message and falls back to locally generated matches (chapter 6).
