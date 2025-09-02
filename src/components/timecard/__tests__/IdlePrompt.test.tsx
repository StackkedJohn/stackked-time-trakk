import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import { IdlePrompt } from '../IdlePrompt';

describe('IdlePrompt', () => {
  const defaultProps = {
    idleDuration: 5 * 60 * 1000, // 5 minutes
    onAction: vi.fn(),
    onDismiss: vi.fn(),
    isVisible: true
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders when visible', () => {
    render(<IdlePrompt {...defaultProps} />);
    
    expect(screen.getByText('Idle Time Detected')).toBeInTheDocument();
    expect(screen.getByText(/You were idle for/)).toBeInTheDocument();
  });

  test('does not render when not visible', () => {
    render(<IdlePrompt {...defaultProps} isVisible={false} />);
    
    expect(screen.queryByText('Idle Time Detected')).not.toBeInTheDocument();
  });

  test('displays formatted idle duration', () => {
    const fiveMinutes = 5 * 60 * 1000;
    render(<IdlePrompt {...defaultProps} idleDuration={fiveMinutes} />);
    
    expect(screen.getByText(/5m 0s/)).toBeInTheDocument();
  });

  test('calls onAction with keep when Keep Time button clicked', async () => {
    const user = userEvent.setup();
    render(<IdlePrompt {...defaultProps} />);
    
    const keepButton = screen.getByRole('button', { name: /keep idle time/i });
    await user.click(keepButton);
    
    expect(defaultProps.onAction).toHaveBeenCalledWith('keep');
  });

  test('calls onAction with discard when Discard Idle button clicked', async () => {
    const user = userEvent.setup();
    render(<IdlePrompt {...defaultProps} />);
    
    const discardButton = screen.getByRole('button', { name: /discard idle time/i });
    await user.click(discardButton);
    
    expect(defaultProps.onAction).toHaveBeenCalledWith('discard');
  });

  test('calls onAction with split when Split Session button clicked', async () => {
    const user = userEvent.setup();
    render(<IdlePrompt {...defaultProps} />);
    
    const splitButton = screen.getByRole('button', { name: /split session/i });
    await user.click(splitButton);
    
    expect(defaultProps.onAction).toHaveBeenCalledWith('split');
  });

  test('calls onDismiss when dismiss button clicked', async () => {
    const user = userEvent.setup();
    render(<IdlePrompt {...defaultProps} />);
    
    const dismissButton = screen.getByRole('button', { name: /dismiss idle prompt/i });
    await user.click(dismissButton);
    
    expect(defaultProps.onDismiss).toHaveBeenCalled();
  });

  test('disables action buttons after selection', async () => {
    const user = userEvent.setup();
    render(<IdlePrompt {...defaultProps} />);
    
    const keepButton = screen.getByRole('button', { name: /keep idle time/i });
    await user.click(keepButton);
    
    // All action buttons should be disabled
    expect(screen.getByRole('button', { name: /keep idle time/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /discard idle time/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /split session/i })).toBeDisabled();
  });

  test('shows processing message after action selection', async () => {
    const user = userEvent.setup();
    render(<IdlePrompt {...defaultProps} />);
    
    const keepButton = screen.getByRole('button', { name: /keep idle time/i });
    await user.click(keepButton);
    
    expect(screen.getByText('Processing keep action...')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    render(<IdlePrompt {...defaultProps} />);
    
    const prompt = screen.getByRole('alert');
    expect(prompt).toHaveAttribute('aria-live', 'polite');
    expect(prompt).toHaveAttribute('aria-atomic', 'true');
    expect(prompt).toHaveAttribute('aria-labelledby', 'idle-prompt-title');
    
    const title = screen.getByText('Idle Time Detected');
    expect(title).toHaveAttribute('id', 'idle-prompt-title');
  });

  test('shows correct button icons', () => {
    render(<IdlePrompt {...defaultProps} />);
    
    // Check that buttons contain their expected icons (by class name or test-id)
    const keepButton = screen.getByRole('button', { name: /keep idle time/i });
    const discardButton = screen.getByRole('button', { name: /discard idle time/i });
    const splitButton = screen.getByRole('button', { name: /split session/i });
    
    expect(keepButton).toBeInTheDocument();
    expect(discardButton).toBeInTheDocument();
    expect(splitButton).toBeInTheDocument();
  });

  test('handles different idle durations correctly', () => {
    const oneHour = 60 * 60 * 1000;
    render(<IdlePrompt {...defaultProps} idleDuration={oneHour} />);
    
    expect(screen.getByText(/1h 0m 0s/)).toBeInTheDocument();
  });
});