import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardShortcuts } from '../useKeyboardShortcuts';

describe('useKeyboardShortcuts', () => {
  let mockCallbacks: {
    onStartStop: ReturnType<typeof vi.fn>;
    onSwitchToLast: ReturnType<typeof vi.fn>;
    onNewManualEntry: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockCallbacks = {
      onStartStop: vi.fn(),
      onSwitchToLast: vi.fn(),
      onNewManualEntry: vi.fn()
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
    // Clean up any event listeners
    document.removeEventListener('keydown', () => {});
  });

  test('registers keyboard shortcuts when enabled', () => {
    const { result } = renderHook(() => 
      useKeyboardShortcuts(mockCallbacks, true)
    );

    expect(result.current.shortcuts).toHaveLength(3);
    expect(result.current.enabled).toBe(true);
    expect(result.current.shortcuts[0].key).toBe('r');
    expect(result.current.shortcuts[1].key).toBe('s');
    expect(result.current.shortcuts[2].key).toBe('n');
  });

  test('triggers start/stop callback on R key', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks, true));

    const event = new KeyboardEvent('keydown', { key: 'r' });
    document.dispatchEvent(event);

    expect(mockCallbacks.onStartStop).toHaveBeenCalledTimes(1);
  });

  test('triggers switch to last callback on S key', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks, true));

    const event = new KeyboardEvent('keydown', { key: 's' });
    document.dispatchEvent(event);

    expect(mockCallbacks.onSwitchToLast).toHaveBeenCalledTimes(1);
  });

  test('triggers new manual entry callback on N key', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks, true));

    const event = new KeyboardEvent('keydown', { key: 'n' });
    document.dispatchEvent(event);

    expect(mockCallbacks.onNewManualEntry).toHaveBeenCalledTimes(1);
  });

  test('ignores shortcuts when disabled', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks, false));

    const event = new KeyboardEvent('keydown', { key: 'r' });
    document.dispatchEvent(event);

    expect(mockCallbacks.onStartStop).not.toHaveBeenCalled();
  });

  test('ignores shortcuts when target is input element', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks, true));

    // Create mock input element
    const input = document.createElement('input');
    document.body.appendChild(input);

    const event = new KeyboardEvent('keydown', { key: 'r' });
    Object.defineProperty(event, 'target', { value: input });
    document.dispatchEvent(event);

    expect(mockCallbacks.onStartStop).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  test('ignores shortcuts when target is textarea element', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks, true));

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    const event = new KeyboardEvent('keydown', { key: 'r' });
    Object.defineProperty(event, 'target', { value: textarea });
    document.dispatchEvent(event);

    expect(mockCallbacks.onStartStop).not.toHaveBeenCalled();

    document.body.removeChild(textarea);
  });

  test('handles case insensitive keys', () => {
    renderHook(() => useKeyboardShortcuts(mockCallbacks, true));

    const event = new KeyboardEvent('keydown', { key: 'R' });
    document.dispatchEvent(event);

    expect(mockCallbacks.onStartStop).toHaveBeenCalledTimes(1);
  });

  test('creates accessibility announcement on shortcut activation', () => {
    const createElementSpy = vi.spyOn(document, 'createElement');
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    renderHook(() => useKeyboardShortcuts(mockCallbacks, true));

    const event = new KeyboardEvent('keydown', { key: 'r' });
    document.dispatchEvent(event);

    expect(createElementSpy).toHaveBeenCalledWith('div');
    expect(appendChildSpy).toHaveBeenCalled();

    // Fast forward timers to test cleanup
    vi.advanceTimersByTime(1000);
    expect(removeChildSpy).toHaveBeenCalled();
  });
});