# 📘 Playwright E2E Testing Instructions

## ✅ General Guidelines
- Write **happy path tests** for features that are already implemented.  
- After each new phase of development:
  1. Run all existing tests.  
  2. Fix broken tests or app functionality if regressions occur.  
  3. Add new tests for the newly developed features.  

- Follow [Playwright best practices](https://playwright.dev/docs/best-practices).  
- Keep tests **small, focused, and well‑commented**.  
- Follow the **test pyramid** principle (unit > integration > e2e).
- Add @step decorator to hide low level playwright actions and instead show POM method names.
- Add documentation to files, methods, classes, whatever comes under industry practices.
- Use fixtures from https://playwright.dev/docs/test-fixtures#creating-a-fixture to create class objects and then pass them to tests.

---

## 🖼️ Artifacts & Debugging
- Enable **screenshot, trace, and video capture** during test runs.

---

## 🎯 Selectors & Attributes
- Add `data-testid` to all important web elements that tests interact with.  
- `data-testid` must always be the **first attribute** in the tag.  
- Prefix all values with `af-` (e.g., `data-testid="af-card-flip"`).  

---

## 🏗️ Framework & Structure
- Follow **industry-standard design patterns** for automated E2E tests (e.g., Page Object Model).  
- Use **TypeScript path mappings** in `tsconfig.json` instead of absolute or relative paths.  
- Keep tests modular and organized by feature area.  

---

## 📖 Documentation
- Update **README file** with below if does not exist already:
  - Overview of the test automation framework structure.  
  - Guidelines for writing new tests.  
  - Instructions for running tests and viewing reports.  
  - Notes on artifact locations (screenshots, traces, videos).  
  - Explanation of `data-testid` usage and naming conventions.  

---

## 📝 Best Practices Recap
- Keep tests **small and descriptive**.  
- Add **comments** where necessary for clarity.  
- Ensure **selectors are stable** by relying on `data-testid`.  
- Maintain **consistency** in naming and structure.  
- Always validate **existing tests after new development** before adding new ones.
- Use soft assertions wherever possible.
- Add @step decorators to POM methods to hide low level actions in report.
- Use fixtures to create class objects for calling POM methods.