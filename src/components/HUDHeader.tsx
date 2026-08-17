import React, { useState } from 'react';
import { 
  Camera, 
  Mic, 
  MicOff, 
  RotateCcw, 
  RotateCw, 
  Layers, 
  Sparkles, 
  Volume2, 
  Key, 
  Zap,
  Activity,
  Hand
} from 'lucide-react';
import { OperatingMode, RepresentationPayload } from '../types';

interface HUDHeaderProps {
  mode: OperatingMode;
  onToggleMode: (newMode: OperatingMode) => void;
  isListening: boolean;
  onToggleListening: () => void;
  isCameraActive: boolean;
  onToggleCamera: () => void;
  activePayload: RepresentationPayload | null;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onVoiceInputSubmit: (text: string) => void;
  onApiKeySave: (key: string) => void;
  isDrawingMode: boolean;
  onToggleDrawingMode: () => void;
}

export const HUDHeader: React.FC<HUDHeaderProps> = ({
  mode,
  onToggleMode,
  isListening,
  onToggleListening,
  isCameraActive,
  onToggleCamera,
  activePayload,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onVoiceInputSubmit,
  onApiKeySave,
  isDrawingMode,
  onToggleDrawingMode
}) => {
  const [inputText, setInputText] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputText.trim()) {
      onVoiceInputSubmit(inputText);
      setInputText('');
    }
  };

  const handleSaveKey = () => {
    onApiKeySave(tempApiKey);
    setShowKeyModal(false);
  };

  return (
    <header className="hud-header">
      <div className="header-left">
        <div className="logo-badge">
          <Sparkles className="icon-glow" size={20} />
          <span className="brand-title">AURA WORKBENCH</span>
          <span className="brand-subtitle">AI Multimodal Visual OS</span>
        </div>

        {/* Operating Mode Toggle (Camera+Mic vs Voice Only) */}
        <div className="mode-segmented-control">
          <button
            className={`segmented-btn ${mode === 'camera_mic' ? 'active' : ''}`}
            onClick={() => onToggleMode('camera_mic')}
            title="Scenario 1: Camera + Mic + Gestures Mode"
          >
            <Camera size={15} />
            <span>Camera + Voice</span>
          </button>
          <button
            className={`segmented-btn ${mode === 'voice_only' ? 'active' : ''}`}
            onClick={() => onToggleMode('voice_only')}
            title="Scenario 2: Voice Only Empty Canvas Mode"
          >
            <Mic size={15} />
            <span>Voice Only</span>
          </button>
        </div>
      </div>

      {/* Voice & Gesture Quick Controls */}
      <div className="header-center">
        <div className={`mic-status-pill ${isListening ? 'listening' : ''}`} onClick={onToggleListening}>
          {isListening ? <Mic className="pulse-icon" size={16} /> : <MicOff size={16} />}
          <span className="mic-text">
            {isListening ? 'Listening Continuously...' : 'Mic Muted'}
          </span>
          {isListening && (
            <div className="audio-wave-visualizer">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
          )}
        </div>

        {/* Universal Spoken Command Input (No Submit button - Enter / Speech triggers!) */}
        <div className="spoken-input-wrapper">
          <Zap size={15} className="spoken-icon" />
          <input
            type="text"
            className="spoken-input"
            placeholder='Speak or type: "Create red car", "Simulate solar system", "Solve x²-5x+6"...'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {/* Utilities & Inspector Controls */}
      <div className="header-right">
        {mode === 'camera_mic' && (
          <>
            <button 
              className={`hud-icon-btn ${isCameraActive ? 'active' : ''}`}
              onClick={onToggleCamera}
              title="Toggle Live Camera Overlay"
            >
              <Camera size={16} />
            </button>
            <button
              className={`hud-icon-btn ${isDrawingMode ? 'active' : ''}`}
              onClick={onToggleDrawingMode}
              title="Toggle Finger / Mouse Drawing Toolbar"
            >
              <Hand size={16} />
            </button>
          </>
        )}

        <div className="history-btn-group">
          <button 
            className="hud-icon-btn" 
            onClick={onUndo} 
            disabled={!canUndo} 
            title="Undo Scene Action"
          >
            <RotateCcw size={16} />
          </button>
          <button 
            className="hud-icon-btn" 
            onClick={onRedo} 
            disabled={!canRedo} 
            title="Redo Scene Action"
          >
            <RotateCw size={16} />
          </button>
        </div>

        {/* Active Representation Tag */}
        {activePayload && (
          <div className="payload-tag">
            <Activity size={14} />
            <span>{activePayload.domain}</span>
            <span className="type-badge">{activePayload.type.replace('_', ' ')}</span>
          </div>
        )}

        <button className="hud-icon-btn" onClick={() => setShowKeyModal(true)} title="API Settings">
          <Key size={16} />
        </button>
      </div>

      {/* Modal for API Key Settings */}
      {showKeyModal && (
        <div className="modal-overlay" onClick={() => setShowKeyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3><Key size={18} /> API Key Configuration</h3>
            <p>Enter your Gemini API key for advanced generative context understanding, or leave blank to use the built-in offline Knowledge & Simulation Engine.</p>
            <input
              type="password"
              className="modal-input"
              placeholder="AI API Key (Optional)..."
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
            />
            <div className="modal-actions">
              <button className="modal-btn secondary" onClick={() => setShowKeyModal(false)}>Cancel</button>
              <button className="modal-btn primary" onClick={handleSaveKey}>Save Key</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
