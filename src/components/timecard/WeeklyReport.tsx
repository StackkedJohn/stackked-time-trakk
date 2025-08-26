import { TimeEntry } from '@/hooks/useTimeEntries';
import { BarChart3, Clock, TrendingUp } from 'lucide-react';

export type ReportPeriod = 'weekly' | 'biweekly';

interface WeeklyReportProps {
  entries: TimeEntry[];
  periodType: ReportPeriod;
  currentDate: Date;
}

export const WeeklyReport = ({ entries, periodType, currentDate }: WeeklyReportProps) => {
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const getBiweekStart = (date: Date) => {
    const weekStart = getWeekStart(date);
    const weekNumber = Math.floor((weekStart.getTime() - getWeekStart(new Date(weekStart.getFullYear(), 0, 1)).getTime()) / (7 * 24 * 60 * 60 * 1000));
    const biweekOffset = weekNumber % 2;
    return new Date(weekStart.getTime() - (biweekOffset * 7 * 24 * 60 * 60 * 1000));
  };

  const getCurrentPeriodStart = () => {
    return periodType === 'weekly' ? getWeekStart(currentDate) : getBiweekStart(currentDate);
  };

  const getCurrentPeriodEnd = () => {
    const start = getCurrentPeriodStart();
    const days = periodType === 'weekly' ? 6 : 13;
    return new Date(start.getTime() + (days * 24 * 60 * 60 * 1000));
  };

  const getFilteredEntries = () => {
    const start = getCurrentPeriodStart();
    const end = getCurrentPeriodEnd();
    
    return entries.filter(entry => {
      const entryDate = new Date(entry.start_date);
      return entryDate >= start && entryDate <= end;
    });
  };

  const calculateHours = (entry: TimeEntry) => {
    const start = new Date(`${entry.start_date}T${entry.start_time}`);
    const end = new Date(`${entry.end_date}T${entry.end_time}`);
    const diff = end.getTime() - start.getTime();
    return diff / (1000 * 60 * 60);
  };

  const getGroupedByDay = () => {
    const filtered = getFilteredEntries();
    const grouped: { [key: string]: TimeEntry[] } = {};
    
    filtered.forEach(entry => {
      const date = entry.start_date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(entry);
    });
    
    return grouped;
  };

  const getDayTotals = () => {
    const grouped = getGroupedByDay();
    const dayTotals: { date: string; hours: number; dayName: string }[] = [];
    
    Object.entries(grouped).forEach(([date, dayEntries]) => {
      const totalHours = dayEntries.reduce((sum, entry) => sum + calculateHours(entry), 0);
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
      dayTotals.push({ date, hours: totalHours, dayName });
    });
    
    return dayTotals.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getTotalHours = () => {
    return getFilteredEntries().reduce((total, entry) => total + calculateHours(entry), 0);
  };

  const getAverageDaily = () => {
    const dayTotals = getDayTotals();
    const workingDays = dayTotals.filter(day => day.hours > 0).length;
    return workingDays > 0 ? getTotalHours() / workingDays : 0;
  };

  const filteredEntries = getFilteredEntries();
  const totalHours = getTotalHours();
  const dayTotals = getDayTotals();
  const averageDaily = getAverageDaily();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-lg rounded-xl p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-8 h-8 text-accent" />
          </div>
          <div className="text-3xl font-bold gradient-text mb-1">
            {totalHours.toFixed(1)}h
          </div>
          <div className="glass-text-muted text-sm">
            Total {periodType === 'weekly' ? 'Weekly' : 'Bi-Weekly'} Hours
          </div>
        </div>
        
        <div className="glass-lg rounded-xl p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
          <div className="text-3xl font-bold gradient-text mb-1">
            {averageDaily.toFixed(1)}h
          </div>
          <div className="glass-text-muted text-sm">
            Average Daily Hours
          </div>
        </div>
        
        <div className="glass-lg rounded-xl p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <BarChart3 className="w-8 h-8 text-purple-400" />
          </div>
          <div className="text-3xl font-bold gradient-text mb-1">
            {dayTotals.filter(day => day.hours > 0).length}
          </div>
          <div className="glass-text-muted text-sm">
            Working Days
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      {dayTotals.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold glass-text mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Daily Breakdown
          </h3>
          <div className="space-y-3">
            {dayTotals.map((day) => (
              <div key={day.date} className="glass-lg rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="glass-text font-medium">{day.dayName}</div>
                    <div className="glass-text-muted text-sm">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="glass-text font-bold text-lg text-accent">
                      {day.hours.toFixed(2)}h
                    </div>
                    <div className="glass-text-subtle text-sm">
                      {((day.hours / totalHours) * 100).toFixed(0)}% of period
                    </div>
                  </div>
                </div>
                {/* Visual bar */}
                <div className="mt-3 bg-white/5 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.max((day.hours / Math.max(...dayTotals.map(d => d.hours))) * 100, 2)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Entries */}
      {filteredEntries.length > 0 && (
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-semibold glass-text mb-4">
            Period Entries ({filteredEntries.length})
          </h3>
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <div key={entry.id} className="glass-lg rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="glass-text font-medium">
                      {new Date(entry.start_date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    {entry.description && (
                      <div className="glass-text-subtle text-sm mt-1">
                        {entry.description}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="glass-text font-bold text-accent">
                      {calculateHours(entry).toFixed(2)}h
                    </div>
                    <div className="glass-text-muted text-sm">
                      {entry.start_time} - {entry.end_time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredEntries.length === 0 && (
        <div className="glass rounded-2xl p-8 text-center">
          <BarChart3 className="w-16 h-16 glass-text-subtle mx-auto mb-4" />
          <h3 className="text-xl glass-text mb-2">No Entries Found</h3>
          <p className="glass-text-muted">
            No time entries found for this {periodType === 'weekly' ? 'week' : 'bi-weekly period'}.
            <br />
            Start tracking time to see your reports here.
          </p>
        </div>
      )}
    </div>
  );
};