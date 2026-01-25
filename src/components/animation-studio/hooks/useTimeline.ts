import { useState, useCallback, useEffect, useRef } from 'react';

const FPS = 60;
const FRAME_DURATION = 1000 / FPS;

interface UseTimelineOptions {
  duration: number; // ms
  speed: number;
  onFrameChange?: (frame: number, progress: number) => void;
}

interface TimelineState {
  currentFrame: number;
  totalFrames: number;
  progress: number;
  isPlaying: boolean;
  zoom: number;
}

export function useTimeline({ duration, speed, onFrameChange }: UseTimelineOptions) {
  const effectiveDuration = duration / speed;
  const totalFrames = Math.ceil((effectiveDuration / 1000) * FPS);
  
  const [state, setState] = useState<TimelineState>({
    currentFrame: 0,
    totalFrames,
    progress: 0,
    isPlaying: false,
    zoom: 1,
  });

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedProgressRef = useRef<number>(0);

  // Update total frames when duration/speed changes
  useEffect(() => {
    const newTotalFrames = Math.ceil((effectiveDuration / 1000) * FPS);
    setState(prev => ({
      ...prev,
      totalFrames: newTotalFrames,
      currentFrame: Math.min(prev.currentFrame, newTotalFrames - 1),
    }));
  }, [effectiveDuration]);

  const setFrame = useCallback((frame: number) => {
    const clampedFrame = Math.max(0, Math.min(frame, totalFrames - 1));
    const progress = totalFrames > 1 ? clampedFrame / (totalFrames - 1) : 0;
    
    setState(prev => ({
      ...prev,
      currentFrame: clampedFrame,
      progress,
      isPlaying: false,
    }));
    
    pausedProgressRef.current = progress;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    startTimeRef.current = null;
    
    onFrameChange?.(clampedFrame, progress);
  }, [totalFrames, onFrameChange]);

  const play = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true }));
    startTimeRef.current = null;
  }, []);

  const pause = useCallback(() => {
    setState(prev => {
      pausedProgressRef.current = prev.progress;
      return { ...prev, isPlaying: false };
    });
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    startTimeRef.current = null;
  }, []);

  const reset = useCallback(() => {
    pause();
    pausedProgressRef.current = 0;
    setState(prev => ({
      ...prev,
      currentFrame: 0,
      progress: 0,
    }));
    onFrameChange?.(0, 0);
  }, [pause, onFrameChange]);

  const stepForward = useCallback((frames: number = 1) => {
    setFrame(state.currentFrame + frames);
  }, [state.currentFrame, setFrame]);

  const stepBackward = useCallback((frames: number = 1) => {
    setFrame(state.currentFrame - frames);
  }, [state.currentFrame, setFrame]);

  const jumpToPercent = useCallback((percent: number) => {
    const frame = Math.round((percent / 100) * (totalFrames - 1));
    setFrame(frame);
  }, [totalFrames, setFrame]);

  const setZoom = useCallback((zoom: number) => {
    setState(prev => ({ ...prev, zoom: Math.max(0.5, Math.min(4, zoom)) }));
  }, []);

  // Animation loop
  useEffect(() => {
    if (!state.isPlaying) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp - (pausedProgressRef.current * effectiveDuration);
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / effectiveDuration, 1);
      const currentFrame = Math.floor(progress * (totalFrames - 1));

      setState(prev => ({
        ...prev,
        currentFrame,
        progress,
      }));

      onFrameChange?.(currentFrame, progress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setState(prev => ({ ...prev, isPlaying: false }));
        pausedProgressRef.current = 1;
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state.isPlaying, effectiveDuration, totalFrames, onFrameChange]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not focused on input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (e.ctrlKey || e.metaKey) {
            jumpToPercent(Math.max(0, (state.progress * 100) - 10));
          } else {
            stepBackward(1);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (e.ctrlKey || e.metaKey) {
            jumpToPercent(Math.min(100, (state.progress * 100) + 10));
          } else {
            stepForward(1);
          }
          break;
        case ' ':
          e.preventDefault();
          if (state.isPlaying) {
            pause();
          } else {
            if (state.progress >= 1) {
              reset();
            }
            play();
          }
          break;
        case 'Home':
          e.preventDefault();
          setFrame(0);
          break;
        case 'End':
          e.preventDefault();
          setFrame(totalFrames - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isPlaying, state.progress, play, pause, reset, stepForward, stepBackward, jumpToPercent, setFrame, totalFrames]);

  return {
    ...state,
    play,
    pause,
    reset,
    setFrame,
    stepForward,
    stepBackward,
    jumpToPercent,
    setZoom,
    fps: FPS,
  };
}
