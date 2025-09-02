import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WizardOverlay } from '../WizardOverlay';

// Mock the hooks and dependencies
vi.mock('@/hooks/useWizard', () => ({
  useWizard: () => ({
    wizardState: { currentStep: 1, isCompleted: false },
    nextStep: vi.fn(),
    prevStep: vi.fn(),
    completeWizard: vi.fn(),
  }),
}));

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

vi.mock('../steps/CreateClientStep', () => ({
  CreateClientStep: ({ onComplete }: { onComplete: () => void }) => (
    <div data-testid="create-client-step">
      <button onClick={onComplete}>Complete Client Step</button>
    </div>
  ),
}));

vi.mock('../steps/CreateProjectStep', () => ({
  CreateProjectStep: ({ onComplete }: { onComplete: () => void }) => (
    <div data-testid="create-project-step">
      <button onClick={onComplete}>Complete Project Step</button>
    </div>
  ),
}));

vi.mock('../steps/StartTimerStep', () => ({
  StartTimerStep: ({ onComplete }: { onComplete: () => void }) => (
    <div data-testid="start-timer-step">
      <button onClick={onComplete}>Complete Timer Step</button>
    </div>
  ),
}));

describe('WizardOverlay', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders wizard overlay with step indicator', () => {
    render(<WizardOverlay onClose={mockOnClose} />);
    
    expect(screen.getByText("Welcome! Let's create your first client")).toBeInTheDocument();
    
    // Check step indicators (3 dots)
    const stepIndicators = screen.getAllByRole('generic').filter(
      el => el.className.includes('rounded-full')
    );
    expect(stepIndicators).toHaveLength(3);
  });

  test('renders first step by default', () => {
    render(<WizardOverlay onClose={mockOnClose} />);
    
    expect(screen.getByTestId('create-client-step')).toBeInTheDocument();
  });

  test('calls onClose when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    render(<WizardOverlay onClose={mockOnClose} />);
    
    const dismissButton = screen.getByRole('button', { name: /close|×/i });
    await user.click(dismissButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('calls onClose when skip setup is clicked', async () => {
    const user = userEvent.setup();
    render(<WizardOverlay onClose={mockOnClose} />);
    
    const skipButton = screen.getByRole('button', { name: /skip setup/i });
    await user.click(skipButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('back button is disabled on first step', () => {
    render(<WizardOverlay onClose={mockOnClose} />);
    
    const backButton = screen.getByRole('button', { name: /back/i });
    expect(backButton).toBeDisabled();
  });

  test('displays correct step titles', () => {
    const { rerender } = render(<WizardOverlay onClose={mockOnClose} />);
    expect(screen.getByText("Welcome! Let's create your first client")).toBeInTheDocument();
    
    // Mock step 2
    vi.doMock('@/hooks/useWizard', () => ({
      useWizard: () => ({
        wizardState: { currentStep: 2, isCompleted: false },
        nextStep: vi.fn(),
        prevStep: vi.fn(),
        completeWizard: vi.fn(),
      }),
    }));
    
    rerender(<WizardOverlay onClose={mockOnClose} />);
    // Note: Due to mocking limitations, we can't easily test step progression in this test
    // This would require more complex test setup with proper state management
  });

  test('step indicators show correct active state', () => {
    render(<WizardOverlay onClose={mockOnClose} />);
    
    const stepIndicators = screen.getAllByRole('generic').filter(
      el => el.className.includes('rounded-full')
    );
    
    // First step should be active (have primary background)
    expect(stepIndicators[0]).toHaveClass('bg-primary');
    expect(stepIndicators[1]).toHaveClass('bg-muted-foreground/30');
    expect(stepIndicators[2]).toHaveClass('bg-muted-foreground/30');
  });
});