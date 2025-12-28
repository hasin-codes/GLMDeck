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

- **Model:** `GLM-2.5-flash` (Optimized for speed/context window)
- **Role:** Analyzes the prompt and user history. Outputs a "Master Plan"—a structured list of slide titles and the "Visual Intent" (e.g., "Minimalist Hero with centered bold text").

### Agent L2: The UI Architect (Frontend Engineer)

- **Model:** `GLM-2.5-pro` (Optimized for code generation)
- **Role:** Consumes the Plan and the **Existing Project State**. Generates raw, atomic HTML using Tailwind utility classes.

### Agent L3: The Vision Specialist (Asset Generator)

- **Model:** `GLM-2.5-flash-image` (Optimized for high-speed visuals)
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

## 9. Reference Implementation: AI Slide Generation Service

This section provides a **complete pseudo-code reference** for implementing the slide generation service. It is designed to be **LLM-agnostic**—swap `YourLLMProvider` and `YourImageProvider` for any SDK (GLM, OpenAI, Anthropic, etc.).

### Why Raw HTML + Tailwind?

The UI Architect agent generates **Raw HTML infused with Tailwind CSS utility classes**. This approach is highly effective for several technical reasons:

| Benefit | Explanation |
|---------|-------------|
| **Zero Compilation** | Generated code renders immediately via `dangerouslySetInnerHTML` or sandboxed iframe—no build step needed |
| **Token Efficiency** | Tailwind utilities (`flex items-center justify-between`) are far more concise than full CSS, reducing API cost/latency |
| **Standardization** | Fixed Tailwind utility set = fewer hallucinated/invalid styles vs. raw CSS |
| **Asset Injection** | Simple `{{IMG_0}}` placeholders → string replace with Base64 data URIs |

### A. Core Types

```typescript
// lib/types.ts
export enum AgentMode {
  SLIDE = 'SLIDE',
  POSTER = 'POSTER'
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export interface SlideContent {
  id: string;
  title: string;
  code: string;  // Raw Tailwind HTML
  imageAssets: Record<string, string>;  // {{IMG_0}} → base64
}

export interface ImagePromptRequest {
  placeholder: string;  // e.g., "{{IMG_0}}"
  prompt: string;       // e.g., "Modern office with glass walls"
}

export interface UIArchitectOutput {
  slides: Array<{
    id: string;
    title: string;
    code: string;
    imagePrompts: ImagePromptRequest[];
  }>;
}
```

### B. Reference Service Implementation

```typescript
// lib/ai/services/slideGenerator.ts (PSEUDO-CODE REFERENCE)

import { SlideContent, AgentMode, Message, UIArchitectOutput } from '../types';

// ============================================
// STEP 1: Initialize your LLM Provider
// ============================================
// Replace with your actual SDK initialization:
// - Google: import { GoogleGenAI } from "@google/genai";
// - OpenAI: import OpenAI from "openai";
// - Anthropic: import Anthropic from "@anthropic-ai/sdk";

const llmProvider = new YourLLMProvider({ 
  apiKey: process.env.LLM_API_KEY 
});

const imageProvider = new YourImageProvider({ 
  apiKey: process.env.IMAGE_API_KEY 
});

// ============================================
// STEP 2: History Mapper
// ============================================
// Converts your app's message format to the LLM's expected format

function mapHistoryToLLMFormat(history: Message[]) {
  return history
    .filter(msg => msg.role !== 'system')
    .map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',  // Adjust per provider
      content: msg.content
    }));
}

// ============================================
// STEP 3: Agent L1 — The Narrative Strategist
// ============================================
// Fast model for reasoning and planning

async function getNarrativePlan(
  prompt: string, 
  history: Message[], 
  activeSlideIndex: number
): Promise<string> {
  
  const formattedHistory = mapHistoryToLLMFormat(history);
  
  const systemPrompt = `You are a master of storytelling and design strategy.
  
CONTEXT: The user is currently viewing Slide index ${activeSlideIndex}.

TASK: Analyze the user's request and determine the operation type:
- EDIT: Modify the current slide's content, style, or layout
- ADD: Create new slides (at end or at specific position)  
- RESTRUCTURE: Reorder, delete, or fundamentally reorganize the deck

Explain your plan clearly to the user. Be specific about:
1. What you understood from their request
2. Which slides will be affected
3. What changes you will make`;

  const response = await llmProvider.generateText({
    model: 'fast-reasoning-model',  // e.g., GLM-2.5-flash, gpt-4o-mini
    systemPrompt,
    messages: [...formattedHistory, { role: 'user', content: prompt }]
  });
  
  return response;
}

// ============================================
// STEP 4: Agent L2 — The UI Architect
// ============================================
// Powerful model for code generation with STRUCTURED OUTPUT

async function generateUIArchitect(
  plan: string,
  mode: AgentMode,
  existingSlides: SlideContent[],
  activeSlideIndex: number
): Promise<UIArchitectOutput['slides']> {

  // CRITICAL: Define the JSON schema for structured output
  // This ensures the LLM returns valid, parseable data
  const responseSchema = {
    type: 'object',
    properties: {
      slides: {
        type: 'array',
        description: 'Array of slide objects to render',
        items: {
          type: 'object',
          properties: {
            id: { 
              type: 'string',
              description: 'Unique slide ID. Preserve existing ID if editing, generate new UUID if adding.'
            },
            title: { 
              type: 'string',
              description: 'Slide title for thumbnail/navigation'
            },
            code: { 
              type: 'string', 
              description: `Raw HTML with Tailwind CSS utility classes. 
              
CRITICAL RULES:
- Use ONLY Tailwind utilities (no custom CSS)
- Include {{IMG_0}}, {{IMG_1}}, etc. placeholders for images
- Ensure aspect ratio matches mode (${mode === 'SLIDE' ? '16:9' : '9:16'})
- Use semantic HTML (<section>, <article>, <figure>)
- If editing existing slide, preserve structure but update content/style as per plan`
            },
            imagePrompts: {
              type: 'array',
              description: 'Image generation prompts for each placeholder',
              items: {
                type: 'object',
                properties: {
                  placeholder: { 
                    type: 'string',
                    description: 'The placeholder string used in code, e.g., "{{IMG_0}}"'
                  },
                  prompt: { 
                    type: 'string',
                    description: 'Detailed image generation prompt. Be specific about style, composition, lighting.'
                  }
                },
                required: ['placeholder', 'prompt']
              }
            }
          },
          required: ['id', 'title', 'code', 'imagePrompts']
        }
      }
    },
    required: ['slides']
  };

  const systemPrompt = `You are a world-class UI Architect specializing in presentation design.

CONTEXT:
- Active slide index: ${activeSlideIndex}
- Mode: ${mode} (${mode === 'SLIDE' ? '16:9 aspect ratio' : '9:16 portrait'})
- Existing slides: ${existingSlides.length} total

CRITICAL INSTRUCTIONS:
1. If the plan involves EDITING slide at index ${activeSlideIndex}:
   - Find the slide with matching index in the existing array
   - PRESERVE its ID
   - UPDATE the 'code' with new design/content
   
2. If ADDING new slides:
   - Generate unique IDs (use UUID format)
   - Maintain consistent visual style with existing slides
   
3. If DELETING slides:
   - Simply OMIT them from the returned array

4. For image placeholders:
   - Use {{IMG_0}}, {{IMG_1}}, etc. in the HTML code
   - Provide matching prompts in imagePrompts array

OUTPUT: Return the COMPLETE slides array (including unchanged slides).`;

  const response = await llmProvider.generateJSON<UIArchitectOutput>({
    model: 'powerful-code-model',  // e.g., GLM-2.5-pro, gpt-4o, claude-3.5-sonnet
    systemPrompt,
    messages: [{
      role: 'user',
      content: `PLAN:\n${plan}\n\nEXISTING_SLIDES:\n${JSON.stringify(existingSlides, null, 2)}`
    }],
    responseSchema,
    responseMimeType: 'application/json'
  });

  return response.slides;
}

// ============================================
// STEP 5: Agent L3 — The Vision Specialist
// ============================================
// Image generation model

async function generateVisualAsset(
  visualDescription: string,
  aspectRatio: '16:9' | '1:1' | '9:16' = '16:9'
): Promise<string | undefined> {
  try {
    const response = await imageProvider.generateImage({
      prompt: `${visualDescription}. High-end professional photography, 
               cinematic lighting, 8K resolution, magazine quality.`,
      aspectRatio,
      style: 'photorealistic'
    });
    
    // Return as Base64 data URI
    if (response.base64) {
      return `data:image/png;base64,${response.base64}`;
    }
    if (response.url) {
      // If provider returns URL, fetch and convert to base64
      return await fetchAndConvertToBase64(response.url);
    }
  } catch (err: any) {
    console.warn('Image generation skipped:', err?.message);
  }
  return undefined;
}

// ============================================
// STEP 6: Main Orchestrator Function
// ============================================

export async function generateSlides(
  prompt: string,
  mode: AgentMode,
  existingSlides: SlideContent[] = [],
  history: Message[] = [],
  activeSlideIndex: number = 0
): Promise<{ slides: SlideContent[]; explanation: string }> {

  // PHASE 1: Get narrative plan from Strategist
  const explanation = await getNarrativePlan(prompt, history, activeSlideIndex);

  // PHASE 2: Get HTML/Tailwind code from UI Architect
  const rawSlides = await generateUIArchitect(
    explanation, 
    mode, 
    existingSlides, 
    activeSlideIndex
  );

  // PHASE 3: Process each slide and generate images
  const processedSlides: SlideContent[] = [];

  for (const slide of rawSlides) {
    // Check if slide needs image generation
    const needsImages = slide.code.includes('{{IMG_');
    const assets: Record<string, string> = {};

    if (needsImages && slide.imagePrompts?.length > 0) {
      // Generate images in parallel for speed
      const imagePromises = slide.imagePrompts.map(async (imgReq) => {
        const base64 = await generateVisualAsset(imgReq.prompt);
        if (base64) {
          return { placeholder: imgReq.placeholder, url: base64 };
        }
        return null;
      });

      const results = await Promise.all(imagePromises);
      results.forEach(result => {
        if (result) assets[result.placeholder] = result.url;
      });
    }

    // PHASE 4: String replacement — swap placeholders with actual images
    let finalCode = slide.code;
    Object.entries(assets).forEach(([placeholder, url]) => {
      finalCode = finalCode.replaceAll(placeholder, url);
    });

    processedSlides.push({
      id: slide.id || crypto.randomUUID(),
      title: slide.title,
      code: finalCode,
      imageAssets: assets
    });
  }

  return { explanation, slides: processedSlides };
}
```

### C. Example Generated Output

The UI Architect produces HTML like this:

```html
<section class="relative w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-16">
  <div class="absolute inset-0 overflow-hidden">
    <img src="{{IMG_0}}" alt="Background" class="w-full h-full object-cover opacity-20" />
  </div>
  <div class="relative z-10 text-center max-w-4xl">
    <h1 class="text-7xl font-bold text-white mb-6 tracking-tight">
      Q4 Revenue Report
    </h1>
    <p class="text-2xl text-purple-200 font-light">
      Exceeding Expectations Across All Verticals
    </p>
    <div class="mt-12 flex justify-center gap-8">
      <div class="text-center">
        <div class="text-5xl font-bold text-emerald-400">$4.2M</div>
        <div class="text-gray-400 mt-2">Total Revenue</div>
      </div>
      <div class="text-center">
        <div class="text-5xl font-bold text-blue-400">+127%</div>
        <div class="text-gray-400 mt-2">YoY Growth</div>
      </div>
    </div>
  </div>
</section>
```

After image generation and placeholder replacement, `{{IMG_0}}` becomes:
```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
```

### D. Wiring to API Route

```typescript
// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateSlides } from '@/lib/ai/services/slideGenerator';

export async function POST(req: NextRequest) {
  const { prompt, mode, existingSlides, activeSlideIndex, history } = await req.json();

  try {
    const result = await generateSlides(
      prompt,
      mode,
      existingSlides,
      history,
      activeSlideIndex
    );

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

---

## 10. Security: Handling "Dangerous" HTML

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

## 11. Scaling for High Traffic (The "Million Slide" Strategy)

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

## 12. Next Steps for Implementation

### Priority 1: Core AI Integration

- [ ] Set up `lib/ai/providers/GLM.ts` with Google GLM SDK
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

## 13. Conclusion

The GLM Slide Agent is a journey from **Prompting** to **Orchestration**. By decoupling the Brain (Chat) from the Canvas (Slides), using a multi-agent pipeline, and planning for scale with hybrid storage and context windowing, you create a professional tool that grows with your user base.

**Current Status:** Frontend complete. Backend integration pending.
