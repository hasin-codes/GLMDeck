# GLM Slide Agent - Functional Integration Guide

> **Purpose**: Complete technical specification for integrating AI-powered slide generation with any LLM and image model.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Type System](#type-system)
3. [Core Integration Modules](#core-integration-modules)
4. [LLM Provider Abstraction](#llm-provider-abstraction)
5. [Image Generation Pipeline](#image-generation-pipeline)
6. [Multi-Agent Workflow](#multi-agent-workflow)
7. [API Routes](#api-routes)
8. [Frontend Integration](#frontend-integration)
9. [Error Handling & Resilience](#error-handling--resilience)
10. [Environment Configuration](#environment-configuration)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GLM SLIDE AGENT SYSTEM                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────┐     ┌──────────────────┐     ┌───────────────────────┐  │
│  │   ChatPanel   │────▶│  /api/generate   │────▶│   Agent Orchestrator  │  │
│  │  (User Input) │     │   (Next.js API)  │     │                       │  │
│  └───────────────┘     └──────────────────┘     └───────────┬───────────┘  │
│                                                              │              │
│                        ┌─────────────────────────────────────┼──────────┐   │
│                        │           AGENT PIPELINE            │          │   │
│                        │  ┌──────────────┐  ┌──────────────┐ │          │   │
│                        │  │  Narrative   │  │     UI       │ │          │   │
│                        │  │   Planner    │──│  Architect   │ │          │   │
│                        │  │  (fast LLM)  │  │  (pro LLM)   │ │          │   │
│                        │  └──────────────┘  └──────┬───────┘ │          │   │
│                        │                           │         │          │   │
│                        │                    ┌──────▼───────┐ │          │   │
│                        │                    │    Image     │ │          │   │
│                        │                    │  Generator   │ │          │   │
│                        │                    └──────────────┘ │          │   │
│                        └────────────────────────────────────────────────┘   │
│                                                              │              │
│  ┌───────────────┐     ┌──────────────────┐     ┌───────────▼───────────┐  │
│  │ SlidePreview  │◀────│   State Manager  │◀────│   Processed Slides    │  │
│  │ ThumbnailStrip│     │    (Context)     │     │   + Image Assets      │  │
│  └───────────────┘     └──────────────────┘     └───────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Input** → ChatPanel captures prompt
2. **API Route** → Validates and routes to agent orchestrator
3. **Narrative Planner** → Understands intent (edit/add/restructure)
4. **UI Architect** → Generates structured slide JSON with Tailwind HTML
5. **Image Generator** → Replaces `{{IMG_X}}` placeholders with base64
6. **Frontend** → Renders slides with smooth transitions

---

## Type System

Create `lib/types.ts`:

```typescript
/**
 * Agent operation modes - determines slide vs poster generation behavior
 */
export enum AgentMode {
  SLIDE = 'SLIDE',   // 16:9 presentation slides
  POSTER = 'POSTER'  // Portrait/square poster format
}

/**
 * Individual slide content structure
 * Contains both metadata and renderable HTML
 */
export interface SlideContent {
  id: string;
  title: string;
  code: string;  // Tailwind-infused HTML for the slide layout
  imageAssets: Record<string, string>;  // {{IMG_0}} → base64 data mapping
}

/**
 * Complete project state
 */
export interface Project {
  id: string;
  title: string;
  mode: AgentMode;
  slides: SlideContent[];
  history: Message[];
  createdAt: number;
  updatedAt?: number;
}

/**
 * Chat message for conversation history
 */
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isGenerating?: boolean;  // For streaming UI feedback
  metadata?: {
    tokensUsed?: number;
    model?: string;
    latencyMs?: number;
  };
}

/**
 * LLM generation request configuration
 */
export interface GenerationRequest {
  prompt: string;
  mode: AgentMode;
  existingSlides: SlideContent[];
  history: Message[];
  activeSlideIndex: number;
  options?: {
    temperature?: number;
    maxTokens?: number;
    streaming?: boolean;
  };
}

/**
 * LLM generation response
 */
export interface GenerationResponse {
  slides: SlideContent[];
  explanation: string;
  metadata: {
    plannerModel: string;
    architectModel: string;
    totalLatencyMs: number;
    imagesGenerated: number;
  };
}

/**
 * Image generation request for placeholder replacement
 */
export interface ImagePromptRequest {
  placeholder: string;  // e.g., "{{IMG_0}}"
  prompt: string;       // Detailed visual description
  aspectRatio?: '16:9' | '1:1' | '4:3' | '9:16';
}

/**
 * Quick start templates for onboarding
 */
export interface QuickStartExample {
  title: string;
  prompt: string;
  icon: string;
  category?: 'business' | 'creative' | 'education' | 'personal';
}
```

---

## Core Integration Modules

### Provider Interface

Create `lib/ai/provider.ts`:

```typescript
import { Message } from '../types';

/**
 * Abstract interface for LLM providers
 * Implement this for any LLM: OpenAI, Anthropic, Google, Mistral, local models, etc.
 */
export interface LLMProvider {
  name: string;
  
  /**
   * Generate text completion
   */
  generateText(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<string>;
  
  /**
   * Generate structured JSON output
   */
  generateJSON<T>(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    systemPrompt?: string;
    schema: JSONSchema;
    temperature?: number;
  }): Promise<T>;
  
  /**
   * Stream text completion (for real-time UI updates)
   */
  streamText(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    systemPrompt?: string;
    onChunk: (chunk: string) => void;
  }): Promise<void>;
}

/**
 * Abstract interface for Image Generation providers
 */
export interface ImageProvider {
  name: string;
  
  /**
   * Generate image from text prompt
   * @returns base64 encoded image data
   */
  generateImage(params: {
    prompt: string;
    aspectRatio?: string;
    style?: 'photorealistic' | 'illustration' | 'abstract';
    quality?: 'standard' | 'hd';
  }): Promise<string | undefined>;
}

/**
 * JSON Schema type for structured outputs
 */
export interface JSONSchema {
  type: string;
  properties?: Record<string, JSONSchema>;
  items?: JSONSchema;
  required?: string[];
  description?: string;
  enum?: string[];
}
```

---

## LLM Provider Abstraction

### OpenAI Implementation

Create `lib/ai/providers/openai.ts`:

```typescript
import OpenAI from 'openai';
import { LLMProvider, ImageProvider, JSONSchema } from '../provider';

export class OpenAIProvider implements LLMProvider, ImageProvider {
  name = 'openai';
  private client: OpenAI;
  
  constructor(apiKey?: string) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }
  
  async generateText(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<string> {
    const messages: OpenAI.ChatCompletionMessageParam[] = [];
    
    if (params.systemPrompt) {
      messages.push({ role: 'system', content: params.systemPrompt });
    }
    
    messages.push(...params.messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })));
    
    const response = await this.client.chat.completions.create({
      model: params.model || 'gpt-4o',
      messages,
      temperature: params.temperature ?? 0.7,
      max_tokens: params.maxTokens ?? 4096,
    });
    
    return response.choices[0]?.message?.content || '';
  }
  
  async generateJSON<T>(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    systemPrompt?: string;
    schema: JSONSchema;
    temperature?: number;
  }): Promise<T> {
    const messages: OpenAI.ChatCompletionMessageParam[] = [];
    
    if (params.systemPrompt) {
      messages.push({ role: 'system', content: params.systemPrompt });
    }
    
    messages.push(...params.messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })));
    
    const response = await this.client.chat.completions.create({
      model: params.model || 'gpt-4o',
      messages,
      temperature: params.temperature ?? 0.3,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'slide_response',
          schema: params.schema,
          strict: true,
        },
      },
    });
    
    const content = response.choices[0]?.message?.content || '{}';
    return JSON.parse(content) as T;
  }
  
  async streamText(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    systemPrompt?: string;
    onChunk: (chunk: string) => void;
  }): Promise<void> {
    const messages: OpenAI.ChatCompletionMessageParam[] = [];
    
    if (params.systemPrompt) {
      messages.push({ role: 'system', content: params.systemPrompt });
    }
    
    messages.push(...params.messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })));
    
    const stream = await this.client.chat.completions.create({
      model: params.model || 'gpt-4o',
      messages,
      stream: true,
    });
    
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) params.onChunk(delta);
    }
  }
  
  async generateImage(params: {
    prompt: string;
    aspectRatio?: string;
    style?: 'photorealistic' | 'illustration' | 'abstract';
    quality?: 'standard' | 'hd';
  }): Promise<string | undefined> {
    try {
      // Map aspect ratio to DALL-E sizes
      const sizeMap: Record<string, '1024x1024' | '1792x1024' | '1024x1792'> = {
        '16:9': '1792x1024',
        '1:1': '1024x1024',
        '9:16': '1024x1792',
      };
      
      const response = await this.client.images.generate({
        model: 'dall-e-3',
        prompt: `${params.prompt}. Style: ${params.style || 'photorealistic'}, professional quality.`,
        n: 1,
        size: sizeMap[params.aspectRatio || '16:9'] || '1792x1024',
        quality: params.quality === 'hd' ? 'hd' : 'standard',
        response_format: 'b64_json',
      });
      
      const data = response.data[0]?.b64_json;
      return data ? `data:image/png;base64,${data}` : undefined;
    } catch (err: any) {
      console.warn('OpenAI image generation failed:', err?.message);
      return undefined;
    }
  }
}
```

### Anthropic Implementation

Create `lib/ai/providers/anthropic.ts`:

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { LLMProvider, JSONSchema } from '../provider';

export class AnthropicProvider implements LLMProvider {
  name = 'anthropic';
  private client: Anthropic;
  
  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });
  }
  
  async generateText(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<string> {
    const response = await this.client.messages.create({
      model: params.model || 'claude-sonnet-4-20250514',
      max_tokens: params.maxTokens || 4096,
      system: params.systemPrompt,
      messages: params.messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    });
    
    return response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : '';
  }
  
  async generateJSON<T>(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    systemPrompt?: string;
    schema: JSONSchema;
    temperature?: number;
  }): Promise<T> {
    const schemaInstruction = `
Respond ONLY with valid JSON matching this exact schema:
${JSON.stringify(params.schema, null, 2)}

Do not include any text before or after the JSON.`;

    const response = await this.client.messages.create({
      model: params.model || 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      system: `${params.systemPrompt}\n\n${schemaInstruction}`,
      messages: params.messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    });
    
    const text = response.content[0]?.type === 'text' 
      ? response.content[0].text 
      : '{}';
    
    // Extract JSON from potential markdown code blocks
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text];
    return JSON.parse(jsonMatch[1]?.trim() || '{}') as T;
  }
  
  async streamText(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    systemPrompt?: string;
    onChunk: (chunk: string) => void;
  }): Promise<void> {
    const stream = await this.client.messages.stream({
      model: params.model || 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: params.systemPrompt,
      messages: params.messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    });
    
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        params.onChunk(event.delta.text);
      }
    }
  }
}
```

### Google Gemini Implementation

Create `lib/ai/providers/gemini.ts`:

```typescript
import { GoogleGenAI, Type } from '@google/genai';
import { LLMProvider, ImageProvider, JSONSchema } from '../provider';

export class GeminiProvider implements LLMProvider, ImageProvider {
  name = 'gemini';
  private client: GoogleGenAI;
  
  constructor(apiKey?: string) {
    this.client = new GoogleGenAI({
      apiKey: apiKey || process.env.GOOGLE_API_KEY,
    });
  }
  
  private convertToGeminiSchema(schema: JSONSchema): any {
    const typeMap: Record<string, any> = {
      string: Type.STRING,
      number: Type.NUMBER,
      boolean: Type.BOOLEAN,
      object: Type.OBJECT,
      array: Type.ARRAY,
    };
    
    const result: any = {
      type: typeMap[schema.type] || Type.STRING,
    };
    
    if (schema.description) result.description = schema.description;
    if (schema.enum) result.enum = schema.enum;
    if (schema.required) result.required = schema.required;
    
    if (schema.properties) {
      result.properties = {};
      for (const [key, value] of Object.entries(schema.properties)) {
        result.properties[key] = this.convertToGeminiSchema(value);
      }
    }
    
    if (schema.items) {
      result.items = this.convertToGeminiSchema(schema.items);
    }
    
    return result;
  }
  
  async generateText(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<string> {
    const contents = params.messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    
    const response = await this.client.models.generateContent({
      model: params.model || 'gemini-2.5-flash-preview-05-20',
      contents,
      config: {
        systemInstruction: params.systemPrompt,
        temperature: params.temperature,
        maxOutputTokens: params.maxTokens,
      },
    });
    
    return response.text || '';
  }
  
  async generateJSON<T>(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    systemPrompt?: string;
    schema: JSONSchema;
    temperature?: number;
  }): Promise<T> {
    const contents = params.messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    
    const response = await this.client.models.generateContent({
      model: params.model || 'gemini-2.5-pro-preview',
      contents,
      config: {
        systemInstruction: params.systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: this.convertToGeminiSchema(params.schema),
        temperature: params.temperature ?? 0.3,
      },
    });
    
    return JSON.parse(response.text || '{}') as T;
  }
  
  async streamText(params: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    systemPrompt?: string;
    onChunk: (chunk: string) => void;
  }): Promise<void> {
    const contents = params.messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
    
    const stream = await this.client.models.generateContentStream({
      model: params.model || 'gemini-2.5-flash-preview-05-20',
      contents,
      config: { systemInstruction: params.systemPrompt },
    });
    
    for await (const chunk of stream) {
      params.onChunk(chunk.text || '');
    }
  }
  
  async generateImage(params: {
    prompt: string;
    aspectRatio?: string;
  }): Promise<string | undefined> {
    try {
      const response = await this.client.models.generateContent({
        model: 'gemini-2.0-flash-exp-image-generation',
        contents: {
          parts: [{ text: `${params.prompt}. High-end professional photography.` }],
        },
        config: {
          responseModalities: ['IMAGE', 'TEXT'],
          imageConfig: { aspectRatio: params.aspectRatio || '16:9' },
        },
      });
      
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    } catch (err: any) {
      console.warn('Gemini image generation failed:', err?.message);
    }
    return undefined;
  }
}
```

---

## Multi-Agent Workflow

Create `lib/ai/agents/slideGenerator.ts`:

```typescript
import { LLMProvider, ImageProvider } from '../provider';
import { 
  SlideContent, 
  AgentMode, 
  Message, 
  GenerationRequest, 
  GenerationResponse,
  ImagePromptRequest 
} from '../../types';

/**
 * Slide generation response schema for structured output
 */
const SLIDE_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    slides: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique slide identifier' },
          title: { type: 'string', description: 'Slide title' },
          code: { 
            type: 'string', 
            description: 'Raw HTML with Tailwind classes. Use {{IMG_0}}, {{IMG_1}} as image placeholders.' 
          },
          imagePrompts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                placeholder: { type: 'string' },
                prompt: { type: 'string', description: 'Detailed visual description for image generation' },
              },
              required: ['placeholder', 'prompt'],
            },
          },
        },
        required: ['id', 'title', 'code', 'imagePrompts'],
      },
    },
  },
  required: ['slides'],
};

/**
 * Multi-agent slide generation orchestrator
 */
export class SlideGenerator {
  private llm: LLMProvider;
  private imageGen: ImageProvider;
  
  // Model configuration - customize per provider
  private plannerModel: string;
  private architectModel: string;
  
  constructor(
    llmProvider: LLMProvider,
    imageProvider: ImageProvider,
    config?: {
      plannerModel?: string;
      architectModel?: string;
    }
  ) {
    this.llm = llmProvider;
    this.imageGen = imageProvider;
    this.plannerModel = config?.plannerModel || 'default';
    this.architectModel = config?.architectModel || 'default';
  }
  
  /**
   * Format conversation history for LLM consumption
   */
  private formatHistory(history: Message[]): Array<{ role: string; content: string }> {
    return history
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role,
        content: msg.content,
      }));
  }
  
  /**
   * AGENT 1: Narrative Planner
   * Understands user intent and creates a high-level plan
   */
  private async getNarrativePlan(
    prompt: string,
    history: Message[],
    activeSlideIndex: number,
    existingSlides: SlideContent[]
  ): Promise<string> {
    const systemPrompt = `You are a master of storytelling and design strategy for presentations.

CONTEXT:
- The user is currently viewing Slide ${activeSlideIndex + 1} of ${existingSlides.length || 'a new deck'}
- Current slide titles: ${existingSlides.map((s, i) => `[${i + 1}] ${s.title}`).join(', ') || 'None yet'}

YOUR TASK:
1. Analyze the user's request
2. Determine the operation type:
   - EDIT: Modify the current slide (index ${activeSlideIndex})
   - ADD: Insert new slide(s) at a specific position
   - RESTRUCTURE: Reorganize or regenerate multiple slides
   - DELETE: Remove specific slides
3. Provide a clear, concise plan explaining:
   - What changes will be made
   - Why this approach serves the user's goals
   - Any creative suggestions to enhance the presentation

Be conversational and helpful. Keep explanations under 100 words.`;

    const formattedHistory = this.formatHistory(history);
    
    return this.llm.generateText({
      model: this.plannerModel,
      messages: [...formattedHistory, { role: 'user', content: prompt }],
      systemPrompt,
      temperature: 0.7,
    });
  }
  
  /**
   * AGENT 2: UI Architect
   * Generates structured slide content with Tailwind HTML
   */
  private async generateSlideStructure(
    plan: string,
    mode: AgentMode,
    existingSlides: SlideContent[],
    activeSlideIndex: number
  ): Promise<Array<SlideContent & { imagePrompts: ImagePromptRequest[] }>> {
    const aspectRatio = mode === AgentMode.SLIDE ? '16:9' : '9:16';
    
    const systemPrompt = `You are a world-class UI Architect specializing in presentation design.

CRITICAL RULES:
1. Generate ONLY valid Tailwind CSS classes (no custom CSS)
2. Use ${aspectRatio} aspect ratio layouts
3. Image placeholders: Use {{IMG_0}}, {{IMG_1}}, etc. for dynamic images
4. Preserve existing slide IDs when editing (don't change IDs)
5. Generate unique IDs for new slides (format: slide_<random>)

DESIGN PRINCIPLES:
- Clean, modern, professional aesthetics
- High contrast for readability
- Consistent typography hierarchy
- Strategic use of whitespace
- Visual balance and alignment

SLIDE TYPES TO USE:
- metrics: KPI dashboards with hero numbers
- bullets: Key points with visual hierarchy  
- chart: Data visualization placeholder
- title: Section headers and closings
- comparison: Side-by-side analysis
- quote: Testimonials and callouts
- image: Full-bleed visual slides

For each image placeholder, provide a detailed prompt for generation.`;

    const userContent = `
PLAN: ${plan}
ACTIVE_SLIDE_INDEX: ${activeSlideIndex}
EXISTING_SLIDES: ${JSON.stringify(existingSlides, null, 2)}

Based on this plan, generate the updated slides array.`;

    const result = await this.llm.generateJSON<{
      slides: Array<SlideContent & { imagePrompts: ImagePromptRequest[] }>;
    }>({
      model: this.architectModel,
      messages: [{ role: 'user', content: userContent }],
      systemPrompt,
      schema: SLIDE_RESPONSE_SCHEMA,
      temperature: 0.3,
    });
    
    return result.slides;
  }
  
  /**
   * AGENT 3: Image Generator
   * Converts text prompts to visual assets
   */
  private async generateImage(prompt: string): Promise<string | undefined> {
    return this.imageGen.generateImage({
      prompt,
      aspectRatio: '16:9',
      style: 'photorealistic',
      quality: 'hd',
    });
  }
  
  /**
   * Main generation pipeline
   */
  async generate(request: GenerationRequest): Promise<GenerationResponse> {
    const startTime = Date.now();
    let imagesGenerated = 0;
    
    // Step 1: Get narrative plan
    const explanation = await this.getNarrativePlan(
      request.prompt,
      request.history,
      request.activeSlideIndex,
      request.existingSlides
    );
    
    // Step 2: Generate slide structure
    const rawSlides = await this.generateSlideStructure(
      explanation,
      request.mode,
      request.existingSlides,
      request.activeSlideIndex
    );
    
    // Step 3: Process slides and generate images
    const processedSlides: SlideContent[] = [];
    
    for (const slide of rawSlides) {
      const needsImages = slide.code.includes('{{IMG_');
      const assets: Record<string, string> = {};
      
      if (needsImages && slide.imagePrompts?.length) {
        // Generate images in parallel for speed
        const imagePromises = slide.imagePrompts.map(async (req) => {
          const base64 = await this.generateImage(req.prompt);
          if (base64) {
            assets[req.placeholder] = base64;
            imagesGenerated++;
          }
        });
        
        await Promise.all(imagePromises);
      }
      
      // Replace placeholders with generated images
      let finalCode = slide.code;
      for (const [placeholder, dataUrl] of Object.entries(assets)) {
        finalCode = finalCode.replaceAll(placeholder, dataUrl);
      }
      
      processedSlides.push({
        id: slide.id || `slide_${Math.random().toString(36).substr(2, 9)}`,
        title: slide.title,
        code: finalCode,
        imageAssets: assets,
      });
    }
    
    return {
      slides: processedSlides,
      explanation,
      metadata: {
        plannerModel: this.plannerModel,
        architectModel: this.architectModel,
        totalLatencyMs: Date.now() - startTime,
        imagesGenerated,
      },
    };
  }
}
```

---

## API Routes

Create `app/api/generate/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { SlideGenerator } from '@/lib/ai/agents/slideGenerator';
import { OpenAIProvider } from '@/lib/ai/providers/openai';
import { AnthropicProvider } from '@/lib/ai/providers/anthropic';
import { GeminiProvider } from '@/lib/ai/providers/gemini';
import { GenerationRequest } from '@/lib/types';

// Initialize providers based on environment
function getProviders() {
  const llmProvider = process.env.LLM_PROVIDER || 'openai';
  const imageProvider = process.env.IMAGE_PROVIDER || 'openai';
  
  const providers = {
    openai: () => new OpenAIProvider(),
    anthropic: () => new AnthropicProvider(),
    gemini: () => new GeminiProvider(),
  };
  
  const llm = providers[llmProvider as keyof typeof providers]?.() 
    || providers.openai();
  
  const imageGen = providers[imageProvider as keyof typeof providers]?.() 
    || providers.openai();
  
  return { llm, imageGen };
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json();
    
    // Validate required fields
    if (!body.prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    const { llm, imageGen } = getProviders();
    
    const generator = new SlideGenerator(llm, imageGen, {
      plannerModel: process.env.PLANNER_MODEL,
      architectModel: process.env.ARCHITECT_MODEL,
    });
    
    const result = await generator.generate({
      prompt: body.prompt,
      mode: body.mode || 'SLIDE',
      existingSlides: body.existingSlides || [],
      history: body.history || [],
      activeSlideIndex: body.activeSlideIndex || 0,
      options: body.options,
    });
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Generation failed:', error);
    return NextResponse.json(
      { error: error.message || 'Generation failed' },
      { status: 500 }
    );
  }
}
```

### Streaming API Route

Create `app/api/generate/stream/route.ts`:

```typescript
import { NextRequest } from 'next/server';
import { OpenAIProvider } from '@/lib/ai/providers/openai';

export async function POST(request: NextRequest) {
  const { prompt, history, systemPrompt } = await request.json();
  
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const provider = new OpenAIProvider();
      
      await provider.streamText({
        model: process.env.PLANNER_MODEL || 'gpt-4o',
        messages: [...history, { role: 'user', content: prompt }],
        systemPrompt,
        onChunk: (chunk) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
        },
      });
      
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

---

## Frontend Integration

### Generation Hook

Create `lib/hooks/useSlideGeneration.ts`:

```typescript
import { useState, useCallback } from 'react';
import { SlideContent, Message, AgentMode, GenerationResponse } from '../types';

interface UseSlideGenerationOptions {
  onExplanation?: (text: string) => void;
  onSlideGenerated?: (slide: SlideContent) => void;
  onComplete?: (response: GenerationResponse) => void;
  onError?: (error: Error) => void;
}

export function useSlideGeneration(options: UseSlideGenerationOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [explanation, setExplanation] = useState('');
  
  const generate = useCallback(async (
    prompt: string,
    mode: AgentMode,
    existingSlides: SlideContent[],
    history: Message[],
    activeSlideIndex: number
  ) => {
    setIsGenerating(true);
    setProgress(0);
    setExplanation('');
    
    try {
      // Phase 1: Planning (stream explanation)
      setProgress(10);
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          mode,
          existingSlides,
          history,
          activeSlideIndex,
        }),
      });
      
      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      const result: GenerationResponse = await response.json();
      
      setExplanation(result.explanation);
      options.onExplanation?.(result.explanation);
      
      // Phase 2: Slide generation
      setProgress(50);
      
      for (const slide of result.slides) {
        options.onSlideGenerated?.(slide);
        setProgress(prev => Math.min(prev + (40 / result.slides.length), 90));
      }
      
      setProgress(100);
      options.onComplete?.(result);
      
      return result;
      
    } catch (error: any) {
      options.onError?.(error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [options]);
  
  return {
    generate,
    isGenerating,
    progress,
    explanation,
  };
}
```

### Updated Page Component

Update `app/p/[id]/page.tsx` integration:

```typescript
"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { TopBar } from "@/components/workspace/TopBar";
import { ChatPanel } from "@/components/workspace/ChatPanel";
import { SlidePreview } from "@/components/workspace/SlidePreview";
import { ThumbnailStrip } from "@/components/workspace/ThumbnailStrip";
import { useSlideGeneration } from "@/lib/hooks/useSlideGeneration";
import { SlideContent, Message, AgentMode } from "@/lib/types";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params?.id as string;

  const [slides, setSlides] = React.useState<SlideContent[]>([]);
  const [messages, setMessages] = React.useState<Message[]>([
    { 
      role: "assistant", 
      content: "I'm your slide design assistant. Describe what you'd like to create!",
      timestamp: Date.now()
    },
  ]);
  const [input, setInput] = React.useState("");
  const [currentSlideIndex, setCurrentSlideIndex] = React.useState(0);

  const { generate, isGenerating, explanation } = useSlideGeneration({
    onExplanation: (text) => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: text,
        timestamp: Date.now(),
      }]);
    },
    onComplete: (response) => {
      setSlides(response.slides);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Done! Generated ${response.slides.length} slides in ${(response.metadata.totalLatencyMs / 1000).toFixed(1)}s.`,
        timestamp: Date.now(),
      }]);
    },
    onError: (error) => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Error: ${error.message}. Please try again.`,
        timestamp: Date.now(),
      }]);
    },
  });

  const handleSendMessage = async () => {
    if (!input.trim() || isGenerating) return;
    
    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    await generate(
      userMessage.content,
      AgentMode.SLIDE,
      slides,
      messages,
      currentSlideIndex
    );
  };

  const currentSlide = slides[currentSlideIndex];
  const totalSlides = slides.length;

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <TopBar projectId={projectId} />

      <div className="flex-1 flex overflow-hidden">
        <ChatPanel
          messages={messages}
          input={input}
          setInput={setInput}
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating}
        />

        <div className="flex-1 bg-black relative flex flex-col">
          <SlidePreview
            currentSlide={currentSlide}
            currentSlideIndex={currentSlideIndex}
            totalSlides={totalSlides}
            onNext={() => setCurrentSlideIndex(i => Math.min(i + 1, totalSlides - 1))}
            onPrev={() => setCurrentSlideIndex(i => Math.max(i - 1, 0))}
            isLoading={isGenerating && slides.length === 0}
          />

          <ThumbnailStrip
            slides={slides}
            currentSlideIndex={currentSlideIndex}
            onSelectSlide={setCurrentSlideIndex}
          />
        </div>
      </div>
    </div>
  );
}
```

---

## Error Handling & Resilience

Create `lib/ai/utils/retry.ts`:

```typescript
interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelayMs = 1000,
    maxDelayMs = 10000,
    backoffMultiplier = 2,
    retryableErrors = ['RATE_LIMIT', 'TIMEOUT', 'NETWORK'],
  } = options;
  
  let lastError: Error | undefined;
  let delay = initialDelayMs;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      const isRetryable = retryableErrors.some(code => 
        error.message?.includes(code) || error.code === code
      );
      
      if (!isRetryable || attempt === maxAttempts) {
        throw error;
      }
      
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * backoffMultiplier, maxDelayMs);
    }
  }
  
  throw lastError;
}

/**
 * Rate limiter for API calls
 */
export class RateLimiter {
  private queue: Array<() => void> = [];
  private processing = false;
  private lastCall = 0;
  
  constructor(private minIntervalMs: number = 100) {}
  
  async acquire(): Promise<void> {
    return new Promise(resolve => {
      this.queue.push(resolve);
      this.process();
    });
  }
  
  private async process() {
    if (this.processing) return;
    this.processing = true;
    
    while (this.queue.length > 0) {
      const now = Date.now();
      const elapsed = now - this.lastCall;
      
      if (elapsed < this.minIntervalMs) {
        await new Promise(r => setTimeout(r, this.minIntervalMs - elapsed));
      }
      
      this.lastCall = Date.now();
      const next = this.queue.shift();
      next?.();
    }
    
    this.processing = false;
  }
}
```

---

## Environment Configuration

Create `.env.example`:

```bash
# ===========================================
# GLM Slide Agent - Environment Configuration
# ===========================================

# LLM Provider Selection
# Options: openai, anthropic, gemini
LLM_PROVIDER=openai
IMAGE_PROVIDER=openai

# OpenAI Configuration
OPENAI_API_KEY=sk-...
OPENAI_ORG_ID=org-...  # Optional

# Anthropic Configuration  
ANTHROPIC_API_KEY=sk-ant-...

# Google Gemini Configuration
GOOGLE_API_KEY=AIza...

# Model Configuration
# Override default models per agent
PLANNER_MODEL=gpt-4o-mini        # Fast model for planning
ARCHITECT_MODEL=gpt-4o           # Pro model for structured output

# For Anthropic:
# PLANNER_MODEL=claude-3-5-haiku-20241022
# ARCHITECT_MODEL=claude-sonnet-4-20250514

# For Gemini:
# PLANNER_MODEL=gemini-2.5-flash-preview-05-20
# ARCHITECT_MODEL=gemini-2.5-pro-preview

# Rate Limiting
API_RATE_LIMIT_MS=100            # Minimum ms between API calls
MAX_RETRIES=3                    # Max retry attempts on failure

# Image Generation
IMAGE_ENABLED=true               # Enable/disable image generation
IMAGE_QUALITY=hd                 # 'standard' or 'hd'
IMAGE_STYLE=photorealistic       # 'photorealistic', 'illustration', 'abstract'

# Development
NODE_ENV=development
LOG_LEVEL=debug
```

---

## File Structure Summary

```
lib/
├── types.ts                    # Core type definitions
├── ai/
│   ├── provider.ts             # Abstract provider interfaces
│   ├── providers/
│   │   ├── openai.ts           # OpenAI implementation
│   │   ├── anthropic.ts        # Anthropic implementation
│   │   └── gemini.ts           # Google Gemini implementation
│   ├── agents/
│   │   └── slideGenerator.ts   # Multi-agent orchestrator
│   └── utils/
│       └── retry.ts            # Retry and rate limiting utilities
└── hooks/
    └── useSlideGeneration.ts   # React hook for frontend integration

app/
└── api/
    └── generate/
        ├── route.ts            # Main generation endpoint
        └── stream/
            └── route.ts        # Streaming endpoint
```

---

## Quick Start Checklist

1. **Install dependencies**:
   ```bash
   npm install openai @anthropic-ai/sdk @google/genai
   ```

2. **Copy environment template**:
   ```bash
   cp .env.example .env.local
   ```

3. **Add your API keys** to `.env.local`

4. **Create the file structure** as outlined above

5. **Update your page component** to use the generation hook

6. **Test the integration**:
   ```bash
   npm run dev
   ```

---

## Provider Comparison

| Feature | OpenAI | Anthropic | Gemini |
|---------|--------|-----------|--------|
| Structured Output | Native JSON Schema | Prompt-based | Native Schema |
| Streaming | ✅ SSE | ✅ SSE | ✅ SSE |
| Image Generation | DALL-E 3 | ❌ (use OpenAI) | Imagen 3 |
| Best For | Balanced | Reasoning | Multimodal |
| Cost | $$ | $$$ | $ |

---

> **Next Steps**: This document provides the complete integration specification. Implement incrementally, starting with a single provider, then expand to multi-provider support.
