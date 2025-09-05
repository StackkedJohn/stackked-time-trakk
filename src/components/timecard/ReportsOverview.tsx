import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronLeft, ChevronRight, Calendar, BarChart3 } from 'lucide-react';
import { TimeEntry } from '@/hooks/useTimeEntries';
import { WeeklyReport } from './WeeklyReport';

export type ReportPeriod = 'weekly' | 'biweekly';

interface ReportsOverviewProps {
  entries: TimeEntry[];
}

export const ReportsOverview = ({ entries }: ReportsOverviewProps) => {
  console.log('ReportsOverview component rendering', { entries }); // Debug log
  const [isOpen, setIsOpen] = useState(true);
  const [periodType, setPeriodType] = useState<ReportPeriod>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());

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
    setCurrentDate(newDate);
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="glass rounded-2xl p-6">
        <div className="space-y-6">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer glass-hover rounded-lg p-2 -m-2">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 glass-text" />
                <h2 className="text-2xl font-semibold glass-text">Time Reports</h2>
                <ChevronDown className={`w-5 h-5 glass-text transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </div>
              
              {/* Period Type Selector */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPeriodType('weekly');
                  }}
                  variant={periodType === 'weekly' ? 'default' : 'ghost'}
                  size="sm"
                  className={`${
                    periodType === 'weekly' 
                      ? 'bg-primary/30 border-primary/50 glass-text' 
                      : 'glass-hover glass-text-muted hover:glass-text'
                  }`}
                >
                  Weekly
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPeriodType('biweekly');
                  }}
                  variant={periodType === 'biweekly' ? 'default' : 'ghost'}
                  size="sm"
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
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-6">
            {/* Period Navigation */}
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

            {/* Weekly Report Component */}
            <WeeklyReport
              entries={entries}
              periodType={periodType}
              currentDate={currentDate}
            />
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  );
};