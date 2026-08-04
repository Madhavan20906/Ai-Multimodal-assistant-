export type RepresentationType = 
  | '3d_scene'
  | 'physics_simulation'
  | 'math_derivation'
  | 'algorithm_visualizer'
  | 'chemistry_lab'
  | 'code_workbench'
  | 'interactive_diagram'
  | 'chart_graph'
  | 'rich_knowledge';

export type OperatingMode = 'camera_mic' | 'voice_only';

export type DomainCategory = 
  | 'Mathematics'
  | 'Algorithms'
  | 'Programming'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Networking'
  | 'Machine Learning'
  | 'Geography'
  | 'History'
  | 'Architecture'
  | 'General';

export interface SceneObject {
  id: string;
  name: string;
  type: string; // 'bottle' | 'car' | 'molecule' | 'building' | 'planet' | 'beaker' | 'node' | 'particle'
  properties: {
    color?: string;
    fillLevel?: number; // 0 to 100
    size?: number; // scale multiplier
    position?: [number, number, number];
    rotation?: [number, number, number];
    state?: string; // 'empty' | 'filled' | 'reacting' | 'dissolved'
    material?: string;
    label?: string;
    [key: string]: any;
  };
  children?: SceneObject[];
}

export interface RepresentationPayload {
  type: RepresentationType;
  domain: DomainCategory;
  title: string;
  subtitle?: string;
  summaryText?: string;
  
  // 3D Scene Data
  threeDData?: {
    primaryObject?: string; // 'water_bottle' | 'car' | 'building' | 'solar_system' | 'molecule'
    objects: SceneObject[];
    environment?: 'lab' | 'space' | 'grid' | 'blueprint' | 'studio';
  };

  // Physics Simulation Data
  physicsData?: {
    preset: 'pendulum' | 'projectile' | 'spring' | 'collision' | 'freefall';
    gravity: number;
    mass: number;
    initialVelocity: number;
    angle: number;
  };

  // Math Data
  mathData?: {
    equation: string;
    steps: { label: string; latex: string; explanation: string }[];
    graphExpression?: string; // e.g. "x^2 - 5*x + 6"
    variables?: { name: string; value: number; min: number; max: number }[];
  };

  // Algorithm Data
  algoData?: {
    algorithmName: string;
    initialArray: number[];
    timeComplexity: string;
    spaceComplexity: string;
    executionSteps: {
      array: number[];
      highlightedIndices: number[];
      swappedIndices?: number[];
      explanation: string;
    }[];
  };

  // Chemistry Data
  chemData?: {
    reactants: { formula: string; name: string; color: string }[];
    products: { formula: string; name: string; color: string }[];
    balancedEquation: string;
    observations: string[];
    reactionType: string;
    isAnimated: boolean;
    temperatureChange?: string;
  };

  // Code Workbench Data
  codeData?: {
    language: string;
    code: string;
    explanation: string;
    callStack: string[];
    variables: { name: string; value: string; type: string }[];
    executionSteps: { line: number; variablesState: Record<string, any>; log?: string }[];
  };

  // Diagram Data
  diagramData?: {
    kind: 'flowchart' | 'neural_network' | 'network_packets' | 'cell_structure' | 'timeline';
    nodes: { id: string; label: string; subtext?: string; type?: string; x?: number; y?: number }[];
    edges: { from: string; to: string; label?: string; animated?: boolean }[];
    timelineEvents?: { year: string; title: string; description: string }[];
  };

  // Chart Data
  chartData?: {
    chartType: 'bar' | 'line' | 'pie' | 'radar';
    labels: string[];
    datasets: { label: string; data: number[]; backgroundColor?: string[] }[];
  };

  // Speech TTS Output
  voiceNarrationText?: string;
}

export interface WorkbenchState {
  mode: OperatingMode;
  isListening: boolean;
  isCameraActive: boolean;
  activePayload: RepresentationPayload | null;
  objectHierarchy: SceneObject[];
  history: RepresentationPayload[];
  historyIndex: number;
  speechTranscript: string;
  interimTranscript: string;
  detectedGesture: string;
  isDrawingMode: boolean;
  drawingBrushColor: string;
  drawingBrushSize: number;
}
