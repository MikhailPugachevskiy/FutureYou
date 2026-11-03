# 2. Landing Page: Structuring Content and Inline Styles

The landing page (`LandingPage.jsx`) is the first thing a visitor sees. It explains the product in one sentence, shows three steps (“How it works”) and has one button that starts the questionnaire.

It contains no state and no data from the backend. That makes it a good place to look at **JSX structure**, **inline styles** and the **`useNavigate` hook**.

> **Note:** The file has 217 lines because the same card is written out three times. Below, the file is shown in excerpts with the **original line numbers**. The repeated cards (Z. 147–211) are summarized.

---

## File: `src/pages/LandingPage.jsx`

### Part 1: Import, hook and outer layout (Z. 1–25)

```jsx
  1 | import { useNavigate } from "react-router-dom";
  2 |
  3 | export default function LandingPage() {
  4 |     const navigate = useNavigate();
  5 |
  6 |     return (
  7 |         <main
  8 |             style={{
  9 |                 minHeight: "100vh",
 10 |                 background: "#f5f5fb",
 11 |                 display: "flex",
 12 |                 flexDirection: "column",
 13 |                 alignItems: "center",
 14 |                 justifyContent: "center",
 15 |                 padding: "40px 20px",
 16 |                 boxSizing: "border-box"
 17 |             }}
 18 |         >
 19 |             <div
 20 |                 style={{
 21 |                     maxWidth: "760px",
 22 |                     width: "100%",
 23 |                     textAlign: "center"
 24 |                 }}
 25 |             >
```

- **Z. 1** Imports `useNavigate` from React Router.
- **Z. 3** The component. `export default function LandingPage()` declares and exports it in one step. It is imported in `App.jsx` (chapter 1).
- **Z. 4** `useNavigate()` returns a function. Calling `navigate("/questionnaire")` changes the URL and shows the matching page without a reload. Hooks must be called at the top level of a component (never inside `if` blocks or loops).
- **Z. 7** The page is wrapped in a `<main>` element, the semantic element for the main content of a page.
- **Z. 8–17** The `style` attribute. In JSX, `style` expects a **JavaScript object**, not a string. That is why there are **two** pairs of curly braces: the outer pair means “JavaScript expression”, the inner pair is the object itself. Property names are written in camelCase (`minHeight`, not `min-height`) and values are strings.
- **Z. 9** `minHeight: "100vh"` makes the page at least as tall as the browser window (`vh` = percent of the viewport height).
- **Z. 11–14** Flexbox: the content is a column (`flexDirection: "column"`) and centered horizontally (`alignItems`) and vertically (`justifyContent`).
- **Z. 16** `boxSizing: "border-box"` makes the padding count towards the width and height instead of being added on top.
- **Z. 19–25** An inner container that limits the content to 760 px and centers the text.

### Part 2: Badge, headline and intro text (Z. 26–65)

```jsx
 26 |                 <div
 27 |                     style={{
 28 |                         display: "inline-block",
 29 |                         padding: "10px 18px",
 30 |                         borderRadius: "999px",
 31 |                         background: "#ecebff",
 32 |                         color: "#6c63ff",
 33 |                         fontWeight: 600,
 34 |                         fontSize: "14px",
 35 |                         marginBottom: "24px"
 36 |                     }}
 37 |                 >
 38 |                     FutureYou
 39 |                 </div>
 40 |
 41 |                 <h1
 42 |                     style={{
 43 |                         fontSize: "56px",
 44 |                         lineHeight: 1.1,
 45 |                         margin: "0 0 20px",
 46 |                         color: "#111827"
 47 |                     }}
 48 |                 >
 49 |                     Find your next
 50 |                     <br />
 51 |                     career steps
 52 |                 </h1>
 53 |
 54 |                 <p
 55 |                     style={{
 56 |                         fontSize: "20px",
 57 |                         lineHeight: 1.6,
 58 |                         color: "#6b7280",
 59 |                         maxWidth: "680px",
 60 |                         margin: "0 auto 32px"
 61 |                     }}
 62 |                 >
 63 |                     FutureYou analyzes your skills, values, and experience to reveal
 64 |                     career paths you&apos;ll need — plus a roadmap to get there.
 65 |                 </p>
```

- **Z. 26–39** The “FutureYou” badge. `borderRadius: "999px"` creates a pill shape (fully rounded ends).
- **Z. 41–52** The `<h1>`. A page should have exactly one `<h1>`. Numbers without quotes (`lineHeight: 1.1`, `fontWeight: 600`) are valid values for unitless properties.
- **Z. 50** `<br />` forces a line break. In JSX every element must be closed, so `<br>` becomes `<br />`.
- **Z. 60** The shorthand `"0 auto 32px"` means: top 0, left/right auto (centers the block), bottom 32 px.
- **Z. 64** `&apos;` is an HTML entity for the apostrophe (`'`). In JSX text, a plain `'` would also work, but many linters require the entity (rule `react/no-unescaped-entities`).

### Part 3: The call-to-action button (Z. 67–93)

```jsx
 67 |                 <button
 68 |                     onClick={() => navigate("/questionnaire")}
 69 |                     style={{
 70 |                         padding: "16px 32px",
 71 |                         borderRadius: "14px",
 72 |                         border: "none",
 73 |                         background: "#6c63ff",
 74 |                         color: "white",
 75 |                         fontSize: "18px",
 76 |                         fontWeight: 600,
 77 |                         cursor: "pointer",
 78 |                         boxShadow: "0 10px 30px rgba(108, 99, 255, 0.25)",
 79 |                         marginBottom: "18px"
 80 |                     }}
 81 |                 >
 82 |                     Start Now
 83 |                 </button>
 84 |
 85 |                 <div
 86 |                     style={{
 87 |                         color: "#9ca3af",
 88 |                         fontSize: "14px",
 89 |                         marginBottom: "64px"
 90 |                     }}
 91 |                 >
 92 |                     Free &nbsp;|&nbsp; Takes 3 minutes &nbsp;|&nbsp; No signup required
 93 |                 </div>
```

- **Z. 68** The event handler. `onClick={() => navigate("/questionnaire")}` passes an **arrow function** to React. React calls it when the user clicks. It is important to pass a function and not to call it: `onClick={navigate("/questionnaire")}` would run `navigate` immediately while rendering.
- **Z. 78** `boxShadow` creates the soft purple glow below the button (x offset, y offset, blur, color with 25 % opacity).
- **Z. 92** `&nbsp;` is a non-breaking space. It prevents the browser from collapsing several spaces into one, so the separators `|` get some distance.

### Part 4: The “How it works” section (Z. 95–145)

```jsx
 95 |                 <section>
 96 |                     <h2
 97 |                         style={{
 98 |                             fontSize: "36px",
 99 |                             marginBottom: "32px",
100 |                             color: "#111827"
101 |                         }}
102 |                     >
103 |                         How it works
104 |                     </h2>
105 |
106 |                     <div
107 |                         style={{
108 |                             display: "grid",
109 |                             gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
110 |                             gap: "20px"
111 |                         }}
112 |                     >
113 |                         <article
114 |                             style={{
115 |                                 background: "white",
116 |                                 borderRadius: "20px",
117 |                                 padding: "24px",
118 |                                 textAlign: "left",
119 |                                 boxShadow: "0 6px 20px rgba(15, 23, 42, 0.06)"
120 |                             }}
121 |                         >
122 |                             <div
123 |                                 style={{
124 |                                     width: "36px",
125 |                                     height: "36px",
126 |                                     borderRadius: "12px",
127 |                                     background: "#ecebff",
128 |                                     color: "#6c63ff",
129 |                                     display: "flex",
130 |                                     alignItems: "center",
131 |                                     justifyContent: "center",
132 |                                     fontWeight: 700,
133 |                                     marginBottom: "16px"
134 |                                 }}
135 |                             >
136 |                                 1
137 |                             </div>
138 |                             <h3 style={{ margin: "0 0 12px", fontSize: "20px" }}>
139 |                                 Get Started
140 |                             </h3>
141 |                             <p style={{ margin: 0, color: "#6b7280", lineHeight: 1.6 }}>
142 |                                 Answer a few questions about your experience, skills,
143 |                                 and goals.
144 |                             </p>
145 |                         </article>
```

- **Z. 95** A `<section>` groups the steps and gives the content a meaning for assistive technology.
- **Z. 106–112** A CSS Grid container. `repeat(auto-fit, minmax(220px, 1fr))` means: “create as many columns as fit, each at least 220 px wide, and share the remaining space equally”. On a narrow screen the cards wrap into one column automatically, **without a media query**.
- **Z. 113–145** The first card (step 1) as an `<article>`. It has a numbered circle (Z. 122–137), a heading (Z. 138) and a description (Z. 141).
- **Z. 147–211** The cards for “2 Career Match” and “3 Next Steps” follow **exactly the same pattern**. Only the number, the heading and the text differ (Z. 170, 173, 176 and Z. 203, 206, 209).
- **Z. 212–217** Close the grid, the section, the containers, `<main>` and the function.

---

## Typical questions

**Why are inline styles used here and not a CSS file?**
The landing page was built as a self-contained page, and inline styles keep everything in one file. The result and snapshot pages use `app.css` instead (chapter 8). Both approaches coexist in the project. Inline styles are quick, but they cannot express hover effects, media queries or pseudo-classes, and the same values get repeated.

**The three cards are almost identical. How would you refactor them?**
Put the data in an array and render it with `.map()`:

```jsx
const steps = [
    { number: 1, title: "Get Started", text: "Answer a few questions about your experience, skills, and goals." },
    { number: 2, title: "Career Match", text: "We analyze your input to identify suitable career paths." },
    { number: 3, title: "Next Steps", text: "Get clear guidance on skills to build and actions to take." }
];

{steps.map((step) => (
    <article key={step.number} style={cardStyle}>
        ...
    </article>
))}
```

This removes about 60 lines, and a fourth step only needs one new array entry. Do not forget the `key` attribute on the element returned by `.map()`.

**What is the difference between `onClick={navigate("/x")}` and `onClick={() => navigate("/x")}`?**
The first calls `navigate` while the component renders, which navigates immediately. The second passes a function that React calls later, on click.

**Why `&apos;` and `&nbsp;`?**
They are HTML entities. `&apos;` is an apostrophe, `&nbsp;` a non-breaking space that is not collapsed with neighboring spaces.

---

## Try it yourself

1. Change the headline in Z. 49–51 to “Discover your career path”. What do you see?
2. Change the `onClick` target in Z. 68 from `"/questionnaire"` to `"/matches"`. Where does the button lead now?
3. Replace `minmax(220px, 1fr)` in Z. 109 with `minmax(300px, 1fr)` and resize the browser window. When do the cards wrap?
4. Move the three cards into an array and render them with `.map()` as shown above. Does the page look the same?
