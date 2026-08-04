import React from 'react';
import { 
  Beaker, 
  Activity, 
  Calculator, 
  Cpu, 
  Code, 
  Network, 
  Box, 
  Sparkles, 
  Globe, 
  BookOpen, 
  Compass,
  Building
} from 'lucide-react';

interface DomainPresetsProps {
  onSelectPreset: (prompt: string) => void;
}

export const DomainPresets: React.FC<DomainPresetsProps> = ({ onSelectPreset }) => {
  const presets = [
    { label: 'Give me a water bottle', icon: Box, category: '3D Mesh', prompt: 'Give me a water bottle' },
    { label: 'Fill it to 80 percent', icon: Sparkles, category: '3D Modifier', prompt: 'Fill it to 80 percent' },
    { label: 'Create a red car', icon: Box, category: '3D Mesh', prompt: 'Create a red car' },
    { label: 'Make it blue', icon: Sparkles, category: '3D Modifier', prompt: 'Make it blue' },
    { label: 'Create chemistry lab', icon: Beaker, category: 'Chemistry', prompt: 'Create a chemistry laboratory' },
    { label: 'Replace HCl with H₂SO₄', icon: Beaker, category: 'Chemistry Mod', prompt: 'Replace hydrochloric acid with sulfuric acid' },
    { label: 'Solve x² - 5x + 6', icon: Calculator, category: 'Math', prompt: 'Solve x^2 - 5x + 6' },
    { label: 'Explain QuickSort', icon: Cpu, category: 'Algorithms', prompt: 'Explain Quick Sort' },
    { label: 'Python Fibonacci Code', icon: Code, category: 'Programming', prompt: 'Show python code for fibonacci with call stack' },
    { label: 'Pendulum Simulation', icon: Activity, category: 'Physics', prompt: 'Show pendulum physics motion simulation' },
    { label: 'Explain Blockchain', icon: Network, category: 'Networking', prompt: 'Explain blockchain flow' },
    { label: 'Neural Network ML', icon: Network, category: 'Machine Learning', prompt: 'Explain neural network feature flow' },
    { label: 'Building Floorplan 3D', icon: Building, category: 'Architecture', prompt: 'Show 3D building architecture model' },
    { label: 'Industrial Timeline', icon: BookOpen, category: 'History', prompt: 'Show industrial revolution history timeline' },
    { label: 'Capital of Japan?', icon: Globe, category: 'General Fact', prompt: 'What is the capital of Japan?' },
  ];

  return (
    <div className="domain-presets-bar">
      <div className="presets-scroll-wrapper">
        <span className="presets-title"><Sparkles size={14} /> Quick Workbench Scenarios:</span>
        {presets.map((preset, idx) => {
          const IconComp = preset.icon;
          return (
            <button
              key={idx}
              className="preset-chip"
              onClick={() => onSelectPreset(preset.prompt)}
              title={`Test prompt: "${preset.prompt}"`}
            >
              <IconComp size={13} />
              <span>{preset.label}</span>
              <span className="preset-cat">{preset.category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
