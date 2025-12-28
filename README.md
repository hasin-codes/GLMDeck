# GLM Slide Agent

> **AI-Powered Presentation & Poster Generation**  
> Generate professional slides and posters in seconds through natural conversation.

---

## 🌟 Overview

**GLM Slide Agent** is a next-generation presentation creation tool that leverages AI to transform your ideas into stunning visual content. Simply describe what you want to create, and watch as the agent crafts professional-quality slides with intelligent layouts, engaging visuals, and cohesive design.

### Key Features

- 🎨 **AI-Driven Design**: Intelligent layout generation with premium aesthetics
- 💬 **Conversational Interface**: Create and refine presentations through natural dialogue
- 🖼️ **Visual Asset Generation**: Automatic image creation for slide content
- 🎯 **Multi-Format Support**: Generate both slide decks (16:9) and posters (portrait)
- ⚡ **Real-Time Preview**: Instant visualization with smooth transitions
- 🎭 **Community Gallery**: Browse and remix presentations from other users
- 🔄 **Iterative Refinement**: Edit individual slides or restructure entire decks

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd slides

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start creating presentations.

---

## 🏗️ Architecture

### Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router)
- **UI Library**: [React 19](https://react.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev)
- **Typography**: Playfair Display + Outfit (Google Fonts)

### Project Structure

```
slides/
├── app/
│   ├── page.tsx              # Landing page with creation interface
│   ├── p/[id]/page.tsx       # Workspace for slide editing
│   ├── layout.tsx            # Root layout with metadata
│   └── globals.css           # Global styles and design tokens
├── components/
│   ├── landing/              # Landing page components
│   │   ├── HeroSection.tsx
│   │   ├── CreationCard.tsx
│   │   ├── QuickStartGrid.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── workspace/            # Slide editing workspace
│   │   ├── ChatPanel.tsx
│   │   ├── SlidePreview.tsx
│   │   ├── ThumbnailStrip.tsx
│   │   └── TopBar.tsx
│   └── ui-premium.tsx        # Reusable premium UI components
├── lib/
│   └── utils.ts              # Utility functions (cn, etc.)
├── public/
│   └── thumbnails/           # Community project thumbnails
└── FUNCTIONAL.md             # AI integration guide
```

---

## 🎯 Core Features

### 1. Conversational Creation

Describe your presentation in natural language:
- "Create a quarterly business review for Q2 2024"
- "Make a product launch deck for a smart wearable"
- "Generate an academic research poster on climate trends"

The AI agent understands context and generates appropriate layouts, content structure, and visual hierarchy.

### 2. Intelligent Slide Types

The system supports multiple slide layouts:
- **Metrics**: KPI dashboards with hero numbers and secondary stats
- **Bullets**: Key points with visual hierarchy
- **Title**: Section headers and closing slides
- **Chart**: Data visualization placeholders
- **Comparison**: Side-by-side analysis
- **Quote**: Testimonials and callouts

### 3. Community Gallery

Browse professionally designed presentations from the community:
- 3-column responsive grid layout
- Engagement metrics (views, likes)
- One-click prompt population
- Diverse categories (Business, Product, Academic, Startup)

### 4. Real-Time Editing

- **Live Preview**: See changes instantly with smooth transitions
- **Slide Navigation**: Intuitive prev/next controls with keyboard shortcuts
- **Thumbnail Strip**: Quick overview and navigation
- **Chat-Based Refinement**: Request changes conversationally

---

## 🎨 Design Philosophy

GLM Slide Agent follows a **dark minimal Apple-style aesthetic**:

- **Premium Glass Morphism**: Subtle transparency and blur effects
- **Vibrant Brand Accent**: Custom green (`#34B27B`) for CTAs and highlights
- **Professional Typography**: Playfair Display for headings, Outfit for body
- **Smooth Animations**: Framer Motion for delightful micro-interactions
- **High Contrast**: Optimized for readability on dark backgrounds

### Design Tokens

```css
--brand: #34B27B;           /* Primary accent */
--background: #030303;      /* Deep black */
--surface: #0A0A0A;         /* Elevated surfaces */
--foreground: #FFFFFF;      /* Primary text */
--muted: #A0A0A0;           /* Secondary text */
--border: rgba(255,255,255,0.05);
```

---

## 🔌 AI Integration

GLM Slide Agent is designed to work with **any LLM and image generation model**. See [FUNCTIONAL.md](./FUNCTIONAL.md) for the complete integration guide.

### Multi-Agent Architecture

1. **Narrative Planner** (Fast LLM): Understands user intent and creates a plan
2. **UI Architect** (Pro LLM): Generates structured slide JSON with Tailwind HTML
3. **Image Generator**: Converts text prompts to visual assets

### Supported Providers

- OpenAI (GPT-4, DALL-E 3)
- Anthropic (Claude)
- Google (Gemini, Imagen)
- Any custom LLM via provider interface

---

## 📦 Scripts

```bash
# Development
npm run dev          # Start dev server on localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

---

## 🛠️ Configuration

### Environment Variables

Create a `.env.local` file for API keys (see [FUNCTIONAL.md](./FUNCTIONAL.md) for details):

```bash
# LLM Provider
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...

# Image Generation
IMAGE_PROVIDER=openai
IMAGE_ENABLED=true
```

### Metadata

Update `app/layout.tsx` for SEO and social sharing:

```typescript
export const metadata: Metadata = {
  title: "GLM Slide Agent | AI-Powered Presentations",
  description: "Generate professional slides and posters in seconds through conversation.",
  openGraph: {
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};
```

---

## 🎓 Usage Examples

### Creating a Business Presentation

1. Navigate to the landing page
2. Enter: "Quarterly business review showing 20% revenue growth"
3. Select "Slide Deck" mode
4. Click "Generate"
5. Refine via chat: "Make the first slide more visual"

### Editing Existing Slides

1. Click on a slide in the thumbnail strip
2. Use chat: "Change the color scheme to blue"
3. Or: "Add a comparison table to this slide"
4. Preview updates in real-time

---

## 🤝 Contributing

This project is designed for extensibility. Key areas for contribution:

- **LLM Providers**: Add new providers in `lib/ai/providers/`
- **Slide Templates**: Extend `SlidePreview.tsx` with new layouts
- **UI Components**: Enhance `components/ui-premium.tsx`
- **Community Features**: Expand the QuickStart gallery

---

## 📄 License

[MIT License](LICENSE) - feel free to use this project for personal or commercial purposes.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI inspired by modern design systems
- Powered by state-of-the-art LLMs and image generation models

---

**Ready to create stunning presentations?** [Get Started →](http://localhost:3000)
