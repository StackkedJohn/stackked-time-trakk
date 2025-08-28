import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTimeEntries } from '@/hooks/useTimeEntries';
import { useIdleDetection } from '@/hooks/useIdleDetection';
import { 
  TimerSession, 
  createTimerSession, 
  stopTimerSession, 
  sessionToTimeEntry,
  getLastSession,
  preventOverlap,
  splitSessionAtTime,
  formatDuration,
  IdleAction
} from '@/services/TimerService';

export interface UseTimerReturn {
  // Timer state
  isRunning: boolean;
  currentSession: TimerSession | null;
  sessions: TimerSession[];
  
  // Timer actions
  startTimer: (description?: string) => void;
  stopTimer: () => void;
  switchToLastTask: () => void;
  
  // Idle handling
  isIdle: boolean;
  idleDuration: number;
  showIdlePrompt: boolean;
  handleIdleAction: (action: IdleAction) => void;
  dismissIdlePrompt: () => void;
}

/**
 * Enhanced timer hook with smart switching, idle detection, and overlap prevention
 */
export const useTimer = (): UseTimerReturn => {
  const [currentSession, setCurrentSession] = useState<TimerSession | null>(null);
  const [sessions, setSessions] = useState<TimerSession[]>([]);
  const [showIdlePrompt, setShowIdlePrompt] = useState(false);
  const [pendingIdleAction, setPendingIdleAction] = useState<{
    session: TimerSession;
    idleStartTime: Date;
    idleDuration: number;
  } | null>(null);

  const { toast } = useToast();
  const { addEntry } = useTimeEntries();
  
  // Idle detection with 5-minute timeout
  const { isIdle, idleDuration, idleStartTime, resetIdle } = useIdleDetection({
    timeout: 5 * 60 * 1000, // 5 minutes
    enabled: currentSession?.isActive || false
  });

  // Handle idle state changes
  useEffect(() => {
    if (isIdle && currentSession?.isActive && idleStartTime) {
      setShowIdlePrompt(true);
      setPendingIdleAction({
        session: currentSession,
        idleStartTime,
        idleDuration
      });
    }
  }, [isIdle, currentSession, idleStartTime, idleDuration]);

  const startTimer = useCallback((description: string = 'Work Session') => {
    // Stop any running timers to prevent overlaps
    if (currentSession?.isActive) {
      const stoppedSession = stopTimerSession(currentSession);
      addEntry(sessionToTimeEntry(stoppedSession));
      
      toast({
        title: "Previous Timer Stopped",
        description: `Saved ${formatDuration(stoppedSession.endTime!.getTime() - stoppedSession.startTime.getTime())}`,
      });
    }

    // Update sessions list with stopped session
    setSessions(prev => preventOverlap(prev, createTimerSession(description)));
    
    // Create and start new session
    const newSession = createTimerSession(description);
    setCurrentSession(newSession);
    
    // Reset idle detection
    resetIdle();
    
    toast({
      title: "Timer Started",
      description: `Started tracking: ${description}`,
    });
  }, [currentSession, addEntry, toast, resetIdle]);

  const stopTimer = useCallback(() => {
    if (!currentSession?.isActive) {
      toast({
        title: "No Active Timer",
        description: "There's no timer currently running",
        variant: "destructive",
      });
      return;
    }

    const stoppedSession = stopTimerSession(currentSession);
    addEntry(sessionToTimeEntry(stoppedSession));
    
    // Update sessions
    setSessions(prev => [...prev, stoppedSession]);
    setCurrentSession(null);
    
    // Clear idle prompt if showing
    setShowIdlePrompt(false);
    setPendingIdleAction(null);
    
    const duration = stoppedSession.endTime!.getTime() - stoppedSession.startTime.getTime();
    toast({
      title: "Timer Stopped",
      description: `Tracked ${formatDuration(duration)}`,
    });
  }, [currentSession, addEntry, toast]);

  const switchToLastTask = useCallback(() => {
    const lastSession = getLastSession(sessions);
    
    if (!lastSession) {
      toast({
        title: "No Previous Task",
        description: "No previous task found to switch to",
        variant: "destructive",
      });
      return;
    }

    startTimer(lastSession.description);
  }, [sessions, startTimer, toast]);

  const handleIdleAction = useCallback((action: IdleAction) => {
    if (!pendingIdleAction) return;

    const { session, idleStartTime, idleDuration } = pendingIdleAction;
    
    switch (action) {
      case 'keep':
        // Continue as normal - do nothing special
        resetIdle();
        break;
        
      case 'discard':
        // Stop the session at idle start time
        const discardedSession = {
          ...session,
          endTime: idleStartTime,
          isActive: false
        };
        addEntry(sessionToTimeEntry(discardedSession));
        setCurrentSession(null);
        setSessions(prev => [...prev, discardedSession]);
        
        toast({
          title: "Idle Time Discarded",
          description: `Removed ${formatDuration(idleDuration)} of idle time`,
        });
        break;
        
      case 'split':
        // Split the session into before and after idle
        const splitSessions = splitSessionAtTime(session, idleStartTime, 'split', idleDuration);
        
        // Add the first session to entries
        if (splitSessions[0]) {
          addEntry(sessionToTimeEntry(splitSessions[0]));
        }
        
        // Start a new session for the "after" period
        startTimer(session.description);
        
        toast({
          title: "Session Split",
          description: `Split at idle time - ${formatDuration(idleDuration)} gap created`,
        });
        break;
    }

    setShowIdlePrompt(false);
    setPendingIdleAction(null);
  }, [pendingIdleAction, resetIdle, addEntry, startTimer, toast]);

  const dismissIdlePrompt = useCallback(() => {
    setShowIdlePrompt(false);
    setPendingIdleAction(null);
    resetIdle();
  }, [resetIdle]);

  return {
    // Timer state
    isRunning: currentSession?.isActive || false,
    currentSession,
    sessions,
    
    // Timer actions
    startTimer,
    stopTimer,
    switchToLastTask,
    
    // Idle handling
    isIdle,
    idleDuration,
    showIdlePrompt,
    handleIdleAction,
    dismissIdlePrompt,
  };
};