# FutureYou: Frontend Overview

This repository contains the frontend and UX/UI work for **FutureYou**, an AI-supported career path recommendation platform built as a TechLabs group project.

The frontend work focused on building the user-facing application flow, connecting pages through React Router, displaying backend results, and transforming structured API responses into a clear and usable experience.

---

## Repository Structure

```
FutureYou/
├── react/    # Main React application (active frontend)
├── static/   # Early HTML/CSS/JavaScript prototypes (legacy)
├── ux/       # UX documents (problem space, persona, interviews, wireframes, design system, mockups)
├── img/      # Screenshots and a demo video
└── doc/      # Learning documentation: line-by-line code explanations
```

- `react/` contains the final main frontend used for the MVP.
- `static/` contains earlier prototype pages created during the initial development phase.
- `ux/` and `img/` hold the design material and visuals of the project.
- `doc/` explains how the code works (see [Documentation](#documentation)).

The final product was implemented in React, while the static files remain as legacy prototype material documenting the earlier UI exploration process.

---

## Documentation

The folder [`doc/`](doc/README.md) contains a learning documentation of the frontend code. It explains the files line by line, includes typical interview questions with answers and small exercises, and is written for learning and for job interviews.

| Chapter | Topic |
| --- | --- |
| [0. Foundations](doc/00-foundations.md) | React, JSX, Vite, project structure, entry files |
| [1. Routing](doc/01-routing.md) | React Router, routes, the page flow |
| [2. Landing Page](doc/02-landing-page.md) | JSX structure, inline styles, `useNavigate` |
| [3. Questionnaire](doc/03-questionnaire.md) | `useState`, controlled inputs, validation |
| [4. App State](doc/04-app-state.md) | shared state in `localStorage` |
| [5. Backend Integration](doc/05-backend-integration.md) | `fetch`, `async/await`, payload mapping |
| [6. Result Pages](doc/06-result-pages.md) | snapshot, career matches, skill analysis |
| [7. Learning Roadmap](doc/07-learning-roadmap.md) | building, saving and downloading the plan |
| [8. CSS Architecture](doc/08-css-architecture.md) | stylesheet, layout, state classes |
| [9. Static Prototype](doc/09-static-prototype.md) | the early version and the move to React |

---

## Contribution

The work focused on the web development frontend track. The user journey was implemented and refined from the landing page to the final roadmap, with a strong emphasis on usability, structured state handling, component-based architecture, and integration of backend responses.

Main contributions:

- Built the React page flow for the user journey
- Structured pages and reusable UI components
- Integrated backend responses for:
  - profile snapshot
  - career matches
  - skill analysis
  - learning roadmap
- Mapped backend data into frontend-friendly formats
- Used local state persistence to carry user data across the application flow
- Maintained and improved the user interface styling and layout
- Kept earlier static prototype work available as legacy reference

---

## Main React Structure

The main application lives in:

```
react/src/
├── components/
│   ├── CareerMatches.jsx
│   ├── LearningRoadmap.jsx
│   ├── ProfileSnapshot.jsx
│   └── SkillAnalysis.jsx
├── pages/
│   ├── LandingPage.jsx
│   ├── MatchesPage.jsx
│   ├── QuestionnairePage.jsx
│   ├── RoadmapPage.jsx
│   ├── SkillsPage.jsx
│   └── SnapshotPage.jsx
├── styles/
│   └── app.css
├── utils/
│   ├── loadAppState.js
│   ├── quickMatch.js
│   └── requestCareerPath.js
├── App.jsx
└── main.jsx
```

---

## Key Frontend Files

1. **`react/src/App.jsx`**
   Defines the main routing structure of the application.

2. **`react/src/pages/QuestionnairePage.jsx`**
   Collects the user’s input such as:
   - current role
   - experience level
   - enjoyed tasks
   - tasks that drain energy
   - motivation
   - preferred work style
   - career concerns

3. **`react/src/pages/SnapshotPage.jsx`**
   Displays the structured summary of the user profile after the questionnaire.

4. **`react/src/pages/MatchesPage.jsx`**
   Shows primary and secondary career recommendations. This page also works with generated or backend-provided career matches.

5. **`react/src/pages/SkillsPage.jsx`**
   Displays the skill analysis section, separating:
   - skills already present
   - skills to build next

6. **`react/src/pages/RoadmapPage.jsx`**
   Displays the roadmap page and passes roadmap data into the roadmap component.

7. **`react/src/components/LearningRoadmap.jsx`**
   Renders the roadmap UI, including:
   - roadmap title
   - description
   - week-by-week content
   - save button state
   - roadmap download action

8. **`react/src/utils/requestCareerPath.js`**
   Handles the API request to the backend and normalizes the response into a structure the frontend can use.

9. **`react/src/utils/loadAppState.js`**
   Loads the persisted app state from local storage so the user flow remains connected across pages.

---

## Data Flow

The frontend processes the user journey in multiple steps:

1. The user enters profile information in the questionnaire.
2. The data is stored in the application state and in local storage.
3. The frontend requests backend results.
4. The backend returns:
   - `matches`
   - `skillAnalysis`
   - `roadmap`
5. The frontend maps the response and displays it across the respective pages.

This required careful handling because backend data structures changed during integration, especially in the roadmap and skill analysis sections.

---

## Legacy Static Prototype

The `static/` folder contains early HTML/CSS/JavaScript prototype pages.

These files were used to:

- explore UI concepts
- test early multi-page flows
- validate design ideas before the React migration

They are no longer the main implementation, but they remain useful as documentation of the project’s earlier frontend stage.

---

## Challenges

During development, the frontend work involved several integration challenges:

- changing backend response structures
- alignment issues between UI/UX expectations and actual API data
- repeated adjustments to state shape
- mapping backend objects into frontend-ready UI models
- ensuring that roadmap data, skill analysis data, and match data were all rendered correctly

One particularly important challenge was handling roadmap integration, because the backend response structure evolved late in the project and required frontend adaptation.

---

## Learning Outcome

Practical skills strengthened by this project:

- React component structure
- React Router page flow
- JavaScript object and array mapping
- conditional rendering
- local storage state persistence
- frontend/backend integration
- debugging integration mismatches
- maintaining consistency across a multi-page application

It also showed how important continuous communication is in cross-functional teams, especially when frontend, backend, and data science parts evolve in parallel.

---

## How to Run the Frontend

From the repository root:

```bash
cd react
npm install
npm run dev
```

Then open:

```
http://localhost:5173
```

The app expects the backend at `http://localhost:3000`. Without the backend, the questionnaire and all pages still work: the matches page shows an error message and falls back to locally generated matches.

---

## Notes

- The React application is the main final frontend.
- The static folder contains earlier prototype work.
- Some frontend logic was adapted during integration to match backend response updates.
- The final implementation prioritizes the React-based MVP flow.

---

## Frontend Summary

In this project, the frontend experience of FutureYou was built and refined by implementing the main React-based user journey, connecting pages, displaying AI/backend-generated results, and adapting the UI to evolving backend data structures. The result is a functional frontend flow that guides the user from questionnaire input to profile snapshot, career matches, skill analysis, and roadmap generation.
