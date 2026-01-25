import React from 'react';
import { Infinity as InfinityIcon, Zap, ZapOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ColorPicker } from '../ColorPicker';
import type { AnimationConfig, ColorConfig, ActiveVariant } from '../types';

interface ControlPanelProps {
  config: AnimationConfig;
  colors: ColorConfig;
  activeVariant: ActiveVariant;
  onConfigChange: <K extends keyof AnimationConfig>(key: K, value: AnimationConfig[K]) => void;
  onColorChange: <K extends keyof ColorConfig>(key: K, value: string) => void;
  onVariantChange: (variant: ActiveVariant) => void;
  className?: string;
}

const SPEED_PRESETS = [
  { label: '0.1x', value: 0.1 },
  { label: '0.25x', value: 0.25 },
  { label: '0.5x', value: 0.5 },
  { label: '1x', value: 1 },
  { label: '2x', value: 2 },
  { label: '4x', value: 4 },
];

export function ControlPanel({
  config,
  colors,
  activeVariant,
  onConfigChange,
  onColorChange,
  onVariantChange,
  className,
}: ControlPanelProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Playback Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Playback</h3>
        
        {/* Loop Mode */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-300">Loop Mode</span>
          <button
            onClick={() => onConfigChange('infiniteLoop', !config.infiniteLoop)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-colors",
              config.infiniteLoop
                ? "bg-neutral-600 text-white"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
            )}
          >
            <InfinityIcon className="w-3.5 h-3.5" />
            {config.infiniteLoop ? 'Infinite' : 'Finite'}
          </button>
        </div>

        {/* Toggle Count */}
        {!config.infiniteLoop && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-300">Toggle Count</span>
              <span className="text-xs font-mono text-neutral-500">{config.toggleCount}x</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 4, 8, 16].map((n) => (
                <button
                  key={n}
                  onClick={() => onConfigChange('toggleCount', n)}
                  className={cn(
                    "flex-1 py-1.5 text-xs rounded-md transition-colors",
                    config.toggleCount === n
                      ? "bg-neutral-600 text-white"
                      : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                  )}
                >
                  {n}x
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Delay */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-300">Delay Between</span>
            <span className="text-xs font-mono text-neutral-500">{config.delay}ms</span>
          </div>
          <input
            type="range"
            min="0"
            max="2000"
            step="50"
            value={config.delay}
            onChange={(e) => onConfigChange('delay', parseInt(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
          <div className="flex gap-1">
            {[0, 250, 500, 1000].map((ms) => (
              <button
                key={ms}
                onClick={() => onConfigChange('delay', ms)}
                className={cn(
                  "flex-1 py-1 text-xs rounded-md transition-colors",
                  config.delay === ms
                    ? "bg-neutral-600 text-white"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                )}
              >
                {ms}ms
              </button>
            ))}
          </div>
        </div>

        {/* Speed */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-300 flex items-center gap-2">
              {config.speed < 1 ? <ZapOff className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
              Speed
            </span>
            <span className="text-xs font-mono text-neutral-500">{config.speed}x</span>
          </div>
          <div className="flex gap-1">
            {SPEED_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => onConfigChange('speed', preset.value)}
                className={cn(
                  "flex-1 py-1 text-xs rounded-md transition-colors",
                  config.speed === preset.value
                    ? "bg-neutral-600 text-white"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timing Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Timing</h3>
        
        {/* Duration */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-300">Duration</span>
            <input
              type="number"
              min="100"
              max="3000"
              step="50"
              value={config.duration}
              onChange={(e) => onConfigChange('duration', parseInt(e.target.value) || 500)}
              className="w-20 px-2 py-1 text-xs font-mono bg-neutral-800 border border-neutral-700 rounded-md text-neutral-200 text-right focus:outline-none focus:ring-1 focus:ring-neutral-600"
            />
          </div>
          <input
            type="range"
            min="100"
            max="3000"
            step="50"
            value={config.duration}
            onChange={(e) => onConfigChange('duration', parseInt(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
          <div className="flex gap-1">
            {[200, 300, 500, 700, 1000].map((ms) => (
              <button
                key={ms}
                onClick={() => onConfigChange('duration', ms)}
                className={cn(
                  "flex-1 py-1 text-xs rounded-md transition-colors",
                  config.duration === ms
                    ? "bg-neutral-600 text-white"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                )}
              >
                {ms}ms
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Colors Section */}
      <div className="space-y-4">
        <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">Colors</h3>
        
        {/* Variant Selector */}
        <div className="space-y-2">
          <span className="text-sm text-neutral-300">Active Variant</span>
          <div className="flex gap-1">
            {(['active', 'success', 'warning', 'danger'] as const).map((variant) => (
              <button
                key={variant}
                onClick={() => onVariantChange(variant)}
                className={cn(
                  "flex-1 py-1.5 text-xs rounded-md transition-all capitalize",
                  activeVariant === variant
                    ? "ring-1 ring-neutral-500"
                    : "opacity-60 hover:opacity-100"
                )}
                style={{
                  backgroundColor: colors[variant],
                  color: '#fff',
                }}
              >
                {variant}
              </button>
            ))}
          </div>
        </div>

        {/* Color Pickers */}
        <div className="space-y-3">
          <ColorPicker
            label="Active"
            value={colors.active}
            onChange={(v) => onColorChange('active', v)}
          />
          <ColorPicker
            label="Success"
            value={colors.success}
            onChange={(v) => onColorChange('success', v)}
          />
          <ColorPicker
            label="Warning"
            value={colors.warning}
            onChange={(v) => onColorChange('warning', v)}
          />
          <ColorPicker
            label="Danger"
            value={colors.danger}
            onChange={(v) => onColorChange('danger', v)}
          />
          <ColorPicker
            label="Default"
            value={colors.default}
            onChange={(v) => onColorChange('default', v)}
          />
          <ColorPicker
            label="Default Hover"
            value={colors.defaultHover}
            onChange={(v) => onColorChange('defaultHover', v)}
          />
          <ColorPicker
            label="Knob"
            value={colors.knob}
            onChange={(v) => onColorChange('knob', v)}
          />
        </div>
      </div>
    </div>
  );
}
