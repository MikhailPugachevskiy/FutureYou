# 3. Questionnaire: A Multi-Step Form with Controlled Inputs

`QuestionnairePage.jsx` is the largest page of the app. It collects seven answers in seven steps, validates each step, shows a progress bar and, at the end, saves everything for the next pages.

This chapter is the most important one for understanding **state**, **events**, **controlled components**, **lists** and **conditional rendering**.

> **Note:** The file has 589 lines. Below it is shown in excerpts with the **original line numbers**. Repeated option entries and most of the style object (Z. 402–589) are summarized.

---

## The big idea: one component, one `step` number

Instead of creating seven separate pages, the questionnaire is **one component** that remembers which question is currently shown:

```jsx
const [step, setStep] = useState(1);
```

When the user clicks “Continue”, `step` increases and React re-renders the component with the next question. All answers are collected in a second state object, `profile`.

---

## File: `src/pages/QuestionnairePage.jsx`

### Part 1: Imports and the option lists (Z. 1–50)

```jsx
  1 | import { useMemo, useState } from "react";
  2 | import { useNavigate } from "react-router-dom";
  3 | import { loadAppState } from "../utils/loadAppState";
  4 |
  5 | const TOTAL_STEPS = 7;
  6 |
  7 | const ENJOY_OPTIONS = [
  8 |     { value: "Problem Solving", icon: "🧩" },
  9 |     { value: "Creative Work", icon: "🎨" },
 10 |     { value: "Data & Analysis", icon: "📊" },
    ...   (Z. 11–15: five more options)
 16 | ];
    ...   (Z. 18–27: DRAIN_OPTIONS, same structure)
 29 | const EXPERIENCE_OPTIONS = [
 30 |     { value: "entry", label: "Entry Level", sublabel: "0–2 years", icon: "🌿" },
 31 |     { value: "mid", label: "Mid Level", sublabel: "3–5 years", icon: "🌱" },
 32 |     { value: "senior", label: "Senior Level", sublabel: "6–10 years", icon: "🌳" },
 33 |     { value: "executive", label: "Executive", sublabel: "10+ years", icon: "🏔️" }
 34 | ];
    ...   (Z. 36–50: MOTIVATION_OPTIONS and WORKSTYLE_OPTIONS)
```

- **Z. 1** Imports two hooks. `useState` remembers values; `useMemo` caches a calculation (see Z. 130).
- **Z. 2** `useNavigate` is used to leave the questionnaire (Z. 177 and 214).
- **Z. 3** `loadAppState` reads the saved data from `localStorage` (chapter 4).
- **Z. 5** A constant for the number of steps. It is used for the progress bar and to detect the last step. Using a constant instead of the “magic number” 7 means there is only one place to change.
- **Z. 7–16** The options for “What tasks do you enjoy most?”. Each option is an object with a `value` (what is stored) and an `icon` (what is displayed). The data lives **outside** the component because it never changes, so it is not re-created on every render.
- **Z. 18–27** `DRAIN_OPTIONS` for “What tasks drain you?”, with the same structure.
- **Z. 29–34** Options for the experience level. Here the stored `value` (`"entry"`) differs from the displayed `label` (`"Entry Level"`). The `sublabel` is the small text below the label.
- **Z. 36–50** `MOTIVATION_OPTIONS` and `WORKSTYLE_OPTIONS`. Motivation values are written in snake_case (e.g. `"growth_learning"`), work style values as readable text (e.g. `"Fully Remote"`). This difference matters later (chapters 5 and 6).

### Part 2: The default state (Z. 52–80)

```jsx
 52 | const DEFAULT_STATE = {
 53 |     profile: {
 54 |         currentRole: "",
 55 |         experienceLevel: "",
 56 |         enjoyTasks: [],
 57 |         drainTasks: [],
 58 |         motivation: "",
 59 |         workStyle: "",
 60 |         careerConcern: ""
 61 |     },
 62 |     snapshot: {
 63 |         experienceSummary: "",
 64 |         strengthSignals: [],
 65 |         workPreferences: [],
 66 |         careerValues: []
 67 |     },
 68 |     matches: {
 69 |         primary: null,
 70 |         secondary: null
 71 |     },
 72 |     skillAnalysis: {
 73 |         have: [],
 74 |         build: []
 75 |     },
 76 |     roadmap: {
 77 |         title: "",
 78 |         saved: false
 79 |     }
 80 | };
```

- **Z. 52–80** The shape of the **whole app state**. It has five sections: `profile` (the user’s answers), `snapshot` (the summary built from the answers), `matches`, `skillAnalysis` and `roadmap` (results from the backend). The questionnaire fills `profile` and `snapshot`; the other sections stay empty until the backend answers.
- **Z. 56–57** Questions 3 and 4 allow **several** answers, so `enjoyTasks` and `drainTasks` are arrays. All other answers are single strings.
- **Z. 76–79** The roadmap only has `title` and `saved` here. The missing `description` and `content` are added by `loadAppState` (chapter 4).

### Part 3: Building the snapshot (Z. 82–114)

```jsx
 82 | function buildSnapshot(profile) {
 83 |     const levelMap = {
 84 |         entry: "You are at the beginning of your professional journey and building your foundation.",
 85 |         mid: "You already have practical experience and are building toward your next step.",
 86 |         senior: "You bring solid experience and are ready for more advanced responsibility.",
 87 |         executive: "You have extensive experience and may be ready for strategic leadership opportunities."
 88 |     };
 89 |
 90 |     return {
 91 |         experienceSummary:
 92 |             levelMap[profile.experienceLevel] ||
 93 |             "You are building your professional direction step by step.",
 94 |         strengthSignals: Array.isArray(profile.enjoyTasks) ? profile.enjoyTasks.slice(0, 3) : [],
 95 |         workPreferences: [
 96 |             profile.workStyle || "Flexible work style",
 97 |             ...(Array.isArray(profile.drainTasks) && profile.drainTasks.length
 98 |                 ? [`Avoids: ${profile.drainTasks[0]}`]
 99 |                 : [])
100 |         ],
101 |         careerValues: [
102 |             profile.motivation || "Professional growth",
103 |             profile.careerConcern?.toLowerCase().includes("ai")
104 |                 ? "Seeking future-proof career paths"
105 |                 : profile.careerConcern?.toLowerCase().includes("stuck")
106 |                     ? "Looking for growth and change"
107 |                     : profile.careerConcern?.toLowerCase().includes("direction")
108 |                         ? "Looking for clarity and direction"
109 |                         : profile.careerConcern?.trim()
110 |                             ? "Trying to reduce career uncertainty"
111 |                             : "Exploring next career steps"
112 |         ]
113 |     };
114 | }
```

This function turns the raw answers into the four texts shown on the snapshot page (chapter 6). It is a **plain function**, not a component: it takes a `profile` and returns an object.

- **Z. 83–88** A lookup object. It maps the experience level (`"entry"`) to a sentence.
- **Z. 92–93** `levelMap[profile.experienceLevel]` looks up the sentence. If the level is unknown or empty, the result is `undefined`, and the `||` operator uses the default text instead.
- **Z. 94** `.slice(0, 3)` takes the first three enjoyed tasks as “strength signals”. `Array.isArray(...)` protects against a value that is not an array.
- **Z. 96** The first work preference is the chosen work style, with a default if none exists.
- **Z. 97–99** The spread operator `...` adds the “Avoids: …” entry **only if** at least one drained task exists. In the other case, it spreads an empty array, which adds nothing.
- **Z. 98** A **template literal** (backticks) inserts a value into text: `` `Avoids: ${profile.drainTasks[0]}` ``.
- **Z. 103–111** A chain of ternary operators (`a ? b : c`). It checks the free text in `careerConcern` and picks a matching sentence. `?.` (optional chaining) prevents an error if `careerConcern` is `undefined`, and `.toLowerCase()` makes the check case-insensitive.

> **Known limitation:** `.includes("ai")` checks for the two letters “ai” anywhere in the text, so words such as “again”, “maintain” or “daily” also trigger “Seeking future-proof career paths”. A more precise check would look for the whole word, for example with a regular expression such as `/\bai\b/`.

### Part 4: Initial state and the first helpers (Z. 116–151)

```jsx
116 | function getInitialProfile() {
117 |     const saved = loadAppState();
118 |
119 |     return {
120 |         ...DEFAULT_STATE.profile,
121 |         ...(saved?.profile || {})
122 |     };
123 | }
124 |
125 | export default function QuestionnairePage() {
126 |     const navigate = useNavigate();
127 |     const [step, setStep] = useState(1);
128 |     const [profile, setProfile] = useState(getInitialProfile);
129 |
130 |     const percent = useMemo(() => Math.round((step / TOTAL_STEPS) * 100), [step]);
131 |
132 |     function updateField(field, value) {
133 |         setProfile((prev) => ({
134 |             ...prev,
135 |             [field]: value
136 |         }));
137 |     }
138 |
139 |     function toggleMultiValue(field, value) {
140 |         setProfile((prev) => {
141 |             const current = Array.isArray(prev[field]) ? prev[field] : [];
142 |             const exists = current.includes(value);
143 |
144 |             return {
145 |                 ...prev,
146 |                 [field]: exists
147 |                     ? current.filter((item) => item !== value)
148 |                     : [...current, value]
149 |             };
150 |         });
151 |     }
```

- **Z. 116–123** `getInitialProfile` creates the starting value of the form: the defaults, overwritten by anything that was saved before. So if the user comes back to the questionnaire, the earlier answers are still filled in.
- **Z. 127** `step` starts at 1.
- **Z. 128** `useState(getInitialProfile)` passes the **function itself**, not its result. React calls it only once, on the first render. This is called a **lazy initializer**. Writing `useState(getInitialProfile())` would read `localStorage` on every render.
- **Z. 130** `useMemo` caches the progress percentage and recalculates it only when `step` changes (the second argument `[step]` is the dependency list). For such a tiny calculation, `useMemo` is not necessary, but it shows the concept.
- **Z. 132–137** `updateField` changes **one** field of the profile. `setProfile((prev) => ({ ...prev, [field]: value }))` uses the **functional form** of the setter: React passes the latest state as `prev`, which is the safe way to update state based on the old state. `{ ...prev }` copies all existing fields, and `[field]: value` (a *computed property name*) overwrites only the one that changed.
- **Z. 139–151** `toggleMultiValue` is for the questions with several answers. If the value is already in the array (`exists`), it is removed with `.filter(...)`. Otherwise it is added with `[...current, value]`. Both create a **new array**; the old one is never modified (no `push`), because React only notices a change when the reference changes.

### Part 5: Validation (Z. 153–173)

```jsx
153 |     function validateCurrentStep() {
154 |         if (step === 1) return profile.currentRole.trim().length > 0;
155 |         if (step === 2) return !!profile.experienceLevel;
156 |         if (step === 3) return Array.isArray(profile.enjoyTasks) && profile.enjoyTasks.length > 0;
157 |         if (step === 4) return Array.isArray(profile.drainTasks) && profile.drainTasks.length > 0;
158 |         if (step === 5) return !!profile.motivation;
159 |         if (step === 6) return !!profile.workStyle;
160 |         if (step === 7) return profile.careerConcern.trim().length > 0;
161 |         return true;
162 |     }
163 |
164 |     function getValidationMessage() {
165 |         if (step === 1) return "Please enter your current role.";
166 |         if (step === 2) return "Please select one option.";
167 |         if (step === 3) return "Please select at least one option.";
168 |         if (step === 4) return "Please select at least one option.";
169 |         if (step === 5) return "Please select one option.";
170 |         if (step === 6) return "Please select one option.";
171 |         if (step === 7) return "Please write a short career concern before continuing.";
172 |         return "Please complete this step.";
173 |     }
```

- **Z. 153–162** Returns `true` if the **current** step is filled in. Text fields use `.trim().length > 0` (so a field with only spaces is invalid), single choices use `!!value` (double negation converts a string to `true`/`false`), and multiple choices need at least one array entry.
- **Z. 164–173** The matching message for each step.

### Part 6: Back and Continue (Z. 175–215)

```jsx
175 |     function handleBack() {
176 |         if (step === 1) {
177 |             navigate("/");
178 |             return;
179 |         }
180 |         setStep((prev) => prev - 1);
181 |     }
182 |
183 |     function handleContinue() {
184 |         if (!validateCurrentStep()) {
185 |             alert(getValidationMessage());
186 |             return;
187 |         }
188 |
189 |         if (step < TOTAL_STEPS) {
190 |             setStep((prev) => prev + 1);
191 |             return;
192 |         }
193 |
194 |         const existingState = loadAppState() || DEFAULT_STATE;
195 |
196 |         const updatedState = {
197 |             ...DEFAULT_STATE,
198 |             ...existingState,
199 |             profile: {
200 |                 ...DEFAULT_STATE.profile,
201 |                 ...(existingState.profile || {}),
202 |                 ...profile
203 |             },
204 |             snapshot: buildSnapshot(profile),
205 |             matches: existingState.matches || DEFAULT_STATE.matches,
206 |             skillAnalysis: existingState.skillAnalysis || DEFAULT_STATE.skillAnalysis,
207 |             roadmap: {
208 |                 ...DEFAULT_STATE.roadmap,
209 |                 ...(existingState.roadmap || {})
210 |             }
211 |         };
212 |
213 |         localStorage.setItem("futureYouState", JSON.stringify(updatedState));
214 |         navigate("/snapshot");
215 |     }
```

- **Z. 175–181** “Back”: on step 1 it leaves the questionnaire and goes to the start page. Otherwise it lowers `step` by one. The early `return` after `navigate` stops the function so `setStep` is not executed as well.
- **Z. 183–187** “Continue” first validates. If the step is incomplete, it shows the message and stops (`return`).
- **Z. 189–192** If this is not the last step, it moves on to the next question.
- **Z. 194** On the last step, the saved state is loaded. If nothing was saved yet, `DEFAULT_STATE` is used.
- **Z. 196–211** Builds the **complete new state**. Later spreads overwrite earlier ones: defaults first, then the existing state, then the new `profile` (Z. 199–203). The `snapshot` is always rebuilt from the current answers (Z. 204). Results from the backend (`matches`, `skillAnalysis`, `roadmap`) are kept if they exist.
- **Z. 213** Saves the object as text. `localStorage` can only store strings, so `JSON.stringify` converts the object to a JSON string.
- **Z. 214** Navigates to `/snapshot`.

> **Note:** Validation errors are shown with the browser’s `alert()` (Z. 185). It is simple and reliable, but it blocks the page and cannot be styled. A common improvement is to keep an `error` state and show the message inside the page.

### Part 7: Reusable render helpers (Z. 217–280)

```jsx
217 |     function renderRadioGrid(options, field, selectedValue) {
218 |         return (
219 |             <div style={styles.optionsGrid}>
220 |                 {options.map((option) => {
221 |                     const selected = selectedValue === option.value;
222 |
223 |                     return (
224 |                         <button
225 |                             key={option.value}
226 |                             type="button"
227 |                             onClick={() => updateField(field, option.value)}
228 |                             style={{
229 |                                 ...styles.optionCardButton
230 |                             }}
231 |                         >
232 |                             <div
233 |                                 style={{
234 |                                     ...styles.optionContent,
235 |                                     borderColor: selected ? "rgba(108, 99, 255, 0.55)" : "#eef0f4",
236 |                                     boxShadow: selected
237 |                                         ? "0 10px 22px rgba(108, 99, 255, 0.14)"
238 |                                         : "none"
239 |                                 }}
240 |                             >
241 |                                 <div style={styles.optionIcon}>{option.icon}</div>
242 |                                 <div style={styles.optionTextWrap}>
243 |                                     <h3 style={styles.optionHeading}>{option.label}</h3>
244 |                                     <p style={styles.optionParagraph}>{option.sublabel}</p>
245 |                                 </div>
246 |                             </div>
247 |                         </button>
248 |                     );
249 |                 })}
250 |             </div>
251 |         );
252 |     }
253 |
254 |     function renderPillGrid(options, field, selectedValues) {
255 |         return (
256 |             <div style={styles.pillGrid}>
257 |                 {options.map((option) => {
258 |                     const selected = selectedValues.includes(option.value);
259 |
260 |                     return (
261 |                         <button
262 |                             key={option.value}
263 |                             type="button"
264 |                             onClick={() => toggleMultiValue(field, option.value)}
265 |                             style={{
266 |                                 ...styles.pill,
267 |                                 borderColor: selected ? "rgba(108, 99, 255, 0.55)" : "#eef0f4",
268 |                                 boxShadow: selected
269 |                                     ? "0 10px 22px rgba(108, 99, 255, 0.14)"
270 |                                     : "none"
271 |                             }}
272 |                         >
273 |                             <span style={styles.pillIcon}>{option.icon}</span>
274 |                             <span>{option.value}</span>
275 |                         </button>
276 |                     );
277 |                 })}
278 |             </div>
279 |         );
280 |     }
```

Two helper functions render the answer options, so the same code serves several steps.

- **Z. 217** `renderRadioGrid` is for **single choice** (steps 2, 5, 6). The parameters say which options to show, which profile field to change and which value is currently selected.
- **Z. 220** `.map()` turns each option object into a button. This is how lists are rendered in React.
- **Z. 225** `key={option.value}` gives each list item a stable identity. React uses the key to know which items were added, removed or changed. Keys must be unique among siblings.
- **Z. 226** `type="button"` prevents the button from behaving like a form submit button.
- **Z. 227** Clicking calls `updateField` with the option’s value, which **replaces** the old answer.
- **Z. 221, 235–238** `selected` is `true` for the chosen option. The ternary operator then changes the border color and shadow: the selected card gets a purple outline.
- **Z. 229, 234** `...styles.optionCardButton` **spreads** a style object into a new one. Properties that follow (like `borderColor`) override the spread ones. This is how a base style and a dynamic style are combined.
- **Z. 254–280** `renderPillGrid` is for **multiple choice** (steps 3 and 4). The differences: `selectedValues.includes(...)` checks whether the value is in the array (Z. 258), and a click calls `toggleMultiValue`, which adds **or** removes the value (Z. 264).

### Part 8: What each step shows (Z. 282–362)

```jsx
282 |     function renderStepContent() {
283 |         if (step === 1) {
284 |             return (
285 |                 <>
286 |                     <h1 style={styles.questionTitle}>What&apos;s your current role?</h1>
287 |                     <p style={styles.subtitle}>Or the most recent role you&apos;ve held.</p>
288 |                     <input
289 |                         type="text"
290 |                         value={profile.currentRole}
291 |                         onChange={(e) => updateField("currentRole", e.target.value)}
292 |                         placeholder="e.g. Marketing Manager, Software Engineer, Teacher..."
293 |                         style={styles.textInput}
294 |                     />
295 |                 </>
296 |             );
297 |         }
298 |
299 |         if (step === 2) {
300 |             return (
301 |                 <>
302 |                     <h1 style={styles.questionTitle}>What&apos;s your experience level?</h1>
303 |                     <p style={styles.subtitle}>Choose the one that best describes where you are.</p>
304 |                     {renderRadioGrid(EXPERIENCE_OPTIONS, "experienceLevel", profile.experienceLevel)}
305 |                 </>
306 |             );
307 |         }
308 |
309 |         if (step === 3) {
310 |             return (
311 |                 <>
312 |                     <h1 style={styles.questionTitle}>What tasks do you enjoy most?</h1>
313 |                     <p style={styles.subtitle}>Select all that energize you.</p>
314 |                     {renderPillGrid(ENJOY_OPTIONS, "enjoyTasks", profile.enjoyTasks)}
315 |                 </>
316 |             );
317 |         }
    ...   (Z. 319–347: steps 4, 5 and 6, same pattern)
349 |         return (
350 |             <>
351 |                 <h1 style={styles.questionTitle}>What&apos;s your biggest career concern?</h1>
352 |                 <p style={styles.subtitle}>Be honest — this helps us give better guidance.</p>
353 |                 <textarea
354 |                     value={profile.careerConcern}
355 |                     onChange={(e) => updateField("careerConcern", e.target.value)}
356 |                     placeholder="e.g. I'm worried about being replaced by AI, I feel stuck in my current role, I don't know what I'm good at..."
357 |                     rows={6}
358 |                     style={styles.textInput}
359 |                 />
360 |             </>
361 |         );
362 |     }
```

- **Z. 282–283** `renderStepContent` returns different JSX depending on `step`. This is **conditional rendering** with `if` statements outside of JSX (where `if` is allowed).
- **Z. 285 and 295** A fragment (`<> ... </>`) lets a function return several siblings (heading, text, input) without an extra `<div>`.
- **Z. 288–294** A **controlled input**: its `value` comes from state (`profile.currentRole`), and every keystroke calls `onChange`, which updates the state. React is the “single source of truth”; the browser does not keep its own copy of the text.
- **Z. 291** `e.target.value` is the current text of the field.
- **Z. 304, 314** The helpers from Part 7 are called here with the matching options, field name and current value.
- **Z. 349–361** The last step is the fallback `return` for step 7: a controlled `<textarea>`. In React, a `<textarea>` is controlled via `value` and `onChange`, like an `<input>`.

### Part 9: The page layout (Z. 364–400)

```jsx
364 |     return (
365 |         <main style={styles.page}>
366 |             <header style={styles.topNav}>
367 |                 <div style={styles.logoArea}>
368 |                     <div style={styles.logoIcon}>✦</div>
369 |                     <span style={styles.logoText}>FutureYou</span>
370 |                 </div>
371 |             </header>
372 |
373 |             <section style={styles.progressSection}>
374 |                 <div style={styles.progressInfo}>
375 |                     <span>Question {step} of {TOTAL_STEPS}</span>
376 |                     <span>{percent}%</span>
377 |                 </div>
378 |                 <div style={styles.progressBar}>
379 |                     <div style={{ ...styles.progressFill, width: `${percent}%` }} />
380 |                 </div>
381 |             </section>
382 |
383 |             <main style={styles.questionContainer}>
384 |                 <div style={styles.questionInner}>
385 |                     {renderStepContent()}
386 |                 </div>
387 |             </main>
388 |
389 |             <footer style={styles.bottomNav}>
390 |                 <button type="button" onClick={handleBack} style={styles.btnBack}>
391 |                     ← Back
392 |                 </button>
393 |
394 |                 <button type="button" onClick={handleContinue} style={styles.btnContinue}>
395 |                     {step === TOTAL_STEPS ? "See My Profile →" : "Continue →"}
396 |                 </button>
397 |             </footer>
398 |         </main>
399 |     );
400 | }
```

- **Z. 375** `{step}` and `{TOTAL_STEPS}` insert values into the text: “Question 3 of 7”.
- **Z. 378–380** The progress bar is a grey track (Z. 378) with a colored inner bar (Z. 379). The inner bar’s width is set to the percentage with a template literal (`` `${percent}%` ``). The spread `...styles.progressFill` keeps the base style, and `width` overrides it dynamically. The CSS `transition` (Z. 458) animates the change.
- **Z. 385** Calls `renderStepContent()` to insert the current question.
- **Z. 390** `onClick={handleBack}` passes the function **without** parentheses, because it needs no arguments and should run on click, not during rendering.
- **Z. 395** The last step changes the button text with a ternary: “See My Profile →” instead of “Continue →”.

> **Known limitation:** `<main>` appears twice, once as the page wrapper (Z. 365) and once around the question (Z. 383). A page should only have one `<main>` landmark. Changing the outer element (Z. 365 and 398) to a `<div>` would fix this.

### Part 10: The styles object (Z. 402–589)

```jsx
402 | const styles = {
403 |     page: {
404 |         minHeight: "100vh",
405 |         background: "#f7f8fc",
406 |         color: "#111827",
407 |         display: "flex",
408 |         flexDirection: "column",
409 |         fontFamily: "Inter, sans-serif"
410 |     },
    ...   (Z. 411–588: topNav, progressBar, optionsGrid, pill, bottomNav, buttons, ...)
589 | };
```

- **Z. 402** All styles of this page are collected in **one object** named `styles`. In JSX they are used as `style={styles.page}`. This keeps the JSX readable. Because `styles` is declared with `const` below the component, it is initialized when the module loads, before any rendering happens.
- **Z. 437** `width: "min(780px, 72%)"` uses the CSS function `min()`: the width is 72 % of the parent, but never more than 780 px.
- **Z. 458** `transition: "width 0.4s ease"` makes the progress bar grow smoothly.

---

## Typical questions

**What is a controlled component?**
An input whose value is controlled by React state. The field shows `value={profile.currentRole}` and reports each change with `onChange`. Because the state is the only source of truth, the app can validate, reset or prefill the field at any time.

**Why is the functional form `setProfile((prev) => ...)` used?**
State updates may be batched and applied later. With the functional form, React passes the latest state as `prev`, so updates never work with outdated data. It is the recommended form whenever the new state depends on the old one.

**Why can’t we use `push()` to add an item to `enjoyTasks`?**
React detects changes by comparing references. `push()` modifies the array in place and the reference stays the same, so React might not re-render. `[...current, value]` creates a new array.

**Why `key={option.value}` and not the index?**
The value is unique and stays the same if the list changes. An index changes when items are reordered, which can lead to wrong updates. Index keys are acceptable only for static lists that never change.

**Why one component for seven steps and not seven pages?**
All steps share the same state (`profile`), the same layout and the same buttons. With one component, the answers stay in memory when moving between questions, and the code is not duplicated. (The early static prototype used seven HTML files. See chapter 9.)

**Why is the data saved to `localStorage` only at the end?**
Until the last step, the answers live in the component’s state. Saving once at the end keeps the logic simple and avoids half-finished data in storage. The downside: if the user reloads the page in the middle, the answers of the current session are lost.

---

## Try it yourself

1. Change `TOTAL_STEPS` in Z. 5 from `7` to `6`. What happens to the progress bar and to the last step? (The last question is never reached via “Continue”, because the final save happens at step 6.)
2. Add a new option to `ENJOY_OPTIONS` (e.g. `{ value: "Research", icon: "🔬" }`). Does it appear on step 3 without any other change?
3. Remove `type="button"` from one of the buttons in `renderRadioGrid`. Does anything change? (Not here, because the buttons are not inside a `<form>`. Inside a form, the default type is `submit`.)
4. Replace `alert(getValidationMessage())` in Z. 185 with an `error` state that shows the message as red text above the buttons.
5. Open the developer tools → Application → Local Storage after finishing the questionnaire. Which key do you find and what does the value look like? (`futureYouState`, a JSON string with `profile`, `snapshot`, …)
