# 1. Routing: How the Pages Are Connected

In a classic website, a click on a link loads a new HTML file from the server. In a React app (Single Page Application) there is only one `index.html`. **Routing** makes sure that the URL in the address bar is updated and that React swaps the matching page component in the background.

In this project, routing is handled by the library **React Router** (`react-router-dom`).

---

## File: `src/App.jsx` (the router)

```jsx
  1 | import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
  2 | import LandingPage from "./pages/LandingPage";
  3 | import QuestionnairePage from "./pages/QuestionnairePage";
  4 | import MatchesPage from "./pages/MatchesPage";
  5 | import SkillsPage from "./pages/SkillsPage";
  6 | import RoadmapPage from "./pages/RoadmapPage";
  7 | import SnapshotPage from "./pages/SnapshotPage";
  8 |
  9 | export default function App() {
 10 |     return (
 11 |         <BrowserRouter>
 12 |             <Routes>
 13 |                 <Route path="/" element={<LandingPage />} />
 14 |                 <Route path="/questionnaire" element={<QuestionnairePage />} />
 15 |                 <Route path="/snapshot" element={<SnapshotPage />} />
 16 |                 <Route path="/matches" element={<MatchesPage />} />
 17 |                 <Route path="/skills" element={<SkillsPage />} />
 18 |                 <Route path="/roadmap" element={<RoadmapPage />} />
 19 |                 <Route path="*" element={<Navigate to="/" replace />} />
 20 |             </Routes>
 21 |         </BrowserRouter>
 22 |     );
 23 | }
```

### Line by line

- **Z. 1** Imports four building blocks from React Router:
  - `BrowserRouter` makes the router available to all components inside it and connects it to the browser’s address bar.
  - `Routes` is the container for all route rules.
  - `Route` is a single rule (“when this URL is opened, show that component”).
  - `Navigate` is a component that redirects to another URL.
- **Z. 2–7** Import the six page components from the `pages/` folder.
- **Z. 9** Defines the `App` component and exports it in the same line (`export default function`), so `main.jsx` can import it.
- **Z. 11** `<BrowserRouter>` wraps all routes. Every component inside can use router features such as `useNavigate`. In this project it is placed in `App.jsx`; in many projects it is placed in `main.jsx` instead. Both work.
- **Z. 12–20** `<Routes>` looks at the current URL and renders the `element` of the first route that matches.
- **Z. 13** The start page. The path `/` is the root URL (e.g. `localhost:5173/`).
- **Z. 14–18** The five steps of the user journey. The `path` is exactly what appears in the URL (e.g. `localhost:5173/matches`).
- **Z. 19** The path `*` is a wildcard and matches every URL that none of the other routes matched. `<Navigate to="/" replace />` redirects those visitors to the start page. `replace` swaps the current history entry instead of adding a new one, so the browser’s back button does not lead back to the unknown URL.

> **Note:** There is no shared header or footer. In many React projects, a layout such as a navigation bar is placed outside of `<Routes>` so it appears on every page. Here every page draws its own layout, because the app is a guided flow (landing page → questions → results) and not a website with a menu.

---

## The user journey as routes

The pages do not use `<Link>` elements. Each page has a button that calls `navigate(...)` from the `useNavigate` hook (see chapter 2). Together they form this flow:

| From | Button | Goes to | Where in the code |
| --- | --- | --- | --- |
| `/` | “Start Now” | `/questionnaire` | `LandingPage.jsx`, Z. 68 |
| `/questionnaire` | “← Back” (on question 1) | `/` | `QuestionnairePage.jsx`, Z. 177 |
| `/questionnaire` | “See My Profile →” (on question 7) | `/snapshot` | `QuestionnairePage.jsx`, Z. 214 |
| `/snapshot` | “Show my best career match →” | `/matches` | `SnapshotPage.jsx`, Z. 129 |
| `/matches` | “Continue to skill analysis →” | `/skills` | `MatchesPage.jsx`, Z. 155 |
| `/skills` | “Continue to roadmap →” | `/roadmap` | `SkillsPage.jsx`, Z. 142 |
| `/roadmap` | “Back to snapshot” | `/snapshot` | `LearningRoadmap.jsx`, Z. 233 |
| `/roadmap` | “Review career matches” | `/matches` | `LearningRoadmap.jsx`, Z. 249 |

---

## Typical questions

**What is the difference between `<Link>` and `useNavigate`?**
Both change the page without a reload. `<Link>` renders an `<a>` element and is the right choice for normal navigation, because it is accessible and supports “open in new tab”. `useNavigate` returns a function that you call from code, for example after a button click or after a form was validated. This project uses `useNavigate` because the buttons trigger navigation as the last step of an action.

**What happens if the user opens `/matches` directly, without answering the questionnaire?**
The route exists, so `MatchesPage` renders. It finds no saved profile and shows an error message (see chapter 6). The user can then go back to the start page manually. The page does not redirect automatically.

**What happens when the user reloads the page on `/skills`?**
In the development server (`npm run dev`), Vite sends `index.html` for every URL, so React Router can show the right page. For a production deployment, the web server must do the same (a “fallback to `index.html`” rule), otherwise a reload on a deep URL would return a 404.

**Why is the user’s data still there after a reload or after changing the page?**
Because it is stored in `localStorage`, not in a component (see chapter 4).

**What does the `replace` attribute on `<Navigate>` do?**
It replaces the current entry in the browser history instead of adding a new one. For redirects this is usually what you want, because otherwise the back button would lead to the URL that caused the redirect and immediately redirect again.

---

## Try it yourself

1. Add a new route in `App.jsx`: `<Route path="/test" element={<h1>Test page</h1>} />`. Open `localhost:5173/test`. What happens?
2. Open `localhost:5173/does-not-exist`. Where do you end up, and why? (On the start page: the `*` route in Z. 19 redirects there.)
3. Remove `replace` from the `<Navigate>` in Z. 19 and open an unknown URL. Press the browser’s back button. What happens compared with before?
4. Open `localhost:5173/roadmap` in a private browser window (no saved data). What do you see? (A roadmap built from default skills, see chapter 7.)
