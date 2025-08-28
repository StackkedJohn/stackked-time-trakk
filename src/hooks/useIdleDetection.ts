import { useState, useEffect, useRef, useCallback } from 'react';

export interface IdleState {
  isIdle: boolean;
  idleStartTime: Date | null;
  idleDuration: number; // in milliseconds
  lastActivity: Date;
}

export interface IdleDetectionConfig {
  timeout: number; // idle timeout in milliseconds (default: 5 minutes)
  events: string[]; // events to track for activity
  enabled: boolean;
}

const DEFAULT_CONFIG: IdleDetectionConfig = {
  timeout: 5 * 60 * 1000, // 5 minutes
  events: ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'],
  enabled: true
};

/**
 * Hook for detecting user idle state with configurable timeout
 */
export const useIdleDetection = (
  config: Partial<IdleDetectionConfig> = {}
) => {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const [idleState, setIdleState] = useState<IdleState>({
    isIdle: false,
    idleStartTime: null,
    idleDuration: 0,
    lastActivity: new Date()
  });

  const timeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();

  const resetIdle = useCallback(() => {
    const now = new Date();
    
    setIdleState(prev => ({
      ...prev,
      isIdle: false,
      idleStartTime: null,
      idleDuration: 0,
      lastActivity: now
    }));

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Clear duration interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set new timeout
    if (fullConfig.enabled) {
      timeoutRef.current = setTimeout(() => {
        const idleStartTime = new Date();
        setIdleState(prev => ({
          ...prev,
          isIdle: true,
          idleStartTime,
          idleDuration: 0
        }));

        // Start tracking idle duration
        intervalRef.current = setInterval(() => {
          setIdleState(prev => {
            if (!prev.idleStartTime) return prev;
            
            return {
              ...prev,
              idleDuration: new Date().getTime() - prev.idleStartTime.getTime()
            };
          });
        }, 1000); // Update every second

      }, fullConfig.timeout);
    }
  }, [fullConfig.enabled, fullConfig.timeout]);

  const handleActivity = useCallback(() => {
    resetIdle();
  }, [resetIdle]);

  useEffect(() => {
    if (!fullConfig.enabled) {
      return;
    }

    // Add event listeners
    fullConfig.events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialize
    resetIdle();

    return () => {
      // Cleanup
      fullConfig.events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fullConfig.enabled, fullConfig.events, handleActivity, resetIdle]);

  const manualReset = useCallback(() => {
    resetIdle();
  }, [resetIdle]);

  return {
    ...idleState,
    resetIdle: manualReset,
    config: fullConfig
  };
};