import React, { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface BezierCurveEditorProps {
  value: [number, number, number, number];
  onChange: (value: [number, number, number, number]) => void;
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

export function BezierCurveEditor({ value, onChange, className }: BezierCurveEditorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState<'p1' | 'p2' | null>(null);
  const [x1, y1, x2, y2] = value;

  const size = 200;
  const padding = 20;
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

  const pathD = `M ${toSvgX(0)} ${toSvgY(0)} C ${toSvgX(x1)} ${toSvgY(y1)}, ${toSvgX(x2)} ${toSvgY(y2)}, ${toSvgX(1)} ${toSvgY(1)}`;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onChange(preset.value)}
            className={cn(
              "px-2 py-1 text-xs rounded-md border transition-colors",
              JSON.stringify(value) === JSON.stringify(preset.value)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 border-border hover:bg-muted"
            )}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <div className="relative bg-muted/30 rounded-lg border border-border overflow-hidden">
        <svg
          ref={svgRef}
          width={size}
          height={size}
          className="cursor-crosshair"
        >
          {/* Grid */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect x={padding} y={padding} width={graphSize} height={graphSize} fill="url(#grid)" />
          
          {/* Axes */}
          <line x1={padding} y1={size - padding} x2={size - padding} y2={size - padding} stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={size - padding} stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
          
          {/* Diagonal reference */}
          <line x1={toSvgX(0)} y1={toSvgY(0)} x2={toSvgX(1)} y2={toSvgY(1)} stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="4" opacity="0.5" />
          
          {/* Control lines */}
          <line x1={toSvgX(0)} y1={toSvgY(0)} x2={toSvgX(x1)} y2={toSvgY(y1)} stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.6" />
          <line x1={toSvgX(1)} y1={toSvgY(1)} x2={toSvgX(x2)} y2={toSvgY(y2)} stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.6" />
          
          {/* Bezier curve */}
          <path d={pathD} fill="none" stroke="hsl(var(--primary))" strokeWidth="2.5" />
          
          {/* Start/End points */}
          <circle cx={toSvgX(0)} cy={toSvgY(0)} r="4" fill="hsl(var(--foreground))" />
          <circle cx={toSvgX(1)} cy={toSvgY(1)} r="4" fill="hsl(var(--foreground))" />
          
          {/* Control points */}
          <circle
            cx={toSvgX(x1)}
            cy={toSvgY(y1)}
            r="8"
            fill="hsl(var(--primary))"
            stroke="hsl(var(--background))"
            strokeWidth="2"
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown('p1')}
          />
          <circle
            cx={toSvgX(x2)}
            cy={toSvgY(y2)}
            r="8"
            fill="hsl(var(--primary))"
            stroke="hsl(var(--background))"
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
            <label className="text-xs text-muted-foreground uppercase">{key}</label>
            <input
              type="number"
              step="0.01"
              min={i % 2 === 0 ? 0 : -0.5}
              max={i % 2 === 0 ? 1 : 1.5}
              value={value[i].toFixed(2)}
              onChange={(e) => {
                const newValue = [...value] as [number, number, number, number];
                newValue[i] = parseFloat(e.target.value) || 0;
                onChange(newValue);
              }}
              className="w-full px-2 py-1.5 text-sm bg-muted/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground font-mono bg-muted/30 px-3 py-2 rounded-md">
        cubic-bezier({value.map(v => v.toFixed(2)).join(', ')})
      </div>
    </div>
  );
}
