# Suraksha-AI: Heatwave Preparedness Agent

AI-powered heatwave preparedness and vulnerability assessment tool for households and field workers. Built for PS-2 (Heatwave Preparedness Agent) under Social Impact & Prevention.

## Features

- **Live Weather & Heat Risk Banner** — Real-time heat-index ticker with temperature, humidity, and color-coded risk levels (Green/Yellow/Orange/Red) for 8 Indian cities.
- **Household Profiling Wizard** — 4-step guided form collecting household demographics, housing type, cooling assets, and water access.
- **AI Risk Assessment Engine** — Computes a 0-100 vulnerability score with risk factor breakdown and a prioritized, interactive action plan (Immediate / Daily / Emergency).
- **Hindi & Indic Voice Assistance** — Full Hindi/English language toggle with Web Speech API text-to-speech for guidance playback.
- **ASHA Worker / NGO Field Mode** — Multi-household management with side-by-side comparison to prioritize cooling kit distribution.
- **Printable Outreach Card** — One-click print/PDF emergency card with helpline numbers (108, 1070, 112, 100).

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Supabase (PostgreSQL + RLS)
- Lucide React icons
- Web Speech API for voice assistance

## Getting Started

```bash
npm install
npm run dev
```

## Environment Variables

Create a `.env` file with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Build

```bash
npm run build
```

## License

This project is built for social impact under the Heatwave Preparedness initiative.
