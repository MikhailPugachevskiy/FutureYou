# 7. Learning Roadmap: Building, Saving and Downloading a Plan

The last step of the user journey is the **learning roadmap**: a week-by-week plan that helps the user close the skill gaps for the recommended career. The user can **save** the plan and **download** it as a text file.

The roadmap is built from the first of these sources that has data:

1. The **backend roadmap** (`state.roadmap.content`), if the backend delivered one.
2. Otherwise, the **skills to build** from the skill analysis (`state.skillAnalysis.build`), turned into weekly steps by the frontend.
3. If even that is empty, three default skills are used.

This chapter shows how that decision is made, how new browser features are used (`Blob`, `URL.createObjectURL`) and how the page saves data.

> **Note:** `LearningRoadmap.jsx` has 265 lines. It is shown in excerpts with the **original line numbers**. Omitted parts are marked with `...`.

---

## File: `src/pages/RoadmapPage.jsx`

```jsx
  1 | import LearningRoadmap from "../components/LearningRoadmap";
  2 | import { loadAppState } from "../utils/loadAppState";
  3 |
  4 | export default function RoadmapPage() {
  5 |     const appState = loadAppState();
  6 |     return <LearningRoadmap appState={appState} />;
  7 | }
```

- **Z. 5** Reads the saved state (chapter 4).
- **Z. 6** Passes it to the `LearningRoadmap` component as the prop `appState`. The page is only a thin wrapper: it provides the data, the component does the work. Because the state can be `null`, the component must handle that.

---

## File: `src/components/LearningRoadmap.jsx`

### Helper: normalizing the priority (Z. 1–11)

```jsx
  1 | import { useMemo, useState } from "react";
  2 | import { useNavigate } from "react-router-dom";
  3 |
  4 | function normalizePriority(priority) {
  5 |     if (!priority) return "medium";
  6 |     const value = String(priority).toLowerCase();
  7 |
  8 |     if (value.includes("high")) return "high";
  9 |     if (value.includes("low")) return "low";
 10 |     return "medium";
 11 | }
```

- **Z. 4–11** The backend may send priorities as `"high"`, `"High priority"` or in another form. This function reduces every input to exactly one of three values: `"high"`, `"medium"` or `"low"`. `.includes("high")` checks whether the text contains the word, so it also works for longer strings. If the input is missing or unknown, the result is `"medium"`.

### Building the roadmap, case 1: backend data (Z. 13–54)

```jsx
 13 | function buildRoadmapFromState(appState) {
 14 |     const roadmapFromBackend = appState?.roadmap || {};
 15 |     const backendContent = Array.isArray(roadmapFromBackend.content)
 16 |         ? roadmapFromBackend.content
 17 |         : [];
 18 |
 19 |     if (backendContent.length > 0) {
 20 |         const targetRole =
 21 |             roadmapFromBackend.title ||
 22 |             appState?.matches?.primary?.title ||
 23 |             "your next role";
 24 |
 25 |         const subtitle =
 26 |             roadmapFromBackend.description ||
 27 |             `A week-by-week plan to close your skill gaps for ${targetRole}.`;
 28 |
 29 |         const items = backendContent.map((item, index) => {
 30 |             const priority = normalizePriority(item?.priority);
 31 |
 32 |             return {
 33 |                 week: item?.week || `Week ${index + 1}`,
 34 |                 title: item?.title || item?.name || `Skill ${index + 1}`,
 35 |                 priority,
 36 |                 description:
 37 |                     item?.description || "Build this skill step by step through practice.",
 38 |                 action:
 39 |                     item?.action ||
 40 |                     (priority === "high"
 41 |                         ? "Focus deeply on this area with practical weekly exercises."
 42 |                         : priority === "medium"
 43 |                             ? "Practice consistently and apply it in small real-world tasks."
 44 |                             : "Keep improving with light repetition and reflection."),
 45 |             };
 46 |         });
 47 |
 48 |         return {
 49 |             targetRole,
 50 |             subtitle,
 51 |             items,
 52 |             saved: Boolean(roadmapFromBackend.saved),
 53 |         };
 54 |     }
```

- **Z. 13** `buildRoadmapFromState` is a plain function (not a component) that converts the app state into **exactly the data the screen needs**: `targetRole`, `subtitle`, a list of `items` and the `saved` flag.
- **Z. 14–17** Reads the roadmap section. `appState?.roadmap || {}` works even if `appState` is `null`.
- **Z. 19** If the backend delivered at least one step, use it.
- **Z. 20–23** The target role comes from the roadmap title, otherwise from the primary match, otherwise a generic text.
- **Z. 25–27** The subtitle comes from the backend’s description, otherwise from a sentence built with a template literal.
- **Z. 29–46** Each backend item is converted into the shape the screen expects. For every field there is a default, so one incomplete item cannot break the page: week (`Week 1`, `Week 2`, …), title (`title` or `name`), description and action.
- **Z. 40–44** A **nested ternary** chooses a default action text depending on the priority.
- **Z. 35** `priority,` is the short form of `priority: priority` (property shorthand).

### Building the roadmap, case 2: from the skill analysis (Z. 56–120)

```jsx
 56 |     const targetRole =
 57 |         appState?.matches?.primary?.title ||
 58 |         appState?.roadmap?.title ||
 59 |         "your next role";
 60 |
 61 |     const buildSkills =
 62 |         appState?.skillAnalysis?.build?.length
 63 |             ? appState.skillAnalysis.build
 64 |             : [
    ...   (Z. 65–82: three default skills: Strategic Planning, Leadership, Client Management)
 83 |             ];
 84 |
 85 |     const roadmapItems = buildSkills.map((skill, index) => {
 86 |         const priority = normalizePriority(skill.priority);
 87 |
 88 |         const week =
 89 |             index === 0
 90 |                 ? "Week 1"
 91 |                 : index === 1
 92 |                     ? "Week 2"
 93 |                     : index === 2
 94 |                         ? "Week 3"
 95 |                         : `Week ${index + 1}`;
 96 |
 97 |         const action =
 98 |             priority === "high"
 99 |                 ? "Focus deeply on this area with practical weekly exercises."
100 |                 : priority === "medium"
101 |                     ? "Practice consistently and apply it in small real-world tasks."
102 |                     : "Keep improving with light repetition and reflection.";
103 |
104 |         return {
105 |             week,
106 |             title: skill.name || `Skill ${index + 1}`,
107 |             priority,
108 |             description:
109 |                 skill.description || "Build this skill step by step through practice.",
110 |             action,
111 |         };
112 |     });
113 |
114 |     return {
115 |         targetRole,
116 |         subtitle: `A week-by-week plan to close your skill gaps for ${targetRole}.`,
117 |         items: roadmapItems,
118 |         saved: Boolean(appState?.roadmap?.saved),
119 |     };
120 | }
```

- **Z. 56–59** If the code reaches this point, the backend delivered no roadmap steps (the `return` in Z. 48 was not executed). The target role is taken from the primary match.
- **Z. 61–83** The skills to build come from the skill analysis. If there are none (`?.length` is `0` or `undefined`), a list of three default skills is used.
- **Z. 85–112** **Each skill becomes one week.** The first skill is “Week 1”, the second “Week 2”, and so on. The action text is chosen by priority, exactly as in case 1.
- **Z. 88–95** The nested ternary produces the same result as the last branch alone: `` `Week ${index + 1}` `` already gives “Week 1” for index 0, “Week 2” for index 1, and so on. The three special cases could be removed.
- **Z. 114–119** Returns the same shape as case 1, so the rest of the component does not care where the data came from.

### Priority label and component setup (Z. 122–131)

```jsx
122 | function priorityLabel(priority) {
123 |     if (priority === "high") return "High priority";
124 |     if (priority === "low") return "Low priority";
125 |     return "Medium priority";
126 | }
127 |
128 | export default function LearningRoadmap({ appState }) {
129 |     const navigate = useNavigate();
130 |     const roadmap = useMemo(() => buildRoadmapFromState(appState), [appState]);
131 |     const [isSaved, setIsSaved] = useState(roadmap.saved);
```

- **Z. 122–126** Turns the internal value (`"high"`) into the text for the screen (“High priority”).
- **Z. 128** The component receives the `appState` prop (destructured).
- **Z. 130** `useMemo` calls `buildRoadmapFromState` only when `appState` changes. Here it does save work: the component re-renders when `isSaved` changes, but the prop `appState` stays the same object, so the roadmap is not rebuilt.
- **Z. 131** `isSaved` remembers whether the plan was saved. The initial value is `roadmap.saved`; React uses it only on the first render.

### Saving the plan (Z. 133–156)

```jsx
133 |     const handleSave = () => {
134 |         try {
135 |             const raw = localStorage.getItem("futureYouState");
136 |             const parsed = raw ? JSON.parse(raw) : {};
137 |
138 |             const updated = {
139 |                 ...parsed,
140 |                 roadmap: {
141 |                     ...(parsed.roadmap || {}),
142 |                     title: roadmap.targetRole,
143 |                     description: roadmap.subtitle,
144 |                     content: roadmap.items,
145 |                     saved: true,
146 |                 },
147 |             };
148 |
149 |             localStorage.setItem("futureYouState", JSON.stringify(updated));
150 |             setIsSaved(true);
151 |             alert("Plan saved successfully.");
152 |         } catch (error) {
153 |             console.error("Could not save roadmap:", error);
154 |             alert("Could not save the plan.");
155 |         }
156 |     };
```

- **Z. 133** An **event handler** defined as an arrow function. It is attached to the “Save my plan” button (Z. 218).
- **Z. 135–136** Reads the saved state directly and parses it. If nothing is saved, it starts with an empty object.
- **Z. 138–147** Builds the updated state: everything stays the same (`...parsed`), only the `roadmap` section is replaced by the roadmap that is currently shown, with `saved: true`.
- **Z. 144** The saved `content` uses the screen’s item format (`week`, `title`, `priority`, `description`, `action`). When the page is opened again, `buildRoadmapFromState` can read this format as well (Z. 29–46), so the saved plan is displayed exactly as saved.
- **Z. 149–151** Saves, updates the button text via `setIsSaved(true)` and confirms with an alert.
- **Z. 152–155** `try / catch` protects the user from a crash (for example, if the storage is full or blocked) and shows an error message instead.

> **Note:** The saved plan lives in `localStorage` like all other data. If the user later opens the matches page, `MatchesPage` requests a new career path from the backend, and the backend’s roadmap replaces the saved one (chapter 5), which also resets the `saved` flag. This is acceptable for a demo; a real product would store saved plans separately.

### Downloading the plan (Z. 158–184)

```jsx
158 |     const handleDownload = () => {
159 |         const lines = [
160 |             `FutureYou - Learning Roadmap`,
161 |             ``,
162 |             `Target role: ${roadmap.targetRole}`,
163 |             `${roadmap.subtitle}`,
164 |             ``,
165 |             ...roadmap.items.flatMap((item) => [
166 |                 `${item.week}: ${item.title} (${priorityLabel(item.priority)})`,
167 |                 `Description: ${item.description}`,
168 |                 `Action: ${item.action}`,
169 |                 ``,
170 |             ]),
171 |         ];
172 |
173 |         const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
174 |         const url = URL.createObjectURL(blob);
175 |
176 |         const link = document.createElement("a");
177 |         link.href = url;
178 |         link.download = "futureyou-roadmap.txt";
179 |         document.body.appendChild(link);
180 |         link.click();
181 |         link.remove();
182 |
183 |         URL.revokeObjectURL(url);
184 |     };
```

This function creates a text file **in the browser**, with no server involved.

- **Z. 159–171** Builds the file content as an **array of lines**. Empty template strings (` `` `) create blank lines.
- **Z. 165–170** `flatMap` is `map` followed by flattening: for each roadmap item it produces **four** lines (title, description, action, blank line), and `flatMap` puts them into one flat list instead of a list of lists. The spread operator `...` inserts them into the `lines` array.
- **Z. 173** A **`Blob`** is a file-like object in memory. `lines.join("\n")` connects all lines into one text with line breaks. The `type` tells the browser it is plain UTF-8 text.
- **Z. 174** `URL.createObjectURL(blob)` creates a temporary address (`blob:...`) that points to the data in memory.
- **Z. 176–178** Creates an invisible link element. Its `download` attribute tells the browser to save the file under the name `futureyou-roadmap.txt` instead of opening it.
- **Z. 179–181** The link is added to the page, clicked by code and removed again. Some browsers only react to links that are part of the page.
- **Z. 183** `URL.revokeObjectURL(url)` releases the memory used by the temporary address.

### Rendering the roadmap (Z. 186–229)

```jsx
186 |     return (
187 |         <section className="react-section roadmap-react-section">
188 |             <div className="roadmap-hero-react">
189 |                 <span className="badge">Learning Roadmap</span>
190 |                 <h1>
191 |                     Your path to <span>{roadmap.targetRole}</span>
192 |                 </h1>
193 |                 <p className="subtitle">{roadmap.subtitle}</p>
194 |             </div>
195 |
196 |             <div className="roadmap-list-react">
197 |                 {roadmap.items.map((item) => (
198 |                     <article className="roadmap-item-react" key={`${item.week}-${item.title}`}>
199 |                         <div className="roadmap-item-top">
200 |                             <span className="roadmap-week">{item.week}</span>
201 |                             <span className={`roadmap-priority ${item.priority}`}>
202 |                                 {priorityLabel(item.priority)}
203 |                             </span>
204 |                         </div>
205 |
206 |                         <h3>{item.title}</h3>
207 |                         <p>{item.description}</p>
208 |
209 |                         <div className="roadmap-action-box">
210 |                             <strong>Action:</strong>
211 |                             <span>{item.action}</span>
212 |                         </div>
213 |                     </article>
214 |                 ))}
215 |             </div>
216 |
217 |             <div className="roadmap-actions-react">
218 |                 <button className="btn-primary" type="button" onClick={handleSave}>
219 |                     {isSaved ? "Plan saved" : "Save my plan"}
220 |                 </button>
221 |
222 |                 <button className="btn-secondary" type="button" onClick={handleDownload}>
223 |                     Download roadmap
224 |                 </button>
225 |             </div>
226 |
227 |             <p className="roadmap-hint-react">
228 |                 This roadmap is personalized to your profile. Adjust the pace to fit your schedule.
229 |             </p>
```

- **Z. 191** The target role is wrapped in a `<span>` so CSS can color it differently from the rest of the headline (`.roadmap-hero-react h1 span`).
- **Z. 197–214** `.map` renders one card per roadmap item.
- **Z. 198** The `key` combines two values with a template literal (`week-title`), because neither value alone is guaranteed to be unique. A key must be unique **among siblings** and stable.
- **Z. 201** The class name is assembled from the priority (`roadmap-priority high`), so CSS can color the badge red, orange or grey.
- **Z. 218–220** The button label depends on state: `{isSaved ? "Plan saved" : "Save my plan"}` is a ternary inside JSX. `onClick={handleSave}` passes the function without parentheses.
- **Z. 222** `onClick={handleDownload}` triggers the download.

### Navigation buttons (Z. 231–265)

The last block (Z. 231–262) contains two buttons styled with inline styles: “Back to snapshot” (`navigate("/snapshot")`, Z. 233) and “Review career matches” (`navigate("/matches")`, Z. 249). Z. 263–265 close the section and the function.

---

## Typical questions

**Why does `buildRoadmapFromState` live outside the component?**
It does not need state, props or hooks, it only converts data. As a plain function it is easier to read and test, and it is not re-created on every render.

**What is `useMemo` and when is it useful?**
`useMemo(() => calculation, [dependencies])` stores the result and recalculates only if a dependency changes. It helps with expensive calculations or when you need a stable object reference. For cheap calculations it is not necessary. Here it prevents rebuilding the list on every click on “Save my plan”.

**How does the download work without a server?**
The browser creates the file from data in memory: a `Blob` holds the text, `URL.createObjectURL` gives it a temporary URL, and a link with the `download` attribute saves it to the user’s computer.

**Why a `.txt` file and not a PDF?**
Text needs no library. The earlier static prototype used the library jsPDF to create a PDF (chapter 9). For the React MVP, a plain text file was the simpler and more robust choice.

**What does `flatMap` do?**
It combines `map` and `flat`: each element is converted to an array, and the arrays are merged into one. It is the right tool when every item produces several lines.

**Why is a `try / catch` used when saving?**
`localStorage` and `JSON.parse` can throw errors (full storage, private mode, corrupted data). The `catch` block shows a message instead of letting the page break.

---

## Try it yourself

1. Open `/roadmap` without any saved data. Which target role and which weeks do you see? (“your next role” and the three default skills.)
2. Click “Save my plan” and check Local Storage. What changed in `roadmap`? (`title`, `description`, `content` are filled and `saved` is `true`.)
3. Change the file name in Z. 178 to `my-plan.txt` and download the plan. Open the file. Does it match the text on the screen?
4. Simplify Z. 88–95 to ``const week = `Week ${index + 1}`;`` Does the roadmap look the same?
5. Add a fourth line to each downloaded item in Z. 166–169, for example a line that shows the priority as a number (high = 1, medium = 2, low = 3).
