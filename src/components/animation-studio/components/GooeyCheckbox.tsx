import React from 'react';
import { cn } from '@/lib/utils';
import type { AnimatableComponentProps } from '../types';

/**
 * Gooey Checkbox component for use in Animation Studio
 * Features a morphing checkmark with gooey effect
 */
export function GooeyCheckbox({ 
  checked, 
  progress,
  colors,
  animation,
  isEdited = false,
  disabled = false,
}: AnimatableComponentProps) {
  const bezierStr = `cubic-bezier(${animation.bezier.join(',')})`;
  const durationMs = animation.duration;

  const knobColor = colors.knob || '#ffffff';
  const activeColor = colors.active || '#275EFE';
  const defaultColor = colors.default || '#3a3a3a';

  return (
    <div 
      className={cn(
        "relative block h-7 w-7 [transform:translateZ(0)] [-webkit-transform:translateZ(0)] [backface-visibility:hidden]",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
      aria-disabled={disabled}
    >
      {/* Background box */}
      <div 
        className="absolute inset-0 rounded-lg transition-colors [transform:translate3d(0,0,0)]"
        style={{
          backgroundColor: checked ? activeColor : defaultColor,
          transitionDuration: `${durationMs}ms`,
          transitionTimingFunction: bezierStr,
        }}
      />
      
      {/* Checkmark SVG with gooey filter */}
      <svg
        viewBox="0 0 28 28"
        filter={`url(#goo-checkbox-${isEdited ? 'edited' : 'original'})`}
        className="absolute inset-0 w-full h-full pointer-events-none [transform:translate3d(0,0,0)]"
      >
        {/* Checkmark path - morphs in with gooey effect */}
        <g
          style={{
            transform: `scale(${checked ? 1 : 0})`,
            transformOrigin: 'center',
            transition: `transform ${durationMs}ms ${bezierStr}`,
          }}
        >
          {/* Main checkmark blob */}
          <circle
            cx="10"
            cy="16"
            r="3"
            fill={knobColor}
            style={{
              transform: `translateX(${checked ? '0' : '-4px'})`,
              transition: `transform ${durationMs}ms ${bezierStr}`,
            }}
          />
          <circle
            cx="13"
            cy="18"
            r="2.5"
            fill={knobColor}
            style={{
              transform: `translate(${checked ? '0, 0' : '-2px, -2px'})`,
              transition: `transform ${durationMs * 1.1}ms ${bezierStr}`,
            }}
          />
          <circle
            cx="16"
            cy="14"
            r="2.5"
            fill={knobColor}
            style={{
              transform: `translate(${checked ? '0, 0' : '2px, 2px'})`,
              transition: `transform ${durationMs * 0.9}ms ${bezierStr}`,
            }}
          />
          <circle
            cx="19"
            cy="11"
            r="2"
            fill={knobColor}
            style={{
              transform: `translate(${checked ? '0, 0' : '4px, 4px'})`,
              transition: `transform ${durationMs * 0.8}ms ${bezierStr}`,
            }}
          />
        </g>
        
        {/* Decorative splash circles */}
        {checked && (
          <>
            <circle
              cx="6"
              cy="10"
              r="1.5"
              fill={knobColor}
              style={{
                opacity: checked ? 0.6 : 0,
                transform: `scale(${checked ? 1 : 0})`,
                transformOrigin: 'center',
                transition: `all ${durationMs * 1.2}ms ${bezierStr}`,
              }}
            />
            <circle
              cx="22"
              cy="8"
              r="1"
              fill={knobColor}
              style={{
                opacity: checked ? 0.4 : 0,
                transform: `scale(${checked ? 1 : 0})`,
                transformOrigin: 'center',
                transition: `all ${durationMs * 1.3}ms ${bezierStr}`,
              }}
            />
          </>
        )}
      </svg>
    </div>
  );
}

export function CheckboxGooeyFilters() {
  return (
    <svg className="fixed w-0 h-0 pointer-events-none">
      <defs>
        <filter id="goo-checkbox-original">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
        <filter id="goo-checkbox-edited">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}
