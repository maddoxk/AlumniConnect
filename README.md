# AlumniConnect

A modern alumni networking platform powered by AI. Connect with former classmates, find mentors, and discover career opportunities through intelligent matching.
https://alumniconnect-flame.vercel.app/#/chat
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_AI-Powered-4285F4?logo=google&logoColor=white)

---

## Features & Design System

### Advancement Operations Command Center (`/`)
- Institutional briefing tailored for University Advancement & Alumni Relations officers
- Analytical KPI metrics: Verified alumni, active employer hubs, tracked touchpoints, and metro density
- Industry sector horizontal distribution breakdown and cohort momentum
- Curated high-value alumni for department outreach and panel speaker invitations
- Live engagement feed tracking staff touchpoints across emails, phone calls, and meetings

### Alumni Directory & Records (`/alumni`)
- Dual-view interface: Toggle between **Dense Table View** (advancement data audit) and **Card Grid View**
- Multi-faceted filtering: Search query, industry verticals, graduation cohorts (2020–2027), and geographic hubs
- Instant CSV export of filtered records for institutional reporting
- Spreadsheet (CSV) bulk data ingestion with schema validation

### Alumnus Dossier & Record View (`/alumni/:id`)
- Institutional alumnus record with graduation credentials, verified badge, and degree details
- Direct touchpoint logging form (Email, Call, Meeting, LinkedIn Outreach) with staff attribution
- Enriched skill tags, career bio, and campus engagement readiness flags (Mentorship, Panels, Regional Chapter)

### Advancement Discovery Copilot (`/chat`)
- Natural language semantic search powered by Google Gemini 3 Flash
- Grounded query presets for university operations (speaker sourcing, career treks, mentorship matching)
- Structured match results with direct links to alumnus dossiers
- Restrained, focused design without gratuitous neon glows or gamified tropes

### System & Database Settings (`/settings`)
- Database health monitoring and storage footprint diagnostics
- Full database export (JSON backup and CSV directory export)
- Gemini GenAI model status and connectivity diagnostics
- Safe data management (factory dataset restoration, engagement log purge)

---

## Design System Architecture

- **Visual Tone**: Authoritative, restrained, archival institutional modern ("Advancement Operations OS")
- **Palette**: University of Denver Collegiate Crimson (`#BA0C2F`), Obsidian Navy (`#0F172A`), Slate/Stone neutrals, and crisp borders (`#E2E8F0`)
- **Typography**: Google Fonts **Plus Jakarta Sans** with clean letter-spacing, tight heading tracking, and tabular numbers (`tnum`) for statistics
- **Density**: High-utility spacing grid, clean data tables, refined border radii (6px/8px/12px) replacing generic bubbly cards
- **Design Tokens**: Standardized CSS variables and Tailwind utility classes (`.btn-primary`, `.btn-secondary`, `.btn-crimson`, `.badge-*`, `.card-institutional`)

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com/) API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/maddoxk/AlumniConnect.git
   cd AlumniConnect
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your API key:

   Create a `.env.local` file in the root directory:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Project Structure

```
alumniconnect-ai/
├── pages/
│   ├── Dashboard.tsx      # Main overview page
│   ├── AlumniList.tsx     # Directory browser
│   ├── AlumniDetail.tsx   # Individual profile view
│   └── AIChat.tsx         # AI matching interface
├── services/
│   ├── db.ts              # Data management
│   └── gemini.ts          # AI integration
├── data/
│   └── alumni.csv         # Alumni database
├── utils/
│   └── csvParser.ts       # Data parsing utilities
├── App.tsx                # Main app with routing
├── types.ts               # TypeScript definitions
└── index.tsx              # Entry point
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

---

## License

MIT
