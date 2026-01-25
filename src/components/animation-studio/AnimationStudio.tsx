"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Settings2, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Timeline } from './components/Timeline';
import { ComparisonView } from './components/ComparisonView';
import { BezierEditor } from './components/BezierEditor';
import { ControlPanel } from './components/ControlPanel';
import { GooeyToggle, StudioGooeyFilters } from './components/GooeyToggle';
import { useTimeline } from './hooks/useTimeline';
import { 
  DEFAULT_ANIMATION, 
  DEFAULT_COLORS,
  type AnimationConfig, 
  type ColorConfig, 
  type ActiveVariant 
} from './types';

export function AnimationStudio() {
  // Original (reference) config - never changes during editing
  const [originalConfig] = useState<AnimationConfig>(DEFAULT_ANIMATION);
  const [originalColors] = useState<ColorConfig>(DEFAULT_COLORS);
  
  // Edited config - user modifies this
  const [config, setConfig] = useState<AnimationConfig>(DEFAULT_ANIMATION);
  const [colors, setColors] = useState<ColorConfig>(DEFAULT_COLORS);
  const [activeVariant, setActiveVariant] = useState<ActiveVariant>('active');
  
  // Animation state
  const [toggleState, setToggleState] = useState(false);
  const [currentToggle, setCurrentToggle] = useState(0);
  const [showControls, setShowControls] = useState(true);
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const effectiveDuration = config.duration / config.speed;

  // Timeline hook
  const timeline = useTimeline({
    duration: effectiveDuration,
    speed: 1, // Speed is already applied to effectiveDuration
    onFrameChange: useCallback((frame: number, progress: number) => {
      // Could be used for frame-specific state updates
    }, []),
  });

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  // Handle play/pause from timeline
  const handlePlay = useCallback(() => {
    if (timeline.isPlaying) {
      timeline.pause();
    } else {
      if (timeline.progress >= 1) {
        timeline.reset();
        setToggleState(false);
      }
      // Toggle state when starting
      setToggleState(prev => !prev);
      setCurrentToggle(prev => prev + 1);
      timeline.play();
    }
  }, [timeline]);

  const handleReset = useCallback(() => {
    timeline.reset();
    setToggleState(false);
    setCurrentToggle(0);
    clearTimers();
  }, [timeline, clearTimers]);

  const updateConfig = <K extends keyof AnimationConfig>(key: K, value: AnimationConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateColor = <K extends keyof ColorConfig>(key: K, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const getActiveColor = (colorConfig: ColorConfig) => colorConfig[activeVariant];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <StudioGooeyFilters />
      
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center">
              <Layers className="w-4 h-4 text-neutral-400" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-neutral-200">Animation Studio</h1>
              <p className="text-xs text-neutral-500">Gooey Toggle</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowControls(!showControls)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
              showControls
                ? "bg-neutral-700 text-neutral-200"
                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
            )}
          >
            <Settings2 className="w-4 h-4" />
            Controls
          </button>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto">
        <div className={cn(
          "grid transition-all duration-300",
          showControls ? "lg:grid-cols-[1fr,320px]" : "grid-cols-1"
        )}>
          {/* Main Content */}
          <main className="p-6 space-y-6">
            {/* Comparison View */}
            <ComparisonView
              component={GooeyToggle}
              checked={toggleState}
              progress={timeline.progress}
              originalAnimation={{
                duration: originalConfig.duration / config.speed,
                bezier: originalConfig.bezier,
              }}
              editedAnimation={{
                duration: effectiveDuration,
                bezier: config.bezier,
              }}
              originalColors={{
                active: getActiveColor(originalColors),
                default: originalColors.default,
                knob: originalColors.knob,
              }}
              editedColors={{
                active: getActiveColor(colors),
                default: colors.default,
                knob: colors.knob,
              }}
            />

            {/* Bezier Editor - Main View */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
                <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
                  Easing Curve
                </h3>
                <BezierEditor
                  originalValue={originalConfig.bezier}
                  editedValue={config.bezier}
                  onChange={(value) => updateConfig('bezier', value)}
                  progress={timeline.progress}
                />
              </div>

              {/* Stats Panel */}
              <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5 space-y-4">
                <h3 className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Animation Stats
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-800 rounded-lg p-3">
                    <div className="text-xs text-neutral-500 mb-1">Frame</div>
                    <div className="text-lg font-mono text-neutral-200">
                      {timeline.currentFrame} <span className="text-neutral-500">/ {timeline.totalFrames - 1}</span>
                    </div>
                  </div>
                  <div className="bg-neutral-800 rounded-lg p-3">
                    <div className="text-xs text-neutral-500 mb-1">Progress</div>
                    <div className="text-lg font-mono text-neutral-200">
                      {Math.round(timeline.progress * 100)}%
                    </div>
                  </div>
                  <div className="bg-neutral-800 rounded-lg p-3">
                    <div className="text-xs text-neutral-500 mb-1">Toggle Count</div>
                    <div className="text-lg font-mono text-neutral-200">
                      {currentToggle}
                      {config.infiniteLoop && <span className="text-neutral-500"> / ∞</span>}
                      {!config.infiniteLoop && <span className="text-neutral-500"> / {config.toggleCount}</span>}
                    </div>
                  </div>
                  <div className="bg-neutral-800 rounded-lg p-3">
                    <div className="text-xs text-neutral-500 mb-1">Speed</div>
                    <div className="text-lg font-mono text-neutral-200">{config.speed}x</div>
                  </div>
                </div>

                <div className="bg-neutral-800 rounded-lg p-3">
                  <div className="text-xs text-neutral-500 mb-1">Effective Duration</div>
                  <div className="text-lg font-mono text-neutral-200">
                    {Math.round(effectiveDuration)}ms
                    {config.speed !== 1 && (
                      <span className="text-neutral-500 text-sm ml-2">
                        (base: {config.duration}ms)
                      </span>
                    )}
                  </div>
                </div>

                {/* Generated CSS */}
                <div className="mt-4">
                  <div className="text-xs text-neutral-500 mb-2">Generated CSS</div>
                  <pre className="text-xs font-mono bg-neutral-950 rounded-lg p-3 overflow-x-auto text-neutral-400">
{`transition: all ${config.duration}ms 
  cubic-bezier(${config.bezier.join(', ')});`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
              <Timeline
                currentFrame={timeline.currentFrame}
                totalFrames={timeline.totalFrames}
                progress={timeline.progress}
                isPlaying={timeline.isPlaying}
                zoom={timeline.zoom}
                onFrameChange={timeline.setFrame}
                onPlay={handlePlay}
                onPause={timeline.pause}
                onReset={handleReset}
                onZoomChange={timeline.setZoom}
              />
            </div>
          </main>

          {/* Control Panel Sidebar */}
          {showControls && (
            <aside className="border-l border-neutral-800 bg-neutral-900/50 p-5 overflow-y-auto max-h-[calc(100vh-73px)] sticky top-[73px]">
              <ControlPanel
                config={config}
                colors={colors}
                activeVariant={activeVariant}
                onConfigChange={updateConfig}
                onColorChange={updateColor}
                onVariantChange={setActiveVariant}
              />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
