import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CreateClientStep } from './steps/CreateClientStep';
import { CreateProjectStep } from './steps/CreateProjectStep';  
import { StartTimerStep } from './steps/StartTimerStep';
import { useWizard } from '@/hooks/useWizard';
import confetti from 'canvas-confetti';

interface WizardOverlayProps {
  onClose: () => void;
}

export const WizardOverlay = ({ onClose }: WizardOverlayProps) => {
  const { wizardState, nextStep, prevStep, completeWizard } = useWizard();

  const handleStepComplete = () => {
    if (wizardState.currentStep < 3) {
      nextStep();
    } else {
      // Final step complete - fire confetti and show tip
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      completeWizard();
      onClose();
    }
  };

  const handleDismiss = () => {
    completeWizard();  // Mark as completed so it won't show again
    onClose();
  };

  const renderStep = () => {
    switch (wizardState.currentStep) {
      case 1:
        return <CreateClientStep onComplete={handleStepComplete} />;
      case 2:
        return <CreateProjectStep onComplete={handleStepComplete} clientId={wizardState.clientId} />;
      case 3:
        return <StartTimerStep onComplete={handleStepComplete} projectId={wizardState.projectId} />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (wizardState.currentStep) {
      case 1:
        return "Welcome! Let's create your first client";
      case 2:
        return "Now, let's add a project";
      case 3:
        return "Ready to start tracking time?";
      default:
        return "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-background/95 backdrop-blur border-border shadow-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">{getStepTitle()}</h2>
              <div className="flex space-x-2 mt-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      step <= wizardState.currentStep 
                        ? 'bg-primary' 
                        : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {renderStep()}

          <div className="flex justify-between mt-6">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={wizardState.currentStep === 1}
            >
              Back
            </Button>
            <Button
              variant="ghost"
              onClick={handleDismiss}
              className="text-muted-foreground"
            >
              Skip Setup
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};