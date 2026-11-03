# 4. App State: Keeping the User’s Data Across Pages

Every page of FutureYou needs the answers from the questionnaire, and several pages need the results from the backend. Because each page is its own component, they cannot simply share variables. This chapter explains how the app solves that problem with **one object in `localStorage`** and one helper function, `loadAppState`.

---

## The idea: one state object in `localStorage`

`localStorage` is a small key-value store in the browser. Data stays there when the user navigates, reloads the page or closes the tab. It can only store **strings**, so objects are converted with `JSON.stringify` when saving and with `JSON.parse` when loading.

The whole app state is saved under **one key**: `"futureYouState"`. It has five sections:

| Section | Content | Written by |
| --- | --- | --- |
| `profile` | the seven answers of the questionnaire | `QuestionnairePage.jsx` |
| `snapshot` | summary texts built from the answers | `QuestionnairePage.jsx` (`buildSnapshot`) |
| `matches` | `primary` and `secondary` career match | `requestCareerPath.js`, `MatchesPage.jsx` |
| `skillAnalysis` | `have` and `build` skill lists | `requestCareerPath.js`, `MatchesPage.jsx` |
| `roadmap` | `title`, `description`, `content` (weekly items) and `saved` | `requestCareerPath.js`, `MatchesPage.jsx`, `LearningRoadmap.jsx` |

Reading always goes through `loadAppState`. Writing is done with `localStorage.setItem("futureYouState", JSON.stringify(...))` in the places listed above.

---

## File: `src/utils/loadAppState.js`

```js
  1 | function ensureArray(value) {
  2 |     return Array.isArray(value) ? value : [];
  3 | }
  4 |
  5 | function ensureObject(value) {
  6 |     return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  7 | }
  8 |
  9 | export function loadAppState() {
 10 |     const raw = localStorage.getItem("futureYouState");
 11 |
 12 |     if (!raw) return null;
 13 |
 14 |     try {
 15 |         const parsed = JSON.parse(raw);
 16 |
 17 |         const profile = ensureObject(parsed.profile);
 18 |         const snapshot = ensureObject(parsed.snapshot);
 19 |         const matches = ensureObject(parsed.matches);
 20 |         const skillAnalysis = ensureObject(parsed.skillAnalysis);
 21 |         const roadmap = ensureObject(parsed.roadmap);
 22 |
 23 |         return {
 24 |             ...parsed,
 25 |
 26 |             profile: {
 27 |                 currentRole: profile.currentRole || "",
 28 |                 experienceLevel: profile.experienceLevel || "",
 29 |                 enjoyTasks: ensureArray(profile.enjoyTasks),
 30 |                 drainTasks: ensureArray(profile.drainTasks),
 31 |                 motivation: profile.motivation || "",
 32 |                 workStyle: profile.workStyle || "",
 33 |                 careerConcern: profile.careerConcern || ""
 34 |             },
 35 |
 36 |             snapshot: {
 37 |                 experienceSummary: snapshot.experienceSummary || "",
 38 |                 strengthSignals: ensureArray(snapshot.strengthSignals),
 39 |                 workPreferences: ensureArray(snapshot.workPreferences),
 40 |                 careerValues: ensureArray(snapshot.careerValues)
 41 |             },
 42 |
 43 |             matches: {
 44 |                 primary: matches.primary || null,
 45 |                 secondary: matches.secondary || null
 46 |             },
 47 |
 48 |             skillAnalysis: {
 49 |                 have: ensureArray(skillAnalysis.have),
 50 |                 build: ensureArray(skillAnalysis.build)
 51 |             },
 52 |
 53 |             roadmap: {
 54 |                 title: roadmap.title || "",
 55 |                 description: roadmap.description || "",
 56 |                 content: ensureArray(roadmap.content),
 57 |                 saved: Boolean(roadmap.saved)
 58 |             }
 59 |         };
 60 |     } catch (error) {
 61 |         console.error("Failed to parse futureYouState from localStorage:", error);
 62 |         return null;
 63 |     }
 64 | }
```

### Line by line

- **Z. 1–3** `ensureArray` is a small safety helper. It returns the value if it is an array and an empty array otherwise. `Array.isArray(value) ? value : []` is a ternary operator.
- **Z. 5–7** `ensureObject` does the same for objects. In JavaScript `typeof [] === "object"`, so arrays must be excluded explicitly with `!Array.isArray(value)`. The check `value &&` also catches `null` (which is an “object” in JavaScript, too).
- **Z. 9** The function is **exported** so other files can import it with `import { loadAppState } from "../utils/loadAppState"`. It is a *named export* (as opposed to `export default`), so the import needs curly braces and the exact name.
- **Z. 10** Reads the saved string. If nothing was saved under that key, `getItem` returns `null`.
- **Z. 12** If nothing is saved, the function returns `null`. All callers must handle that case (they use optional chaining like `appState?.profile`).
- **Z. 14–15** `JSON.parse` converts the string back into an object. It throws an error if the text is not valid JSON, which is why it is wrapped in `try`.
- **Z. 17–21** Reads each of the five sections. If a section is missing or has the wrong type, `ensureObject` provides `{}`, so the following lines never fail with “cannot read properties of undefined”.
- **Z. 24** `...parsed` copies everything that was saved, including any keys that are not listed below. The following properties then overwrite the five sections with **cleaned** versions.
- **Z. 26–59** For every section, each field gets a **default value**: `||` for strings (`profile.currentRole || ""`), `ensureArray` for lists, `|| null` for the matches and `Boolean(...)` for the `saved` flag. The result is a state object with a **guaranteed shape**: pages can read `state.skillAnalysis.have.map(...)` without checking whether it exists.
- **Z. 55–56** This is where the roadmap gets its `description` and `content`, which the questionnaire’s default state does not include (chapter 3, Z. 76–79).
- **Z. 60–63** If parsing fails (for example, because someone edited the data by hand), the error is logged and the function returns `null`, as if nothing were saved. The app keeps working instead of crashing.

---

## Where the state is read and written

| File | Reads | Writes |
| --- | --- | --- |
| `QuestionnairePage.jsx` | Z. 117, 194 | Z. 213 (after step 7) |
| `SnapshotPage.jsx` | Z. 56 | – |
| `MatchesPage.jsx` | Z. 11, 55 | Z. 85 (after the backend request) |
| `requestCareerPath.js` | Z. 31 | Z. 71 (stores the backend response) |
| `SkillsPage.jsx` | Z. 15 | – |
| `RoadmapPage.jsx` | Z. 5 | – |
| `LearningRoadmap.jsx` | via the `appState` prop; Z. 135 (reads `localStorage` directly when saving) | Z. 149 (“Save my plan”) |

---

## Typical questions

**Why `localStorage` and not React Context or a state library such as Redux?**
For this MVP the data must survive page changes **and** reloads, and there is no login or server-side storage. `localStorage` does both with very little code. Context would need a provider and would still lose the data on reload unless it were saved somewhere. For a larger app, or one with several users, a Context or state library plus a backend would be the better choice.

**What are the downsides of `localStorage`?**
It only stores strings, it has a size limit of about 5 MB, it is synchronous, it is readable by anyone using the browser (so it must not contain secrets) and it is per browser. Also, the pages read it when they render, so a change in one component is not automatically reflected in another component that is already on screen. In this app that does not matter, because only one page is shown at a time.

**Why does `loadAppState` rebuild the whole object instead of returning the parsed data directly?**
Data in `localStorage` can be old, incomplete or broken. For example, the roadmap structure changed during development (the backend response evolved). Rebuilding the object with defaults means the rest of the code can rely on a stable shape, so a user with data from an older version does not cause crashes.

**What does the spread operator in `...parsed` do?**
It copies all properties of `parsed` into the new object. Properties written later (`profile`, `snapshot`, …) override the copied ones with the cleaned values.

**Why is `JSON.parse` inside `try ... catch`?**
Because it throws an error for invalid JSON. Without `try ... catch`, one corrupted entry would break every page that calls `loadAppState`.

**What is the difference between `||` and `??`?**
`a || b` returns `b` if `a` is *falsy* (`""`, `0`, `false`, `null`, `undefined`). `a ?? b` returns `b` only if `a` is `null` or `undefined`. Here `||` is intentional: an empty string should also fall back to `""`.

---

## Try it yourself

1. Open the developer tools → Application → Local Storage. Find `futureYouState`. Change the value of `currentRole` and reload the questionnaire. What do you see on question 1?
2. Delete the `futureYouState` entry and open `/skills`. Which data does the page show? (The default skills of `fallbackData`, see chapter 6.)
3. Replace the saved value with the text `abc` (not valid JSON) and reload `/snapshot`. Check the console. Which message appears and does the app crash? (The message from Z. 61 appears and the page shows its default text.)
4. Write the function `saveAppState(state)` that wraps `localStorage.setItem("futureYouState", JSON.stringify(state))`. Where could you use it? (In Z. 213 of the questionnaire, Z. 71 of `requestCareerPath.js`, Z. 85 of `MatchesPage.jsx` and Z. 149 of `LearningRoadmap.jsx`, so the key `"futureYouState"` appears only once.)
