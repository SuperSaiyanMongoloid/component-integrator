// Core types for the Animation Studio

export interface AnimationConfig {
  duration: number;
  delay: number;
  toggleCount: number;
  infiniteLoop: boolean;
  bezier: [number, number, number, number];
  speed: number;
}

export interface ColorConfig {
  active: string;
  success: string;
  warning: string;
  danger: string;
  default: string;
  defaultHover: string;
  knob: string;
}

export const DEFAULT_ANIMATION: AnimationConfig = {
  duration: 500,
  delay: 500,
  toggleCount: 2,
  infiniteLoop: false,
  bezier: [0.25, 0.1, 0.25, 1],
  speed: 1,
};

export const DEFAULT_COLORS: ColorConfig = {
  active: '#275EFE',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  default: '#3a3a3a',
  defaultHover: '#4a4a4a',
  knob: '#ffffff',
};

export type ActiveVariant = 'active' | 'success' | 'warning' | 'danger';

// Component registry types
export interface AnimatableComponent {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<AnimatableComponentProps>;
  defaultColors: ColorConfig;
  animatableProperties: AnimatableProperty[];
}

export interface AnimatableComponentProps {
  checked: boolean;
  progress: number; // 0-1 normalized progress through animation
  colors: Partial<ColorConfig>;
  animation: {
    duration: number;
    bezier: [number, number, number, number];
  };
  isEdited?: boolean;
  disabled?: boolean;
}

export interface AnimatableProperty {
  key: string;
  label: string;
  type: 'bezier' | 'duration' | 'color' | 'number';
  defaultValue: unknown;
}
