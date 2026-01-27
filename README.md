# AlumniConnect

A modern alumni networking platform powered by AI. Connect with former classmates, find mentors, and discover career opportunities through intelligent matching.
https://alumniconnect-flame.vercel.app/#/chat
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_AI-Powered-4285F4?logo=google&logoColor=white)

---

## Features

### Dashboard
- Network overview with key statistics
- Career heatmap showing industry distribution
- Personalized alumni recommendations
- Activity timeline tracking your interactions

### Alumni Directory
- Browse and search the complete alumni database
- Filter by industry, location, graduation year, and more
- View detailed profiles with career history and contact info

### AI Network Scout
- Natural language search powered by Google Gemini
- Semantic matching to find the right connections
- Example queries:
  - *"Who has experience in AI or Machine Learning in Colorado?"*
  - *"Suggest 3 alumni in the Entertainment industry for a guest speaker panel"*
  - *"Find recent graduates working at Google or Disney"*

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript |
| Routing | React Router 7 |
| Build Tool | Vite 6 |
| AI Engine | Google Gemini |
| Charts | Recharts |
| Icons | Lucide React |

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
