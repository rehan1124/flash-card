### Overview

**Project:** Marathi Flashcards — single‑user, local web app for learning Marathi (Devanagari)  
**Tech stack:** **TypeScript**, **Vite**, **React**; recommended: **Zustand** for state, **Tailwind CSS** for styling.  
**Persistence:** decks and card metadata in **localStorage**; **session statistics ephemeral** (cleared on tab/browser close).  
**MVP priority:** **Flip → Right/Wrong → Redo Unknown → Basic Stats → MCQ & Fill‑in**.

---

### 1. MVP Scope and Feature List

**Core (MVP)**  
- Create / view a deck of Marathi flashcards (Devanagari).  
- Card flip animation: front = Marathi (Devanagari), back = English.  
- **Transliteration** (IAST style) **revealed on demand** per card.  
- After flip: **Right** and **Wrong** buttons. Tapping **Wrong** marks card as unknown.  
- **Redo Unknown** flow: study only cards marked wrong in the current session.  
- **Session statistics**: studied count, correct vs incorrect, accuracy percentage — **ephemeral** (cleared on close).  
- Local persistence for decks and per‑card counters (`seenCount`, `wrongCount`) in `localStorage`.

**Secondary (MVP+ / short term)**  
- **Quiz/Test Mode**: Multiple choice (MCQ) and Fill‑in‑the‑blank.  
  - MCQ distractors **automatically generated** from other deck entries.  
  - Fill‑in uses **fuzzy matching** (diacritic tolerant + Levenshtein threshold).  
- Dark / Light mode; mobile‑first responsive UI; basic accessibility (ARIA, keyboard navigation).

**Longer term (future)**  
- IndexedDB for large decks; import/export CSV/JSON; spaced repetition algorithm; sync backend; user profiles.

---

### 2. Data Model & TypeScript Interfaces

**Storage strategy**  
- **Decks** and **cards** stored in `localStorage` under a single key (e.g., `marathi_flash_decks`).  
- **SessionStats** stored in `sessionStorage` or in-memory and cleared on `beforeunload`.

**Interfaces**
```ts
// core types
export type UUID = string;

export interface Card {
  id: UUID;
  marathi: string;            // Devanagari text
  english: string;            // English translation
  transliteration?: string;   // IAST/ITRANS optional
  examples?: string[];        // optional example sentences
  tags?: string[];            // e.g., "greetings", "food"
  wrongCount: number;         // cumulative (persisted)
  seenCount: number;          // cumulative (persisted)
  createdAt: string;          // ISO date
}

export interface Deck {
  id: UUID;
  title: string;
  description?: string;
  cards: Card[];
  createdAt: string;
  updatedAt?: string;
}

export interface SessionStats {
  sessionId: UUID;
  startedAt: string;
  studied: number;
  correct: number;
  incorrect: number;
}
```

**localStorage shape**
```json
{
  "decks": Deck[],
  "meta": { "version": 1 }
}
```

---

### 3. UI / UX Flows and Component Breakdown

**Top-level routes / screens**
- **/decks** — Deck list (create, open, delete).  
- **/deck/:deckId/study** — Study session (card view).  
- **/deck/:deckId/quiz** — Quiz/Test mode (MCQ / Fill‑in).  
- **/stats** — Session statistics (ephemeral).  
- **/settings** — Theme, transliteration toggle defaults, accessibility options.

**Primary components**
- **DeckList** — shows decks, counts, create button.  
- **DeckEditor** — add/edit cards (MVP: simple inline editor).  
- **StudySession** — orchestrates queue, redo queue, session stats.  
- **CardView** — single card UI with flip animation and reveal controls.  
- **RightWrongControls** — two buttons shown after flip.  
- **RedoUnknownButton** — start a session with only unknown cards.  
- **QuizMCQ** — MCQ UI with 4 options, feedback.  
- **QuizFillIn** — input field, submit, fuzzy match feedback.  
- **StatsPanel** — shows session metrics and per‑card summary.

**CardView props (example)**
```ts
type CardViewProps = {
  card: Card;
  onFlip: () => void;
  onRevealTransliteration: () => void;
  onMarkRight: (cardId: UUID) => void;
  onMarkWrong: (cardId: UUID) => void;
  showBack?: boolean;
}
```

**Study session flow (simplified)**  
1. Load deck → build `queue` (shuffled or ordered).  
2. Show first card front (Marathi).  
3. User taps card → flip → show English + transliteration reveal button.  
4. User taps **Right** or **Wrong**.  
   - **Right**: increment `seenCount`, `sessionStats.correct++`.  
   - **Wrong**: increment `seenCount`, `wrongCount`, `sessionStats.incorrect++`, add to `redoQueue`.  
5. Continue until queue exhausted. Offer **Redo Unknown** (study `redoQueue`).  
6. On session end, show **StatsPanel**. Session stats cleared on close.

**Accessibility & UX**
- All interactive elements keyboard focusable.  
- ARIA labels for flip, reveal, right/wrong.  
- High contrast color tokens; font fallback for Devanagari (e.g., Noto Sans Devanagari).  
- Dark/light toggle persisted in `localStorage`.

---

### 4. Algorithms & Rules

**MCQ distractor generation (automatic)**  
- **Goal:** 4 options total (1 correct + 3 distractors).  
- **Algorithm:**  
  1. Collect candidate English translations from deck excluding correct answer.  
  2. Score candidates by similarity to correct answer (string similarity on English) and by tag overlap (if tags exist). Higher similarity preferred to make plausible distractors.  
  3. Randomly sample top‑N candidates; if insufficient, fill with random entries.  
  4. Shuffle options before display.

**Fill‑in matching (fuzzy tolerant)**  
- **Normalization:** Unicode normalize (NFC), lowercase, remove punctuation, strip diacritics for Latin transliteration comparisons.  
- **Matching rules:**  
  - If exact normalized match → correct.  
  - Else compute **Levenshtein distance**; accept if `distance ≤ max(2, floor(0.2 * length))`.  
  - For Marathi Devanagari typed answers, also allow common alternate spellings (basic mapping) and ignore trailing vowel diacritics where appropriate.  
- **Feedback:** show correct answer and highlight differences when incorrect.

**Marking unknown**  
- A card is considered **unknown** for redo if the user taps **Wrong** during the session. `wrongCount` increments and card is added to `redoQueue`.

---

### 5. Persistence, Session Handling, and Security

**Persistence**
- **Decks & card metadata:** `localStorage.setItem('marathi_flash_decks', JSON.stringify(...))`. Use a small wrapper to read/write and handle schema migrations.  
- **Session stats:** store in `sessionStorage` or in-memory; register `window.addEventListener('beforeunload', ...)` to clear ephemeral stats (or rely on `sessionStorage` which clears on tab close). **Requirement:** stats must be deleted when web app is closed — use `sessionStorage` for session stats.

**Data integrity**
- Use optimistic writes with small debounce (e.g., 300ms) to avoid excessive writes.  
- Provide manual export/import (future) to allow backups.

**Privacy & security**
- No authentication; all data stays local. Warn users that clearing browser storage will delete decks.

---

### 6. State Management & Tooling Recommendations

**Recommendation:** **Zustand** + React Query not required (no backend). Zustand keeps global state minimal and easy to test. Use **Tailwind CSS** for rapid responsive UI and dark mode.

**Why**
- **Zustand:** tiny API, easy to persist slices to `localStorage`.  
- **Tailwind:** quick theming, dark mode, consistent spacing.  
- **Testing:** Jest + React Testing Library for unit and component tests; Playwright or Cypress for E2E.

**Example store shape (Zustand)**
```ts
type AppState = {
  decks: Deck[];
  currentDeckId?: UUID;
  sessionStats?: SessionStats;
  theme: 'light' | 'dark';
  loadFromStorage: () => void;
  saveToStorage: () => void;
  markCardRight: (deckId: UUID, cardId: UUID) => void;
  markCardWrong: (deckId: UUID, cardId: UUID) => void;
}
```

---

### 7. Testing & QA Plan

**Unit tests**
- Fuzzy matcher: normalization + Levenshtein thresholds.  
- MCQ generator: distractor selection logic.  
- Card counters: `seenCount`, `wrongCount` updates.

**Integration / E2E**
- Study flow: flip → mark right/wrong → redo unknown.  
- Quiz flows: MCQ correctness and fill‑in tolerance.  
- Persistence: deck saved and reloaded.  
- Session stats cleared on tab close (simulate `beforeunload`).

**Accessibility**
- Run `axe` checks; ensure keyboard navigation and screen reader labels for flip/reveal/right/wrong.

---

### 8. Implementation Roadmap (4 sprints, suggested)

| Sprint | Focus | Deliverables |
|---:|---|---|
| **Sprint 1 (1–2 weeks)** | Scaffold + core study flow | Vite + React + TS; Tailwind; Zustand; DeckList; CardView with flip; Right/Wrong; localStorage persistence |
| **Sprint 2 (1 week)** | Redo unknown + stats | Redo queue; SessionStats (sessionStorage); transliteration reveal; dark mode |
| **Sprint 3 (1 week)** | Quiz modes | MCQ generator; Fill‑in with fuzzy matching; UI polish; keyboard shortcuts |
| **Sprint 4 (1 week)** | QA & deploy | Accessibility fixes; unit & E2E tests; deploy to Vercel/Netlify; starter deck import |

**Deployment**: static site to **Vercel** or **Netlify** (simple `npm run build` output).

---

### 9. Starter Deck — 100 common Marathi words & phrases

**Format:** `Devanagari — transliteration — English` (transliteration optional reveal).  
Below is a curated starter set covering greetings, pronouns, numbers, common nouns, verbs, and useful phrases.

1. नमस्कार — **namaskār** — Hello  
2. हॅलो — **hello** — Hi  
3. धन्यवाद — **dhanyavād** — Thank you  
4. कृपया — **kr̥payā** — Please  
5. हो — **ho** — Yes  
6. नाही — **nāhī** — No  
7. कसे आहात? — **kase āhāt?** — How are you?  
8. मी ठीक आहे — **mī ṭhīk āhe** — I am fine  
9. तुमचे नाव काय? — **tumce nāv kāy?** — What is your name?  
10. माझे नाव ... आहे — **mājhe nāv ... āhe** — My name is ...  
11. मला माफ करा — **malā māpha karā** — Sorry / Excuse me  
12. शुभ प्रभात — **śubh prabhāt** — Good morning  
13. शुभ संध्या — **śubh sandhyā** — Good evening  
14. शुभ रात्री — **śubh rātrī** — Good night  
15. भेटूया — **bheṭūyā** — See you  
16. घर — **ghar** — House / Home  
17. पाणी — **pāṇī** — Water  
18. अन्न — **anna** — Food  
19. रस्ता — **rastā** — Road  
20. बाजार — **bājār** — Market  
21. शाळा — **śāḷā** — School  
22. काम — **kām** — Work / Job  
23. मित्र — **mitra** — Friend (male)  
24. मैत्रीण — **maitrīṇ** — Friend (female)  
25. आई — **āī** — Mother  
26. वडील — **vaḍīl** — Father  
27. भाऊ — **bhāū** — Brother  
28. बहीण — **bahīṇ** — Sister  
29. मुलगा — **mulagā** — Boy / Son  
30. मुलगी — **mulagī** — Girl / Daughter  
31. वेळ — **vēḷ** — Time  
32. आज — **āj** — Today  
33. उद्या — **udyā** — Tomorrow  
34. काल — **kāl** — Yesterday  
35. एक — **ek** — One  
36. दोन — **don** — Two  
37. तीन — **tīn** — Three  
38. चार — **chār** — Four  
39. पाच — **pāc** — Five  
40. मोठा — **moṭhā** — Big  
41. लहान — **lahān** — Small  
42. चांगले — **cāṅgle** — Good  
43. वाईट — **vāīṭ** — Bad  
44. गरम — **garam** — Hot  
45. थंड — **thaṇḍ** — Cold  
46. सुंदर — **sundar** — Beautiful  
47. जुना — **junā** — Old  
48. नवीन — **navīn** — New  
49. खिडकी — **khiḍakī** — Window  
50. दरवाजा — **daravājā** — Door  
51. खुर्ची — **khurcī** — Chair  
52. टेबल — **ṭēbal** — Table  
53. पुस्तक — **pustak** — Book  
54. पेन्सिल — **pensil** — Pencil  
55. शाळेत — **śāḷēt** — At school  
56. चालणे — **cālaṇē** — To walk  
57. बसणे — **basaṇē** — To sit  
58. उभे राहणे — **ubhe rāhaṇē** — To stand  
59. खाणे — **khāṇē** — To eat  
60. पिणे — **piṇē** — To drink  
61. पाहणे — **pāhaṇē** — To see / look  
62. ऐकणे — **aikaṇē** — To listen  
63. बोलणे — **bōlaṇē** — To speak  
64. समजणे — **samajaṇē** — To understand  
65. आवडणे — **āvaḍaṇē** — To like  
66. नको — **nakō** — Don't want  
67. मदत — **madat** — Help  
68. डॉक्टर — **ḍŏkṭar** — Doctor  
69. रुग्णालय — **rugnālay** — Hospital  
70. दुकान — **dukān** — Shop  
71. पैसे — **paisē** — Money  
72. महाग — **mahāg** — Expensive  
73. स्वस्त — **svasta** — Cheap  
74. बाजारात — **bājārāt** — In the market  
75. उजवा — **ujavā** — Right (direction)  
76. डावा — **ḍāvā** — Left (direction)  
77. सरळ — **saraḷ** — Straight  
78. थांबा — **thāmbā** — Stop / Wait  
79. मदत करा — **madat karā** — Please help  
80. मला समजले नाही — **malā samajlē nāhī** — I don't understand  
81. मला माहित नाही — **malā māhit nāhī** — I don't know  
82. मी शिकत आहे — **mī śikat āhe** — I am learning  
83. मला आवडते — **malā āvaḍtē** — I like it  
84. मला नको आहे — **malā nakō āhe** — I don't want it  
85. थोडे — **thōḍē** — A little  
86. खूप — **khūp** — Very / a lot  
87. शांत — **śānta** — Quiet / calm  
88. आनंद — **ānanda** — Happy  
89. दुःख — **duḥkha** — Sad  
90. प्रश्न — **praśna** — Question  
91. उत्तर — **uttar** — Answer  
92. शंका — **śaṅkā** — Doubt  
93. कामावर — **kāmāvar** — At work  
94. सुट्टी — **suṭṭī** — Holiday / leave  
95. प्रवास — **pravās** — Travel / trip  
96. बस — **bas** — Bus  
97. ट्रेन — **ṭrēn** — Train  
98. विमान — **vimān** — Airplane  
99. रस्ता किती दूर आहे? — **rastā kitī dūr āhe?** — How far is the road?  
100. मला मदत हवी आहे — **malā madat havī āhe** — I need help

*(These entries are curated for beginners; transliterations are approximate and intended for learner convenience.)*

---

### 10. Appendix — Implementation Details & Examples

**Flip animation**  
- Use CSS 3D transform with `preserve-3d` and `backface-visibility`. Keep animation duration ~300ms.

**Levenshtein implementation**  
- Use a small, well‑tested library (e.g., `fast-levenshtein`) or implement a compact DP function. Normalize strings before comparison.

**MCQ sampling pseudocode**
```ts
function generateMCQ(deck: Deck, correctCard: Card): string[] {
  const candidates = deck.cards.filter(c => c.id !== correctCard.id).map(c => c.english);
  // score by similarity (e.g., Jaro-Winkler or simple substring) and tag overlap
  const scored = candidates.map(text => ({ text, score: scoreCandidate(text, correctCard) }));
  scored.sort((a,b) => b.score - a.score);
  const distractors = sampleTop(scored, 3);
  return shuffle([correctCard.english, ...distractors.map(d => d.text)]);
}
```

**Session stats clearing**
- Use `sessionStorage` for `sessionStats`. On `beforeunload`, explicitly remove `sessionStats` if you used `localStorage` for any reason. Prefer `sessionStorage` to meet the requirement.