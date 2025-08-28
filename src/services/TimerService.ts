// Pure functions for timer logic - testable and timezone-aware

export interface TimerSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  description: string;
  isActive: boolean;
}

export interface IdleSession {
  startTime: Date;
  endTime: Date;
  duration: number; // in milliseconds
}

export type IdleAction = 'keep' | 'discard' | 'split';

/**
 * Creates a new timer session
 */
export const createTimerSession = (description: string = 'Work Session'): TimerSession => {
  return {
    id: crypto.randomUUID(),
    startTime: new Date(),
    description,
    isActive: true,
  };
};

/**
 * Stops a timer session
 */
export const stopTimerSession = (session: TimerSession): TimerSession => {
  return {
    ...session,
    endTime: new Date(),
    isActive: false,
  };
};

/**
 * Calculates session duration in milliseconds
 */
export const getSessionDuration = (session: TimerSession): number => {
  const endTime = session.endTime || new Date();
  return endTime.getTime() - session.startTime.getTime();
};

/**
 * Formats duration to human readable string
 */
export const formatDuration = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Checks if two sessions overlap
 */
export const hasTimeOverlap = (session1: TimerSession, session2: TimerSession): boolean => {
  const start1 = session1.startTime.getTime();
  const end1 = (session1.endTime || new Date()).getTime();
  const start2 = session2.startTime.getTime();
  const end2 = (session2.endTime || new Date()).getTime();

  return start1 < end2 && start2 < end1;
};

/**
 * Splits a session at a specific time, handling idle periods
 */
export const splitSessionAtTime = (
  session: TimerSession, 
  splitTime: Date,
  idleAction: IdleAction,
  idleDuration: number
): TimerSession[] => {
  const originalEnd = session.endTime || new Date();
  
  if (splitTime <= session.startTime || splitTime >= originalEnd) {
    return [session];
  }

  const beforeSession: TimerSession = {
    ...session,
    id: crypto.randomUUID(),
    endTime: new Date(splitTime.getTime() - idleDuration),
    isActive: false,
  };

  const afterSession: TimerSession = {
    ...session,
    id: crypto.randomUUID(),
    startTime: splitTime,
    endTime: originalEnd,
    isActive: false,
  };

  switch (idleAction) {
    case 'keep':
      // Keep the full session as one
      return [session];
    case 'discard':
      // Remove idle time
      return [beforeSession, afterSession];
    case 'split':
      // Split into separate sessions
      return [beforeSession, afterSession];
    default:
      return [session];
  }
};

/**
 * Converts TimerSession to TimeEntry format for database
 */
export const sessionToTimeEntry = (session: TimerSession) => {
  const endTime = session.endTime || new Date();
  
  return {
    start_date: session.startTime.toISOString().split('T')[0],
    end_date: endTime.toISOString().split('T')[0],
    start_time: session.startTime.toTimeString().slice(0, 5),
    end_time: endTime.toTimeString().slice(0, 5),
    description: session.description,
    entry_type: 'clock' as const
  };
};

/**
 * Gets the most recent session from a list
 */
export const getLastSession = (sessions: TimerSession[]): TimerSession | null => {
  if (sessions.length === 0) return null;
  
  return sessions.reduce((latest, current) => {
    return current.startTime > latest.startTime ? current : latest;
  });
};

/**
 * Prevents timer overlaps by auto-stopping active sessions
 */
export const preventOverlap = (
  activeSessions: TimerSession[], 
  newSession: TimerSession
): TimerSession[] => {
  return activeSessions.map(session => 
    session.isActive ? stopTimerSession(session) : session
  );
};
