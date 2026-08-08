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
  shape: 'sphere' | 'cube' | 'cylinder' | 'cone' | 'rocket' | 'atom' | 'ring' | 'wave' | 'particle_cloud' | 'custom' | 'heart' | 'car' | 'water_bottle' | 'solar_panel' | 'airplane' | 'drone' | 'wind_turbine' | 'robot_arm' | 'magnet' | 'earthquake' | 'black_hole' | 'chloroplast' | 'piston' | 'dna' | 'volcano' | 'prism' | 'gear' | 'circuit' | 'planet' | 'leaf_cell';
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

    // ── Heart & Blood Circulation ─────────────────────────────────────────
    if (lower.includes('heart') || lower.includes('blood') || lower.includes('cardiac') || lower.includes('pulse') || lower.includes('aorta') || lower.includes('ventricle') || lower.includes('atrium') || lower.includes('circulatory')) {
      return this.getHeartCirculationPreset();
    }

    // ── Car Engine & Vehicle Dynamics ─────────────────────────────────────
    if (lower.includes('car') || lower.includes('vehicle') || lower.includes('automobile') || lower.includes('sports car') || lower.includes('race car') || lower.includes('drive train') || lower.includes('ev motor') || lower.includes('wheel friction')) {
      return this.getCarVehiclePreset();
    }

    // ── Water Bottle & Liquid Dynamics ─────────────────────────────────────
    if (lower.includes('water bottle') || lower.includes('bottle') || lower.includes('fluid') || lower.includes('pouring') || lower.includes('liquid fill') || lower.includes('beverage') || lower.includes('flask')) {
      return this.getWaterBottleFluidPreset();
    }

    // ── Photosynthesis & Chloroplast Biology ──────────────────────────────
    if (lower.includes('photosynthesis') || lower.includes('chloroplast') || lower.includes('plant cell') || lower.includes('leaf energy') || lower.includes('thylakoid') || lower.includes('glucose synthesis')) {
      return this.getPhotosynthesisPreset();
    }

    // ── Solar Panel & Photovoltaics ────────────────────────────────────────
    if (lower.includes('solar panel') || lower.includes('solar cell') || lower.includes('photovoltaic') || lower.includes('sunlight energy') || lower.includes('solar energy') || lower.includes('silicon wafer')) {
      return this.getSolarPanelPreset();
    }

    // ── Airplane Aerodynamics & Lift ──────────────────────────────────────
    if (lower.includes('airplane') || lower.includes('aerodynamics') || lower.includes('flight') || lower.includes('wing lift') || lower.includes('bernoulli') || lower.includes('jet engine') || lower.includes('aircraft')) {
      return this.getAirplaneAerodynamicsPreset();
    }

    // ── Quadcopter Drone Flight ───────────────────────────────────────────
    if (lower.includes('drone') || lower.includes('quadcopter') || lower.includes('propeller hover') || lower.includes('uav flight') || lower.includes('multirotor')) {
      return this.getDroneFlightPreset();
    }

    // ── Wind Turbine Green Energy ──────────────────────────────────────────
    if (lower.includes('wind turbine') || lower.includes('windmill') || lower.includes('wind energy') || lower.includes('renewable wind') || lower.includes('rotor blade')) {
      return this.getWindTurbinePreset();
    }

    // ── Robotic Arm Automation ────────────────────────────────────────────
    if (lower.includes('robot arm') || lower.includes('robotic') || lower.includes('industrial robot') || lower.includes('servo joint') || lower.includes('automation arm')) {
      return this.getRoboticArmPreset();
    }

    // ── Magnetism & Electromagnetic Field ──────────────────────────────────
    if (lower.includes('magnet') || lower.includes('magnetic') || lower.includes('magnetism') || lower.includes('lorentz') || lower.includes('electromagnetic field') || lower.includes('solenoid') || lower.includes('flux')) {
      return this.getMagnetismPreset();
    }

    // ── Earthquake & Tectonic Waves ───────────────────────────────────────
    if (lower.includes('earthquake') || lower.includes('seismic') || lower.includes('tectonic') || lower.includes('fault line') || lower.includes('tsunami wave') || lower.includes('richter')) {
      return this.getEarthquakeSeismicPreset();
    }

    // ── Black Hole & Relativity ───────────────────────────────────────────
    if (lower.includes('black hole') || lower.includes('event horizon') || lower.includes('singularity') || lower.includes('gravitational lensing') || lower.includes('accretion disk') || lower.includes('hawking radiation')) {
      return this.getBlackHolePreset();
    }

    // ── Space & Astronomy ──────────────────────────────────────────────────
    if (lower.includes('rocket') || lower.includes('space') || lower.includes('orbit') || lower.includes('saturn') || lower.includes('nasa') || lower.includes('moon') || lower.includes('mars') || lower.includes('solar system') || lower.includes('astronaut') || lower.includes('galaxy')) {
      return this.getSpaceRocketPreset();
    }

    // ── Geology & Volcanoes ───────────────────────────────────────────────
    if (lower.includes('volcano') || lower.includes('volcanic') || lower.includes('eruption') || lower.includes('lava') || lower.includes('magma')) {
      return this.getVolcanoEruptionPreset();
    }

    // ── Nuclear & Atomic Physics ───────────────────────────────────────────
    if (lower.includes('nuclear') || lower.includes('atom') || lower.includes('fission') || lower.includes('fusion') || lower.includes('radioactive') || lower.includes('neutron') || lower.includes('proton') || lower.includes('electron')) {
      return this.getNuclearFissionPreset();
    }

    // ── Chemical Reactions ────────────────────────────────────────────────
    if (lower.includes('chemical reaction') || lower.includes('acid') || lower.includes('base') || lower.includes('reaction') || lower.includes('molecule') || lower.includes('compound') || lower.includes('titration') || lower.includes('oxidation')) {
      return this.getChemicalReactionPreset();
    }

    // ── Mechanical Engineering (Piston) ───────────────────────────────────
    if (lower.includes('piston') || lower.includes('engine stroke') || lower.includes('combustion chamber') || lower.includes('crankshaft')) {
      return this.getEnginePistonPreset();
    }

    // ── Biology & DNA ─────────────────────────────────────────────────────
    if (lower.includes('dna') || lower.includes('double helix') || lower.includes('genetics') || lower.includes('gene replication') || lower.includes('virus') || lower.includes('bacteria')) {
      return this.getDNAReplicationPreset();
    }

    // ── Optics & Wave Physics ──────────────────────────────────────────────
    if (lower.includes('pendulum') || lower.includes('harmonic wave') || lower.includes('refraction') || lower.includes('prism') || lower.includes('optics') || lower.includes('light ray')) {
      return this.getPhysicsWavePreset();
    }

    // ── Weather & Tornado ──────────────────────────────────────────────────
    if (lower.includes('tornado') || lower.includes('hurricane') || lower.includes('cyclone') || lower.includes('thunder') || lower.includes('lightning') || lower.includes('storm')) {
      return this.getTornadoPreset();
    }

    // ── Bridge & Civil Engineering ─────────────────────────────────────────
    if (lower.includes('bridge') || lower.includes('truss') || lower.includes('suspension bridge') || lower.includes('civil structure')) {
      return this.getBridgeEngineeringPreset();
    }

    // ── Generic Universal Fallback — intelligently builds dynamic scenario from user input ──
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

  // Preset 10: Heart & Blood Circulation
  public static getHeartCirculationPreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'heart', name: '4-Chamber Heart', shape: 'heart', color: '#ef4444', size: 2.2, position: { x: 0, y: 0, z: 0 }, glowing: true },
      { id: 'blood', name: 'Oxygenated Blood Flow', shape: 'particle_cloud', color: '#dc2626', size: 1.8, position: { x: 0, y: 30, z: 0 } },
      { id: 'aorta', name: 'Main Aorta Vessel', shape: 'wave', color: '#3b82f6', size: 1.5, position: { x: 0, y: -40, z: 0 } },
    ];
    const steps: SimulationStep[] = [
      { stepNumber: 1, title: 'STEP 1: Deoxygenated Blood Returns via Vena Cava', description: 'Deoxygenated blood enters the Right Atrium from superior and inferior vena cava.', narrationText: 'Deoxygenated blood from body tissues flows into the right atrium of the heart.', cameraView: 'wide', activeEntityId: 'heart', animationAction: 'idle', particleEffect: 'water_bubbles', readoutData: [{ label: 'Heart Rate', value: '72 BPM' }, { label: 'Pressure', value: '80 mmHg' }] },
      { stepNumber: 2, title: 'STEP 2: Atrial Contraction & Tricuspid Valve Open', description: 'Right atrium contracts, forcing blood through tricuspid valve into Right Ventricle.', narrationText: 'Right atrium contracts, pushing blood through the tricuspid valve into the right ventricle.', cameraView: 'close_up', activeEntityId: 'heart', animationAction: 'move', particleEffect: 'glow_aura', readoutData: [{ label: 'Stroke Vol', value: '70 mL' }, { label: 'Phase', value: 'Diastole' }] },
      { stepNumber: 3, title: 'STEP 3: Right Ventricle Pumping to Lungs', description: 'Right ventricle pumps blood through pulmonary artery to lungs for oxygenation.', narrationText: 'Right ventricle contracts, sending blood to the lungs where carbon dioxide is exchanged for oxygen.', cameraView: 'cinematic', activeEntityId: 'blood', animationAction: 'emit_particles', particleEffect: 'sparks', readoutData: [{ label: 'O₂ Saturation', value: '98%' }, { label: 'Flow Rate', value: '5.0 L/min' }] },
      { stepNumber: 4, title: 'STEP 4: Left Ventricle Systole & Aortic Ejection', description: 'Oxygen-rich blood from lungs enters Left Ventricle and is violently ejected into Aorta.', narrationText: 'Left ventricle undergoes powerful contraction, driving oxygen-rich blood into the aorta at 120 mmHg pressure.', cameraView: 'close_up', activeEntityId: 'heart', animationAction: 'collide', particleEffect: 'fire_smoke', readoutData: [{ label: 'Systolic P', value: '120 mmHg' }, { label: 'Output', value: '5.2 L/min' }] },
      { stepNumber: 5, title: 'STEP 5: Systemic Arterial Circulation', description: 'High-pressure blood flows through arteries to deliver O₂ and nutrients to cells.', narrationText: 'Blood flows through systemic arterial network delivering oxygen and nutrients to every living cell.', cameraView: 'wide', activeEntityId: 'aorta', animationAction: 'transform', particleEffect: 'energy_waves', readoutData: [{ label: 'Circulation', value: 'Complete' }, { label: 'Pulse', value: 'Normal Synced' }] },
    ];
    return {
      type: '3d_scene', domain: 'Biology',
      title: 'Human Heart & Blood Circulation Simulation',
      subtitle: 'Cardiovascular Mechanics, Cardiac Cycle & Hemodynamics',
      summaryText: 'Simulating the 4-chamber human heart: atrial filling, ventricular systole, pulmonary oxygenation, and aortic systemic circulation.',
      voiceNarrationText: 'Simulating cardiac cycle and blood circulation — right atrium filling, pulmonary oxygen exchange, and aortic ejection.',
      scenarioData: { scenarioTitle: 'Cardiac Cycle & Systemic Hemodynamics', environment: 'microscopic', entities, steps, observations: ['Human heart pumps ~5 liters of blood per minute at rest.', 'Systolic pressure reaches 120 mmHg during left ventricular ejection.', 'Tricuspid and mitral valves prevent retrograde blood flow.'], takeawayConclusion: 'The heart acts as a dual-stage muscular pump maintaining continuous one-way circulation of oxygenated blood through the cardiovascular system.' },
    };
  }

  // Preset 11: Car & Engine Vehicle Physics
  public static getCarVehiclePreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'car', name: 'High-Performance Sports Car', shape: 'car', color: '#ef4444', size: 2.5, position: { x: 0, y: 0, z: 0 }, glowing: true },
      { id: 'engine', name: 'Internal Combustion Engine', shape: 'piston', color: '#06b6d4', size: 1.8, position: { x: -60, y: 20, z: 0 } },
      { id: 'wheel', name: 'Drive Wheel Axle', shape: 'gear', color: '#f59e0b', size: 1.5, position: { x: 60, y: -20, z: 0 } },
    ];
    const steps: SimulationStep[] = [
      { stepNumber: 1, title: 'STEP 1: Vehicle Ignition & Powertrain Ready', description: 'Fuel injection system primes engine cylinders; electrical bus energized.', narrationText: 'Vehicle power system initialized. Fuel injection system primes the combustion cylinders.', cameraView: 'wide', activeEntityId: 'car', animationAction: 'idle', particleEffect: 'glow_aura', readoutData: [{ label: 'Engine RPM', value: '900 Idle' }, { label: 'Battery', value: '13.8 V' }] },
      { stepNumber: 2, title: 'STEP 2: Fuel Combustion & Piston Power Stroke', description: 'Air-fuel mixture ignites in cylinder, forcing piston down crankshaft.', narrationText: 'Air and fuel ignite in the combustion chamber. Rapid expanding gas drives the piston down, converting chemical energy to rotational mechanical torque.', cameraView: 'close_up', activeEntityId: 'engine', animationAction: 'move', particleEffect: 'fire_smoke', readoutData: [{ label: 'Torque', value: '450 Nm' }, { label: 'RPM', value: '4,500' }] },
      { stepNumber: 3, title: 'STEP 3: Transmission Torque Transfer', description: 'Transmission gearbox multiplies crankshaft torque to drive wheels.', narrationText: 'The transmission gearbox multiplies torque, driving the propeller shaft and differential axle.', cameraView: 'close_up', activeEntityId: 'wheel', animationAction: 'rotate', particleEffect: 'sparks', readoutData: [{ label: 'Gear Ratio', value: '3.42:1' }, { label: 'Drive', value: 'RWD Active' }] },
      { stepNumber: 4, title: 'STEP 4: Tire Friction & Aerodynamic Acceleration', description: 'Tire rubber friction grips tarmac, accelerating car from 0 to 100 km/h.', narrationText: 'Tire friction transfers 450 Newton meters of torque to the road surface, launching the vehicle forward.', cameraView: 'cinematic', activeEntityId: 'car', animationAction: 'move', particleEffect: 'energy_waves', readoutData: [{ label: 'Speed', value: '100 km/h' }, { label: '0-100 km/h', value: '3.4 s' }] },
      { stepNumber: 5, title: 'STEP 5: Aerodynamic Streamlines & Downforce', description: 'Airflow passes over spoiler generating aerodynamic downforce for high-speed stability.', narrationText: 'Aerodynamic bodywork generates downforce, pressing tires into the pavement for high-speed cornering stability.', cameraView: 'wide', activeEntityId: 'car', animationAction: 'idle', readoutData: [{ label: 'Drag Coeff (Cd)', value: '0.29' }, { label: 'Downforce', value: '250 kg' }] },
    ];
    return {
      type: '3d_scene', domain: 'Architecture',
      title: 'Automotive Mechanics & Vehicle Dynamics Simulation',
      subtitle: 'Internal Combustion, Powertrain Torque & Aerodynamics',
      summaryText: 'Simulating car powertrain mechanics: cylinder combustion, crankshaft torque transfer, gear reduction, and aerodynamic downforce.',
      voiceNarrationText: 'Simulating automotive physics — ignition, cylinder combustion power stroke, wheel torque, and aerodynamic airflow.',
      scenarioData: { scenarioTitle: 'Car Powertrain & Acceleration Dynamics', environment: 'studio', entities, steps, observations: ['Internal combustion converts fuel chemical energy into piston motion.', 'Transmission gearbox multiplies torque delivered to wheels.', 'Aerodynamic downforce increases tire grip at high velocities.'], takeawayConclusion: 'Automotive vehicle acceleration relies on converting internal combustion piston stroke power into wheel rotation while overcoming aerodynamic drag.' },
    };
  }

  // Preset 12: Water Bottle & Liquid Dynamics
  public static getWaterBottleFluidPreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'bottle', name: 'Ergonomic Water Bottle', shape: 'water_bottle', color: '#06b6d4', size: 2.2, position: { x: 0, y: 0, z: 0 }, glowing: true },
      { id: 'liquid', name: 'Purified Water Liquid', shape: 'sphere', color: '#38bdf8', size: 1.8, position: { x: 0, y: -20, z: 0 } },
    ];
    const steps: SimulationStep[] = [
      { stepNumber: 1, title: 'STEP 1: Water Bottle Fill & Volume Inspection', description: 'Container filled with 750 mL purified water; observing meniscus surface tension.', narrationText: 'Inspecting ergonomic water bottle container filled to 750 milliliters.', cameraView: 'wide', activeEntityId: 'bottle', animationAction: 'idle', particleEffect: 'water_bubbles', readoutData: [{ label: 'Volume', value: '750 mL' }, { label: 'Fill Level', value: '75%' }] },
      { stepNumber: 2, title: 'STEP 2: Fluid Hydrostatic Pressure Distribution', description: 'Hydrostatic pressure increases linearly with liquid depth P = ρgh.', narrationText: 'Hydrostatic pressure increases with depth, exerting outward force against the container walls.', cameraView: 'close_up', activeEntityId: 'liquid', animationAction: 'move', particleEffect: 'glow_aura', readoutData: [{ label: 'Pressure (P)', value: 'P = ρgh' }, { label: 'Bottom P', value: '2.4 kPa' }] },
      { stepNumber: 3, title: 'STEP 3: Cap Opening & Tilt Pouring Angle', description: 'Bottle tilts 45 degrees; liquid surface shifts while gravity draws stream out.', narrationText: 'As bottle tilts, liquid flows toward the spout driven by gravitational acceleration.', cameraView: 'cinematic', activeEntityId: 'bottle', animationAction: 'rotate', particleEffect: 'water_bubbles', readoutData: [{ label: 'Tilt Angle', value: '45°' }, { label: 'Pour Rate', value: '150 mL/s' }] },
      { stepNumber: 4, title: 'STEP 4: Laminar vs Turbulent Liquid Stream', description: 'Observing liquid stream dynamics and surface wave oscillations.', narrationText: 'Smooth laminar fluid flow exits nozzle under low Reynolds number conditions.', cameraView: 'close_up', activeEntityId: 'liquid', animationAction: 'emit_particles', particleEffect: 'sparks', readoutData: [{ label: 'Flow Type', value: 'Laminar' }, { label: 'Reynolds No.', value: 'Re = 1,400' }] },
      { stepNumber: 5, title: 'STEP 5: Thermal Insulation & Hydration Metric', description: 'Double-wall vacuum insulation maintains 4°C chilled water temperature.', narrationText: 'Vacuum insulated wall prevents thermal transfer, keeping water icy cold.', cameraView: 'wide', activeEntityId: 'bottle', animationAction: 'idle', readoutData: [{ label: 'Temp', value: '4.0°C' }, { label: 'Insulation', value: 'Vacuum Sealed' }] },
    ];
    return {
      type: '3d_scene', domain: 'Physics',
      title: 'Water Bottle & Fluid Dynamics Simulation',
      subtitle: 'Hydrostatics, Surface Tension & Liquid Pouring Physics',
      summaryText: 'Simulating water bottle container: fill level, hydrostatic pressure (P=ρgh), tilt pouring dynamics, and vacuum insulation.',
      voiceNarrationText: 'Simulating water bottle physics — liquid fill level, hydrostatic pressure distribution, pouring stream, and thermal insulation.',
      scenarioData: { scenarioTitle: 'Water Bottle Hydrostatics & Fluid Flow', environment: 'lab', entities, steps, observations: ['Hydrostatic pressure increases linearly with liquid column height.', 'Surface tension and gravity govern liquid pour stream dynamics.', 'Double-wall vacuum barrier minimizes thermal conduction.'], takeawayConclusion: 'Fluid containers manage hydrostatic pressure, surface tension, and laminar flow during pouring while providing thermal insulation.' },
    };
  }

  // Preset 13: Photosynthesis & Chloroplast Biology
  public static getPhotosynthesisPreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'chloroplast', name: 'Plant Cell Chloroplast', shape: 'chloroplast', color: '#10b981', size: 2.2, position: { x: 0, y: 0, z: 0 }, glowing: true },
      { id: 'photon', name: 'Sunlight Energy Photons', shape: 'prism', color: '#facc15', size: 1.5, position: { x: -60, y: 60, z: 0 } },
      { id: 'glucose', name: 'Synthesized Glucose Molecule', shape: 'atom', color: '#38bdf8', size: 1.8, position: { x: 60, y: -40, z: 0 } },
    ];
    const steps: SimulationStep[] = [
      { stepNumber: 1, title: 'STEP 1: Sunlight Photon Absorption in Thylakoid', description: 'Chlorophyll pigments inside thylakoid membranes absorb light energy at 680nm.', narrationText: 'Sunlight photons strike chlorophyll pigments in the thylakoid membrane, exciting electrons.', cameraView: 'wide', activeEntityId: 'photon', animationAction: 'emit_particles', particleEffect: 'light_beam', readoutData: [{ label: 'Wavelength', value: '680 nm (Red)' }, { label: 'Photon Energy', value: 'Light Absorbed' }] },
      { stepNumber: 2, title: 'STEP 2: Photolysis of Water (H₂O Splitting)', description: 'Light energy splits H₂O molecules into oxygen gas (O₂), protons (H⁺), and electrons.', narrationText: 'Photosystem II splits water molecules, releasing oxygen gas into the atmosphere while storing hydrogen protons.', cameraView: 'close_up', activeEntityId: 'chloroplast', animationAction: 'collide', particleEffect: 'water_bubbles', readoutData: [{ label: 'Photolysis', value: '2H₂O → O₂ + 4H⁺' }, { label: 'Byproduct', value: 'O₂ Released' }] },
      { stepNumber: 3, title: 'STEP 3: Electron Transport Chain & ATP Generation', description: 'Excited electrons pass down ETC powering ATP synthase to produce ATP and NADPH.', narrationText: 'High-energy electrons flow down transport proteins, pumping protons to drive ATP synthase energy generation.', cameraView: 'cinematic', activeEntityId: 'chloroplast', animationAction: 'rotate', particleEffect: 'sparks', readoutData: [{ label: 'Energy Molecules', value: 'ATP + NADPH' }, { label: 'Proton Gradient', value: 'Active' }] },
      { stepNumber: 4, title: 'STEP 4: Calvin Cycle & Carbon Fixation (CO₂ → Glucose)', description: 'Rubisco enzyme fixes carbon dioxide into 3-PGA, synthesizing glucose C₆H₁₂O₆.', narrationText: 'In the stroma, Calvin cycle enzymes fix atmospheric carbon dioxide, consuming ATP to synthesize glucose.', cameraView: 'microscopic_zoom', activeEntityId: 'glucose', animationAction: 'transform', particleEffect: 'glow_aura', readoutData: [{ label: 'Calvin Cycle', value: '6CO₂ → C₆H₁₂O₆' }, { label: 'Glucose Yield', value: '1 Mol' }] },
      { stepNumber: 5, title: 'STEP 5: Plant Biomass & Oxygen Release Equilibrium', description: 'Plant cell stores glucose as starch while oxygen gas diffuses out of stomata.', narrationText: 'Photosynthesis complete. Oxygen is released to support planetary life while glucose fuels plant growth.', cameraView: 'wide', activeEntityId: 'chloroplast', animationAction: 'idle', readoutData: [{ label: 'Efficiency', value: 'Quantum Yield ~95%' }, { label: 'Atmosphere O₂', value: 'Sustained' }] },
    ];
    return {
      type: '3d_scene', domain: 'Biology',
      title: 'Photosynthesis & Solar Plant Energetics Simulation',
      subtitle: 'Light-Dependent Reactions, Calvin Cycle & Chloroplast Physics',
      summaryText: 'Simulating photosynthesis inside chloroplast: photon absorption, water photolysis, ATP synthase ETC, and Calvin cycle glucose synthesis.',
      voiceNarrationText: 'Simulating plant photosynthesis — thylakoid photon absorption, water splitting photolysis, and Calvin cycle carbon fixation into glucose.',
      scenarioData: { scenarioTitle: 'Thylakoid Light Reaction & Calvin Cycle', environment: 'nature', entities, steps, observations: ['Sunlight photons split water molecules producing atmospheric O₂.', 'Electron transport chain generates ATP and NADPH chemical energy.', 'Calvin cycle fixes CO₂ into glucose (C₆H₁₂O₆) for cellular energy.'], takeawayConclusion: 'Photosynthesis converts solar light energy into chemical energy stored in glucose molecules while liberating oxygen essential for animal respiration.' },
    };
  }

  // Preset 14: Solar Panel & Photovoltaics
  public static getSolarPanelPreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'panel', name: 'Silicon Photovoltaic Solar Panel', shape: 'solar_panel', color: '#1e3a5f', size: 2.5, position: { x: 0, y: 0, z: 0 }, glowing: true },
      { id: 'sun', name: 'Sunlight Solar Rays', shape: 'prism', color: '#facc15', size: 1.6, position: { x: 0, y: 60, z: 0 } },
      { id: 'electrons', name: 'Flowing DC Electric Current', shape: 'circuit', color: '#38bdf8', size: 1.5, position: { x: 0, y: -40, z: 0 } },
    ];
    const steps: SimulationStep[] = [
      { stepNumber: 1, title: 'STEP 1: Sunlight Photons Hit Silicon P-N Junction', description: 'Sunlight photons strike anti-reflective coating of silicon solar cell.', narrationText: 'Solar radiation strikes the silicon photovoltaic cell. Photons pass into the P-N junction.', cameraView: 'wide', activeEntityId: 'panel', animationAction: 'idle', particleEffect: 'light_beam', readoutData: [{ label: 'Irradiance', value: '1,000 W/m²' }, { label: 'Bandgap', value: '1.1 eV' }] },
      { stepNumber: 2, title: 'STEP 2: Photovoltaic Effect & Electron Hole Pairs', description: 'Photons with energy > 1.1eV knock valence electrons free, creating electron-hole pairs.', narrationText: 'Photons absorb into silicon, knocking valence electrons free to create mobile electron-hole pairs.', cameraView: 'close_up', activeEntityId: 'sun', animationAction: 'emit_particles', particleEffect: 'sparks', readoutData: [{ label: 'Excited e⁻', value: '10¹⁸ /sec' }, { label: 'V_open', value: '0.65 V' }] },
      { stepNumber: 3, title: 'STEP 3: Electric Field Drift & Current Collection', description: 'Internal electric field at P-N junction forces free electrons to N-type layer.', narrationText: 'Built-in electric field at the depletion region forces free electrons upward into metallic grid contacts.', cameraView: 'cinematic', activeEntityId: 'electrons', animationAction: 'move', particleEffect: 'energy_waves', readoutData: [{ label: 'Cell Voltage', value: '0.6 V' }, { label: 'Current I', value: '8.5 A' }] },
      { stepNumber: 4, title: 'STEP 4: DC Power Generation & Inverter Conversion', description: 'Direct current (DC) flows through inverter to convert into 230V AC grid power.', narrationText: 'DC current flows to solar inverter, converting direct current into 230-volt AC power for grid supply.', cameraView: 'close_up', activeEntityId: 'panel', animationAction: 'rotate', particleEffect: 'glow_aura', readoutData: [{ label: 'DC Power', value: '400 W' }, { label: 'Inverter Eff', value: '98.5%' }] },
      { stepNumber: 5, title: 'STEP 5: Clean Renewable Grid Supply', description: 'Clean zero-emission electricity powers homes and reduces carbon footprint.', narrationText: 'Solar power system supplies clean renewable energy to the electrical grid with zero carbon emissions.', cameraView: 'wide', activeEntityId: 'panel', animationAction: 'idle', readoutData: [{ label: 'Panel Eff', value: '22.8%' }, { label: 'CO₂ Saved', value: '0.5 kg/kWh' }] },
    ];
    return {
      type: '3d_scene', domain: 'Physics',
      title: 'Solar Panel Photovoltaic Energy Simulation',
      subtitle: 'Semiconductor P-N Junction, Photovoltaic Effect & Clean Power',
      summaryText: 'Simulating photovoltaic solar cell: photon bandgap excitation, electron-hole separation, internal electric field drift, and DC power generation.',
      voiceNarrationText: 'Simulating solar panel photovoltaics — photon absorption, electron excitation across P-N junction, and green electricity generation.',
      scenarioData: { scenarioTitle: 'Photovoltaic P-N Junction Energy Harvest', environment: 'studio', entities, steps, observations: ['Silicon bandgap of 1.1 eV absorbs visible solar spectrum.', 'Built-in electric field separates free electrons from positive holes.', 'Inverter converts DC solar power into 230V AC grid electricity.'], takeawayConclusion: 'Photovoltaic solar panels convert light photons directly into electrical current via electron excitation across semiconductor P-N junctions.' },
    };
  }

  // Preset 15: Airplane Aerodynamics & Wing Lift
  public static getAirplaneAerodynamicsPreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'wing', name: 'Aerodynamic Airfoil Wing', shape: 'airplane', color: '#94a3b8', size: 2.5, position: { x: 0, y: 0, z: 0 }, glowing: true },
      { id: 'airflow', name: 'Airflow Streamlines', shape: 'wave', color: '#38bdf8', size: 2.0, position: { x: 0, y: 20, z: 0 } },
      { id: 'lift_force', name: 'Aerodynamic Lift Vector', shape: 'prism', color: '#10b981', size: 1.5, position: { x: 0, y: -40, z: 0 }, glowing: true },
    ];
    const steps: SimulationStep[] = [
      { stepNumber: 1, title: 'STEP 1: Airfoil Placement & Relative Wind Velocity', description: 'Curved camber airfoil positioned in wind tunnel stream at 5-degree angle of attack.', narrationText: 'Airfoil wing model positioned in airflow stream at a 5-degree angle of attack.', cameraView: 'wide', activeEntityId: 'wing', animationAction: 'idle', particleEffect: 'water_bubbles', readoutData: [{ label: 'Airspeed', value: '250 km/h' }, { label: 'Angle (α)', value: '5.0°' }] },
      { stepNumber: 2, title: 'STEP 2: Bernoulli Differential Flow Velocity', description: 'Air over curved top surface travels faster, creating lower static pressure P_top.', narrationText: 'Air flowing over the curved upper surface accelerates, creating a low pressure zone per Bernoulli’s principle.', cameraView: 'close_up', activeEntityId: 'airflow', animationAction: 'emit_particles', particleEffect: 'energy_waves', readoutData: [{ label: 'Top Velocity', value: '310 km/h' }, { label: 'Pressure ΔP', value: '-8.5 kPa' }] },
      { stepNumber: 3, title: 'STEP 3: Downwash & Newton’s Third Law Deflection', description: 'Trailing edge deflects air downward; equal and opposite reaction forces wing up.', narrationText: 'Air is deflected downward by the wing profile, generating reactive upward lift per Newton’s third law.', cameraView: 'cinematic', activeEntityId: 'lift_force', animationAction: 'move', particleEffect: 'sparks', readoutData: [{ label: 'Lift Force (L)', value: '150 kN' }, { label: 'Drag Force (D)', value: '12 kN' }] },
      { stepNumber: 4, title: 'STEP 4: Wingtip Vortices & Induced Drag', description: 'High pressure under wing spills around wingtip creating trailing wake vortices.', narrationText: 'Pressure difference causes air to swirl around wingtips, forming vortex eddies that produce induced drag.', cameraView: 'close_up', activeEntityId: 'wing', animationAction: 'rotate', particleEffect: 'fire_smoke', readoutData: [{ label: 'L/D Ratio', value: '12.5' }, { label: 'Vortex Intensity', value: 'Moderate' }] },
      { stepNumber: 5, title: 'STEP 5: Stable Cruise Flight Equilibrium', description: 'Lift equals aircraft weight (L=W) and thrust equals drag (T=D) for stable flight.', narrationText: 'In steady level cruise, total lift balances aircraft weight while engine thrust overcomes aerodynamic drag.', cameraView: 'wide', activeEntityId: 'wing', animationAction: 'idle', readoutData: [{ label: 'Altitude', value: '10,000 m' }, { label: 'Mach No.', value: '0.78' }] },
    ];
    return {
      type: '3d_scene', domain: 'Physics',
      title: 'Airplane Aerodynamics & Wing Lift Simulation',
      subtitle: 'Bernoulli Principle, Airfoil Pressure Differential & Newtonian Lift',
      summaryText: 'Simulating aircraft aerodynamics: camber airfoil pressure differential, upper stream acceleration, downward air deflection, and lift vector generation.',
      voiceNarrationText: 'Simulating airplane wing lift — Bernoulli pressure differential, airflow velocity, and upward aerodynamic lift force.',
      scenarioData: { scenarioTitle: 'Airfoil Camber & Aerodynamic Lift Dynamics', environment: 'studio', entities, steps, observations: ['Curved top surface accelerates airflow creating low static pressure.', 'Air downward deflection generates upward reaction force (Newton III).', 'High Lift-to-Drag ratio ensures efficient steady cruise flight.'], takeawayConclusion: 'Aerodynamic lift is generated by pressure differences above and below a curved airfoil combined with downward momentum deflection of air streams.' },
    };
  }

  // Preset 16: Quadcopter Drone Flight
  public static getDroneFlightPreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'drone', name: 'Quadcopter Frame', shape: 'drone', color: '#06b6d4', size: 2.2, position: { x: 0, y: 0, z: 0 }, glowing: true },
      { id: 'rotors', name: '4 Counter-Rotating Propellers', shape: 'gear', color: '#f59e0b', size: 1.8, position: { x: 0, y: 20, z: 0 } },
    ];
    const steps: SimulationStep[] = [
      { stepNumber: 1, title: 'STEP 1: Pre-Flight Sensors & Gyro Alignment', description: 'IMU accelerometer & gyroscope sensors calibrate; flight controller armed.', narrationText: 'Drone flight controller armed. Gyroscope and accelerometer sensors calibrated.', cameraView: 'wide', activeEntityId: 'drone', animationAction: 'idle', particleEffect: 'glow_aura', readoutData: [{ label: 'GPS Lock', value: '14 Sats' }, { label: 'Battery', value: '98%' }] },
      { stepNumber: 2, title: 'STEP 2: Motor Thrust Equalization & Takeoff Hover', description: '4 brushless BLDC motors spin at 6,000 RPM, generating upward thrust to hover.', narrationText: 'All four brushless motors accelerate to 6,000 RPM, generating upward thrust that balances gravity for stable hover.', cameraView: 'close_up', activeEntityId: 'rotors', animationAction: 'rotate', particleEffect: 'water_bubbles', readoutData: [{ label: 'Motor Speed', value: '6,200 RPM' }, { label: 'Hover Thrust', value: '1.2 kg' }] },
      { stepNumber: 3, title: 'STEP 3: Pitch Differential Speed & Forward Motion', description: 'Rear motors spin faster than front motors, tilting drone forward to fly ahead.', narrationText: 'Rear propellers speed up relative to front propellers, tilting the drone forward to direct thrust for forward flight.', cameraView: 'cinematic', activeEntityId: 'drone', animationAction: 'move', particleEffect: 'sparks', readoutData: [{ label: 'Tilt Angle', value: '15° Forward' }, { label: 'Airspeed', value: '45 km/h' }] },
      { stepNumber: 4, title: 'STEP 4: Yaw Rotation (Torque Cancellation)', description: 'Diagonally opposite motor pairs change speed differential to execute yaw spin.', narrationText: 'Changing speed between clockwise and counter-clockwise motor pairs produces un-canceled torque for yaw rotation.', cameraView: 'close_up', activeEntityId: 'drone', animationAction: 'rotate', particleEffect: 'energy_waves', readoutData: [{ label: 'Yaw Rate', value: '90°/sec' }, { label: 'Torque Balance', value: 'PID Active' }] },
      { stepNumber: 5, title: 'STEP 5: GPS Position Hold & Precision Landing', description: 'Optical flow and barometer guide automated smooth vertical landing touchdown.', narrationText: 'Barometric pressure sensor and optical flow camera guide a smooth, stable precision landing.', cameraView: 'wide', activeEntityId: 'drone', animationAction: 'idle', readoutData: [{ label: 'Altitude', value: '0.0 m' }, { label: 'Status', value: 'Disarmed' }] },
    ];
    return {
      type: '3d_scene', domain: 'Architecture',
      title: 'Quadcopter Drone Flight & Aerodynamics Simulation',
      subtitle: 'BLDC Motor Thrust, Counter-Rotation Yaw & PID Stabilization',
      summaryText: 'Simulating quadcopter flight mechanics: 4-rotor thrust hover, motor differential speed pitch/roll control, and PID torque cancellation yaw.',
      voiceNarrationText: 'Simulating quadcopter drone flight — 4-rotor thrust hover, differential motor speed control, and multirotor stabilization.',
      scenarioData: { scenarioTitle: 'Quadcopter Multirotor Flight Control', environment: 'nature', entities, steps, observations: ['Counter-rotating propeller pairs cancel net reactive torque.', 'Varying front vs rear motor speed controls pitch and forward speed.', 'PID flight controller adjusts motor speeds 1,000 times per second.'], takeawayConclusion: 'Quadcopter flight control relies on precise RPM manipulation of four counter-rotating propellers to maneuver across 6 degrees of freedom.' },
    };
  }

  // Preset 17: Wind Turbine Green Energy
  public static getWindTurbinePreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'turbine', name: '100m Wind Turbine Generator', shape: 'wind_turbine', color: '#f8fafc', size: 2.5, position: { x: 0, y: 0, z: 0 }, glowing: true },
      { id: 'wind', name: 'Incoming Kinetic Wind Airflow', shape: 'wave', color: '#38bdf8', size: 2.0, position: { x: -60, y: 0, z: 0 } },
    ];
    const steps: SimulationStep[] = [
      { stepNumber: 1, title: 'STEP 1: Wind Stream Detection & Anemometer Pitch', description: 'Wind anemometer measures 12 m/s breeze; yaw motor aligns nacelle into wind.', narrationText: 'Anemometer detects 12 meters per second wind. Yaw drives rotate the nacelle to face directly into the wind direction.', cameraView: 'wide', activeEntityId: 'turbine', animationAction: 'idle', particleEffect: 'water_bubbles', readoutData: [{ label: 'Wind Speed', value: '12.5 m/s' }, { label: 'Yaw Angle', value: '0° Optimized' }] },
      { stepNumber: 2, title: 'STEP 2: Aerodynamic Rotor Blade Lift Rotation', description: 'Airflow over aerodynamic composite blades creates lift, spinning rotor hub.', narrationText: 'Airflow passing over the aerodynamic blade profile generates aerodynamic lift, rotating the 60-meter rotor blades.', cameraView: 'close_up', activeEntityId: 'turbine', animationAction: 'rotate', particleEffect: 'sparks', readoutData: [{ label: 'Rotor Speed', value: '14 RPM' }, { label: 'Blade Pitch', value: '4.5°' }] },
      { stepNumber: 3, title: 'STEP 3: Gearbox Speed Multiplication (1:100)', description: 'Internal gearbox steps up 14 RPM rotor rotation to 1,400 RPM for generator.', narrationText: 'Internal planetary gearbox increases low rotor RPM by 100 times to drive the high-speed electrical generator.', cameraView: 'cinematic', activeEntityId: 'turbine', animationAction: 'rotate', particleEffect: 'energy_waves', readoutData: [{ label: 'Gen Speed', value: '1,400 RPM' }, { label: 'Gear Ratio', value: '1:100' }] },
      { stepNumber: 4, title: 'STEP 4: Permanent Magnet Generator Power', description: 'Synchronous generator produces 3.5 MW electrical power sent down tower cables.', narrationText: 'The electromagnetic generator converts mechanical rotation into 3.5 megawatts of clean electrical power.', cameraView: 'close_up', activeEntityId: 'turbine', animationAction: 'emit_particles', particleEffect: 'glow_aura', readoutData: [{ label: 'Output Power', value: '3.5 MW' }, { label: 'Voltage', value: '690 V AC' }] },
      { stepNumber: 5, title: 'STEP 5: Transformer Substation Grid Export', description: 'Step-up transformer elevates voltage to 33 kV for long-distance power distribution.', narrationText: 'Tower base transformer steps voltage up to 33 kilovolts for distribution to thousands of green energy homes.', cameraView: 'wide', activeEntityId: 'turbine', animationAction: 'idle', readoutData: [{ label: 'Grid Power', value: '33 kV AC' }, { label: 'Betz Limit', value: '48.5% Eff' }] },
    ];
    return {
      type: '3d_scene', domain: 'Physics',
      title: 'Wind Turbine Green Energy Generator Simulation',
      subtitle: 'Aerodynamic Lift, Planetary Gearbox & Electromagnetic Power',
      summaryText: 'Simulating renewable wind turbine: wind aerodynamic lift, rotor hub rotation, planetary gearbox speed multiplication, and 3.5MW electrical generation.',
      voiceNarrationText: 'Simulating wind turbine green energy — aerodynamic blade rotation, gearbox speed multiplication, and 3.5MW electrical power generation.',
      scenarioData: { scenarioTitle: 'Wind Turbine Energy Conversion', environment: 'nature', entities, steps, observations: ['Wind kinetic energy is converted into aerodynamic blade lift force.', 'Planetary gearbox increases rotor rotation speed by 100x.', 'Max theoretical efficiency is bounded by Betz Limit (59.3%).'], takeawayConclusion: 'Wind turbines harvest kinetic wind energy using aerodynamic rotor blades, multiplying rotational speed through gearboxes to generate renewable grid electricity.' },
    };
  }

  // Preset 18: Robotic Arm Automation
  public static getRoboticArmPreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'arm', name: '6-DOF Industrial Robotic Arm', shape: 'robot_arm', color: '#06b6d4', size: 2.2, position: { x: 0, y: 0, z: 0 }, glowing: true },
      { id: 'target', name: 'Workpiece Component', shape: 'cube', color: '#f59e0b', size: 1.5, position: { x: 50, y: -20, z: 0 } },
    ];
    const steps: SimulationStep[] = [
      { stepNumber: 1, title: 'STEP 1: Kinematic Calibration & Home Position', description: 'Joint encoders calibrate zero positions; inverse kinematics solver initialized.', narrationText: 'Robotic arm initializes home position. Servo encoders and inverse kinematics engine ready.', cameraView: 'wide', activeEntityId: 'arm', animationAction: 'idle', particleEffect: 'glow_aura', readoutData: [{ label: 'DOF', value: '6 Axis' }, { label: 'Payload', value: '10 kg Max' }] },
      { stepNumber: 2, title: 'STEP 2: Joint Trajectory Planning & Reach', description: 'Servos rotate shoulder and elbow joints along smooth spline trajectory.', narrationText: 'Inverse kinematics calculates exact joint angles to trajectory-guide the end effector toward the target workpiece.', cameraView: 'close_up', activeEntityId: 'arm', animationAction: 'move', particleEffect: 'sparks', readoutData: [{ label: 'Wrist Speed', value: '1.2 m/s' }, { label: 'Precision', value: '±0.02 mm' }] },
      { stepNumber: 3, title: 'STEP 3: Pneumatic End-Effector Gripper Engagement', description: 'Pneumatic claw clamps around workpiece with force feedback sensing.', narrationText: 'Pneumatic end-effector closes around workpiece with closed-loop force feedback sensing.', cameraView: 'cinematic', activeEntityId: 'target', animationAction: 'collide', particleEffect: 'energy_waves', readoutData: [{ label: 'Grip Force', value: '150 N' }, { label: 'Status', value: 'Locked' }] },
      { stepNumber: 4, title: 'STEP 4: High-Speed Assembly Placement', description: 'Arm lifts workpiece, rotates 90 degrees, and inserts into chassis assembly.', narrationText: 'Robotic arm transfers component at high speed, executing precision insertion into chassis frame.', cameraView: 'close_up', activeEntityId: 'arm', animationAction: 'rotate', particleEffect: 'fire_smoke', readoutData: [{ label: 'Cycle Time', value: '1.8 s' }, { label: 'Repeatability', value: '99.9%' }] },
      { stepNumber: 5, title: 'STEP 5: Task Completion & Return Home', description: 'Gripper releases workpiece; arm returns to standby ready for next cycle.', narrationText: 'Workpiece released. Robotic arm returns to home standby position for next automated manufacturing cycle.', cameraView: 'wide', activeEntityId: 'arm', animationAction: 'idle', readoutData: [{ label: 'Total Units', value: '1,200 /hr' }, { label: 'Status', value: 'Cycle OK' }] },
    ];
    return {
      type: '3d_scene', domain: 'Architecture',
      title: 'Industrial Robotic Arm Automation Simulation',
      subtitle: '6-DOF Inverse Kinematics, Servo Precision & Automated Gripping',
      summaryText: 'Simulating 6-DOF industrial robot arm: inverse kinematics path planning, servo joint trajectory, pneumatic gripping, and precision component placement.',
      voiceNarrationText: 'Simulating industrial robotic arm automation — 6-axis inverse kinematics, end-effector gripping, and automated assembly.',
      scenarioData: { scenarioTitle: '6-Axis Robotic Kinematics & Assembly', environment: 'blueprint', entities, steps, observations: ['Inverse kinematics calculates 6 servo angles for end-effector X,Y,Z coordinates.', 'Closed-loop encoders achieve ±0.02 mm positioning precision.', 'High speed cycle time achieves 1,200 automated insertions per hour.'], takeawayConclusion: 'Industrial robotic arms utilize inverse kinematics and closed-loop servo control to execute high-speed, repeatable manufacturing operations.' },
    };
  }

  // Preset 19: Magnetism & Electromagnetic Field
  public static getMagnetismPreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'magnet', name: 'Permanent Bar Magnet (N / S)', shape: 'magnet', color: '#ef4444', size: 2.2, position: { x: 0, y: 0, z: 0 }, glowing: true },
      { id: 'flux', name: 'Curved Magnetic Flux Lines', shape: 'wave', color: '#38bdf8', size: 2.0, position: { x: 0, y: 0, z: 0 } },
      { id: 'particle', name: 'Charged Electron Particle', shape: 'atom', color: '#f59e0b', size: 1.5, position: { x: 50, y: 30, z: 0 } },
    ];
    const steps: SimulationStep[] = [
      { stepNumber: 1, title: 'STEP 1: Dipole Magnetic Field & Flux Lines', description: 'Magnetic dipole produces curved B-field flux lines looping from North to South pole.', narrationText: 'Permanent bar magnet produces a magnetic dipole field. Flux lines loop continuously from North to South pole.', cameraView: 'wide', activeEntityId: 'magnet', animationAction: 'idle', particleEffect: 'glow_aura', readoutData: [{ label: 'Field B', value: '0.4 Tesla' }, { label: 'Poles', value: 'North - South' }] },
      { stepNumber: 2, title: 'STEP 2: Moving Charge Entry into Magnetic Field', description: 'Negatively charged electron enters magnetic field with velocity vector V.', narrationText: 'A charged electron enters the magnetic field at high velocity.', cameraView: 'close_up', activeEntityId: 'particle', animationAction: 'move', particleEffect: 'sparks', readoutData: [{ label: 'Velocity v', value: '1.5×10⁶ m/s' }, { label: 'Charge q', value: '-1.6×10⁻¹⁹ C' }] },
      { stepNumber: 3, title: 'STEP 3: Lorentz Force Vector (F = q(v × B))', description: 'Magnetic field exerts perpendicular Lorentz force causing circular helical trajectory.', narrationText: 'Perpendicular magnetic field exerts Lorentz force F = q(v × B), bending electron trajectory into a circular arc.', cameraView: 'cinematic', activeEntityId: 'particle', animationAction: 'rotate', particleEffect: 'energy_waves', readoutData: [{ label: 'Lorentz Force', value: 'F = q(v × B)' }, { label: 'Radius r', value: '2.1 cm' }] },
      { stepNumber: 4, title: 'STEP 4: Electromagnetic Induction (Faraday’s Law)', description: 'Moving magnet near wire coil induces electric voltage EMF = -dΦ/dt.', narrationText: 'Changing magnetic flux through a conductor induces electromotive force according to Faraday’s Law of Induction.', cameraView: 'close_up', activeEntityId: 'flux', animationAction: 'emit_particles', particleEffect: 'light_beam', readoutData: [{ label: 'Induced EMF', value: '12.4 V' }, { label: 'Flux dΦ/dt', value: 'Active Change' }] },
      { stepNumber: 5, title: 'STEP 5: Magnetic Equilibrium & Aurora Borealis Mechanism', description: 'Earth magnetic dipole channels charged solar wind particles into polar atmospheric auroras.', narrationText: 'Earth’s global magnetic field shields the planet by guiding charged cosmic particles into luminous polar auroras.', cameraView: 'wide', activeEntityId: 'magnet', animationAction: 'idle', readoutData: [{ label: 'Earth Shield', value: 'Magnetosphere' }, { label: 'Status', value: 'Protected' }] },
    ];
    return {
      type: '3d_scene', domain: 'Physics',
      title: 'Magnetism & Electromagnetic Field Simulation',
      subtitle: 'Dipole Magnetic Flux, Lorentz Force & Faraday Induction',
      summaryText: 'Simulating magnetic field dynamics: bar magnet dipole flux, Lorentz force deflection on charged particles, and Faraday’s law of induction.',
      voiceNarrationText: 'Simulating magnetic field dynamics — dipole flux lines, Lorentz force deflection, and electromagnetic induction.',
      scenarioData: { scenarioTitle: 'Magnetic Dipole Flux & Lorentz Force', environment: 'studio', entities, steps, observations: ['Magnetic flux lines continuously connect North and South magnetic poles.', 'Lorentz force F = q(v × B) acts perpendicularly to velocity and magnetic field.', 'Changing magnetic flux induces electric current (Faraday’s Law).'], takeawayConclusion: 'Magnetism creates spatial field vectors that exert forces on moving electric charges and induce electrical currents through changing magnetic flux.' },
    };
  }

  // Preset 20: Earthquake & Tectonic Waves
  public static getEarthquakeSeismicPreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'fault', name: 'Tectonic Plate Fault Line', shape: 'earthquake', color: '#78716c', size: 2.5, position: { x: 0, y: 0, z: 0 }, glowing: true },
      { id: 'waves', name: 'Seismic P & S Waves', shape: 'wave', color: '#f97316', size: 2.0, position: { x: 0, y: 20, z: 0 } },
      { id: 'structure', name: 'Building Structural Response', shape: 'cube', color: '#38bdf8', size: 1.5, position: { x: 0, y: -60, z: 0 } },
    ];
    const steps: SimulationStep[] = [
      { stepNumber: 1, title: 'STEP 1: Tectonic Strain Accumulation', description: 'Convection currents force tectonic plates together; elastic strain builds at fault.', narrationText: 'Subsurface tectonic plates lock along a fault line, building elastic strain energy over decades.', cameraView: 'wide', activeEntityId: 'fault', animationAction: 'idle', particleEffect: 'glow_aura', readoutData: [{ label: 'Strain Energy', value: 'High Stress' }, { label: 'Fault Type', value: 'Strike-Slip' }] },
      { stepNumber: 2, title: 'STEP 2: Slip Rupture & Hypocenter Release', description: 'Fault shear strength exceeded; sudden rupture releases stored energy at hypocenter.', narrationText: 'Rock shear strength is exceeded. The fault slips violently, releasing stored elastic energy at the underground hypocenter.', cameraView: 'close_up', activeEntityId: 'fault', animationAction: 'collide', particleEffect: 'sparks', readoutData: [{ label: 'Magnitude', value: '7.2 Mw' }, { label: 'Focal Depth', value: '12 km' }] },
      { stepNumber: 3, title: 'STEP 3: Primary P-Wave & Secondary S-Wave Propagation', description: 'Longitudinal compressional P-waves lead, followed by transverse shear S-waves.', narrationText: 'Compressional P-waves propagate at 6 km/s, followed by destructive shear S-waves at 3.5 km/s.', cameraView: 'cinematic', activeEntityId: 'waves', animationAction: 'emit_particles', particleEffect: 'fire_smoke', readoutData: [{ label: 'P-Wave V', value: '6.0 km/s' }, { label: 'S-Wave V', value: '3.5 km/s' }] },
      { stepNumber: 4, title: 'STEP 4: Surface Wave Shaking & Structural Resonance', description: 'Love and Rayleigh surface waves shake buildings at natural resonant frequency.', narrationText: 'Surface Rayleigh waves cause horizontal and vertical ground shaking, testing building structural dampening.', cameraView: 'close_up', activeEntityId: 'structure', animationAction: 'transform', particleEffect: 'energy_waves', readoutData: [{ label: 'Peak Accel', value: '0.45 g' }, { label: 'Resonance', value: '1.2 Hz' }] },
      { stepNumber: 5, title: 'STEP 5: Seismic Isolation & Energy Dissipation', description: 'Base isolators and tuned mass dampers absorb shaking, preventing collapse.', narrationText: 'Seismic base isolators and dampers absorb ground motion, keeping the structure safe.', cameraView: 'wide', activeEntityId: 'structure', animationAction: 'idle', readoutData: [{ label: 'Isolator Eff', value: '75% Dampened' }, { label: 'Building Status', value: 'Intact' }] },
    ];
    return {
      type: '3d_scene', domain: 'Physics',
      title: 'Earthquake Tectonic Fault & Seismic Wave Simulation',
      subtitle: 'Plate Tectonics, Hypocenter Rupture & Structural Dynamics',
      summaryText: 'Simulating earthquake mechanics: tectonic strain accumulation, fault slip rupture, P & S wave propagation, and building seismic isolation.',
      voiceNarrationText: 'Simulating earthquake physics — tectonic fault slip rupture, seismic P and S wave propagation, and structural resonance.',
      scenarioData: { scenarioTitle: 'Tectonic Fault Slip & Seismic Wave Propagation', environment: 'nature', entities, steps, observations: ['Compressional P-waves travel faster than transverse shear S-waves.', 'Surface Rayleigh waves generate heavy horizontal ground displacement.', 'Base isolators decouple building structures from ground shaking acceleration.'], takeawayConclusion: 'Earthquakes result from sudden elastic slip along locked tectonic fault lines, radiating seismic waves that shake surface structures.' },
    };
  }

  // Preset 21: Black Hole & Gravitational Relativity
  public static getBlackHolePreset(): RepresentationPayload {
    const entities: SimulationEntity[] = [
      { id: 'black_hole', name: 'Supermassive Black Hole Event Horizon', shape: 'black_hole', color: '#090d16', size: 2.5, position: { x: 0, y: 0, z: 0 }, glowing: true },
      { id: 'disk', name: 'Relativistic Accretion Disk', shape: 'ring', color: '#f59e0b', size: 3.8, position: { x: 0, y: 0, z: 0 }, glowing: true },
      { id: 'light', name: 'Gravitationally Bent Light Rays', shape: 'wave', color: '#38bdf8', size: 2.0, position: { x: 0, y: 40, z: 0 } },
    ];
    const steps: SimulationStep[] = [
      { stepNumber: 1, title: 'STEP 1: Schwarzschild Radius & Event Horizon Boundary', description: 'Massive star collapses into singularity bounded by Schwarzschild event horizon R_s.', narrationText: 'Massive stellar collapse creates a supermassive black hole. The event horizon boundary marks where escape velocity equals light speed.', cameraView: 'wide', activeEntityId: 'black_hole', animationAction: 'idle', particleEffect: 'glow_aura', readoutData: [{ label: 'Mass M', value: '4.1×10⁶ M☉' }, { label: 'R_Schwarzschild', value: '12×10⁶ km' }] },
      { stepNumber: 2, title: 'STEP 2: Relativistic Plasma Accretion Disk Rotation', description: 'Infalling matter accelerates to near-light speed, heating disk to millions of degrees.', narrationText: 'Infalling gas and dust swirl into an accretion disk, frictionally heating to millions of kelvin to emit X-rays.', cameraView: 'close_up', activeEntityId: 'disk', animationAction: 'rotate', particleEffect: 'sparks', readoutData: [{ label: 'Disk Temp', value: '10,000,000 K' }, { label: 'Velocity', value: '0.4 c' }] },
      { stepNumber: 3, title: 'STEP 3: Gravitational Lensing & Space-Time Warping', description: 'Extreme gravitational field warps spacetime geometry, bending passing light rays around hole.', narrationText: 'Extreme spacetime curvature bends background starlight around the black hole, producing Einstein rings.', cameraView: 'cinematic', activeEntityId: 'light', animationAction: 'emit_particles', particleEffect: 'light_beam', readoutData: [{ label: 'Light Deflection', value: 'Einstein Ring' }, { label: 'Curvature', value: 'Infinite at Singularity' }] },
      { stepNumber: 4, title: 'STEP 4: Gravitational Redshift & Time Dilation', description: 'Photons climbing out of gravitational well lose frequency; time slows near horizon.', narrationText: 'Gravitational time dilation causes clocks near the event horizon to tick infinitely slower relative to distant observers.', cameraView: 'close_up', activeEntityId: 'black_hole', animationAction: 'transform', particleEffect: 'energy_waves', readoutData: [{ label: 'Time Dilation t\'', value: 't / √(1 - R_s/r)' }, { label: 'Redshift z', value: 'Extreme' }] },
      { stepNumber: 5, title: 'STEP 5: Relativistic Jets & Quantum Hawking Evaporation', description: 'Magnetic fields launch polar relativistic plasma jets while Hawking radiation slowly evaporates mass.', narrationText: 'Twisted magnetic field lines launch relativistic plasma jets thousands of light-years into intergalactic space.', cameraView: 'wide', activeEntityId: 'black_hole', animationAction: 'idle', readoutData: [{ label: 'Jet Speed', value: '0.99 c' }, { label: 'Hawking Temp', value: '1.5×10⁻¹⁴ K' }] },
    ];
    return {
      type: '3d_scene', domain: 'Physics',
      title: 'Supermassive Black Hole & General Relativity Simulation',
      subtitle: 'Event Horizon, Accretion Disk & Gravitational Spacetime Lensing',
      summaryText: 'Simulating supermassive black hole: Schwarzschild event horizon, relativistic accretion disk, spacetime gravitational lensing, and time dilation.',
      voiceNarrationText: 'Simulating black hole relativity — event horizon boundary, glowing accretion disk, and spacetime light lensing.',
      scenarioData: { scenarioTitle: 'Black Hole Event Horizon & Spacetime Curvature', environment: 'space', entities, steps, observations: ['Event horizon is boundary where gravitational escape velocity equals light speed (c).', 'Extreme gravity bends light rays creating Einstein rings via gravitational lensing.', 'Clocks near event horizon experience extreme general relativistic time dilation.'], takeawayConclusion: 'Black holes warp local spacetime geometry so severely that nothing—not even light—can escape beyond the Schwarzschild event horizon.' },
    };
  }

  // Preset: Chemical Reaction (Acid-Base Neutralization)
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

  // Preset: Tornado / Weather Physics
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

  // Preset: Bridge Engineering
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

  // Universal Fallback Generator — dynamically infers entity shapes, colors, steps, and readouts from user query!
  public static getGenericScenario(input: string | UniversalScenarioInput): RepresentationPayload {
    const rawTitle = typeof input === 'object' && input.scenarioTitle ? input.scenarioTitle : typeof input === 'string' ? input : 'Universal Scenario Simulation';
    const desc = typeof input === 'object' && input.description ? input.description : `Interactive 3D simulation demonstrating ${rawTitle}.`;
    const lower = rawTitle.toLowerCase();

    // Smart keyword-to-shape & environment mapping
    let primaryShape: 'car' | 'water_bottle' | 'heart' | 'atom' | 'solar_panel' | 'airplane' | 'drone' | 'wind_turbine' | 'robot_arm' | 'magnet' | 'earthquake' | 'black_hole' | 'rocket' | 'volcano' | 'piston' | 'dna' | 'chloroplast' | 'prism' | 'gear' | 'circuit' | 'wave' | 'cube' | 'sphere' = 'sphere';
    let primaryColor = '#06b6d4';
    let env: 'space' | 'microscopic' | 'blueprint' | 'nature' | 'cyber' | 'studio' | 'lab' = 'studio';

    if (lower.includes('car') || lower.includes('vehicle') || lower.includes('wheel') || lower.includes('drive')) {
      primaryShape = 'car'; primaryColor = '#ef4444'; env = 'studio';
    } else if (lower.includes('bottle') || lower.includes('water') || lower.includes('fluid') || lower.includes('pour') || lower.includes('liquid')) {
      primaryShape = 'water_bottle'; primaryColor = '#38bdf8'; env = 'lab';
    } else if (lower.includes('heart') || lower.includes('blood') || lower.includes('cardiac') || lower.includes('pulse')) {
      primaryShape = 'heart'; primaryColor = '#ef4444'; env = 'microscopic';
    } else if (lower.includes('solar') || lower.includes('sunlight') || lower.includes('photovoltaic')) {
      primaryShape = 'solar_panel'; primaryColor = '#1e3a5f'; env = 'studio';
    } else if (lower.includes('plane') || lower.includes('fly') || lower.includes('wing') || lower.includes('aero')) {
      primaryShape = 'airplane'; primaryColor = '#94a3b8'; env = 'studio';
    } else if (lower.includes('drone') || lower.includes('quad') || lower.includes('hover')) {
      primaryShape = 'drone'; primaryColor = '#06b6d4'; env = 'nature';
    } else if (lower.includes('turbine') || lower.includes('wind') || lower.includes('windmill')) {
      primaryShape = 'wind_turbine'; primaryColor = '#f8fafc'; env = 'nature';
    } else if (lower.includes('robot') || lower.includes('arm') || lower.includes('servo')) {
      primaryShape = 'robot_arm'; primaryColor = '#06b6d4'; env = 'blueprint';
    } else if (lower.includes('magnet') || lower.includes('magnetic') || lower.includes('flux')) {
      primaryShape = 'magnet'; primaryColor = '#ef4444'; env = 'studio';
    } else if (lower.includes('earthquake') || lower.includes('seismic') || lower.includes('fault')) {
      primaryShape = 'earthquake'; primaryColor = '#78716c'; env = 'nature';
    } else if (lower.includes('black hole') || lower.includes('gravity') || lower.includes('horizon')) {
      primaryShape = 'black_hole'; primaryColor = '#090d16'; env = 'space';
    } else if (lower.includes('chip') || lower.includes('cpu') || lower.includes('circuit') || lower.includes('electric') || lower.includes('wire')) {
      primaryShape = 'circuit'; primaryColor = '#10b981'; env = 'cyber';
    } else if (lower.includes('gear') || lower.includes('machine') || lower.includes('mechanical')) {
      primaryShape = 'gear'; primaryColor = '#f59e0b'; env = 'blueprint';
    } else if (lower.includes('wave') || lower.includes('sound') || lower.includes('freq') || lower.includes('signal')) {
      primaryShape = 'wave'; primaryColor = '#ec4899'; env = 'studio';
    } else if (lower.includes('atom') || lower.includes('molecule') || lower.includes('chem') || lower.includes('quantum')) {
      primaryShape = 'atom'; primaryColor = '#ef4444'; env = 'microscopic';
    }

    const entities: SimulationEntity[] = [
      { id: 'primary_obj', name: rawTitle, shape: primaryShape, color: primaryColor, size: 2.5, position: { x: 0, y: 0, z: 0 }, glowing: true },
      { id: 'secondary_obj', name: 'Energy & Vector Field', shape: 'wave', color: '#3b82f6', size: 2.0, position: { x: 0, y: 20, z: 0 } },
      { id: 'particle_obj', name: 'Particle Emission', shape: 'particle_cloud', color: '#f59e0b', size: 1.5, position: { x: 0, y: -40, z: 0 }, glowing: true },
    ];

    const steps: SimulationStep[] = [
      {
        stepNumber: 1,
        title: `STEP 1: ${rawTitle} System Initialization`,
        description: `Establishing workspace parameters and component orientation for ${rawTitle}.`,
        narrationText: `Welcome to the interactive simulation for ${rawTitle}. Setting up primary physical entity state.`,
        cameraView: 'wide',
        activeEntityId: 'primary_obj',
        animationAction: 'idle',
        particleEffect: 'glow_aura',
        readoutData: [{ label: 'Status', value: 'Ready' }, { label: 'System Energy', value: '100%' }],
      },
      {
        stepNumber: 2,
        title: 'STEP 2: Force Vector Activation & Dynamics',
        description: `Applying directional force vectors and initiating kinetic dynamics for ${rawTitle}.`,
        narrationText: `Activating primary kinetic forces and observing motion vectors.`,
        cameraView: 'close_up',
        activeEntityId: 'primary_obj',
        animationAction: 'move',
        particleEffect: 'sparks',
        readoutData: [{ label: 'Activity', value: 'Active Dynamics' }, { label: 'Rate', value: 'Optimal' }],
      },
      {
        stepNumber: 3,
        title: 'STEP 3: Structural Transformation & Energy Exchange',
        description: 'Observing structural changes, energy transfer, and particle emissions.',
        narrationText: 'Key structural transformations and energy exchanges are now in progress.',
        cameraView: 'cinematic',
        activeEntityId: 'secondary_obj',
        animationAction: 'rotate',
        particleEffect: 'energy_waves',
        readoutData: [{ label: 'Energy Transferred', value: '85.4%' }, { label: 'Phase', value: 'Transformation' }],
      },
      {
        stepNumber: 4,
        title: 'STEP 4: Close-Up Telemetry & Component Inspection',
        description: 'Zooming into detailed micro-components to analyze exact system behavior.',
        narrationText: 'Detailed close-up inspection of fundamental component interactions.',
        cameraView: 'microscopic_zoom',
        activeEntityId: 'primary_obj',
        animationAction: 'transform',
        particleEffect: 'water_bubbles',
        readoutData: [{ label: 'Zoom Level', value: 'High Precision' }, { label: 'Efficiency', value: '94.2%' }],
      },
      {
        stepNumber: 5,
        title: 'STEP 5: System Equilibrium & Final State Analysis',
        description: 'Returning to full perspective as the system achieves final equilibrium state.',
        narrationText: 'Simulation reaching final equilibrium. Reviewing overall system takeaways.',
        cameraView: 'wide',
        activeEntityId: 'primary_obj',
        animationAction: 'idle',
        readoutData: [{ label: 'State', value: 'Equilibrium' }, { label: 'Result', value: 'Verified' }],
      },
    ];

    return {
      type: '3d_scene',
      domain: 'General',
      title: rawTitle,
      subtitle: 'Dynamic AI Interactive Animated 3D Simulation',
      summaryText: desc,
      voiceNarrationText: `Simulating ${rawTitle}. Following a 5-step interactive visual simulation timeline.`,
      scenarioData: {
        scenarioTitle: rawTitle,
        environment: env,
        entities,
        steps,
        observations: [
          `Generated tailored 3D procedural simulation for "${rawTitle}".`,
          'Mapped component dynamics, vector fields, and telemetry metrics.',
          'Demonstrated system initialization, transformation, and equilibrium.',
        ],
        takeawayConclusion: `Successfully generated dynamic interactive AI visual scenario simulation for ${rawTitle}.`,
      },
    };
  }
}
