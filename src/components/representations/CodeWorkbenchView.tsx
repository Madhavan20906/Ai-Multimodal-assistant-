import React, { useState } from 'react';
import { RepresentationPayload } from '../../types';
import { Code, Terminal, Layers, Play, Check } from 'lucide-react';

interface CodeWorkbenchViewProps {
  payload: RepresentationPayload;
}

export const CodeWorkbenchView: React.FC<CodeWorkbenchViewProps> = ({ payload }) => {
  const codeData = payload.codeData;
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  if (!codeData) return null;

  const currentStep = codeData.executionSteps[activeStepIndex] || codeData.executionSteps[0];
  const lines = codeData.code.split('\n');

  return (
    <div className="representation-card code-card">
      <div className="card-header">
        <div className="card-title-group">
          <Code className="accent-icon" size={20} />
          <div>
            <h3>{payload.title}</h3>
            <p className="card-subtitle">{payload.subtitle}</p>
          </div>
        </div>

        <span className="lang-badge">{codeData.language.toUpperCase()}</span>
      </div>

      <div className="code-workbench-grid">
        {/* Code Editor Viewport with Active Pointer */}
        <div className="code-editor-viewport">
          <div className="editor-top-bar">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
            <span className="file-title">solution.{codeData.language === 'python' ? 'py' : 'js'}</span>
          </div>

          <div className="code-lines-container">
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isExecuting = currentStep?.line === lineNum;
              return (
                <div key={idx} className={`code-line ${isExecuting ? 'executing-line' : ''}`}>
                  <span className="line-number">{lineNum}</span>
                  <span className="line-content">{line}</span>
                  {isExecuting && <span className="execution-pointer"><Play size={10} /> Executing</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Memory Inspector & Call Stack Sidebar */}
        <div className="memory-inspector-sidebar">
          {/* Step Selector */}
          <div className="step-picker">
            <label>Execution Trace Step:</label>
            <div className="step-btn-row">
              {codeData.executionSteps.map((_, i) => (
                <button
                  key={i}
                  className={`step-num-btn ${activeStepIndex === i ? 'active' : ''}`}
                  onClick={() => setActiveStepIndex(i)}
                >
                  Step {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Call Stack Inspector */}
          <div className="inspector-box">
            <h4><Layers size={14} /> Call Stack Frames</h4>
            <div className="stack-frames">
              {codeData.callStack.map((frame, i) => (
                <div key={i} className="frame-item">
                  <span className="frame-depth">#{codeData.callStack.length - i}</span>
                  <span className="frame-name">{frame}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Variable Memory Table */}
          <div className="inspector-box">
            <h4><Terminal size={14} /> Variable Memory State</h4>
            <table className="vars-table">
              <thead>
                <tr>
                  <th>Var</th>
                  <th>Type</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {codeData.variables.map((v, i) => (
                  <tr key={i}>
                    <td className="var-name">{v.name}</td>
                    <td className="var-type">{v.type}</td>
                    <td className="var-val">{v.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Execution Log */}
          {currentStep?.log && (
            <div className="console-log-box">
              <span className="console-title">Console Output:</span>
              <p className="console-text">&gt; {currentStep.log}</p>
            </div>
          )}
        </div>
      </div>

      <div className="card-footer">
        <p>{payload.summaryText}</p>
      </div>
    </div>
  );
};
