import { useState } from 'react';
import { TimeDisplay } from '@/components/timecard/TimeDisplay';
import { ClockInOut } from '@/components/timecard/ClockInOut';
import { ManualEntry } from '@/components/timecard/ManualEntry';
import { TimeEntries } from '@/components/timecard/TimeEntries';
import { ReportPeriodSelector, ReportPeriod } from '@/components/timecard/ReportPeriodSelector';
import { WeeklyReport } from '@/components/timecard/WeeklyReport';
import { useTimeEntries } from '@/hooks/useTimeEntries';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

const Index = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentClockIn, setCurrentClockIn] = useState<Date | null>(null);
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('weekly');
  const [reportDate, setReportDate] = useState(new Date());
  const { entries, loading, addEntry, deleteEntry } = useTimeEntries();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

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

  const handleClockIn = () => {
    const now = new Date();
    setIsClockedIn(true);
    setCurrentClockIn(now);
    toast({
      title: "Clocked In",
      description: `You clocked in at ${now.toLocaleTimeString()}`,
    });
  };

  const handleClockOut = () => {
    if (currentClockIn) {
      const now = new Date();
      const clockInDate = currentClockIn.toISOString().split('T')[0];
      const clockOutDate = now.toISOString().split('T')[0];
      
      const newEntry = {
        start_date: clockInDate,
        end_date: clockOutDate,
        start_time: currentClockIn.toTimeString().slice(0, 5),
        end_time: now.toTimeString().slice(0, 5),
        description: 'Clock In/Out Session',
        entry_type: 'clock' as const
      };
      
      addEntry(newEntry);
      setIsClockedIn(false);
      setCurrentClockIn(null);
      
      const hours = ((now.getTime() - currentClockIn.getTime()) / (1000 * 60 * 60)).toFixed(2);
      toast({
        title: "Clocked Out",
        description: `You worked for ${hours} hours`,
      });
    }
  };

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
            <p className="text-xl glass-text-muted">
              Stakk your hours here
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="glass rounded-xl px-4 py-2 flex items-center space-x-2">
              <User className="w-4 h-4 glass-text" />
              <span className="glass-text text-sm">{user?.email}</span>
            </div>
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
                isClockedIn={isClockedIn}
              />
              <ManualEntry onAddEntry={handleAddManualEntry} />
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