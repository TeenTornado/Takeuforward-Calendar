# TakeUforward Wall Calendar 🔴

An interactive, editorial-style wall calendar web application designed specifically for the TakeUforward brand. The application acts as a comprehensive productivity and ambient tracker for developers, combining a premium brutalist dark-mode aesthetic with powerful local data features.

## ✨ Core Features

### 📅 Advanced Calendar Grid
*   **Brutalist Editorial Aesthetic**: Sharp borders, `#050505` true-dark background, and a unique "spiral bound" visual wrapper.
*   **Date Range Selection**: Click any two dates (start and end) to select ranges directly on the calendar. Features dynamic highlighting for the days falling inside the interval.
*   **Month Traversal**: Fully fluid month-to-month navigation.

### 🎥 Dynamic Hero Video Presenter
*   **Rotating Content**: The header automatically cycles through 8 confirmed master playlists from Striver (A2Z DSA, SDE Sheet, Graph Series, etc.).
*   **Visual Pacing**: Cycles smoothly every 20 seconds.
*   **Reliable Fetching**: Utilizes `hqdefault` YouTube thumbnail fetching for guaranteed 100% resolution availability, avoiding broken images on older API endpoints.

### 📝 Integrated Tag-Based Notes System
*   **Contextual Notes**: Bind notes to a single specific date OR an entire selected date range.
*   **Pre-defined Tagging**: One-click apply predefined semantic tags directly into the input area (`#DSA`, `#Revision`, `#Interview`, `#System Design`, `#Mock`).
*   **Grid Indicators**: Calendar dates containing active notes render a subtle red/white "sticky note" icon directly on the grid cell.
*   **Persistent Storage**: Fully backed by browser `localStorage`, ensuring data safety on reload.

### 🔍 Interactive Note Modals
*   **All Notes Manager**: A dedicated overlay portal (`z-50`) with a frosted backdrop.
*   **Instant Tag Filtering**: The manager dynamically indexes every tag you've ever used, producing a single-click filter bar to immediately isolate related tasks.
*   **Day Peek Popover**: Clicking the red indicator icon on the calendar grid instantly pops up a scoped dialog showing only the notes pertaining to that exact day.

### 📊 Animated DSA Donut Progress
*   **Custom SVG Engineering**: Built bypassing standard CSS restrictions (`conic-gradient`) in favor of an SVG `<circle>` tracking `strokeDasharray`.
*   **Mount Animation**: Smoothly rolls from 0 to 73% (329/450) on page load.
*   **Sick Aesthetic Hover**: A custom `500ms cubic-bezier` easing animation replaces the percentage readout with a structural calculation (`329/450 Problems`) using absolute stacking and opacity crossfades.

### 🇮🇳 Real-time Indian Holidays Engine
*   **Temporal Awareness**: Compares a static list of 22 Indian Public Observances against `Date.now()`.
*   **Smart Urgency Parsing**: Intelligently renders dynamic strings: `Today!`, `Tomorrow`, or `x days away`.
*   **View All Dialog**: Expands into a massive scrollable list grouped completely by month (January → December), dynamically tracking whether a holiday has passed (dimmed/struck through) or is current.

### 💭 Motivational Quote Slider
*   **Smart Rotation**: A curated array of developer/discipline quotes that auto-cycles with a CSS fade transition every 15 seconds.
*   **Manual Control**: Responsive structural DOM setup featuring manual chevron overrides (`<` | `>`) and interactive dot indicators to freely scrub quotes.

---

## 🛠️ Tech Stack & Philosophy
*   **Framework**: Next.js 15 (App Router).
*   **Language**: TypeScript (`.tsx`).
*   **Styling**: Tailwind CSS v4 (Custom brand tokens + explicit constraint guidelines).
*   **Icons**: Lucide React.
*   **Design Philosophy**: "Luxury Minimal / Editorial" — Explicit rejection of generic layouts. Utilizes asymmetrical structural layouts, extremely tight typography contrast, raw borders, purposeful interaction animations, and no system fonts.
