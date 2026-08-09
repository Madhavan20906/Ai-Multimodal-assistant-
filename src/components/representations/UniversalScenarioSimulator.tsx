import React, { useState, useEffect, useRef } from 'react';
import { RepresentationPayload } from '../../types';
import { UniversalSimulationGenerator, UniversalScenarioInput, SimulationStep, SimulationEntity } from '../../services/universalSimulationGenerator';
import {
  Sparkles, Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2,
  Camera, PlusCircle, X, ShieldCheck, Download, Sliders, Eye, Activity, Globe
} from 'lucide-react';

interface UniversalScenarioSimulatorProps {
  payload: RepresentationPayload;
}

export const UniversalScenarioSimulator: React.FC<UniversalScenarioSimulatorProps> = ({ payload: initialPayload }) => {
  const [payload, setPayload] = useState<RepresentationPayload>(initialPayload);
  const scenarioData = payload.scenarioData;

  const steps: SimulationStep[] = (scenarioData?.steps as SimulationStep[]) || [
    {
      stepNumber: 1,
      title: 'STEP 1: Scenario Overview',
      description: payload.summaryText || 'Universal Scenario Simulation',
      narrationText: payload.voiceNarrationText || 'Welcome to the Universal Scenario Simulation Engine.',
      cameraView: 'wide' as const,
      animationAction: 'idle' as const,
      particleEffect: 'none' as const,
    },
  ];

  const entities: SimulationEntity[] = (scenarioData?.entities as SimulationEntity[]) || [
    { id: 'e1', name: 'Primary Entity', shape: 'sphere' as const, color: '#06b6d4', size: 2.5, position: { x: 0, y: 0, z: 0 }, glowing: true }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [cameraView, setCameraView] = useState<'wide' | 'close_up' | 'top_view' | 'microscopic_zoom' | 'cinematic'>('wide');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [snapshotImage, setSnapshotImage] = useState<string | null>(null);

  // Form state for custom scenario generator
  const [customForm, setCustomForm] = useState<UniversalScenarioInput>({
    scenarioTitle: 'Photosynthesis Solar Energy Conversion',
    category: 'Biology & Energetics',
    description: 'Simulating sunlight photons striking chloroplast chlorophyll molecules to convert water and carbon dioxide into glucose and oxygen.',
    environment: 'nature',
    voiceScript: 'Chlorophyll molecules capture photon energy, splitting H2O into oxygen gas and synthesizing ATP energy for glucose production.',
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync state when payload changes
  useEffect(() => {
    setPayload(initialPayload);
    setCurrentStepIndex(0);
  }, [initialPayload]);

  const currentStep = steps[currentStepIndex] || steps[0];

  // Camera synchronization
  useEffect(() => {
    if (currentStep.cameraView) {
      setCameraView(currentStep.cameraView);
    }
  }, [currentStepIndex]);

  // Speech Narration TTS — Disabled (Voiceover turned off, speech recognition input stays active)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
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

  // Canvas Universal 3D/2D Animated Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 480);
    let time = 0;

    const render = () => {
      time += 0.03 * playbackSpeed;
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      // Apply Camera View Scaling & Translation
      if (cameraView === 'close_up') {
        ctx.translate(-width * 0.1, -height * 0.1);
        ctx.scale(1.25, 1.25);
      } else if (cameraView === 'top_view') {
        ctx.translate(width * 0.05, height * 0.05);
        ctx.scale(1.1, 1.1);
      } else if (cameraView === 'microscopic_zoom') {
        ctx.translate(-width * 0.25, -height * 0.25);
        ctx.scale(1.5, 1.5);
      } else if (cameraView === 'cinematic') {
        const slowPan = Math.sin(time * 0.5) * 20;
        ctx.translate(slowPan, slowPan * 0.5);
        ctx.scale(1.15, 1.15);
      }

      // Render Environment Background
      const env = scenarioData?.environment || 'studio';
      drawEnvironmentBackground(ctx, width, height, env, time);

      // Render Entities & Particles
      if (cameraView === 'microscopic_zoom') {
        drawMicroscopicQuantumScene(ctx, width, height, time, currentStep);
      } else {
        drawEntitiesAndParticles(ctx, width, height, time, entities, currentStep);
      }

      ctx.restore();

      // Draw screen-space overlays (Oscilloscope Telemetry Graph, Technical HUD Borders)
      drawScreenSpaceHUD(ctx, width, height, time, currentStepIndex, steps, currentStep);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [cameraView, currentStepIndex, scenarioData, playbackSpeed]);

  // Handle Preset Quick Selection
  const handleSelectPreset = (presetKey: string) => {
    let newPayload = initialPayload;
    if (presetKey === 'space') newPayload = UniversalSimulationGenerator.getSpaceRocketPreset();
    if (presetKey === 'engine') newPayload = UniversalSimulationGenerator.getEnginePistonPreset();
    if (presetKey === 'dna') newPayload = UniversalSimulationGenerator.getDNAReplicationPreset();
    if (presetKey === 'optics') newPayload = UniversalSimulationGenerator.getPhysicsWavePreset();

    setPayload(newPayload);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Submit Custom Scenario Prompt Form
  const handleCustomFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPayload = UniversalSimulationGenerator.createScenario(customForm);
    setPayload(newPayload);
    setCurrentStepIndex(0);
    setShowCustomModal(false);
    setIsPlaying(true);
  };

  // High-Res Image Snapshot Capture
  const handleTakeSnapshot = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      setSnapshotImage(dataUrl);
    }
  };

  return (
    <div className="representation-card universal-sim-studio">
      {/* HUD Header Bar */}
      <div className="card-header chem-studio-header">
        <div className="card-title-group">
          <Sparkles className="accent-icon" size={24} />
          <div>
            <h3>{payload.title}</h3>
            <p className="card-subtitle">{payload.subtitle} • {payload.domain}</p>
          </div>
        </div>

        <div className="studio-actions-group">
          <button className="custom-exp-btn" onClick={() => setShowCustomModal(true)}>
            <PlusCircle size={15} />
            <span>Universal AI Generator</span>
          </button>
          <button className="snapshot-btn" onClick={handleTakeSnapshot} title="Capture Image Snapshot">
            <Camera size={15} />
            <span>AI Snapshot</span>
          </button>
          <span className="info-badge chem-type">{scenarioData?.environment?.toUpperCase() || '3D SIMULATION'}</span>
        </div>
      </div>

      {/* Preset Quick Bar for Instant Testing across domains */}
      <div className="chem-presets-quick-bar">
        <span className="preset-label"><Globe size={13} /> Scenario Domain Presets:</span>
        <button className="quick-preset-btn" onClick={() => handleSelectPreset('space')}>🚀 Space Rocket Launch & Orbit</button>
        <button className="quick-preset-btn" onClick={() => handleSelectPreset('engine')}>⚙️ 4-Stroke Engine Piston</button>
        <button className="quick-preset-btn" onClick={() => handleSelectPreset('dna')}>🧬 DNA Double Helix Replication</button>
        <button className="quick-preset-btn" onClick={() => handleSelectPreset('optics')}>🌈 Laser Light Prism Refraction</button>
      </div>

      {/* Step Timeline Stepper Bar */}
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

      {/* Main Viewport Canvas */}
      <div className="chem-workbench-viewport realistic-viewport">
        <canvas ref={canvasRef} className="chem-simulation-canvas" />

        {/* Floating Camera View Controls */}
        <div className="camera-view-overlay">
          <span className="overlay-tag"><Camera size={12} /> Camera Angle</span>
          <button className={`cam-btn ${cameraView === 'wide' ? 'active' : ''}`} onClick={() => setCameraView('wide')}>Wide View</button>
          <button className={`cam-btn ${cameraView === 'close_up' ? 'active' : ''}`} onClick={() => setCameraView('close_up')}>Close-Up</button>
          <button className={`cam-btn ${cameraView === 'top_view' ? 'active' : ''}`} onClick={() => setCameraView('top_view')}>Top View</button>
          <button className={`cam-btn ${cameraView === 'microscopic_zoom' ? 'active' : ''}`} onClick={() => setCameraView('microscopic_zoom')}>Micro Zoom</button>
          <button className={`cam-btn ${cameraView === 'cinematic' ? 'active' : ''}`} onClick={() => setCameraView('cinematic')}>Cinematic</button>
        </div>

        {/* Dynamic Telemetry HUD Readout Overlay */}
        <div className="reaction-readout-overlay">
          {currentStep.readoutData?.map((rd, i) => (
            <div key={i} className="readout-item">
              <span>{rd.label}</span>
              <strong style={{ color: rd.color || '#06b6d4' }}>{rd.value}</strong>
            </div>
          )) || (
            <div className="readout-item">
              <span>Status</span>
              <strong style={{ color: '#10b981' }}>Active Simulation</strong>
            </div>
          )}
          <div className="readout-item">
            <span>Step</span>
            <strong>{currentStepIndex + 1} / {steps.length}</strong>
          </div>
        </div>
      </div>

      {/* Playback Control Toolbar */}
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

      {/* Narration Box */}
      <div className="active-narration-card">
        <div className="narration-header">
          <span className="step-title-badge">{currentStep.title}</span>
          <span className="narration-tag"><Volume2 size={13} /> Narrator Script</span>
        </div>
        <p className="narration-text">"{currentStep.narrationText}"</p>
        <p className="step-description">{currentStep.description}</p>
      </div>

      {/* Scientific Insights & Observations */}
      {scenarioData?.observations && (
        <div className="observations-box">
          <h4>Key Observations & Telemetry</h4>
          <ul>
            {scenarioData.observations.map((obs, idx) => (
              <li key={idx}>
                <Activity size={14} className="check-icon" />
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Takeaway Conclusion Banner */}
      {scenarioData?.takeawayConclusion && (
        <div className="balanced-equation-box">
          <h4>Core Scientific Takeaway</h4>
          <div className="equation-text">{scenarioData.takeawayConclusion}</div>
        </div>
      )}

      {/* Custom AI Simulation Generator Modal */}
      {showCustomModal && (
        <div className="modal-overlay">
          <div className="custom-modal-card">
            <div className="modal-header">
              <div className="modal-title">
                <Sparkles size={20} className="accent-icon" />
                <h3>Universal AI Scenario Simulation Generator</h3>
              </div>
              <button className="close-btn" onClick={() => setShowCustomModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCustomFormSubmit} className="custom-exp-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Scenario Title / Topic:</label>
                  <input
                    type="text"
                    value={customForm.scenarioTitle}
                    onChange={(e) => setCustomForm({ ...customForm, scenarioTitle: e.target.value })}
                    placeholder="e.g. Earthquake Structural Wave Dynamics"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Domain / Category:</label>
                  <input
                    type="text"
                    value={customForm.category}
                    onChange={(e) => setCustomForm({ ...customForm, category: e.target.value })}
                    placeholder="e.g. Civil Engineering / Seismology"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Environment Style:</label>
                <select
                  value={customForm.environment}
                  onChange={(e) => setCustomForm({ ...customForm, environment: e.target.value as any })}
                  style={{ background: '#000', color: '#fff', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-glass)' }}
                >
                  <option value="studio">Studio Grid</option>
                  <option value="space">Deep Space</option>
                  <option value="laboratory">High-Tech Laboratory</option>
                  <option value="nature">Nature & Environment</option>
                  <option value="cyber">Cyber Matrix</option>
                  <option value="microscopic">Microscopic Quantum</option>
                  <option value="blueprint">Engineering Blueprint</option>
                </select>
              </div>

              <div className="form-group">
                <label>Scenario Description & Explanation:</label>
                <textarea
                  rows={3}
                  value={customForm.description}
                  onChange={(e) => setCustomForm({ ...customForm, description: e.target.value })}
                  placeholder="Describe what happens in the scenario step by step..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Voice Narration Script:</label>
                <textarea
                  rows={2}
                  value={customForm.voiceScript}
                  onChange={(e) => setCustomForm({ ...customForm, voiceScript: e.target.value })}
                  placeholder="Spoken narration for the AI voice narrator..."
                />
              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowCustomModal(false)}>Cancel</button>
                <button type="submit" className="submit-exp-btn">
                  <Sparkles size={16} /> Generate Animated Scenario Simulation
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
            <img src={snapshotImage} alt="AI Scenario Snapshot" className="snapshot-preview-img" />
            <div className="modal-footer">
              <a href={snapshotImage} download="ai_scenario_simulation.png" className="download-btn">
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

// ── Environment & Entity Canvas Drawing Engine ──────────────────────────

function drawEnvironmentBackground(ctx: CanvasRenderingContext2D, w: number, h: number, env: string, t: number) {
  if (env === 'space') {
    // Deep Space with rich Starfield & Nebula
    ctx.fillStyle = '#020208';
    ctx.fillRect(0, 0, w, h);

    // Nebula glow
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const nebGrad = ctx.createRadialGradient(w * 0.3, h * 0.4, 50, w * 0.3, h * 0.4, 300);
    nebGrad.addColorStop(0, 'rgba(124, 58, 237, 0.15)'); // violet
    nebGrad.addColorStop(0.5, 'rgba(236, 72, 153, 0.08)'); // pink
    nebGrad.addColorStop(1, 'rgba(6, 182, 212, 0)'); // cyan
    ctx.fillStyle = nebGrad;
    ctx.fillRect(0, 0, w, h);

    const nebGrad2 = ctx.createRadialGradient(w * 0.7, h * 0.6, 80, w * 0.7, h * 0.6, 250);
    nebGrad2.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
    nebGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebGrad2;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    // Stars
    ctx.fillStyle = '#ffffff';
    for (let s = 0; s < 70; s++) {
      const sx = (s * 41 + 17) % w;
      const sy = (s * 61 + 31) % h;
      const size = (s % 3 === 0) ? 2.0 : 1.0;
      ctx.globalAlpha = 0.2 + Math.sin(t * 1.5 + s) * 0.3;
      ctx.fillRect(sx, sy, size, size);
    }
    ctx.globalAlpha = 1.0;
  } else if (env === 'nature') {
    // Atmospheric Sunrise Gradient with soft rolling hills
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0, '#0f172a'); // dark slate
    skyGrad.addColorStop(0.4, '#1e1b4b'); // indigo
    skyGrad.addColorStop(0.7, '#311042'); // purple sunset
    skyGrad.addColorStop(1, '#581c87'); // bright violet horizon
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Sun source glow
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const sunGrad = ctx.createRadialGradient(w * 0.2, h * 0.8, 10, w * 0.2, h * 0.8, 150);
    sunGrad.addColorStop(0, 'rgba(253, 186, 116, 0.4)');
    sunGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    // Rolling hills in background
    ctx.fillStyle = 'rgba(6, 78, 59, 0.35)'; // dark green alpha
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 20) {
      ctx.lineTo(x, h - 80 + Math.sin(x * 0.005 + t * 0.1) * 20);
    }
    ctx.lineTo(w, h);
    ctx.fill();

    ctx.fillStyle = 'rgba(2, 44, 34, 0.6)';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 20) {
      ctx.lineTo(x, h - 40 + Math.cos(x * 0.008 - t * 0.15) * 15);
    }
    ctx.lineTo(w, h);
    ctx.fill();
  } else if (env === 'microscopic') {
    // Quantum Fluid Matrix with floating molecules
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, w * 0.6);
    bgGrad.addColorStop(0, '#090514');
    bgGrad.addColorStop(0.5, '#02010a');
    bgGrad.addColorStop(1, '#000000');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Floating blurred structures
    ctx.fillStyle = 'rgba(168, 85, 247, 0.03)';
    for (let i = 0; i < 4; i++) {
      const bx = (i * 200 + t * 10) % (w + 100) - 50;
      const by = (i * 150 + Math.sin(t * 0.5 + i) * 30) % h;
      ctx.beginPath();
      ctx.arc(bx, by, 60 + i * 15, 0, Math.PI * 2);
      ctx.fill();
    }

    // Atomic grid structure
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < w; x += 40) {
      for (let y = 0; y < h; y += 40) {
        if ((x + y) % 80 === 0) {
          ctx.arc(x, y, 2, 0, Math.PI * 2);
        }
      }
    }
    ctx.stroke();
  } else if (env === 'blueprint') {
    // Detailed Engineering Blueprint Grid
    ctx.fillStyle = '#0f223a';
    ctx.fillRect(0, 0, w, h);

    // Fine lines
    ctx.strokeStyle = '#1e3a5f';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let x = 0; x < w; x += 20) {
      ctx.moveTo(x, 0); ctx.lineTo(x, h);
    }
    for (let y = 0; y < h; y += 20) {
      ctx.moveTo(0, y); ctx.lineTo(w, y);
    }
    ctx.stroke();

    // Major axes
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h);
    ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2);
    ctx.stroke();

    // Grid coordinates ticks
    ctx.fillStyle = '#60a5fa';
    ctx.font = '8px Courier New';
    ctx.globalAlpha = 0.5;
    ctx.fillText('Y=0', w / 2 + 5, h / 2 - 5);
    ctx.fillText('X=0', w / 2 - 25, h / 2 + 12);
    ctx.globalAlpha = 1.0;
  } else if (env === 'cyber') {
    // Cyber Matrix Perspective Grid
    ctx.fillStyle = '#020205';
    ctx.fillRect(0, 0, w, h);

    const horizon = h * 0.4;
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)'; // matrix green
    ctx.lineWidth = 1;

    // Perspective lines radiating from center horizon
    ctx.beginPath();
    for (let x = -w * 0.5; x <= w * 1.5; x += 60) {
      ctx.moveTo(w / 2, horizon);
      ctx.lineTo(x, h);
    }
    ctx.stroke();

    // Horizontal bars narrowing towards horizon
    ctx.beginPath();
    for (let y = horizon + 5; y < h; y += (y - horizon) * 0.15 + 2) {
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    ctx.stroke();

    // Falling digital matrix columns
    ctx.fillStyle = '#10b981';
    ctx.font = '8px Courier New';
    for (let col = 0; col < 15; col++) {
      const cx = (col * 53) % w;
      const cy = (col * 37 + t * 80) % h;
      ctx.globalAlpha = 0.05 + ((col % 4) * 0.08);
      ctx.fillText(Math.random() > 0.5 ? '1' : '0', cx, cy);
      ctx.fillText(Math.random() > 0.5 ? '0' : '1', cx, cy - 15);
    }
    ctx.globalAlpha = 1.0;
  } else {
    // Laboratory / Studio: Dark high-tech workbench grid
    ctx.fillStyle = '#070a13';
    ctx.fillRect(0, 0, w, h);

    // Workbench perspective surface shadow
    const floorY = h * 0.7;
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, h);
    floorGrad.addColorStop(0, '#0d1326');
    floorGrad.addColorStop(1, '#04060c');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, w, h - floorY);

    // Grid lines on the floor
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.06)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    for (let x = -w * 0.5; x <= w * 1.5; x += 50) {
      ctx.moveTo(w / 2, floorY - 30);
      ctx.lineTo(x, h);
    }
    ctx.stroke();

    // Background horizontal divider
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(w, floorY);
    ctx.stroke();
  }
}

function drawEntitiesAndParticles(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  entities: SimulationEntity[],
  step: SimulationStep
) {
  const centerX = w / 2;
  const centerY = h / 2;

  // Render Particle Effects
  const effect = step.particleEffect;

  if (effect === 'fire_smoke') {
    // Dynamic Booster Flame & Smoke
    for (let f = 0; f < 35; f++) {
      const fx = centerX + Math.sin(f + t * 8) * (15 + (f % 5));
      const fy = centerY + 65 - ((f * 10 + t * 85) % 180);
      const alpha = 1.0 - ((centerY + 65 - fy) / 180);
      ctx.fillStyle = f % 3 === 0 ? '#f97316' : f % 3 === 1 ? '#ef4444' : '#eab308';
      ctx.globalAlpha = Math.max(0, alpha * 0.85);
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(fx, fy, 4 + (f % 8), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;
  } else if (effect === 'light_beam') {
    // Laser Light Beam with Core glow
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(w, centerY); ctx.stroke();

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.moveTo(0, centerY); ctx.lineTo(w, centerY); ctx.stroke();
    ctx.restore();
    ctx.shadowBlur = 0;
  } else if (effect === 'energy_waves') {
    // Technical Expanding Ripples
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 2;
    for (let r = 1; r <= 3; r++) {
      const rad = ((t * 70 + r * 60) % 200);
      const alpha = 1.0 - (rad / 200);
      ctx.globalAlpha = Math.max(0, alpha);
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, rad, rad * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;
  } else if (effect === 'water_bubbles') {
    // Translucent Rising Bubbles
    for (let b = 0; b < 20; b++) {
      const bx = centerX - 120 + ((b * 53) % 240) + Math.sin(t * 1.5 + b) * 10;
      const by = centerY + 80 - ((b * 12 + t * 45) % 180);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(bx, by, 3 + (b % 4), 0, Math.PI * 2);
      ctx.stroke();

      // Bubble highlight dot
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(bx - 1.5, by - 1.5, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (effect === 'glow_aura') {
    // Pulsing aura background
    const pulseRad = 130 + Math.sin(t * 4) * 20;
    const auraGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, pulseRad);
    auraGrad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
    auraGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.08)');
    auraGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = auraGrad;
    ctx.fillRect(0, 0, w, h);
  } else if (effect === 'sparks') {
    // Spark fountain
    for (let s = 0; s < 25; s++) {
      const angle = (s * 17) % 360;
      const radAngle = (angle * Math.PI) / 180;
      const dist = (t * 110 + s * 13) % 120;
      const sx = centerX + Math.cos(radAngle) * dist;
      const sy = centerY + Math.sin(radAngle) * dist + (dist * dist * 0.003); // gravity drop
      ctx.fillStyle = s % 2 === 0 ? '#facc15' : '#fb923c';
      ctx.fillRect(sx, sy, 3, 3);
    }
  }

  // Draw 3D/2D Entity Objects
  entities.forEach((ent, idx) => {
    let objX = centerX + ent.position.x;
    let objY = centerY + ent.position.y;
    const size = ent.size * 30;

    // Apply Dynamic Animations based on animationAction
    if (step.activeEntityId === ent.id) {
      if (step.animationAction === 'move') {
        if (ent.shape === 'rocket') {
          objY -= (t * 22) % 150;
        } else {
          objX += Math.sin(t * 3.5) * 35;
        }
      } else if (step.animationAction === 'collide') {
        objX += Math.abs(Math.sin(t * 4.5)) * 25 * (idx % 2 === 0 ? 1 : -1);
      } else if (step.animationAction === 'transform') {
        objY += Math.sin(t * 8) * 5;
      } else if (step.animationAction === 'explode') {
        objX += (Math.random() - 0.5) * 6;
        objY += (Math.random() - 0.5) * 6;
      }
    }

    ctx.save();
    ctx.translate(objX, objY);

    if (step.activeEntityId === ent.id && step.animationAction === 'rotate') {
      ctx.rotate(t * 1.8);
    }

    if (ent.glowing) {
      ctx.shadowColor = ent.color;
      ctx.shadowBlur = 22;
    }

    // ── High-Definition Vector rendering of shape types ──
    if (ent.shape === 'rocket') {
      // 🚀 Saturn V Style space booster rocket
      ctx.lineWidth = 1.5;
      // Cylinder body segments
      const bodyGrad = ctx.createLinearGradient(-size * 0.25, 0, size * 0.25, 0);
      bodyGrad.addColorStop(0, '#f8fafc');
      bodyGrad.addColorStop(0.5, '#e2e8f0');
      bodyGrad.addColorStop(1, '#94a3b8');
      ctx.fillStyle = bodyGrad;
      ctx.strokeStyle = '#334155';
      ctx.fillRect(-size * 0.25, -size * 0.8, size * 0.5, size * 1.5);
      ctx.strokeRect(-size * 0.25, -size * 0.8, size * 0.5, size * 1.5);

      // Decal lines / USA flag stripes
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-size * 0.25, -size * 0.2, size * 0.5, size * 0.08);
      ctx.fillRect(-size * 0.25, size * 0.3, size * 0.5, size * 0.08);
      ctx.fillStyle = '#ef4444'; // Red stripe
      ctx.fillRect(-size * 0.1, -size * 0.5, size * 0.2, size * 0.04);

      // Nose Cone
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(-size * 0.25, -size * 0.8);
      ctx.quadraticCurveTo(0, -size * 1.1, 0, -size * 1.4);
      ctx.quadraticCurveTo(0, -size * 1.1, size * 0.25, -size * 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Lower nozzles
      ctx.fillStyle = '#334155';
      ctx.fillRect(-size * 0.15, size * 0.7, size * 0.08, size * 0.12);
      ctx.fillRect(size * 0.07, size * 0.7, size * 0.08, size * 0.12);

      // Aerodynamic fins
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(-size * 0.25, size * 0.4);
      ctx.lineTo(-size * 0.55, size * 0.75);
      ctx.lineTo(-size * 0.25, size * 0.75);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(size * 0.25, size * 0.4);
      ctx.lineTo(size * 0.55, size * 0.75);
      ctx.lineTo(size * 0.25, size * 0.75);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Flame exhaust (if moving/launching)
      if (step.animationAction === 'move' || step.stepNumber >= 2) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const flameGrad = ctx.createLinearGradient(0, size * 0.75, 0, size * 1.4);
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.3, '#facc15'); // yellow
        flameGrad.addColorStop(0.7, '#f97316'); // orange
        flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(-size * 0.15, size * 0.75);
        ctx.quadraticCurveTo(0, size * 1.6 + Math.sin(t * 15) * 5, size * 0.15, size * 0.75);
        ctx.lineTo(0, size * 0.75);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    } else if (ent.shape === 'planet' || (ent.shape === 'sphere' && ent.id === 'earth')) {
      // 🪐 Planet with Cloud Bands and Atmospheric glow
      const sphereGrad = ctx.createRadialGradient(-size * 0.25, -size * 0.25, size * 0.1, 0, 0, size);
      sphereGrad.addColorStop(0, '#60a5fa'); // light reflection
      sphereGrad.addColorStop(0.4, ent.color);
      sphereGrad.addColorStop(1, '#050c18'); // dark shading
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();

      // Planet cloud rings / horizontal bands
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, -size * 0.3, size * 0.9, 0.15, Math.PI - 0.15);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, size * 0.2, size * 0.95, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Atmospheric outer glow
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const atmGrad = ctx.createRadialGradient(0, 0, size * 0.9, 0, 0, size * 1.15);
      atmGrad.addColorStop(0, 'rgba(6, 182, 212, 0.3)');
      atmGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = atmGrad;
      ctx.beginPath(); ctx.arc(0, 0, size * 1.15, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Saturn Rings (drawn in half to handle front overlap)
      const hasRings = ent.name.toLowerCase().includes('saturn') || ent.name.toLowerCase().includes('orbit') || ent.id === 'moon';
      if (hasRings) {
        ctx.save();
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.35)'; // gold rings
        ctx.lineWidth = 8;
        ctx.beginPath();
        // Back half of rings (drawn with clipping or behind, here simple ellipse is drawn)
        ctx.ellipse(0, 0, size * 1.8, size * 0.45, -Math.PI / 10, Math.PI, 0);
        ctx.stroke();
        
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 1.6, size * 0.4, -Math.PI / 10, 0, Math.PI);
        ctx.stroke();
        ctx.restore();
      }
    } else if (ent.shape === 'atom') {
      // ⚛️ Detailed Atom Nucleus & Orbit Trails
      // Nucleus cluster
      const numProtons = 6;
      for (let p = 0; p < numProtons; p++) {
        const px = Math.sin(p * 2) * 5;
        const py = Math.cos(p * 2.3) * 5;
        const color = p % 2 === 0 ? '#ef4444' : '#3b82f6'; // red/blue protons/neutrons
        const nucGrad = ctx.createRadialGradient(px - 1.5, py - 1.5, 1, px, py, 6);
        nucGrad.addColorStop(0, '#ffffff');
        nucGrad.addColorStop(0.3, color);
        nucGrad.addColorStop(1, '#000000');
        ctx.fillStyle = nucGrad;
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Orbital shells
      const numShells = 3;
      for (let s = 0; s < numShells; s++) {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
        ctx.lineWidth = 1;
        const angleOffset = (Math.PI / numShells) * s + t * 0.4;
        ctx.save();
        ctx.rotate(angleOffset);
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 1.3, size * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Orbiting electron dot
        const theta = t * 2.8 + s;
        const ex = Math.cos(theta) * size * 1.3;
        const ey = Math.sin(theta) * size * 0.45;

        // Glow trail
        ctx.fillStyle = ent.color;
        ctx.shadowColor = ent.color;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(ex, ey, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.shadowBlur = 0;
    } else if (ent.shape === 'piston' || ent.shape === 'cylinder') {
      // ⚙️ Kinematic Reciprocating Piston Assembly
      const crankRad = size * 0.4;
      const rodLen = size * 1.1;

      // Crank angle rotation
      const crankAngle = t * 2.5;
      const crankPinX = Math.cos(crankAngle) * crankRad;
      const crankPinY = Math.sin(crankAngle) * crankRad;

      // Piston wrist-pin calculation: vertical sliding along X=0
      // x_pin = 0, y_pin = crankPinY - sqrt(rodLen^2 - crankPinX^2)
      const wristPinY = crankPinY - Math.sqrt(rodLen * rodLen - crankPinX * crankPinX);

      // 1. Draw Outer Cylinder Block
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-size * 0.65, -size * 1.2);
      ctx.lineTo(-size * 0.65, size * 0.3);
      ctx.moveTo(size * 0.65, -size * 1.2);
      ctx.lineTo(size * 0.65, size * 0.3);
      ctx.stroke();

      // 2. Draw spark plug core at top
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-6, -size * 1.2, 12, 10);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-2, -size * 1.2 + 10, 4, 4); // probe

      // Valves
      const intakeOpen = Math.sin(t * 1.25) > 0.4;
      const exhaustOpen = Math.sin(t * 1.25) < -0.4;
      ctx.fillStyle = '#64748b';
      // Left intake valve
      ctx.fillRect(-size * 0.45, -size * 1.2 + (intakeOpen ? 6 : 0), 8, 4);
      // Right exhaust valve
      ctx.fillRect(size * 0.35, -size * 1.2 + (exhaustOpen ? 6 : 0), 8, 4);

      // 3. Draw Connecting Rod
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(crankPinX, crankPinY);
      ctx.lineTo(0, wristPinY);
      ctx.stroke();

      // Wrist pin axis dot
      ctx.fillStyle = '#334155';
      ctx.beginPath(); ctx.arc(0, wristPinY, 4, 0, Math.PI * 2); ctx.fill();

      // 4. Draw Rotating Crankshaft Disk
      ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, crankRad, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

      // Crank balance weights
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(0, 0, crankRad, crankAngle + Math.PI * 0.8, crankAngle + Math.PI * 1.2);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fill();

      // Crank pin joint
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(crankPinX, crankPinY, 4, 0, Math.PI * 2); ctx.fill();

      // 5. Draw Piston Head sliding inside
      const pistonH = size * 0.42;
      const pistonY = wristPinY - pistonH;
      const pistonGrad = ctx.createLinearGradient(-size * 0.62, 0, size * 0.62, 0);
      pistonGrad.addColorStop(0, '#94a3b8');
      pistonGrad.addColorStop(0.5, '#f1f5f9');
      pistonGrad.addColorStop(1, '#475569');
      ctx.fillStyle = pistonGrad;
      ctx.fillRect(-size * 0.62, pistonY, size * 1.24, pistonH);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-size * 0.62, pistonY, size * 1.24, pistonH);

      // Piston grooves
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-size * 0.62, pistonY + 5, 3, 2);
      ctx.fillRect(-size * 0.62, pistonY + 11, 3, 2);
      ctx.fillRect(size * 0.62 - 3, pistonY + 5, 3, 2);
      ctx.fillRect(size * 0.62 - 3, pistonY + 11, 3, 2);

      // 6. Combustion Spark & Fire (on Power Stroke)
      const isCombustion = step.stepNumber === 3 || step.title.toLowerCase().includes('power') || step.title.toLowerCase().includes('combustion');
      if (isCombustion) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        // Spark plug plasma flash
        ctx.strokeStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 15;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(0, -size * 1.2 + 14);
        ctx.lineTo((Math.random() - 0.5) * 8, -size * 1.2 + 25);
        ctx.stroke();

        // Expansive combustion fire filling upper cylinder chamber
        const fireHeight = Math.max(10, wristPinY - pistonH - (-size * 1.2 + 14));
        const fireGrad = ctx.createLinearGradient(0, -size * 1.2 + 14, 0, wristPinY - pistonH);
        fireGrad.addColorStop(0, '#ffffff');
        fireGrad.addColorStop(0.3, '#facc15');
        fireGrad.addColorStop(0.8, 'rgba(239, 68, 68, 0.7)');
        fireGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        ctx.fillStyle = fireGrad;
        ctx.fillRect(-size * 0.62 + 2, -size * 1.2 + 14, size * 1.24 - 4, fireHeight);
        ctx.restore();
        ctx.shadowBlur = 0;
      }
    } else if (ent.shape === 'dna') {
      // 🧬 Rotating Double helix DNA model
      const helixWidth = size * 0.65;
      const numBars = 12;
      ctx.lineWidth = 2;

      for (let i = 0; i < numBars; i++) {
        // Vertical spacing
        const yCoord = -size * 1.0 + (i * (size * 2.0 / numBars));
        // Rotate helix strands over time t
        const theta = yCoord * 0.045 - t * 1.5;
        const xOffset1 = Math.sin(theta) * helixWidth;
        const xOffset2 = Math.sin(theta + Math.PI) * helixWidth;

        // Complementary Base Pairs connector bars
        ctx.strokeStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(xOffset1, yCoord);
        ctx.lineTo(0, yCoord);
        // Half green (A), half red (T)
        ctx.strokeStyle = i % 2 === 0 ? '#10b981' : '#f43f5e';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, yCoord);
        ctx.lineTo(xOffset2, yCoord);
        // Half blue (C), half yellow (G)
        ctx.strokeStyle = i % 2 === 0 ? '#60a5fa' : '#eab308';
        ctx.stroke();

        // Small nitrogenous base ball joints
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(xOffset1, yCoord, 3.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(xOffset2, yCoord, 3.5, 0, Math.PI * 2); ctx.fill();
      }

      // Draw two spiral ribbon backbones
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#38bdf8'; // Blue ribbon
      ctx.beginPath();
      for (let i = 0; i <= numBars * 2; i++) {
        const yCoord = -size * 1.0 + (i * (size * 2.0 / (numBars * 2)));
        const theta = yCoord * 0.045 - t * 1.5;
        const xCoord = Math.sin(theta) * helixWidth;
        if (i === 0) ctx.moveTo(xCoord, yCoord);
        else ctx.lineTo(xCoord, yCoord);
      }
      ctx.stroke();

      ctx.strokeStyle = '#ec4899'; // Magenta ribbon
      ctx.beginPath();
      for (let i = 0; i <= numBars * 2; i++) {
        const yCoord = -size * 1.0 + (i * (size * 2.0 / (numBars * 2)));
        const theta = yCoord * 0.045 - t * 1.5 + Math.PI;
        const xCoord = Math.sin(theta) * helixWidth;
        if (i === 0) ctx.moveTo(xCoord, yCoord);
        else ctx.lineTo(xCoord, yCoord);
      }
      ctx.stroke();
    } else if (ent.shape === 'leaf_cell' || ent.shape === 'chloroplast') {
      // 🌿 Plant Chloroplast & Cellular Photosynthesis
      // Green Hexagonal Cell Wall
      ctx.strokeStyle = '#059669';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = Math.cos(angle) * size * 1.25;
        const py = Math.sin(angle) * size * 1.25;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      // Chloroplast green thylakoid discs
      ctx.fillStyle = '#10b981';
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 1.5;
      // Draw 3 stacks of discs
      const stacks = [
        { sx: -size * 0.4, sy: -size * 0.2, count: 3 },
        { sx: size * 0.3, sy: size * 0.2, count: 4 },
        { sx: -size * 0.1, sy: size * 0.35, count: 2 }
      ];

      stacks.forEach(st => {
        for (let d = 0; d < st.count; d++) {
          const dy = st.sy - (d * 5);
          ctx.beginPath();
          ctx.ellipse(st.sx, dy, 18, 5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      });

      // Sunlight rays hitting chloroplasts
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.strokeStyle = 'rgba(253, 224, 71, 0.45)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-size * 1.2, -size * 1.2);
      ctx.lineTo(-size * 0.1, -size * 0.1);
      ctx.stroke();

      // Pulsing energy starburst
      const energyRad = 15 + Math.sin(t * 8) * 4;
      const energyGrad = ctx.createRadialGradient(-size * 0.1, -size * 0.1, 2, -size * 0.1, -size * 0.1, energyRad);
      energyGrad.addColorStop(0, '#ffffff');
      energyGrad.addColorStop(0.5, '#fef08a');
      energyGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = energyGrad;
      ctx.beginPath(); ctx.arc(-size * 0.1, -size * 0.1, energyRad, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    } else if (ent.shape === 'volcano') {
      // 🌋 Detailed Volcano Eruption
      ctx.lineWidth = 1.5;
      // Mountain silhouette (layers)
      ctx.fillStyle = '#5c4033'; // base brown
      ctx.beginPath();
      ctx.moveTo(-size * 1.5, size * 0.9);
      ctx.lineTo(-size * 0.35, -size * 0.55);
      ctx.lineTo(size * 0.35, -size * 0.55);
      ctx.lineTo(size * 1.5, size * 0.9);
      ctx.closePath();
      ctx.fill();

      // Conduit magma path
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-size * 0.14, -size * 0.5, size * 0.28, size * 1.4);

      // Active pulsing magma core
      const magGrad = ctx.createLinearGradient(0, -size * 0.5, 0, size * 0.9);
      magGrad.addColorStop(0, '#ffffff');
      magGrad.addColorStop(0.3, '#f97316');
      magGrad.addColorStop(1, '#dc2626');
      ctx.fillStyle = magGrad;
      ctx.globalAlpha = 0.8 + Math.sin(t * 12) * 0.15;
      ctx.fillRect(-size * 0.08, -size * 0.5, size * 0.16, size * 1.4);
      ctx.globalAlpha = 1.0;

      // Erupting pyroclastic lava fountain (if active step)
      if (step.stepNumber >= 3) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let p = 0; p < 25; p++) {
          const theta = -Math.PI * 0.5 + (Math.sin(p * 7.5) * 0.4) + (Math.sin(t * 5 + p) * 0.1);
          const launchDist = (t * 90 + p * 8) % 110;
          const px = Math.cos(theta) * launchDist;
          const py = -size * 0.55 + Math.sin(theta) * launchDist + (launchDist * launchDist * 0.003); // gravity drop
          ctx.fillStyle = p % 2 === 0 ? '#facc15' : '#ef4444';
          ctx.shadowColor = '#f97316';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(px, py, 3 + (p % 3), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        ctx.shadowBlur = 0;
      }
    } else if (ent.shape === 'prism') {
      // 🌈 Refracting Glass Prism & Chromatic Dispersion
      ctx.lineWidth = 2.0;

      // Draw Glass Prism Triangle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.moveTo(0, -size * 1.0);
      ctx.lineTo(-size * 1.0, size * 0.7);
      ctx.lineTo(size * 1.0, size * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Specular glass highlight reflection
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-size * 0.8, size * 0.6);
      ctx.lineTo(0, -size * 0.8);
      ctx.stroke();

      // Dispersion Rays (rainbow fan) starting from right face
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const colors = ['#ef4444', '#f97316', '#facc15', '#10b981', '#3b82f6', '#8b5cf6'];
      colors.forEach((col, idx) => {
        const spreadAngle = (idx * 0.06) + (Math.sin(t * 0.5) * 0.01);
        const rayLen = size * 1.8;
        const rx = Math.cos(spreadAngle) * rayLen;
        const ry = size * 0.1 + Math.sin(spreadAngle) * rayLen;

        ctx.strokeStyle = col;
        ctx.lineWidth = 2.5;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.moveTo(size * 0.25, size * 0.1);
        ctx.lineTo(rx, ry);
        ctx.stroke();
      });
      ctx.restore();
      ctx.globalAlpha = 1.0;
    } else if (ent.shape === 'gear') {
      // ⚙️ Mechanical Tooth Gear
      const numTeeth = 10;
      const innerRad = size * 0.6;
      const outerRad = size * 0.95;

      ctx.fillStyle = ent.color;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      for (let i = 0; i < numTeeth; i++) {
        const angle = (Math.PI * 2 / numTeeth) * i;
        const nextAngle = (Math.PI * 2 / numTeeth) * (i + 1);

        // Trapezoidal tooth profile
        ctx.lineTo(Math.cos(angle - 0.1) * innerRad, Math.sin(angle - 0.1) * innerRad);
        ctx.lineTo(Math.cos(angle - 0.04) * outerRad, Math.sin(angle - 0.04) * outerRad);
        ctx.lineTo(Math.cos(angle + 0.04) * outerRad, Math.sin(angle + 0.04) * outerRad);
        ctx.lineTo(Math.cos(angle + 0.1) * innerRad, Math.sin(angle + 0.1) * innerRad);
        ctx.lineTo(Math.cos(nextAngle - 0.1) * innerRad, Math.sin(nextAngle - 0.1) * innerRad);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Gear inner axle cutouts (technical spokes)
      ctx.fillStyle = '#070a13'; // cut out match background floor
      ctx.beginPath(); ctx.arc(0, 0, size * 0.35, 0, Math.PI * 2); ctx.fill();

      // Spokes cross
      ctx.fillStyle = ent.color;
      ctx.fillRect(-size * 0.08, -size * 0.5, size * 0.16, size * 1.0);
      ctx.fillRect(-size * 0.5, -size * 0.08, size * 1.0, size * 0.08);

      // Central axle pin
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
    } else if (ent.shape === 'circuit') {
      // ⚡ Electrical Circuit Schematic
      ctx.strokeStyle = ent.color;
      ctx.lineWidth = 2.5;

      // Draw wire loop
      ctx.strokeRect(-size * 1.1, -size * 0.6, size * 2.2, size * 1.2);

      // Battery symbol (top center)
      ctx.fillStyle = '#070a13';
      ctx.fillRect(-15, -size * 0.6 - 10, 30, 20); // cover wires
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      // Long line (+)
      ctx.beginPath(); ctx.moveTo(-6, -size * 0.6 - 10); ctx.lineTo(-6, -size * 0.6 + 10); ctx.stroke();
      // Short line (-)
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(6, -size * 0.6 - 6); ctx.lineTo(6, -size * 0.6 + 6); ctx.stroke();

      // Resistor zig-zag symbol (bottom center)
      ctx.fillStyle = '#070a13';
      ctx.fillRect(-30, size * 0.6 - 10, 60, 20); // cover wires
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-25, size * 0.6);
      ctx.lineTo(-20, size * 0.6 - 6);
      ctx.lineTo(-10, size * 0.6 + 6);
      ctx.lineTo(0, size * 0.6 - 6);
      ctx.lineTo(10, size * 0.6 + 6);
      ctx.lineTo(20, size * 0.6 - 6);
      ctx.lineTo(25, size * 0.6);
      ctx.stroke();

      // Running electron dots flow along wire path
      const cyclePos = (t * 80) % 360;
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 10;
      for (let e = 0; e < 6; e++) {
        const dotPos = (cyclePos + e * 60) % 360;
        let dx = 0, dy = 0;

        if (dotPos < 90) { // Top wire right-to-left
          dx = size * 1.1 - (dotPos / 90) * (size * 2.2);
          dy = -size * 0.6;
        } else if (dotPos < 180) { // Left wire down
          dx = -size * 1.1;
          dy = -size * 0.6 + ((dotPos - 90) / 90) * (size * 1.2);
        } else if (dotPos < 270) { // Bottom wire left-to-right
          dx = -size * 1.1 + ((dotPos - 180) / 90) * (size * 2.2);
          dy = size * 0.6;
        } else { // Right wire up
          dx = size * 1.1;
          dy = size * 0.6 - ((dotPos - 270) / 90) * (size * 1.2);
        }

        ctx.beginPath();
        ctx.arc(dx, dy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    } else if (ent.shape === 'wave') {
      // 🌊 Sine Wave Interference Field
      ctx.strokeStyle = ent.color;
      ctx.lineWidth = 3.0;

      // Draw primary wave
      ctx.beginPath();
      for (let wx = -size * 1.8; wx <= size * 1.8; wx += 3) {
        const wy = Math.sin(wx * 0.08 - t * 4.5) * size * 0.35;
        if (wx === -size * 1.8) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.stroke();

      // Draw secondary interfering wave
      ctx.strokeStyle = '#ec4899';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let wx = -size * 1.8; wx <= size * 1.8; wx += 3) {
        const wy = Math.sin(wx * 0.12 + t * 3.0) * size * 0.2;
        if (wx === -size * 1.8) ctx.moveTo(wx, wy);
        else ctx.lineTo(wx, wy);
      }
      ctx.stroke();

      // Draw interference nodes markers
      ctx.fillStyle = '#eab308';
      for (let mark = -2; mark <= 2; mark++) {
        const mx = mark * size * 0.7;
        ctx.beginPath();
        ctx.arc(mx, 0, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (ent.shape === 'cube') {
      // 🧊 3D Projected Isometric Rotating Cube
      const vertices = [
        { x: -1, y: -1, z: -1 },
        { x: 1, y: -1, z: -1 },
        { x: 1, y: 1, z: -1 },
        { x: -1, y: 1, z: -1 },
        { x: -1, y: -1, z: 1 },
        { x: 1, y: -1, z: 1 },
        { x: 1, y: 1, z: 1 },
        { x: -1, y: 1, z: 1 }
      ];

      // 3D rotation angles
      const ax = t * 0.8;
      const ay = t * 1.1;

      // Project vertices to 2D
      const projected = vertices.map(v => {
        // Rotate Y
        let x1 = v.x * Math.cos(ay) - v.z * Math.sin(ay);
        let z1 = v.x * Math.sin(ay) + v.z * Math.cos(ay);
        // Rotate X
        let y2 = v.y * Math.cos(ax) - z1 * Math.sin(ax);
        let z2 = v.y * Math.sin(ax) + z1 * Math.cos(ax);

        // Orthographic projection
        const scale = size * 0.65;
        return { x: x1 * scale, y: y2 * scale };
      });

      // Draw Cube Faces (flat shaded)
      const faces = [
        [0, 1, 2, 3, '#0284c7'], // front
        [1, 5, 6, 2, '#0369a1'], // right
        [3, 2, 6, 7, '#075985'], // bottom
        [4, 0, 3, 7, '#0c4a6e'], // left
        [4, 5, 1, 0, '#0284c7'], // top
        [7, 6, 5, 4, '#0369a1']  // back
      ];

      faces.forEach(f => {
        ctx.fillStyle = ent.color;
        ctx.globalAlpha = 0.75;
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(projected[f[0] as number].x, projected[f[0] as number].y);
        ctx.lineTo(projected[f[1] as number].x, projected[f[1] as number].y);
        ctx.lineTo(projected[f[2] as number].x, projected[f[2] as number].y);
        ctx.lineTo(projected[f[3] as number].x, projected[f[3] as number].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      });
      ctx.globalAlpha = 1.0;
    } else {
      // 🔮 Default Sphere: Glassy Shiny Ball with specular light highlights
      const radialGrad = ctx.createRadialGradient(-size * 0.3, -size * 0.3, size * 0.1, 0, 0, size);
      radialGrad.addColorStop(0, '#ffffff'); // gloss highlight
      radialGrad.addColorStop(0.35, ent.color);
      radialGrad.addColorStop(1, '#020612'); // shadow
      ctx.fillStyle = radialGrad;
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();

      // Shadow overlay on floor/beneath sphere
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      const shadowGrad = ctx.createRadialGradient(0, size * 0.95, 2, 0, size * 0.95, size * 0.8);
      shadowGrad.addColorStop(0, 'rgba(0,0,0,0.65)');
      shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.ellipse(0, size * 0.95, size * 0.8, size * 0.25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // ── Target reticle overlay & tracking leader lines on active entities ──
    const isActive = step.activeEntityId === ent.id;
    if (isActive) {
      ctx.save();
      // Target Corner Brackets [ ]
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
      ctx.lineWidth = 1.5;
      const bSz = size * 1.15;
      const bLen = 6;
      // Top-Left
      ctx.beginPath(); ctx.moveTo(-bSz + bLen, -bSz); ctx.lineTo(-bSz, -bSz); ctx.lineTo(-bSz, -bSz + bLen); ctx.stroke();
      // Top-Right
      ctx.beginPath(); ctx.moveTo(bSz - bLen, -bSz); ctx.lineTo(bSz, -bSz); ctx.lineTo(bSz, -bSz + bLen); ctx.stroke();
      // Bottom-Left
      ctx.beginPath(); ctx.moveTo(-bSz + bLen, bSz); ctx.lineTo(-bSz, bSz); ctx.lineTo(-bSz, bSz - bLen); ctx.stroke();
      // Bottom-Right
      ctx.beginPath(); ctx.moveTo(bSz - bLen, bSz); ctx.lineTo(bSz, bSz); ctx.lineTo(bSz, bSz - bLen); ctx.stroke();

      // Technical Leader Line
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.55)';
      ctx.lineWidth = 1.0;
      ctx.setLineDash([3, 2]);
      ctx.beginPath();
      ctx.moveTo(size * 0.7, -size * 0.7);
      ctx.lineTo(size * 0.7 + 35, -size * 0.7 - 25);
      ctx.lineTo(size * 0.7 + 95, -size * 0.7 - 25);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // Target information text bubble
      ctx.fillStyle = 'rgba(9, 13, 22, 0.8)';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 0.5;
      ctx.fillRect(size * 0.7 + 35, -size * 0.7 - 38, 70, 12);
      ctx.strokeRect(size * 0.7 + 35, -size * 0.7 - 38, 70, 12);

      ctx.fillStyle = '#06b6d4';
      ctx.font = 'bold 7px Courier New, monospace';
      ctx.textAlign = 'center';
      const actionLabel = step.animationAction ? step.animationAction.toUpperCase() : 'TRACKING';
      ctx.fillText(`TRK: ${actionLabel}`, size * 0.7 + 70, -size * 0.7 - 30);
      ctx.restore();
    }

    // Entity static label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = 'bold 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(ent.name, 0, size + 14);

    ctx.restore();
  });
}

function drawMicroscopicQuantumScene(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, step: SimulationStep) {
  // Advanced Quantum mesh background
  ctx.fillStyle = '#010206';
  ctx.fillRect(0, 0, w, h);

  // Hexagonal carbon lattice background
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.08)';
  ctx.lineWidth = 1.0;
  const hexRadius = 25;
  for (let x = 0; x < w + 50; x += hexRadius * 3) {
    for (let y = 0; y < h + 50; y += hexRadius * Math.sqrt(3)) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = x + Math.cos(angle) * hexRadius + (y % (hexRadius * 2) === 0 ? hexRadius * 1.5 : 0);
        const py = y + Math.sin(angle) * hexRadius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  // Floating colliding quantum particles
  const particlesCount = 14;
  for (let p = 0; p < particlesCount; p++) {
    // Math orbits
    const theta = t * 1.2 + (p * Math.PI / 7);
    const px = w / 2 + Math.cos(theta * 0.8) * (80 + p * 15) + Math.sin(t * 1.5 + p) * 10;
    const py = h / 2 + Math.sin(theta * 1.1) * (50 + p * 10);

    // Glowing core
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const color = p % 2 === 0 ? '#06b6d4' : '#d946ef';
    const grad = ctx.createRadialGradient(px - 3, py - 3, 2, px, py, 14);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.3, color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.fillStyle = grad;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(px, py, 14, 0, Math.PI * 2);
    ctx.fill();

    // Electron orbital rings around each quantum bubble
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.ellipse(px, py, 20, 6, t * 2 + p, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
  ctx.shadowBlur = 0;

  // Quantum strings energy connection lines
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let p = 0; p < particlesCount - 1; p++) {
    const theta1 = t * 1.2 + (p * Math.PI / 7);
    const px1 = w / 2 + Math.cos(theta1 * 0.8) * (80 + p * 15);
    const py1 = h / 2 + Math.sin(theta1 * 1.1) * (50 + p * 10);

    const theta2 = t * 1.2 + ((p + 1) * Math.PI / 7);
    const px2 = w / 2 + Math.cos(theta2 * 0.8) * (80 + (p + 1) * 15);
    const py2 = h / 2 + Math.sin(theta2 * 1.1) * (50 + (p + 1) * 10);

    ctx.moveTo(px1, py1);
    ctx.lineTo(px2, py2);
  }
  ctx.stroke();
}

function drawScreenSpaceHUD(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  stepIndex: number,
  steps: SimulationStep[],
  step: SimulationStep
) {
  // 1. Technical Screen HUD Border & Cockpit reticles
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
  ctx.lineWidth = 1;
  ctx.strokeRect(10, 10, w - 20, h - 20);

  // Technical corner brackets
  const brLen = 14;
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.65)';
  ctx.lineWidth = 2;
  // Top-Left
  ctx.beginPath(); ctx.moveTo(10 + brLen, 10); ctx.lineTo(10, 10); ctx.lineTo(10, 10 + brLen); ctx.stroke();
  // Top-Right
  ctx.beginPath(); ctx.moveTo(w - 10 - brLen, 10); ctx.lineTo(w - 10, 10); ctx.lineTo(w - 10, 10 + brLen); ctx.stroke();
  // Bottom-Left
  ctx.beginPath(); ctx.moveTo(10 + brLen, h - 10); ctx.lineTo(10, h - 10); ctx.lineTo(10, h - 10 - brLen); ctx.stroke();
  // Bottom-Right
  ctx.beginPath(); ctx.moveTo(w - 10 - brLen, h - 10); ctx.lineTo(w - 10, h - 10); ctx.lineTo(w - 10, h - 10 - brLen); ctx.stroke();

  // Decorative border crosshair ticks
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w / 2, 10); ctx.lineTo(w / 2, 16);
  ctx.moveTo(w / 2, h - 10); ctx.lineTo(w / 2, h - 16);
  ctx.moveTo(10, h / 2); ctx.lineTo(16, h / 2);
  ctx.moveTo(w - 10, h / 2); ctx.lineTo(w - 16, h / 2);
  ctx.stroke();

  // 2. Real-Time Oscilloscope Telemetry Panel (Bottom-Right)
  const pW = 190;
  const pH = 95;
  const pX = w - pW - 20;
  const pY = h - pH - 20;

  // Glassmorphic panel base
  ctx.fillStyle = 'rgba(7, 10, 19, 0.85)';
  ctx.fillRect(pX, pY, pW, pH);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(pX, pY, pW, pH);

  // Panel Header
  ctx.fillStyle = '#06b6d4';
  ctx.font = 'bold 8px "Courier New", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('📡 OSCILLOSCOPE FEED', pX + 8, pY + 12);

  // Micro grid lines
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
  ctx.lineWidth = 0.5;
  for (let gx = pX + 10; gx < pX + pW; gx += 20) {
    ctx.beginPath(); ctx.moveTo(gx, pY + 20); ctx.lineTo(gx, pY + pH - 10); ctx.stroke();
  }
  for (let gy = pY + 25; gy < pY + pH; gy += 15) {
    ctx.beginPath(); ctx.moveTo(pX + 5, gy); ctx.lineTo(pX + pW - 5, gy); ctx.stroke();
  }

  // Draw scrolling neon green sine wave
  ctx.strokeStyle = '#10b981';
  ctx.shadowColor = '#10b981';
  ctx.shadowBlur = 6;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  const graphW = pW - 16;
  const graphH = pH - 32;
  const startX = pX + 8;
  const startY = pY + 20 + graphH / 2;

  for (let x = 0; x < graphW; x++) {
    // Scrolling angle calculation based on index and time t
    const angle = (x * 0.14) - (t * 5.0);
    const noise = Math.sin(t * 18 + x) * 1.5;
    const val = Math.sin(angle) * (graphH * 0.38) + noise;
    const gx = startX + x;
    const gy = startY + val;
    if (x === 0) ctx.moveTo(gx, gy);
    else ctx.lineTo(gx, gy);
  }
  ctx.stroke();
  ctx.shadowBlur = 0; // reset

  // Panel Digital Data Info
  ctx.fillStyle = '#94a3b8';
  ctx.font = '7px "Courier New", monospace';
  const valText = step.readoutData?.[0]
    ? `${step.readoutData[0].label.toUpperCase()}: ${step.readoutData[0].value}`
    : 'SYSTEM STATUS: COGNITIVE';
  ctx.fillText(valText.length > 30 ? valText.slice(0, 28) + '..' : valText, pX + 8, pY + pH - 6);
  ctx.fillText(`SYS.CLK: ${Math.floor(59 + Math.sin(t) * 1.5)} FPS`, pX + pW - 75, pY + 12);
}
