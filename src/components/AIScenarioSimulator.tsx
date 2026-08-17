import React, { useState, useEffect, useRef } from 'react';
import { aiVideoGenerator } from '../services/aiVideoGenerator';

interface AIScenarioSimulatorProps {
  voiceInput: string;
  onSimulationReady: (videoUrl: string) => void;
}

const AIScenarioSimulator: React.FC<AIScenarioSimulatorProps> = ({ voiceInput, onSimulationReady }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (voiceInput.trim()) {
      generateSimulationVideo(voiceInput);
    }
  }, [voiceInput]);

  const generateSimulationVideo = async (scenarioDescription: string) => {
    setIsGenerating(true);
    setError(null);

    try {
      const videoData = await aiVideoGenerator.generateVideoFromScenario(scenarioDescription);
      const videoUrl = await aiVideoGenerator.renderVideo(videoData);
      onSimulationReady(videoUrl);
    } catch (err) {
      setError('Failed to generate simulation video. Please try again.');
      console.error('Simulation generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ai-scenario-simulator">
      {isGenerating && <div className="loading-indicator">Generating AI simulation...</div>}
      {error && <div className="error-message">{error}</div>}
      <video
        ref={videoRef}
        controls
        className="simulation-video"
        style={{ display: isGenerating ? 'none' : 'block' }}
      />
    </div>
  );
};

export default AIScenarioSimulator;