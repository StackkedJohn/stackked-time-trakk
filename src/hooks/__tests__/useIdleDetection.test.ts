import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIdleDetection } from '../useIdleDetection';

// Mock timers
vi.useFakeTimers();

describe('useIdleDetection', () => {
  beforeEach(() => {
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('initializes with not idle state', () => {
    const { result } = renderHook(() => useIdleDetection());

    expect(result.current.isIdle).toBe(false);
    expect(result.current.idleStartTime).toBeNull();
    expect(result.current.idleDuration).toBe(0);
    expect(result.current.lastActivity).toBeInstanceOf(Date);
  });

  test('becomes idle after timeout period', () => {
    const { result } = renderHook(() => 
      useIdleDetection({ timeout: 5000 }) // 5 second timeout for testing
    );

    expect(result.current.isIdle).toBe(false);

    // Fast forward past the timeout
    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.idleStartTime).toBeInstanceOf(Date);
  });

  test('updates idle duration while idle', () => {
    const { result } = renderHook(() => 
      useIdleDetection({ timeout: 1000 })
    );

    // Become idle
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.isIdle).toBe(true);
    expect(result.current.idleDuration).toBe(0);

    // Advance time while idle
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.idleDuration).toBeGreaterThan(0);
  });

  test('resets idle state on activity', () => {
    const { result } = renderHook(() => 
      useIdleDetection({ timeout: 1000 })
    );

    // Become idle
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.isIdle).toBe(true);

    // Simulate activity
    act(() => {
      const event = new Event('mousedown');
      document.dispatchEvent(event);
    });

    expect(result.current.isIdle).toBe(false);
    expect(result.current.idleStartTime).toBeNull();
    expect(result.current.idleDuration).toBe(0);
  });

  test('manual reset works correctly', () => {
    const { result } = renderHook(() => 
      useIdleDetection({ timeout: 1000 })
    );

    // Become idle
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.isIdle).toBe(true);

    // Manual reset
    act(() => {
      result.current.resetIdle();
    });

    expect(result.current.isIdle).toBe(false);
  });

  test('respects enabled/disabled state', () => {
    const { result, rerender } = renderHook(
      ({ enabled }) => useIdleDetection({ timeout: 1000, enabled }),
      { initialProps: { enabled: false } }
    );

    // Should not become idle when disabled
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.isIdle).toBe(false);

    // Enable and test again
    rerender({ enabled: true });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.isIdle).toBe(true);
  });

  test('listens to configured events', () => {
    const customEvents = ['click', 'scroll'];
    const { result } = renderHook(() => 
      useIdleDetection({ 
        timeout: 1000, 
        events: customEvents 
      })
    );

    // Become idle
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.isIdle).toBe(true);

    // Test custom event
    act(() => {
      const event = new Event('click');
      document.dispatchEvent(event);
    });

    expect(result.current.isIdle).toBe(false);
  });

  test('uses default configuration when no config provided', () => {
    const { result } = renderHook(() => useIdleDetection());

    expect(result.current.config.timeout).toBe(5 * 60 * 1000); // 5 minutes
    expect(result.current.config.enabled).toBe(true);
    expect(result.current.config.events).toContain('mousedown');
    expect(result.current.config.events).toContain('keypress');
  });

  test('cleans up event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    
    const { unmount } = renderHook(() => useIdleDetection());
    
    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalled();
  });
});