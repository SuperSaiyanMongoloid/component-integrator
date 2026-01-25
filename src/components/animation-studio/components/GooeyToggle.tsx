import React from 'react';
import { cn } from '@/lib/utils';
import type { AnimatableComponentProps } from '../types';

/**
 * Gooey Toggle component for use in Animation Studio
 * Supports progress-based animation state for frame-by-frame control
 */
export function GooeyToggle({ 
  checked, 
  progress,
  colors,
  animation,
  isEdited = false,
  disabled = false,
}: AnimatableComponentProps) {
  const bezierStr = `cubic-bezier(${animation.bezier.join(',')})`;
  const durationMs = animation.duration;

  // Calculate interpolated states based on progress
  // For non-playing state, use checked directly
  // For playing state, progress determines the visual state
  const visualProgress = progress;
  
  // Circle transforms based on progress
  const leftCircleScale = checked ? Math.max(0, 1 - visualProgress * 2) : Math.min(1, visualProgress * 2 + (visualProgress > 0.5 ? 0 : 1 - visualProgress * 2));
  const leftCircleX = checked ? Math.min(12, visualProgress * 24) : Math.max(0, (1 - visualProgress) * 12 - 12);
  
  const rightCircleScale = checked ? Math.min(1, visualProgress * 2) : Math.max(0, 1 - visualProgress * 2);
  const rightCircleX = checked ? Math.max(-12, -12 + visualProgress * 12) : Math.min(0, (visualProgress - 1) * 12);

  const knobColor = colors.knob || '#ffffff';
  const activeColor = colors.active || '#275EFE';
  const defaultColor = colors.default || '#3a3a3a';

  return (
    <div 
      className={cn(
        "relative block h-8 w-[52px] [transform:translateZ(0)] [-webkit-transform:translateZ(0)] [backface-visibility:hidden]",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
      aria-disabled={disabled}
    >
      <div 
        className="h-full w-full rounded-full transition-colors [transform:translate3d(0,0,0)]"
        style={{
          backgroundColor: checked ? activeColor : defaultColor,
          transitionDuration: `${durationMs}ms`,
          transitionTimingFunction: bezierStr,
        }}
      />
      <svg
        viewBox="0 0 52 32"
        filter={`url(#goo-studio-${isEdited ? 'edited' : 'original'})`}
        className="pointer-events-none absolute inset-0 [transform:translate3d(0,0,0)]"
        style={{ fill: knobColor }}
      >
        <circle
          cx="16"
          cy="16"
          r="10"
          className="transform-gpu [backface-visibility:hidden]"
          style={{
            transformOrigin: '16px 16px',
            transform: `translateX(${checked ? '12px' : '0px'}) scale(${checked ? '0' : '1'})`,
            transition: `transform ${durationMs}ms ${bezierStr}`,
          }}
        />
        <circle
          cx="36"
          cy="16"
          r="10"
          className="transform-gpu [backface-visibility:hidden]"
          style={{
            transformOrigin: '36px 16px',
            transform: `translateX(${checked ? '0px' : '-12px'}) scale(${checked ? '1' : '0'})`,
            transition: `transform ${durationMs}ms ${bezierStr}`,
          }}
        />
        {checked && (
          <circle
            cx="35"
            cy="-1"
            r="2.5"
            className="transform-gpu"
            style={{
              transition: `transform ${durationMs * 1.4}ms ${bezierStr}`,
            }}
          />
        )}
      </svg>
    </div>
  );
}

export function StudioGooeyFilters() {
  return (
    <svg className="fixed w-0 h-0 pointer-events-none">
      <defs>
        <filter id="goo-studio-original">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
        <filter id="goo-studio-edited">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}
