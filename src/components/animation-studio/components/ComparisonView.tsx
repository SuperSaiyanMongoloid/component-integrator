import React from 'react';
import { cn } from '@/lib/utils';
import type { AnimatableComponentProps, ColorConfig } from '../types';

interface ComparisonViewProps {
  component: React.ComponentType<AnimatableComponentProps>;
  checked: boolean;
  progress: number;
  originalAnimation: {
    duration: number;
    bezier: [number, number, number, number];
  };
  editedAnimation: {
    duration: number;
    bezier: [number, number, number, number];
  };
  originalColors: Partial<ColorConfig>;
  editedColors: Partial<ColorConfig>;
  className?: string;
}

export function ComparisonView({
  component: Component,
  checked,
  progress,
  originalAnimation,
  editedAnimation,
  originalColors,
  editedColors,
  className,
}: ComparisonViewProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-8", className)}>
      {/* Original */}
      <div className="flex flex-col items-center">
        <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4">
          Original
        </div>
        <div className="flex-1 flex items-center justify-center p-8 bg-neutral-900 rounded-xl border border-neutral-800 min-h-[160px]">
          <div className="scale-[2]">
            <Component
              checked={checked}
              progress={progress}
              colors={originalColors}
              animation={originalAnimation}
              isEdited={false}
            />
          </div>
        </div>
      </div>

      {/* Edited */}
      <div className="flex flex-col items-center">
        <div className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
          Edited
        </div>
        <div className="flex-1 flex items-center justify-center p-8 bg-neutral-900 rounded-xl border border-neutral-700 min-h-[160px] ring-1 ring-neutral-600">
          <div className="scale-[2]">
            <Component
              checked={checked}
              progress={progress}
              colors={editedColors}
              animation={editedAnimation}
              isEdited={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
