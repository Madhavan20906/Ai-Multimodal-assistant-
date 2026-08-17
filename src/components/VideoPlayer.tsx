import React, { useState, useRef, useEffect } from 'react';
import { aiVideoGenerator } from '../services/aiVideoGenerator';
import './VideoPlayer.css';

interface VideoPlayerProps {
  scenario: string;
  onVideoGenerated?: (videoUrl: string) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ scenario, onVideoGenerated }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (scenario) {
      generateVideo(scenario);
    }
  }, [scenario]);

  const generateVideo = async (scenarioText: string) => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);

    try {
      // Generate video structure
      const video = await aiVideoGenerator.generateVideoFromScenario(scenarioText);
      setProgress(30);

      // Simulate rendering progress
      for (let i = 30; i <= 90; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setProgress(i);
      }

      // Render video
      const url = await aiVideoGenerator.renderVideo(video);
      setVideoUrl(url);
      setProgress(100);

      if (onVideoGenerated) {
        onVideoGenerated(url);
      }
    } catch (err) {
      setError('Failed to generate video. Please try again.');
      console.error('Video generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="video-player-container">
      <div className="video-header">
        <h2>AI-Generated Explainer Video</h2>
      </div>

      {isGenerating && (
        <div className="generation-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p>Generating video: {progress}%</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!isGenerating && !error && videoUrl && (
        <div className="video-wrapper">
          <video
            ref={videoRef}
            controls
            autoPlay
            className="video-element"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {!isGenerating && !error && !videoUrl && (
        <div className="empty-state">
          <p>Describe a scenario to generate an AI explainer video</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;