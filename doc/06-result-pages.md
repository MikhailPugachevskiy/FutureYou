# 6. Result Pages: Snapshot, Career Matches and Skill Analysis

After the questionnaire, the user sees three result pages in a row:

1. **Snapshot** (`/snapshot`): a summary of what the app understood about the user.
2. **Matches** (`/matches`): two career recommendations.
3. **Skills** (`/skills`): skills the user already has and skills to build next.

All three follow the same architecture:

- A **page** (in `pages/`) reads the saved state, prepares the data and handles fallbacks.
- A **component** (in `components/`) receives the prepared data as **props** and only displays it.

This split keeps the data logic and the layout apart. It is also what made it possible to adapt the pages when the backend’s response format changed: the components stayed the same, only the mapping in the page changed.

> **Note:** The files are long, so they are shown in excerpts with the **original line numbers**. Omitted parts are marked with `...`.

---

# Part A: The Snapshot

## File: `src/pages/SnapshotPage.jsx`

### Formatting labels (Z. 1–53)

```jsx
  1 | import ProfileSnapshot from "../components/ProfileSnapshot";
  2 | import { loadAppState } from "../utils/loadAppState";
  3 | import { useNavigate } from "react-router-dom";
  4 |
  5 | function formatLabel(value) {
  6 |     if (!value) return "";
  7 |
  8 |     const map = {
  9 |         stability_security: "Stability & Security",
 10 |         growth_learning: "Growth & Learning",
    ...   (Z. 11–32: more snake_case keys with their readable labels)
 33 |     };
 34 |
 35 |     if (map[value]) return map[value];
 36 |
 37 |     return String(value)
 38 |         .replace(/_/g, " ")
 39 |         .replace(/\bAi\b/g, "AI")
 40 |         .replace(/\b\w/g, (char, index, str) => {
 41 |             const smallWords = ["and", "or", "of", "for", "to", "in", "on", "at", "with"];
 42 |             const wordStart = index;
 43 |             const rest = str.slice(wordStart);
 44 |             const match = rest.match(/^\w+/);
 45 |             const word = match ? match[0].toLowerCase() : "";
 46 |
 47 |             if (wordStart !== 0 && smallWords.includes(word)) {
 48 |                 return char.toLowerCase();
 49 |             }
 50 |
 51 |             return char.toUpperCase();
 52 |         });
 53 | }
```

- **Z. 5** `formatLabel` is a plain helper function that turns stored values into text for display. It is defined **outside** the component, because it does not need state or props.
- **Z. 6** Guard clause: no value, no label. Returning early keeps the rest of the function free of `if` nesting.
- **Z. 8–33** A **lookup object**: stored values such as `growth_learning` (the format used by the questionnaire for motivations) are mapped to display text such as “Growth & Learning”.
- **Z. 35** If the value is in the map, return the label directly.
- **Z. 37–52** Otherwise, the function formats the text generically: `.replace(/_/g, " ")` turns every underscore into a space (`/_/g` is a regular expression, `g` means “all occurrences”), `.replace(/\bAi\b/g, "AI")` fixes the word “Ai”, and the last `.replace` capitalizes the first letter of each word. Words in `smallWords` (such as “and” or “for”) stay lowercase unless they are the first word. The callback of `.replace` receives the matched character, its position (`index`) and the full text (`str`).
- **Z. 40–52** Note that this turns a sentence like “Looking for clarity and direction” into title case (“Looking for Clarity and Direction”).

### Building the snapshot data (Z. 55–116)

```jsx
 55 | export default function SnapshotPage() {
 56 |     const appState = loadAppState();
 57 |
 58 |     const navigate = useNavigate();
 59 |
 60 |     const fallbackSnapshot = {
 61 |         experienceSummary:
 62 |             "You are building your direction step by step and already have clear signals about what suits you.",
 63 |         strengthSignals: ["Problem Solving", "Creative Work", "Building Things"],
 64 |         workPreferences: ["On-Site", "Avoids: Cold Calling"],
 65 |         careerValues: ["Stability & Security", "Looking for clarity and direction"],
 66 |     };
 67 |
 68 |     const snapshotFromState =
 69 |         appState?.snapshot?.experienceSummary ||
 70 |             appState?.snapshot?.strengthSignals?.length ||
 71 |             appState?.snapshot?.workPreferences?.length ||
 72 |             appState?.snapshot?.careerValues?.length
 73 |             ? {
 74 |                 experienceSummary:
 75 |                     appState.snapshot.experienceSummary || fallbackSnapshot.experienceSummary,
 76 |
 77 |                 strengthSignals:
 78 |                     (appState.snapshot.strengthSignals || fallbackSnapshot.strengthSignals).map(formatLabel),
    ...   (Z. 79–95: workPreferences and careerValues, mapped in the same way)
 96 |             }
 97 |             : {
 98 |                 ...fallbackSnapshot,
    ...   (Z. 99–115: the same mapping applied to the fallback data)
116 |             };
```

- **Z. 56** Reads the saved state (chapter 4). It is `null` if nothing was saved.
- **Z. 60–66** **Fallback data**: sample content that is shown if the user reaches this page without saved data. This guarantees that the page is never empty, for example in a demo.
- **Z. 68–73** One long conditional expression: *if* the saved snapshot has **any** content, use it; *else* use the fallback. The four `||` parts mean “at least one of the fields is filled” (a non-empty string or a list with a length greater than 0). `condition ? valueIfTrue : valueIfFalse` is the ternary operator; the condition is everything before the `?` (Z. 68–72).
- **Z. 75** For each field, the saved value is preferred, and the fallback fills in anything that is missing.
- **Z. 78** `.map(formatLabel)` passes every list entry through `formatLabel`. Because `.map` calls its function with `(item, index, array)`, `formatLabel` only uses the first parameter.
- **Z. 80–95** In the original code, the `workPreferences` mapping has an `if` that returns `formatted` in both branches (Z. 84–88), so it could be shortened to `.map(formatLabel)` like the first field.

### Rendering (Z. 118–145)

```jsx
118 |     return (
119 |         <>
120 |             <ProfileSnapshot
121 |                 experienceSummary={snapshotFromState.experienceSummary}
122 |                 strengthSignals={snapshotFromState.strengthSignals}
123 |                 workPreferences={snapshotFromState.workPreferences}
124 |                 careerValues={snapshotFromState.careerValues}
125 |             />
126 |
127 |             <div style={{ textAlign: "center", margin: "24px 0 48px" }}>
128 |                 <button
129 |                     onClick={() => navigate("/matches")}
    ...   (Z. 130–139: button styles)
140 |                     Show my best career match →
141 |                 </button>
142 |             </div>
143 |         </>
144 |     );
145 | }
```

- **Z. 120–125** The page passes four **props** to the `ProfileSnapshot` component. A prop looks like an HTML attribute but can hold any JavaScript value (`{ ... }`).
- **Z. 129** Navigates to the next step.

## File: `src/components/ProfileSnapshot.jsx`

```jsx
  1 | export default function ProfileSnapshot({
  2 |     badge = "Profile Snapshot",
  3 |     title = "Here's what we understood about you",
  4 |     subtitle = "Review your profile and continue when ready.",
  5 |     experienceSummary = "",
  6 |     strengthSignals = [],
  7 |     workPreferences = [],
  8 |     careerValues = [],
  9 | }) {
 10 |     return (
 11 |         <section className="react-section">
 12 |             <div className="snapshot-hero-react">
 13 |                 <span className="snapshot-badge-react">{badge}</span>
 14 |                 <h1>{title}</h1>
 15 |                 <p className="subtitle">{subtitle}</p>
 16 |             </div>
 17 |
 18 |             <div className="snapshot-grid-react">
 19 |                 <article className="snapshot-card-react card-blue">
 20 |                     <div className="snapshot-card-title-react">
 21 |                         <span className="snapshot-card-icon-react blue">▣</span>
 22 |                         <h3>Experience Summary</h3>
 23 |                     </div>
 24 |                     <ul className="snapshot-card-list-react">
 25 |                         {experienceSummary ? (
 26 |                             <li>{experienceSummary}</li>
 27 |                         ) : (
 28 |                             <li>No experience summary available yet.</li>
 29 |                         )}
 30 |                     </ul>
 31 |                 </article>
 32 |
 33 |                 <article className="snapshot-card-react card-purple">
 34 |                     <div className="snapshot-card-title-react">
 35 |                         <span className="snapshot-card-icon-react purple">⚡</span>
 36 |                         <h3>Strength Signals</h3>
 37 |                     </div>
 38 |                     <ul className="snapshot-card-list-react">
 39 |                         {strengthSignals.length ? (
 40 |                             strengthSignals.map((item, index) => <li key={index}>{item}</li>)
 41 |                         ) : (
 42 |                             <li>No strength signals available yet.</li>
 43 |                         )}
 44 |                     </ul>
 45 |                 </article>
    ...   (Z. 47–73: the cards “Work Preferences” and “Career Values”, same pattern)
 74 |             </div>
 75 |         </section>
 76 |     );
 77 | }
```

- **Z. 1–9** **Destructuring props with default values.** Instead of writing `function ProfileSnapshot(props)` and `props.title`, the parameter object is unpacked directly in the function signature. `title = "..."` means: if the parent does not pass `title`, use this text. That makes the component usable without any props and prevents `undefined` errors (for example, calling `.length` on a missing list).
- **Z. 11–16** The header of the page. `{badge}`, `{title}` and `{subtitle}` insert the prop values.
- **Z. 19** Each card is an `<article>` with two classes: a shared one (`snapshot-card-react`) and a color variant (`card-blue`).
- **Z. 25–29** **Conditional rendering with a ternary:** show the text if it exists, otherwise a friendly placeholder.
- **Z. 39–43** The same pattern for lists: `strengthSignals.length` is `0` (falsy) for an empty list, so the placeholder appears. Otherwise `.map` creates one `<li>` per entry.
- **Z. 40** `key={index}` is acceptable here because the list is static for the lifetime of the page (it is never reordered or edited).
- **Z. 47–73** The cards “Work Preferences” and “Career Values” work in exactly the same way.

---

# Part B: The Career Matches

## File: `src/pages/MatchesPage.jsx`

### State, fallbacks and quick matches (Z. 1–51)

```jsx
  1 | import { useEffect, useState } from "react";
  2 | import { useNavigate } from "react-router-dom";
  3 | import CareerMatches from "../components/CareerMatches";
  4 | import { loadAppState } from "../utils/loadAppState";
  5 | import { requestCareerPath } from "../utils/requestCareerPath";
  6 | import { getQuickMatches } from "../utils/quickMatch";
  7 |
  8 | export default function MatchesPage() {
  9 |     const navigate = useNavigate();
 10 |
 11 |     const [appState, setAppState] = useState(() => loadAppState());
 12 |     const [loading, setLoading] = useState(false);
 13 |     const [error, setError] = useState("");
 14 |
    ...   (Z. 15–38: fallbackMatches, two sample career matches)
 40 |     const safeProfile = appState?.profile || {
 41 |         enjoyTasks: [],
 42 |         motivation: "",
 43 |         workStyle: "",
 44 |         experienceLevel: "entry"
 45 |     };
 46 |
 47 |     const generatedMatches = getQuickMatches(safeProfile);
 48 |
 49 |     console.log("APP STATE:", appState);
 50 |     console.log("PROFILE:", appState?.profile);
 51 |     console.log("GENERATED MATCHES:", generatedMatches);
```

- **Z. 11** Three pieces of state: the whole app state (as a lazy initial value), a `loading` flag and an `error` message. When one of them changes, React re-renders the page.
- **Z. 15–38** `fallbackMatches`: two hard-coded matches used when nothing else is available.
- **Z. 40–45** `safeProfile` is the saved profile or, if there is none, an empty default. “Safe” means the code below can always read `enjoyTasks` and the other fields.
- **Z. 47** `getQuickMatches` (see below) calculates two career matches **locally**, with no backend. They are the fallback when the backend is not available.
- **Z. 49–51** Debug output. These `console.log` calls could be removed for production.

### Fetching from the backend (Z. 53–97)

```jsx
 53 |     useEffect(() => {
 54 |         async function fetchMatches() {
 55 |             const currentState = loadAppState();
 56 |
 57 |             if (!currentState?.profile) {
 58 |                 setError("No profile data found. Please complete the questionnaire first.");
 59 |                 return;
 60 |             }
 61 |
 62 |             const hasBackendMatches =
 63 |                 currentState?.matches?.primary &&
 64 |                 currentState?.matches?.secondary;
 65 |
 66 |             setLoading(true);
 67 |             setError("");
 68 |
 69 |             try {
 70 |                 const data = await requestCareerPath(currentState);
 71 |
 72 |                 const updatedState = {
 73 |                     ...currentState,
 74 |                     matches: data.matches || currentState?.matches || generatedMatches || null,
 75 |                     skillAnalysis: data.skillAnalysis || currentState?.skillAnalysis || null,
 76 |                     roadmap: data.roadmap || currentState?.roadmap || {
 77 |                         title: "",
 78 |                         description: "",
 79 |                         content: [],
 80 |                         saved: false
 81 |                     }
 82 |                 };
 83 |
 84 |
 85 |                 localStorage.setItem("futureYouState", JSON.stringify(updatedState));
 86 |                 setAppState(updatedState);
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

- **Z. 53** `useEffect` runs code **after** the component has been drawn. The empty dependency array `[]` at the end (Z. 97) means: run this **once**, when the page appears. Fetching data belongs in an effect because a network request is a side effect, not part of rendering.
- **Z. 54, 96** The effect function itself cannot be `async`, so an `async` function is declared inside and called right away.
- **Z. 57–60** If there is no profile, the page shows an error and stops. The user has not completed the questionnaire.
- **Z. 62–64** `hasBackendMatches` is calculated but never used in the rest of the file. It is a leftover from an earlier version and can be removed.
- **Z. 66–67** Shows the loading message and clears an old error.
- **Z. 70** Sends the request (chapter 5). `await` waits for the result.
- **Z. 72–82** Merges the backend response into the state. The `||` chain picks the first available value: backend data, then existing data, then locally generated data.
- **Z. 85–86** Saves the state and updates the component’s state, which triggers a re-render with the new matches. (`requestCareerPath` already saved the state in chapter 5, Z. 71; saving again is redundant, but harmless.)
- **Z. 87–90** If anything fails, the error text is stored for display and the old state is kept.
- **Z. 91–93** `finally` runs in both cases and hides the loading message.

### Choosing and shaping the matches (Z. 99–129)

```jsx
 99 |     const activeMatches =
100 |         appState?.matches?.primary && appState?.matches?.secondary
101 |             ? appState.matches
102 |             : generatedMatches;
103 |
104 |     const matchesFromState = activeMatches
105 |         ? [
106 |             {
107 |                 id: activeMatches.primary.id || 1,
108 |                 title: activeMatches.primary.title || activeMatches.primary.currentRole || "Career Match 1",
109 |                 description: activeMatches.primary.description || "No description available.",
110 |                 reasons: Array.isArray(activeMatches.primary.whyItFits)
111 |                     ? activeMatches.primary.whyItFits
112 |                     : ["No explanation available."],
113 |                 skills: Array.isArray(activeMatches.primary.skills)
114 |                     ? activeMatches.primary.skills
115 |                     : []
116 |             },
    ...   (Z. 117–127: the same mapping for activeMatches.secondary)
128 |         ]
129 |         : fallbackMatches;
```

- **Z. 99–102** Decides which data to show: the saved matches if **both** exist, otherwise the locally generated ones. This is the layer that keeps the page working when the backend is down.
- **Z. 104–129** **Data mapping.** The backend (or the quick-match function) delivers objects with fields such as `whyItFits`; the `CareerMatches` component expects `reasons`. This block translates one into the other and fills in defaults for anything missing: `id`, `title` (or `currentRole`, an alternative field name seen in earlier backend versions), `description`, a list of reasons and a list of skills.
- **Z. 110–112, 113–115** `Array.isArray(...)` protects the component from receiving something that is not a list.

### Rendering (Z. 131–170)

```jsx
131 |     return (
132 |         <>
133 |             {loading && (
134 |                 <p style={{ textAlign: "center", marginTop: "24px" }}>
135 |                     Loading career matches...
136 |                 </p>
137 |             )}
138 |
139 |             {error && (
140 |                 <p
    ...
147 |                     {error}
148 |                 </p>
149 |             )}
150 |
151 |             <CareerMatches matches={matchesFromState} />
    ...   (Z. 153–168: the “Continue to skill analysis →” button)
170 |     );
```

- **Z. 133–137** `loading && (...)` is **conditional rendering with `&&`**: if `loading` is `true`, the paragraph is rendered; if it is `false`, React renders nothing.
- **Z. 139–149** The same for the error message, which is shown in red.
- **Z. 151** Passes the prepared list to the display component. Even when an error is shown, the page still displays matches (the locally generated ones).

## File: `src/components/CareerMatches.jsx`

```jsx
  1 | import { useState } from "react";
  2 |
  3 | export default function CareerMatches({ matches }) {
  4 |     const [activeMatch, setActiveMatch] = useState(matches?.[0]?.id || 1);
  5 |
  6 |     return (
  7 |         <div className="matches-container">
  8 |             {matches.map((match) => (
  9 |                 <div
 10 |                     key={match.id}
 11 |                     className={`match-card ${activeMatch === match.id ? "active" : ""}`}
 12 |                     onClick={() => setActiveMatch(match.id)}
 13 |                 >
 14 |                     <div className="match-header">
 15 |                         <span className="badge">MATCH #{match.id}</span>
 16 |                         <h2>{match.title}</h2>
 17 |                     </div>
 18 |
 19 |                     <p className="description">{match.description}</p>
 20 |
 21 |                     <h4>Why it fits you</h4>
 22 |
 23 |                     <ul>
 24 |                         {match.reasons.map((reason, index) => (
 25 |                             <li key={index}>✓ {reason}</li>
 26 |                         ))}
 27 |                     </ul>
 28 |
 29 |                     <div className="skills">
 30 |                         {match.skills.map((skill, index) => (
 31 |                             <span key={index} className="skill-pill">
 32 |                                 {skill}
 33 |                             </span>
 34 |                         ))}
 35 |                     </div>
 36 |                 </div>
 37 |             ))}
 38 |         </div>
 39 |     );
 40 | }
```

- **Z. 3** Destructures one prop, `matches`.
- **Z. 4** The component’s own state, `activeMatch`, remembers which card is highlighted. The initial value is the id of the first match (`matches?.[0]?.id`), or `1` if there is none.
- **Z. 8** `matches.map(...)` renders one card per match. `key={match.id}` (Z. 10) gives each card a stable identity.
- **Z. 11** A **template literal** builds the class name: every card has `match-card`, and the selected one gets the extra class `active`, which draws the purple border in `app.css`.
- **Z. 12** Clicking a card calls `setActiveMatch(match.id)`.
- **Z. 15** The badge shows the **id** of the match, not its rank. For locally generated matches the ids come from the role library (for example `6` and `2`), so the badge reads “MATCH #6”. Using the list index (`MATCH #{index + 1}`) would always show 1 and 2.
- **Z. 24–26, 30–34** Two nested lists, rendered with `.map`.

## File: `src/utils/quickMatch.js` (local fallback matching)

If the backend is not available, the frontend can still recommend roles with a small **rule-based scoring** function.

```js
  1 | const ROLE_LIBRARY = [
  2 |     {
  3 |         id: 6,
  4 |         title: "Graphic Designer",
  5 |         description: "Create visual content for branding, marketing, and communication.",
  6 |         whyItFits: [
  7 |             "Perfect for visually creative individuals",
  8 |             "Flexible career paths including freelance",
  9 |             "Strong alignment with artistic expression"
 10 |         ],
 11 |         skills: ["visual design", "branding", "design tools"],
 12 |         tags: ["Creative Work", "Building Things", "Flexibility & Freedom"]
 13 |     },
    ...   (Z. 14–73: five more roles: Cloud Engineer, Data Analyst, UX Designer,
          Project Coordinator, Marketing Specialist)
 74 | ];
 75 |
 76 | function normalize(value) {
 77 |     return String(value || "").trim().toLowerCase();
 78 | }
 79 |
 80 | function hasAny(list = [], targets = []) {
 81 |     const normalizedList = list.map(normalize);
 82 |     return targets.some((target) => normalizedList.includes(normalize(target)));
 83 | }
 84 |
 85 | function scoreRole(profile, role) {
 86 |     let score = 0;
 87 |
 88 |     const enjoyTasks = Array.isArray(profile?.enjoyTasks) ? profile.enjoyTasks : [];
 89 |     const drainTasks = Array.isArray(profile?.drainTasks) ? profile.drainTasks : [];
 90 |     const motivation = profile?.motivation || "";
 91 |     const workStyle = profile?.workStyle || "";
 92 |     const experienceLevel = profile?.experienceLevel || "";
 93 |     const currentRole = normalize(profile?.currentRole || "");
 94 |     const concern = normalize(profile?.careerConcern || "");
 95 |
 96 |     if (role.title === "Graphic Designer") {
 97 |         if (hasAny(enjoyTasks, ["Creative Work"])) score += 3;
 98 |         if (hasAny(enjoyTasks, ["Building Things"])) score += 2;
 99 |         if (normalize(motivation) === normalize("Flexibility & Freedom")) score += 2;
100 |         if (normalize(motivation) === normalize("Growth & Learning")) score += 1;
101 |         if (hasAny([workStyle], ["Fully Remote", "Hybrid", "Independent"])) score += 1;
102 |
103 |         if (hasAny(drainTasks, ["Data & Analysis"])) score -= 1;
104 |         if (currentRole.includes("teacher")) score += 1;
105 |     }
    ...   (Z. 107–155: the same kind of rules for the other five roles)
157 |     return score;
158 | }
159 |
160 | export function getQuickMatches(profile) {
161 |     const ranked = ROLE_LIBRARY
162 |         .map((role) => ({
163 |             ...role,
164 |             score: scoreRole(profile, role)
165 |         }))
166 |         .sort((a, b) => b.score - a.score);
167 |
168 |     return {
169 |         primary: ranked[0] || null,
170 |         secondary: ranked[1] || null
171 |     };
172 | }
```

- **Z. 1–74** The role library: six roles with the same structure as backend matches (`whyItFits`, `skills`). `tags` describes which answers fit the role.
- **Z. 76–78** `normalize` makes comparisons robust: text, trimmed, lower case.
- **Z. 80–83** `hasAny` answers “does the list contain at least one of these targets?”. `.some(...)` returns `true` as soon as one element matches; `.includes(...)` checks for membership.
- **Z. 85–158** `scoreRole` gives a role **points** for each fitting answer: `+3` for a strong signal, `+1` for a weak one, `-1` for something that does not fit. `score += 3` is short for `score = score + 3`. Because the work is done with plain `if` statements, the rules are easy to read and to adjust.
- **Z. 160–172** `getQuickMatches` scores every role (`.map`), sorts them by score from highest to lowest (`.sort((a, b) => b.score - a.score)`) and returns the best two as `primary` and `secondary`. If several roles have the same score, they keep their order in the library (JavaScript’s sort is stable).

> **Known limitation:** The questionnaire stores motivations in snake_case, for example `"growth_learning"` (chapter 3, Z. 36–42). The rules in `scoreRole` compare the motivation with display labels such as `"Growth & Learning"`. As written, these checks (for example Z. 99–100) never match, so motivation currently does not influence the local ranking. A fix would be to compare with the stored values (`"growth_learning"`) or to translate them first. The same applies to the drain-task rule in Z. 103, which looks for `"Data & Analysis"`, an option that only exists in the *enjoy* list.

---

# Part C: The Skill Analysis

## File: `src/pages/SkillsPage.jsx`

### Helper and fallback data (Z. 1–44)

```jsx
  1 | import { useMemo } from "react";
  2 | import { useNavigate } from "react-router-dom";
  3 | import SkillAnalysis from "../components/SkillAnalysis";
  4 | import { loadAppState } from "../utils/loadAppState";
  5 | function formatSkillLabel(value) {
  6 |     if (!value) return "";
  7 |
  8 |     return String(value)
  9 |         .replace(/_/g, " ")
 10 |         .replace(/\b\w/g, (char) => char.toUpperCase());
 11 | }
 12 | export default function SkillsPage() {
 13 |     const navigate = useNavigate();
 14 |
 15 |     const appState = loadAppState();
 16 |
 17 |     const fallbackData = {
 18 |         targetRole: "Design Director",
 19 |         have: [
 20 |             { name: "Creative Thinking", level: "strong" },
 21 |             { name: "Problem Solving", level: "strong" },
 22 |             { name: "Mentorship", level: "strong" }
 23 |         ],
    ...   (Z. 24–43: build: three skills with a name, a priority and a description)
 44 |     };
```

- **Z. 5–11** `formatSkillLabel` turns a backend skill name such as `essential_skill` into “Essential Skill”: underscores become spaces, and each word starts with a capital letter.
- **Z. 17–44** Sample data that appears if the backend delivered nothing. Each “have” skill has a `level` (`strong`), each “build” skill a `priority` and a `description`.

### Normalizing backend data (Z. 46–130)

```jsx
 46 |     const pageData = useMemo(() => {
 47 |         const targetRole =
 48 |             appState?.matches?.primary?.title ||
 49 |             appState?.matches?.primary?.currentRole ||
 50 |             fallbackData.targetRole;
 51 |
 52 |         const rawHave = Array.isArray(appState?.skillAnalysis?.have)
 53 |             ? appState.skillAnalysis.have
 54 |             : [];
 55 |
 56 |         const rawBuild = Array.isArray(appState?.skillAnalysis?.build)
 57 |             ? appState.skillAnalysis.build
 58 |             : [];
 59 |
 60 |         const hasRealSkillData = rawHave.length > 0 || rawBuild.length > 0;
 61 |
 62 |         if (!hasRealSkillData) {
 63 |             return {
 64 |                 targetRole,
 65 |                 have: fallbackData.have,
 66 |                 build: fallbackData.build
 67 |             };
 68 |         }
 69 |
 70 |         const normalizedHave = rawHave.map((item, index) => {
 71 |             const backendScore =
 72 |                 typeof item?.score === "number" ? item.score : null;
 73 |
 74 |             let derivedLevel = "moderate";
 75 |
 76 |             if (backendScore !== null) {
 77 |                 if (backendScore >= 0.6) {
 78 |                     derivedLevel = "strong";
 79 |                 } else if (backendScore >= 0.35) {
 80 |                     derivedLevel = "moderate";
 81 |                 } else {
 82 |                     derivedLevel = "emerging";
 83 |                 }
 84 |             }
 85 |
 86 |             return {
 87 |                 name:
 88 |                     formatSkillLabel(item?.name) ||
 89 |                     formatSkillLabel(item?.essential_skill) ||
 90 |                     `Skill ${index + 1}`,
 91 |                 level: item?.level || derivedLevel
 92 |             };
 93 |         });
    ...   (Z. 95–123: normalizedBuild, the same idea with priority thresholds)
125 |         return {
126 |             targetRole,
127 |             have: normalizedHave,
128 |             build: normalizedBuild
129 |         };
130 |     }, [appState]);
```

- **Z. 46** `useMemo` caches the result of the calculation. The second argument (Z. 130, `[appState]`) lists the values the calculation depends on.
- **Z. 47–50** The target role comes from the primary match, or the fallback role.
- **Z. 52–58** Make sure both lists are arrays.
- **Z. 60–68** If neither list has an entry, return the fallback data and stop.
- **Z. 70–93** The backend does not always send a ready-to-display level; sometimes it sends a numeric `score`. This block **derives** a level from the score: `0.6` or more is “strong”, `0.35` or more is “moderate”, anything lower is “emerging”. If the backend does send a `level`, it wins (`item?.level || derivedLevel`, Z. 91).
- **Z. 72** `typeof item?.score === "number"` checks the type before comparing, because a score could be missing or a string.
- **Z. 87–90** The name can arrive in two shapes (`name` or `essential_skill`); the first available one is used, and a numbered default (`Skill 1`) is the last resort.
- **Z. 95–123** The “build” list works the same way, with the thresholds `0.3` (high), `0.18` (medium) and below (low). It also creates a default description: `` `Develop stronger capability in ${skillName} for your target role.` ``.

> **Note:** `loadAppState()` (Z. 15) creates a **new object on every call**, so `appState` is a different object on each render, and `useMemo` recalculates every time. The calculation is cheap, so this does not matter for the user, but `useMemo` does not save any work here. Calling `loadAppState` inside a lazy `useState` initializer, as `MatchesPage` does, would keep one stable object.

## File: `src/components/SkillAnalysis.jsx`

```jsx
  1 | export default function SkillAnalysis({ targetRole, skillsHave, skillsBuild }) {
  2 |     return (
  3 |         <section className="skill-analysis-section">
  4 |             <div className="section-header">
  5 |                 <span className="badge">Skill Analysis</span>
  6 |                 <h1>Your skill match & gaps</h1>
  7 |                 <p className="subtitle">
  8 |                     For your transition to <strong>{targetRole}</strong>
  9 |                 </p>
 10 |             </div>
 11 |
 12 |             <div className="skills-grid-react">
 13 |                 {/* LEFT COLUMN */}
 14 |                 <div className="skills-column">
 15 |                     <div className="column-title">
 16 |                         <span className="column-icon success">✓</span>
 17 |                         <h2>Skills you already have</h2>
 18 |                     </div>
 19 |
 20 |                     <div className="skill-list-react">
 21 |                         {skillsHave.map((skill, index) => (
 22 |                             <div key={index} className="skill-row-react">
 23 |                                 <div className="skill-left-react">
 24 |                                     <span className="row-icon success">✓</span>
 25 |                                     <h3>{skill.name}</h3>
 26 |                                 </div>
 27 |                                 <span className={`tag-react ${skill.level}`}>
 28 |                                     {skill.level}
 29 |                                 </span>
 30 |                             </div>
 31 |                         ))}
 32 |                     </div>
 33 |                 </div>
    ...   (Z. 35–58: RIGHT COLUMN, “Skills to build next”)
 59 |             </div>
 60 |         </section>
 61 |     );
 62 | }
```

- **Z. 1** Receives three props: the target role and the two skill lists.
- **Z. 12–59** A two-column layout: the left column lists skills the user has, the right column lists skills to build. On screens narrower than 900 px, the columns stack (chapter 8).
- **Z. 13, 35** `{/* ... */}` is how a comment is written **inside JSX**.
- **Z. 21–31** `.map` renders one row per skill. Here `key={index}` is used because skills have no unique id.
- **Z. 27** The same **template literal** trick as in `CareerMatches`: the class name `tag-react strong` (or `moderate`, …) selects the color of the badge in `app.css`.
- **Z. 43–57** (right column) is analogous, but uses `skill.priority` for the badge (`{skill.priority} priority`) and shows the skill’s description.

---

## Typical questions

**Why are the pages and the components separated?**
The page deals with **where the data comes from** (storage, backend, fallbacks, mapping), the component deals with **how it looks**. The components work with simple, clean props, so they are easy to read, reuse and test. When the backend format changed, only the mapping code in the pages had to be updated.

**What are props?**
Props are the inputs of a component, passed like HTML attributes (`<ProfileSnapshot title="..." />`). They flow **down** from parent to child and must not be changed by the child. If a child needs to change something, the parent passes a function as a prop.

**Why does `useEffect` have `[]` at the end?**
The array lists the values that, when they change, trigger the effect again. An empty array means “only after the first render”. Without the array, the effect would run after **every** render, and since the effect sets state, it would create an endless loop of requests.

**What is the difference between `loading && <p>…</p>` and a ternary?**
`a && b` renders `b` if `a` is truthy and nothing otherwise. `a ? b : c` chooses between two outputs. Use `&&` when there is no “else” case.

**Why does the app compute fallback data in so many places?**
The demo had to work in three situations: with a running backend, without one, and without any saved data. Defaults at every level (storage → page → component) mean a missing piece never leaves an empty or broken screen.

**Why is `key={index}` used in some lists and `key={match.id}` in others?**
Keys should be stable and unique. A real id (`match.id`) is best. For lists that never change during the page’s lifetime and have no id (feature lists, tags), the index is an acceptable shortcut.

---

## Try it yourself

1. Delete `futureYouState` in Local Storage and open `/snapshot`. Which texts do you see? (The `fallbackSnapshot` from Z. 60–66.)
2. Change `fallbackData.targetRole` in `SkillsPage.jsx` (Z. 18) and open `/skills` without saved data. Where does the new role appear? (In the subtitle: “For your transition to …”.)
3. In `quickMatch.js`, give “Data Analyst” a bonus of `+5` for `experienceLevel === "entry"` (Z. 122). Which roles are recommended now when the backend is not running?
4. In `CareerMatches.jsx`, replace `MATCH #{match.id}` with `MATCH #{index + 1}`. You need to add `index` to the `.map` parameters (Z. 8). What does the badge show now?
5. Add a score check for “emerging” skills: in `app.css`, define `.tag-react.emerging`. Which skills benefit? (Skills with a score below 0.35, see Z. 82. There is no style for them yet.)
