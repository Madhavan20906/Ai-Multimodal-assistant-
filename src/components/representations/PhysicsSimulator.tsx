import React, { useEffect, useRef, useState } from 'react';
import { RepresentationPayload } from '../../types';
import { Play, Pause, RotateCcw, Activity, ShieldAlert } from 'lucide-react';

interface PhysicsSimulatorProps {
  payload: RepresentationPayload;
}

export const PhysicsSimulator: React.FC<PhysicsSimulatorProps> = ({ payload }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(true);
  const [gravity, setGravity] = useState(payload.physicsData?.gravity || 9.81);
  const [bobAngle, setBobAngle] = useState(payload.physicsData?.angle || 45);

  const angleRef = useRef((payload.physicsData?.angle || 45) * (Math.PI / 180));
  const angleVelRef = useRef(0);
  const angleAccelRef = useRef(0);

  useEffect(() => {
    angleRef.current = bobAngle * (Math.PI / 180);
    angleVelRef.current = 0;
  }, [bobAngle]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const originX = canvas.width / 2;
    const originY = 80;
    const length = 180;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background Grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Physics Physics Math (Pendulum Equation: α = -(g/L) * sin(θ))
      if (isRunning) {
        angleAccelRef.current = (-(gravity / 10) / length) * Math.sin(angleRef.current);
        angleVelRef.current += angleAccelRef.current;
        angleVelRef.current *= 0.995; // Damping
        angleRef.current += angleVelRef.current;
      }

      const bobX = originX + length * Math.sin(angleRef.current);
      const bobY = originY + length * Math.cos(angleRef.current);

      // Draw Support Beam
      ctx.fillStyle = '#475569';
      ctx.fillRect(originX - 60, originY - 10, 120, 10);

      // Draw String
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // Draw Velocity Vector Arrow
      const velScale = 15;
      const vx = angleVelRef.current * length * Math.cos(angleRef.current) * velScale;
      const vy = -angleVelRef.current * length * Math.sin(angleRef.current) * velScale;

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bobX, bobY);
      ctx.lineTo(bobX + vx, bobY + vy);
      ctx.stroke();

      // Draw Pendulum Bob
      const gradient = ctx.createRadialGradient(bobX - 5, bobY - 5, 2, bobX, bobY, 20);
      gradient.addColorStop(0, '#38bdf8');
      gradient.addColorStop(1, '#0284c7');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(bobX, bobY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Bob Center Dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(bobX, bobY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Kinetic / Potential Energy Metrics
      const height = length * (1 - Math.cos(angleRef.current));
      const pe = (gravity * height) / 10;
      const ke = 0.5 * Math.pow(angleVelRef.current * length, 2);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText(`Potential Energy (PE): ${pe.toFixed(2)} J`, 20, canvas.height - 40);
      ctx.fillText(`Kinetic Energy (KE): ${ke.toFixed(2)} J`, 20, canvas.height - 20);
      ctx.fillText(`Velocity Vector (v): ${Math.abs(angleVelRef.current * 10).toFixed(2)} m/s`, 260, canvas.height - 20);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isRunning, gravity]);

  return (
    <div className="representation-card physics-card">
      <div className="card-header">
        <div className="card-title-group">
          <Activity className="accent-icon" size={20} />
          <div>
            <h3>{payload.title}</h3>
            <p className="card-subtitle">{payload.subtitle}</p>
          </div>
        </div>

        <div className="physics-controls">
          <button className="control-btn" onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? <Pause size={14} /> : <Play size={14} />}
            <span>{isRunning ? 'Pause' : 'Play'}</span>
          </button>
          <button
            className="control-btn"
            onClick={() => {
              angleRef.current = 45 * (Math.PI / 180);
              angleVelRef.current = 0;
            }}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="physics-viewport-wrapper">
        <canvas ref={canvasRef} width={640} height={340} className="physics-canvas" />

        <div className="physics-parameters-sidebar">
          <h4>Parameters</h4>

          <div className="slider-group">
            <label>Gravity (g): <span>{gravity.toFixed(2)} m/s²</span></label>
            <input
              type="range"
              min="1"
              max="25"
              step="0.1"
              value={gravity}
              onChange={(e) => setGravity(parseFloat(e.target.value))}
            />
          </div>

          <div className="slider-group">
            <label>Initial Angle (θ): <span>{bobAngle}°</span></label>
            <input
              type="range"
              min="5"
              max="80"
              value={bobAngle}
              onChange={(e) => setBobAngle(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="vector-legend">
            <span className="legend-item"><span className="dot red"></span> Velocity Vector</span>
            <span className="legend-item"><span className="dot blue"></span> String Tension</span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <p>{payload.summaryText}</p>
      </div>
    </div>
  );
};
