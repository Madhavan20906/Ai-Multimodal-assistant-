import { RepresentationPayload } from '../types';

export interface UniversalScenarioInput {
  scenarioTitle?: string;
  category?: string;
  description?: string;
  entities?: string;
  stepsCount?: number;
  environment?: 'studio' | 'space' | 'laboratory' | 'nature' | 'cyber' | 'microscopic' | 'blueprint';
  voiceScript?: string;
}

export interface SimulationStep {
  stepNumber: number;
  title: string;
  description: string;
  narrationText: string;
  cameraView: 'wide' | 'close_up' | 'top_view' | 'microscopic_zoom' | 'cinematic';
  activeEntityId?: string;
  animationAction?: 'idle' | 'move' | 'rotate' | 'collide' | 'emit_particles' | 'zoom_micro' | 'transform' | 'explode';
  particleEffect?: 'none' | 'fire_smoke' | 'sparks' | 'water_bubbles' | 'energy_waves' | 'light_beam' | 'glow_aura' | 'atomic_particles';
  readoutData?: { label: string; value: string; color?: string }[];
}

export interface SimulationEntity {
  id: string;
  name: string;
  shape: 'sphere' | 'cube' | 'cylinder' | 'cone' | 'rocket' | 'atom' | 'ring' | 'wave' | 'particle_cloud' | 'custom';
  color: string;
  size: number;
  position: { x: number; y: number; z: number };
  speed?: number;
  glowing?: boolean;
}

export class UniversalSimulationGenerator {
  /**
   * Universal Scenario Simulation Engine:
   * Takes ANY user request (physics, space, biology, mechanics, chemistry, engineering, algorithms, everyday scenarios)
   * and builds a complete interactive animated scenario simulation payload.
   */
  public static createScenario(input: string | UniversalScenarioInput): RepresentationPayload {
    const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
    const lower = inputStr.toLowerCase();

    // ── Space & Astronomy ──────────────────────────────────────────────────
    if (lower.includes('rocket') || lower.includes('space') || lower.includes('orbit') || lower.includes('saturn') || lower.includes('nasa') || lower.includes('moon') || lower.includes('mars') || lower.includes('solar system') || lower.includes('astronaut') || lower.includes('galaxy')) {
      return this.getSpaceRocketPreset();
    }

    // ── Geology & Earth Sciences ───────────────────────────────────────────
    if (lower.includes('volcano') || lower.includes('volcanic') || lower.includes('eruption') || lower.includes('lava') || lower.includes('magma') || lower.includes('earthquake') || lower.includes('tectonic') || lower.includes('seismic')) {
      return this.getVolcanoEruptionPreset();
    }

    // ── Nuclear & Atomic Physics ───────────────────────────────────────────
    if (lower.includes('nuclear') || lower.includes('atom') || lower.includes('fission') || lower.includes('fusion') || lower.includes('radioactive') || lower.includes('neutron') || lower.includes('proton') || lower.includes('electron')) {
      return this.getNuclearFissionPreset();
    }

    // ── Chemical Reactions & Chemistry ────────────────────────────────────
    if (lower.includes('chemical reaction') || lower.includes('acid') || lower.includes('base') || lower.includes('reaction') || lower.includes('molecule') || lower.includes('compound') || lower.includes('titration') || lower.includes('oxidation')) {
      return this.getChemicalReactionPreset();
    }

    // ── Mechanical Engineering ─────────────────────────────────────────────
    if (lower.includes('piston') || lower.includes('engine') || lower.includes('motor') || lower.includes('turbine') || lower.includes('gear') || lower.includes('hydraulic') || lower.includes('pneumatic')) {
      return this.getEnginePistonPreset();
    }

    // ── Biology & Life Sciences ────────────────────────────────────────────
    if (lower.includes('dna') || lower.includes('cell') || lower.includes('photosynthesis') || lower.includes('biology') || lower.includes('heart') || lower.includes('blood') || lower.includes('neuron') || lower.includes('brain') || lower.includes('virus') || lower.includes('bacteria')) {
      return this.getDNAReplicationPreset();
    }

    // ── Optics & Wave Physics ──────────────────────────────────────────────
    if (lower.includes('pendulum') || lower.includes('gravity') || lower.includes('wave') || lower.includes('light') || lower.includes('laser') || lower.includes('refraction') || lower.includes('prism') || lower.includes('optics') || lower.includes('electromagnetic')) {
      return this.getPhysicsWavePreset();
    }

    // ── Weather & Climate ──────────────────────────────────────────────────
    if (lower.includes('tornado') || lower.includes('hurricane') || lower.includes('cyclone') || lower.includes('thunder') || lower.includes('lightning') || lower.includes('rain') || lower.includes('storm') || lower.includes('cloud') || lower.includes('weather')) {
      return this.getTornadoPreset();
    }

    // ── Civil Engineering & Structures ────────────────────────────────────
    if (lower.includes('bridge') || lower.includes('building') || lower.includes('dam') || lower.includes('skyscraper') || lower.includes('architecture') || lower.includes('construction') || lower.includes('structure') || lower.includes('foundation')) {
      return this.getBridgeEngineeringPreset();
    }

    // ── Generic Universal Fallback — titles the scenario from user input ──
    return this.getGenericScenario(input);
  }

  // Preset 1: Space Rocket Launch & Orbital Physics
  public static getSpaceRocketPreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'rocket', name: 'Saturn V Rocket', shape: 'rocket', color: '#f8fafc', size: 1.8, position: { x: 0, y: -80, z: 0 }, glowing: true },
      { id: 'earth', name: 'Planet Earth', shape: 'sphere', color: '#0284c7', size: 4.0, position: { x: 0, y: -260, z: 0 } },
      { id: 'exhaust', name: 'Rocket Engine Flame', shape: 'particle_cloud', color: '#f97316', size: 2.0, position: { x: 0, y: -110, z: 0 }, glowing: true },
      { id: 'moon', name: 'Moon Target Orbit', shape: 'sphere', color: '#cbd5e1', size: 1.2, position: { x: 180, y: 150, z: 0 } },
    ];

    const steps: SimulationStep[] = [
      {
        stepNumber: 1,
        title: 'STEP 1: Launch Pad Pre-Flight Checkout',
        description: 'Saturn V rocket standing at Launch Complex 39A. Systems armed, cryogenic fuel pressurized.',
        narrationText: 'T-minus 10 seconds. All flight computers green. Cryogenic propulsion systems pressurized.',
        cameraView: 'wide',
        activeEntityId: 'rocket',
        particleEffect: 'fire_smoke',
        readoutData: [{ label: 'Altitude', value: '0 km' }, { label: 'Velocity', value: '0 m/s' }, { label: 'Thrust', value: '100%' }],
      },
      {
        stepNumber: 2,
        title: 'STEP 2: Main Engine Ignition & Liftoff',
        description: 'F-1 engines ignite generating 7.5 million pounds of thrust. Flame plume billows.',
        narrationText: 'Ignition sequence start. 3, 2, 1... Liftoff! We have liftoff of the rocket!',
        cameraView: 'close_up',
        activeEntityId: 'exhaust',
        particleEffect: 'fire_smoke',
        readoutData: [{ label: 'Altitude', value: '2.4 km' }, { label: 'Velocity', value: '450 m/s' }, { label: 'G-Force', value: '1.8 G' }],
      },
      {
        stepNumber: 3,
        title: 'STEP 3: Supersonic Acceleration & Max Q',
        description: 'Rocket breaks sound barrier passing through maximum aerodynamic pressure (Max Q).',
        narrationText: 'Passing through Max Q. Aerodynamic pressure reaches peak structural load.',
        cameraView: 'cinematic',
        activeEntityId: 'rocket',
        particleEffect: 'energy_waves',
        readoutData: [{ label: 'Altitude', value: '14.2 km' }, { label: 'Velocity', value: '1,250 m/s' }, { label: 'Mach', value: 'Mach 3.8' }],
      },
      {
        stepNumber: 4,
        title: 'STEP 4: First Stage Separation & Upper Atmosphere',
        description: 'Spent booster stage detaches; second stage ignition accelerates payload into vacuum.',
        narrationText: 'Stage 1 separation confirmed. Stage 2 engines ignited in the upper atmosphere.',
        cameraView: 'wide',
        activeEntityId: 'rocket',
        particleEffect: 'sparks',
        readoutData: [{ label: 'Altitude', value: '68.0 km' }, { label: 'Velocity', value: '2,800 m/s' }],
      },
      {
        stepNumber: 5,
        title: 'STEP 5: Orbital Insertion Velocity',
        description: 'Rocket tilts horizontally, balancing Earth gravity with centrifugal orbital velocity.',
        narrationText: 'Achieving orbital velocity of 7.8 kilometers per second to enter stable Low Earth Orbit.',
        cameraView: 'top_view',
        activeEntityId: 'earth',
        particleEffect: 'light_beam',
        readoutData: [{ label: 'Altitude', value: '185 km' }, { label: 'Velocity', value: '7,800 m/s' }, { label: 'Orbit', value: 'LEO Stable' }],
      },
      {
        stepNumber: 6,
        title: 'STEP 6: Microscopic Rocket Nozzle Combustion Zoom',
        description: 'Zooming into the engine combustion chamber to visualize Liquid Hydrogen & Oxygen reaction.',
        narrationText: 'Microscopic view: High-pressure Liquid Hydrogen fuel reacts with Oxygen, expelling supersonic gas at 4,500 m/s.',
        cameraView: 'microscopic_zoom',
        activeEntityId: 'exhaust',
        particleEffect: 'atomic_particles',
        readoutData: [{ label: 'Chamber Temp', value: '3,300°C' }, { label: 'Pressure', value: '70 bar' }],
      },
      {
        stepNumber: 7,
        title: 'STEP 7: Trans-Lunar Injection Burn',
        description: 'Engine ignites for TLI maneuver, breaking Earth orbit towards lunar trajectory.',
        narrationText: 'Trans-Lunar Injection burn initiated. Rocket accelerating to escape velocity of 11.2 km/s.',
        cameraView: 'cinematic',
        activeEntityId: 'moon',
        particleEffect: 'energy_waves',
        readoutData: [{ label: 'Velocity', value: '11.2 km/s' }, { label: 'Destination', value: 'Lunar Orbit' }],
      },
      {
        stepNumber: 8,
        title: 'STEP 8: Mission Summary & Orbital Physics Takeaways',
        description: 'Spacecraft in lunar transit. Orbital mechanics and Newton third law verified.',
        narrationText: 'Simulation complete. Orbital trajectory achieved through conservation of momentum.',
        cameraView: 'wide',
        activeEntityId: 'rocket',
        readoutData: [{ label: 'Status', value: 'Mission Success' }],
      },
    ];

    return {
      type: '3d_scene',
      domain: 'Physics',
      title: 'Space Rocket Launch & Orbital Trajectory Simulation',
      subtitle: 'Aerospace Engineering & Gravitational Mechanics',
      summaryText: 'Simulating multi-stage rocket propulsion, supersonic Max Q pressure, stage separation, and orbital insertion physics.',
      voiceNarrationText: 'Simulating rocket launch, engine combustion dynamics, and orbital mechanics in 3D.',
      scenarioData: {
        scenarioTitle: 'Saturn V Rocket Launch & Orbital Trajectory',
        environment: 'space',
        entities,
        steps,
        observations: [
          'First stage engines produce 7.5 million lbs of thrust to overcome Earth surface gravity.',
          'Max Q aerodynamic load reached at 14.2 km altitude.',
          'Orbital velocity of 7.8 km/s required to maintain stable Low Earth Orbit.',
          'Trans-Lunar Injection requires escape velocity of 11.2 km/s.',
        ],
        takeawayConclusion: 'Rocket propulsion relies on Newton’s Third Law of Motion: action of expelled high-velocity combustion gases creates equal and opposite forward reaction thrust.',
      },
    };
  }

  // Preset 2: Four-Stroke Internal Combustion Engine Piston
  public static getEnginePistonPreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'cylinder', name: 'Engine Cylinder Block', shape: 'cylinder', color: '#475569', size: 3.0, position: { x: 0, y: 0, z: 0 } },
      { id: 'piston', name: 'Reciprocating Piston Head', shape: 'cube', color: '#94a3b8', size: 2.2, position: { x: 0, y: -40, z: 0 } },
      { id: 'crank', name: 'Rotary Crankshaft', shape: 'ring', color: '#f59e0b', size: 1.8, position: { x: 0, y: -120, z: 0 } },
      { id: 'spark', name: 'Spark Plug Probe', shape: 'cone', color: '#38bdf8', size: 0.8, position: { x: 0, y: 70, z: 0 }, glowing: true },
    ];

    const steps: SimulationStep[] = [
      {
        stepNumber: 1,
        title: 'STEP 1: Intake Stroke (Fuel-Air Mixture)',
        description: 'Intake valve opens; piston moves downward drawing fuel and air into cylinder.',
        narrationText: 'Stroke 1: Intake. Intake valve opens and piston moves down, creating vacuum to draw fuel and air.',
        cameraView: 'close_up',
        activeEntityId: 'piston',
        particleEffect: 'water_bubbles',
        readoutData: [{ label: 'Stroke', value: 'Intake' }, { label: 'Cylinder Temp', value: '45°C' }, { label: 'RPM', value: '1,200' }],
      },
      {
        stepNumber: 2,
        title: 'STEP 2: Compression Stroke',
        description: 'Valves close; piston moves upward compressing fuel-air mixture to high pressure.',
        narrationText: 'Stroke 2: Compression. Valves seal tight as piston rises, compressing fuel-air mixture by 10:1 ratio.',
        cameraView: 'close_up',
        activeEntityId: 'piston',
        particleEffect: 'glow_aura',
        readoutData: [{ label: 'Stroke', value: 'Compression' }, { label: 'Pressure', value: '18 bar' }, { label: 'Temp', value: '350°C' }],
      },
      {
        stepNumber: 3,
        title: 'STEP 3: Combustion & Power Stroke',
        description: 'Spark plug ignites mixture; rapid thermal expansion drives piston violently downward.',
        narrationText: 'Stroke 3: Power! Spark plug ignites compressed fuel, expanding gas at 2,000°C driving piston down.',
        cameraView: 'cinematic',
        activeEntityId: 'spark',
        particleEffect: 'fire_smoke',
        readoutData: [{ label: 'Stroke', value: 'Power Ignition' }, { label: 'Peak Pressure', value: '60 bar' }, { label: 'Temp', value: '2,100°C' }],
      },
      {
        stepNumber: 4,
        title: 'STEP 4: Exhaust Stroke',
        description: 'Exhaust valve opens; piston rises expelling burned gases out of the cylinder.',
        narrationText: 'Stroke 4: Exhaust. Exhaust valve opens, piston moves up pushing burned exhaust gases out.',
        cameraView: 'close_up',
        activeEntityId: 'piston',
        particleEffect: 'fire_smoke',
        readoutData: [{ label: 'Stroke', value: 'Exhaust' }, { label: 'Exhaust Temp', value: '650°C' }],
      },
      {
        stepNumber: 5,
        title: 'STEP 5: Microscopic Spark Plug Plasma Discharge Zoom',
        description: 'Zooming into spark gap to see high-voltage electron arc igniting hydrocarbon molecules.',
        narrationText: 'Microscopic view: 25,000 Volt electric arc ionizes air molecules, initiating chain oxidation reaction.',
        cameraView: 'microscopic_zoom',
        activeEntityId: 'spark',
        particleEffect: 'atomic_particles',
        readoutData: [{ label: 'Voltage', value: '25,000 V' }, { label: 'Plasma Temp', value: '10,000 K' }],
      },
      {
        stepNumber: 6,
        title: 'STEP 6: Continuous 4-Stroke Thermal Cycle Analysis',
        description: 'High-speed cycle repeating at 3,000 RPM converting thermal heat into rotational mechanical torque.',
        narrationText: '4-stroke Otto thermal cycle complete. Converting thermal expansion energy into smooth mechanical torque.',
        cameraView: 'wide',
        activeEntityId: 'crank',
        readoutData: [{ label: 'Torque', value: '280 Nm' }, { label: 'Efficiency', value: '34%' }],
      },
    ];

    return {
      type: '3d_scene',
      domain: 'Physics',
      title: 'Four-Stroke Internal Combustion Engine Piston Simulation',
      subtitle: 'Thermodynamics & Rotary Crankshaft Mechanics',
      summaryText: 'Simulating the intake, compression, ignition power, and exhaust strokes of an internal combustion engine cylinder.',
      voiceNarrationText: 'Simulating 4-stroke internal combustion engine piston mechanics and thermodynamics.',
      scenarioData: {
        scenarioTitle: 'Four-Stroke IC Engine Piston & Crankshaft Mechanics',
        environment: 'studio',
        entities,
        steps,
        observations: [
          'Intake stroke creates negative vacuum pressure (-0.3 bar) drawing air-fuel mixture.',
          'Compression ratio of 10:1 raises gas temperature to 350°C prior to spark.',
          'Ignition power stroke reaches peak pressure of 60 bar driving crankshaft rotation.',
          'Thermal efficiency converts ~34% of chemical fuel energy into mechanical torque.',
        ],
        takeawayConclusion: 'The Otto cycle demonstrates heat engine thermodynamics, transforming chemical potential energy into mechanical work through controlled cyclic expansion.',
      },
    };
  }

  // Preset 3: DNA Molecular Double Helix & Replication
  public static getDNAReplicationPreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'dna', name: 'DNA Double Helix Strand', shape: 'ring', color: '#06b6d4', size: 2.5, position: { x: 0, y: 0, z: 0 }, glowing: true },
      { id: 'helicase', name: 'Helicase Enzyme Unzipper', shape: 'sphere', color: '#ec4899', size: 1.5, position: { x: -40, y: 0, z: 0 } },
      { id: 'polymerase', name: 'DNA Polymerase Synthesizer', shape: 'cube', color: '#10b981', size: 1.8, position: { x: 40, y: 20, z: 0 } },
      { id: 'nucleotides', name: 'Free Nucleotides (A, T, C, G)', shape: 'particle_cloud', color: '#f59e0b', size: 1.2, position: { x: 0, y: 80, z: 0 } },
    ];

    const steps: SimulationStep[] = [
      {
        stepNumber: 1,
        title: 'STEP 1: DNA Double Helix Structure',
        description: 'Complementary base pairs (Adenine-Thymine, Cytosine-Guanine) bound by hydrogen bonds.',
        narrationText: 'Observing cellular DNA double helix composed of sugar-phosphate backbones and nitrogenous base pairs.',
        cameraView: 'wide',
        activeEntityId: 'dna',
        particleEffect: 'glow_aura',
        readoutData: [{ label: 'Base Pairs', value: '3.2 Billion' }, { label: 'Helix Diameter', value: '2.0 nm' }],
      },
      {
        stepNumber: 2,
        title: 'STEP 2: Helicase Unzipping Replication Fork',
        description: 'Helicase enzyme breaks hydrogen bonds between bases, creating replication fork.',
        narrationText: 'Helicase enzyme binds to replication origin, breaking hydrogen bonds and unzipping double helix.',
        cameraView: 'close_up',
        activeEntityId: 'helicase',
        particleEffect: 'energy_waves',
        readoutData: [{ label: 'Enzyme', value: 'Helicase' }, { label: 'Speed', value: '500 bp/s' }],
      },
      {
        stepNumber: 3,
        title: 'STEP 3: Single-Stranded Binding Proteins',
        description: 'SSB proteins attach to template strands preventing re-annealing.',
        narrationText: 'Single-strand binding proteins stabilize template strands preventing DNA from snapping shut.',
        cameraView: 'close_up',
        activeEntityId: 'dna',
        particleEffect: 'sparks',
      },
      {
        stepNumber: 4,
        title: 'STEP 4: DNA Polymerase Leading Strand Synthesis',
        description: 'DNA Polymerase reads 3\' to 5\' template, continuously synthesizing complementary strand.',
        narrationText: 'DNA Polymerase synthesizes new complementary leading strand in 5\' to 3\' direction.',
        cameraView: 'cinematic',
        activeEntityId: 'polymerase',
        particleEffect: 'light_beam',
        readoutData: [{ label: 'Synthesis', value: 'Continuous 5\'→3\'' }, { label: 'Accuracy', value: '99.999%' }],
      },
      {
        stepNumber: 5,
        title: 'STEP 5: Microscopic Hydrogen Bond Formation Zoom',
        description: 'Zooming into nucleotide active site to see Adenine forming 2 hydrogen bonds with Thymine.',
        narrationText: 'Microscopic view: Adenine forms 2 hydrogen bonds with Thymine, Cytosine forms 3 with Guanine.',
        cameraView: 'microscopic_zoom',
        activeEntityId: 'nucleotides',
        particleEffect: 'atomic_particles',
        readoutData: [{ label: 'A-T Bonds', value: '2 H-Bonds' }, { label: 'C-G Bonds', value: '3 H-Bonds' }],
      },
      {
        stepNumber: 6,
        title: 'STEP 6: Two Identical Daughter DNA Helices',
        description: 'Semiconservative replication complete; two double helices formed.',
        narrationText: 'Replication complete. Two identical daughter DNA double-stranded helices produced.',
        cameraView: 'wide',
        activeEntityId: 'dna',
        readoutData: [{ label: 'Fidelity', value: 'Error-Free Copy' }],
      },
    ];

    return {
      type: '3d_scene',
      domain: 'Biology',
      title: 'DNA Double Helix & Semiconservative Replication Simulation',
      subtitle: 'Molecular Genetics & Enzymatic Machinery',
      summaryText: 'Simulating DNA unzipping by helicase enzyme and 5’ to 3’ daughter strand synthesis by DNA polymerase.',
      voiceNarrationText: 'Simulating DNA double helix structure and semiconservative replication fork dynamics.',
      scenarioData: {
        scenarioTitle: 'DNA Double Helix & Enzymatic Replication Fork',
        environment: 'microscopic',
        entities,
        steps,
        observations: [
          'Helicase enzyme unwinds double helix at 500 base pairs per second.',
          'DNA Polymerase requires RNA primer to initiate nucleotide polymerization.',
          'Adenine pairs exclusively with Thymine (2 H-bonds); Guanine with Cytosine (3 H-bonds).',
          'Semiconservative mechanism ensures each daughter cell receives 1 original and 1 new strand.',
        ],
        takeawayConclusion: 'DNA replication guarantees genetic inheritance across all living organisms through high-fidelity enzymatic base pairing.',
      },
    };
  }

  // Preset 4: Physics Wave & Laser Optics Simulation
  public static getPhysicsWavePreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'laser', name: 'Coherent Laser Source', shape: 'cylinder', color: '#ef4444', size: 1.5, position: { x: -100, y: 0, z: 0 }, glowing: true },
      { id: 'prism', name: 'Optical Glass Prism', shape: 'cone', color: '#38bdf8', size: 2.5, position: { x: 0, y: 0, z: 0 } },
      { id: 'beam', name: 'Refracted Light Beam Matrix', shape: 'wave', color: '#a855f7', size: 3.0, position: { x: 60, y: 0, z: 0 }, glowing: true },
    ];

    const steps: SimulationStep[] = [
      {
        stepNumber: 1,
        title: 'STEP 1: Incident Laser Beam Propagation',
        description: 'Monochromatic red laser beam propagating through air medium at speed c.',
        narrationText: 'Emitting incident monochromatic laser beam propagating through air at speed of light c.',
        cameraView: 'wide',
        activeEntityId: 'laser',
        particleEffect: 'light_beam',
        readoutData: [{ label: 'Wavelength λ', value: '650 nm' }, { label: 'Speed c', value: '3.0×10⁸ m/s' }],
      },
      {
        stepNumber: 2,
        title: 'STEP 2: Boundary Refraction & Snell’s Law',
        description: 'Light enters glass medium; speed decreases causing wavefront bending.',
        narrationText: 'Beam strikes glass prism interface. Refraction occurs governed by Snell’s Law: n1 sin(θ1) = n2 sin(θ2).',
        cameraView: 'close_up',
        activeEntityId: 'prism',
        particleEffect: 'energy_waves',
        readoutData: [{ label: 'Refractive Index n', value: '1.52' }, { label: 'Angle θ2', value: '19.4°' }],
      },
      {
        stepNumber: 3,
        title: 'STEP 3: Chromatic Dispersion & Rainbow Spectrum',
        description: 'White light breaks into component wavelengths due to wavelength-dependent refractive indices.',
        narrationText: 'Observing dispersion: shorter violet wavelengths refract more sharply than longer red wavelengths.',
        cameraView: 'cinematic',
        activeEntityId: 'beam',
        particleEffect: 'light_beam',
        readoutData: [{ label: 'Red λ', value: '700 nm' }, { label: 'Violet λ', value: '400 nm' }],
      },
      {
        stepNumber: 4,
        title: 'STEP 4: Microscopic Wave Interference Zoom',
        description: 'Zooming into wave interference fringes showing constructive and destructive superposition.',
        narrationText: 'Microscopic view: Electromagnetic wave crests overlap creating constructive interference peaks.',
        cameraView: 'microscopic_zoom',
        activeEntityId: 'beam',
        particleEffect: 'atomic_particles',
        readoutData: [{ label: 'Phase Shift', value: 'Δφ = 0' }, { label: 'Amplitude', value: '2× Peak' }],
      },
    ];

    return {
      type: '3d_scene',
      domain: 'Physics',
      title: 'Light Refraction, Prismatic Dispersion & Wave Optics',
      subtitle: 'Electromagnetic Wave Motion & Snell’s Law',
      summaryText: 'Simulating laser light propagation, refraction at glass interfaces, prismatic chromatic dispersion, and wave interference.',
      voiceNarrationText: 'Simulating optical wave propagation, prism refraction, and chromatic dispersion spectrum.',
      scenarioData: {
        scenarioTitle: 'Optical Wave Refraction & Chromatic Dispersion',
        environment: 'studio',
        entities,
        steps,
        observations: [
          'Light speed reduces to 1.97×10⁸ m/s inside dense crown glass prism.',
          'Snell’s Law n1 sin(θ1) = n2 sin(θ2) accurately calculates boundary ray bending.',
          'Short violet wavelengths disperse at greater deflection angle than long red wavelengths.',
        ],
        takeawayConclusion: 'Light exhibits wave-particle duality; refraction and dispersion confirm wave frequency invariance across material media.',
      },
    };
  }

  // Preset 5: Volcano Eruption
  public static getVolcanoEruptionPreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'volcano', name: 'Active Stratovolcano', shape: 'cone', color: '#78350f', size: 3.5, position: { x: 0, y: 30, z: 0 } },
      { id: 'magma', name: 'Magma Chamber', shape: 'sphere', color: '#ef4444', size: 2.0, position: { x: 0, y: -60, z: 0 }, glowing: true },
      { id: 'lava_flow', name: 'Lava Flow', shape: 'particle_cloud', color: '#f97316', size: 2.5, position: { x: 0, y: 20, z: 0 }, glowing: true },
      { id: 'ash_cloud', name: 'Pyroclastic Ash Cloud', shape: 'particle_cloud', color: '#64748b', size: 3.0, position: { x: 0, y: -30, z: 0 } },
    ];
    const steps: SimulationStep[] = [
      { stepNumber: 1, title: 'STEP 1: Tectonic Magma Buildup', description: 'Magma accumulates in underground chamber under intense tectonic pressure.', narrationText: 'Deep beneath the Earth\'s crust, magma accumulates in the magma chamber, building pressure over thousands of years.', cameraView: 'wide', activeEntityId: 'magma', animationAction: 'emit_particles', particleEffect: 'glow_aura', readoutData: [{ label: 'Depth', value: '15 km below' }, { label: 'Temp', value: '1,200°C' }] },
      { stepNumber: 2, title: 'STEP 2: Pressure Fracturing & Conduit Opening', description: 'Rising magma fractures rock, opening a conduit toward the surface.', narrationText: 'As pressure exceeds rock tensile strength, the volcanic conduit fractures open allowing magma to rise rapidly.', cameraView: 'close_up', activeEntityId: 'volcano', animationAction: 'transform', particleEffect: 'sparks', readoutData: [{ label: 'Pressure', value: '3,500 bar' }, { label: 'Rise Rate', value: '1 m/s' }] },
      { stepNumber: 3, title: 'STEP 3: Main Vent Eruption & Lava Ejection', description: 'Explosive decompression releases superheated lava and volcanic gases.', narrationText: 'Eruption begins! Molten lava explodes from the vent at 1,200 degrees Celsius, ejecting pyroclastic fragments.', cameraView: 'cinematic', activeEntityId: 'lava_flow', animationAction: 'explode', particleEffect: 'fire_smoke', readoutData: [{ label: 'Lava Temp', value: '1,150°C' }, { label: 'Ejection', value: '350 m/s' }] },
      { stepNumber: 4, title: 'STEP 4: Pyroclastic Ash Column Formation', description: 'Hot ash and gases rocket upward forming massive pyroclastic column.', narrationText: 'The eruption column rises 20 kilometers into the stratosphere, spreading volcanic ash across hundreds of kilometers.', cameraView: 'wide', activeEntityId: 'ash_cloud', animationAction: 'move', particleEffect: 'water_bubbles', readoutData: [{ label: 'Ash Column', value: '20 km high' }, { label: 'Spread', value: '500 km radius' }] },
      { stepNumber: 5, title: 'STEP 5: Lava Flow & Cooling Basalt', description: 'Lava flows down mountain slopes, cooling and solidifying into basalt rock.', narrationText: 'Lava flows at 30 kilometers per hour down the slopes, cooling to form new basaltic igneous rock.', cameraView: 'top_view', activeEntityId: 'lava_flow', animationAction: 'move', particleEffect: 'fire_smoke', readoutData: [{ label: 'Flow Speed', value: '30 km/h' }, { label: 'Cooling', value: '900°C → 200°C' }] },
      { stepNumber: 6, title: 'STEP 6: Caldera Collapse & Magma Drain', description: 'After eruption, emptied magma chamber roof collapses forming a caldera depression.', narrationText: 'As magma evacuates the chamber, the summit collapses forming a volcanic caldera depression.', cameraView: 'wide', activeEntityId: 'magma', animationAction: 'transform', readoutData: [{ label: 'Caldera', value: 'Formed' }, { label: 'Status', value: 'Post-Eruption' }] },
    ];
    return {
      type: '3d_scene', domain: 'Physics',
      title: 'Volcanic Eruption & Magmatic Dynamics Simulation',
      subtitle: 'Geology, Petrology & Tectonic Plate Science',
      summaryText: 'Simulating magma chamber pressurization, explosive volcanic eruption, pyroclastic column formation, and lava flow cooling.',
      voiceNarrationText: 'Simulating volcanic eruption — from deep magma buildup to surface pyroclastic explosion and lava flow.',
      scenarioData: { scenarioTitle: 'Volcano Eruption & Geological Dynamics', environment: 'nature', entities, steps, observations: ['Magma temperature ranges 700–1,300°C depending on composition.', 'Pyroclastic columns can rise 20 km into the stratosphere.', 'Lava flow speed varies from 1–100 km/h depending on viscosity.'], takeawayConclusion: 'Volcanic eruptions are driven by tectonic plate movement, where magma buoyancy and gas pressure overcome the confining strength of surrounding rock.' },
    };
  }

  // Preset 6: Nuclear Fission Reactor
  public static getNuclearFissionPreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'nucleus', name: 'Uranium-235 Nucleus', shape: 'atom', color: '#22d3ee', size: 2.5, position: { x: 0, y: 0, z: 0 }, glowing: true },
      { id: 'neutron', name: 'Free Neutron Projectile', shape: 'sphere', color: '#f59e0b', size: 0.8, position: { x: -120, y: 0, z: 0 }, glowing: true },
      { id: 'fragments', name: 'Fission Daughter Fragments', shape: 'particle_cloud', color: '#ef4444', size: 2.0, position: { x: 60, y: 0, z: 0 } },
      { id: 'reactor_core', name: 'Reactor Core Moderator', shape: 'cylinder', color: '#475569', size: 3.0, position: { x: 0, y: 0, z: 0 } },
    ];
    const steps: SimulationStep[] = [
      { stepNumber: 1, title: 'STEP 1: Uranium-235 Target Nucleus', description: 'A U-235 nucleus in the reactor fuel rod ready for neutron bombardment.', narrationText: 'Observing a Uranium-235 nucleus with 92 protons and 143 neutrons packed tightly inside the atomic core.', cameraView: 'close_up', activeEntityId: 'nucleus', animationAction: 'idle', particleEffect: 'glow_aura', readoutData: [{ label: 'Nucleus', value: 'U-235' }, { label: 'Protons', value: '92' }] },
      { stepNumber: 2, title: 'STEP 2: Slow Neutron Bombardment', description: 'A slow thermal neutron fired at the U-235 nucleus to initiate fission.', narrationText: 'A slow thermal neutron, traveling at 2,200 meters per second, collides with the Uranium-235 nucleus.', cameraView: 'cinematic', activeEntityId: 'neutron', animationAction: 'move', particleEffect: 'light_beam', readoutData: [{ label: 'Neutron Speed', value: '2,200 m/s' }, { label: 'Energy', value: '0.025 eV' }] },
      { stepNumber: 3, title: 'STEP 3: Nuclear Instability & Splitting', description: 'Excited compound nucleus U-236 becomes unstable and splits within 10⁻¹⁴ seconds.', narrationText: 'The compound nucleus U-236 oscillates violently and splits into Krypton-92 and Barium-141 fragments.', cameraView: 'microscopic_zoom', activeEntityId: 'nucleus', animationAction: 'explode', particleEffect: 'atomic_particles', readoutData: [{ label: 'Products', value: 'Kr-92 + Ba-141' }, { label: 'Time', value: '10⁻¹⁴ s' }] },
      { stepNumber: 4, title: 'STEP 4: Chain Reaction Neutron Release', description: '3 secondary neutrons released trigger 3 more fission events — chain reaction!', narrationText: 'Each fission releases 3 neutrons, which split 3 more nuclei, creating an exponential chain reaction.', cameraView: 'wide', activeEntityId: 'fragments', animationAction: 'emit_particles', particleEffect: 'sparks', readoutData: [{ label: 'Neutrons/Fission', value: '2.5 avg' }, { label: 'Chain Factor k', value: '1.0 (critical)' }] },
      { stepNumber: 5, title: 'STEP 5: Heat Generation & Steam Turbine', description: 'Kinetic energy of fragments heats coolant water to generate steam for turbines.', narrationText: 'The 200 MeV of kinetic energy from each fission event heats cooling water, producing steam to drive turbines.', cameraView: 'wide', activeEntityId: 'reactor_core', animationAction: 'rotate', particleEffect: 'water_bubbles', readoutData: [{ label: 'Energy/Fission', value: '200 MeV' }, { label: 'Coolant Temp', value: '330°C' }] },
      { stepNumber: 6, title: 'STEP 6: Control Rods & Reactor Safety', description: 'Control rods absorb neutrons to regulate chain reaction and prevent runaway.', narrationText: 'Boron control rods are inserted to absorb excess neutrons, maintaining controlled criticality and safe power output.', cameraView: 'close_up', activeEntityId: 'reactor_core', animationAction: 'idle', readoutData: [{ label: 'Power Output', value: '1,000 MW' }, { label: 'Safety', value: 'Controlled' }] },
    ];
    return {
      type: '3d_scene', domain: 'Physics',
      title: 'Nuclear Fission Chain Reaction Reactor Simulation',
      subtitle: 'Nuclear Physics & Controlled Energy Generation',
      summaryText: 'Simulating neutron bombardment of Uranium-235, nuclear fission splitting, chain reaction propagation, and reactor heat generation.',
      voiceNarrationText: 'Simulating nuclear fission — from neutron collision to chain reaction and controlled reactor power output.',
      scenarioData: { scenarioTitle: 'Nuclear Fission Reactor Chain Reaction', environment: 'microscopic', entities, steps, observations: ['1 kg of U-235 releases energy equivalent to 3,000 tonnes of coal.', 'Chain reaction becomes critical when neutron multiplication factor k=1.', 'Control rods absorb neutrons to regulate power without stopping reaction.'], takeawayConclusion: 'Nuclear fission converts mass to energy via E=mc², releasing 200 MeV per uranium nucleus — 50 million times more energy than a chemical bond.' },
    };
  }

  // Preset 7: Chemical Reaction (Acid-Base)
  public static getChemicalReactionPreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'acid', name: 'Hydrochloric Acid (HCl)', shape: 'sphere', color: '#ef4444', size: 1.8, position: { x: -80, y: 0, z: 0 }, glowing: true },
      { id: 'base', name: 'Sodium Hydroxide (NaOH)', shape: 'sphere', color: '#3b82f6', size: 1.8, position: { x: 80, y: 0, z: 0 }, glowing: true },
      { id: 'beaker', name: 'Reaction Beaker', shape: 'cylinder', color: '#94a3b8', size: 2.5, position: { x: 0, y: 0, z: 0 } },
      { id: 'product', name: 'Salt & Water Products', shape: 'particle_cloud', color: '#10b981', size: 2.0, position: { x: 0, y: 20, z: 0 } },
    ];
    const steps: SimulationStep[] = [
      { stepNumber: 1, title: 'STEP 1: Acid Dissociation in Solution', description: 'HCl ionizes completely releasing H⁺ and Cl⁻ ions in aqueous solution.', narrationText: 'Hydrochloric acid fully dissociates into hydrogen H-plus and chloride Cl-minus ions in water solution.', cameraView: 'close_up', activeEntityId: 'acid', animationAction: 'emit_particles', particleEffect: 'water_bubbles', readoutData: [{ label: 'pH', value: '1.0 (Strong Acid)' }, { label: 'H⁺ Conc', value: '0.1 mol/L' }] },
      { stepNumber: 2, title: 'STEP 2: Base Dissociation (OH⁻ Ions)', description: 'NaOH dissolves releasing Na⁺ and OH⁻ hydroxide ions.', narrationText: 'Sodium hydroxide dissociates releasing sodium Na-plus and hydroxyl OH-minus ions as strong base.', cameraView: 'close_up', activeEntityId: 'base', animationAction: 'emit_particles', particleEffect: 'glow_aura', readoutData: [{ label: 'pH', value: '13.0 (Strong Base)' }, { label: 'OH⁻ Conc', value: '0.1 mol/L' }] },
      { stepNumber: 3, title: 'STEP 3: Ion Collision & Neutralization', description: 'H⁺ and OH⁻ ions collide, neutralizing charges in exothermic reaction.', narrationText: 'Hydrogen and hydroxyl ions collide and combine. The neutralization reaction releases 57 kilojoules of heat energy.', cameraView: 'cinematic', activeEntityId: 'beaker', animationAction: 'collide', particleEffect: 'sparks', readoutData: [{ label: 'ΔH', value: '-57.3 kJ/mol' }, { label: 'Reaction Rate', value: 'Near-Instant' }] },
      { stepNumber: 4, title: 'STEP 4: Salt & Water Product Formation', description: 'Neutralization yields NaCl salt and H₂O water molecules.', narrationText: 'Products formed: sodium chloride common salt and pure water. The solution reaches neutral pH of 7.', cameraView: 'close_up', activeEntityId: 'product', animationAction: 'transform', particleEffect: 'energy_waves', readoutData: [{ label: 'Products', value: 'NaCl + H₂O' }, { label: 'pH', value: '7.0 (Neutral)' }] },
      { stepNumber: 5, title: 'STEP 5: Temperature Rise Observation', description: 'Temperature increase of ~14°C confirms exothermic neutralization.', narrationText: 'Temperature rises by 14 degrees confirming the exothermic nature of acid-base neutralization.', cameraView: 'wide', activeEntityId: 'beaker', animationAction: 'idle', particleEffect: 'fire_smoke', readoutData: [{ label: 'Temp Rise', value: '+14.2°C' }, { label: 'Type', value: 'Exothermic' }] },
    ];
    return {
      type: '3d_scene', domain: 'Chemistry',
      title: 'Acid-Base Neutralization Chemical Reaction Simulation',
      subtitle: 'Ionic Dissociation & Exothermic Neutralization Chemistry',
      summaryText: 'Simulating HCl and NaOH dissociation, H⁺ and OH⁻ ion collision, neutralization reaction and NaCl salt formation.',
      voiceNarrationText: 'Simulating acid-base neutralization — ionic collision, salt formation, and exothermic heat release.',
      scenarioData: { scenarioTitle: 'HCl + NaOH Acid-Base Neutralization', environment: 'laboratory', entities, steps, observations: ['Strong acids and bases fully dissociate in aqueous solution.', 'Neutralization releases 57.3 kJ/mol of heat energy.', 'Product is salt (NaCl) + water at pH 7.'], takeawayConclusion: 'Acid-base neutralization is an exothermic ionic reaction where H⁺ and OH⁻ combine to form water, releasing heat and producing a neutral salt solution.' },
    };
  }

  // Preset 8: Tornado / Weather
  public static getTornadoPreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'tornado', name: 'EF5 Tornado Vortex', shape: 'cone', color: '#64748b', size: 2.5, position: { x: 0, y: 0, z: 0 } },
      { id: 'cumulonimbus', name: 'Supercell Thunderstorm', shape: 'sphere', color: '#1e293b', size: 4.0, position: { x: 0, y: -100, z: 0 } },
      { id: 'debris', name: 'Debris Field', shape: 'particle_cloud', color: '#92400e', size: 2.0, position: { x: 0, y: 40, z: 0 } },
      { id: 'updraft', name: 'Rotating Updraft Column', shape: 'wave', color: '#38bdf8', size: 1.5, position: { x: 0, y: -20, z: 0 }, glowing: true },
    ];
    const steps: SimulationStep[] = [
      { stepNumber: 1, title: 'STEP 1: Supercell Thunderstorm Formation', description: 'Cold dry air meets warm moist air creating violent atmospheric instability.', narrationText: 'A supercell thunderstorm forms as cold polar air collides with warm Gulf moisture, creating extreme atmospheric instability.', cameraView: 'wide', activeEntityId: 'cumulonimbus', animationAction: 'emit_particles', particleEffect: 'water_bubbles', readoutData: [{ label: 'Cloud Height', value: '15 km' }, { label: 'CAPE', value: '5,000 J/kg' }] },
      { stepNumber: 2, title: 'STEP 2: Mesocyclone Rotation Begins', description: 'Wind shear causes rotating updraft — the mesocyclone — inside the storm.', narrationText: 'Vertical wind shear causes horizontal air to tilt, creating a rotating updraft called a mesocyclone at 3 km altitude.', cameraView: 'close_up', activeEntityId: 'updraft', animationAction: 'rotate', particleEffect: 'energy_waves', readoutData: [{ label: 'Rotation', value: '120 km/h' }, { label: 'Diameter', value: '10 km' }] },
      { stepNumber: 3, title: 'STEP 3: Funnel Cloud Descends', description: 'Low pressure vortex extends from the cloud base toward the ground.', narrationText: 'The rotating column of air extends downward as a funnel cloud, driven by the extreme low-pressure vortex core.', cameraView: 'cinematic', activeEntityId: 'tornado', animationAction: 'move', particleEffect: 'sparks', readoutData: [{ label: 'Core Pressure', value: '850 mbar' }, { label: 'Wind Speed', value: '320 km/h' }] },
      { stepNumber: 4, title: 'STEP 4: Ground Contact & EF5 Devastation', description: 'Tornado touches down with EF5 wind speeds exceeding 320 km/h.', narrationText: 'Tornado touches ground at EF5 intensity. Wind speeds exceed 320 km/h, capable of sweeping entire structures away.', cameraView: 'wide', activeEntityId: 'debris', animationAction: 'explode', particleEffect: 'fire_smoke', readoutData: [{ label: 'Category', value: 'EF5' }, { label: 'Winds', value: '320+ km/h' }] },
      { stepNumber: 5, title: 'STEP 5: Dissipation & Rope Stage', description: 'As storm weakens, tornado elongates into rope stage and dissipates.', narrationText: 'As the parent thunderstorm weakens, the tornado elongates into a thin rope before dissipating completely.', cameraView: 'wide', activeEntityId: 'tornado', animationAction: 'transform', readoutData: [{ label: 'Stage', value: 'Rope Tornado' }, { label: 'Lifespan', value: '15-60 min' }] },
    ];
    return {
      type: '3d_scene', domain: 'Physics',
      title: 'Tornado Formation & Atmospheric Dynamics Simulation',
      subtitle: 'Meteorology, Wind Shear & Supercell Thunderstorm Physics',
      summaryText: 'Simulating supercell storm formation, mesocyclone rotation, funnel cloud descent, EF5 tornado touchdown and dissipation.',
      voiceNarrationText: 'Simulating tornado formation — from supercell thunderstorm to EF5 funnel cloud touchdown.',
      scenarioData: { scenarioTitle: 'Tornado Formation & Mesocyclone Dynamics', environment: 'nature', entities, steps, observations: ['Tornadoes form inside supercell thunderstorms with strong vertical wind shear.', 'EF5 tornadoes have wind speeds exceeding 320 km/h.', 'Rope stage signals weakening of the parent mesocyclone.'], takeawayConclusion: 'Tornadoes are rotating atmospheric vortices powered by thermodynamic instability between warm moist and cold dry air masses, sustained by mesocyclone rotation inside a supercell storm.' },
    };
  }

  // Preset 9: Bridge Engineering
  public static getBridgeEngineeringPreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'deck', name: 'Bridge Deck (Roadway)', shape: 'cube', color: '#94a3b8', size: 3.5, position: { x: 0, y: 0, z: 0 } },
      { id: 'cable', name: 'Suspension Cables', shape: 'wave', color: '#f59e0b', size: 2.0, position: { x: 0, y: -40, z: 0 }, glowing: true },
      { id: 'tower', name: 'Main Support Pylon Tower', shape: 'cylinder', color: '#1e293b', size: 2.0, position: { x: 0, y: -80, z: 0 } },
      { id: 'force_vectors', name: 'Load Force Vectors', shape: 'particle_cloud', color: '#ef4444', size: 1.5, position: { x: 0, y: 20, z: 0 }, glowing: true },
    ];
    const steps: SimulationStep[] = [
      { stepNumber: 1, title: 'STEP 1: Foundation & Anchor Block Construction', description: 'Massive concrete anchor blocks embedded in bedrock secure the cable ends.', narrationText: 'Anchor blocks embedded 30 meters into bedrock resist the immense cable tension of 100,000 tonnes per cable.', cameraView: 'wide', activeEntityId: 'tower', animationAction: 'idle', particleEffect: 'glow_aura', readoutData: [{ label: 'Anchor Depth', value: '30 m into rock' }, { label: 'Tension', value: '100,000 tonnes' }] },
      { stepNumber: 2, title: 'STEP 2: Pylon Tower Erection', description: 'Steel and concrete towers rise 300 meters above the river to support cables.', narrationText: 'The main pylon towers rise 300 meters, constructed using jumping formwork and high-strength concrete in 3-meter lifts.', cameraView: 'close_up', activeEntityId: 'tower', animationAction: 'move', particleEffect: 'sparks', readoutData: [{ label: 'Tower Height', value: '300 m' }, { label: 'Concrete', value: '35,000 m³' }] },
      { stepNumber: 3, title: 'STEP 3: Cable Spinning & Tensioning', description: 'Main cables composed of thousands of high-strength steel wire strands are spun.', narrationText: 'Each main cable is spun from 27,000 individual steel wires of 5mm diameter, bundled into a 1-meter diameter cable.', cameraView: 'cinematic', activeEntityId: 'cable', animationAction: 'rotate', particleEffect: 'light_beam', readoutData: [{ label: 'Wires/Cable', value: '27,000 wires' }, { label: 'Cable Diameter', value: '1.0 m' }] },
      { stepNumber: 4, title: 'STEP 4: Deck Load Distribution Analysis', description: 'Finite element analysis shows how live traffic loads distribute across cables.', narrationText: 'As traffic loads the deck, forces transfer through hangers to the main cables and down to the anchor blocks.', cameraView: 'top_view', activeEntityId: 'force_vectors', animationAction: 'emit_particles', particleEffect: 'energy_waves', readoutData: [{ label: 'Dead Load', value: '30,000 tonnes' }, { label: 'Live Load', value: '5,000 tonnes' }] },
      { stepNumber: 5, title: 'STEP 5: Wind Aeroelastic Flutter Analysis', description: 'Engineers model bridge oscillation under high wind conditions to prevent resonance.', narrationText: 'Aeroelastic analysis ensures the bridge cannot resonate with wind frequencies — the lesson of the Tacoma Narrows collapse.', cameraView: 'wide', activeEntityId: 'deck', animationAction: 'transform', particleEffect: 'water_bubbles', readoutData: [{ label: 'Design Wind', value: '250 km/h' }, { label: 'Damping', value: 'Tuned Mass Dampers' }] },
      { stepNumber: 6, title: 'STEP 6: Structural Integrity & Lifespan', description: 'Final bridge engineered for 100-year operational lifespan under all load conditions.', narrationText: 'Completed suspension bridge engineered for a 100-year design life, with corrosion-protected cables and seismic isolation.', cameraView: 'wide', activeEntityId: 'deck', animationAction: 'idle', readoutData: [{ label: 'Span Length', value: '1,991 m' }, { label: 'Design Life', value: '100 years' }] },
    ];
    return {
      type: '3d_scene', domain: 'Architecture',
      title: 'Suspension Bridge Engineering & Structural Analysis Simulation',
      subtitle: 'Civil Engineering, Load Distribution & Structural Mechanics',
      summaryText: 'Simulating suspension bridge construction: anchor blocks, pylon towers, cable spinning, deck loading, and aeroelastic analysis.',
      voiceNarrationText: 'Simulating suspension bridge engineering — from foundation to cable tension, load distribution and wind flutter analysis.',
      scenarioData: { scenarioTitle: 'Suspension Bridge Construction & Load Analysis', environment: 'blueprint', entities, steps, observations: ['Main suspension cables experience 100,000 tonnes of tension force.', 'Cable composed of 27,000 individual 5mm high-strength steel wires.', 'Tuned Mass Dampers prevent resonance amplification under wind and traffic.'], takeawayConclusion: 'Suspension bridges work by transferring deck load forces through vertical hangers to the main cables, which in turn carry tension forces to massive anchor blocks embedded in bedrock.' },
    };
  }

  // Universal Fallback Generator for ANY Scenario prompt!
  public static getGenericScenario(input: string | UniversalScenarioInput): RepresentationPayload {
    const rawTitle = typeof input === 'object' && input.scenarioTitle ? input.scenarioTitle : typeof input === 'string' ? input : 'Universal Scenario Simulation';
    const env = typeof input === 'object' && input.environment ? input.environment : 'studio';
    const desc = typeof input === 'object' && input.description ? input.description : `Interactive 3D simulation demonstrating ${rawTitle}.`;

    const entities: SimulationEntity[] = [
      { id: 'primary_obj', name: rawTitle, shape: 'sphere', color: '#06b6d4', size: 2.5, position: { x: 0, y: 0, z: 0 }, glowing: true },
      { id: 'secondary_obj', name: 'Interaction Field', shape: 'ring', color: '#3b82f6', size: 3.5, position: { x: 0, y: 0, z: 0 } },
      { id: 'particle_obj', name: 'Energy Particles', shape: 'particle_cloud', color: '#f59e0b', size: 1.5, position: { x: 0, y: 40, z: 0 }, glowing: true },
    ];

    const steps: SimulationStep[] = [
      {
        stepNumber: 1,
        title: 'STEP 1: Environment & Initial State Setup',
        description: `Initializing visual simulation space for ${rawTitle}.`,
        narrationText: `Welcome to the Universal AI Scenario Simulation. Setting up environment for ${rawTitle}.`,
        cameraView: 'wide',
        activeEntityId: 'primary_obj',
        particleEffect: 'glow_aura',
        readoutData: [{ label: 'Status', value: 'Initialized' }, { label: 'System Energy', value: '100%' }],
      },
      {
        stepNumber: 2,
        title: 'STEP 2: Primary Motion & Interaction Activation',
        description: 'Activating physical motion parameters and entity forces.',
        narrationText: 'Activating scenario interactions and observing primary physical forces.',
        cameraView: 'close_up',
        activeEntityId: 'primary_obj',
        particleEffect: 'energy_waves',
        readoutData: [{ label: 'Activity', value: 'Active Motion' }],
      },
      {
        stepNumber: 3,
        title: 'STEP 3: Dynamic Transformation & Effects',
        description: 'Visualizing key transformations, particle emissions, and structural changes.',
        narrationText: 'Observe dynamic transformations and state transitions in progress.',
        cameraView: 'cinematic',
        activeEntityId: 'particle_obj',
        particleEffect: 'fire_smoke',
        readoutData: [{ label: 'Transformation', value: 'In Progress' }],
      },
      {
        stepNumber: 4,
        title: 'STEP 4: Microscopic / Close-Up Detailed Zoom',
        description: 'Zooming into micro-entity structures and fundamental components.',
        narrationText: 'Microscopic view: Zooming into fundamental component interactions.',
        cameraView: 'microscopic_zoom',
        activeEntityId: 'primary_obj',
        particleEffect: 'atomic_particles',
        readoutData: [{ label: 'Zoom Level', value: '1,000x Micro' }],
      },
      {
        stepNumber: 5,
        title: 'STEP 5: Return to Full Perspective & Final State',
        description: 'Returning to wide perspective to observe final system equilibrium.',
        narrationText: 'Returning to full perspective. Scenario reaching final equilibrium state.',
        cameraView: 'wide',
        activeEntityId: 'primary_obj',
        readoutData: [{ label: 'State', value: 'Equilibrium' }],
      },
      {
        stepNumber: 6,
        title: 'STEP 6: Scenario Summary & Scientific Insights',
        description: 'Displaying quantitative readouts and core takeaways.',
        narrationText: 'Simulation complete. Reviewing key insights and system takeaways.',
        cameraView: 'wide',
        readoutData: [{ label: 'Simulation', value: 'Complete' }],
      },
    ];

    return {
      type: '3d_scene',
      domain: 'General',
      title: rawTitle,
      subtitle: 'Dynamic AI Animated 3D Simulation',
      summaryText: desc,
      voiceNarrationText: `Simulating ${rawTitle}. Following 6-step interactive visual simulation timeline.`,
      scenarioData: {
        scenarioTitle: rawTitle,
        environment: env,
        entities,
        steps,
        observations: [
          `Visualized dynamic animated scenario for "${rawTitle}".`,
          'Mapped physical entity interactions, particle effects, and camera angle shifts.',
          'Microscopic zoom isolated fundamental component dynamics.',
        ],
        takeawayConclusion: `Successfully generated universal interactive AI scenario simulation for ${rawTitle}.`,
      },
    };
  }
}
