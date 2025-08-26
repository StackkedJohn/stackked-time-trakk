import { useState } from 'react';
import { TimeDisplay } from '@/components/timecard/TimeDisplay';
import { ClockInOut } from '@/components/timecard/ClockInOut';
import { ManualEntry } from '@/components/timecard/ManualEntry';
import { TimeEntries, TimeEntry } from '@/components/timecard/TimeEntries';
import { ReportPeriodSelector, ReportPeriod } from '@/components/timecard/ReportPeriodSelector';
import { WeeklyReport } from '@/components/timecard/WeeklyReport';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [currentClockIn, setCurrentClockIn] = useState<Date | null>(null);
  const [reportPeriod, setReportPeriod] = useState<ReportPeriod>('weekly');
  const [reportDate, setReportDate] = useState(new Date());
  const { toast } = useToast();

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
      const newEntry: TimeEntry = {
        id: Date.now().toString(),
        date: now.toISOString().split('T')[0],
        startTime: currentClockIn.toTimeString().slice(0, 5),
        endTime: now.toTimeString().slice(0, 5),
        clockIn: currentClockIn,
        clockOut: now,
        description: 'Clock In/Out Session'
      };
      
      setEntries(prev => [newEntry, ...prev]);
      setIsClockedIn(false);
      setCurrentClockIn(null);
      
      const hours = ((now.getTime() - currentClockIn.getTime()) / (1000 * 60 * 60)).toFixed(2);
      toast({
        title: "Clocked Out",
        description: `You worked for ${hours} hours`,
      });
    }
  };

  const handleAddManualEntry = (entry: { date: string; startTime: string; endTime: string; description: string }) => {
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      ...entry
    };
    
    setEntries(prev => [newEntry, ...prev]);
    toast({
      title: "Entry Added",
      description: "Manual time entry has been added successfully",
    });
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast({
      title: "Entry Deleted",
      description: "Time entry has been removed",
    });
  };

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold glass-text gradient-text mb-4">
            Timecard Tracker
          </h1>
          <p className="text-xl glass-text-muted">
            Track your time with beautiful glassmorphism design
          </p>
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