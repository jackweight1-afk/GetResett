import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

export default function SessionModal({ sessionType, onClose }: SessionModalProps) {
  const [step, setStep] = useState<'setup' | 'session' | 'feedback'>('setup');
  const [sleepQuality, setSleepQuality] = useState<number[]>([7]);
  const [hoursSlept, setHoursSlept] = useState<string>('');
  const [stressLevel, setStressLevel] = useState<number[]>([5]);
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
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/insights"] });
      toast({
        title: "Session Completed!",
        description: "Great job! Your progress has been recorded.",
      });
      onClose();
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
        description: "Failed to record session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createSleepEntryMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/sleep", data);
    },
  });

  const createStressEntryMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/stress", data);
    },
  });

  const handleSessionComplete = async () => {
    try {
      // Create the session record
      const sessionResponse = await createSessionMutation.mutateAsync({
        sessionTypeId: sessionType.id,
        duration: 60,
        rating: sessionRating[0],
        notes: notes,
      });

      // Create additional entries based on session type
      if (sessionType.name === "Sleep Check-in") {
        await createSleepEntryMutation.mutateAsync({
          sleepQuality: sleepQuality[0],
          hoursSlept: hoursSlept ? parseFloat(hoursSlept) : null,
          notes: notes,
        });
      } else if (sessionType.name === "Stress Relief") {
        await createStressEntryMutation.mutateAsync({
          stressLevel: stressLevel[0],
          stressSource: "work", // Could be made dynamic
        });
      }

      setStep('feedback');
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  const handleFeedbackSubmit = () => {
    onClose();
  };

  const renderSetupStep = () => {
    if (sessionType.name === "Sleep Check-in") {
      return (
        <div className="space-y-6">
          <div>
            <Label htmlFor="sleep-quality" className="text-sm font-medium text-gray-700 mb-3 block">
              How would you rate your sleep quality last night?
            </Label>
            <div className="px-3">
              <Slider
                value={sleepQuality}
                onValueChange={setSleepQuality}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1 - Poor</span>
                <span className="font-medium">{sleepQuality[0]}</span>
                <span>10 - Excellent</span>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="hours-slept" className="text-sm font-medium text-gray-700">
              Hours of sleep (optional)
            </Label>
            <Input
              id="hours-slept"
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={hoursSlept}
              onChange={(e) => setHoursSlept(e.target.value)}
              placeholder="e.g., 7.5"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="sleep-notes" className="text-sm font-medium text-gray-700">
              Any notes about your sleep? (optional)
            </Label>
            <Textarea
              id="sleep-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., woke up several times, had vivid dreams..."
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      );
    }

    if (sessionType.name === "Stress Relief") {
      return (
        <div className="space-y-6">
          <div>
            <Label htmlFor="stress-level" className="text-sm font-medium text-gray-700 mb-3 block">
              How stressed are you feeling right now?
            </Label>
            <div className="px-3">
              <Slider
                value={stressLevel}
                onValueChange={setStressLevel}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1 - Very Relaxed</span>
                <span className="font-medium">{stressLevel[0]}</span>
                <span>10 - Very Stressed</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">What to expect:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 4 seconds breathing in</li>
              <li>• 4 seconds holding</li>
              <li>• 6 seconds breathing out</li>
              <li>• Visual guidance throughout</li>
            </ul>
          </div>
        </div>
      );
    }

    // Default setup for other session types
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">What you'll do:</h4>
          <p className="text-sm text-gray-700">{sessionType.description}</p>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-1">60 seconds</div>
          <div className="text-sm text-gray-500">Session duration</div>
        </div>
      </div>
    );
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
              <span>1 - Poor</span>
              <span className="font-medium">{sessionRating[0]} stars</span>
              <span>5 - Excellent</span>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleFeedbackSubmit}
          className={`w-full ${primaryColor} text-white`}
        >
          Complete Session
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogOverlay className="bg-black/50" />
      <DialogContent className="max-w-md w-full mx-4 p-0">
        <Card className="border-0 shadow-none">
          <CardContent className="p-8">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {step === 'setup' && (
              <div className="text-center">
                <div className={`w-16 h-16 ${colorClass} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{sessionType.name}</h3>
                <p className="text-gray-600 mb-8">{sessionType.description}</p>
                
                {renderSetupStep()}

                <div className="flex space-x-4 mt-8">
                  <Button 
                    onClick={() => setStep('session')}
                    className={`flex-1 ${primaryColor} text-white`}
                  >
                    Start Session
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={onClose}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {step === 'session' && (
              <SessionTimer
                sessionType={sessionType}
                onComplete={handleSessionComplete}
                onCancel={() => setStep('setup')}
              />
            )}

            {step === 'feedback' && renderFeedbackStep()}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
