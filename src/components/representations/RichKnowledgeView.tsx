import React from 'react';
import { RepresentationPayload } from '../../types';
import { BookOpen, Globe, Check, Award, Compass } from 'lucide-react';

interface RichKnowledgeViewProps {
  payload: RepresentationPayload;
}

export const RichKnowledgeView: React.FC<RichKnowledgeViewProps> = ({ payload }) => {
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

        <span className="info-badge knowledge-tag"><Globe size={12} /> Direct Knowledge Answer</span>
      </div>

      <div className="rich-knowledge-body">
        <div className="hero-text-banner">
          <p>{payload.summaryText}</p>
        </div>

        <div className="knowledge-cards-grid">
          <div className="metric-card">
            <div className="card-icon"><Award size={18} /></div>
            <div>
              <span className="metric-label">Key Entity</span>
              <strong className="metric-val">{payload.title.split(':')[1] || payload.title}</strong>
            </div>
          </div>

          <div className="metric-card">
            <div className="card-icon"><Compass size={18} /></div>
            <div>
              <span className="metric-label">Domain Scope</span>
              <strong className="metric-val">{payload.domain}</strong>
            </div>
          </div>
        </div>

        <div className="insights-box">
          <h4>Core Takeaways & Analytical Context</h4>
          <ul>
            <li><Check size={14} className="check-icon" /> Evaluated directly by AURA Representation Router based on factual intent.</li>
            <li><Check size={14} className="check-icon" /> Textual representation selected to maximize clarity and avoid redundant graphics.</li>
            <li><Check size={14} className="check-icon" /> Real-time Speech Synthesis (TTS) narration generated.</li>
          </ul>
        </div>
      </div>

      <div className="card-footer">
        <p>Continuous Multimodal Workbench Context Active.</p>
      </div>
    </div>
  );
};
