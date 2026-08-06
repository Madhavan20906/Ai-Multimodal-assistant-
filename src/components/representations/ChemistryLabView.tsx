import React, { useState, useEffect, useRef } from 'react';
import { RepresentationPayload } from '../../types';
import { ChemistrySimulationGenerator, CustomExperimentInput } from '../../services/chemistrySimulationGenerator';
import {
  Beaker, Flame, Thermometer, CheckCircle, ArrowRight, RotateCcw,
  Play, Pause, SkipForward, SkipBack, Eye, Volume2, Sparkles, Sliders,
  Camera, CameraOff, AlertTriangle, ShieldCheck, Download, PlusCircle, X
} from 'lucide-react';

interface ChemistryLabViewProps {
  payload: RepresentationPayload;
}

export const ChemistryLabView: React.FC<ChemistryLabViewProps> = ({ payload: initialPayload }) => {
  const [payload, setPayload] = useState<RepresentationPayload>(initialPayload);
  const chemData = payload.chemData;

  // Simulation state
  const steps = chemData?.steps || [];
  const [currentStepIndex, setCurrentStepIndex] = useState(chemData?.currentStepIndex || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [cameraView, setCameraView] = useState<'wide' | 'close_up' | 'top_view' | 'macro_molecular' | 'cinematic'>('wide');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [snapshotImage, setSnapshotImage] = useState<string | null>(null);

  // Form state for custom experiment
  const [customForm, setCustomForm] = useState<CustomExperimentInput>({
    experimentName: 'Synthesis of Copper(II) Hydroxide',
    objective: 'Demonstrate precipitation reaction between CuSO4 and NaOH.',
    chemicals: 'Copper(II) Sulfate, Sodium Hydroxide',
    apparatus: 'Glass Beaker, Pipette, Stirring Rod, Fume Hood',
    procedure: '1. Measure CuSO4 solution. 2. Add NaOH dropwise. 3. Observe blue precipitate.',
    observation: 'Bright blue gelatinous precipitate formed immediately.',
    result: 'Copper(II) Hydroxide solid (Cu(OH)2) precipitated out.',
    voiceTranscript: 'Add Sodium Hydroxide dropwise to Copper Sulfate solution until blue precipitate forms.',
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync state when payload changes
  useEffect(() => {
    setPayload(initialPayload);
    setCurrentStepIndex(0);
  }, [initialPayload]);

  const currentStep = steps[currentStepIndex] || steps[0] || {
    stepNumber: 1,
    title: 'STEP 1: Laboratory Environment',
    description: 'Modern chemistry lab overview.',
    narrationText: chemData?.narrationScript || payload.voiceNarrationText || 'Welcome to the laboratory simulation.',
    cameraView: 'wide',
    fluidColor: chemData?.reactants[0]?.color || '#06b6d4',
    fluidLevel: 40,
  };

  // Sync camera view with current step
  useEffect(() => {
    if (currentStep.cameraView) {
      setCameraView(currentStep.cameraView);
    }
  }, [currentStepIndex]);

  // Speech Narration TTS
  useEffect(() => {
    if (isAudioEnabled && currentStep.narrationText && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentStep.narrationText);
      utterance.rate = 1.0 * playbackSpeed;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentStepIndex, isAudioEnabled]);

  // Auto-play timer loop
  useEffect(() => {
    if (isPlaying) {
      stepTimerRef.current = setTimeout(() => {
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 4500 / playbackSpeed);
    } else if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current);
    }
    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    };
  }, [isPlaying, currentStepIndex, steps.length, playbackSpeed]);

  // Canvas 2D/3D Hybrid Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 480);

    let time = 0;
    let particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; alpha: number }[] = [];
    let atoms: { x: number; y: number; vx: number; vy: number; symbol: string; color: string; radius: number }[] = [];

    // Initialize microscopic atoms for Step 8
    const microAtomsData = chemData?.microscopicData?.reactantsAtoms || [
      { symbol: 'Cu²⁺', color: '#0284c7', count: 6 },
      { symbol: 'OH⁻', color: '#38bdf8', count: 12 },
      { symbol: 'Na⁺', color: '#10b981', count: 12 },
      { symbol: 'SO₄²⁻', color: '#f59e0b', count: 6 },
    ];

    atoms = [];
    microAtomsData.forEach((item) => {
      for (let i = 0; i < item.count; i++) {
        atoms.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2.5,
          vy: (Math.random() - 0.5) * 2.5,
          symbol: item.symbol,
          color: item.color,
          radius: 18,
        });
      }
    });

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      // Camera transformation matrix
      ctx.save();
      if (cameraView === 'close_up') {
        ctx.translate(-width * 0.15, -height * 0.15);
        ctx.scale(1.3, 1.3);
      } else if (cameraView === 'top_view') {
        ctx.translate(width * 0.1, height * 0.1);
        ctx.scale(1.1, 1.1);
      } else if (cameraView === 'macro_molecular') {
        ctx.translate(-width * 0.2, -height * 0.2);
        ctx.scale(1.4, 1.4);
      }

      // Background Modern Chemistry Laboratory Scene
      drawLaboratoryEnvironment(ctx, width, height, time);

      if (cameraView === 'macro_molecular') {
        // Step 8: Microscopic Atom View
        drawMicroscopicAtoms(ctx, width, height, atoms, time);
      } else {
        // Steps 1-7, 9-12: Macro Workbench Glassware & Reaction Scene
        drawWorkbenchScene(ctx, width, height, time, currentStep, chemData);
      }

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [cameraView, currentStepIndex, chemData]);

  // Handle Preset Select
  const handleSelectPreset = (presetKey: string) => {
    let newPayload = initialPayload;
    if (presetKey === 'copper') newPayload = ChemistrySimulationGenerator.getCopperSulfatePreset();
    if (presetKey === 'magnesium') newPayload = ChemistrySimulationGenerator.getMagnesiumCombustionPreset();
    if (presetKey === 'silver') newPayload = ChemistrySimulationGenerator.getSilverNitratePreset();
    if (presetKey === 'sodium') newPayload = ChemistrySimulationGenerator.getSodiumWaterPreset();
    if (presetKey === 'titration') newPayload = ChemistrySimulationGenerator.getTitrationPreset();

    setPayload(newPayload);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Handle Custom Form Submit
  const handleCustomFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPayload = ChemistrySimulationGenerator.createSimulation(customForm);
    setPayload(newPayload);
    setCurrentStepIndex(0);
    setShowCustomModal(false);
    setIsPlaying(true);
  };

  // Capture High-Res Snapshot Image
  const handleTakeSnapshot = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setSnapshotImage(dataUrl);
    }
  };

  return (
    <div className="representation-card chem-card realistic-chem-studio">
      {/* Top HUD Header & Simulation Controls */}
      <div className="card-header chem-studio-header">
        <div className="card-title-group">
          <Beaker className="accent-icon" size={24} />
          <div>
            <h3>{payload.title}</h3>
            <p className="card-subtitle">{payload.subtitle} • {chemData?.experimentName || 'AI Lab Simulation'}</p>
          </div>
        </div>

        <div className="studio-actions-group">
          <button className="custom-exp-btn" onClick={() => setShowCustomModal(true)}>
            <PlusCircle size={15} />
            <span>AI Simulation Generator</span>
          </button>
          <button className="snapshot-btn" onClick={handleTakeSnapshot} title="Capture Visual Image Snapshot">
            <Camera size={15} />
            <span>AI Snapshot</span>
          </button>
          <span className="info-badge chem-type">{chemData?.reactionType || 'Chemical Reaction'}</span>
          {chemData?.temperatureChange && (
            <span className="info-badge temp-badge"><Thermometer size={12} /> {chemData.temperatureChange}</span>
          )}
        </div>
      </div>

      {/* Preset Quick Selection Bar */}
      <div className="chem-presets-quick-bar">
        <span className="preset-label"><Sparkles size={13} /> Simulation Scenarios:</span>
        <button className="quick-preset-btn" onClick={() => handleSelectPreset('copper')}>CuSO₄ + NaOH (Blue Precipitate)</button>
        <button className="quick-preset-btn" onClick={() => handleSelectPreset('magnesium')}>Magnesium Ribbon Combustion</button>
        <button className="quick-preset-btn" onClick={() => handleSelectPreset('silver')}>Silver Nitrate (AgCl Precipitate)</button>
        <button className="quick-preset-btn" onClick={() => handleSelectPreset('sodium')}>Sodium in Water (Exothermic)</button>
        <button className="quick-preset-btn" onClick={() => handleSelectPreset('titration')}>Volumetric Titration</button>
      </div>

      {/* 12-Step Progress Stepper Bar */}
      <div className="simulation-stepper-bar">
        {steps.map((st, idx) => (
          <button
            key={idx}
            className={`step-pill ${idx === currentStepIndex ? 'active' : ''} ${idx < currentStepIndex ? 'completed' : ''}`}
            onClick={() => { setCurrentStepIndex(idx); setIsPlaying(false); }}
            title={st.title}
          >
            <span className="step-num">{idx + 1}</span>
            <span className="step-name-short">{st.title.split(':')[1]?.trim() || `Step ${idx + 1}`}</span>
          </button>
        ))}
      </div>

      {/* Main Canvas Viewport with Overlay Controls */}
      <div className="chem-workbench-viewport realistic-viewport">
        <canvas ref={canvasRef} className="chem-simulation-canvas" />

        {/* Floating Camera View Switcher */}
        <div className="camera-view-overlay">
          <span className="overlay-tag"><Camera size={12} /> Camera Mode</span>
          <button className={`cam-btn ${cameraView === 'wide' ? 'active' : ''}`} onClick={() => setCameraView('wide')}>Wide Lab</button>
          <button className={`cam-btn ${cameraView === 'close_up' ? 'active' : ''}`} onClick={() => setCameraView('close_up')}>Close-Up</button>
          <button className={`cam-btn ${cameraView === 'top_view' ? 'active' : ''}`} onClick={() => setCameraView('top_view')}>Top View</button>
          <button className={`cam-btn ${cameraView === 'macro_molecular' ? 'active' : ''}`} onClick={() => setCameraView('macro_molecular')}>Step 8 Atom Zoom</button>
        </div>

        {/* Safety Equipment Indicator */}
        <div className="safety-overlay-badge">
          <ShieldCheck size={14} className="shield-icon" />
          <span>Safety Gear: {chemData?.safetyEquipment?.join(', ') || 'Goggles, Gloves & Fume Hood Active'}</span>
        </div>

        {/* Real-time Reaction Readout Overlay */}
        <div className="reaction-readout-overlay">
          <div className="readout-item">
            <span>pH Level</span>
            <strong style={{ color: (currentStep.reactionEffects?.pHValue || 7) > 8 ? '#a855f7' : (currentStep.reactionEffects?.pHValue || 7) < 6 ? '#ef4444' : '#10b981' }}>
              {(currentStep.reactionEffects?.pHValue || 7.0).toFixed(1)}
            </strong>
          </div>
          <div className="readout-item">
            <span>Temp</span>
            <strong style={{ color: '#f59e0b' }}>
              +{(currentStep.reactionEffects?.temperature || 25.0).toFixed(1)}°C
            </strong>
          </div>
          <div className="readout-item">
            <span>Active Step</span>
            <strong>{currentStepIndex + 1} / {Math.max(steps.length, 12)}</strong>
          </div>
        </div>
      </div>

      {/* Simulation Playback Control Toolbar */}
      <div className="playback-toolbar">
        <div className="playback-buttons">
          <button className="play-btn" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            <span>{isPlaying ? 'Pause' : 'Play Narration'}</span>
          </button>
          <button className="nav-btn" onClick={() => { setCurrentStepIndex(Math.max(0, currentStepIndex - 1)); setIsPlaying(false); }}>
            <SkipBack size={16} /> Prev
          </button>
          <button className="nav-btn" onClick={() => { setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1)); setIsPlaying(false); }}>
            Next <SkipForward size={16} />
          </button>
          <button className="nav-btn" onClick={() => { setCurrentStepIndex(0); setIsPlaying(false); }}>
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        <div className="playback-options">
          <div className="speed-selector">
            <span>Speed:</span>
            {[0.5, 1.0, 2.0].map((sp) => (
              <button key={sp} className={`speed-btn ${playbackSpeed === sp ? 'active' : ''}`} onClick={() => setPlaybackSpeed(sp)}>
                {sp}x
              </button>
            ))}
          </div>

          <button className={`audio-btn ${isAudioEnabled ? 'active' : ''}`} onClick={() => setIsAudioEnabled(!isAudioEnabled)}>
            <Volume2 size={16} /> {isAudioEnabled ? 'Voice On' : 'Voice Off'}
          </button>
        </div>
      </div>

      {/* Active Step Narration & Explanation Card */}
      <div className="active-narration-card">
        <div className="narration-header">
          <span className="step-title-badge">{currentStep.title}</span>
          <span className="narration-tag"><Volume2 size={13} /> Narrator Script</span>
        </div>
        <p className="narration-text">"{currentStep.narrationText}"</p>
        <p className="step-description">{currentStep.description}</p>
      </div>

      {/* Chemical Stoichiometric Equation Banner */}
      <div className="balanced-equation-box">
        <h4>Balanced Chemical Equation</h4>
        <div className="equation-text">{chemData?.balancedEquation || 'A + B → C + D'}</div>
      </div>

      {/* Scientific Observations & Products Grid */}
      <div className="observations-grid">
        <div className="obs-card">
          <h4>Reactants & Apparatus</h4>
          <div className="chemical-chips-list">
            {chemData?.reactants.map((r, i) => (
              <div key={i} className="chem-chip">
                <span className="chip-color" style={{ backgroundColor: r.color }} />
                <strong>{r.name}</strong>
                <span className="chip-formula">{r.formula}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="obs-card">
          <h4>Products & State</h4>
          <div className="chemical-chips-list">
            {chemData?.products.map((p, i) => (
              <div key={i} className="chem-chip product">
                <span className="chip-color" style={{ backgroundColor: p.color }} />
                <strong>{p.name}</strong>
                <span className="chip-formula">{p.formula}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Observations List */}
      <div className="observations-box">
        <h4>Key Scientific Observations</h4>
        <ul>
          {chemData?.observations.map((obs, idx) => (
            <li key={idx}>
              <CheckCircle size={14} className="check-icon" />
              <span>{obs}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Custom AI Simulation Generator Modal */}
      {showCustomModal && (
        <div className="modal-overlay">
          <div className="custom-modal-card">
            <div className="modal-header">
              <div className="modal-title">
                <Sparkles size={20} className="accent-icon" />
                <h3>AI Scientific Laboratory Generator</h3>
              </div>
              <button className="close-btn" onClick={() => setShowCustomModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCustomFormSubmit} className="custom-exp-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Experiment Name:</label>
                  <input
                    type="text"
                    value={customForm.experimentName}
                    onChange={(e) => setCustomForm({ ...customForm, experimentName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Objective:</label>
                  <input
                    type="text"
                    value={customForm.objective}
                    onChange={(e) => setCustomForm({ ...customForm, objective: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Chemicals Involved:</label>
                  <input
                    type="text"
                    value={customForm.chemicals}
                    onChange={(e) => setCustomForm({ ...customForm, chemicals: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Apparatus List:</label>
                  <input
                    type="text"
                    value={customForm.apparatus}
                    onChange={(e) => setCustomForm({ ...customForm, apparatus: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Procedure Steps:</label>
                <textarea
                  rows={2}
                  value={customForm.procedure}
                  onChange={(e) => setCustomForm({ ...customForm, procedure: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Observations:</label>
                  <input
                    type="text"
                    value={customForm.observation}
                    onChange={(e) => setCustomForm({ ...customForm, observation: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Result:</label>
                  <input
                    type="text"
                    value={customForm.result}
                    onChange={(e) => setCustomForm({ ...customForm, result: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Voice Narration Script:</label>
                <textarea
                  rows={2}
                  value={customForm.voiceTranscript}
                  onChange={(e) => setCustomForm({ ...customForm, voiceTranscript: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowCustomModal(false)}>Cancel</button>
                <button type="submit" className="submit-exp-btn">
                  <Sparkles size={16} /> Generate 12-Step Animated Simulation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Snapshot Preview Modal */}
      {snapshotImage && (
        <div className="modal-overlay" onClick={() => setSnapshotImage(null)}>
          <div className="snapshot-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>AI Generated Visual Snapshot</h3>
              <button className="close-btn" onClick={() => setSnapshotImage(null)}><X size={18} /></button>
            </div>
            <img src={snapshotImage} alt="AI Laboratory Snapshot" className="snapshot-preview-img" />
            <div className="modal-footer">
              <a href={snapshotImage} download="ai_laboratory_simulation.png" className="download-btn">
                <Download size={16} /> Download Image (PNG)
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="card-footer">
        <p>{payload.summaryText}</p>
      </div>
    </div>
  );
};

// ── Laboratory Drawing Functions ──────────────────────────────────────────

function drawLaboratoryEnvironment(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // Deep scientific lab background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, '#040711');
  bgGrad.addColorStop(0.6, '#080e20');
  bgGrad.addColorStop(1, '#0e162d');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // Fume Hood & Rear Glass Wall Structure
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(w * 0.1, h * 0.05, w * 0.8, h * 0.65);

  // Grid tiles on lab bench wall
  for (let x = w * 0.1; x < w * 0.9; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, h * 0.05);
    ctx.lineTo(x, h * 0.7);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
    ctx.stroke();
  }

  // Laboratory Bench Table Top
  const benchGrad = ctx.createLinearGradient(0, h * 0.68, 0, h);
  benchGrad.addColorStop(0, '#1e293b');
  benchGrad.addColorStop(0.1, '#0f172a');
  benchGrad.addColorStop(1, '#020617');
  ctx.fillStyle = benchGrad;
  ctx.fillRect(0, h * 0.68, w, h * 0.32);

  // Cyan Neon Lip Edge under bench
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#06b6d4';
  ctx.fillRect(0, h * 0.68, w, 2);
  ctx.shadowBlur = 0;
}

function drawWorkbenchScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  step: any,
  chemData?: any
) {
  const benchY = h * 0.68;
  const isReacting = step.action === 'react' || step.action === 'mix';
  const fluidColor = step.fluidColor || chemData?.reactants[0]?.color || '#0284c7';
  const fluidLevel = (step.fluidLevel || 50) / 100;

  // Draw Reagent Bottle A (Left)
  drawReagentBottle(ctx, w * 0.22, benchY - 110, 60, 110, chemData?.reactants[0]?.color || '#0284c7', chemData?.reactants[0]?.name || 'Reactant A', step.activeChemical?.includes('CuSO4') || step.activeChemical?.includes('Acid'));

  // Draw Reagent Bottle B (Left Center)
  drawReagentBottle(ctx, w * 0.35, benchY - 95, 50, 95, chemData?.reactants[1]?.color || '#06b6d4', chemData?.reactants[1]?.name || 'Reactant B', step.activeChemical?.includes('NaOH'));

  // Draw Central Reaction Beaker (Primary Vessel)
  drawBeaker(ctx, w * 0.52, benchY - 160, 120, 160, fluidColor, fluidLevel, step, t);

  // Draw Bunsen Burner (Right Center) if heating/magnesium/exothermic
  const hasBurner = step.reactionEffects?.flame || step.title.toLowerCase().includes('combustion') || step.title.toLowerCase().includes('heat');
  if (hasBurner) {
    drawBunsenBurner(ctx, w * 0.72, benchY - 90, t);
  } else {
    // Graduated Measuring Cylinder & Test Tube Rack
    drawMeasuringCylinder(ctx, w * 0.72, benchY - 130, 35, 130, '#38bdf8');
    drawTestTubeRack(ctx, w * 0.84, benchY - 90, 80, 90);
  }

  // Draw Animated Gloved Lab Hand / Pipette if pouring or picking apparatus
  if (step.action === 'pour' || step.action === 'pick_apparatus') {
    drawLabHandAndPipette(ctx, w * 0.52, benchY - 210, fluidColor, t);
  }
}

function drawReagentBottle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  label: string,
  isHighlighted: boolean
) {
  // Glow if active chemical
  if (isHighlighted) {
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 20;
  }

  // Amber/Clear Glass Bottle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);

  // Liquid Fill
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.8;
  ctx.fillRect(x + 3, y + h * 0.3, w - 6, h * 0.68);
  ctx.globalAlpha = 1.0;

  // Cap
  ctx.fillStyle = '#334155';
  ctx.fillRect(x + w * 0.25, y - 14, w * 0.5, 14);

  // Label Card
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(x + 5, y + h * 0.4, w - 10, 24);
  ctx.fillStyle = '#000';
  ctx.font = 'bold 9px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label.slice(0, 10), x + w / 2, y + h * 0.4 + 15);

  ctx.shadowBlur = 0;
}

function drawBeaker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fluidColor: string,
  fillRatio: number,
  step: any,
  t: number
) {
  // Beaker Outer Glass
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);

  // Graduation Marks
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;
  for (let i = 1; i <= 4; i++) {
    const gy = y + h - (h / 5) * i;
    ctx.beginPath();
    ctx.moveTo(x, gy);
    ctx.lineTo(x + 15, gy);
    ctx.stroke();
  }

  // Fluid Fill
  const fluidHeight = h * fillRatio;
  const fluidTopY = y + h - fluidHeight;

  ctx.fillStyle = fluidColor;
  ctx.globalAlpha = 0.85;
  ctx.fillRect(x + 3, fluidTopY, w - 6, fluidHeight - 3);

  // Meniscus Curve
  ctx.beginPath();
  ctx.ellipse(x + w / 2, fluidTopY, w / 2 - 3, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = fluidColor;
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // Step 7 Reaction Effects: Bubbles, Smoke, Flame, Precipitate
  const effects = step.reactionEffects || {};

  // Precipitate (Settling Solid at Bottom)
  if (effects.precipitate) {
    ctx.fillStyle = effects.precipitateColor || '#0284c7';
    for (let p = 0; p < 25; p++) {
      const px = x + 10 + Math.sin(p * 1.5 + t) * (w - 20) * 0.4 + (w - 20) * 0.5;
      const py = y + h - 8 - (p % 5) * 4;
      ctx.beginPath();
      ctx.arc(px, py, 3 + (p % 3), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Rising Bubbles
  if (effects.bubbles) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let b = 0; b < 12; b++) {
      const bx = x + 10 + ((b * 17) % (w - 20));
      const by = fluidTopY + ((b * 25 + t * 40) % fluidHeight);
      ctx.beginPath();
      ctx.arc(bx, by, 2 + (b % 3), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Rising Smoke / Steam
  if (effects.smoke) {
    ctx.fillStyle = 'rgba(240, 240, 245, 0.25)';
    for (let s = 0; s < 8; s++) {
      const sx = x + w / 2 + Math.sin(t * 2 + s) * 20;
      const sy = fluidTopY - 20 - ((s * 20 + t * 30) % 80);
      ctx.beginPath();
      ctx.arc(sx, sy, 8 + s * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawBunsenBurner(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  // Metallic Base & Stem
  ctx.fillStyle = '#475569';
  ctx.fillRect(x - 20, y + 60, 40, 10);
  ctx.fillRect(x - 5, y + 20, 10, 40);

  // Flame
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 15;
  ctx.fillStyle = '#06b6d4';
  ctx.beginPath();
  ctx.moveTo(x - 10, y + 20);
  ctx.quadraticCurveTo(x, y - 20 + Math.sin(t * 10) * 5, x + 10, y + 20);
  ctx.fill();

  // Inner Hot Flame Cone
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(x - 4, y + 20);
  ctx.quadraticCurveTo(x, y - 5 + Math.sin(t * 12) * 3, x + 4, y + 20);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawMeasuringCylinder(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = color;
  ctx.globalAlpha = 0.7;
  ctx.fillRect(x + 2, y + h * 0.4, w - 4, h * 0.6);
  ctx.globalAlpha = 1.0;
}

function drawTestTubeRack(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = '#334155';
  ctx.fillRect(x, y + h - 15, w, 15);
  ctx.fillRect(x, y + 20, w, 8);

  // 3 Test Tubes
  for (let i = 0; i < 3; i++) {
    const tx = x + 12 + i * 24;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.strokeRect(tx, y, 12, h - 5);
    ctx.fillStyle = i === 0 ? '#ef4444' : i === 1 ? '#10b981' : '#3b82f6';
    ctx.globalAlpha = 0.7;
    ctx.fillRect(tx + 2, y + 30, 8, h - 37);
    ctx.globalAlpha = 1.0;
  }
}

function drawLabHandAndPipette(ctx: CanvasRenderingContext2D, beakerCenterX: number, topY: number, fluidColor: string, t: number) {
  const pipetteX = beakerCenterX + 15;
  const pipetteY = topY - 30 + Math.sin(t * 3) * 6;

  // Gloved Hand Silhouette
  ctx.fillStyle = '#e2e8f0'; // White nitrile glove
  ctx.beginPath();
  ctx.arc(pipetteX + 30, pipetteY - 40, 20, 0, Math.PI * 2);
  ctx.fill();

  // Glass Pipette Tube
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(pipetteX, pipetteY);
  ctx.lineTo(pipetteX, pipetteY - 60);
  ctx.stroke();

  // Liquid Stream Pouring Down
  ctx.strokeStyle = fluidColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pipetteX, pipetteY);
  ctx.lineTo(beakerCenterX, topY + 60);
  ctx.stroke();
}

function drawMicroscopicAtoms(ctx: CanvasRenderingContext2D, w: number, h: number, atoms: any[], t: number) {
  // Dark Quantum Particle Matrix Background
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, w, h);

  // Microscopic Grid
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 30) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }

  // Draw Atom Spheres & Valence Electron Rings
  atoms.forEach((atom, idx) => {
    atom.x += atom.vx;
    atom.y += atom.vy;

    if (atom.x < 40 || atom.x > w - 40) atom.vx *= -1;
    if (atom.y < 40 || atom.y > h - 40) atom.vy *= -1;

    // Glowing Sphere
    ctx.shadowColor = atom.color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = atom.color;
    ctx.beginPath();
    ctx.arc(atom.x, atom.y, atom.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Electron Orbit Rings
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(atom.x, atom.y, atom.radius + 8, atom.radius + 3, t * 2 + idx, 0, Math.PI * 2);
    ctx.stroke();

    // Chemical Symbol Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(atom.symbol, atom.x, atom.y + 4);
  });
}
