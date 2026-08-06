import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WorkbenchState, OperatingMode, RepresentationPayload, SceneObject } from './types';
import { AIRouterService } from './services/aiRouter';
import { HUDHeader } from './components/HUDHeader';
import { SpeechController } from './components/SpeechController';
import { CameraHandTracker } from './components/CameraHandTracker';
import { SceneHierarchy } from './components/SceneHierarchy';
import { DomainPresets } from './components/DomainPresets';

// Representation Views
import { ThreeDWorkbench }       from './components/representations/ThreeDWorkbench';
import { PhysicsSimulator }      from './components/representations/PhysicsSimulator';
import { MathDerivationView }    from './components/representations/MathDerivationView';
import { AlgorithmVisualizer }   from './components/representations/AlgorithmVisualizer';

import { CodeWorkbenchView }     from './components/representations/CodeWorkbenchView';
import { InteractiveDiagramView }from './components/representations/InteractiveDiagramView';
import { UniversalScenarioSimulator } from './components/representations/UniversalScenarioSimulator';
import { UniversalSimulationGenerator } from './services/universalSimulationGenerator';

export const App: React.FC = () => {
  const [state, setState] = useState<WorkbenchState>({
    mode: 'voice_only',
    isListening: true,
    isCameraActive: false,
    activePayload: UniversalSimulationGenerator.getSpaceRocketPreset(),
    objectHierarchy: [],
    history: [UniversalSimulationGenerator.getSpaceRocketPreset()],
    historyIndex: 0,
    speechTranscript: '',
    interimTranscript: '',
    detectedGesture: 'Hands-free Ready',
    isDrawingMode: false,
    drawingBrushColor: '#06b6d4',
    drawingBrushSize: 4,
  });

  /**
   * Streaming pre-route timer.
   * When interim speech arrives, we start a short timer (~600ms). If more
   * interim speech keeps coming the timer resets. Once the timer fires we
   * pre-route the phrase to give the workbench a head-start building the
   * scene before the user finishes speaking.
   */
  const preRouteTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPreRouteRef   = useRef<string>('');
  const isPreRoutingRef   = useRef(false);

  // Initial welcome scene — runs once on mount
  useEffect(() => {
    const initialPayload = UniversalSimulationGenerator.getSpaceRocketPreset();
    setState((prev) => ({
      ...prev,
      activePayload: initialPayload,
      history: [initialPayload],
      historyIndex: 0,
    }));
  }, []); // empty deps: intentionally runs once

  // ── Final command handler ────────────────────────────────────────────────
  const handleProcessCommand = useCallback(
    async (input: string) => {
      if (!input.trim()) return;

      // Cancel any pending pre-route since the final command takes precedence
      if (preRouteTimerRef.current) {
        clearTimeout(preRouteTimerRef.current);
        preRouteTimerRef.current = null;
      }
      isPreRoutingRef.current = false;

      console.log('[App] Processing command:', input);
      const newPayload = await AIRouterService.processInput(
        input,
        state.activePayload,
        state.objectHierarchy,
      );

      setState((prev) => {
        let updatedObjects = [...prev.objectHierarchy];
        if (newPayload.threeDData?.objects) {
          newPayload.threeDData.objects.forEach((newObj) => {
            const idx = updatedObjects.findIndex((o) => o.id === newObj.id);
            if (idx >= 0) updatedObjects[idx] = newObj;
            else          updatedObjects.push(newObj);
          });
        }
        const newHistory      = [...prev.history.slice(0, prev.historyIndex + 1), newPayload];
        const newHistoryIndex = newHistory.length - 1;
        return {
          ...prev,
          activePayload:   newPayload,
          objectHierarchy: updatedObjects,
          history:         newHistory,
          historyIndex:    newHistoryIndex,
          speechTranscript:input,
          interimTranscript: '',
        };
      });
    },
    [state.activePayload, state.objectHierarchy],
  );

  // ── Interim speech → streaming pre-route ────────────────────────────────
  const handleInterimTranscript = useCallback(
    (interim: string) => {
      setState((prev) => ({ ...prev, interimTranscript: interim }));

      if (!interim.trim() || interim.length < 8) return;

      // Debounce: reset the pre-route timer every time new interim arrives
      if (preRouteTimerRef.current) clearTimeout(preRouteTimerRef.current);

      preRouteTimerRef.current = setTimeout(async () => {
        // Only pre-route if this phrase hasn't been pre-routed already and
        // the final command hasn't already been dispatched
        if (isPreRoutingRef.current || interim === lastPreRouteRef.current) return;
        isPreRoutingRef.current  = true;
        lastPreRouteRef.current  = interim;

        console.log('[App] Streaming pre-route on interim:', interim);
        try {
          const prePayload = await AIRouterService.processInput(
            interim,
            state.activePayload,
            state.objectHierarchy,
          );
          // Only apply if user is still speaking (interimTranscript still set)
          setState((prev) => {
            if (!prev.interimTranscript) return prev; // final arrived first — skip
            return { ...prev, activePayload: prePayload };
          });
        } catch (e) {
          console.warn('[App] Pre-route error:', e);
        } finally {
          isPreRoutingRef.current = false;
        }
      }, 600); // 600ms debounce — balances responsiveness vs noise
    },
    [state.activePayload, state.objectHierarchy],
  );

  // ── Undo / Redo ───────────────────────────────────────────────────────────
  const handleUndo = () => {
    if (state.historyIndex > 0) {
      const idx     = state.historyIndex - 1;
      const payload = state.history[idx];
      setState((prev) => ({ ...prev, historyIndex: idx, activePayload: payload }));
    }
  };
  const handleRedo = () => {
    if (state.historyIndex < state.history.length - 1) {
      const idx     = state.historyIndex + 1;
      const payload = state.history[idx];
      setState((prev) => ({ ...prev, historyIndex: idx, activePayload: payload }));
    }
  };

  // ── Gesture detected callback from CameraHandTracker ──────────────────
  const handleGestureDetected = useCallback((gestureName: string, _coords: { x: number; y: number }) => {
    setState((prev) => ({ ...prev, detectedGesture: gestureName }));
  }, []);

  // In camera mode with 3D scene, AR overlay renders the 3D — skip standalone card
  const isARMode = state.mode === 'camera_mic' && state.isCameraActive
    && state.activePayload?.type === '3d_scene';

  const renderActiveRepresentation = () => {
    if (!state.activePayload) return null;
    if (isARMode)              return null;

    // Universal engine handles all scenario-based types including chemistry
    if (state.activePayload.scenarioData || state.activePayload.type === '3d_scene') {
      return <UniversalScenarioSimulator payload={state.activePayload} />;
    }

    switch (state.activePayload.type) {
      case 'physics_simulation':return <PhysicsSimulator payload={state.activePayload} />;
      case 'math_derivation':   return <MathDerivationView payload={state.activePayload} />;
      case 'algorithm_visualizer': return <AlgorithmVisualizer payload={state.activePayload} />;
      case 'code_workbench':    return <CodeWorkbenchView payload={state.activePayload} />;
      case 'interactive_diagram': return <InteractiveDiagramView payload={state.activePayload} />;
      default:                  return <UniversalScenarioSimulator payload={state.activePayload} />;
    }
  };

  return (
    <div className="aura-workbench-root">
      {/* Speech Controller Engine (headless STT + TTS) */}
      <SpeechController
        isListening={state.isListening}
        onVoiceInput={handleProcessCommand}
        onInterimTranscript={handleInterimTranscript}
        narrationText={state.activePayload?.voiceNarrationText}
      />

      {/* Top HUD Header */}
      <HUDHeader
        mode={state.mode}
        onToggleMode={(newMode: OperatingMode) =>
          setState((prev) => ({ ...prev, mode: newMode, isCameraActive: newMode === 'camera_mic' }))
        }
        isListening={state.isListening}
        onToggleListening={() => setState((prev) => ({ ...prev, isListening: !prev.isListening }))}
        isCameraActive={state.isCameraActive}
        onToggleCamera={() => setState((prev) => ({ ...prev, isCameraActive: !prev.isCameraActive }))}
        activePayload={state.activePayload}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={state.historyIndex > 0}
        canRedo={state.historyIndex < state.history.length - 1}
        onVoiceInputSubmit={handleProcessCommand}
        onApiKeySave={(key: string) => AIRouterService.setApiKey(key)}
        isDrawingMode={state.isDrawingMode}
        onToggleDrawingMode={() => setState((prev) => ({ ...prev, isDrawingMode: !prev.isDrawingMode }))}
      />

      {/* Domain Quick Presets */}
      <DomainPresets onSelectPreset={handleProcessCommand} />

      {/* Streaming interim speech badge — shows while user speaks */}
      {state.interimTranscript && (
        <div className="interim-speech-badge">
          <span className="dot pulse-red"></span>
          <span>Hearing: "{state.interimTranscript}"</span>
        </div>
      )}

      {/* Main layout: viewport + sidebar */}
      <div className="workbench-main-layout">
        <main className="workbench-viewport-container">
          {renderActiveRepresentation()}

          <CameraHandTracker
            isCameraActive={state.isCameraActive}
            isDrawingMode={state.isDrawingMode}
            brushColor={state.drawingBrushColor}
            brushSize={state.drawingBrushSize}
            activePayload={state.activePayload}
            onGestureDetected={handleGestureDetected}
          />
        </main>

        <SceneHierarchy
          objects={state.objectHierarchy}
          history={state.history}
          historyIndex={state.historyIndex}
          onSelectHistoryIndex={(idx: number) =>
            setState((prev) => ({ ...prev, historyIndex: idx, activePayload: prev.history[idx] }))
          }
          activePayload={state.activePayload}
        />
      </div>
    </div>
  );
};

export default App;
