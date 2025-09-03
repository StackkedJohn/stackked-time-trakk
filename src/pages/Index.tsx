import { useState } from 'react';
import { TimeDisplay } from '@/components/timecard/TimeDisplay';
import { ClockInOut } from '@/components/timecard/ClockInOut';
import { ManualEntry } from '@/components/timecard/ManualEntry';
import { TimeEntries } from '@/components/timecard/TimeEntries';
import { ReportPeriodSelector, ReportPeriod } from '@/components/timecard/ReportPeriodSelector';
import { WeeklyReport } from '@/components/timecard/WeeklyReport';
import { CalendarView } from '@/components/timecard/CalendarView';
import { IdlePrompt } from '@/components/timecard/IdlePrompt';
import { useTimeEntries } from '@/hooks/useTimeEntries';
import { useTimer } from '@/hooks/useTimer';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, User, Keyboard } from 'lucide-react';

const Index = () => {
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('weekly');
  const [reportDate, setReportDate] = useState(new Date());
  const [showShortcuts, setShowShortcuts] = useState(false);
  
  const { entries, loading, addEntry, deleteEntry } = useTimeEntries();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  
  // Enhanced timer with smart switching and idle detection
  const { 
    isRunning,
    currentSession,
    startTimer,
    stopTimer,
    switchToLastTask,
    isIdle,
    idleDuration,
    showIdlePrompt,
    handleIdleAction,
    dismissIdlePrompt
  } = useTimer();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  // Timer actions that integrate with enhanced timer system
  const handleClockIn = () => {
    startTimer('Work Session');
  };

  const handleClockOut = () => {
    stopTimer();
  };

  // Keyboard shortcut callbacks
  const shortcutCallbacks = {
    onStartStop: () => {
      if (isRunning) {
        handleClockOut();
      } else {
        handleClockIn();
      }
    },
    onSwitchToLast: switchToLastTask,
    onNewManualEntry: () => {
      // Focus the manual entry form
      const manualEntrySection = document.querySelector('[data-manual-entry]');
      if (manualEntrySection) {
        manualEntrySection.scrollIntoView({ behavior: 'smooth' });
        const firstInput = manualEntrySection.querySelector('input');
        if (firstInput) {
          (firstInput as HTMLInputElement).focus();
        }
      }
    }
  };

  // Enable keyboard shortcuts
  const { shortcuts } = useKeyboardShortcuts(shortcutCallbacks);

  const handleAddManualEntry = (entry: { 
    startDate: string; 
    endDate: string; 
    startTime: string; 
    endTime: string; 
    description: string 
  }) => {
    const newEntry = {
      start_date: entry.startDate,
      end_date: entry.endDate,
      start_time: entry.startTime,
      end_time: entry.endTime,
      description: entry.description || undefined,
      entry_type: 'manual' as const
    };
    
    addEntry(newEntry);
  };

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <h1 className="text-5xl font-bold glass-text gradient-text mb-4">
              Stackked Time Trakk
            </h1>
            <p className="text-xl glass-text-muted font-bold">
              Stakk and Trakk Your Time Here!
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="glass rounded-xl px-4 py-2 flex items-center space-x-2">
              <User className="w-4 h-4 glass-text" />
              <span className="glass-text text-sm">{user?.email}</span>
            </div>
            <Button
              onClick={() => setShowShortcuts(!showShortcuts)}
              variant="ghost"
              size="sm"
              className="glass-hover glass-text hover:glass-text"
              aria-label="Toggle keyboard shortcuts help"
            >
              <Keyboard className="w-4 h-4 mr-2" />
              Shortcuts
            </Button>
            <Button
              onClick={handleSignOut}
              variant="ghost"
              size="sm"
              className="glass-hover glass-text hover:glass-text"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Current Time Display */}
        <div className="mb-8">
          <TimeDisplay />
        </div>

        {/* Keyboard Shortcuts Help */}
        {showShortcuts && (
          <div className="glass rounded-xl p-4 mb-8">
            <h3 className="text-lg font-semibold glass-text mb-3">Keyboard Shortcuts</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {shortcuts.map(shortcut => (
                <div key={shortcut.key} className="flex items-center space-x-2">
                  <kbd className="px-2 py-1 bg-primary/20 rounded text-xs font-mono glass-text">
                    {shortcut.key.toUpperCase()}
                  </kbd>
                  <span className="glass-text-muted">{shortcut.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Idle Detection Prompt */}
        <IdlePrompt
          idleDuration={idleDuration}
          onAction={handleIdleAction}
          onDismiss={dismissIdlePrompt}
          isVisible={showIdlePrompt}
        />

        {/* Main Content Tabs */}
        <Tabs defaultValue="timecard" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="glass glass-hover border-white/20">
              <TabsTrigger 
                value="timecard" 
                className="glass-text data-[state=active]:bg-primary/30 data-[state=active]:glass-text"
              >
                Time Tracking
              </TabsTrigger>
              <TabsTrigger 
                value="reports" 
                className="glass-text data-[state=active]:bg-primary/30 data-[state=active]:glass-text"
              >
                Reports
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="timecard" className="space-y-8">
            {/* Clock In/Out and Manual Entry */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ClockInOut
                onClockIn={handleClockIn}
                onClockOut={handleClockOut}
                isClockedIn={isRunning}
              />
              <div data-manual-entry>
                <ManualEntry onAddEntry={handleAddManualEntry} />
              </div>
            </div>

            {/* Time Entries */}
            <TimeEntries
              entries={entries}
              onDeleteEntry={handleDeleteEntry}
            />
          </TabsContent>

          <TabsContent value="reports" className="space-y-8">
            <ReportPeriodSelector
              periodType={reportPeriod}
              currentDate={reportDate}
              onPeriodChange={setReportPeriod}
              onDateChange={setReportDate}
            />
            
            <CalendarView entries={entries} />
            
            <WeeklyReport
              entries={entries}
              periodType={reportPeriod}
              currentDate={reportDate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;