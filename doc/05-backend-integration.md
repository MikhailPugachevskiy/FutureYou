# 5. Backend Integration: Requesting the Career Path

After the questionnaire, the frontend sends the user’s profile to the backend. The backend (built by the data science and backend team members) answers with career **matches**, a **skill analysis** and a **learning roadmap**. This chapter explains how the frontend talks to the backend and how it turns the response into the state that the pages display.

The code lives in one file: `src/utils/requestCareerPath.js`. It is a **utility module**: it contains no JSX, only functions that components import and call.

---

## The big picture

```
Questionnaire answers (state.profile)
        │  mapProfileToBackendPayload()
        ▼
POST http://localhost:3000/api/careerpath   ──►  backend
        │
        ▼
JSON response: { matches, skillAnalysis, roadmap }
        │  normalize + merge into the existing state
        ▼
localStorage ("futureYouState")  ──►  pages read it with loadAppState()
```

---

## File: `src/utils/requestCareerPath.js`

```js
  1 | import { loadAppState } from "./loadAppState";
  2 |
  3 | const FUTUREYOU_STATE_KEY = "futureYouState";
  4 |
  5 | function ensureArray(value) {
  6 |     return Array.isArray(value) ? value : [];
  7 | }
  8 |
  9 | function normalizeRoadmap(roadmap) {
 10 |     return {
 11 |         title: roadmap?.title || "",
 12 |         description: roadmap?.description || "",
 13 |         content: ensureArray(roadmap?.content),
 14 |         saved: Boolean(roadmap?.saved)
 15 |     };
 16 | }
 17 |
 18 | export function mapProfileToBackendPayload(profile = {}) {
 19 |     return {
 20 |         currentRole: profile.currentRole || "",
 21 |         interests: Array.isArray(profile.enjoyTasks) ? profile.enjoyTasks : [],
 22 |         level: profile.experienceLevel || "",
 23 |         goals: profile.motivation || "",
 24 |         workStyle: profile.workStyle || "",
 25 |         careerConcern: profile.careerConcern || "",
 26 |         skills: Array.isArray(profile.enjoyTasks) ? profile.enjoyTasks : []
 27 |     };
 28 | }
 29 |
 30 | export async function requestCareerPath(appState) {
 31 |     const currentState = appState || loadAppState() || {};
 32 |     const profile = currentState?.profile || {};
 33 |     const payload = mapProfileToBackendPayload(profile);
 34 |
 35 |     const response = await fetch("http://localhost:3000/api/careerpath", {
 36 |         method: "POST",
 37 |         headers: {
 38 |             "Content-Type": "application/json"
 39 |         },
 40 |         body: JSON.stringify(payload)
 41 |     });
 42 |
 43 |     const data = await response.json();
 44 |     console.log("BACKEND RESPONSE:", data);
 45 |
 46 |     if (!response.ok) {
 47 |         throw new Error(data?.error || "Backend request failed.");
 48 |     }
 49 |
 50 |     const nextState = {
 51 |         ...currentState,
 52 |         profile,
 53 |         matches: {
 54 |             primary: data?.matches?.primary || null,
 55 |             secondary: data?.matches?.secondary || null
 56 |         },
 57 |         skillAnalysis: {
 58 |             have: ensureArray(data?.skillAnalysis?.have),
 59 |             build: ensureArray(data?.skillAnalysis?.build)
 60 |         },
 61 |         roadmap: data?.roadmap
 62 |             ? normalizeRoadmap(data.roadmap)
 63 |             : currentState?.roadmap || {
 64 |                 title: "",
 65 |                 description: "",
 66 |                 content: [],
 67 |                 saved: false
 68 |             }
 69 |     };
 70 |
 71 |     localStorage.setItem(FUTUREYOU_STATE_KEY, JSON.stringify(nextState));
 72 |
 73 |     return data;
 74 | }
```

### Line by line

- **Z. 1** Imports `loadAppState` from the file next to it (`./` means “same folder”).
- **Z. 3** The storage key as a constant, so the string is not typed in several places.
- **Z. 5–7** The same `ensureArray` helper as in chapter 4. It makes sure a value from the backend is an array.
- **Z. 9–16** `normalizeRoadmap` turns whatever the backend sends for the roadmap into a **fixed shape** with four fields. The `?.` operator (optional chaining) returns `undefined` instead of throwing an error if `roadmap` is missing.
- **Z. 18** The function is exported, so it could also be tested or reused. `profile = {}` is a **default parameter**: if no argument is passed, an empty object is used.
- **Z. 18–28** **Mapping the profile to the backend format.** The frontend and the backend use different field names, so this function translates:

| Frontend (`profile`) | Backend payload | Note |
| --- | --- | --- |
| `currentRole` | `currentRole` | same name |
| `enjoyTasks` | `interests` | the tasks the user enjoys |
| `experienceLevel` | `level` | `"entry"`, `"mid"`, … |
| `motivation` | `goals` | e.g. `"growth_learning"` |
| `workStyle` | `workStyle` | same name |
| `careerConcern` | `careerConcern` | free text |
| `enjoyTasks` | `skills` | the backend expects a skills list; the enjoyed tasks are used for it as well |

- **Z. 30** The function is `async`. That means it returns a **Promise** and can use `await` inside. A Promise represents a result that arrives later (here: the network response).
- **Z. 31** Uses the state that was passed in. If none was passed, it loads it from `localStorage`; if that is empty too, it uses `{}`. The chain `a || b || c` picks the first truthy value.
- **Z. 32–33** Extracts the profile and converts it to the payload.
- **Z. 35–41** Sends the request with `fetch`. `await` pauses the function until the response headers arrive (the rest of the app keeps running). The options describe a `POST` request with a JSON body: `Content-Type: application/json` tells the server how to read the body, and `JSON.stringify(payload)` converts the object to text.
- **Z. 43** `response.json()` reads the response body and parses it. It is asynchronous as well, hence `await`.
- **Z. 44** A `console.log` for debugging. It is useful during integration but can be removed for production.
- **Z. 46–48** `response.ok` is `true` for status codes 200–299. For an error status, the function **throws** an `Error` with the backend’s message (or a default). The caller catches it (see `MatchesPage.jsx`, chapter 6).
- **Z. 50–69** Builds the **next state**:
  - `...currentState` keeps everything that exists already.
  - `matches` takes `primary` and `secondary` from the response, or `null` if they are missing.
  - `skillAnalysis` takes the `have` and `build` lists, always as arrays.
  - `roadmap` uses the backend’s roadmap (normalized) if there is one. Otherwise it keeps the existing roadmap, or an empty default.
- **Z. 71** Saves the new state in `localStorage`, so all pages can read the results.
- **Z. 73** Also returns the raw backend data to the caller, in case it needs it directly.

---

## How the matches page uses this function

`MatchesPage.jsx` calls `requestCareerPath` inside `useEffect` and handles loading and errors (the complete code is explained in chapter 6):

```jsx
 53 |     useEffect(() => {
 54 |         async function fetchMatches() {
 55 |             const currentState = loadAppState();
    ...
 66 |             setLoading(true);
 67 |             setError("");
 68 |
 69 |             try {
 70 |                 const data = await requestCareerPath(currentState);
    ...
 87 |             } catch (err) {
 88 |                 console.error("Could not load career matches:", err);
 89 |                 setError(err.message || "Could not load career matches.");
 90 |                 setAppState(currentState);
 91 |             } finally {
 92 |                 setLoading(false);
 93 |             }
 94 |         }
 95 |
 96 |         fetchMatches();
 97 |     }, []);
```

The pattern `try / catch / finally` is the standard way to handle `await`: the code in `try` runs normally, `catch` handles a thrown error (for example, a network failure or the `throw` in Z. 47 above) and `finally` runs in both cases (here: hide the loading message).

---

## Challenges during integration

The frontend and backend were developed **in parallel** by different team members, so the data format changed more than once. Typical problems, and how the code deals with them:

- **Changing response structures** (especially for the roadmap and the skill analysis, late in the project): every response is normalized (`ensureArray`, `normalizeRoadmap`, `?.`), so a missing or renamed field leads to an empty list instead of a crash.
- **Different field names** between frontend and backend: all translation happens in one place, `mapProfileToBackendPayload`, so a change on one side needs only one edit.
- **Different data shapes** for the same concept (for example, a skill has `name` in one version and `essential_skill` in another): the pages map every shape to one UI model (chapter 6).
- **Backend not available** (not started, network error): the pages show an error message and fall back to locally generated data, so the demo always shows something.

---

## Known limitations

- **Hard-coded URL.** `http://localhost:3000` (Z. 35) only works when the backend runs on the same computer. A production version would read the address from an environment variable (in Vite: `import.meta.env.VITE_API_URL`).
- **`response.json()` before `response.ok`.** If the server answers with an error page that is not JSON (for example, an HTML 502 page), `response.json()` throws a less helpful error. A more robust version first checks `response.ok`, then reads the body.
- **Duplicate data.** The same list (`enjoyTasks`) is sent as `interests` and as `skills` (Z. 21 and 26). This was a pragmatic choice for the MVP because the questionnaire does not ask for skills directly.
- **Debug output.** `console.log` (Z. 44) prints the whole response.

---

## Typical questions

**What is the difference between `async/await` and `.then()`?**
Both work with Promises. `await` pauses an `async` function until the Promise is settled, so asynchronous code reads like normal top-to-bottom code. `.then()` chains callbacks. Under the hood they are the same.

**Why does the code have its own `utils` file and does not call `fetch` inside the component?**
It separates concerns: components display data, the utility talks to the backend and prepares the data. The utility can be changed (or tested) without touching any JSX, and several pages can reuse it.

**What happens if the backend is offline?**
`fetch` throws a network error, the `catch` block in `MatchesPage.jsx` stores the message in the `error` state, and the page shows it in red. The state in `localStorage` is not changed, and the page falls back to locally generated matches (chapter 6).

**What is CORS and why might it matter here?**
Browsers block requests from one origin (`localhost:5173`, the frontend) to another (`localhost:3000`, the backend) unless the backend allows it with CORS headers. If the console shows a CORS error, the fix belongs on the backend (allow the frontend’s origin).

**Why is the payload mapped manually and not sent as it is?**
The frontend’s data model (`enjoyTasks`, `experienceLevel`, …) was designed for the user interface, the backend’s model (`interests`, `level`, …) for the data science logic. The mapping function is the contract between them.

---

## Try it yourself

1. Start the frontend **without** the backend, finish the questionnaire and open the matches page. What do you see? (An error message in red, plus matches generated locally.)
2. Add a `console.log(payload)` after Z. 33. Which object is sent when you answered the questionnaire? Compare it with the table above.
3. Replace `"http://localhost:3000/api/careerpath"` in Z. 35 with `import.meta.env.VITE_API_URL + "/api/careerpath"`. Create a file `.env` in `react/` with the line `VITE_API_URL=http://localhost:3000` and restart the dev server. Does it still work?
4. In the developer tools open the **Network** tab, finish the questionnaire and open the matches page. Find the request `careerpath`. Which status code does it have and what is in the *Payload* and *Response* tabs?
