# 9. The Static Prototype: Where the React App Came From

Before the React app, the frontend existed as a **static prototype** in the `static/` folder: plain HTML, CSS and JavaScript, no framework, no build step. It is still in the repository because it documents the first version of the user flow, and because comparing it with the React version shows **why** a framework helps.

This chapter is an overview, not a line-by-line explanation. The prototype is not the final product; the React app in `react/` is.

---

## 1. One HTML file per step

In the prototype, every screen is its own HTML file. The user moves from one to the next with `window.location.href`, so the browser **loads a new page** each time.

| File | Screen | Scripts | Stylesheet |
| --- | --- | --- | --- |
| `index.html` | landing page | `landing.js` | `styles.css` |
| `index2-1.html` | question 1: current role | `app-state.js` | `styles2-1.css` |
| `index2-2.html` … `index2-6.html` | questions 2 to 6 | `app-state.js` | `styles2.css` |
| `index2-7.html` | question 7: career concern | `app-state.js`, `api.js` | `styles2.css` |
| `index3.html` | profile snapshot | `app-state.js` | `styles3.css` |
| `index4.html` | career matches | `app-state.js`, `matches.js` | `styles4.css` |
| `index5.html` | skill analysis | `app-state.js`, `skills.js` | `styles5.css` |
| `index6.html` | learning roadmap | `app-state.js`, `roadmap.js` | `styles6.css` |

The flow is the same as in the React app: landing → seven questions → snapshot → matches → skills → roadmap.

---

## 2. Shared state: `app-state.js`

The seven questions are in seven different HTML files, and each file is a new page load. The only way to share the answers between them is the browser’s `localStorage`, the same idea as in the React app (chapter 4).

```js
  5 | const FUTUREYOU_STATE_KEY = "futureYouState";
  ...
 39 | function getAppState() {
 40 |     const raw = localStorage.getItem(FUTUREYOU_STATE_KEY);
 41 |     if (!raw) return structuredClone(defaultState);
 42 |
 43 |     try {
 44 |         const parsed = JSON.parse(raw);
 45 |         return mergeWithDefaultState(parsed);
 46 |     } catch (error) {
 47 |         console.error("Invalid app state. Resetting.", error);
 48 |         return structuredClone(defaultState);
 49 |     }
 50 | }
 51 |
 52 | function saveAppState(state) {
 53 |     localStorage.setItem(FUTUREYOU_STATE_KEY, JSON.stringify(state));
 54 | }
 55 |
 56 | function updateProfileField(field, value) {
 57 |     const state = getAppState();
 58 |     state.profile[field] = value;
 59 |     saveAppState(state);
 60 | }
```

- **Z. 5** The same storage key as in the React app (`"futureYouState"`), and `defaultState` (Z. 7–37) has the same five sections: `profile`, `snapshot`, `matches`, `skillAnalysis`, `roadmap`. The data format stayed stable when the app moved to React.
- **Z. 39–50** `getAppState` reads and parses the saved state. If nothing is saved, it returns a **copy** of the default state. `structuredClone` makes a deep copy, so the default object is never modified by accident.
- **Z. 75–100** (`mergeWithDefaultState`) completes the saved data with default values, exactly the job that `loadAppState` does in the React app.
- **Z. 52–54** `saveAppState` writes the state back.
- **Z. 56–60** `updateProfileField` is the helper each question page calls: load the state, change **one** field, save it.

The file is loaded with a normal `<script>` tag (for example `<script src="app-state.js"></script>` in `index2-1.html`). Functions declared at the top level of such a script are available to every other script on the same page. There are no modules or imports.

---

## 3. Each page controls the DOM manually

Without React, every page needs its own script that finds elements, reads values and moves on. Here is question 1 (`index2-1.html`, Z. 77–90):

```html
 77 |     <script src="app-state.js"></script>
 78 |     <script>
 79 |         document.getElementById("continueBtn").addEventListener("click", () => {
 80 |             const role = document.getElementById("currentRole").value.trim();
 81 |
 82 |             if (!role) {
 83 |                 alert("Please enter your current role.");
 84 |                 return;
 85 |             }
 86 |
 87 |             updateProfileField("currentRole", role);
 88 |             window.location.href = "index2-2.html";
 89 |         });
 90 |     </script>
```

- **Z. 79** Finds the button by its `id` and attaches a click listener.
- **Z. 80** Reads the value from the input field with `document.getElementById(...).value`. The browser owns the value (an **uncontrolled** input, the opposite of the controlled inputs in chapter 3).
- **Z. 82–85** Validation with `alert()`, the same approach as in the React version.
- **Z. 87** Saves the answer with the helper from `app-state.js`.
- **Z. 88** Loads the next HTML file. This is a full page load.

The landing page works the same way: `landing.js` (10 lines) attaches a click listener to the call-to-action buttons and sends the user to `index2-1.html`.

---

## 4. Talking to the backend: `api.js`

Only the last question page (`index2-7.html`) loads `api.js`. After the user submits the final answer, the page calls `generateCareerPath()`:

```js
  1 | function mapProfileToBackendPayload(profile) {
  2 |     return {
  3 |         currentRole: profile.currentRole || "",
  4 |         interests: Array.isArray(profile.enjoyTasks) ? profile.enjoyTasks : [],
  5 |         level: profile.experienceLevel || "",
  6 |         goals: profile.motivation || "",
  ...
 16 | async function generateCareerPath() {
 17 |     const state = window.getAppState();
 18 |     const profile = state.profile || {};
 19 |     const payload = mapProfileToBackendPayload(profile);
 20 |
 21 |     try {
 22 |         const response = await fetch("http://localhost:3000/api/careerpath", {
 ...
 40 |         if (data.matches) {
 41 |             window.updateSection("matches", data.matches);
 42 |         }
 ...
```

This is the same idea as `requestCareerPath.js` in the React app (chapter 5): the same endpoint, the same payload mapping, and the response is saved section by section with `updateSection` (`app-state.js`, Z. 62–69). The differences:

| Prototype (`api.js`) | React app (`requestCareerPath.js`) |
| --- | --- |
| error → `alert(...)` and return `null` | error → `throw`, shown by the page in the UI |
| response saved with `updateSection` per section | response normalized and merged into one new state |
| called by the last question page | called by the matches page when it appears |

---

## 5. Results: logic and rendering in one script

The result pages contain their own logic. For example:

- `matches.js` has `buildCareerMatches()` (rule-based matching, starting at Z. 6) and `renderCareerMatches()` (Z. 162), which builds the HTML for the cards in JavaScript.
- `skills.js` has `buildSkillAnalysis()` (Z. 6–247) and `renderSkillAnalysis()` (Z. 248).
- `roadmap.js` has `buildRoadmap()`, `renderRoadmap()`, `saveRoadmapPlan()` and `downloadRoadmapPDF()`.

Each of these scripts waits for the page with `document.addEventListener("DOMContentLoaded", ...)` and then fills the page.

One difference worth knowing: the prototype creates a **PDF** of the roadmap with the library **jsPDF** (loaded from a CDN in `index6.html`, with a check in `roadmap.js` that the library is available). The React app creates a plain text file instead (chapter 7).

---

## 6. Why the project moved to React

| Topic | Static prototype | React app |
| --- | --- | --- |
| Pages | 12 HTML files with repeated header, footer and layout | 6 page components and 4 reusable components |
| Questionnaire | 7 files, each with its own script | 1 component with a `step` state |
| Updating the screen | manual DOM code (`getElementById`, building HTML as text) | JSX: describe the result, React updates the DOM |
| Navigation | full page load per step | no reload, instant switching |
| Sharing data | `localStorage` + manual read/write | `localStorage` + `loadAppState`, kept in sync by the components |
| Reuse | copy and paste between files | components with props (`ProfileSnapshot`, `SkillAnalysis`, …) |
| Tooling | open the HTML files | Vite: dev server with hot reload, optimized build |

The static prototype was the right tool for a **first, fast version** of the flow that could be shown and tested. As the number of screens, the logic and the backend integration grew, repeating code in many files became hard to maintain, which is the point where a component framework pays off.

---

## 7. Other files in the repository

- `react/test/` contains a small connectivity test (`text.html` and `script.js`). It sends a POST request with a test message to the backend (`/api/test-message`) and logs the answer. It is useful to check that the backend is running and that CORS works before testing the real flow.
- `ux/` holds the UX material that the screens were built from: problem space exploration, user persona and scenarios, competitor analysis, two user interviews, content structure, information architecture, lo-fi wireframes, user flow, the design system, mockups and a screen recording (all as PDFs, plus the recording).
- `img/` holds screenshots and a demo video of the flow.

---

## Typical questions

**Why keep the static prototype in the repository?**
It documents the history of the project and the first version of the flow. It also shows that the data format (`futureYouState`) and the backend contract stayed the same during the move to React.

**What are the limits of the static approach?**
Every page repeats markup and styles, the DOM must be updated by hand, navigation reloads the page, and there is no component reuse. Everything grows linearly with the number of screens.

**How did the state handling change?**
The storage idea stayed the same (one object in `localStorage`). In React, components own their temporary state (`useState`), and the shared data is read through one helper (`loadAppState`), which guarantees a safe shape.

**What is the difference between an uncontrolled and a controlled input?**
In the prototype, the browser holds the value of an `<input>` and the script reads it when needed (uncontrolled). In the React questionnaire, the value lives in state and the input only displays it (controlled, chapter 3).

---

## Try it yourself

1. Open `static/index.html` in your browser (a simple local server such as the VS Code “Live Server” extension works well) and click through the flow. Which differences do you notice compared with the React app? (The page reloads between steps.)
2. Open the developer tools → Network tab while moving from question 1 to question 2. How many HTML files are requested in the prototype? Repeat in the React app. (The React app loads its code once; later steps need no new HTML file.)
3. In `index2-1.html`, change the target of `window.location.href` in Z. 88 to `index3.html`. What happens after entering a role?
4. Compare `mapProfileToBackendPayload` in `static/api.js` with the one in `react/src/utils/requestCareerPath.js`. Which fields are the same?
