import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { RepresentationPayload } from '../../types';
import { Calculator, CheckCircle2, TrendingUp } from 'lucide-react';

interface MathDerivationViewProps {
  payload: RepresentationPayload;
}

export const MathDerivationView: React.FC<MathDerivationViewProps> = ({ payload }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mathData = payload.mathData;

  // Render Coordinate Axis Graph
  useEffect(() => {
    if (!canvasRef.current || !mathData) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const originX = canvas.width / 2;
    const originY = canvas.height / 2 + 30;
    const scale = 25; // pixels per math unit

    // Draw Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(canvas.width, originY);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, canvas.height);
    ctx.stroke();

    // Ticks & Numbers
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Inter, sans-serif';
    for (let x = -8; x <= 8; x += 2) {
      if (x === 0) continue;
      const px = originX + x * scale;
      ctx.fillText(x.toString(), px - 4, originY + 15);
      ctx.beginPath();
      ctx.moveTo(px, originY - 3);
      ctx.lineTo(px, originY + 3);
      ctx.stroke();
    }

    // Plot Function Curve y = f(x) (quadratic: x^2 - 5x + 6)
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let isFirst = true;
    for (let px = 0; px < canvas.width; px++) {
      const x = (px - originX) / scale;
      const y = Math.pow(x, 2) - 5 * x + 6; // f(x) = x^2 - 5x + 6
      const py = originY - y * scale;

      if (py >= 0 && py <= canvas.height) {
        if (isFirst) {
          ctx.moveTo(px, py);
          isFirst = false;
        } else {
          ctx.lineTo(px, py);
        }
      }
    }
    ctx.stroke();

    // Highlight Roots (x=2, x=3)
    const roots = [2, 3];
    roots.forEach((rootX) => {
      const rx = originX + rootX * scale;
      const ry = originY;

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(rx, ry, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`(${rootX}, 0)`, rx - 15, ry - 10);
    });
  }, [mathData]);

  if (!mathData) return null;

  return (
    <div className="representation-card math-card">
      <div className="card-header">
        <div className="card-title-group">
          <Calculator className="accent-icon" size={20} />
          <div>
            <h3>{payload.title}</h3>
            <p className="card-subtitle">{payload.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="math-workbench-grid">
        {/* Step-by-Step Derivation Column */}
        <div className="derivation-column">
          <h4>Mathematical Derivation Steps</h4>
          <div className="equation-hero">
            <span
              dangerouslySetInnerHTML={{
                __html: katex.renderToString(mathData.equation, { throwOnError: false }),
              }}
            />
          </div>

          <div className="steps-list">
            {mathData.steps.map((step, idx) => (
              <div key={idx} className="math-step-item">
                <div className="step-badge">
                  <CheckCircle2 size={14} />
                  <span>{step.label}</span>
                </div>
                <div
                  className="katex-step-formula"
                  dangerouslySetInnerHTML={{
                    __html: katex.renderToString(step.latex, { displayMode: true, throwOnError: false }),
                  }}
                />
                <p className="step-explanation">{step.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Function Graph Plotter Column */}
        <div className="graph-column">
          <h4><TrendingUp size={16} /> Function Curve & Roots Plot</h4>
          <canvas ref={canvasRef} width={380} height={340} className="math-graph-canvas" />
          <div className="roots-legend">
            <span className="root-pill"><span className="dot red"></span> Root 1: x = 2.0</span>
            <span className="root-pill"><span className="dot red"></span> Root 2: x = 3.0</span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <p>{payload.summaryText}</p>
      </div>
    </div>
  );
};
