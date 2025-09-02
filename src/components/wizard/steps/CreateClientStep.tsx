import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useClients } from '@/hooks/useClients';
import { useWizard } from '@/hooks/useWizard';
import { Building2, Loader2 } from 'lucide-react';

interface CreateClientStepProps {
  onComplete: () => void;
}

export const CreateClientStep = ({ onComplete }: CreateClientStepProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { addClient } = useClients();
  const { setClientId } = useWizard();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const client = await addClient({
        name: name.trim(),
        email: email.trim() || undefined,
        company: company.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      
      setClientId(client.id);
      onComplete();
    } catch (error) {
      console.error('Failed to create client:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Building2 className="h-5 w-5 text-primary" />
        <p className="text-sm text-muted-foreground">
          Your first client! This could be your employer, a freelance client, or even "Personal Projects".
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-name">Client Name *</Label>
        <Input
          id="client-name"
          type="text"
          placeholder="Acme Corp, John Doe, Personal..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="client-email">Email</Label>
          <Input
            id="client-email"
            type="email"
            placeholder="contact@client.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client-company">Company</Label>
          <Input
            id="client-company"
            type="text"
            placeholder="Company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="client-notes">Notes</Label>
        <Textarea
          id="client-notes"
          placeholder="Any additional details..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!name.trim() || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Client...
          </>
        ) : (
          'Create Client & Continue'
        )}
      </Button>
    </form>
  );
};