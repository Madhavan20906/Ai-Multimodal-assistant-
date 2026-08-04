import React, { useState } from 'react';
import { RepresentationPayload } from '../../types';
import { Beaker, Flame, Thermometer, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';

interface ChemistryLabViewProps {
  payload: RepresentationPayload;
}

export const ChemistryLabView: React.FC<ChemistryLabViewProps> = ({ payload }) => {
  const chemData = payload.chemData;
  const [isReacting, setIsReacting] = useState(chemData?.isAnimated || false);

  if (!chemData) return null;

  return (
    <div className="representation-card chem-card">
      <div className="card-header">
        <div className="card-title-group">
          <Beaker className="accent-icon" size={20} />
          <div>
            <h3>{payload.title}</h3>
            <p className="card-subtitle">{payload.subtitle}</p>
          </div>
        </div>

        <div className="badge-group">
          <span className="info-badge chem-type">{chemData.reactionType}</span>
          {chemData.temperatureChange && (
            <span className="info-badge temp-badge"><Thermometer size={12} /> {chemData.temperatureChange}</span>
          )}
        </div>
      </div>

      <div className="chem-workbench-viewport">
        {/* Animated Reaction Beaker Stage */}
        <div className="beaker-stage">
          <div className="reactants-side">
            {chemData.reactants.map((reactant, i) => (
              <div key={i} className="beaker-wrapper">
                <div className="beaker-glass">
                  <div className="beaker-liquid" style={{ backgroundColor: reactant.color, height: '60%' }} />
                </div>
                <span className="reactant-name">{reactant.name}</span>
                <span className="reactant-formula">{reactant.formula}</span>
              </div>
            ))}
          </div>

          <div className="reaction-arrow-zone">
            <button className={`mix-trigger-btn ${isReacting ? 'reacting' : ''}`} onClick={() => setIsReacting(!isReacting)}>
              <Flame size={16} />
              <span>{isReacting ? 'Reacting...' : 'Mix & React'}</span>
            </button>
            <ArrowRight className="arrow-pulse" size={24} />
          </div>

          <div className="products-side">
            <div className="beaker-wrapper main-product">
              <div className="beaker-glass">
                <div
                  className={`beaker-liquid ${isReacting ? 'bubbling' : ''}`}
                  style={{
                    backgroundColor: isReacting ? '#10b981' : '#334155',
                    height: isReacting ? '75%' : '20%',
                  }}
                >
                  {isReacting && (
                    <div className="bubbles-particle-container">
                      <span className="bubble"></span>
                      <span className="bubble"></span>
                      <span className="bubble"></span>
                    </div>
                  )}
                </div>
              </div>
              <span className="reactant-name">Resulting Mixture</span>
              <span className="reactant-formula">{isReacting ? chemData.products.map(p => p.formula).join(' + ') : 'Unreacted'}</span>
            </div>
          </div>
        </div>

        {/* Balanced Equation Banner */}
        <div className="balanced-equation-box">
          <h4>Balanced Chemical Equation</h4>
          <div className="equation-text">{chemData.balancedEquation}</div>
        </div>

        {/* Reaction Observations & Thermochemistry */}
        <div className="observations-box">
          <h4>Key Chemical Observations</h4>
          <ul>
            {chemData.observations.map((obs, idx) => (
              <li key={idx}>
                <CheckCircle size={14} className="check-icon" />
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card-footer">
        <p>{payload.summaryText}</p>
      </div>
    </div>
  );
};
