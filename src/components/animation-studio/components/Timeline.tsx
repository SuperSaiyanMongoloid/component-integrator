import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineProps {
  currentFrame: number;
  totalFrames: number;
  progress: number;
  isPlaying: boolean;
  zoom: number;
  onFrameChange: (frame: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onZoomChange: (zoom: number) => void;
  className?: string;
}

export function Timeline({
  currentFrame,
  totalFrames,
  progress,
  isPlaying,
  zoom,
  onFrameChange,
  onPlay,
  onPause,
  onReset,
  onZoomChange,
  className,
}: TimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    if (!trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const frame = Math.round(percent * (totalFrames - 1));
    onFrameChange(Math.max(0, Math.min(frame, totalFrames - 1)));
  }, [totalFrames, onFrameChange]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    handleTrackClick(e);
  }, [handleTrackClick]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = x / rect.width;
    const frame = Math.round(percent * (totalFrames - 1));
    onFrameChange(Math.max(0, Math.min(frame, totalFrames - 1)));
  }, [isDragging, totalFrames, onFrameChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle scroll for zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.25 : 0.25;
      onZoomChange(zoom + delta);
    }
  }, [zoom, onZoomChange]);

  // Calculate visible frame markers based on zoom
  const getFrameMarkers = () => {
    const minSpacing = 8; // Minimum pixels between markers
    const availableWidth = 100; // percentage
    const maxMarkers = Math.floor((availableWidth * zoom) / minSpacing);
    
    // Determine step size
    const step = Math.max(1, Math.ceil(totalFrames / maxMarkers));
    const markers: number[] = [];
    
    for (let i = 0; i < totalFrames; i += step) {
      markers.push(i);
    }
    
    // Always include the last frame
    if (markers[markers.length - 1] !== totalFrames - 1) {
      markers.push(totalFrames - 1);
    }
    
    return { markers, step };
  };

  const { markers, step } = getFrameMarkers();

  return (
    <div className={cn("space-y-3", className)}>
      {/* Playback controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={isPlaying ? onPause : onPlay}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg transition-colors",
              isPlaying
                ? "bg-neutral-700 hover:bg-neutral-600 text-white"
                : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            )}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={onReset}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Frame info */}
        <div className="text-sm font-mono text-neutral-400">
          <span className="text-neutral-200">{currentFrame}</span>
          <span className="mx-1">/</span>
          <span>{totalFrames - 1}</span>
          <span className="ml-3 text-neutral-500">({Math.round(progress * 100)}%)</span>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onZoomChange(zoom - 0.25)}
            disabled={zoom <= 0.5}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-neutral-500 w-12 text-center">{zoom.toFixed(1)}x</span>
          <button
            onClick={() => onZoomChange(zoom + 0.25)}
            disabled={zoom >= 4}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline track */}
      <div 
        className="relative"
        onWheel={handleWheel}
      >
        {/* Frame markers */}
        <div className="h-4 relative mb-1 overflow-hidden">
          {markers.map((frame) => {
            const position = totalFrames > 1 ? (frame / (totalFrames - 1)) * 100 : 0;
            const showLabel = step <= 10 || frame === 0 || frame === totalFrames - 1 || frame % (step * 2) === 0;
            
            return (
              <div
                key={frame}
                className="absolute flex flex-col items-center"
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
              >
                {showLabel && (
                  <span className="text-[10px] font-mono text-neutral-500">
                    {frame}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Track */}
        <div
          ref={trackRef}
          className="h-8 bg-neutral-800 rounded-lg cursor-pointer relative overflow-hidden"
          onMouseDown={handleMouseDown}
        >
          {/* Progress fill */}
          <div
            className="absolute inset-y-0 left-0 bg-neutral-700 rounded-lg"
            style={{ width: `${progress * 100}%` }}
          />

          {/* Frame ticks */}
          <div className="absolute inset-0 flex items-end">
            {markers.map((frame) => {
              const position = totalFrames > 1 ? (frame / (totalFrames - 1)) * 100 : 0;
              const isMajor = step <= 5 || frame % (step * 2) === 0;
              
              return (
                <div
                  key={frame}
                  className={cn(
                    "absolute bottom-0 w-px",
                    isMajor ? "h-3 bg-neutral-600" : "h-2 bg-neutral-700"
                  )}
                  style={{ left: `${position}%` }}
                />
              );
            })}
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
            style={{ left: `${progress * 100}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-md" />
          </div>
        </div>

        {/* Keyboard hint */}
        <div className="mt-2 text-[10px] text-neutral-600 text-center">
          ← → frame step • Ctrl+← → 10% jump • Space play/pause • Home/End
        </div>
      </div>
    </div>
  );
}
