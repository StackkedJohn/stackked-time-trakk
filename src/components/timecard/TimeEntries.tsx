import { Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface TimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  clockIn?: Date;
  clockOut?: Date;
}

interface TimeEntriesProps {
  entries: TimeEntry[];
  onDeleteEntry: (id: string) => void;
}

export const TimeEntries = ({ entries, onDeleteEntry }: TimeEntriesProps) => {
  const calculateHours = (entry: TimeEntry) => {
    if (entry.clockIn && entry.clockOut) {
      const diff = entry.clockOut.getTime() - entry.clockIn.getTime();
      return (diff / (1000 * 60 * 60)).toFixed(2);
    } else {
      const start = new Date(`${entry.date}T${entry.startTime}`);
      const end = new Date(`${entry.date}T${entry.endTime}`);
      const diff = end.getTime() - start.getTime();
      return (diff / (1000 * 60 * 60)).toFixed(2);
    }
  };

  const getTotalHours = () => {
    return entries.reduce((total, entry) => {
      return total + parseFloat(calculateHours(entry));
    }, 0).toFixed(2);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-6 h-6 glass-text" />
            <h2 className="text-2xl font-semibold glass-text">Time Entries</h2>
          </div>
          <div className="glass-lg rounded-lg px-4 py-2">
            <span className="glass-text-muted text-sm">Total Hours: </span>
            <span className="glass-text font-bold gradient-text text-lg">{getTotalHours()}</span>
          </div>
        </div>
        
        {entries.length === 0 ? (
          <div className="text-center py-8">
            <p className="glass-text-muted">No time entries yet. Clock in or add a manual entry to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="glass-lg rounded-xl p-4 glass-hover">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-4">
                      <span className="glass-text font-semibold">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="glass-text-muted">
                        {entry.clockIn && entry.clockOut ? (
                          <>
                            {formatDateTime(entry.clockIn)} - {formatDateTime(entry.clockOut)}
                          </>
                        ) : (
                          <>
                            {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                          </>
                        )}
                      </span>
                      <span className="glass-text font-bold text-accent">
                        {calculateHours(entry)}h
                      </span>
                    </div>
                    {entry.description && (
                      <p className="glass-text-subtle text-sm">{entry.description}</p>
                    )}
                  </div>
                  <Button
                    onClick={() => onDeleteEntry(entry.id)}
                    variant="ghost"
                    size="sm"
                    className="glass-hover text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};