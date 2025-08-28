import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, AlertCircle, Pause, Play, Split } from 'lucide-react';
import { formatDuration } from '@/services/TimerService';

export type IdleAction = 'keep' | 'discard' | 'split';

interface IdlePromptProps {
  idleDuration: number;
  onAction: (action: IdleAction) => void;
  onDismiss: () => void;
  isVisible: boolean;
}

export const IdlePrompt = ({ 
  idleDuration, 
  onAction, 
  onDismiss, 
  isVisible 
}: IdlePromptProps) => {
  const [selectedAction, setSelectedAction] = useState<IdleAction | null>(null);

  if (!isVisible) return null;

  const handleAction = (action: IdleAction) => {
    setSelectedAction(action);
    onAction(action);
  };

  return (
    <Card 
      className="glass border-orange-400/50 bg-orange-500/10 p-4 mb-4"
      role="alert"
      aria-live="polite"
      aria-labelledby="idle-prompt-title"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 
            id="idle-prompt-title"
            className="text-sm font-medium glass-text mb-1"
          >
            Idle Time Detected
          </h3>
          <p className="text-sm glass-text-muted mb-3">
            You were idle for <strong>{formatDuration(idleDuration)}</strong>. 
            What would you like to do with this time?
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAction('keep')}
              disabled={selectedAction !== null}
              className="flex items-center space-x-2 glass-text border-green-400/50 hover:bg-green-500/20"
              aria-label="Keep idle time as part of work session"
            >
              <Clock className="w-4 h-4" />
              <span>Keep Time</span>
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAction('discard')}
              disabled={selectedAction !== null}
              className="flex items-center space-x-2 glass-text border-red-400/50 hover:bg-red-500/20"
              aria-label="Discard idle time from work session"
            >
              <Pause className="w-4 h-4" />
              <span>Discard Idle</span>
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAction('split')}
              disabled={selectedAction !== null}
              className="flex items-center space-x-2 glass-text border-blue-400/50 hover:bg-blue-500/20"
              aria-label="Split session at idle time"
            >
              <Split className="w-4 h-4" />
              <span>Split Session</span>
            </Button>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="flex-shrink-0 glass-text hover:glass-text opacity-70 hover:opacity-100"
          aria-label="Dismiss idle prompt"
        >
          ×
        </Button>
      </div>
      
      {selectedAction && (
        <div className="mt-2 text-xs glass-text-muted">
          Processing {selectedAction} action...
        </div>
      )}
    </Card>
  );
};