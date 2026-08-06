import { RepresentationPayload } from '../types';

export interface CustomExperimentInput {
  experimentName?: string;
  objective?: string;
  chemicals?: string;
  apparatus?: string;
  procedure?: string;
  observation?: string;
  result?: string;
  voiceTranscript?: string;
}

export class ChemistrySimulationGenerator {
  /**
   * Generates a complete 12-step realistic chemistry laboratory simulation payload.
   */
  public static createSimulation(input: string | CustomExperimentInput): RepresentationPayload {
    let inputStr = typeof input === 'string' ? input : JSON.stringify(input);
    const lower = inputStr.toLowerCase();

    // Check for specific experiment keywords
    if (lower.includes('copper') || lower.includes('blue precipitate') || lower.includes('cuso4')) {
      return this.getCopperSulfatePreset();
    }
    if (lower.includes('magnesium') || lower.includes('combustion') || lower.includes('ribbon')) {
      return this.getMagnesiumCombustionPreset();
    }
    if (lower.includes('silver') || lower.includes('agno3') || lower.includes('silver chloride')) {
      return this.getSilverNitratePreset();
    }
    if (lower.includes('sodium in water') || lower.includes('sodium metal') || lower.includes('explosion')) {
      return this.getSodiumWaterPreset();
    }
    if (lower.includes('titration') || lower.includes('phenolphthalein') || lower.includes('indicator')) {
      return this.getTitrationPreset();
    }

    // Default or custom fallback generator
    return this.getGenericNeutralizationPreset(input);
  }

  // Preset 1: Copper(II) Sulfate + Sodium Hydroxide (Blue Precipitate)
  public static getCopperSulfatePreset(): RepresentationPayload {
    const reactants = [
      { formula: 'CuSO₄(aq)', name: 'Copper(II) Sulfate Solution', color: '#0284c7', volume: '50 mL', state: 'Aqueous Solution' },
      { formula: '2 NaOH(aq)', name: 'Sodium Hydroxide Solution', color: '#06b6d4', volume: '30 mL', state: 'Aqueous Solution' },
    ];
    const products = [
      { formula: 'Cu(OH)₂↓', name: 'Copper(II) Hydroxide Precipitate', color: '#0284c7', state: 'Gelatinous Solid Precipitate' },
      { formula: 'Na₂SO₄(aq)', name: 'Sodium Sulfate Solution', color: '#38bdf8', state: 'Aqueous Solution' },
    ];
    const apparatus = [
      'Glass Beaker (250 mL)',
      'Conical Flask (100 mL)',
      'Graduated Measuring Cylinder',
      'Glass Stirring Rod / Magnetic Stirrer',
      'Volumetric Pipette (10 mL)',
      'Digital Balance (0.01g)',
      'Fume Hood Environment',
    ];
    const safetyEquipment = ['Safety Goggles', 'Nitrile Laboratory Gloves', 'Fire-Retardant Lab Coat', 'Fume Hood Ventilation'];

    const steps = [
      {
        stepNumber: 1,
        title: 'STEP 1: Laboratory Environment Overview',
        description: 'Showing modern chemistry laboratory setup with fume hood, digital balance, and apparatus.',
        narrationText: 'Welcome to the High-Precision Chemistry Laboratory. Fume hood ventilation active, safety protocols engaged.',
        cameraView: 'wide' as const,
        action: 'environment' as const,
        fluidColor: 'transparent',
        fluidLevel: 0,
      },
      {
        stepNumber: 2,
        title: 'STEP 2: Reagents & Apparatus Setup',
        description: 'Displaying CuSO₄ reagent bottle, NaOH solution, measuring cylinders, and reaction beaker.',
        narrationText: 'Arranging Copper(II) Sulfate solution and Sodium Hydroxide on the laboratory bench.',
        cameraView: 'close_up' as const,
        action: 'setup' as const,
        activeChemical: 'CuSO₄',
        activeApparatus: 'Glass Beaker',
        fluidColor: 'transparent',
        fluidLevel: 0,
      },
      {
        stepNumber: 3,
        title: 'STEP 3: Reagent Inspection & Chemical Highlighting',
        description: 'Highlighting blue CuSO₄ solution and clear NaOH solution bottles.',
        narrationText: 'Inspecting Copper(II) Sulfate solution, characterized by light blue Cu²⁺ aqueous ions.',
        cameraView: 'close_up' as const,
        action: 'highlight' as const,
        activeChemical: 'Copper(II) Sulfate Solution',
        fluidColor: '#0284c7',
        fluidLevel: 25,
      },
      {
        stepNumber: 4,
        title: 'STEP 4: Hand Grasping Volumetric Pipette',
        description: 'Animated gloved laboratory hand picking up pipette containing NaOH reagent.',
        narrationText: 'Laboratory technician picking up volumetric pipette containing 30 mL of Sodium Hydroxide.',
        cameraView: 'close_up' as const,
        action: 'pick_apparatus' as const,
        activeApparatus: 'Volumetric Pipette',
        fluidColor: '#0284c7',
        fluidLevel: 35,
      },
      {
        stepNumber: 5,
        title: 'STEP 5: Fluid Pouring Physics',
        description: 'Pouring Sodium Hydroxide solution naturally into the Copper Sulfate beaker.',
        narrationText: 'Pouring Sodium Hydroxide solution dropwise into the reaction beaker with natural fluid physics.',
        cameraView: 'close_up' as const,
        action: 'pour' as const,
        activeApparatus: 'Volumetric Pipette',
        fluidColor: '#0284c7',
        fluidLevel: 60,
      },
      {
        stepNumber: 6,
        title: 'STEP 6: Animated Solution Mixing',
        description: 'Magnetic stirrer vortex spinning and homogenizing reactants.',
        narrationText: 'Engaging magnetic stirrer to ensure thorough mixing of Cu²⁺ and OH⁻ ions.',
        cameraView: 'top_view' as const,
        action: 'mix' as const,
        fluidColor: '#0284c7',
        fluidLevel: 65,
      },
      {
        stepNumber: 7,
        title: 'STEP 7: Molecular Reaction Visual Effects',
        description: 'Gelatinous bright blue Copper(II) Hydroxide precipitate forms instantly.',
        narrationText: 'Observe intense blue precipitate formation! Copper ions react with hydroxide ions forming insoluble Cu(OH)₂ solid.',
        cameraView: 'close_up' as const,
        action: 'react' as const,
        fluidColor: '#0284c7',
        fluidLevel: 65,
        reactionEffects: {
          precipitate: true,
          precipitateColor: '#0284c7',
          colorChange: true,
          bubbles: true,
          pHValue: 11.5,
          temperature: 28.5,
        },
      },
      {
        stepNumber: 8,
        title: 'STEP 8: Microscopic Atomic Interaction Zoom',
        description: 'Zooming into the beaker to visualize Cu²⁺ bonding with 2 OH⁻ ions to form solid crystal lattice.',
        narrationText: 'Microscopic view: Cu²⁺ metal cations collide with 2 OH⁻ hydroxide anions, forming insoluble Cu(OH)₂ ionic lattice.',
        cameraView: 'macro_molecular' as const,
        action: 'microscopic_zoom' as const,
        fluidColor: '#0284c7',
        fluidLevel: 65,
        reactionEffects: {
          precipitate: true,
          precipitateColor: '#0284c7',
          glowing: true,
        },
      },
      {
        stepNumber: 9,
        title: 'STEP 9: Return to Wide Laboratory Camera',
        description: 'Camera zooming back out to wide workbench showing the finished beaker.',
        narrationText: 'Returning to full laboratory view. Precipitate settling at the bottom of the beaker.',
        cameraView: 'wide' as const,
        action: 'return_macro' as const,
        fluidColor: '#0284c7',
        fluidLevel: 65,
        reactionEffects: { precipitate: true, precipitateColor: '#0284c7' },
      },
      {
        stepNumber: 10,
        title: 'STEP 10: Final Product Display',
        description: 'Displaying gelatinous blue Cu(OH)₂ precipitate suspended above clear Na₂SO₄ aqueous solution.',
        narrationText: 'Final product achieved: Copper(II) Hydroxide solid precipitate under aqueous Sodium Sulfate solution.',
        cameraView: 'close_up' as const,
        action: 'final_product' as const,
        fluidColor: '#0284c7',
        fluidLevel: 65,
        reactionEffects: { precipitate: true, precipitateColor: '#0284c7' },
      },
      {
        stepNumber: 11,
        title: 'STEP 11: Scientific Observations & Data Readouts',
        description: 'Displaying live observations: pH 11.5, temperature +4.5°C, gelatinous blue solid.',
        narrationText: 'Key observations recorded: Gelatinous sky-blue precipitate formed, slight temperature rise of +4.5°C.',
        cameraView: 'close_up' as const,
        action: 'observations' as const,
        fluidColor: '#0284c7',
        fluidLevel: 65,
        reactionEffects: { precipitate: true, precipitateColor: '#0284c7' },
      },
      {
        stepNumber: 12,
        title: 'STEP 12: Reaction Conclusion & Stoichiometric Takeaway',
        description: 'Displaying balanced net ionic equation: Cu²⁺(aq) + 2 OH⁻(aq) → Cu(OH)₂ (s).',
        narrationText: 'Conclusion: Double displacement precipitation reaction confirmed. Net ionic equation: Cu²⁺ + 2OH⁻ yields Cu(OH)₂ solid.',
        cameraView: 'wide' as const,
        action: 'conclusion' as const,
        fluidColor: '#0284c7',
        fluidLevel: 65,
        reactionEffects: { precipitate: true, precipitateColor: '#0284c7' },
      },
    ];

    return {
      type: 'chemistry_lab',
      domain: 'Chemistry',
      title: 'Precipitation Reaction: Copper(II) Sulfate & Sodium Hydroxide',
      subtitle: 'Synthesis of Copper(II) Hydroxide Gelatinous Precipitate',
      summaryText: 'Simulating double displacement precipitation where aqueous copper ions collide with hydroxide ions to form bright blue solid Cu(OH)₂.',
      voiceNarrationText: 'Simulating Copper(II) Sulfate reacting with Sodium Hydroxide to yield a vivid sky-blue Copper(II) Hydroxide precipitate.',
      chemData: {
        experimentName: 'Precipitation of Copper(II) Hydroxide',
        objective: 'To visually simulate double displacement reaction between CuSO₄ and NaOH and observe gelatinous blue Cu(OH)₂ precipitate.',
        reactants,
        products,
        apparatus,
        safetyEquipment,
        balancedEquation: 'CuSO₄(aq) + 2 NaOH(aq) → Cu(OH)₂(s)↓ + Na₂SO₄(aq)',
        reactionType: 'Double Displacement Precipitation',
        isAnimated: true,
        temperatureChange: '+4.5°C',
        observations: [
          'Immediate formation of gelatinous, sky-blue precipitate of Cu(OH)₂ upon mixing.',
          'Supernatant solution turns clear as Cu²⁺ ions precipitate out.',
          'pH increases to 11.5 due to excess hydroxide ions.',
          'Exothermic enthalpy of precipitation releases slight thermal energy.',
        ],
        result: 'Successfully synthesized Copper(II) Hydroxide solid precipitate (Cu(OH)₂).',
        narrationScript: 'Step-by-step narration synchronized with 12-step realistic chemistry laboratory simulation.',
        steps,
        microscopicData: {
          reactantsAtoms: [
            { symbol: 'Cu²⁺', color: '#0284c7', count: 4, charge: '+2' },
            { symbol: 'SO₄²⁻', color: '#f59e0b', count: 4, charge: '-2' },
            { symbol: 'Na⁺', color: '#10b981', count: 8, charge: '+1' },
            { symbol: 'OH⁻', color: '#38bdf8', count: 8, charge: '-1' },
          ],
          productsMolecules: [
            { formula: 'Cu(OH)₂', name: 'Copper(II) Hydroxide Solid', structure: 'Cu attached to 2 OH groups', count: 4 },
            { formula: 'Na₂SO₄', name: 'Sodium Sulfate Aqueous', structure: '2 Na⁺ & 1 SO₄²⁻ ions', count: 4 },
          ],
        },
      },
    };
  }

  // Preset 2: Magnesium Ribbon Combustion
  public static getMagnesiumCombustionPreset(): RepresentationPayload {
    const reactants = [
      { formula: '2 Mg(s)', name: 'Magnesium Ribbon Metal', color: '#94a3b8', volume: '2 cm ribbon', state: 'Solid Metal' },
      { formula: 'O₂(g)', name: 'Atmospheric Oxygen Gas', color: '#38bdf8', volume: 'Excess', state: 'Gas' },
    ];
    const products = [
      { formula: '2 MgO(s)', name: 'Magnesium Oxide White Powder', color: '#ffffff', state: 'White Powder Solid' },
    ];
    const apparatus = [
      'Bunsen Burner & Gas Line',
      'Crucible Tongs',
      'Sandpaper / Emery Cloth',
      'Watch Glass Plate',
      'Safety UV Filter Glass',
      'Fume Hood Environment',
    ];
    const safetyEquipment = ['UV Protective Goggles', 'Heat-Resistant Gloves', 'Lab Coat', 'Fume Hood Ventilation'];

    const steps = [
      {
        stepNumber: 1,
        title: 'STEP 1: Laboratory Environment Overview',
        description: 'Showing modern laboratory with Bunsen burner, gas line, and safety UV shielding.',
        narrationText: 'Preparing for exothermic combustion. Safety UV filter and gas burner ready.',
        cameraView: 'wide' as const,
        action: 'environment' as const,
      },
      {
        stepNumber: 2,
        title: 'STEP 2: Reagents & Apparatus Setup',
        description: 'Magnesium ribbon held with crucible tongs near Bunsen burner flame.',
        narrationText: 'Holding polished Magnesium ribbon with stainless steel crucible tongs.',
        cameraView: 'close_up' as const,
        action: 'setup' as const,
        activeApparatus: 'Crucible Tongs & Magnesium Ribbon',
      },
      {
        stepNumber: 3,
        title: 'STEP 3: Reagent Inspection',
        description: 'Highlighting metallic luster of cleaned magnesium ribbon.',
        narrationText: 'Cleaned Magnesium metal possesses shiny silver metallic luster.',
        cameraView: 'close_up' as const,
        action: 'highlight' as const,
        activeChemical: 'Magnesium Ribbon Metal',
      },
      {
        stepNumber: 4,
        title: 'STEP 4: Hand Bringing Ribbon to Flame',
        description: 'Hand bringing ribbon directly into hot blue Bunsen burner cone.',
        narrationText: 'Inserting Magnesium ribbon into hot non-luminous flame cone.',
        cameraView: 'close_up' as const,
        action: 'pick_apparatus' as const,
        activeApparatus: 'Bunsen Burner Flame',
      },
      {
        stepNumber: 5,
        title: 'STEP 5: Thermal Activation & Ignition',
        description: 'Ribbon heats up glowing red before triggering ignition.',
        narrationText: 'Thermal activation energy reached; ignition initiated!',
        cameraView: 'close_up' as const,
        action: 'pour' as const,
        reactionEffects: { flame: true, glowing: true, temperature: 650 },
      },
      {
        stepNumber: 6,
        title: 'STEP 6: Intense Exothermic Reaction',
        description: 'Dazzling brilliant white flame burns with intense UV photon emission.',
        narrationText: 'Dazzling, blinding white flame emitted as Magnesium combines violently with oxygen!',
        cameraView: 'cinematic' as const,
        action: 'mix' as const,
        reactionEffects: { flame: true, smoke: true, glowing: true, temperature: 1900 },
      },
      {
        stepNumber: 7,
        title: 'STEP 7: Smoke & Oxide Formation',
        description: 'Dense white MgO smoke billows upwards into fume hood.',
        narrationText: 'White smoke plumes ascend as Magnesium Oxide ash crystallizes.',
        cameraView: 'close_up' as const,
        action: 'react' as const,
        reactionEffects: { smoke: true, flame: true, crystallization: true, temperature: 1200 },
      },
      {
        stepNumber: 8,
        title: 'STEP 8: Microscopic Atomic Interaction Zoom',
        description: 'Visualizing Mg metal atoms transferring 2 valence electrons to O oxygen atoms.',
        narrationText: 'Microscopic view: Mg atoms donate 2 electrons to oxygen, forming Mg²⁺ and O²⁻ ionic lattice.',
        cameraView: 'macro_molecular' as const,
        action: 'microscopic_zoom' as const,
        reactionEffects: { glowing: true, crystallization: true },
      },
      {
        stepNumber: 9,
        title: 'STEP 9: Return to Wide Laboratory Camera',
        description: 'Flame subsides leaving white solid ash on watch glass.',
        narrationText: 'Combustion complete. Placing white ash onto watch glass plate.',
        cameraView: 'wide' as const,
        action: 'return_macro' as const,
      },
      {
        stepNumber: 10,
        title: 'STEP 10: Final Product Display',
        description: 'Crumbly white Magnesium Oxide (MgO) powder displayed.',
        narrationText: 'Final product: Brilliant white Magnesium Oxide powder.',
        cameraView: 'close_up' as const,
        action: 'final_product' as const,
      },
      {
        stepNumber: 11,
        title: 'STEP 11: Scientific Observations',
        description: 'Exothermic heat released: -601.6 kJ/mol, intense white flame, basic oxide.',
        narrationText: 'Observations: Highly exothermic combustion releasing -601.6 kJ/mol heat energy.',
        cameraView: 'close_up' as const,
        action: 'observations' as const,
      },
      {
        stepNumber: 12,
        title: 'STEP 12: Stoichiometric Conclusion',
        description: 'Balanced equation: 2 Mg(s) + O₂(g) → 2 MgO(s).',
        narrationText: 'Conclusion: Redox oxidation reaction complete. 2 Mg + O₂ yields 2 MgO white ash.',
        cameraView: 'wide' as const,
        action: 'conclusion' as const,
      },
    ];

    return {
      type: 'chemistry_lab',
      domain: 'Chemistry',
      title: 'Combustion Reaction: Magnesium Metal in Oxygen',
      subtitle: 'Synthesis of Magnesium Oxide with Intense Light Emission',
      summaryText: 'Simulating high-temperature oxidation of magnesium ribbon in oxygen, releasing brilliant white light and white MgO ash.',
      voiceNarrationText: 'Simulating combustion of Magnesium ribbon in air, producing a blinding white flame and white Magnesium Oxide powder.',
      chemData: {
        experimentName: 'Combustion of Magnesium Ribbon',
        objective: 'To observe highly exothermic synthesis reaction between magnesium metal and oxygen gas.',
        reactants,
        products,
        apparatus,
        safetyEquipment,
        balancedEquation: '2 Mg(s) + O₂(g) → 2 MgO(s)',
        reactionType: 'Exothermic Redox Synthesis',
        isAnimated: true,
        temperatureChange: '+1900°C',
        observations: [
          'Magnesium burns with an extremely bright, dazzling white flame.',
          'Emits intense UV radiation (requires safety UV eye protection).',
          'Dense white smoke billows as MgO aerosol particles form.',
          'Forms a brittle, white powdery ash of Magnesium Oxide (MgO).',
        ],
        result: 'Magnesium metal oxidized to form solid white Magnesium Oxide (MgO).',
        steps,
        microscopicData: {
          reactantsAtoms: [
            { symbol: 'Mg⁰', color: '#94a3b8', count: 4 },
            { symbol: 'O₂', color: '#38bdf8', count: 2 },
          ],
          productsMolecules: [
            { formula: 'MgO', name: 'Magnesium Oxide Crystal', structure: 'Mg²⁺ and O²⁻ ionic lattice', count: 4 },
          ],
        },
      },
    };
  }

  // Preset 3: Silver Nitrate + Sodium Chloride
  public static getSilverNitratePreset(): RepresentationPayload {
    const reactants = [
      { formula: 'AgNO₃(aq)', name: 'Silver Nitrate Solution', color: '#f8fafc', volume: '40 mL', state: 'Clear Solution' },
      { formula: 'NaCl(aq)', name: 'Sodium Chloride Solution', color: '#e2e8f0', volume: '40 mL', state: 'Clear Solution' },
    ];
    const products = [
      { formula: 'AgCl(s)↓', name: 'Silver Chloride White Precipitate', color: '#ffffff', state: 'Curdy White Solid' },
      { formula: 'NaNO₃(aq)', name: 'Sodium Nitrate Solution', color: '#cbd5e1', state: 'Clear Aqueous Solution' },
    ];

    const steps = Array.from({ length: 12 }, (_, i) => ({
      stepNumber: i + 1,
      title: `STEP ${i + 1}: ${['Lab Setup', 'Reagent Preparation', 'Highlight AgNO₃', 'Grasp Pipette', 'Pour Solutions', 'Stirring Mixture', 'White Precipitate Formation', 'Microscopic Ag⁺ + Cl⁻ Bonding', 'Macro View Return', 'White AgCl Curd Display', 'Observations & Light Sensitivity', 'Conclusion'][i]}`,
      description: 'Precipitation of Silver Chloride from clear aqueous reactants.',
      narrationText: `Step ${i + 1} narration for Silver Nitrate and Sodium Chloride reaction.`,
      cameraView: (i === 7 ? 'macro_molecular' : i === 5 ? 'top_view' : 'close_up') as any,
      action: (i === 6 || i === 7 ? 'react' : 'pour') as any,
      fluidColor: i >= 6 ? '#ffffff' : '#e2e8f0',
      fluidLevel: 60,
      reactionEffects: i >= 6 ? { precipitate: true, precipitateColor: '#ffffff', crystallization: true } : undefined,
    }));

    return {
      type: 'chemistry_lab',
      domain: 'Chemistry',
      title: 'Precipitation of Silver Chloride (AgCl)',
      subtitle: 'Quantitative Precipitation & Gravimetric Analysis',
      summaryText: 'Simulating immediate curdy white Silver Chloride precipitate formation upon mixing Silver Nitrate and Sodium Chloride.',
      voiceNarrationText: 'Mixing Silver Nitrate and Sodium Chloride solutions to yield a heavy, white curdy Silver Chloride precipitate.',
      chemData: {
        experimentName: 'Synthesis of Silver Chloride Precipitate',
        objective: 'To demonstrate rapid precipitation of insoluble AgCl solid.',
        reactants,
        products,
        apparatus: ['Beaker (250 mL)', 'Pipette', 'Stirring Rod', 'Filter Paper & Funnel'],
        safetyEquipment: ['Safety Glasses', 'Gloves', 'Lab Coat'],
        balancedEquation: 'AgNO₃(aq) + NaCl(aq) → AgCl(s)↓ + NaNO₃(aq)',
        reactionType: 'Double Displacement Precipitation',
        isAnimated: true,
        temperatureChange: '+2.1°C',
        observations: [
          'Immediate white curdy precipitate forms on contact.',
          'Precipitate darkens upon prolonged light exposure due to Ag metal reduction.',
        ],
        result: 'Formed curdy white solid precipitate of Silver Chloride (AgCl).',
        steps,
      },
    };
  }

  // Preset 4: Sodium Metal in Water
  public static getSodiumWaterPreset(): RepresentationPayload {
    const reactants = [
      { formula: '2 Na(s)', name: 'Sodium Metal Pellet', color: '#cbd5e1', volume: 'small piece', state: 'Soft Metal' },
      { formula: '2 H₂O(l)', name: 'Deionized Water', color: '#38bdf8', volume: '150 mL', state: 'Liquid' },
    ];
    const products = [
      { formula: '2 NaOH(aq)', name: 'Sodium Hydroxide Solution', color: '#a855f7', state: 'Basic Liquid' },
      { formula: 'H₂(g)↑', name: 'Hydrogen Gas', color: '#ef4444', state: 'Flammable Gas' },
    ];

    const steps = Array.from({ length: 12 }, (_, i) => ({
      stepNumber: i + 1,
      title: `STEP ${i + 1}: ${['Fume Hood & Shield Setup', 'Water Vessel Preparation', 'Sodium Metal Cutting', 'Dropping Sodium Pellet', 'Skittering & Melting Sphere', 'Vigorous Hydrogen Effervescence', 'Orange Flame & Micro-Explosion', 'Microscopic Electron Transfer', 'Return to Lab View', 'Basic Pink Solution Display', 'Thermal & pH Observations', 'Reaction Conclusion'][i]}`,
      description: 'Highly exothermic alkali metal reaction with water.',
      narrationText: `Sodium metal reacting vigorously with water in step ${i + 1}.`,
      cameraView: (i === 6 ? 'cinematic' : i === 7 ? 'macro_molecular' : 'close_up') as any,
      action: 'react' as any,
      fluidColor: i >= 9 ? '#e879f9' : '#38bdf8',
      fluidLevel: 70,
      reactionEffects: i >= 4 ? { bubbles: true, smoke: true, flame: i >= 6, pHValue: 13.0, temperature: 85 } : undefined,
    }));

    return {
      type: 'chemistry_lab',
      domain: 'Chemistry',
      title: 'Exothermic Alkali Metal Reaction: Sodium in Water',
      subtitle: 'Vigorous Hydrogen Gas Evolution & Flame Demonstration',
      summaryText: 'Simulating sodium metal melting into a sphere, skittering across water surface with hydrogen gas evolution and characteristic yellow-orange flame.',
      voiceNarrationText: 'Sodium metal melts into a silvery sphere on water, skittering violently with hydrogen gas evolution and fiery ignition.',
      chemData: {
        experimentName: 'Exothermic Reaction of Sodium Metal with Water',
        objective: 'To demonstrate extreme reactivity of alkali metals with water.',
        reactants,
        products,
        apparatus: ['Safety Shield', 'Large Trough / Beaker', 'Tweezers', 'Scalpel'],
        safetyEquipment: ['Full Face Shield', 'Heavy Duty Gloves', 'Blast Screen', 'Fume Hood'],
        balancedEquation: '2 Na(s) + 2 H₂O(l) → 2 NaOH(aq) + H₂(g)↑',
        reactionType: 'Vigorous Exothermic Redox',
        isAnimated: true,
        temperatureChange: '+65.0°C',
        observations: [
          'Sodium melts into a shiny sphere due to heat of reaction.',
          'Skitters rapidly on water supported by a cushion of hydrogen gas.',
          'Hydrogen gas ignites with a bright yellow-orange flame.',
          'Phenolphthalein indicator turns deep magenta/pink indicating NaOH formation.',
        ],
        result: 'Sodium completely reacted yielding basic NaOH solution and hydrogen gas.',
        steps,
      },
    };
  }

  // Preset 5: Titration
  public static getTitrationPreset(): RepresentationPayload {
    const reactants = [
      { formula: 'HCl(aq)', name: 'Hydrochloric Acid in Flask', color: '#f8fafc', volume: '25 mL', state: 'Acid' },
      { formula: 'NaOH(aq)', name: 'Sodium Hydroxide in Burette', color: '#38bdf8', volume: '50 mL burette', state: 'Base' },
    ];
    const products = [
      { formula: 'NaCl(aq) + H₂O(l)', name: 'Neutralized Salt Solution', color: '#f472b6', state: 'Equivalence State' },
    ];

    const steps = Array.from({ length: 12 }, (_, i) => ({
      stepNumber: i + 1,
      title: `STEP ${i + 1}: ${['Burette & Flask Alignment', 'Adding Phenolphthalein Indicator', 'Highlighting Clear Acid Solution', 'Opening Burette Stopcock', 'Dropwise Titrant Flow', 'Swirling Conical Flask', 'Transient Pink Flash', 'Microscopic H⁺ + OH⁻ Neutralization', 'Macro Lab Return', 'Persistent Light Pink Endpoint', 'Volume & pH Calculations', 'Titration Conclusion'][i]}`,
      description: 'Volumetric neutralization titration using phenolphthalein indicator.',
      narrationText: `Volumetric titration step ${i + 1}.`,
      cameraView: (i === 4 || i === 6 ? 'close_up' : i === 7 ? 'macro_molecular' : 'wide') as any,
      action: 'react' as any,
      fluidColor: i >= 9 ? '#f472b6' : '#f8fafc',
      fluidLevel: 50,
      reactionEffects: { colorChange: true, pHValue: i >= 9 ? 7.0 : 2.5, temperature: 24.5 },
    }));

    return {
      type: 'chemistry_lab',
      domain: 'Chemistry',
      title: 'Volumetric Acid-Base Titration',
      subtitle: 'Endpoint Determination with Phenolphthalein Indicator',
      summaryText: 'Simulating dropwise burette delivery of NaOH into HCl until permanent faint pink endpoint signals equivalence point (pH 7.0).',
      voiceNarrationText: 'Titrating Hydrochloric Acid with Sodium Hydroxide. Observe the precise color change at the equivalence point.',
      chemData: {
        experimentName: 'Acid-Base Volumetric Titration',
        objective: 'To determine unknown concentration of HCl using standardized NaOH.',
        reactants,
        products,
        apparatus: ['50 mL Glass Burette & Stand', '250 mL Erlenmeyer Conical Flask', 'Pipette (25 mL)', 'White Tile'],
        safetyEquipment: ['Goggles', 'Gloves', 'Lab Coat'],
        balancedEquation: 'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)',
        reactionType: 'Neutralization Volumetric Titration',
        isAnimated: true,
        temperatureChange: '+3.2°C',
        observations: [
          'Initial solution in conical flask is colorless with phenolphthalein.',
          'Transient pink color appears where NaOH drops hit, dissipating on swirling.',
          'Endpoint marked by a permanent faint pink tint lasting >30 seconds.',
        ],
        result: 'Reached sharp neutralization endpoint at exactly 24.8 mL titrant volume.',
        steps,
      },
    };
  }

  // Generic Fallback Neutralization
  public static getGenericNeutralizationPreset(rawInput: string | CustomExperimentInput): RepresentationPayload {
    const title = typeof rawInput === 'object' && rawInput.experimentName ? rawInput.experimentName : 'Acid-Base Neutralization Experiment';
    const objText = typeof rawInput === 'object' && rawInput.objective ? rawInput.objective : 'To simulate chemical reaction and analyze step-by-step visual interactions.';

    const reactants = [
      { formula: 'HCl(aq)', name: 'Hydrochloric Acid', color: '#ef4444', volume: '50 mL', state: 'Acidic Solution' },
      { formula: 'NaOH(aq)', name: 'Sodium Hydroxide', color: '#3b82f6', volume: '50 mL', state: 'Basic Solution' },
    ];
    const products = [
      { formula: 'NaCl(aq)', name: 'Sodium Chloride (Salt)', color: '#10b981', state: 'Aqueous Salt' },
      { formula: 'H₂O(l)', name: 'Water', color: '#60a5fa', state: 'Pure Liquid' },
    ];

    const steps = Array.from({ length: 12 }, (_, i) => ({
      stepNumber: i + 1,
      title: `STEP ${i + 1}: ${['Laboratory Environment Overview', 'Chemicals & Glassware Setup', 'Highlighting Reactants', 'Grasping Apparatus', 'Pouring Chemicals Naturally', 'Solution Mixing & Vortex', 'Exothermic Neutralization Effects', 'Microscopic Atomic Interaction Zoom', 'Macro Laboratory View Return', 'Final Product Display', 'Scientific Observations & Data Readouts', 'Reaction Conclusion & Takeaway'][i]}`,
      description: `Step ${i + 1} of 12-step realistic chemistry simulation engine.`,
      narrationText: `Step ${i + 1}: ${['Showing modern chemistry lab setup.', 'Displaying reactants and glassware on lab bench.', 'Highlighting hydrochloric acid and sodium hydroxide.', 'Animate picking up pipette.', 'Pouring reactants into beaker.', 'Stirring solution.', 'Neutralization reaction releasing heat.', 'Zooming into beaker to see H+ and OH- forming H2O.', 'Returning to wide lab view.', 'Displaying clear neutral solution.', 'Recording pH 7.0 and thermal readouts.', 'Conclusion: Acid-base reaction complete.'][i]}`,
      cameraView: (i === 7 ? 'macro_molecular' : i === 5 ? 'top_view' : i === 0 ? 'wide' : 'close_up') as any,
      action: (i === 4 ? 'pour' : i === 5 ? 'mix' : i === 6 || i === 7 ? 'react' : 'setup') as any,
      fluidColor: i >= 6 ? '#10b981' : '#ef4444',
      fluidLevel: Math.min(20 + i * 5, 65),
      reactionEffects: i >= 6 ? { bubbles: true, colorChange: true, pHValue: 7.0, temperature: 38.5 } : undefined,
    }));

    return {
      type: 'chemistry_lab',
      domain: 'Chemistry',
      title,
      subtitle: '12-Step AI Laboratory Simulation',
      summaryText: objText,
      voiceNarrationText: `Simulating ${title}. Following 12-step continuous animated laboratory workflow.`,
      chemData: {
        experimentName: title,
        objective: objText,
        reactants,
        products,
        apparatus: ['Glass Beaker (250 mL)', 'Measuring Cylinder', 'Pipette', 'Stirring Rod', 'Digital Balance', 'Fume Hood'],
        safetyEquipment: ['Safety Goggles', 'Nitrile Gloves', 'Lab Coat'],
        balancedEquation: 'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)',
        reactionType: 'Acid-Base Neutralization',
        isAnimated: true,
        temperatureChange: '+14.5°C',
        observations: [
          'Exothermic neutralization reaction releases heat (+14.5°C).',
          'pH transitions from acidic (pH 1.0) / basic (pH 13.0) to neutral (pH 7.0).',
          'Colorless solution of aqueous sodium and chloride ions formed.',
        ],
        result: 'Neutral aqueous salt solution formed.',
        steps,
        microscopicData: {
          reactantsAtoms: [
            { symbol: 'H⁺', color: '#ef4444', count: 4, charge: '+1' },
            { symbol: 'Cl⁻', color: '#22c55e', count: 4, charge: '-1' },
            { symbol: 'Na⁺', color: '#3b82f6', count: 4, charge: '+1' },
            { symbol: 'OH⁻', color: '#06b6d4', count: 4, charge: '-1' },
          ],
          productsMolecules: [
            { formula: 'H₂O', name: 'Water Molecule', structure: '1 Oxygen & 2 Hydrogen', count: 4 },
            { formula: 'NaCl', name: 'Sodium Chloride Ion Pair', structure: 'Na⁺ and Cl⁻', count: 4 },
          ],
        },
      },
    };
  }
}
