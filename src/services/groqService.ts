import { RepresentationType, DomainCategory, RepresentationPayload } from '../types';

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
        temperature: 0.4,
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

  // ─── Classification ────────────────────────────────────────────────────────

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

    return JSON.parse(raw) as GroqClassification;
  }

  // ─── 3D Scene generator ────────────────────────────────────────────────────

  /**
   * Map any physical-object description to a 3D scene payload.
   * Available renderers: car, building, water_bottle, solar_system (+ generic sphere).
   */
  static async generate3DScene(input: string): Promise<RepresentationPayload> {
    const raw = await GroqService.chat([
      {
        role: 'system',
        content: `You generate 3D scene data for AURA Workbench based on user descriptions.

Available primaryObject values (pick the closest match):
- "car"          → any vehicle: sports car, truck, racing car, motorcycle-like, etc.
- "building"     → any structure: house, skyscraper, tower, castle, bridge
- "water_bottle" → any container or liquid object: bottle, flask, cup, jar
- "solar_system" → space scenes: planets, stars, galaxies, orbits

For color, output a valid CSS hex color matching the description (e.g. "red car" → "#ef4444", "blue car" → "#3b82f6", "golden" → "#f59e0b"). Default to "#06b6d4" if no color mentioned.

environment options: "studio" (car/objects), "blueprint" (buildings), "lab" (bottles/chemistry), "space" (space), "grid" (default)

Return ONLY valid JSON:
{
  "primaryObject": "car"|"building"|"water_bottle"|"solar_system",
  "environment": "studio"|"blueprint"|"lab"|"space"|"grid",
  "color": "#hexcolor",
  "size": 1.0,
  "floors": 10,
  "objectName": "Descriptive name of the specific object",
  "title": "Scene title (5-8 words)",
  "subtitle": "One-line description of the scene",
  "summaryText": "2 sentences describing what the user sees and can do with it.",
  "voiceNarrationText": "Natural 1-2 sentence spoken description of the scene."
}`,
      },
      { role: 'user', content: input },
    ], 400);

    const d = JSON.parse(raw);
    return {
      type: '3d_scene',
      domain: 'Architecture',
      title: d.title ?? `3D ${d.objectName ?? 'Scene'}`,
      subtitle: d.subtitle ?? d.objectName,
      summaryText: d.summaryText,
      voiceNarrationText: d.voiceNarrationText,
      threeDData: {
        primaryObject: d.primaryObject ?? 'car',
        environment: d.environment ?? 'studio',
        objects: [
          {
            id: `${d.primaryObject ?? 'obj'}_1`,
            name: d.objectName ?? d.title,
            type: d.primaryObject ?? 'car',
            properties: {
              color: d.color ?? '#06b6d4',
              size: d.size ?? 1.0,
              ...(d.primaryObject === 'building' ? { floors: d.floors ?? 10 } : {}),
            },
          },
        ],
      },
    };
  }

  // ─── Chemistry generator ───────────────────────────────────────────────────

  static async generateChemistry(input: string): Promise<RepresentationPayload> {
    const raw = await GroqService.chat([
      {
        role: 'system',
        content: `You generate chemistry lab data for AURA Workbench.
Given a user's description of a chemical reaction or concept, produce accurate chemistry data.

For color, pick a visually distinct CSS hex color that reflects the chemical (e.g. sulfuric acid → "#facc15", copper sulfate → "#06b6d4", blood/iron → "#ef4444").

Return ONLY valid JSON:
{
  "title": "Experiment title",
  "subtitle": "Reaction type label",
  "summaryText": "2 sentences describing the reaction and its significance.",
  "voiceNarrationText": "Natural 1-2 sentence spoken intro to the experiment.",
  "reactants": [
    {"formula": "HCl", "name": "Hydrochloric Acid", "color": "#ef4444"},
    {"formula": "NaOH", "name": "Sodium Hydroxide", "color": "#3b82f6"}
  ],
  "products": [
    {"formula": "NaCl", "name": "Sodium Chloride", "color": "#10b981"},
    {"formula": "H₂O", "name": "Water", "color": "#60a5fa"}
  ],
  "balancedEquation": "HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)",
  "observations": ["Observation 1", "Observation 2", "Observation 3"],
  "reactionType": "Acid-Base Neutralization",
  "temperatureChange": "+14.2°C"
}`,
      },
      { role: 'user', content: input },
    ], 700);

    const d = JSON.parse(raw);
    return {
      type: 'chemistry_lab',
      domain: 'Chemistry',
      title: d.title,
      subtitle: d.subtitle,
      summaryText: d.summaryText,
      voiceNarrationText: d.voiceNarrationText,
      chemData: {
        reactants: d.reactants,
        products: d.products,
        balancedEquation: d.balancedEquation,
        observations: d.observations,
        reactionType: d.reactionType,
        isAnimated: false,
        temperatureChange: d.temperatureChange,
      },
    };
  }

  // ─── Math generator ────────────────────────────────────────────────────────

  static async generateMath(input: string): Promise<RepresentationPayload> {
    const raw = await GroqService.chat([
      {
        role: 'system',
        content: `You generate step-by-step math derivations for AURA Workbench using LaTeX.
Solve or explain whatever mathematical problem the user describes. Use accurate LaTeX notation.

For graphExpression, output a JavaScript math expression evaluatable with x as variable (e.g. "x*x - 5*x + 6").

Return ONLY valid JSON:
{
  "title": "Math problem title",
  "subtitle": "Topic label (e.g. Quadratic Equations)",
  "summaryText": "2 sentences describing the problem and solution approach.",
  "voiceNarrationText": "Natural 1-2 sentence spoken summary of the solution.",
  "equation": "the main equation as plain text",
  "graphExpression": "js expression with x, e.g. x*x - 5*x + 6",
  "steps": [
    {"label": "1. Step Name", "latex": "LaTeX expression", "explanation": "Plain English explanation"},
    {"label": "2. Step Name", "latex": "LaTeX expression", "explanation": "Plain English explanation"},
    {"label": "3. Step Name", "latex": "LaTeX expression", "explanation": "Plain English explanation"},
    {"label": "4. Final Answer", "latex": "LaTeX expression", "explanation": "Plain English explanation"}
  ]
}`,
      },
      { role: 'user', content: input },
    ], 900);

    const d = JSON.parse(raw);
    return {
      type: 'math_derivation',
      domain: 'Mathematics',
      title: d.title,
      subtitle: d.subtitle,
      summaryText: d.summaryText,
      voiceNarrationText: d.voiceNarrationText,
      mathData: {
        equation: d.equation,
        graphExpression: d.graphExpression,
        steps: d.steps,
      },
    };
  }

  // ─── Code generator ────────────────────────────────────────────────────────

  static async generateCode(input: string): Promise<RepresentationPayload> {
    const raw = await GroqService.chat([
      {
        role: 'system',
        content: `You generate working code for AURA Workbench based on user requests.
Write clean, correct, well-commented code. Pick the most appropriate language unless specified.

Return ONLY valid JSON:
{
  "title": "Code title (e.g. Bubble Sort in Python)",
  "subtitle": "Language and pattern label",
  "summaryText": "2 sentences describing what the code does and how it works.",
  "voiceNarrationText": "Natural 1-2 sentence spoken summary of the code.",
  "language": "python|javascript|typescript|java|cpp|rust|go",
  "code": "the full working code as a string with newlines as \\n",
  "explanation": "One paragraph technical explanation of the approach.",
  "callStack": ["functionName(args)", "..."],
  "variables": [
    {"name": "varName", "value": "value", "type": "type"}
  ],
  "executionSteps": [
    {"line": 1, "variablesState": {"var": "val"}, "log": "What happens here"}
  ]
}`,
      },
      { role: 'user', content: input },
    ], 1200);

    const d = JSON.parse(raw);
    return {
      type: 'code_workbench',
      domain: 'Programming',
      title: d.title,
      subtitle: d.subtitle,
      summaryText: d.summaryText,
      voiceNarrationText: d.voiceNarrationText,
      codeData: {
        language: d.language,
        code: d.code,
        explanation: d.explanation,
        callStack: d.callStack ?? [],
        variables: d.variables ?? [],
        executionSteps: d.executionSteps ?? [],
      },
    };
  }

  // ─── Rich knowledge generator ──────────────────────────────────────────────

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
