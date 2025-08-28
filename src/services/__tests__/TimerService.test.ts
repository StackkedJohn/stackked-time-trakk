import { describe, test, expect, beforeEach, vi } from 'vitest';
import {
  createTimerSession,
  stopTimerSession,
  getSessionDuration,
  formatDuration,
  hasTimeOverlap,
  splitSessionAtTime,
  sessionToTimeEntry,
  getLastSession,
  preventOverlap,
  TimerSession
} from '../TimerService';

// Mock crypto.randomUUID
global.crypto = {
  randomUUID: vi.fn(() => 'test-uuid-123')
} as any;

describe('TimerService', () => {
  let mockDate: Date;

  beforeEach(() => {
    mockDate = new Date('2024-01-15T10:30:00Z');
    vi.setSystemTime(mockDate);
  });

  describe('createTimerSession', () => {
    test('creates a new active timer session', () => {
      const session = createTimerSession('Test Task');
      
      expect(session).toEqual({
        id: 'test-uuid-123',
        startTime: mockDate,
        endTime: undefined,
        description: 'Test Task',
        isActive: true
      });
    });

    test('uses default description when none provided', () => {
      const session = createTimerSession();
      expect(session.description).toBe('Work Session');
    });
  });

  describe('stopTimerSession', () => {
    test('stops an active session', () => {
      const session = createTimerSession('Test Task');
      const endTime = new Date('2024-01-15T11:30:00Z');
      vi.setSystemTime(endTime);
      
      const stoppedSession = stopTimerSession(session);
      
      expect(stoppedSession.endTime).toEqual(endTime);
      expect(stoppedSession.isActive).toBe(false);
    });
  });

  describe('getSessionDuration', () => {
    test('calculates duration for completed session', () => {
      const startTime = new Date('2024-01-15T10:30:00Z');
      const endTime = new Date('2024-01-15T11:30:00Z');
      
      const session: TimerSession = {
        id: 'test',
        startTime,
        endTime,
        description: 'Test',
        isActive: false
      };
      
      const duration = getSessionDuration(session);
      expect(duration).toBe(3600000); // 1 hour in milliseconds
    });

    test('calculates duration for active session using current time', () => {
      const startTime = new Date('2024-01-15T10:30:00Z');
      const currentTime = new Date('2024-01-15T10:45:00Z');
      vi.setSystemTime(currentTime);
      
      const session: TimerSession = {
        id: 'test',
        startTime,
        description: 'Test',
        isActive: true
      };
      
      const duration = getSessionDuration(session);
      expect(duration).toBe(900000); // 15 minutes in milliseconds
    });
  });

  describe('formatDuration', () => {
    test('formats hours, minutes, and seconds', () => {
      const result = formatDuration(3661000); // 1h 1m 1s
      expect(result).toBe('1h 1m 1s');
    });

    test('formats minutes and seconds only', () => {
      const result = formatDuration(61000); // 1m 1s
      expect(result).toBe('1m 1s');
    });

    test('formats seconds only', () => {
      const result = formatDuration(30000); // 30s
      expect(result).toBe('30s');
    });
  });

  describe('hasTimeOverlap', () => {
    test('detects overlapping sessions', () => {
      const session1: TimerSession = {
        id: '1',
        startTime: new Date('2024-01-15T10:00:00Z'),
        endTime: new Date('2024-01-15T11:00:00Z'),
        description: 'Session 1',
        isActive: false
      };

      const session2: TimerSession = {
        id: '2',
        startTime: new Date('2024-01-15T10:30:00Z'),
        endTime: new Date('2024-01-15T11:30:00Z'),
        description: 'Session 2',
        isActive: false
      };

      expect(hasTimeOverlap(session1, session2)).toBe(true);
    });

    test('detects non-overlapping sessions', () => {
      const session1: TimerSession = {
        id: '1',
        startTime: new Date('2024-01-15T10:00:00Z'),
        endTime: new Date('2024-01-15T11:00:00Z'),
        description: 'Session 1',
        isActive: false
      };

      const session2: TimerSession = {
        id: '2',
        startTime: new Date('2024-01-15T11:00:00Z'),
        endTime: new Date('2024-01-15T12:00:00Z'),
        description: 'Session 2',
        isActive: false
      };

      expect(hasTimeOverlap(session1, session2)).toBe(false);
    });
  });

  describe('splitSessionAtTime', () => {
    test('splits session with discard action', () => {
      const session: TimerSession = {
        id: 'original',
        startTime: new Date('2024-01-15T10:00:00Z'),
        endTime: new Date('2024-01-15T12:00:00Z'),
        description: 'Original Session',
        isActive: false
      };

      const splitTime = new Date('2024-01-15T11:00:00Z');
      const idleDuration = 5 * 60 * 1000; // 5 minutes

      const result = splitSessionAtTime(session, splitTime, 'discard', idleDuration);
      
      expect(result).toHaveLength(2);
      expect(result[0].endTime).toEqual(new Date('2024-01-15T10:55:00Z')); // Split time minus idle
      expect(result[1].startTime).toEqual(splitTime);
    });

    test('keeps session intact with keep action', () => {
      const session: TimerSession = {
        id: 'original',
        startTime: new Date('2024-01-15T10:00:00Z'),
        endTime: new Date('2024-01-15T12:00:00Z'),
        description: 'Original Session',
        isActive: false
      };

      const result = splitSessionAtTime(session, new Date('2024-01-15T11:00:00Z'), 'keep', 300000);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(session);
    });
  });

  describe('preventOverlap', () => {
    test('stops all active sessions', () => {
      const activeSessions: TimerSession[] = [
        {
          id: '1',
          startTime: new Date('2024-01-15T10:00:00Z'),
          description: 'Active 1',
          isActive: true
        },
        {
          id: '2',
          startTime: new Date('2024-01-15T09:00:00Z'),
          endTime: new Date('2024-01-15T09:30:00Z'),
          description: 'Completed',
          isActive: false
        }
      ];

      const newSession = createTimerSession('New Session');
      const result = preventOverlap(activeSessions, newSession);

      expect(result[0].isActive).toBe(false);
      expect(result[0].endTime).toBeDefined();
      expect(result[1].isActive).toBe(false); // Was already inactive
    });
  });

  describe('sessionToTimeEntry', () => {
    test('converts session to time entry format', () => {
      const session: TimerSession = {
        id: 'test',
        startTime: new Date('2024-01-15T10:30:00Z'),
        endTime: new Date('2024-01-15T11:30:00Z'),
        description: 'Test Session',
        isActive: false
      };

      const entry = sessionToTimeEntry(session);

      expect(entry).toEqual({
        start_date: '2024-01-15',
        end_date: '2024-01-15',
        start_time: '10:30',
        end_time: '11:30',
        description: 'Test Session',
        entry_type: 'clock'
      });
    });
  });

  describe('getLastSession', () => {
    test('returns most recent session', () => {
      const sessions: TimerSession[] = [
        {
          id: '1',
          startTime: new Date('2024-01-15T09:00:00Z'),
          description: 'Earlier',
          isActive: false
        },
        {
          id: '2',
          startTime: new Date('2024-01-15T10:00:00Z'),
          description: 'Later',
          isActive: false
        }
      ];

      const result = getLastSession(sessions);
      expect(result?.id).toBe('2');
    });

    test('returns null for empty array', () => {
      const result = getLastSession([]);
      expect(result).toBeNull();
    });
  });
});