import { useState, useEffect } from 'react';

export interface WizardState {
  currentStep: number;
  isCompleted: boolean;
  clientId?: string;
  projectId?: string;
}

const WIZARD_STORAGE_KEY = 'stackked-wizard-state';

export const useWizard = () => {
  const [wizardState, setWizardState] = useState<WizardState>({
    currentStep: 1,
    isCompleted: false,
  });

  // Load wizard state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(WIZARD_STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setWizardState(parsed);
      } catch (error) {
        console.error('Error parsing wizard state:', error);
        // Reset to default if corrupted
        localStorage.removeItem(WIZARD_STORAGE_KEY);
      }
    }
  }, []);

  // Save wizard state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(wizardState));
  }, [wizardState]);

  const nextStep = () => {
    setWizardState(prev => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 3),
    }));
  };

  const prevStep = () => {
    setWizardState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  };

  const setClientId = (clientId: string) => {
    setWizardState(prev => ({
      ...prev,
      clientId,
    }));
  };

  const setProjectId = (projectId: string) => {
    setWizardState(prev => ({
      ...prev,
      projectId,
    }));
  };

  const completeWizard = () => {
    setWizardState(prev => ({
      ...prev,
      isCompleted: true,
    }));
  };

  const resetWizard = () => {
    setWizardState({
      currentStep: 1,
      isCompleted: false,
    });
    localStorage.removeItem(WIZARD_STORAGE_KEY);
  };

  const shouldShowWizard = () => {
    return !wizardState.isCompleted;
  };

  return {
    wizardState,
    nextStep,
    prevStep,
    setClientId,
    setProjectId,
    completeWizard,
    resetWizard,
    shouldShowWizard,
  };
};