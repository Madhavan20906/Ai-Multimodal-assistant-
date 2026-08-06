import { RepresentationPayload, DomainCategory, SceneObject } from '../types';
import { GroqService } from './groqService';

import { UniversalSimulationGenerator } from './universalSimulationGenerator';

/**
 * Intelligent Representation Engine & Workbench Router
 * Converts natural spoken language or text input into the optimal visual representation.
 * Uses Groq LLM for domain classification and knowledge generation.
 */
export class AIRouterService {
  /** @deprecated API key is now managed server-side via the Groq proxy middleware */
  public static setApiKey(_key: string) {}

  public static async processInput(
    input: string,
    currentPayload: RepresentationPayload | null,
    existingObjects: SceneObject[]
  ): Promise<RepresentationPayload> {
    const text = input.trim().toLowerCase();

    // 1. Fast-path: incremental modifications to an active 3D scene
    // Only intercept colour/size/fill tweaks — NOT full new topic requests
    const isFullNewRequest = text.length > 15 && !text.startsWith('make') && !text.startsWith('change') && !text.startsWith('fill') && !text.startsWith('paint') && !text.startsWith('set');
    if (!isFullNewRequest && currentPayload && currentPayload.type === '3d_scene') {
      const updated = this.handle3DIncrementalUpdate(text, currentPayload);
      if (updated) return updated;
    }


    // 3. AI-powered routing via Groq (primary path)
    try {
      return await this.groqRoute(input);
    } catch (e) {
      console.warn('[AIRouter] Groq unavailable — using Universal Simulation Generator:', e);
      // Always generate a real scenario from the user's input, never stay stuck on a preset
      return UniversalSimulationGenerator.createScenario(input);
    }
  }

  /**
   * Groq-powered router: classify domain then dispatch to the right generator.
   * All generators except physics/algorithm/diagram call Groq for dynamic content.
   */
  private static async groqRoute(rawInput: string): Promise<RepresentationPayload> {
    const lower = rawInput.toLowerCase();
    const isScenarioQuery = lower.startsWith('simulate') ||
                            lower.startsWith('show') ||
                            lower.startsWith('how does') ||
                            lower.startsWith('visualize') ||
                            lower.startsWith('demonstrate') ||
                            lower.includes('piston') ||
                            lower.includes('engine') ||
                            lower.includes('rocket') ||
                            lower.includes('orbit') ||
                            lower.includes('planet') ||
                            lower.includes('collision') ||
                            lower.includes('dna') ||
                            lower.includes('photosynthesis') ||
                            lower.includes('volcano') ||
                            lower.includes('earthquake') ||
                            lower.includes('pendulum') ||
                            lower.includes('chemical reaction') ||
                            lower.includes('reaction');

    if (isScenarioQuery) {
      return GroqService.generateDynamicScenario(rawInput);
    }

    const { representationType, domain } = await GroqService.classify(rawInput);

    switch (representationType) {
      case '3d_scene':
      case 'physics_simulation':
        return GroqService.generateDynamicScenario(rawInput);
      case 'math_derivation':
        return GroqService.generateMath(rawInput);
      case 'code_workbench':
        return GroqService.generateCode(rawInput);
      case 'algorithm_visualizer':
        return this.generateAlgorithmPayload(rawInput);
      case 'interactive_diagram':
        return this.generateDiagramByDomain(rawInput, domain);
      case 'rich_knowledge':
      default:
        return this.groqKnowledgePayload(rawInput);
    }
  }

  /**
   * Pick the right diagram variant based on Groq's domain classification.
   */
  private static generateDiagramByDomain(
    rawInput: string,
    domain: DomainCategory
  ): RepresentationPayload {
    switch (domain) {
      case 'Machine Learning': return this.generateMLDiagramPayload(rawInput);
      case 'Networking':       return this.generateNetworkDiagramPayload(rawInput);
      case 'Biology':          return this.generateBiologyDiagramPayload(rawInput);
      case 'History':
      case 'Geography':        return this.generateHistoryGeographyPayload(rawInput);
      default:                 return this.generateMLDiagramPayload(rawInput);
    }
  }

  /**
   * Call Groq to generate a real AI answer for general knowledge queries.
   */
  private static async groqKnowledgePayload(rawInput: string): Promise<RepresentationPayload> {
    const knowledge = await GroqService.generateKnowledge(rawInput);
    return {
      type: 'rich_knowledge',
      domain: knowledge.domain ?? 'General',
      title: knowledge.title,
      subtitle: knowledge.subtitle,
      summaryText: knowledge.summaryText,
      voiceNarrationText: knowledge.voiceNarrationText,
      keyPoints: knowledge.keyPoints,
    };
  }

  /**
   * Keyword-based fallback router (used when Groq is unavailable).
   */
  private static routeToBestRepresentation(
    rawInput: string,
    _currentPayload: RepresentationPayload | null,
    _existingObjects: SceneObject[]
  ): RepresentationPayload {
    const input = rawInput.toLowerCase();

    // --- Domain 1: 3D Models / Virtual Objects / Operating Mode 1 Demo ---
    if (
      input.includes('water bottle') ||
      input.includes('bottle') ||
      input.includes('red car') ||
      input.includes('blue car') ||
      input.includes('car') ||
      input.includes('building') ||
      input.includes('house') ||
      input.includes('architecture') ||
      input.includes('solar system') ||
      input.includes('planet') ||
      input.includes('3d model') ||
      input.includes('virtual object')
    ) {
      return this.generate3DScenePayload(rawInput);
    }


    // --- Domain 3: Mathematics ---
    if (
      input.includes('solve') ||
      input.includes('x^2') ||
      input.includes('equation') ||
      input.includes('math') ||
      input.includes('derivative') ||
      input.includes('calculus') ||
      input.includes('formula') ||
      input.includes('quadratic') ||
      input.includes('pythagorean') ||
      input.includes('integral') ||
      /\d\s*[\+\-\*\/\^]\s*\d/.test(input)
    ) {
      return this.generateMathPayload(rawInput);
    }

    // --- Domain 4: Algorithms & Data Structures ---
    if (
      input.includes('sort') ||
      input.includes('quicksort') ||
      input.includes('mergesort') ||
      input.includes('bubblesort') ||
      input.includes('algorithm') ||
      input.includes('binary search') ||
      input.includes('tree traversal') ||
      input.includes('dijkstra') ||
      input.includes('data structure')
    ) {
      return this.generateAlgorithmPayload(rawInput);
    }

    // --- Domain 5: Programming & Code ---
    if (
      input.includes('code') ||
      input.includes('program') ||
      input.includes('python') ||
      input.includes('javascript') ||
      input.includes('function') ||
      input.includes('fibonacci') ||
      input.includes('recursion') ||
      input.includes('memory visualization') ||
      input.includes('call stack') ||
      input.includes('debug')
    ) {
      return this.generateCodePayload(rawInput);
    }

    // --- Domain 6: Physics ---
    if (
      input.includes('physics') ||
      input.includes('pendulum') ||
      input.includes('gravity') ||
      input.includes('projectile') ||
      input.includes('force') ||
      input.includes('spring') ||
      input.includes('motion simulation') ||
      input.includes('collision')
    ) {
      return this.generatePhysicsPayload(rawInput);
    }

    // --- Domain 7: Machine Learning & AI ---
    if (
      input.includes('machine learning') ||
      input.includes('neural network') ||
      input.includes('deep learning') ||
      input.includes('backpropagation') ||
      input.includes('cnn') ||
      input.includes('decision boundary')
    ) {
      return this.generateMLDiagramPayload(rawInput);
    }

    // --- Domain 8: Networking & Blockchain ---
    if (
      input.includes('network') ||
      input.includes('blockchain') ||
      input.includes('tcp') ||
      input.includes('packet') ||
      input.includes('protocol') ||
      input.includes('ip address') ||
      input.includes('dns')
    ) {
      return this.generateNetworkDiagramPayload(rawInput);
    }

    // --- Domain 9: Biology ---
    if (
      input.includes('biology') ||
      input.includes('cell') ||
      input.includes('dna') ||
      input.includes('mitochondria') ||
      input.includes('photosynthesis') ||
      input.includes('organelle')
    ) {
      return this.generateBiologyDiagramPayload(rawInput);
    }

    // --- Domain 10: History & Geography ---
    if (
      input.includes('history') ||
      input.includes('timeline') ||
      input.includes('world war') ||
      input.includes('industrial revolution') ||
      input.includes('geography') ||
      input.includes('map') ||
      input.includes('tectonic')
    ) {
      return this.generateHistoryGeographyPayload(rawInput);
    }

    // --- Domain 11: General Fact Query (e.g. "What is the capital of Japan?") ---
    if (
      input.includes('capital') ||
      input.includes('who is') ||
      input.includes('what is') ||
      input.includes('where is') ||
      input.includes('when did') ||
      input.includes('define') ||
      input.length < 35
    ) {
      return this.generateRichKnowledgePayload(rawInput);
    }

    // Default Fallback: Smart Domain Selection
    return this.generateRichKnowledgePayload(rawInput);
  }

  // --- Incremental Handlers ---
  private static handle3DIncrementalUpdate(
    text: string,
    currentPayload: RepresentationPayload
  ): RepresentationPayload | null {
    if (!currentPayload.threeDData) return null;

    const objects = [...currentPayload.threeDData.objects];

    // "fill it to X percent" or "fill to 80%"
    const fillMatch = text.match(/fill (it|bottle)? (to )?(\d+) ?(percent|%)/);
    if (fillMatch && objects.length > 0) {
      const percentage = parseInt(fillMatch[3], 10);
      const updatedObjects = objects.map((obj) =>
        obj.type === 'bottle'
          ? {
              ...obj,
              properties: {
                ...obj.properties,
                fillLevel: percentage,
                state: percentage > 0 ? `Filled (${percentage}%)` : 'Empty',
              },
            }
          : obj
      );
      return {
        ...currentPayload,
        subtitle: `Updated water level to ${percentage}%`,
        voiceNarrationText: `Water bottle filled to ${percentage} percent.`,
        threeDData: {
          ...currentPayload.threeDData,
          objects: updatedObjects,
        },
      };
    }

    // Color modification: "make it blue", "make it red", "change color to green"
    const colorMatch = text.match(/(make it|color|change to|paint) (red|blue|green|yellow|purple|cyan|gold|white|black|orange)/);
    if (colorMatch && objects.length > 0) {
      const colorName = colorMatch[2];
      const colorMap: Record<string, string> = {
        red: '#ef4444',
        blue: '#3b82f6',
        green: '#22c55e',
        yellow: '#eab308',
        purple: '#a855f7',
        cyan: '#06b6d4',
        gold: '#f59e0b',
        white: '#ffffff',
        black: '#18181b',
        orange: '#f97316',
      };
      const hexColor = colorMap[colorName] || '#3b82f6';
      const updatedObjects = objects.map((obj, i) =>
        i === 0
          ? {
              ...obj,
              properties: {
                ...obj.properties,
                color: hexColor,
              },
            }
          : obj
      );
      return {
        ...currentPayload,
        subtitle: `Updated color to ${colorName}`,
        voiceNarrationText: `Color updated to ${colorName}.`,
        threeDData: {
          ...currentPayload.threeDData,
          objects: updatedObjects,
        },
      };
    }

    // Size modification: "make it bigger", "scale to 2", "make it smaller"
    if (text.includes('bigger') || text.includes('larger') || text.includes('increase size')) {
      const updatedObjects = objects.map((obj) => ({
        ...obj,
        properties: {
          ...obj.properties,
          size: (obj.properties.size || 1) * 1.3,
        },
      }));
      return {
        ...currentPayload,
        subtitle: `Increased object size`,
        voiceNarrationText: `Object scaled up.`,
        threeDData: {
          ...currentPayload.threeDData,
          objects: updatedObjects,
        },
      };
    }

    if (text.includes('smaller') || text.includes('decrease size')) {
      const updatedObjects = objects.map((obj) => ({
        ...obj,
        properties: {
          ...obj.properties,
          size: Math.max((obj.properties.size || 1) * 0.7, 0.3),
        },
      }));
      return {
        ...currentPayload,
        subtitle: `Decreased object size`,
        voiceNarrationText: `Object scaled down.`,
        threeDData: {
          ...currentPayload.threeDData,
          objects: updatedObjects,
        },
      };
    }

    return null;
  }


  // --- Specific Payload Generators ---

  private static generate3DScenePayload(rawInput: string): RepresentationPayload {
    const input = rawInput.toLowerCase();

    if (input.includes('car')) {
      const color = input.includes('red') ? '#ef4444' : input.includes('blue') ? '#3b82f6' : '#a855f7';
      return {
        type: '3d_scene',
        domain: 'Architecture',
        title: '3D Automotive Visualizer',
        subtitle: 'Interactive Vehicle Mesh',
        summaryText: 'Dynamic 3D vehicle model with editable paint finish, wheel geometry, and physical parameters.',
        voiceNarrationText: `Here is the ${input.includes('red') ? 'red' : 'blue'} car. You can rotate, drag, resize, or alter its color via voice commands.`,
        threeDData: {
          primaryObject: 'car',
          environment: 'studio',
          objects: [
            {
              id: 'car_1',
              name: 'Sports Coupe',
              type: 'car',
              properties: { color, size: 1.0, position: [0, 0, 0] },
            },
          ],
        },
      };
    }

    if (input.includes('building') || input.includes('architecture') || input.includes('house')) {
      return {
        type: '3d_scene',
        domain: 'Architecture',
        title: 'Parametric Architectural Structure',
        subtitle: '3D Building Blueprint Model',
        summaryText: 'Real-time structural visualization featuring floor levels, glass curtain walls, and structural columns.',
        voiceNarrationText: '3D Building model generated. Explore structural floor plans and glass elevation.',
        threeDData: {
          primaryObject: 'building',
          environment: 'blueprint',
          objects: [
            {
              id: 'building_1',
              name: 'Modern Tower',
              type: 'building',
              properties: { color: '#38bdf8', size: 1.2, floors: 12 },
            },
          ],
        },
      };
    }

    if (input.includes('solar system') || input.includes('planet')) {
      return {
        type: '3d_scene',
        domain: 'Geography',
        title: 'Interactive Orbital Solar System',
        subtitle: '3D Celestial Mechanics',
        summaryText: 'Real-time 3D planetary orbits with relative speed ratios, orbital planes, and atmospheric rendering.',
        voiceNarrationText: 'Solar system model generated. Observe planetary orbits around the sun.',
        threeDData: {
          primaryObject: 'solar_system',
          environment: 'space',
          objects: [
            { id: 'sun', name: 'Sun', type: 'star', properties: { color: '#f59e0b', size: 1.5 } },
            { id: 'earth', name: 'Earth', type: 'planet', properties: { color: '#3b82f6', size: 0.6 } },
            { id: 'mars', name: 'Mars', type: 'planet', properties: { color: '#ef4444', size: 0.4 } },
          ],
        },
      };
    }

    // Default: Universal Scenario Generator for ANY topic or prompt
    return UniversalSimulationGenerator.createScenario(rawInput);
  }


  private static generateMathPayload(rawInput: string): RepresentationPayload {
    return {
      type: 'math_derivation',
      domain: 'Mathematics',
      title: 'Quadratic Equation Solving & Graphing',
      subtitle: 'Step-by-Step Derivation for x² - 5x + 6 = 0',
      summaryText: 'Factoring the polynomial into binomial roots and visualizing parabola roots on Cartesian coordinates.',
      voiceNarrationText: 'Solving x squared minus 5x plus 6 equals 0. The roots are x = 2 and x = 3. Plotting the parabola below.',
      mathData: {
        equation: 'x^2 - 5x + 6 = 0',
        graphExpression: 'x^2 - 5*x + 6',
        steps: [
          {
            label: '1. Standard Form',
            latex: 'ax^2 + bx + c = 0 \\implies a=1, b=-5, c=6',
            explanation: 'Identify the coefficients of the quadratic equation.',
          },
          {
            label: '2. Quadratic Formula Application',
            latex: 'x = \\frac{-(-5) \\pm \\sqrt{(-5)^2 - 4(1)(6)}}{2(1)}',
            explanation: 'Substitute a, b, and c into the quadratic formula x = (-b ± √(b² - 4ac)) / (2a).',
          },
          {
            label: '3. Discriminant Calculation',
            latex: '\\Delta = 25 - 24 = 1 \\implies \\sqrt{1} = 1',
            explanation: 'Since the discriminant Δ > 0, there are two distinct real roots.',
          },
          {
            label: '4. Final Roots',
            latex: 'x_1 = \\frac{5 + 1}{2} = 3, \\quad x_2 = \\frac{5 - 1}{2} = 2',
            explanation: 'The solution set is x ∈ {2, 3}, representing parabola x-intercepts.',
          },
        ],
        variables: [
          { name: 'a', value: 1, min: -5, max: 5 },
          { name: 'b', value: -5, min: -10, max: 10 },
          { name: 'c', value: 6, min: -10, max: 10 },
        ],
      },
    };
  }

  private static generateAlgorithmPayload(rawInput: string): RepresentationPayload {
    return {
      type: 'algorithm_visualizer',
      domain: 'Algorithms',
      title: 'QuickSort Algorithm Step Visualizer',
      subtitle: 'Divide-and-Conquer Sorting Execution',
      summaryText: 'Interactive visualization of pivot selection, partitioning elements, and recursive array ordering.',
      voiceNarrationText: 'QuickSort execution initialized. Watch how elements rearrange around chosen pivot values.',
      algoData: {
        algorithmName: 'QuickSort',
        initialArray: [42, 17, 93, 28, 65, 12, 85, 39],
        timeComplexity: 'O(N log N) Average | O(N²) Worst Case',
        spaceComplexity: 'O(log N) Recursive Call Stack',
        executionSteps: [
          {
            array: [42, 17, 93, 28, 65, 12, 85, 39],
            highlightedIndices: [7],
            explanation: 'Initial Array. Selected last element (39) as the Pivot.',
          },
          {
            array: [17, 28, 12, 39, 65, 42, 85, 93],
            highlightedIndices: [0, 1, 2],
            swappedIndices: [0, 3],
            explanation: 'Partition step: Placed elements smaller than 39 to left, larger to right.',
          },
          {
            array: [12, 17, 28, 39, 65, 42, 85, 93],
            highlightedIndices: [0, 1, 2],
            swappedIndices: [0, 2],
            explanation: 'Recursively sorted left sub-array [17, 28, 12] into [12, 17, 28].',
          },
          {
            array: [12, 17, 28, 39, 42, 65, 85, 93],
            highlightedIndices: [4, 5],
            swappedIndices: [4, 5],
            explanation: 'Recursively sorted right sub-array [65, 42, 85, 93] into [42, 65, 85, 93].',
          },
          {
            array: [12, 17, 28, 39, 42, 65, 85, 93],
            highlightedIndices: [0, 1, 2, 3, 4, 5, 6, 7],
            explanation: 'Sorting complete! Array is in ascending sorted order.',
          },
        ],
      },
    };
  }

  private static generateCodePayload(rawInput: string): RepresentationPayload {
    return {
      type: 'code_workbench',
      domain: 'Programming',
      title: 'Python Recursive Fibonacci Code Sandbox',
      subtitle: 'Syntax Execution & Call Stack Inspector',
      summaryText: 'Analyzing stack frames, memoization opportunities, and variable state during recursive execution.',
      voiceNarrationText: 'Displaying Python recursive code for Fibonacci sequence along with real-time call stack tracking.',
      codeData: {
        language: 'python',
        code: `def fibonacci(n, memo={}):
    # Base Cases
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    
    # Recursive Step with Memoization
    memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)
    return memo[n]

# Calculate 7th Fibonacci number
result = fibonacci(7)
print(f"Fibonacci(7) = {result}")`,
        explanation: 'Efficient O(N) linear time complexity achieved by caching previously computed sub-problems in dictionary memo.',
        callStack: ['fibonacci(7)', 'fibonacci(6)', 'fibonacci(5)', 'fibonacci(4)'],
        variables: [
          { name: 'n', value: '7', type: 'int' },
          { name: 'memo', value: '{0:0, 1:1, 2:1, 3:2, 4:3, 5:5, 6:8, 7:13}', type: 'dict' },
          { name: 'result', value: '13', type: 'int' },
        ],
        executionSteps: [
          { line: 2, variablesState: { n: 7, memo: '{}' }, log: 'Checking base case memoization...' },
          { line: 8, variablesState: { n: 7, memo: '{0:0, 1:1}' }, log: 'Recursing into fibonacci(6) + fibonacci(5)...' },
          { line: 12, variablesState: { result: 13 }, log: 'Output: Fibonacci(7) = 13' },
        ],
      },
    };
  }

  private static generatePhysicsPayload(rawInput: string): RepresentationPayload {
    return {
      type: 'physics_simulation',
      domain: 'Physics',
      title: 'Interactive Simple Pendulum Simulation',
      subtitle: 'Harmonic Motion & Gravitational Dynamics',
      summaryText: 'Simulating energy conservation between potential energy (PE) and kinetic energy (KE) in simple harmonic motion.',
      voiceNarrationText: 'Physics simulation active. Drag the pendulum bob or tweak gravity parameters to test velocity vectors.',
      physicsData: {
        preset: 'pendulum',
        gravity: 9.81,
        mass: 2.5,
        initialVelocity: 0,
        angle: 45,
      },
    };
  }

  private static generateMLDiagramPayload(rawInput: string): RepresentationPayload {
    return {
      type: 'interactive_diagram',
      domain: 'Machine Learning',
      title: 'Deep Neural Network Dataflow Architecture',
      subtitle: 'Forward Pass & Weight Matrix Multiplications',
      summaryText: 'Visualizing input vector feature transformations across hidden layers with ReLU activation functions.',
      voiceNarrationText: 'Neural network architecture map. Observe input feature signals flowing into hidden layers to yield prediction logits.',
      diagramData: {
        kind: 'neural_network',
        nodes: [
          { id: 'in1', label: 'Input x₁ (Feature A)', type: 'input' },
          { id: 'in2', label: 'Input x₂ (Feature B)', type: 'input' },
          { id: 'h1', label: 'Neuron H₁ (ReLU)', type: 'hidden' },
          { id: 'h2', label: 'Neuron H₂ (ReLU)', type: 'hidden' },
          { id: 'h3', label: 'Neuron H₃ (ReLU)', type: 'hidden' },
          { id: 'out', label: 'Output ŷ (Softmax Logit)', type: 'output' },
        ],
        edges: [
          { from: 'in1', to: 'h1', label: 'w₁₁=0.45', animated: true },
          { from: 'in1', to: 'h2', label: 'w₁₂=0.82', animated: true },
          { from: 'in2', to: 'h2', label: 'w₂₂=0.15', animated: true },
          { from: 'in2', to: 'h3', label: 'w₂₃=0.91', animated: true },
          { from: 'h1', to: 'out', label: 'w₃₁=0.64', animated: true },
          { from: 'h2', to: 'out', label: 'w₃₂=0.77', animated: true },
          { from: 'h3', to: 'out', label: 'w₃₃=0.38', animated: true },
        ],
      },
    };
  }

  private static generateNetworkDiagramPayload(rawInput: string): RepresentationPayload {
    return {
      type: 'interactive_diagram',
      domain: 'Networking',
      title: 'Blockchain Distributed Ledger Flow',
      subtitle: 'Consensus & Block Hashing Mechanism',
      summaryText: 'Visualizing block header hashes, SHA-256 cryptographic linkage, and peer-to-peer gossip propagation.',
      voiceNarrationText: 'Blockchain network flow diagram generated. Blocks are cryptographically linked via previous block hashes.',
      diagramData: {
        kind: 'flowchart',
        nodes: [
          { id: 'b0', label: 'Genesis Block #0', subtext: 'Hash: 0000a4b9...' },
          { id: 'b1', label: 'Block #1 (Tx 1-50)', subtext: 'Prev: 0000a4b9... | Hash: 0000f721...' },
          { id: 'b2', label: 'Block #2 (Tx 51-120)', subtext: 'Prev: 0000f721... | Hash: 00009c88...' },
          { id: 'b3', label: 'Pending Mempool', subtext: 'Nonce searching via PoW' },
        ],
        edges: [
          { from: 'b0', to: 'b1', label: 'Merkle Root Link', animated: true },
          { from: 'b1', to: 'b2', label: 'SHA-256 Link', animated: true },
          { from: 'b2', to: 'b3', label: 'Mined Block Candidate', animated: true },
        ],
      },
    };
  }

  private static generateBiologyDiagramPayload(rawInput: string): RepresentationPayload {
    return {
      type: 'interactive_diagram',
      domain: 'Biology',
      title: 'Eukaryotic Cell Structure & Organelles',
      subtitle: 'Cellular Machinery Diagram',
      summaryText: 'Interactive organelle map depicting Mitochondria (ATP energy), Nucleus (DNA transcription), and Ribosomes.',
      voiceNarrationText: 'Eukaryotic cell organelle map ready. Mitochondria generate ATP energy while the Nucleus stores genetic code.',
      diagramData: {
        kind: 'cell_structure',
        nodes: [
          { id: 'nuc', label: 'Nucleus', subtext: 'Stores DNA & RNA instructions' },
          { id: 'mito', label: 'Mitochondria', subtext: 'ATP Powerhouse (Cellular Respiration)' },
          { id: 'er', label: 'Endoplasmic Reticulum', subtext: 'Protein Synthesis & Folding' },
          { id: 'golgi', label: 'Golgi Apparatus', subtext: 'Macromolecular Packaging' },
        ],
        edges: [
          { from: 'nuc', to: 'er', label: 'mRNA Transport', animated: true },
          { from: 'er', to: 'golgi', label: 'Vesicle Delivery', animated: true },
          { from: 'mito', to: 'nuc', label: 'ATP Powering', animated: true },
        ],
      },
    };
  }

  private static generateHistoryGeographyPayload(rawInput: string): RepresentationPayload {
    return {
      type: 'interactive_diagram',
      domain: 'History',
      title: 'Historical Event Timeline - Industrial Revolution',
      subtitle: 'Chronological Advancement of Modern Automation',
      summaryText: 'Interactive timeline spanning Steam Engine breakthrough, Electrical Grid, and Computing Revolution.',
      voiceNarrationText: 'Historical timeline created. Explore key milestones of the Industrial Revolution.',
      diagramData: {
        kind: 'timeline',
        nodes: [],
        edges: [],
        timelineEvents: [
          { year: '1769', title: 'Watt Steam Engine', description: 'James Watt patents the separate condenser steam engine.' },
          { year: '1837', title: 'Telegraph Communications', description: 'Samuel Morse develops electric telegraph network.' },
          { year: '1879', title: 'Commercial Electric Light', description: 'Thomas Edison demonstrates long-lasting incandescent bulb.' },
          { year: '1913', title: 'Automated Assembly Line', description: 'Henry Ford introduces moving assembly line for Model T.' },
          { year: '1969', title: 'ARPANET Packet Switching', description: 'First node-to-node message transmitted, birthing the Internet.' },
        ],
      },
    };
  }

  private static generateRichKnowledgePayload(rawInput: string): RepresentationPayload {
    const input = rawInput.toLowerCase();
    
    if (input.includes('japan') || input.includes('capital of japan')) {
      return {
        type: 'rich_knowledge',
        domain: 'Geography',
        title: 'Capital of Japan: Tokyo',
        subtitle: 'Metropolitan & Cultural Information',
        summaryText: 'Tokyo is the capital and largest city of Japan, serving as the world\'s most populous metropolitan area.',
        voiceNarrationText: 'The capital of Japan is Tokyo. It is the political, economic, and financial center of the nation.',
      };
    }

    return {
      type: 'rich_knowledge',
      domain: 'General',
      title: `Response: ${rawInput}`,
      subtitle: 'Structured Knowledge & Context Analysis',
      summaryText: `Analysis and breakdown for query: "${rawInput}". The AI Workbench has evaluated this prompt and formatted key insights.`,
      voiceNarrationText: `Here is the structured breakdown for ${rawInput}.`,
    };
  }
}
