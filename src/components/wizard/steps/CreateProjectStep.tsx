import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProjects } from '@/hooks/useProjects';
import { useWizard } from '@/hooks/useWizard';
import { FolderOpen, Loader2, DollarSign } from 'lucide-react';

interface CreateProjectStepProps {
  onComplete: () => void;
  clientId?: string;
}

export const CreateProjectStep = ({ onComplete, clientId }: CreateProjectStepProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [isLoading, setIsLoading] = useState(false);

  const { addProject } = useProjects();
  const { setProjectId } = useWizard();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const project = await addProject({
        name: name.trim(),
        description: description.trim() || undefined,
        client_id: clientId,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        currency,
        is_active: true,
      });
      
      setProjectId(project.id);
      onComplete();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <FolderOpen className="h-5 w-5 text-primary" />
        <p className="text-sm text-muted-foreground">
          Projects help organize your time. Add an hourly rate if you bill for this work!
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-name">Project Name *</Label>
        <Input
          id="project-name"
          type="text"
          placeholder="Website Redesign, App Development..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-description">Description</Label>
        <Textarea
          id="project-description"
          placeholder="Brief project description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hourly-rate" className="flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            Hourly Rate
          </Label>
          <Input
            id="hourly-rate"
            type="number"
            step="0.01"
            min="0"
            placeholder="75.00"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CAD">CAD</option>
            <option value="AUD">AUD</option>
          </select>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!name.trim() || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Project...
          </>
        ) : (
          'Create Project & Continue'
        )}
      </Button>
    </form>
  );
};