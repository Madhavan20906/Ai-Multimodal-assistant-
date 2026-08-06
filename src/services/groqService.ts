import { RepresentationType, DomainCategory } from '../types';

export interface GroqClassification {
  representationType: RepresentationType;
  domain: DomainCategory;
}

export interface GroqKnowledgeResponse {
  title: string;
  subtitle: string;
  summaryText: string;
  voiceNarrationText: string;
  keyPoints: string[];
  domain: DomainCategory;
}

/**
 * Thin client that calls the /api/groq Vite proxy.
 * The actual Groq API key lives server-side only — never in the browser bundle.
 */
export class GroqService {
  private static readonly ENDPOINT = '/api/groq';
  private static readonly MODEL = 'llama-3.3-70b-versatile';

  private static async chat(
    messages: { role: string; content: string }[],
    maxTokens = 800,
  ): Promise<string> {
    const resp = await fetch(GroqService.ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: GroqService.MODEL,
        messages,
        temperature: 0.3,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
      }),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(`Groq ${resp.status}: ${(err as any)?.error ?? resp.statusText}`);
    }

    const data = await resp.json();
    return data.choices?.[0]?.message?.content ?? '{}';
  }

  /**
   * Ask Groq which visualization type best matches the user's input.
   */
  static async classify(input: string): Promise<GroqClassification> {
    const raw = await GroqService.chat([
      {
        role: 'system',
        content: `You are a query classifier for AURA Workbench, an AI visual learning tool.
Map the user's query to exactly one representationType and one domain.

representationType options (choose the best fit):
- "3d_scene"            → physical objects: car, bottle, building, solar system, planets, architecture
- "chemistry_lab"       → chemical reactions, acids, bases, molecules, compounds, periodic table
- "math_derivation"     → equations, algebra, calculus, geometry, trigonometry, proofs, integrals
- "algorithm_visualizer"→ sorting, searching, data structures, graph algorithms, big-O
- "code_workbench"      → code, programming, debugging, functions, recursion, any language
- "physics_simulation"  → pendulum, gravity, projectile, spring, waves, collision, optics
- "interactive_diagram" → neural networks, blockchain, biology cells, timelines, network topology, flowcharts
- "rich_knowledge"      → everything else: facts, definitions, explanations, history, concepts, general Q&A

domain options: Mathematics | Algorithms | Programming | Physics | Chemistry | Biology | Networking | Machine Learning | Geography | History | Architecture | General

Return ONLY valid JSON: {"representationType":"...","domain":"..."}`,
      },
      { role: 'user', content: input },
    ], 120);

    const parsed = JSON.parse(raw) as GroqClassification;
    return parsed;
  }

  /**
   * Generate a real AI answer for general knowledge queries.
   */
  static async generateKnowledge(input: string): Promise<GroqKnowledgeResponse> {
    const raw = await GroqService.chat([
      {
        role: 'system',
        content: `You are AURA, an intelligent visual AI workbench assistant. Answer the user's question clearly and engagingly.
Return ONLY valid JSON with these exact keys:
{
  "title": "Concise descriptive title (5-8 words)",
  "subtitle": "One-line category or context",
  "summaryText": "2-3 sentences that directly answer the question. Be accurate and informative.",
  "voiceNarrationText": "A natural, conversational 1-2 sentence spoken answer.",
  "keyPoints": ["Key insight 1", "Key insight 2", "Key insight 3"],
  "domain": "one of: Mathematics|Algorithms|Programming|Physics|Chemistry|Biology|Networking|Machine Learning|Geography|History|Architecture|General"
}`,
      },
      { role: 'user', content: input },
    ], 600);

    return JSON.parse(raw) as GroqKnowledgeResponse;
  }
}
