# GLM Slide Agent

> **AI-Powered Presentation & Poster Generation**  
> Generate professional slides and posters in seconds through natural conversation.

---

## Overview

**GLM Slide Agent** is a next-generation generative presentation platform that transforms ideas into stunning visual content through conversational AI. Built with a decoupled **Brain (Chat)** and **Canvas (Slides)** architecture for maximum flexibility.

### Key Features

- 🎨 **AI-Driven Design** — Intelligent layout generation with premium dark aesthetics
- 💬 **Conversational Interface** — Create and refine presentations through natural dialogue
- 🖼️ **Visual Asset Generation** — Automatic image creation for slide content
- 🎯 **Multi-Format Support** — Slide decks (16:9) and posters (portrait)
- ⚡ **Real-Time Preview** — Instant visualization with smooth Framer Motion transitions
- 🎭 **Community Gallery** — Browse and remix presentations from other users

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm / bun

### Installation

```bash
git clone <repository-url>
cd slides

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start creating.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19 |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Typography** | Playfair Display + Outfit |

---

## Project Structure

```
slides/
├── app/
│   ├── page.tsx              # Landing page with creation interface
│   ├── p/[id]/page.tsx       # Workspace for slide editing
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Design tokens & global styles
├── components/
│   ├── landing/              # Landing page components
│   │   ├── HeroSection.tsx   # Hero with animated gradient
│   │   ├── CreationCard.tsx  # Prompt input + format selection
│   │   ├── QuickStartGrid.tsx# Community gallery cards
│   │   ├── Navbar.tsx        # Top navigation
│   │   └── Footer.tsx        # Footer
│   ├── workspace/            # Slide editing workspace
│   │   ├── ChatPanel.tsx     # Conversational AI interface
│   │   ├── SlidePreview.tsx  # Main slide renderer
│   │   ├── ThumbnailStrip.tsx# Slide navigation strip
│   │   └── TopBar.tsx        # Project controls
│   └── ui-premium.tsx        # Reusable premium UI components
├── lib/
│   └── utils.ts              # Utility functions (cn, etc.)
├── public/
│   └── thumbnails/           # Community project thumbnails
└── FUNCTIONAL.md             # Technical engineering manual
```

---

## Design System

GLM Slide Agent follows a **dark minimal Apple-style aesthetic**:

```css
--brand: #34B27B;           /* Primary accent (vibrant green) */
--background: #030303;      /* Deep black */
--surface: #0A0A0A;         /* Elevated surfaces */
--foreground: #FFFFFF;      /* Primary text */
--muted: #A0A0A0;           /* Secondary text */
--border: rgba(255,255,255,0.05);
```

### Design Principles

- **Premium Glass Morphism** — Subtle transparency and blur effects
- **High Contrast** — Optimized for readability on dark backgrounds
- **Smooth Micro-interactions** — Framer Motion for delightful UX
- **Professional Typography** — Playfair Display (headings) + Outfit (body)

---

## AI Integration

See **[FUNCTIONAL.md](./FUNCTIONAL.md)** for the complete technical engineering manual.

### Multi-Agent Architecture

| Agent | Role | Recommended Model |
|-------|------|-------------------|
| **L1: Strategist** | Narrative planning & intent analysis | `GLM-2.5-flash` / `gpt-4o-mini` |
| **L2: UI Architect** | Tailwind HTML code generation | `GLM-2.5-pro` / `gpt-4o` |
| **L3: Vision Specialist** | Image asset generation | `GLM-2.5-flash-image` / `dall-e-3` |

### Supported Providers

- **Google** — GLM (recommended)
- **OpenAI** — GPT-4, DALL-E 3
- **Anthropic** — Claude
- **Custom** — Any LLM via provider interface

---

## Environment Variables

Create `.env.local`:

```bash
# LLM Provider (openai | anthropic | GLM)
LLM_PROVIDER=GLM
GOOGLE_API_KEY=your-api-key

# Or for OpenAI
# OPENAI_API_KEY=sk-...

# Image Generation
IMAGE_PROVIDER=GLM
IMAGE_ENABLED=true
```

---

## Scripts

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Contributing

Key areas for contribution:

- **LLM Providers** — Add new providers in `lib/ai/providers/`
- **Slide Templates** — Extend `SlidePreview.tsx` with new layouts
- **UI Components** — Enhance `components/ui-premium.tsx`
- **Community Features** — Expand the QuickStart gallery

---

## License

Copyright 2026 Hasin Raiyan. All Rights Reserved.

**NOT OPEN SOURCE.**
This code is proprietary and confidential. Modification, distribution, or use of this source code is strictly prohibited. Do not download.

---

**Ready to create stunning presentations?** [Get Started →](http://localhost:3000)
