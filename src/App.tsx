import React, { useState, useEffect, useCallback } from 'react';
import { WorkbenchState, OperatingMode, RepresentationPayload, SceneObject } from './types';
import { AIRouterService } from './services/aiRouter';
import { HUDHeader } from './components/HUDHeader';
import { SpeechController } from './components/SpeechController';
import { CameraHandTracker } from './components/CameraHandTracker';
import { SceneHierarchy } from './components/SceneHierarchy';
import { DomainPresets } from './components/DomainPresets';

// Representation Views
import { ThreeDWorkbench } from './components/representations/ThreeDWorkbench';
import { PhysicsSimulator } from './components/representations/PhysicsSimulator';
import { MathDerivationView } from './components/representations/MathDerivationView';
import { AlgorithmVisualizer } from './components/representations/AlgorithmVisualizer';
import { ChemistryLabView } from './components/representations/ChemistryLabView';
import { CodeWorkbenchView } from './components/representations/CodeWorkbenchView';
import { InteractiveDiagramView } from './components/representations/InteractiveDiagramView';
import { RichKnowledgeView } from './components/representations/RichKnowledgeView';

export const App: React.FC = () => {
  const [state, setState] = useState<WorkbenchState>({
    mode: 'voice_only',
    isListening: true,
    isCameraActive: false,
    activePayload: null,
    objectHierarchy: [],
    history: [],
    historyIndex: -1,
    speechTranscript: '',
    interimTranscript: '',
    detectedGesture: 'Hands-free Ready',
    isDrawingMode: false,
    drawingBrushColor: '#06b6d4',
    drawingBrushSize: 4,
  });

  // Initial Welcome Scene Payload
  useEffect(() => {
    handleProcessCommand('Create a chemistry laboratory');
  }, []);

  // Process Spoken or Typed Command automatically
  const handleProcessCommand = useCallback(
    async (input: string) => {
      if (!input.trim()) return;

      console.log('Processing Workbench Input:', input);
      const newPayload = await AIRouterService.processInput(input, state.activePayload, state.objectHierarchy);

      setState((prev) => {
        // Extract 3D objects if present to update persistent object hierarchy
        let updatedObjects = [...prev.objectHierarchy];
        if (newPayload.threeDData?.objects) {
          newPayload.threeDData.objects.forEach((newObj) => {
            const existingIdx = updatedObjects.findIndex((o) => o.id === newObj.id);
            if (existingIdx >= 0) {
              updatedObjects[existingIdx] = newObj;
            } else {
              updatedObjects.push(newObj);
            }
          });
        }

        const newHistory = [...prev.history.slice(0, prev.historyIndex + 1), newPayload];
        const newHistoryIndex = newHistory.length - 1;

        return {
          ...prev,
          activePayload: newPayload,
          objectHierarchy: updatedObjects,
          history: newHistory,
          historyIndex: newHistoryIndex,
          speechTranscript: input,
          interimTranscript: '',
        };
      });
    },
    [state.activePayload, state.objectHierarchy]
  );

  // Undo Action
  const handleUndo = () => {
    if (state.historyIndex > 0) {
      const prevIdx = state.historyIndex - 1;
      const prevPayload = state.history[prevIdx];
      setState((prev) => ({
        ...prev,
        historyIndex: prevIdx,
        activePayload: prevPayload,
      }));
    }
  };

  // Redo Action
  const handleRedo = () => {
    if (state.historyIndex < state.history.length - 1) {
      const nextIdx = state.historyIndex + 1;
      const nextPayload = state.history[nextIdx];
      setState((prev) => ({
        ...prev,
        historyIndex: nextIdx,
        activePayload: nextPayload,
      }));
    }
  };

  // In camera mode with 3D scene, the AR overlay IS the representation — skip standalone card
  const isARMode = state.mode === 'camera_mic' && state.isCameraActive && state.activePayload?.type === '3d_scene';

  // Render Current Selected Representation Engine Component
  const renderActiveRepresentation = () => {
    if (!state.activePayload) return null;

    // When AR mode is active for 3D scenes, the CameraHandTracker renders the 3D over video
    // so we skip the standalone ThreeDWorkbench card
    if (isARMode) return null;

    switch (state.activePayload.type) {
      case '3d_scene':
        return <ThreeDWorkbench payload={state.activePayload} />;
      case 'physics_simulation':
        return <PhysicsSimulator payload={state.activePayload} />;
      case 'math_derivation':
        return <MathDerivationView payload={state.activePayload} />;
      case 'algorithm_visualizer':
        return <AlgorithmVisualizer payload={state.activePayload} />;
      case 'chemistry_lab':
        return <ChemistryLabView payload={state.activePayload} />;
      case 'code_workbench':
        return <CodeWorkbenchView payload={state.activePayload} />;
      case 'interactive_diagram':
        return <InteractiveDiagramView payload={state.activePayload} />;
      case 'rich_knowledge':
        return <RichKnowledgeView payload={state.activePayload} />;
      default:
        return <RichKnowledgeView payload={state.activePayload} />;
    }
  };

  return (
    <div className="aura-workbench-root">
      {/* Speech Controller Engine (Headless STT + TTS) */}
      <SpeechController
        isListening={state.isListening}
        onVoiceInput={handleProcessCommand}
        onInterimTranscript={(interim) => setState((prev) => ({ ...prev, interimTranscript: interim }))}
        narrationText={state.activePayload?.voiceNarrationText}
      />

      {/* Top HUD Header Navigation Bar */}
      <HUDHeader
        mode={state.mode}
        onToggleMode={(newMode) => {
          setState((prev) => ({
            ...prev,
            mode: newMode,
            isCameraActive: newMode === 'camera_mic',
          }));
        }}
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
        onApiKeySave={(key) => AIRouterService.setApiKey(key)}
        isDrawingMode={state.isDrawingMode}
        onToggleDrawingMode={() => setState((prev) => ({ ...prev, isDrawingMode: !prev.isDrawingMode }))}
      />

      {/* Domain Quick Scenario Presets */}
      <DomainPresets onSelectPreset={handleProcessCommand} />

      {/* Interim Continuous Speech Overlay Badge */}
      {state.interimTranscript && (
        <div className="interim-speech-badge">
          <span className="dot pulse-red"></span>
          <span>Hearing: "{state.interimTranscript}"</span>
        </div>
      )}

      {/* Main Workbench Layout: Canvas Viewport + Scene Inspector Sidebar */}
      <div className="workbench-main-layout">
        <main className="workbench-viewport-container">
          {renderActiveRepresentation()}

          {/* Camera AR Overlay + Finger Drawing Layer */}
          <CameraHandTracker
            isCameraActive={state.isCameraActive}
            isDrawingMode={state.isDrawingMode}
            brushColor={state.drawingBrushColor}
            brushSize={state.drawingBrushSize}
            activePayload={state.activePayload}
          />
        </main>

        {/* Right Scene Object Tree & History Inspector */}
        <SceneHierarchy
          objects={state.objectHierarchy}
          history={state.history}
          historyIndex={state.historyIndex}
          onSelectHistoryIndex={(idx) => {
            setState((prev) => ({
              ...prev,
              historyIndex: idx,
              activePayload: prev.history[idx],
            }));
          }}
          activePayload={state.activePayload}
        />
      </div>
    </div>
  );
};

export default App;
