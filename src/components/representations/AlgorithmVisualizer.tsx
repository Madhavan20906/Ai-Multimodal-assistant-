import React, { useState, useEffect } from 'react';
import { RepresentationPayload } from '../../types';
import { Play, Pause, SkipForward, SkipBack, Cpu, Clock, HardDrive } from 'lucide-react';

interface AlgorithmVisualizerProps {
  payload: RepresentationPayload;
}

export const AlgorithmVisualizer: React.FC<AlgorithmVisualizerProps> = ({ payload }) => {
  const algoData = payload.algoData;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(800);

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [payload]);

  useEffect(() => {
    if (!isPlaying || !algoData) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= algoData.executionSteps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, speedMs);

    return () => clearInterval(timer);
  }, [isPlaying, algoData, speedMs]);

  if (!algoData) return null;

  const currentStep = algoData.executionSteps[currentStepIndex];
  const maxArrayVal = Math.max(...algoData.initialArray, 100);

  return (
    <div className="representation-card algo-card">
      <div className="card-header">
        <div className="card-title-group">
          <Cpu className="accent-icon" size={20} />
          <div>
            <h3>{payload.title}</h3>
            <p className="card-subtitle">{payload.subtitle}</p>
          </div>
        </div>

        <div className="complexity-group">
          <span className="complexity-badge"><Clock size={12} /> {algoData.timeComplexity}</span>
          <span className="complexity-badge"><HardDrive size={12} /> {algoData.spaceComplexity}</span>
        </div>
      </div>

      <div className="algo-workbench">
        {/* Array Bars Viewport */}
        <div className="array-bars-container">
          {currentStep.array.map((val, idx) => {
            const isHighlighted = currentStep.highlightedIndices.includes(idx);
            const isSwapped = currentStep.swappedIndices?.includes(idx);
            const heightPercent = (val / maxArrayVal) * 100;

            let barColor = '#3b82f6'; // default blue
            if (isSwapped) barColor = '#ef4444'; // red for swap
            else if (isHighlighted) barColor = '#f59e0b'; // yellow highlight

            return (
              <div key={idx} className="array-bar-wrapper">
                <span className="bar-val">{val}</span>
                <div
                  className="array-bar"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: barColor,
                    boxShadow: isHighlighted ? `0 0 12px ${barColor}` : 'none',
                  }}
                />
                <span className="bar-index">[{idx}]</span>
              </div>
            );
          })}
        </div>

        {/* Step Explanation Banner */}
        <div className="step-explanation-box">
          <span className="step-counter">Step {currentStepIndex + 1} of {algoData.executionSteps.length}</span>
          <p className="step-desc">{currentStep.explanation}</p>
        </div>

        {/* Player Controls Bar */}
        <div className="algo-player-bar">
          <div className="playback-btns">
            <button
              className="player-btn"
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex((prev) => Math.max(prev - 1, 0))}
            >
              <SkipBack size={16} />
            </button>

            <button className="player-btn primary" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>

            <button
              className="player-btn"
              disabled={currentStepIndex === algoData.executionSteps.length - 1}
              onClick={() => setCurrentStepIndex((prev) => Math.min(prev + 1, algoData.executionSteps.length - 1))}
            >
              <SkipForward size={16} />
            </button>
          </div>

          <div className="speed-slider-group">
            <label>Playback Speed:</label>
            <input
              type="range"
              min="200"
              max="1500"
              step="100"
              value={1700 - speedMs}
              onChange={(e) => setSpeedMs(1700 - parseInt(e.target.value, 10))}
            />
          </div>
        </div>
      </div>

      <div className="card-footer">
        <p>{payload.summaryText}</p>
      </div>
    </div>
  );
};
