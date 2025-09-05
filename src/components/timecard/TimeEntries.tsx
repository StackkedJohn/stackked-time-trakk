import { useState } from 'react';
import { Trash2, Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TimeEntry } from '@/hooks/useTimeEntries';

interface TimeEntriesProps {
  entries: TimeEntry[];
  onDeleteEntry: (id: string) => void;
}

export const TimeEntries = ({ entries, onDeleteEntry }: TimeEntriesProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const calculateHours = (entry: TimeEntry) => {
    // Create dates with explicit timezone handling to prevent date shifts
    const startDate = new Date(entry.start_date + 'T00:00:00');
    const endDate = new Date(entry.end_date + 'T00:00:00');
    
    // Parse time components
    const [startHours, startMinutes] = entry.start_time.split(':').map(Number);
    const [endHours, endMinutes] = entry.end_time.split(':').map(Number);
    
    // Set the times on the correct dates
    startDate.setHours(startHours, startMinutes, 0, 0);
    endDate.setHours(endHours, endMinutes, 0, 0);
    
    const diff = endDate.getTime() - startDate.getTime();
    return (diff / (1000 * 60 * 60)).toFixed(2);
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="glass rounded-2xl p-6">
        <div className="space-y-6">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer glass-hover rounded-lg p-2 -m-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-6 h-6 glass-text" />
                <h2 className="text-2xl font-semibold glass-text">Time Entries</h2>
                <ChevronDown className={`w-5 h-5 glass-text transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
              <div className="glass-lg rounded-lg px-4 py-2">
                <span className="glass-text-muted text-sm">Total Hours: </span>
                <span className="glass-text font-bold gradient-text text-lg">{getTotalHours()}</span>
              </div>
            </div>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-6">
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
                            {entry.start_date === entry.end_date ? (
                              new Date(entry.start_date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })
                            ) : (
                              `${new Date(entry.start_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })} - ${new Date(entry.end_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}`
                            )}
                          </span>
                          <span className="glass-text-muted">
                            {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
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
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  );
};