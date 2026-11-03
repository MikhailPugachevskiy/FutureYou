# 8. CSS Architecture: Styling in the React App

The styling of FutureYou uses **two approaches side by side**:

1. **Inline styles** (the `style` attribute with a JavaScript object): used by the landing page and the questionnaire (chapters 2 and 3).
2. **One global stylesheet**, `src/styles/app.css` (559 lines): used by the result pages and components (snapshot, matches, skills and roadmap).

This chapter explains the stylesheet, the design decisions behind it (colors, layout techniques, state classes) and a few things that could be improved.

---

## 1. The structure of `app.css`

The file is imported **once**, in `main.jsx` (`import "./styles/app.css"`), and applies to the whole app. It is organized in blocks, one per feature:

| Lines | Block | Used by |
| --- | --- | --- |
| 1–16 | global rules (`body`, `.app`, `.subtitle`) | all pages |
| 18–58 | matches (`.matches-container`, `.match-card`, `.badge`, `.skills`, `.skill-pill`) | `CareerMatches.jsx` |
| 60–230 | skill analysis (`.skills-grid-react`, `.skill-row-react`, `.tag-react`, …) | `SkillAnalysis.jsx` |
| 232–365 | profile snapshot (`.snapshot-*-react`) | `ProfileSnapshot.jsx` |
| 367–559 | learning roadmap (`.roadmap-*`, `.btn-primary`, `.btn-secondary`) | `LearningRoadmap.jsx` |

Many class names end in `-react` (for example `skill-row-react`). That is a naming convention of this project. Names also start with the feature (`snapshot-`, `roadmap-`, `skill-`), which makes it easy to find where a class belongs and avoids collisions.

**Important:** CSS in React is **global**. Every rule in `app.css` applies to the entire page, no matter which component uses it. Unique, feature-based class names are what keep the pieces from overwriting each other.

---

## 2. Global rules (Z. 1–16)

```css
  1 | body {
  2 |     font-family: Arial, sans-serif;
  3 |     background: #f7f8fc;
  4 |     margin: 0;
  5 |     padding: 40px;
  6 | }
  7 |
  8 | .app {
  9 |     max-width: 900px;
 10 |     margin: auto;
 11 | }
 12 |
 13 | .subtitle {
 14 |     color: #6b7280;
 15 |     margin-bottom: 30px;
 16 | }
```

- **Z. 1–6** The base look of every page: font, a very light grey-blue background (`#f7f8fc`), no default margin and a 40 px padding around the content.
- **Z. 8–11** `.app` centers content with a maximum width (`margin: auto` centers a block that has a width limit). It is defined, but no component currently uses the class.
- **Z. 13–16** `.subtitle` is a shared class: grey text with space below. It is used in the headers of the snapshot, skill analysis and roadmap pages.

---

## 3. The design system in numbers

The colors are written directly into the rules. The same few values come back everywhere:

| Purpose | Value | Where |
| --- | --- | --- |
| Primary purple | `#6c63ff` | buttons, active border, logo, badges (inline styles and CSS) |
| Primary gradient | `#6c63ff` → `#8b84ff` | progress bar, “Continue” button, logo icon |
| Headline text | `#111827` | headings |
| Muted text | `#6b7280` | subtitles, descriptions |
| Page background | `#f7f8fc` | `body` |
| Card background | `white` | cards |
| Card border | `#e5e7eb` / `#eef0f4` | cards, option buttons |
| Success green | `#eafff2` on `#15803d` | “strong” skills |
| Warning orange | `#fff2d6` on `#b45309` | “medium” priority |
| Danger red | `#ffecec` on `#dc2626` | “high” priority |

Because these values are repeated in `app.css` and in the inline `styles` objects of the pages, changing the brand color means searching through several files (see “Try it yourself”).

---

## 4. Layout techniques

### CSS Grid for cards

```css
 18 | .matches-container {
 19 |     display: grid;
 20 |     grid-template-columns: 1fr 1fr;
 21 |     gap: 20px;
 22 | }
```

- `display: grid` turns the element into a grid.
- `grid-template-columns: 1fr 1fr` creates two columns of equal width (`1fr` = one fraction of the available space).
- `gap: 20px` is the space between the cards.

The same idea is used for the two-column skill layout (`.skills-grid-react`, Z. 78–83) and for the snapshot cards:

```css
266 | .snapshot-grid-react {
267 |     display: grid;
268 |     grid-template-columns: repeat(2, minmax(320px, 1fr));
269 |     gap: 28px;
270 |     margin-top: 10px;
271 | }
```

- `repeat(2, ...)` is a shorthand for writing the column definition twice.
- `minmax(320px, 1fr)` means each column is at least 320 px wide and grows to share the free space.

### Flexbox for rows and columns

```css
143 | .skill-row-react {
144 |     display: flex;
145 |     justify-content: space-between;
146 |     align-items: center;
147 |     gap: 14px;
148 | }
```

- `display: flex` places the children in a row.
- `justify-content: space-between` pushes the skill name to the left and the level badge to the right.
- `align-items: center` aligns both vertically.

**Grid vs. Flexbox:** Grid is two-dimensional (rows **and** columns), so it suits page areas and card collections. Flexbox is one-dimensional, so it suits a single row or column, such as a toolbar or one list item.

---

## 5. State classes: styling that follows the data

Several components attach a class that depends on the data. In JSX it looks like this (the matching CSS is below):

```jsx
<span className={`tag-react ${skill.level}`}>
```

The result is a class list such as `tag-react strong`. In `app.css`, a **compound selector** (two classes without a space) targets exactly this combination:

```css
182 | .tag-react {
183 |     display: inline-block;
184 |     padding: 6px 12px;
185 |     border-radius: 999px;
186 |     font-size: 13px;
187 |     font-weight: 700;
188 |     border: 1px solid transparent;
189 |     white-space: nowrap;
190 | }
191 |
192 | .tag-react.strong {
193 |     background: #eafff2;
194 |     color: #15803d;
195 |     border-color: #c6f3d6;
196 | }
197 |
198 | .tag-react.moderate {
199 |     background: #eef2ff;
200 |     color: #2563eb;
201 |     border-color: #dbe6ff;
202 | }
```

- **Z. 182–190** The **base** class holds everything the badges have in common (shape, size, font).
- **Z. 192–202** Each **modifier** class adds only the colors for one state. `.tag-react.strong` matches elements that have **both** classes.
- `border-radius: 999px` makes fully rounded ends (a “pill”).

The same pattern is used for:

| Component | JSX | CSS |
| --- | --- | --- |
| Skills (have) | `tag-react strong` / `moderate` | `.tag-react.strong`, `.tag-react.moderate` |
| Skills (build) | `tag-react high` / `medium` / `low` | `.tag-react.high` (Z. 204), `.medium` (Z. 210), `.low` (Z. 216) |
| Roadmap | `roadmap-priority high` / … | `.roadmap-priority.high` (Z. 446), `.medium`, `.low` |
| Matches | `match-card active` | `.match-card.active` (Z. 33–36) |

This is the CSS side of the idea “UI = function of state”: React changes the class name, and CSS takes care of the look.

---

## 6. Buttons and a small animation (Z. 503–530)

```css
503 | .btn-primary,
504 | .btn-secondary {
505 |     border: none;
506 |     border-radius: 18px;
507 |     padding: 16px 28px;
508 |     font-size: 17px;
509 |     font-weight: 700;
510 |     cursor: pointer;
511 |     transition: transform 0.2s ease, box-shadow 0.2s ease;
512 | }
513 |
514 | .btn-primary {
515 |     background: linear-gradient(135deg, #5b5ce2, #7c3aed);
516 |     color: white;
517 |     box-shadow: 0 12px 24px rgba(91, 92, 226, 0.22);
518 | }
    ...
527 | .btn-primary:hover,
528 | .btn-secondary:hover {
529 |     transform: translateY(-1px);
530 | }
```

- **Z. 503–512** A selector list (`,`) applies the shared rules to both buttons. Only what differs is written in `.btn-primary` and `.btn-secondary`.
- **Z. 511** `transition` animates the change smoothly (0.2 seconds) instead of jumping.
- **Z. 515** `linear-gradient(135deg, …)` creates a diagonal color gradient as the background.
- **Z. 527–530** On hover, the button moves up by 1 px (`translateY(-1px)`), which gives a subtle “lift” effect. The `transition` in Z. 511 is in the **base rule**, so the movement is animated both when hovering and when leaving.

---

## 7. Responsive design: media queries

The stylesheet has four media queries:

| Line | Condition | What changes |
| --- | --- | --- |
| 222 | `max-width: 900px` | skills grid becomes one column; smaller page heading |
| 342 | `max-width: 900px` | snapshot grid becomes one column; smaller headline |
| 352 | `max-width: 600px` | smaller snapshot headline, subtitle and card padding |
| 539 | `max-width: 768px` | smaller roadmap headline, text and a stacked card header |

```css
222 | @media (max-width: 900px) {
223 |     .skills-grid-react {
224 |         grid-template-columns: 1fr;
225 |     }
226 |
227 |     .section-header h1 {
228 |         font-size: 32px;
229 |     }
230 | }
```

- **Z. 222** The rules inside apply **only** when the viewport is at most 900 px wide.
- **Z. 224** `grid-template-columns: 1fr` replaces the two columns with a single one, so the two skill columns are stacked on tablets and phones.

> **Note:** `.matches-container` (Z. 18–22) has no media query, so the two match cards stay side by side on small screens. The questionnaire uses inline styles and therefore has no media queries at all. Inline styles cannot contain them.

---

## 8. Things worth improving

- **Missing viewport tag.** `index.html` has no `<meta name="viewport" ...>` tag (chapter 0), so on phones the media queries do not behave as expected until it is added.
- **Classes without styles.** The JSX uses a few class names that `app.css` does not define: `description` and `match-header` (`CareerMatches.jsx`) and `card-blue`, `card-purple`, `card-green`, `card-red` (`ProfileSnapshot.jsx`). They have no effect right now; they can be defined (for example, to give each snapshot card an accent color) or removed.
- **A class without a component.** `.app` (Z. 8–11) is defined but not used.
- **A level without a style.** The skill level `emerging` (chapter 6) has no `.tag-react.emerging` rule, so those badges would show with the neutral base style.
- **Font not loaded.** The questionnaire sets `fontFamily: "Inter, sans-serif"`, but the React `index.html` does not load the font (the static prototype does, via Google Fonts). Without it, browsers fall back to the default sans-serif font.
- **Body padding on full-page layouts.** `body` has `padding: 40px` (Z. 5), while the landing page and the questionnaire use `minHeight: "100vh"`. Together they are taller than the window, which adds a small vertical scrollbar.
- **Repeated values.** Colors and radii repeat across files. CSS custom properties (variables) would define them once:

```css
:root {
    --color-primary: #6c63ff;
    --color-text: #111827;
    --color-muted: #6b7280;
}

.subtitle {
    color: var(--color-muted);
}
```

---

## Typical questions

**Why is there a stylesheet and also inline styles?**
The landing page and questionnaire were built as self-contained pages with their styles next to the markup, which is quick for one-off layouts. The result pages share components and many repeated patterns (cards, badges, buttons), so classes in a stylesheet are the better tool there. A cleaner project would pick one approach.

**What are the downsides of inline styles?**
They cannot express `:hover`, media queries or pseudo-elements, values are repeated, and the markup becomes long. Their advantage: styles are scoped to one element and can use JavaScript values (for example, the progress bar width `${percent}%`).

**What does it mean that React CSS is global?**
A normal CSS file is not tied to a component. Every rule applies to the whole document. Two components that use the same class name share the same styles. To avoid collisions you can use unique names (as here), CSS Modules or CSS-in-JS.

**What is a compound selector like `.tag-react.strong`?**
Two classes written together without a space target elements that have **both** classes. With a space (`.a .b`), it would target a `.b` element **inside** an `.a` element.

**What is the difference between `px`, `rem` and `%`?**
`px` is a fixed size, `rem` is relative to the root font size (so it scales when users enlarge the browser font) and `%` is relative to the parent. This project mostly uses `px`; `rem` would be friendlier for accessibility.

**Why mobile-friendly rules with `max-width` and not `min-width`?**
`max-width` queries start from the desktop layout and adjust it for smaller screens (“desktop first”). The opposite, “mobile first”, writes the small layout first and extends it with `min-width`. Both work; consistency matters.

---

## Try it yourself

1. In `app.css`, change `.match-card.active` (Z. 33–36) to use a green border. Open `/matches` and click a card. What changes?
2. Define the missing style `.tag-react.emerging` (for example, a light yellow background) so skills with a low score get their own look.
3. Add `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` to `index.html` and open the app in your browser’s mobile view. What changes on the `/skills` page?
4. Search for `#6c63ff` in the whole `src/` folder. How many files contain it? Replace them with a CSS variable `--color-primary`. (Inline styles can use `"var(--color-primary)"` as a string.)
5. Give `.matches-container` a media query so that the two cards stack on screens narrower than 700 px.
