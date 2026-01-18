"use client";

import React from 'react';
import { cn } from '@/lib/utils';

const styles = {
  switch: `relative block cursor-pointer h-8 w-[52px]
    [transform:translateZ(0)]
    [-webkit-transform:translateZ(0)]
    [backface-visibility:hidden]
    [-webkit-backface-visibility:hidden]
    [perspective:1000]
    [-webkit-perspective:1000]`,
  switchDisabled: `opacity-50 cursor-not-allowed pointer-events-none`,
  input: `h-full w-full cursor-pointer appearance-none rounded-full
    bg-toggle-default outline-none transition-colors duration-500
    hover:bg-toggle-default-hover
    [transform:translate3d(0,0,0)]
    [-webkit-transform:translate3d(0,0,0)]
    data-[checked=true]:bg-[--c-background]`,
  svg: `pointer-events-none absolute inset-0 fill-toggle-knob
    [transform:translate3d(0,0,0)]
    [-webkit-transform:translate3d(0,0,0)]`,
  circle: `transform-gpu transition-transform duration-500
    [transform:translate3d(0,0,0)]
    [-webkit-transform:translate3d(0,0,0)]
    [backface-visibility:hidden]
    [-webkit-backface-visibility:hidden]`,
  dropCircle: `transform-gpu transition-transform duration-700
    [transform:translate3d(0,0,0)]
    [-webkit-transform:translate3d(0,0,0)]`
};

const variantStyles = {
  default: '[--c-background:hsl(var(--toggle-active))]',
  success: '[--c-background:hsl(var(--toggle-success))]',
  warning: '[--c-background:hsl(var(--toggle-warning))]',
  danger: '[--c-background:hsl(var(--toggle-danger))]',
};

interface ToggleProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  disabled?: boolean;
}

export function Toggle({ 
  checked = false, 
  onCheckedChange, 
  className,
  variant = 'default',
  disabled = false
}: ToggleProps) {
  const [isChecked, setIsChecked] = React.useState(checked);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    setIsChecked(e.target.checked);
    onCheckedChange?.(e.target.checked);
  };

  return (
    <label 
      className={cn(
        styles.switch, 
        disabled && styles.switchDisabled,
        className
      )}
      aria-disabled={disabled}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        data-checked={isChecked}
        className={cn(styles.input, variantStyles[variant])}
      />
      <svg
        viewBox="0 0 52 32"
        filter="url(#goo)"
        className={styles.svg}
      >
        <circle
          className={styles.circle}
          cx="16"
          cy="16"
          r="10"
          style={{
            transformOrigin: '16px 16px',
            transform: `translateX(${isChecked ? '12px' : '0px'}) scale(${isChecked ? '0' : '1'})`,
          }}
        />
        <circle
          className={styles.circle}
          cx="36"
          cy="16"
          r="10"
          style={{
            transformOrigin: '36px 16px',
            transform: `translateX(${isChecked ? '0px' : '-12px'}) scale(${isChecked ? '1' : '0'})`,
          }}
        />
        {isChecked && (
          <circle
            className={styles.dropCircle}
            cx="35"
            cy="-1"
            r="2.5"
          />
        )}
      </svg>
    </label>
  );
}

export function GooeyFilter() {
  return (
    <svg className="fixed w-0 h-0">
      <defs>
        <filter id="goo">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="2"
            result="blur"
          />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="goo"
          />
          <feComposite
            in="SourceGraphic"
            in2="goo"
            operator="atop"
          />
        </filter>
      </defs>
    </svg>
  );
}
