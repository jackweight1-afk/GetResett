import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import SessionTimer from "./session-timer";
import type { SessionType } from "@shared/schema";
import { 
  Moon, 
  Wind, 
  Target, 
  Dumbbell, 
  Waves, 
  Zap,
  X
} from "lucide-react";

interface SessionModalProps {
  sessionType: SessionType;
  onClose: () => void;
  onComplete?: () => void;
}

const iconMap = {
  "fas fa-moon": Moon,
  "fas fa-wind": Wind,
  "fas fa-street-view": Target,
  "fas fa-dumbbell": Dumbbell,
  "fas fa-spa": Waves,
  "fas fa-bullseye": Zap,
};

const colorMap = {
  purple: "bg-purple-100 text-purple-600",
  blue: "bg-blue-100 text-blue-600",
  sage: "bg-sage/20 text-sage",
  orange: "bg-orange-100 text-orange-600",
  teal: "bg-teal/20 text-teal",
  yellow: "bg-yellow-100 text-yellow-600",
};

const primaryColorMap = {
  purple: "bg-purple-600 hover:bg-purple-700",
  blue: "bg-blue-600 hover:bg-blue-700",
  sage: "bg-sage hover:bg-sage/90",
  orange: "bg-orange-600 hover:bg-orange-700",
  teal: "bg-teal hover:bg-teal/90",
  yellow: "bg-yellow-600 hover:bg-yellow-700",
};

export default function SessionModal({ sessionType, onClose, onComplete }: SessionModalProps) {
  const [step, setStep] = useState<'session' | 'feedback'>('session');
  const [notes, setNotes] = useState<string>('');
  const [sessionRating, setSessionRating] = useState<number[]>([5]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const IconComponent = iconMap[sessionType.icon as keyof typeof iconMap] || Zap;
  const colorClass = colorMap[sessionType.color as keyof typeof colorMap] || "bg-gray-100 text-gray-600";
  const primaryColor = primaryColorMap[sessionType.color as keyof typeof primaryColorMap] || "bg-gray-600 hover:bg-gray-700";

  const createSessionMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/sessions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/insights'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Error",
        description: "Failed to save session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createStressEntryMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/stress", data);
    },
    onError: (error) => {
      console.error("Error creating stress entry:", error);
    },
  });

  const handleSessionComplete = async () => {
    try {
      // Create user session record
      await createSessionMutation.mutateAsync({
        sessionTypeId: sessionType.id,
        duration: 60,
        rating: sessionRating[0],
        notes: notes,
      });

      // Create additional entries based on session type (no special handling needed for Sleep Story)
      if (sessionType.name === "Stress Relief") {
        await createStressEntryMutation.mutateAsync({
          stressLevel: 5,
          stressSource: "general",
        });
      }

      setStep('feedback');
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  const handleFeedbackSubmit = () => {
    if (onComplete) {
      onComplete();
    } else {
      onClose();
    }
  };

  const renderFeedbackStep = () => {
    return (
      <div className="text-center space-y-6">
        <div className={`w-16 h-16 ${colorClass} rounded-full flex items-center justify-center mx-auto`}>
          <IconComponent className="w-8 h-8" />
        </div>
        
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Great job!</h3>
          <p className="text-gray-600">You've completed your {sessionType.name} session.</p>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            How was this session?
          </Label>
          <div className="px-3">
            <Slider
              value={sessionRating}
              onValueChange={setSessionRating}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>😞 Not helpful</span>
              <span className="font-medium">{sessionRating[0]}/5</span>
              <span>😊 Very helpful</span>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="session-notes" className="text-sm font-medium text-gray-700">
            How are you feeling? (optional)
          </Label>
          <Textarea
            id="session-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share any thoughts about this session..."
            className="mt-1"
            rows={3}
          />
        </div>
      </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/40" />
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{sessionType.name}</h2>
              <p className="text-sm text-gray-600">
                {step === 'session' ? 'In Session' : 'Feedback'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-6">
          {step === 'session' && (
            <SessionTimer
              sessionType={sessionType}
              onComplete={handleSessionComplete}
              onCancel={onClose}
            />
          )}

          {step === 'feedback' && (
            <div className="space-y-6">
              {renderFeedbackStep()}
              <Button
                onClick={handleFeedbackSubmit}
                className={`w-full text-white ${primaryColor}`}
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}