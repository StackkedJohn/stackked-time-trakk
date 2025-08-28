import { useEffect, useCallback } from 'react';

export interface ShortcutConfig {
  key: string;
  action: () => void;
  description: string;
  enabled: boolean;
}

export interface ShortcutCallbacks {
  onStartStop: () => void;
  onSwitchToLast: () => void;
  onNewManualEntry: () => void;
}

/**
 * Hook for managing keyboard shortcuts with accessibility
 */
export const useKeyboardShortcuts = (callbacks: ShortcutCallbacks, enabled: boolean = true) => {
  const shortcuts: ShortcutConfig[] = [
    {
      key: 'r',
      action: callbacks.onStartStop,
      description: 'Start/Stop timer',
      enabled
    },
    {
      key: 's',
      action: callbacks.onSwitchToLast,
      description: 'Switch to last task',
      enabled
    },
    {
      key: 'n',
      action: callbacks.onNewManualEntry,
      description: 'New manual entry',
      enabled
    }
  ];

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Only trigger shortcuts when not in input fields
    const target = event.target as HTMLElement;
    const isInputElement = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true';
    
    if (isInputElement || !enabled) {
      return;
    }

    // Check for shortcuts (case insensitive)
    const key = event.key.toLowerCase();
    const shortcut = shortcuts.find(s => s.key === key && s.enabled);
    
    if (shortcut) {
      event.preventDefault();
      shortcut.action();
      
      // Announce action for screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.position = 'absolute';
      announcement.style.left = '-10000px';
      announcement.textContent = `Shortcut activated: ${shortcut.description}`;
      document.body.appendChild(announcement);
      
      // Clean up after announcement
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);

  return {
    shortcuts: shortcuts.filter(s => s.enabled),
    enabled
  };
};