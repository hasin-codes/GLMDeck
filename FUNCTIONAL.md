# GLM Slide Agent: Technical Engineering Manual

This manual provides an exhaustive blueprint for engineers looking to build a production-grade generative presentation platform using **Next.js**, **Tailwind CSS**, and **Multi-Agent LLM Orchestration**.

---

## 1. System Philosophy: The "Canvas vs. Brain" Split

In a modern Generative UI application, you must decouple the **Narrative Logic** (the "Brain") from the **Visual Layout** (the "Canvas").

- **The Brain (Chat):** Handles reasoning, memory, and strategic planning.
- **The Canvas (Slides):** A high-fidelity execution layer that interprets code and assets.

---

## 2. Multi-Agent Orchestration Pipeline

To achieve professional results, do not ask a single LLM to "make a presentation." Instead, use a specialized pipeline:

### Agent L1: The Strategist (Narrative Architect)

- **Model:** `gemini-2.5-flash` (Optimized for speed/context window)
- **Role:** Analyzes the prompt and user history. Outputs a "Master Plan"—a structured list of slide titles and the "Visual Intent" (e.g., "Minimalist Hero with centered bold text").

### Agent L2: The UI Architect (Frontend Engineer)

- **Model:** `gemini-2.5-pro` (Optimized for code generation)
- **Role:** Consumes the Plan and the **Existing Project State**. Generates raw, atomic HTML using Tailwind utility classes.

### Agent L3: The Vision Specialist (Asset Generator)

- **Model:** `gemini-2.5-flash-image` (Optimized for high-speed visuals)
- **Role:** Extracts "Image Prompts" from the UI Architect's code and generates thematic assets.

---

## 3. Contextual Awareness: The "Edit This" Problem

A major challenge is ensuring the AI knows which slide you want to edit.

1. **Index Tracking:** Pass the `currentSlideIndex` as a metadata field in every API request.
2. **State Reflection:** The UI Architect agent should be fed the *entire current array of slides* (as a stringified JSON) in its prompt.
3. **Surgical Edits:** Instruct the agent: *"If updating slide ID 'X', keep the existing layout structure but swap the color palette to Indigo."*

---

## 4. Current Project State

### Directory Structure

```
slides/
├── app/
│   ├── page.tsx              # Landing page (HeroSection + CreationCard + QuickStartGrid)
│   ├── p/[id]/page.tsx       # Workspace (ChatPanel + SlidePreview + ThumbnailStrip)
│   ├── layout.tsx            # Root layout with Google Fonts + metadata
│   └── globals.css           # CSS variables + Tailwind v4 theme
├── components/
│   ├── landing/
│   │   ├── HeroSection.tsx   # Animated hero with gradient text
│   │   ├── CreationCard.tsx  # Glass-morphism prompt input card
│   │   ├── QuickStartGrid.tsx# Community gallery with Next/Image + fallbacks
│   │   ├── Navbar.tsx        # Fixed top nav with glass effect
│   │   └── Footer.tsx        # Minimal footer
│   ├── workspace/
│   │   ├── ChatPanel.tsx     # Chat interface for AI interaction
│   │   ├── SlidePreview.tsx  # Main slide renderer (iframe sandbox)
│   │   ├── ThumbnailStrip.tsx# Horizontal slide navigation
│   │   └── TopBar.tsx        # Project title + controls
│   └── ui-premium.tsx        # PremiumButton, GlassCard components
├── lib/
│   └── utils.ts              # cn() classname merger utility
└── public/
    └── thumbnails/           # Community template preview images
```

### Design Tokens (globals.css)

```css
:root {
  --background: #000000;
  --foreground: #ffffff;
  --brand: #34B27B;
  --surface: #0A0A0A;
  --border: #1A1A1A;
  --muted: #A1A1AA;
}
```

### Key Components Implemented

| Component | Status | Description |
|-----------|--------|-------------|
| `HeroSection` | ✅ Complete | Animated gradient hero with typewriter effect |
| `CreationCard` | ✅ Complete | Prompt input with Slide/Poster toggle |
| `QuickStartGrid` | ✅ Complete | 6 community cards with Next/Image + fallbacks |
| `ChatPanel` | ✅ Shell | Message list UI (needs LLM integration) |
| `SlidePreview` | ✅ Complete | 5 demo slides with metrics layout |
| `ThumbnailStrip` | ✅ Complete | Horizontal scroll + active indicator |
| `TopBar` | ✅ Complete | Project title + placeholder controls |

---

## 5. Phase 2: Authentication & Backend (Scaling Up)

Transitioning from a "Local Demo" to a "Production SaaS" requires a robust backend architecture.

### A. Authentication (The Gatekeeper)

Use **Clerk** or **Auth.js (NextAuth)**.

- **Client Side:** Use hooks like `useUser()` to identify the operator.
- **Server Side:** Protect your API routes. Every LLM request must verify the `userId`.

### B. Database Schema (The Memory)

Use an ORM like **Prisma** with a Postgres database (Supabase/Neon).

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  projects  Project[]
}

model Project {
  id        String   @id @default(cuid())
  title     String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  slides    Slide[]
  messages  Message[]
  createdAt DateTime @default(now())
}

model Slide {
  id        String  @id @default(uuid())
  order     Int
  title     String
  code      String  @db.Text // Store the generated Tailwind/HTML
  projectId String
  project   Project @relation(fields: [projectId], references: [id])
}
```

---

## 6. API Route Structure (To Implement)

### `/api/generate` — Main Generation Endpoint

```typescript
// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt, mode, existingSlides, activeSlideIndex, history } = await req.json();

  // 1. Call L1 Strategist for narrative plan
  // 2. Call L2 UI Architect for Tailwind HTML
  // 3. Call L3 Vision Specialist for images
  // 4. Return processed slides

  return NextResponse.json({ slides: [], explanation: '' });
}
```

### `/api/projects` — CRUD Operations

```typescript
// GET /api/projects — List user projects
// POST /api/projects — Create new project
// GET /api/projects/[id] — Get single project
// PUT /api/projects/[id] — Update project
// DELETE /api/projects/[id] — Delete project
```

---

## 7. LLM Provider Interface

Create `lib/ai/provider.ts`:

```typescript
export interface LLMProvider {
  name: string;
  
  generateText(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<string>;
  
  generateJSON<T>(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    systemPrompt?: string;
    schema: JSONSchema;
  }): Promise<T>;
  
  streamText(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    onChunk: (chunk: string) => void;
  }): Promise<void>;
}

export interface ImageProvider {
  name: string;
  
  generateImage(params: {
    prompt: string;
    aspectRatio?: '16:9' | '1:1' | '9:16';
    style?: 'photorealistic' | 'illustration' | 'abstract';
  }): Promise<string | undefined>; // Returns base64
}
```

---

## 8. Type System

Create `lib/types.ts`:

```typescript
export enum AgentMode {
  SLIDE = 'SLIDE',   // 16:9 presentation
  POSTER = 'POSTER'  // Portrait format
}

export interface SlideContent {
  id: string;
  title: string;
  code: string;  // Tailwind HTML
  imageAssets: Record<string, string>;  // {{IMG_0}} → base64
}

export interface Project {
  id: string;
  title: string;
  mode: AgentMode;
  slides: SlideContent[];
  history: Message[];
  createdAt: number;
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isGenerating?: boolean;
}

export interface GenerationRequest {
  prompt: string;
  mode: AgentMode;
  existingSlides: SlideContent[];
  history: Message[];
  activeSlideIndex: number;
}
```

---

## 9. Security: Handling "Dangerous" HTML

Rendering AI-generated HTML is a security risk (XSS).

### Step 1: Sanitization

Use `isomorphic-dompurify` on the server or client to strip out `<script>`, `<iframe>`, and `on*` event handlers.

### Step 2: The Iframe Sandbox

In Next.js, render the code inside a **sandboxed iframe**:

```html
<iframe 
  sandbox="allow-popups allow-forms" 
  srcDoc={sanitizedCode} 
  className="w-full h-full border-none"
/>
```

---

## 10. Scaling for High Traffic (The "Million Slide" Strategy)

If you have 20,000 users each generating 50 slides, you will reach **1,000,000 slides**.

### A. The "Hybrid Storage" Pattern

1. **Postgres:** Stores only metadata (slide ID, title, order, `storageKey`).
2. **Object Storage (S3 / Vercel Blob):** Stores the actual HTML/JSON file.

### B. Caching & Edge Performance

- **Redis (Upstash):** Cache the "Current Active Project" in Redis. Flush to DB every 60 seconds.
- **CDN:** Serve generated HTML through CDN with long TTL.

### C. LLM Context Compression

Only send the *Current Slide*, the *Previous 2*, and the *Next 1* as full code. For all other slides, send only a "Summary" (Title + Brief Description).

### D. Database Indexing

```sql
CREATE INDEX idx_project_slides ON "Slide" ("projectId", "order");
```

---

## 11. Next Steps for Implementation

### Priority 1: Core AI Integration

- [ ] Set up `lib/ai/providers/gemini.ts` with Google Gemini SDK
- [ ] Create `lib/ai/agents/slideGenerator.ts` orchestrator
- [ ] Wire `/api/generate` route to ChatPanel

### Priority 2: State Management

- [ ] Create project context with useReducer or Zustand
- [ ] Persist to localStorage for offline demo
- [ ] Add optimistic UI updates during generation

### Priority 3: Authentication & Persistence

- [ ] Integrate Clerk or NextAuth
- [ ] Set up Prisma with Postgres (Supabase/Neon)
- [ ] Add project CRUD API routes

### Priority 4: Polish

- [ ] Add streaming responses to ChatPanel
- [ ] Implement slide reordering (drag-and-drop)
- [ ] Add export to PDF/PPTX functionality

---

## 12. Conclusion

The GLM Slide Agent is a journey from **Prompting** to **Orchestration**. By decoupling the Brain (Chat) from the Canvas (Slides), using a multi-agent pipeline, and planning for scale with hybrid storage and context windowing, you create a professional tool that grows with your user base.

**Current Status:** Frontend complete. Backend integration pending.
