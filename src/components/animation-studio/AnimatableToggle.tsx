"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatableToggleProps {
  checked: boolean;
  disabled?: boolean;
  colors: {
    active: string;
    default: string;
    defaultDark: string;
  };
  animation: {
    duration: number;
    bezier: [number, number, number, number];
  };
  className?: string;
}

export function AnimatableToggle({ 
  checked, 
  disabled = false,
  colors,
  animation,
  className 
}: AnimatableToggleProps) {
  const bezierStr = `cubic-bezier(${animation.bezier.join(',')})`;
  const durationMs = animation.duration;

  return (
    <div 
      className={cn(
        "relative block h-8 w-[52px] [transform:translateZ(0)] [-webkit-transform:translateZ(0)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [perspective:1000] [-webkit-perspective:1000]",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      style={{
        '--c-active': colors.active,
        '--c-default': colors.default,
        '--c-default-dark': colors.defaultDark,
      } as React.CSSProperties}
      aria-disabled={disabled}
    >
      <div 
        className="h-full w-full rounded-full transition-colors [transform:translate3d(0,0,0)] [-webkit-transform:translate3d(0,0,0)]"
        style={{
          backgroundColor: checked ? colors.active : colors.default,
          transitionDuration: `${durationMs}ms`,
          transitionTimingFunction: bezierStr,
        }}
      />
      <svg
        viewBox="0 0 52 32"
        filter="url(#goo-studio)"
        className="pointer-events-none absolute inset-0 fill-white [transform:translate3d(0,0,0)] [-webkit-transform:translate3d(0,0,0)]"
      >
        <circle
          cx="16"
          cy="16"
          r="10"
          className="transform-gpu [transform:translate3d(0,0,0)] [-webkit-transform:translate3d(0,0,0)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
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
          className="transform-gpu [transform:translate3d(0,0,0)] [-webkit-transform:translate3d(0,0,0)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
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
            className="transform-gpu [transform:translate3d(0,0,0)] [-webkit-transform:translate3d(0,0,0)]"
            style={{
              transition: `transform ${durationMs * 1.4}ms ${bezierStr}`,
            }}
          />
        )}
      </svg>
    </div>
  );
}

export function StudioGooeyFilter() {
  return (
    <svg className="fixed w-0 h-0">
      <defs>
        <filter id="goo-studio">
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
