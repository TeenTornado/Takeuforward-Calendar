# TakeUforward Calendar

An interactive, wall-style calendar dashboard built specifically for technical interview preparation. Designed with a minimal, dark-mode aesthetic, it serves as a daily hub for tracking DSA progress, scheduling mock interviews, and maintaining consistency.

![Framework](https://img.shields.io/badge/Next.js-15-black?style=flat-square)
![Styling](https://img.shields.io/badge/Tailwind-v4-blue?style=flat-square)
![Persistence](https://img.shields.io/badge/Storage-Local-red?style=flat-square)

## Live Demo
👉 **[View Production Deployment](https://takeuforward-calendar-gamma.vercel.app/)**

---

## Features

- **Semantic Notes System**: Apply built-in tags (e.g., `#DSA`, `#Mock_Interview`, `#System_Design`) to specific dates. Relevant icons dynamically render directly on the calendar grid.
- **Local Persistence**: All notes, tags, and progress data are stored natively in the browser via `localStorage` for instant, zero-latency access.
- **Custom Progress Tracking**: Lightweight DSA donut chart engineered purely from SVG elements and CSS transitions—completely bypassing heavy charting libraries.
- **Dynamic Video Integration**: Integrated interactive banner that lets you cycle through 8 official TakeUforward YouTube playlists manually.
- **Holiday Engine**: Real-time evaluation of Indian public holidays, dynamically marking them on the calendar grid based on the current date.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Deployment**: Vercel

## Local Development

1. Clone the repository
```bash
git clone https://github.com/TeenTornado/Takeuforward-Calendar.git
```

2. Navigate to the App Router project directory
```bash
cd Takeuforward-Calendar/V3
```

3. Install dependencies (respecting legacy peer resolutions for Next 15)
```bash
npm install
```

4. Start the development server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

---

## Author
Built by [Sreeram-vr](https://github.com/TeenTornado).
