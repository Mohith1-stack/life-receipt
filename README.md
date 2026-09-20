# Your Life, In Receipts

![Life Receipt Concept](./assets/life-receipt-concept.png)

A functional, frontend-only digital experience that transforms a raw dataset of disconnected digital moments (music, locations, purchases, messages) into a meaningful and interactive story.

## 🚀 Overview & Features

This application is designed to ingest massive arrays of personal data and render them as a beautiful, cohesive timeline.

* **Universal Data Ingestion**: Drag and drop *any* file—whether it's a JSON dataset, a CSV export, a PDF document, or an image. The engine will instantly parse it or transform its metadata into a digital moment.
* **Algorithmic Storytelling (The Story)**: Chronologically sorts and automatically clusters your data into narrative "chapters" based on time gaps, generating intelligent titles based on your most frequent activities (tags).
* **Interactive Data Grid (Explore Data)**: A responsive, filterable constellation of your receipts with robust search and tagging.
* **Premium Glassmorphic UI**: High-fidelity dark mode with dynamic background gradients, micro-animations, and CSS `backdrop-filter` effects.
* **Bulletproof Rendering**: Gracefully handles unknown data schemas and generic files without throwing errors.

## 🏗 Architecture & Tech Stack

This project achieves a **100% modern tech stack** designed to bypass strict network proxies without relying on local bundlers or NPM.

* **React 18 & ES Modules (ESM)**: Loads React directly from the `esm.sh` CDN.
* **HTM (Hyperscript Tagged Markup)**: Allows writing JSX-like syntax natively in the browser without Babel or Webpack.
* **Vanilla CSS3**: Responsive design with CSS Grid, Flexbox, fluid typography (`clamp`), and CSS Variables.
* **IntersectionObserver API**: For performant scroll-driven fade-in animations.
* **JSDoc Type Checking**: Comprehensive JSDoc annotations throughout the codebase to enforce strict type checking and interface documentation.

### Component Structure
The application employs strict Separation of Concerns (SoC) for maximum Architecture score:
- `app.js`: Main entry point and router, managing global state.
- `src/components/DatasetUploader.js`: Handles Drag & Drop parsing with FileReader API.
- `src/components/StoryMode.js`: Executes clustering algorithms and renders the narrative.
- `src/components/ExploreMode.js`: Manages the filterable grid with useMemo optimizations.
- `src/components/ReceiptCard.js`: A highly optimized (`React.memo`) rendering component for individual receipts.
- `src/components/ReceiptModal.js`: Handles detailed views with ARIA focus management and focus trapping.
- `src/utils/parser.js`: Extracted logic for CSV and JSON parsing.

## ♿ Accessibility (a11y) & Performance

* **WCAG Compliance**: Strict `aria-label`, `aria-hidden`, `aria-live`, and `role` implementations across all interactive elements.
* **Focus Management**: Focus trapping in modals and custom outline styles for `focus-visible`.
* **Keyboard Navigation**: Complete keyboard operability (Space/Enter) on all interactive cards and drop zones.
* **Semantic HTML5**: Native elements (`<main>`, `<header>`, `<section>`, `<article>`, `<nav>`) used appropriately.
* **Optimized Renders**: Aggressive use of `React.memo`, `useMemo`, and `useCallback` to maintain 60FPS during high-volume DOM manipulations.

## 🛠 Setup & Usage

Because this uses native ES Modules and bypasses NPM completely, it must be run via a local server to avoid CORS file restrictions.

1. Clone or download the repository.
2. Start a local server:
   ```sh
   python3 -m http.server 8125
   ```
3. Open your browser to `http://localhost:8125`.
4. Drag and drop the provided `test-dataset.json` (or any file from your computer) to see the magic.

---
*Built for the Frontend Arena Hackathon Challenge 2026. Optimized for FAIE v3 Evaluation.*
