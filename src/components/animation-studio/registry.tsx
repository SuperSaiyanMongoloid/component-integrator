import React from 'react';
import { GooeyToggle, StudioGooeyFilters } from './components/GooeyToggle';
import { GooeyCheckbox, CheckboxGooeyFilters } from './components/GooeyCheckbox';
import type { AnimatableComponent, ColorConfig, AnimatableComponentProps } from './types';

// Component Registry
export const COMPONENT_REGISTRY: Record<string, AnimatableComponent> = {
  'gooey-toggle': {
    id: 'gooey-toggle',
    name: 'Gooey Toggle',
    description: 'Liquid toggle switch with morphing animation',
    component: GooeyToggle,
    defaultColors: {
      active: '#275EFE',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      default: '#3a3a3a',
      defaultHover: '#4a4a4a',
      knob: '#ffffff',
    },
    animatableProperties: [
      { key: 'duration', label: 'Duration', type: 'duration', defaultValue: 500 },
      { key: 'bezier', label: 'Easing', type: 'bezier', defaultValue: [0.25, 0.1, 0.25, 1] },
    ],
  },
  'gooey-checkbox': {
    id: 'gooey-checkbox',
    name: 'Gooey Checkbox',
    description: 'Checkbox with morphing checkmark animation',
    component: GooeyCheckbox,
    defaultColors: {
      active: '#275EFE',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      default: '#3a3a3a',
      defaultHover: '#4a4a4a',
      knob: '#ffffff',
    },
    animatableProperties: [
      { key: 'duration', label: 'Duration', type: 'duration', defaultValue: 400 },
      { key: 'bezier', label: 'Easing', type: 'bezier', defaultValue: [0.68, -0.55, 0.265, 1.55] },
    ],
  },
};

// All SVG filters needed for registered components
export function AllGooeyFilters() {
  return (
    <>
      <StudioGooeyFilters />
      <CheckboxGooeyFilters />
    </>
  );
}

// Helper to get component by ID
export function getComponent(id: string): AnimatableComponent | undefined {
  return COMPONENT_REGISTRY[id];
}

// Get all registered component IDs
export function getComponentIds(): string[] {
  return Object.keys(COMPONENT_REGISTRY);
}
