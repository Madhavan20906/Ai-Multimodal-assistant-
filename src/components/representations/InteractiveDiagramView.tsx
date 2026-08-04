import React from 'react';
import { RepresentationPayload } from '../../types';
import { Network, GitBranch, Calendar, ArrowRight, Activity } from 'lucide-react';

interface InteractiveDiagramViewProps {
  payload: RepresentationPayload;
}

export const InteractiveDiagramView: React.FC<InteractiveDiagramViewProps> = ({ payload }) => {
  const diagramData = payload.diagramData;
  if (!diagramData) return null;

  return (
    <div className="representation-card diagram-card">
      <div className="card-header">
        <div className="card-title-group">
          <Network className="accent-icon" size={20} />
          <div>
            <h3>{payload.title}</h3>
            <p className="card-subtitle">{payload.subtitle}</p>
          </div>
        </div>

        <span className="info-badge diagram-kind">{diagramData.kind.replace('_', ' ').toUpperCase()}</span>
      </div>

      <div className="diagram-workbench-viewport">
        {/* Render Historical Timeline */}
        {diagramData.kind === 'timeline' && diagramData.timelineEvents ? (
          <div className="timeline-container">
            {diagramData.timelineEvents.map((evt, idx) => (
              <div key={idx} className="timeline-node-card">
                <div className="year-badge">
                  <Calendar size={12} /> {evt.year}
                </div>
                <div className="timeline-content">
                  <h4>{evt.title}</h4>
                  <p>{evt.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Render Graph / Flowchart Node Network */
          <div className="node-network-wrapper">
            <div className="nodes-grid">
              {diagramData.nodes.map((node) => (
                <div key={node.id} className={`network-node-card ${node.type || 'default'}`}>
                  <div className="node-header">
                    <Activity size={14} />
                    <span className="node-id">{node.id}</span>
                  </div>
                  <h4>{node.label}</h4>
                  {node.subtext && <p className="node-subtext">{node.subtext}</p>}
                </div>
              ))}
            </div>

            {/* Edges / Connections List */}
            <div className="edges-flow-bar">
              <h4>Active Signal & Dataflow Edges</h4>
              <div className="edges-pills">
                {diagramData.edges.map((edge, i) => (
                  <div key={i} className="edge-pill">
                    <span>{edge.from}</span>
                    <ArrowRight size={12} className="pulse-arrow" />
                    <span>{edge.to}</span>
                    {edge.label && <span className="edge-label">({edge.label})</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card-footer">
        <p>{payload.summaryText}</p>
      </div>
    </div>
  );
};
