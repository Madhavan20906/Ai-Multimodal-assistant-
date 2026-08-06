import React from 'react';
import { RepresentationPayload } from '../../types';
import { BookOpen, Globe, Check, Award, Compass, Cpu } from 'lucide-react';

interface RichKnowledgeViewProps {
  payload: RepresentationPayload;
}

export const RichKnowledgeView: React.FC<RichKnowledgeViewProps> = ({ payload }) => {
  const hasGroqPoints = payload.keyPoints && payload.keyPoints.length > 0;

  return (
    <div className="representation-card rich-knowledge-card">
      <div className="card-header">
        <div className="card-title-group">
          <BookOpen className="accent-icon" size={20} />
          <div>
            <h3>{payload.title}</h3>
            <p className="card-subtitle">{payload.subtitle}</p>
          </div>
        </div>

        <span className="info-badge knowledge-tag">
          {hasGroqPoints
            ? <><Cpu size={12} /> Groq AI Answer</>
            : <><Globe size={12} /> Knowledge Answer</>}
        </span>
      </div>

      <div className="rich-knowledge-body">
        <div className="hero-text-banner">
          <p>{payload.summaryText}</p>
        </div>

        <div className="knowledge-cards-grid">
          <div className="metric-card">
            <div className="card-icon"><Award size={18} /></div>
            <div>
              <span className="metric-label">Topic</span>
              <strong className="metric-val">{payload.title.split(':')[1]?.trim() || payload.title}</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="card-icon"><Compass size={18} /></div>
            <div>
              <span className="metric-label">Domain</span>
              <strong className="metric-val">{payload.domain}</strong>
            </div>
          </div>
        </div>

        <div className="insights-box">
          <h4>{hasGroqPoints ? 'Key Insights' : 'Core Takeaways'}</h4>
          <ul>
            {hasGroqPoints
              ? payload.keyPoints!.map((point, i) => (
                  <li key={i}>
                    <Check size={14} className="check-icon" /> {point}
                  </li>
                ))
              : (
                <>
                  <li><Check size={14} className="check-icon" /> AI classification selected this knowledge format for your query.</li>
                  <li><Check size={14} className="check-icon" /> Voice narration has been generated for TTS playback.</li>
                </>
              )}
          </ul>
        </div>
      </div>

      <div className="card-footer">
        <p>{hasGroqPoints ? 'Powered by Groq · llama-3.3-70b-versatile' : 'Continuous Multimodal Workbench Context Active.'}</p>
      </div>
    </div>
  );
};
