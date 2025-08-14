# a11yLint

## ♿ a11yLint — Accessibility Checklist

This checklist is the comprehensive accessibility coverage for your extension. (Blind & low vision users, Color-blind users,Deaf & hard-of-hearing users)

---

### 1. 📷 Images & Media
- [X] **Alt Text**
  - [X] `<img>` missing `alt`.
- [X] **Complex Images**
  - [X] Long description provided for charts/infographics (`aria-describedby`, `<figcaption>`).
- [X] **Video/Audio**
  - [X] Captions/subtitles available.
  - [X] Transcript available for audio-only.
- [X] **Autoplay**
  - [X] Autoplaying media starts muted or paused.

---

### 2. 📝 Text & Content
- [X] **Language**
  - [X] `<html lang="...">` present and correct.
- [X] **Contrast**
  - [X] Text meets WCAG AA contrast ratio.
- [X] **Font Size**
  - [X] Text is not too small (< 12px).

---

### 3. 📋 Forms
- [X] **Labels**
  - [X] Every `<input>` has a `<label>` or `aria-label`.
  - [X] `for` attribute matches `id`.
- [X] **Required Fields**
  - [X] Marked with `required` or `aria-required`.
- [X] **Placeholder Misuse**
  - [X] Placeholder not used as label.
- [X] **Buttons**
  - [X] Buttons have an accessible name.

---



