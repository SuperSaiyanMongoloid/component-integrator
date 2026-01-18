"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Infinity as InfinityIcon, Zap, ZapOff } from 'lucide-react';
import { AnimatableToggle, StudioGooeyFilter } from './AnimatableToggle';
import { BezierCurveEditor } from './BezierCurveEditor';
import { ColorPicker } from './ColorPicker';
import { cn } from '@/lib/utils';

interface AnimationConfig {
  duration: number;
  delay: number;
  toggleCount: number;
  infiniteLoop: boolean;
  bezier: [number, number, number, number];
  speed: number;
}

interface ColorConfig {
  active: string;
  success: string;
  warning: string;
  danger: string;
  default: string;
  defaultDark: string;
}

const DEFAULT_ANIMATION: AnimationConfig = {
  duration: 500,
  delay: 500,
  toggleCount: 2,
  infiniteLoop: false,
  bezier: [0.25, 0.1, 0.25, 1],
  speed: 1,
};

const DEFAULT_COLORS: ColorConfig = {
  active: '#275EFE',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  default: '#D2D6E9',
  defaultDark: '#C7CBDF',
};

type ActiveVariant = 'active' | 'success' | 'warning' | 'danger';

export function AnimationStudio() {
  const [config, setConfig] = useState<AnimationConfig>(DEFAULT_ANIMATION);
  const [colors, setColors] = useState<ColorConfig>(DEFAULT_COLORS);
  const [activeVariant, setActiveVariant] = useState<ActiveVariant>('active');
  const [isPlaying, setIsPlaying] = useState(false);
  const [toggleState, setToggleState] = useState(false);
  const [currentToggle, setCurrentToggle] = useState(0);
  const [activeTab, setActiveTab] = useState<'playback' | 'timing' | 'colors'>('playback');
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const effectiveDuration = config.duration / config.speed;
  const effectiveDelay = config.delay / config.speed;

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const runAnimation = useCallback(() => {
    clearTimers();
    setCurrentToggle(0);
    
    const totalToggles = config.infiniteLoop ? Infinity : config.toggleCount;
    let count = 0;

    const doToggle = () => {
      if (!config.infiniteLoop && count >= totalToggles) {
        setIsPlaying(false);
        return;
      }
      
      setToggleState(prev => !prev);
      count++;
      setCurrentToggle(count);

      if (config.infiniteLoop || count < totalToggles) {
        timeoutRef.current = setTimeout(doToggle, effectiveDuration + effectiveDelay);
      } else {
        timeoutRef.current = setTimeout(() => setIsPlaying(false), effectiveDuration);
      }
    };

    doToggle();
  }, [config.infiniteLoop, config.toggleCount, effectiveDuration, effectiveDelay, clearTimers]);

  useEffect(() => {
    if (isPlaying) {
      runAnimation();
    } else {
      clearTimers();
    }
    return clearTimers;
  }, [isPlaying, runAnimation, clearTimers]);

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setToggleState(false);
    setCurrentToggle(0);
    clearTimers();
  };

  const updateConfig = <K extends keyof AnimationConfig>(key: K, value: AnimationConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateColor = <K extends keyof ColorConfig>(key: K, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const getActiveColor = () => colors[activeVariant];

  const speedPresets = [
    { label: '0.1x', value: 0.1 },
    { label: '0.25x', value: 0.25 },
    { label: '0.5x', value: 0.5 },
    { label: '1x', value: 1 },
    { label: '2x', value: 2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <StudioGooeyFilter />
      
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Animation Studio</h1>
          <p className="text-muted-foreground">Fine-tune every aspect of the liquid toggle animation</p>
        </div>

        <div className="grid lg:grid-cols-[1fr,380px] gap-8">
          {/* Preview Area */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
              <div className="scale-[2.5] mb-8">
                <AnimatableToggle
                  checked={toggleState}
                  colors={{
                    active: getActiveColor(),
                    default: colors.default,
                    defaultDark: colors.defaultDark,
                  }}
                  animation={{
                    duration: effectiveDuration,
                    bezier: config.bezier,
                  }}
                />
              </div>
              
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={handlePlay}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all",
                    isPlaying 
                      ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-muted/50 hover:bg-muted transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-6 text-sm text-muted-foreground">
                <div>
                  Toggle count: <span className="font-mono text-foreground">{currentToggle}</span>
                  {config.infiniteLoop && ' / ∞'}
                  {!config.infiniteLoop && ` / ${config.toggleCount}`}
                </div>
                <div>
                  Speed: <span className="font-mono text-foreground">{config.speed}x</span>
                </div>
              </div>
            </div>

            {/* Variant Selector */}
            <div className="bg-card border border-border rounded-xl p-4">
              <label className="text-sm font-medium text-foreground mb-3 block">Active Variant</label>
              <div className="flex gap-2">
                {(['active', 'success', 'warning', 'danger'] as const).map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setActiveVariant(variant)}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all capitalize",
                      activeVariant === variant
                        ? "ring-2 ring-offset-2 ring-offset-background"
                        : "bg-muted/50 hover:bg-muted"
                    )}
                    style={{
                      backgroundColor: activeVariant === variant ? colors[variant] : undefined,
                      color: activeVariant === variant ? '#fff' : undefined,
                      ['--tw-ring-color' as string]: colors[variant],
                    }}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-muted/50 rounded-xl">
              {(['playback', 'timing', 'colors'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors capitalize",
                    activeTab === tab
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
              {activeTab === 'playback' && (
                <>
                  {/* Loop Control */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">Loop Mode</label>
                      <button
                        onClick={() => updateConfig('infiniteLoop', !config.infiniteLoop)}
                      className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                          config.infiniteLoop
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                        )}
                      >
                        <InfinityIcon className="w-4 h-4" />
                        {config.infiniteLoop ? 'Infinite' : 'Finite'}
                      </button>
                    </div>
                  </div>

                  {/* Toggle Count */}
                  {!config.infiniteLoop && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-foreground">Toggle Count</label>
                        <span className="text-sm font-mono text-muted-foreground">{config.toggleCount}x</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={config.toggleCount}
                        onChange={(e) => updateConfig('toggleCount', parseInt(e.target.value))}
                        className="w-full accent-primary"
                      />
                      <div className="flex gap-2">
                        {[1, 2, 4, 8, 16].map((n) => (
                          <button
                            key={n}
                            onClick={() => updateConfig('toggleCount', n)}
                            className={cn(
                              "flex-1 py-1 text-xs rounded-md transition-colors",
                              config.toggleCount === n
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/50 hover:bg-muted"
                            )}
                          >
                            {n}x
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Delay Between Toggles */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">Delay Between</label>
                      <span className="text-sm font-mono text-muted-foreground">{config.delay}ms</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      step="50"
                      value={config.delay}
                      onChange={(e) => updateConfig('delay', parseInt(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex gap-2">
                      {[0, 250, 500, 1000].map((ms) => (
                        <button
                          key={ms}
                          onClick={() => updateConfig('delay', ms)}
                          className={cn(
                            "flex-1 py-1 text-xs rounded-md transition-colors",
                            config.delay === ms
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 hover:bg-muted"
                          )}
                        >
                          {ms}ms
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Playback Speed */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        {config.speed < 1 ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                        Playback Speed
                      </label>
                      <span className="text-sm font-mono text-muted-foreground">{config.speed}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="2"
                      step="0.05"
                      value={config.speed}
                      onChange={(e) => updateConfig('speed', parseFloat(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex gap-1">
                      {speedPresets.map((preset) => (
                        <button
                          key={preset.value}
                          onClick={() => updateConfig('speed', preset.value)}
                          className={cn(
                            "flex-1 py-1 text-xs rounded-md transition-colors",
                            config.speed === preset.value
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 hover:bg-muted"
                          )}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'timing' && (
                <>
                  {/* Duration */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-foreground">Animation Duration</label>
                      <input
                        type="number"
                        min="100"
                        max="3000"
                        step="50"
                        value={config.duration}
                        onChange={(e) => updateConfig('duration', parseInt(e.target.value) || 500)}
                        className="w-20 px-2 py-1 text-sm font-mono bg-muted/50 border border-border rounded-md text-right"
                      />
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="3000"
                      step="50"
                      value={config.duration}
                      onChange={(e) => updateConfig('duration', parseInt(e.target.value))}
                      className="w-full accent-primary"
                    />
                    <div className="flex gap-2">
                      {[200, 300, 500, 700, 1000].map((ms) => (
                        <button
                          key={ms}
                          onClick={() => updateConfig('duration', ms)}
                          className={cn(
                            "flex-1 py-1 text-xs rounded-md transition-colors",
                            config.duration === ms
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 hover:bg-muted"
                          )}
                        >
                          {ms}ms
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bezier Curve */}
                  <div className="space-y-3 pt-2">
                    <label className="text-sm font-medium text-foreground">Easing Curve</label>
                    <BezierCurveEditor
                      value={config.bezier}
                      onChange={(value) => updateConfig('bezier', value)}
                    />
                  </div>
                </>
              )}

              {activeTab === 'colors' && (
                <div className="space-y-4">
                  <ColorPicker
                    label="Active (Primary)"
                    value={colors.active}
                    onChange={(v) => updateColor('active', v)}
                  />
                  <ColorPicker
                    label="Success"
                    value={colors.success}
                    onChange={(v) => updateColor('success', v)}
                  />
                  <ColorPicker
                    label="Warning"
                    value={colors.warning}
                    onChange={(v) => updateColor('warning', v)}
                  />
                  <ColorPicker
                    label="Danger"
                    value={colors.danger}
                    onChange={(v) => updateColor('danger', v)}
                  />
                  <div className="border-t border-border pt-4">
                    <ColorPicker
                      label="Default (Off)"
                      value={colors.default}
                      onChange={(v) => updateColor('default', v)}
                    />
                    <div className="mt-4">
                      <ColorPicker
                        label="Default Hover"
                        value={colors.defaultDark}
                        onChange={(v) => updateColor('defaultDark', v)}
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setColors(DEFAULT_COLORS)}
                    className="w-full py-2 text-sm bg-muted/50 hover:bg-muted rounded-lg transition-colors"
                  >
                    Reset to Defaults
                  </button>
                </div>
              )}
            </div>

            {/* Export/Code */}
            <div className="bg-muted/30 border border-border rounded-xl p-4">
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Generated CSS</label>
              <pre className="text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap break-all">
{`transition: transform ${config.duration}ms 
  cubic-bezier(${config.bezier.join(', ')});

--c-active: ${getActiveColor()};
--c-default: ${colors.default};`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
