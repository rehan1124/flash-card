### Implementation TODOs — ordered easy → hard, grouped in phases

> **Project:** Marathi Flashcards — single‑user, local web app for learning Marathi (Devanagari).  
> **MVP priority:** Flip → Right/Wrong → Redo Unknown → Basic Stats → MCQ & Fill‑in.

Below is a prioritized checklist you can follow to implement one feature at a time. Each checkbox item includes **acceptance criteria** so you know when it’s done. Work left to right; complete all items in a phase before moving to the next.

---

## ✅ Phase 0 — Project scaffold (very easy, prerequisite)
- [x] **Create project scaffold (Vite + React + TypeScript)**  
  **Acceptance criteria**
  - `npm create vite@latest` (or equivalent) project created with React + TS template.  
  - `npm install` succeeds and `npm run dev` starts a dev server.  
  - Project contains `README.md` with run/build instructions.

- [x] **Add Tailwind CSS and basic theme tokens (light/dark)**  
  **Acceptance criteria**
  - Tailwind configured and working; sample component uses Tailwind classes.  
  - Theme toggle state exists (persisted to `localStorage`) and toggles CSS variables or Tailwind dark mode.

- [x] **Add Zustand (or chosen state lib) and project linting/test tooling**  
  **Acceptance criteria**
  - Zustand installed and a minimal store file exists.  
  - ESLint + Prettier configured; `npm run lint` runs without fatal errors.  
  - Jest + React Testing Library installed (basic smoke test passes).

---

## Phase 1 — Core data model & persistence (easy → medium)
- [x] **Implement TypeScript data models and storage wrapper**  
  - Files: `types.ts`, `storage.ts`  
  **Acceptance criteria**
  - `Card`, `Deck`, `SessionStats` interfaces implemented as specified.  
  - `storage.ts` exposes `loadDecks(): Deck[]`, `saveDecks(decks: Deck[])`, and handles schema versioning.  
  - Unit tests for `storage` read/write roundtrip pass.

- [x] **Seed starter deck loader (import starter JSON)**  
  **Acceptance criteria**
  - Starter deck JSON (100 items) can be loaded into `localStorage` via a dev-only import route or button.  
  - After import, `DeckList` shows the seeded deck and card count.

- [x] **DeckList screen and DeckEditor (minimal)**  
  **Acceptance criteria**
  - `/decks` route lists decks with title and card count.  
  - User can create a new deck and add a card (marathi + english).  
  - Changes persist to `localStorage` and survive page reload.

---

## Phase 2 — Study session core (medium)
- [x] **CardView component with flip animation**  
  **Acceptance criteria**
  - Card front shows **Marathi (Devanagari)** text; tapping/clicking flips to back.  
  - Flip animation uses CSS 3D transform; duration ~300ms; works on mobile and desktop.  
  - Back shows English translation and a **Transliteration reveal** button (transliteration hidden by default).

- [x] **Right / Wrong controls and per-card counters**  
  **Acceptance criteria**
  - After flip, **Right** and **Wrong** buttons appear.  
  - Clicking **Right** increments `seenCount` and session `correct`.  
  - Clicking **Wrong** increments `seenCount`, increments `wrongCount`, adds card to `redoQueue`, and increments session `incorrect`.  
  - Deck persisted `seenCount` and `wrongCount` update in `localStorage`.

- [x] **StudySession orchestration (queue + navigation)**  
  **Acceptance criteria**
  - Study session builds a queue (shuffled by default).  
  - User can navigate to next/previous card in the session.  
  - SessionStats (`studied`, `correct`, `incorrect`) update in `sessionStorage` or in-memory and are visible in a small status bar.

- [x] **Session stats panel (ephemeral)**  
  **Acceptance criteria**
  - Stats panel shows `studied`, `correct`, `incorrect`, and accuracy percentage.  
  - Stats are stored in `sessionStorage` and are cleared when the tab/browser is closed (verify by closing and reopening tab).

---

## Phase 3 — Redo unknown + UX polish (medium)
- [ ] **Redo Unknown flow**  
  **Acceptance criteria**
  - After a session, a **Redo Unknown** button appears when `redoQueue` is non-empty.  
  - Clicking it starts a new session containing only cards marked wrong in the previous session.  
  - Redo session updates `seenCount` and `wrongCount` appropriately and clears `redoQueue` when finished.

- [ ] **Transliteration reveal on demand**  
  **Acceptance criteria**
  - Each card back has a small “Show transliteration” control.  
  - Clicking reveals transliteration text (IAST/approx) without revealing other metadata.  
  - Toggle state does not persist across sessions unless user sets a default in Settings.

- [ ] **Dark / Light mode toggle and accessibility basics**  
  **Acceptance criteria**
  - Theme toggle persists to `localStorage`.  
  - All interactive elements are keyboard focusable and have ARIA labels (flip, reveal, right, wrong).  
  - Color contrast meets WCAG AA for normal text.

- [ ] **Responsive layout (mobile-first)**  
  **Acceptance criteria**
  - Study screen and card view render correctly on narrow screens (≤ 420px) and on desktop.  
  - Buttons are large enough for touch (min 44px target).

---

## Phase 4 — Quiz modes: MCQ & Fill‑in (medium → hard)
- [ ] **MCQ generator (automatic distractors)**  
  **Acceptance criteria**
  - For a given card, generator produces 3 distractors from the deck (excluding correct).  
  - Distractors are chosen using similarity scoring and tag overlap when available; fallback to random sampling.  
  - MCQ UI shows 4 shuffled options; selecting an option gives immediate feedback (correct/incorrect) and updates session stats.

- [ ] **MCQ acceptance tests**  
  **Acceptance criteria**
  - Unit tests verify distractor selection excludes the correct answer and returns 3 items when deck size ≥ 4.  
  - E2E test covers MCQ flow: present question → select wrong → show correct answer → mark stats.

- [ ] **Fill‑in UI with fuzzy matching**  
  **Acceptance criteria**
  - Fill‑in input accepts typed answers; on submit, the fuzzy matcher normalizes input and compares to expected answer.  
  - Accept if Levenshtein distance ≤ `max(2, floor(0.2 * length))` after normalization.  
  - On incorrect, show the correct answer and highlight differences.  
  - Tests cover normalization and threshold behavior.

- [ ] **Fill‑in acceptance tests**  
  **Acceptance criteria**
  - Unit tests for normalization (Unicode NFC, lowercase, strip punctuation, strip diacritics for Latin).  
  - Unit tests for Levenshtein threshold logic with edge cases (short words, long words).

---

## Phase 5 — Robustness, testing, and accessibility (hard)
- [ ] **Comprehensive unit tests and CI**  
  **Acceptance criteria**
  - Coverage for core modules: storage, fuzzy matcher, MCQ generator, card counters.  
  - CI pipeline runs tests on push and fails on regressions.

- [ ] **E2E tests (Playwright or Cypress)**  
  **Acceptance criteria**
  - E2E tests cover: create deck → study flow → flip → mark wrong → redo unknown → MCQ → fill‑in.  
  - E2E verifies session stats cleared on tab close (simulate `beforeunload`).

- [ ] **Accessibility audit & fixes**  
  **Acceptance criteria**
  - Run `axe` or similar; fix all critical and serious issues.  
  - Screen reader walkthrough: flip, reveal transliteration, and right/wrong controls are announced correctly.

---

## Phase 6 — Polish, deploy, and extras (hardest)
- [ ] **Starter deck import UI & JSON export**  
  **Acceptance criteria**
  - User can import a JSON file to create a deck (validate schema).  
  - User can export a deck to JSON for backup.  
  - Import/export unit tests validate schema and roundtrip.

- [ ] **Performance & storage improvements (IndexedDB fallback)**  
  **Acceptance criteria**
  - For decks > 500 cards, app uses IndexedDB (via `idb` or similar) instead of `localStorage`.  
  - Migration path from `localStorage` to IndexedDB implemented and tested.

- [ ] **Deploy to Vercel/Netlify and smoke test**  
  **Acceptance criteria**
  - Production build (`npm run build`) deploys to Vercel or Netlify.  
  - Live site loads, study flow works, and seeded deck is importable.  
  - Basic analytics (optional) and error monitoring configured.

---

## Cross‑cutting tasks (do alongside phases)
- [ ] **Implement small utilities**
  - UUID generator, debounce for storage writes, shuffle function.  
  **Acceptance criteria**
  - Utilities are unit tested and used by components.

- [ ] **Documentation & README**  
  **Acceptance criteria**
  - README includes setup, run, build, deploy, and how to import starter deck.  
  - Developer notes include where to change fuzzy thresholds and MCQ scoring.

- [ ] **User settings screen**  
  **Acceptance criteria**
  - Settings allow toggling default transliteration visibility, theme default, and resetting all local data.  
  - Reset action prompts confirmation and clears `localStorage`.

---

## Acceptance checklist for a release candidate (final QA)
- [ ] Core study flow: flip → reveal → right/wrong works and persists counters.  
- [ ] Redo Unknown flow functions and re‑studies only wrong cards.  
- [ ] MCQ and Fill‑in modes operate with correct scoring and tolerant matching.  
- [ ] Session stats are visible during session and cleared on tab close.  
- [ ] Accessibility: keyboard navigation, ARIA labels, and color contrast pass checks.  
- [ ] App builds and deploys; seeded deck import works.

---

### Notes and small decisions to keep handy
- Use `sessionStorage` for ephemeral stats to meet the requirement that stats are deleted when the web app is closed.  
- Use a small Levenshtein library (or a compact DP implementation) and normalize strings before comparison.  
- Prefer **Zustand + Tailwind** for fast development and small bundle size.