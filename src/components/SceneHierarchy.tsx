import React from 'react';
import { SceneObject, RepresentationPayload } from '../types';
import { Layers, History, ChevronRight, Sliders, Sparkles } from 'lucide-react';

interface SceneHierarchyProps {
  objects: SceneObject[];
  history: RepresentationPayload[];
  historyIndex: number;
  onSelectHistoryIndex: (index: number) => void;
  activePayload: RepresentationPayload | null;
}

export const SceneHierarchy: React.FC<SceneHierarchyProps> = ({
  objects,
  history,
  historyIndex,
  onSelectHistoryIndex,
  activePayload,
}) => {
  return (
    <aside className="scene-hierarchy-sidebar">
      {/* 1. Persistent Scene Hierarchy Tree */}
      <div className="sidebar-section">
        <div className="section-title">
          <Layers size={16} />
          <span>SCENE OBJECT GRAPH</span>
        </div>

        <div className="object-tree-container">
          {objects.length === 0 ? (
            <div className="empty-tree-notice">
              <span>No persistent 3D/Scene objects yet. Speak a command like "Give me a water bottle" or "Create a red car".</span>
            </div>
          ) : (
            objects.map((obj) => (
              <div key={obj.id} className="tree-object-card">
                <div className="tree-header">
                  <ChevronRight size={14} />
                  <span className="obj-name">{obj.name}</span>
                  <span className="obj-type">{obj.type}</span>
                </div>

                <div className="obj-props-grid">
                  {Object.entries(obj.properties).map(([k, v]) => (
                    <div key={k} className="tree-prop-item">
                      <span className="prop-k">{k}:</span>
                      <span className="prop-v">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Scene Timeline History Inspector */}
      <div className="sidebar-section">
        <div className="section-title">
          <History size={16} />
          <span>WORKBENCH TIMELINE ({history.length})</span>
        </div>

        <div className="timeline-history-list">
          {history.map((item, idx) => (
            <div
              key={idx}
              className={`history-timeline-item ${idx === historyIndex ? 'active-history' : ''}`}
              onClick={() => onSelectHistoryIndex(idx)}
            >
              <div className="history-step-badge">#{idx + 1}</div>
              <div className="history-info">
                <span className="history-title">{item.title}</span>
                <span className="history-domain">{item.domain} • {item.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
