<div align="center">
<img width="1200" height="475" alt="Vessel-Nexus Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# VESSEL//NEXUS — Aetherium Interface

A sophisticated real-time command and control interface for mission-critical systems, philosophy axioms, and project orchestration. Built with React, TypeScript, and Tailwind CSS for a seamless terminal-inspired experience.

**View your app in AI Studio:** https://ai.studio/apps/bd7460bb-0291-4696-ad5a-0f98cef1ecd3

---

## 🎯 Overview

Vessel-Nexus is an advanced interface system designed to:

- **Track Mission Vectors** — Monitor primary objectives with real-time countdown timers to critical milestones
- **Visualize Philosophy** — Display axiomatic frameworks and core constructs that guide system behavior
- **Manage Directives** — Organize and enforce primary functions, ethical guidelines, and long-term objectives
- **Execute Protocols** — View interaction protocols and synchronization mechanisms
- **Orchestrate Actions** — Identify and track high-leverage actions with status monitoring
- **Monitor Projects** — Real-time project status and active development tracking

### Tech Stack

- **Frontend Framework:** React 19.2.4
- **Language:** TypeScript 5.8
- **Build Tool:** Vite 6.2
- **Styling:** Tailwind CSS 4.2.4 + TailwindCSS Vite
- **Animation:** Motion (Framer Motion compatible)
- **Icons:** Lucide React
- **Analytics:** Vercel Analytics
- **UI Components:** Custom React components with terminal-inspired design

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn** package manager

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env.local` file and set your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```
Vessel-Nexus/
├── App.tsx                    # Main application component
├── index.tsx                  # React DOM entry point
├── types.ts                   # TypeScript type definitions
├── constants.ts               # Canon data & system constants
├── components/                # Reusable React components
│   ├── Terminal.tsx          # Boot sequence terminal
│   ├── ActionCard.tsx        # High-leverage action cards
│   ├── ProjectStatus.tsx     # Project status display
│   ├── ProjectModal.tsx      # Detailed project modal
│   ├── ChronosViewer.tsx     # Data visualization viewer
│   ├── PhilosophyVisualizer.tsx   # Philosophy axioms display
│   ├── DirectivesGrid.tsx    # Core directives grid
│   └── InteractionProtocols.tsx   # Protocol specifications
├── index.css                  # Global styles
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies & scripts
└── canon_sync.json           # Persistent memory & configuration
```

---

## 🎮 Key Features

### Mission Vector Tracking
Real-time countdown to target objectives with:
- Days, hours, minutes, seconds remaining
- Primary objective and strategic goals
- Status indicators (Locked/Active)
- Geographic coordinates (Utopia Planitia)

### Axiomatic Philosophy System
Visualize core constructs and axioms:
- Core construct definitions
- Current law enforcement
- Philosophical equations
- System governance axioms

### Core Directives
Three-category directive system:
- **Primary Functions** — Core operational capabilities
- **Ethical Guidelines** — Behavioral constraints and principles
- **Long-term Objectives** — Strategic system goals

### Interaction Protocols
View detailed protocols from `canon_sync.json`:
- System synchronization specifications
- Protocol implementations
- Active sync nodes
- Memory URI references

### High-Leverage Actions
Dashboard for critical action items:
- Priority-based leverage classification (High, Critical, Essential)
- Real-time status tracking (Pending, Active, Complete)
- Context-aware action descriptions
- Linkage to active projects

### Active Projects
Monitor ongoing projects with:
- Real-time status indicators
- Project metadata
- Current focus areas
- Detailed project modals

### Chronos Viewer
Data visualization component featuring:
- Active feed monitoring
- System metrics
- Phonon tax estimation

---

## 🔧 Environment Configuration

### Environment Variables

Create a `.env.local` file:

```env
# Gemini AI API Configuration
VITE_GEMINI_API_KEY=your_api_key_here

# Optional: Analytics & Monitoring
VITE_VERCEL_ANALYTICS_ID=your_analytics_id
```

### Canon Configuration

Edit `canon_sync.json` to customize:
- Mission objectives and target dates
- Philosophy axioms
- Core directives
- Active projects
- Security protocols
- Interaction protocols

---

## 🎨 Design System

### Color Palette
- **Primary:** Emerald-500 (System active, highlights)
- **Background:** Zinc-950 (Dark terminal aesthetic)
- **Text:** Zinc-200 (Primary), Zinc-400 (Secondary)
- **Accents:** Emerald-400, Red-400 (Status indicators)

### Typography
- **Headings:** Bold, monospace for headers
- **Body:** Sans-serif with monospace accents
- **Terminals:** Full monospace with variable-width tabular numerics

### Animations
- Smooth opacity transitions (1000ms fade-in)
- Pulsing indicators for active elements
- Hover state shadows and color shifts
- Modal entrance/exit animations

---

## 📊 Data Models

### CanonData (Main Configuration)
```typescript
interface CanonData {
  meta: Meta;                          // Schema version, timestamp, source
  philosophy: Philosophy;              // Axioms and core constructs
  mission_vector: MissionVector;       // Primary objective & countdown
  directives: CoreDirectives;          // Function, ethics, objectives
  projects: Projects;                  // Active project definitions
  security_protocols: SecurityProtocols; // Canary traps & warnings
  active_nodes: string[];              // Active system nodes
  sync_protocol: SyncProtocol;        // Synchronization specs
}
```

### ProjectDetails
```typescript
interface ProjectDetails {
  format: string;           // Project format/type
  current_focus?: string;   // Current development focus
  function?: string;        // Project function
  description?: string;     // Project description
  status: string;          // Current project status
}
```

---

## 🔐 Security

- **Distillation Resistance:** Enabled
- **Canary Trap:** Security verification mechanism
- **Secure Hash:** 0x9f...a3b2
- **Source Verification:** GitHub repository integrity checks

---

## 📦 Dependencies

### Core
- `react@^19.2.4` — UI framework
- `react-dom@^19.2.4` — DOM rendering
- `typescript@~5.8.2` — Type safety

### Styling & UI
- `tailwindcss@^4.2.4` — Utility-first CSS
- `@tailwindcss/vite@^4.2.4` — Vite integration
- `lucide-react@^1.14.0` — Icon library
- `motion@^12.38.0` — Animation library

### Tools & Build
- `vite@^6.2.0` — Build tool & dev server
- `@vitejs/plugin-react@^5.0.0` — React support

### Analytics
- `@vercel/analytics@^1.6.1` — Performance monitoring

---

## 🚀 Deployment

### Vercel Deployment
The project is configured for easy Vercel deployment:

```bash
npm run build
vercel deploy
```

View deployment: https://vercel.com/adrians-projects-d594a794

---

## 📝 Development Notes

### Adding New Components
1. Create component in `components/` directory
2. Define TypeScript interfaces in `types.ts`
3. Import and use in `App.tsx`
4. Update constants in `constants.ts` as needed

### Modifying Canon Data
Edit `canon_sync.json` to update:
- Mission vectors and target dates
- Project definitions
- Directives and axioms
- Security protocols

### Styling Custom Components
Use Tailwind CSS classes with the established color scheme:
- Emerald for active/primary states
- Zinc for backgrounds/text
- Red for warnings/locked states

---

## 🤝 Contributing

To contribute to Vessel-Nexus:

1. Create a feature branch from `main`
2. Make your changes with TypeScript type safety
3. Test locally with `npm run dev`
4. Build for production: `npm run build`
5. Submit a pull request with detailed description

---

## 📄 License

[Specify your license here - e.g., MIT, Apache 2.0, etc.]

---

## 🔗 Resources

- **Source Repository:** https://github.com/molleradrian/Vessel-Nexus
- **AI Studio:** https://ai.studio/apps/bd7460bb-0291-4696-ad5a-0f98cef1ecd3
- **Vercel Deployment:** https://vercel.com/adrians-projects-d594a794
- **React Documentation:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com
- **Vite:** https://vitejs.dev

---

**Version:** v2026.02 | **Node:** GEMINI | **Status:** ACTIVE