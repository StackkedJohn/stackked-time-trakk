import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { TimeEntry } from '@/hooks/useTimeEntries';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  entries: TimeEntry[];
}

export const CalendarView = ({ entries }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'weekly' | 'biweekly' | 'monthly'>('monthly');

  const calculateDayHours = (date: Date) => {
    const dayEntries = entries.filter(entry => {
      const entryStartDate = new Date(entry.start_date);
      const entryEndDate = new Date(entry.end_date);
      
      // Check if the date falls within the entry's date range
      return date >= entryStartDate && date <= entryEndDate;
    });

    return dayEntries.reduce((total, entry) => {
      const startDate = new Date(entry.start_date + 'T00:00:00');
      const endDate = new Date(entry.end_date + 'T00:00:00');
      
      const [startHours, startMinutes] = entry.start_time.split(':').map(Number);
      const [endHours, endMinutes] = entry.end_time.split(':').map(Number);
      
      startDate.setHours(startHours, startMinutes, 0, 0);
      endDate.setHours(endHours, endMinutes, 0, 0);
      
      const diff = endDate.getTime() - startDate.getTime();
      return total + (diff / (1000 * 60 * 60));
    }, 0);
  };

  const getWeeklyTotal = (weekStart: Date) => {
    const weekEnd = endOfWeek(weekStart);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    return weekDays.reduce((total, day) => {
      return total + calculateDayHours(day);
    }, 0);
  };

  const getBiWeeklyTotal = () => {
    const weekStart = startOfWeek(currentDate);
    const firstWeekTotal = getWeeklyTotal(weekStart);
    const secondWeekTotal = getWeeklyTotal(addWeeks(weekStart, 1));
    return firstWeekTotal + secondWeekTotal;
  };

  const getMonthlyTotal = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return monthDays.reduce((total, day) => {
      return total + calculateDayHours(day);
    }, 0);
  };

  const getCurrentWeeks = () => {
    const weekStart = startOfWeek(currentDate);
    return [
      { start: weekStart, end: endOfWeek(weekStart) },
      { start: addWeeks(weekStart, 1), end: endOfWeek(addWeeks(weekStart, 1)) }
    ];
  };

  const renderDayContent = (date: Date) => {
    const hours = calculateDayHours(date);
    const isCurrentMonth = isSameMonth(date, currentDate);
    
    return (
      <div className={cn(
        "w-full h-full flex flex-col items-center justify-center p-1",
        !isCurrentMonth && "opacity-50"
      )}>
        <span className="text-sm">{format(date, 'd')}</span>
        {hours > 0 && (
          <Badge 
            variant="secondary" 
            className="text-xs px-1 py-0 bg-primary/20 text-primary border-primary/30"
          >
            {hours.toFixed(1)}h
          </Badge>
        )}
      </div>
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1);
    setCurrentDate(newDate);
  };

  return (
    <div className="glass rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-6 h-6 glass-text" />
          <h2 className="text-2xl font-semibold glass-text">Calendar View</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewType('weekly')}
            className={cn(
              "glass glass-hover border-white/20",
              viewType === 'weekly' && "bg-primary/20 border-primary/50"
            )}
          >
            Weekly
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewType('biweekly')}
            className={cn(
              "glass glass-hover border-white/20",
              viewType === 'biweekly' && "bg-primary/20 border-primary/50"
            )}
          >
            Bi-Weekly
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewType('monthly')}
            className={cn(
              "glass glass-hover border-white/20",
              viewType === 'monthly' && "bg-primary/20 border-primary/50"
            )}
          >
            Monthly
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => viewType === 'monthly' ? navigateMonth('prev') : navigateWeek('prev')}
          className="glass-hover"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <h3 className="text-lg font-semibold glass-text">
          {viewType === 'monthly' 
            ? format(currentDate, 'MMMM yyyy')
            : `Week of ${format(startOfWeek(currentDate), 'MMM d, yyyy')}`
          }
        </h3>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => viewType === 'monthly' ? navigateMonth('next') : navigateWeek('next')}
          className="glass-hover"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Calendar */}
      <div className="glass-lg rounded-xl p-4">
        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={(date) => date && setCurrentDate(date)}
          month={currentDate}
          onMonthChange={setCurrentDate}
          className="w-full pointer-events-auto"
          components={{
            DayContent: ({ date }) => renderDayContent(date)
          }}
          classNames={{
            months: "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
            month: "space-y-4 w-full flex flex-col",
            table: "w-full h-full border-collapse space-y-1",
            head_row: "flex w-full",
            head_cell: "glass-text-muted rounded-md w-full font-normal text-[0.8rem] flex-1 text-center",
            row: "flex w-full mt-2",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1 h-16",
            day: "h-full w-full p-0 font-normal glass-hover rounded-lg",
            day_selected: "bg-primary/30 text-primary-foreground hover:bg-primary/40",
            day_today: "bg-accent/20 text-accent-foreground",
            day_outside: "opacity-50",
          }}
        />
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {viewType === 'weekly' && (
          <Card className="glass-lg p-4">
            <h4 className="glass-text font-semibold mb-2">Weekly Total</h4>
            <p className="text-2xl font-bold gradient-text">
              {getWeeklyTotal(startOfWeek(currentDate)).toFixed(1)}h
            </p>
          </Card>
        )}
        
        {viewType === 'biweekly' && (
          <>
            {getCurrentWeeks().map((week, index) => (
              <Card key={index} className="glass-lg p-4">
                <h4 className="glass-text font-semibold mb-2">
                  Week {index + 1}
                </h4>
                <p className="text-sm glass-text-muted mb-1">
                  {format(week.start, 'MMM d')} - {format(week.end, 'MMM d')}
                </p>
                <p className="text-xl font-bold gradient-text">
                  {getWeeklyTotal(week.start).toFixed(1)}h
                </p>
              </Card>
            ))}
            <Card className="glass-lg p-4">
              <h4 className="glass-text font-semibold mb-2">Bi-Weekly Total</h4>
              <p className="text-2xl font-bold gradient-text">
                {getBiWeeklyTotal().toFixed(1)}h
              </p>
            </Card>
          </>
        )}
        
        {viewType === 'monthly' && (
          <Card className="glass-lg p-4">
            <h4 className="glass-text font-semibold mb-2">Monthly Total</h4>
            <p className="text-2xl font-bold gradient-text">
              {getMonthlyTotal().toFixed(1)}h
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};