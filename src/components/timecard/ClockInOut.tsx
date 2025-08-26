import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Play, Square } from 'lucide-react';

interface ClockInOutProps {
  onClockIn: () => void;
  onClockOut: () => void;
  isClockedIn: boolean;
}

export const ClockInOut = ({ onClockIn, onClockOut, isClockedIn }: ClockInOutProps) => {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-2">
          <Clock className="w-6 h-6 glass-text" />
          <h2 className="text-2xl font-semibold glass-text">Time Clock</h2>
        </div>
        
        <div className="space-y-4">
          {!isClockedIn ? (
            <Button
              onClick={onClockIn}
              size="lg"
              className="w-full bg-green-500/20 hover:bg-green-500/30 border-green-400/50 glass-text glass-glow transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Clock In
            </Button>
          ) : (
            <Button
              onClick={onClockOut}
              size="lg"
              className="w-full bg-red-500/20 hover:bg-red-500/30 border-red-400/50 glass-text glass-glow transition-all duration-300"
            >
              <Square className="w-5 h-5 mr-2" />
              Clock Out
            </Button>
          )}
        </div>
        
        <div className="text-sm glass-text-muted">
          Status: <span className={`font-semibold ${isClockedIn ? 'text-green-400' : 'text-red-400'}`}>
            {isClockedIn ? 'Clocked In' : 'Clocked Out'}
          </span>
        </div>
      </div>
    </div>
  );
};