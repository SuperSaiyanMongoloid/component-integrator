import React, { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface BezierEditorProps {
  originalValue: [number, number, number, number];
  editedValue: [number, number, number, number];
  onChange: (value: [number, number, number, number]) => void;
  progress?: number;
  className?: string;
}

const PRESETS: { name: string; value: [number, number, number, number] }[] = [
  { name: 'Linear', value: [0, 0, 1, 1] },
  { name: 'Ease', value: [0.25, 0.1, 0.25, 1] },
  { name: 'Ease In', value: [0.42, 0, 1, 1] },
  { name: 'Ease Out', value: [0, 0, 0.58, 1] },
  { name: 'Ease In Out', value: [0.42, 0, 0.58, 1] },
  { name: 'Bounce', value: [0.68, -0.55, 0.265, 1.55] },
  { name: 'Elastic', value: [0.68, -0.6, 0.32, 1.6] },
];

// Calculate Y value on bezier curve at given X (t parameter)
function getBezierY(t: number, p1y: number, p2y: number): number {
  const mt = 1 - t;
  return 3 * mt * mt * t * p1y + 3 * mt * t * t * p2y + t * t * t;
}

export function BezierEditor({ 
  originalValue, 
  editedValue, 
  onChange, 
  progress = 0,
  className 
}: BezierEditorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<'p1' | 'p2' | null>(null);
  const [x1, y1, x2, y2] = editedValue;
  const [ox1, oy1, ox2, oy2] = originalValue;

  const size = 240;
  const padding = 24;
  const graphSize = size - padding * 2;

  const toSvgX = (v: number) => padding + v * graphSize;
  const toSvgY = (v: number) => size - padding - v * graphSize;
  const fromSvgX = (x: number) => Math.max(0, Math.min(1, (x - padding) / graphSize));
  const fromSvgY = (y: number) => Math.max(-0.5, Math.min(1.5, (size - padding - y) / graphSize));

  const handleMouseDown = (point: 'p1' | 'p2') => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(point);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragging || !svgRef.current) return;
    
    const rect = svgRef.current.getBoundingClientRect();
    const x = fromSvgX(e.clientX - rect.left);
    const y = fromSvgY(e.clientY - rect.top);
    
    if (dragging === 'p1') {
      onChange([x, y, x2, y2]);
    } else {
      onChange([x1, y1, x, y]);
    }
  }, [dragging, x1, y1, x2, y2, onChange]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  const originalPath = `M ${toSvgX(0)} ${toSvgY(0)} C ${toSvgX(ox1)} ${toSvgY(oy1)}, ${toSvgX(ox2)} ${toSvgY(oy2)}, ${toSvgX(1)} ${toSvgY(1)}`;
  const editedPath = `M ${toSvgX(0)} ${toSvgY(0)} C ${toSvgX(x1)} ${toSvgY(y1)}, ${toSvgX(x2)} ${toSvgY(y2)}, ${toSvgX(1)} ${toSvgY(1)}`;

  // Calculate progress dots on both curves
  const originalProgressY = getBezierY(progress, oy1, oy2);
  const editedProgressY = getBezierY(progress, y1, y2);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Presets */}
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onChange(preset.value)}
            className={cn(
              "px-2 py-1 text-xs rounded-md transition-colors",
              JSON.stringify(editedValue) === JSON.stringify(preset.value)
                ? "bg-neutral-600 text-white"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300"
            )}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Graph */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-2">
        <svg
          ref={svgRef}
          width={size}
          height={size}
          className="cursor-crosshair"
        >
          {/* Grid */}
          <defs>
            <pattern id="studio-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#2a2a2a" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect x={padding} y={padding} width={graphSize} height={graphSize} fill="url(#studio-grid)" />
          
          {/* Axes */}
          <line x1={padding} y1={size - padding} x2={size - padding} y2={size - padding} stroke="#404040" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={size - padding} stroke="#404040" strokeWidth="1" />
          
          {/* Diagonal reference (linear) */}
          <line 
            x1={toSvgX(0)} y1={toSvgY(0)} 
            x2={toSvgX(1)} y2={toSvgY(1)} 
            stroke="#333" strokeWidth="1" strokeDasharray="4" 
          />

          {/* Progress vertical line */}
          {progress > 0 && (
            <line
              x1={toSvgX(progress)}
              y1={toSvgY(0)}
              x2={toSvgX(progress)}
              y2={toSvgY(1)}
              stroke="#555"
              strokeWidth="1"
              strokeDasharray="2"
            />
          )}
          
          {/* Original curve (dimmed) */}
          <path d={originalPath} fill="none" stroke="#555" strokeWidth="1.5" strokeDasharray="4" />
          
          {/* Edited control lines */}
          <line x1={toSvgX(0)} y1={toSvgY(0)} x2={toSvgX(x1)} y2={toSvgY(y1)} stroke="#888" strokeWidth="1" />
          <line x1={toSvgX(1)} y1={toSvgY(1)} x2={toSvgX(x2)} y2={toSvgY(y2)} stroke="#888" strokeWidth="1" />
          
          {/* Edited curve */}
          <path d={editedPath} fill="none" stroke="#fff" strokeWidth="2" />
          
          {/* Start/End points */}
          <circle cx={toSvgX(0)} cy={toSvgY(0)} r="4" fill="#666" />
          <circle cx={toSvgX(1)} cy={toSvgY(1)} r="4" fill="#666" />

          {/* Progress dots */}
          {progress > 0 && progress < 1 && (
            <>
              <circle
                cx={toSvgX(progress)}
                cy={toSvgY(originalProgressY)}
                r="5"
                fill="#555"
                stroke="#333"
                strokeWidth="1"
              />
              <circle
                cx={toSvgX(progress)}
                cy={toSvgY(editedProgressY)}
                r="6"
                fill="#fff"
                stroke="#000"
                strokeWidth="2"
              />
            </>
          )}
          
          {/* Control points (draggable) */}
          <circle
            cx={toSvgX(x1)}
            cy={toSvgY(y1)}
            r="8"
            fill="#fff"
            stroke="#333"
            strokeWidth="2"
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown('p1')}
          />
          <circle
            cx={toSvgX(x2)}
            cy={toSvgY(y2)}
            r="8"
            fill="#fff"
            stroke="#333"
            strokeWidth="2"
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown('p2')}
          />
        </svg>
      </div>

      {/* Numeric inputs */}
      <div className="grid grid-cols-4 gap-2">
        {(['x1', 'y1', 'x2', 'y2'] as const).map((key, i) => (
          <div key={key} className="space-y-1">
            <label className="text-[10px] text-neutral-500 uppercase">{key}</label>
            <input
              type="number"
              step="0.01"
              min={i % 2 === 0 ? 0 : -0.5}
              max={i % 2 === 0 ? 1 : 1.5}
              value={editedValue[i].toFixed(2)}
              onChange={(e) => {
                const newValue = [...editedValue] as [number, number, number, number];
                newValue[i] = parseFloat(e.target.value) || 0;
                onChange(newValue);
              }}
              className="w-full px-2 py-1.5 text-sm font-mono bg-neutral-800 border border-neutral-700 rounded-md text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-600"
            />
          </div>
        ))}
      </div>

      {/* CSS output */}
      <div className="text-xs font-mono text-neutral-500 bg-neutral-900 px-3 py-2 rounded-md border border-neutral-800">
        cubic-bezier({editedValue.map(v => v.toFixed(2)).join(', ')})
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-neutral-500 rounded" style={{ borderStyle: 'dashed' }} />
          <span>Original</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-white rounded" />
          <span>Edited</span>
        </div>
      </div>
    </div>
  );
}
