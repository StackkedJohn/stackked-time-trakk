import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWizard } from '../useWizard';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('useWizard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
  });

  test('initializes with default state when no saved state exists', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useWizard());
    
    expect(result.current.wizardState).toEqual({
      currentStep: 1,
      isCompleted: false,
    });
    expect(result.current.shouldShowWizard()).toBe(true);
  });

  test('loads saved state from localStorage', () => {
    const savedState = {
      currentStep: 2,
      isCompleted: false,
      clientId: 'client-123',
      projectId: 'project-456',
    };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState));
    
    const { result } = renderHook(() => useWizard());
    
    expect(result.current.wizardState).toEqual(savedState);
  });

  test('handles corrupted localStorage data gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid-json');
    
    const { result } = renderHook(() => useWizard());
    
    expect(result.current.wizardState).toEqual({
      currentStep: 1,
      isCompleted: false,
    });
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('stackked-wizard-state');
  });

  test('saves state to localStorage when state changes', () => {
    const { result } = renderHook(() => useWizard());
    
    act(() => {
      result.current.nextStep();
    });
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'stackked-wizard-state',
      JSON.stringify({
        currentStep: 2,
        isCompleted: false,
      })
    );
  });

  test('nextStep increments step up to maximum of 3', () => {
    const { result } = renderHook(() => useWizard());
    
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.wizardState.currentStep).toBe(2);
    
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.wizardState.currentStep).toBe(3);
    
    act(() => {
      result.current.nextStep();
    });
    expect(result.current.wizardState.currentStep).toBe(3); // Should not exceed 3
  });

  test('prevStep decrements step down to minimum of 1', () => {
    const savedState = { currentStep: 3, isCompleted: false };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState));
    
    const { result } = renderHook(() => useWizard());
    
    act(() => {
      result.current.prevStep();
    });
    expect(result.current.wizardState.currentStep).toBe(2);
    
    act(() => {
      result.current.prevStep();
    });
    expect(result.current.wizardState.currentStep).toBe(1);
    
    act(() => {
      result.current.prevStep();
    });
    expect(result.current.wizardState.currentStep).toBe(1); // Should not go below 1
  });

  test('setClientId updates client ID', () => {
    const { result } = renderHook(() => useWizard());
    
    act(() => {
      result.current.setClientId('client-123');
    });
    
    expect(result.current.wizardState.clientId).toBe('client-123');
  });

  test('setProjectId updates project ID', () => {
    const { result } = renderHook(() => useWizard());
    
    act(() => {
      result.current.setProjectId('project-456');
    });
    
    expect(result.current.wizardState.projectId).toBe('project-456');
  });

  test('completeWizard marks wizard as completed', () => {
    const { result } = renderHook(() => useWizard());
    
    act(() => {
      result.current.completeWizard();
    });
    
    expect(result.current.wizardState.isCompleted).toBe(true);
    expect(result.current.shouldShowWizard()).toBe(false);
  });

  test('resetWizard resets state and clears localStorage', () => {
    const savedState = { currentStep: 3, isCompleted: true, clientId: 'client-123' };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState));
    
    const { result } = renderHook(() => useWizard());
    
    act(() => {
      result.current.resetWizard();
    });
    
    expect(result.current.wizardState).toEqual({
      currentStep: 1,
      isCompleted: false,
    });
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('stackked-wizard-state');
  });

  test('shouldShowWizard returns false when wizard is completed', () => {
    const savedState = { currentStep: 3, isCompleted: true };
    localStorageMock.getItem.mockReturnValue(JSON.stringify(savedState));
    
    const { result } = renderHook(() => useWizard());
    
    expect(result.current.shouldShowWizard()).toBe(false);
  });
});