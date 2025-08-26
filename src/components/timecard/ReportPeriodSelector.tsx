import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export type ReportPeriod = 'weekly' | 'biweekly';

interface ReportPeriodSelectorProps {
  periodType: ReportPeriod;
  currentDate: Date;
  onPeriodChange: (period: ReportPeriod) => void;
  onDateChange: (date: Date) => void;
}

export const ReportPeriodSelector = ({
  periodType,
  currentDate,
  onPeriodChange,
  onDateChange
}: ReportPeriodSelectorProps) => {
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

  const navigatePeriod = (direction: 'prev' | 'next') => {
    const days = periodType === 'weekly' ? 7 : 14;
    const multiplier = direction === 'next' ? 1 : -1;
    const newDate = new Date(currentDate.getTime() + (days * 24 * 60 * 60 * 1000 * multiplier));
    onDateChange(newDate);
  };

  const formatPeriodRange = () => {
    const start = getCurrentPeriodStart();
    const end = getCurrentPeriodEnd();
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: start.getFullYear() !== end.getFullYear() ? 'numeric' : undefined
      });
    };

    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 glass-text" />
            <h2 className="text-2xl font-semibold glass-text">Time Reports</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => onPeriodChange('weekly')}
              variant={periodType === 'weekly' ? 'default' : 'ghost'}
              className={`${
                periodType === 'weekly' 
                  ? 'bg-primary/30 border-primary/50 glass-text' 
                  : 'glass-hover glass-text-muted hover:glass-text'
              }`}
            >
              Weekly
            </Button>
            <Button
              onClick={() => onPeriodChange('biweekly')}
              variant={periodType === 'biweekly' ? 'default' : 'ghost'}
              className={`${
                periodType === 'biweekly' 
                  ? 'bg-primary/30 border-primary/50 glass-text' 
                  : 'glass-hover glass-text-muted hover:glass-text'
              }`}
            >
              Bi-Weekly
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigatePeriod('prev')}
            variant="ghost"
            size="sm"
            className="glass-hover glass-text"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <div className="glass-lg rounded-lg px-4 py-2">
            <span className="glass-text font-semibold text-lg">
              {formatPeriodRange()}
            </span>
          </div>
          
          <Button
            onClick={() => navigatePeriod('next')}
            variant="ghost"
            size="sm"
            className="glass-hover glass-text"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};