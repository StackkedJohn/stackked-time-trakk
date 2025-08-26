import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface ManualEntryProps {
  onAddEntry: (entry: { date: string; startTime: string; endTime: string; description: string }) => void;
}

export const ManualEntry = ({ onAddEntry }: ManualEntryProps) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && startTime && endTime) {
      onAddEntry({ date, startTime, endTime, description });
      setStartTime('');
      setEndTime('');
      setDescription('');
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Plus className="w-6 h-6 glass-text" />
          <h2 className="text-2xl font-semibold glass-text">Manual Entry</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="glass-text">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="glass glass-hover border-white/20 glass-text placeholder:glass-text-subtle"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="glass-text">Description</Label>
              <Input
                id="description"
                type="text"
                placeholder="Work description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass glass-hover border-white/20 glass-text placeholder:glass-text-subtle"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="glass-text">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="glass glass-hover border-white/20 glass-text"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime" className="glass-text">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="glass glass-hover border-white/20 glass-text"
                required
              />
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-primary/20 hover:bg-primary/30 border-primary/50 glass-text glass-glow"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </form>
      </div>
    </div>
  );
};