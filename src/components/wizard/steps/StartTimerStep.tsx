import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Sparkles, Keyboard } from 'lucide-react';
import { useTimer } from '@/hooks/useTimer';

interface StartTimerStepProps {
  onComplete: () => void;
  projectId?: string;
}

export const StartTimerStep = ({ onComplete, projectId }: StartTimerStepProps) => {
  const [description, setDescription] = useState('');
  const { startTimer } = useTimer();

  const handleStartTimer = () => {
    const taskDescription = description.trim() || 'First timer session';
    startTimer(taskDescription);
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <p className="text-sm text-muted-foreground">
          You're all set! Let's start your first timer session.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timer-description">What are you working on?</Label>
        <Input
          id="timer-description"
          type="text"
          placeholder="Planning meeting, coding, design work..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          autoFocus
        />
      </div>

      <Button
        onClick={handleStartTimer}
        className="w-full bg-primary hover:bg-primary/90"
        size="lg"
      >
        <Play className="mr-2 h-4 w-4" />
        Start Your First Timer!
      </Button>

      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex items-center space-x-2">
          <Keyboard className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">Pro tip!</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Press <kbd className="px-2 py-1 bg-background border rounded text-xs">R</kbd> to quickly start/stop timers,{' '}
          <kbd className="px-2 py-1 bg-background border rounded text-xs">S</kbd> to switch to your last task, and{' '}
          <kbd className="px-2 py-1 bg-background border rounded text-xs">N</kbd> for manual entries.
        </p>
      </div>
    </div>
  );
};