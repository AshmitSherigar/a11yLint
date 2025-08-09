# a11yLint

## ♿ a11yLint — Accessibility Checklist

This checklist ensures comprehensive accessibility coverage for your extension.

---

### 1. 📷 Images & Media
- [ ] **Alt Text**
  - [ ] `<img>` missing `alt`.
  - [ ] Informative images have meaningful `alt`.
  - [ ] Decorative images have empty `alt`.
- [ ] **Complex Images**
  - [ ] Long description provided for charts/infographics (`aria-describedby`, `<figcaption>`).
- [ ] **Video/Audio**
  - [ ] Captions/subtitles available.
  - [ ] Transcript available for audio-only.
- [ ] **Autoplay**
  - [ ] Autoplaying media starts muted or paused.

---

### 2. 📝 Text & Content
- [ ] **Headings**
  - [ ] Levels follow hierarchy (no skips like `<h1>` → `<h4>`).
  - [ ] Only one `<h1>` per page.
- [ ] **Links**
  - [ ] Avoid “click here” / “read more” without context.
  - [ ] Icon-only links have `aria-label` or `title`.
- [ ] **Language**
  - [ ] `<html lang="...">` present and correct.
- [ ] **Contrast**
  - [ ] Text meets WCAG AA contrast ratio.
- [ ] **Font Size**
  - [ ] Text is not too small (< 12px).

---

### 3. 📋 Forms
- [ ] **Labels**
  - [ ] Every `<input>` has a `<label>` or `aria-label`.
  - [ ] `for` attribute matches `id`.
- [ ] **Required Fields**
  - [ ] Marked with `required` or `aria-required`.
- [ ] **Placeholder Misuse**
  - [ ] Placeholder not used as label.
- [ ] **Buttons**
  - [ ] Buttons have an accessible name.

---

### 4. 🎯 ARIA & Roles
- [ ] **Landmarks**
  - [ ] `<main>`, `<nav>`, `<header>`, `<footer>` present where applicable.
- [ ] **ARIA Misuse**
  - [ ] No invalid ARIA attributes.
  - [ ] No redundant roles (e.g., `role="button"` on `<button>`).
- [ ] **Focusable Elements**
  - [ ] `tabindex` doesn’t break natural tab order.
- [ ] **Interactive Roles**
  - [ ] Keyboard support for elements with interactive roles.

---

### 5. ⌨ Keyboard & Interaction
- [ ] **Navigability**
  - [ ] All interactive elements focusable via keyboard.
- [ ] **Focus Visible**
  - [ ] Focus styles are visible (no `outline: none` without replacement).
- [ ] **Focus Traps**
  - [ ] Modals/menus trap focus but allow escape.
- [ ] **Hover-only**
  - [ ] Actions available without hover.

---

### 6. 🔄 Dynamic Content
- [ ] **Live Regions**
  - [ ] Changing content uses ARIA live regions if needed.
- [ ] **Announcements**
  - [ ] Important changes announced to screen readers.
- [ ] **Animations**
  - [ ] No flashing > 3 times/second without warning.

---

### 7. 🏗 Structure & Semantics
- [ ] **Semantic HTML**
  - [ ] Proper elements used for structure (no `<div>` as button).
- [ ] **Lists**
  - [ ] `<ul>`/`<ol>` contain only `<li>`.
- [ ] **Tables**
  - [ ] Headers use `<th>` with `scope`.
  - [ ] Table has `<caption>`.

---

### 8. 🚀 Performance & Accessibility
- [ ] **Page Title**
  - [ ] `<title>` is meaningful and present.
- [ ] **Meta Viewport**
  - [ ] `meta name="viewport"` set for mobile.
- [ ] **Skip Link**
  - [ ] “Skip to main content” link available.
- [ ] **Reading Order**
  - [ ] DOM order matches visual order.

---

### 9. ⚡ Extra Checks
- [ ] Color is not the only indicator of meaning.
- [ ] Hidden elements are marked `aria-hidden="true"`.
- [ ] `<iframe>` has descriptive `title`.
- [ ] SVG icons have accessible name/description.

