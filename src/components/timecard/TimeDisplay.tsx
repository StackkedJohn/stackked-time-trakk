import { useState, useEffect } from 'react';

export const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="glass-lg rounded-2xl p-8 text-center">
      <div className="space-y-2">
        <div className="text-6xl font-bold glass-text gradient-text">
          {formatTime(currentTime)}
        </div>
        <div className="text-xl glass-text-muted">
          {formatDate(currentTime)}
        </div>
      </div>
    </div>
  );
};