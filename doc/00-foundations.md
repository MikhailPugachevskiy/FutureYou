# 0. Foundations: React, Vite and the Structure of the App

This chapter explains the building blocks that appear throughout the project. After that, the entry files (`index.html`, `vite.config.js`, `package.json` and `main.jsx`) are explained line by line. The remaining files follow in the next chapters.

---

## 1. What is React?

React is a JavaScript library for building user interfaces out of **components**. A component is a plain function that describes what a part of the page looks like. Examples from this app: `LandingPage` (the start page), `QuestionnairePage` (the seven-step form) or `LearningRoadmap` (the week-by-week plan).

Three ideas are enough to understand the whole code base:

1. **A component returns JSX.** JSX looks like HTML but lives inside JavaScript. It describes what should appear on the page.
2. **Data flows down (props), events flow up (functions).** A parent passes data to its children. When the user clicks something, the child calls a function that the parent gave it.
3. **When state changes, React re-renders.** State is the memory of a component. When it changes, React calls the component function again and updates only the parts of the page that actually changed.

## 2. JSX is not HTML

| In HTML | In JSX | Why |
| --- | --- | --- |
| `class="..."` | `className="..."` | `class` is a reserved word in JavaScript |
| `for="name"` | `htmlFor="name"` | `for` is a reserved word as well |
| `onclick` | `onClick` | attributes are written in camelCase |
| `style="color: red"` | `style={{ color: "red" }}` | `style` takes an object, not a string |
| `<br>` without a closing tag | `<br />` | every element must be closed |
| plain text | `{value}` | curly braces contain a JavaScript expression |

An expression in `{ }` can be a variable, a function call, a ternary (`a ? b : c`) or `&&`. Statements such as `if` or `for` do not work there.

A component may return only **one** root element. If you need several siblings without an extra `<div>`, use a **fragment**: `<> ... </>`.

## 3. The React tools used in this project

| Tool | Purpose | Where in the app |
| --- | --- | --- |
| **Props** | pass data and functions from parent to child | `ProfileSnapshot.jsx`, `CareerMatches.jsx`, `SkillAnalysis.jsx`, `LearningRoadmap.jsx` |
| **`useState`** | remembers a value between renders | `QuestionnairePage.jsx`, `MatchesPage.jsx`, `CareerMatches.jsx`, `LearningRoadmap.jsx` |
| **`useEffect`** | runs code “outside of rendering” (here: a network request) | `MatchesPage.jsx` |
| **`useMemo`** | caches the result of a calculation between renders | `QuestionnairePage.jsx`, `SkillsPage.jsx`, `LearningRoadmap.jsx` |
| **`useNavigate`** | changes the page from code | all pages with a button that leads to the next step |
| **`key`** | gives list items a stable identity | `CareerMatches.jsx`, `ProfileSnapshot.jsx`, `SkillAnalysis.jsx`, `LearningRoadmap.jsx` |
| **controlled inputs** | the value of a field comes from state | `QuestionnairePage.jsx` (steps 1 and 7) |
| **conditional rendering** | `a && <X />` or `a ? <X /> : <Y />` | `MatchesPage.jsx`, `ProfileSnapshot.jsx`, `QuestionnairePage.jsx` |
| **`localStorage`** | keeps the user’s data between pages | `loadAppState.js` and every file that saves the state |

## 4. The structure of the project

The repository root contains four folders:

```
FutureYou/
├── react/     # the final React frontend (the MVP)
├── static/    # early HTML/CSS/JavaScript prototype (legacy)
├── ux/        # UX documents (problem space, persona, interviews, wireframes, design system, mockups)
└── img/       # screenshots and a demo video
```

The React app lives in `react/`:

```
react/
├── index.html
├── package.json
├── vite.config.js
├── test/          # small backend connectivity test (see chapter 9)
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── components/    # CareerMatches, LearningRoadmap, ProfileSnapshot, SkillAnalysis
    ├── pages/         # LandingPage, QuestionnairePage, SnapshotPage, MatchesPage, SkillsPage, RoadmapPage
    ├── utils/         # loadAppState, quickMatch, requestCareerPath
    └── styles/        # app.css
```

The app is a **Single Page Application (SPA)**: there is only one HTML file. When the user moves from one step to the next, the page is **not** reloaded. React swaps the component that is displayed.

**The most important principle:** the user’s answers and the results (matches, skills, roadmap) are stored in one object in the browser’s `localStorage`, so every page can read them (see chapter 4). The pages themselves only keep small, temporary state, such as the current question or a loading flag.

---

## File: `react/index.html`

```html
  1 | <!DOCTYPE html>
  2 | <html lang="en">
  3 |
  4 | <head>
  5 |     <meta charset="UTF-8" />
  6 |     <title>FutureYou – Career Matches</title>
  7 | </head>
  8 |
  9 | <body>
 10 |
 11 |     <div id="root"></div>
 12 |
 13 |     <script type="module" src="/src/main.jsx"></script>
 14 |
 15 | </body>
 16 |
 17 | </html>
```

### Line by line

- **Z. 1** Tells the browser that this is an HTML5 document.
- **Z. 2** `lang="en"` tells screen readers and search engines that the page is in English (important for accessibility and SEO).
- **Z. 4–7** The `<head>` contains metadata that is not displayed on the page.
- **Z. 5** Makes sure special characters such as “–” are displayed correctly (UTF-8).
- **Z. 6** The text shown in the browser tab.
- **Z. 11** The most important line: an empty `<div>` with the id `root`. React looks for this element and mounts the whole app inside it. If it is missing, the page stays empty.
- **Z. 13** Loads `main.jsx`. `type="module"` tells the browser to treat the file as a JavaScript module (required for `import`/`export`). The path starts with `/`, which means “relative to the project root”.

> **Note:** This file has no `<meta name="viewport" ...>` tag. On phones, the browser therefore renders the page as a desktop-width page and scales it down. The responsive rules in `app.css` (see chapter 8) only take full effect once a viewport tag is added, e.g. `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`. Also, the title “Career Matches” is shown on every page of the app.

---

## File: `react/vite.config.js`

```js
  1 | import { defineConfig } from "vite";
  2 | import react from "@vitejs/plugin-react";
  3 |
  4 | export default defineConfig({
  5 |     plugins: [react()]
  6 | });
```

### Line by line

- **Z. 1** Imports `defineConfig`, a helper that gives editors autocompletion for the config object.
- **Z. 2** Imports the official React plugin for Vite. It makes Vite understand JSX and enables “hot reload” (changes appear in the browser without a full refresh).
- **Z. 4–6** Exports the configuration. The only setting is the list of plugins, so everything else uses Vite’s defaults (for example, the dev server runs on port 5173).

---

## File: `react/package.json`

```json
  1 | {
  2 |     "name": "futureyou-react",
  3 |     "private": true,
  4 |     "version": "0.0.1",
  5 |     "type": "module",
  6 |     "scripts": {
  7 |         "dev": "vite",
  8 |         "build": "vite build",
  9 |         "preview": "vite preview"
 10 |     },
 11 |     "dependencies": {
 12 |         "react": "^18.2.0",
 13 |         "react-dom": "^18.2.0",
 14 |         "react-router-dom": "^7.13.1"
 15 |     },
 16 |     "devDependencies": {
 17 |         "@vitejs/plugin-react": "^4.0.0",
 18 |         "vite": "^5.0.0"
 19 |     }
 20 | }
```

### Line by line

- **Z. 3** `"private": true` prevents the project from being published to npm by accident.
- **Z. 5** `"type": "module"` makes `.js` files use modern `import`/`export` syntax.
- **Z. 7–9** The three npm scripts. `npm run dev` starts the development server, `npm run build` creates the production build, `npm run preview` serves that build locally.
- **Z. 11–15** Packages the app needs at runtime: React itself, `react-dom` (connects React to the browser) and `react-router-dom` (page navigation).
- **Z. 16–19** Packages needed only during development: Vite and its React plugin.
- The `^` in front of a version means “this version or any newer compatible one with the same major version”.

---

## File: `react/src/main.jsx`

```jsx
  1 | import React from "react";
  2 | import ReactDOM from "react-dom/client";
  3 | import App from "./App";
  4 | import "./styles/app.css";
  5 |
  6 | ReactDOM.createRoot(document.getElementById("root")).render(
  7 |     <React.StrictMode>
  8 |         <App />
  9 |     </React.StrictMode>
 10 | );
```

### Line by line

- **Z. 1** Imports React. Since React 17 this import is technically no longer required for JSX, but it is needed here for `React.StrictMode` in Z. 7.
- **Z. 2** Imports `ReactDOM` from `react-dom/client`, the modern API (React 18) for starting an app in the browser.
- **Z. 3** Imports the main component `App` from `App.jsx`. The file extension can be left out; Vite finds the file.
- **Z. 4** Imports the global stylesheet `app.css`. This import applies the styles to the whole app.
- **Z. 6** Finds the element with the id `root` and creates a React “root” there. `.render(...)` draws everything inside the parentheses into it.
- **Z. 7–9** `<React.StrictMode>` is a development tool. It shows extra warnings in the browser console and runs some code twice to expose bugs. It has no effect on the production build.
- **Z. 8** `<App />` is the actual application. It contains the router and all pages (chapter 1).

---

## Typical questions

**What is Vite and why do we use it?**
Vite is a build tool and development server. It starts almost instantly, updates the browser on every file change and creates an optimized bundle for production (`npm run build`).

**Why is there only one `index.html`?**
Because this is a Single Page Application. React replaces the content of `<div id="root">` depending on the current URL. The browser loads the HTML file only once.

**What is the difference between `main.jsx` and `App.jsx`?**
`main.jsx` is the entry point: it connects React to the browser (the `<div id="root">`) and loads the global CSS. `App.jsx` is the application itself: it defines which pages exist and under which URL they appear.

**Why does `main.jsx` import the CSS and not `App.jsx`?**
It is a design decision; both work. Importing `app.css` in `main.jsx` makes clear that these styles apply to the whole app.

**What is the difference between `dependencies` and `devDependencies`?**
`dependencies` are needed when the app runs (React, the router). `devDependencies` are only needed while building the app (Vite and its plugin).

---

## Try it yourself

1. Change the text in the `<title>` tag in `index.html` to “My Career App”. What do you see in the browser tab?
2. Remove `<React.StrictMode>` (and its closing tag) from `main.jsx`. What changes? (Nothing visible: `StrictMode` is only a development aid.)
3. Run `npm run build` in the `react/` folder. Which new folder appears and what does it contain? (A `dist/` folder with the optimized files.)
