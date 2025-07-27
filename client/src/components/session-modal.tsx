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
          {/* Visual representation */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 text-center">
            <div className="flex justify-center items-center space-x-3 mb-3">
              <div className="text-3xl">🌙</div>
              <div className="text-lg">→</div>
              <div className="text-3xl">😴</div>
              <div className="text-lg">→</div>
              <div className="text-3xl">☀️</div>
            </div>
            <p className="text-sm text-gray-700 font-medium">Track your complete sleep journey</p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Pre-sleep activities last night
            </Label>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { icon: '📖', label: 'Reading' },
                { icon: '🧘', label: 'Meditation' },
                { icon: '📱', label: 'Phone use' },
                { icon: '☕', label: 'Caffeine' },
                { icon: '🍷', label: 'Alcohol' },
                { icon: '🏃', label: 'Exercise' }
              ].map((activity) => (
                <label key={activity.label} className="flex items-center space-x-2 p-2 rounded border hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" className="rounded text-purple-600" />
                  <span className="text-lg">{activity.icon}</span>
                  <span>{activity.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="hours-slept" className="text-sm font-medium text-gray-700">
              Hours of sleep
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
            <Label htmlFor="sleep-quality" className="text-sm font-medium text-gray-700 mb-3 block">
              Sleep quality (1-10)
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
                <span>😴 Poor</span>
                <span className="font-medium">{sleepQuality[0]}/10</span>
                <span>😊 Excellent</span>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              How do you feel this morning?
            </Label>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {[
                { emoji: '😴', label: 'Tired' },
                { emoji: '😊', label: 'Refreshed' },
                { emoji: '⚡', label: 'Energized' },
                { emoji: '😐', label: 'Neutral' },
                { emoji: '🤕', label: 'Groggy' },
                { emoji: '🌟', label: 'Amazing' }
              ].map((mood) => (
                <label key={mood.label} className="flex flex-col items-center space-y-1 p-2 rounded border hover:bg-purple-50 cursor-pointer transition-colors">
                  <input type="radio" name="morning-mood" className="sr-only peer" />
                  <span className="text-2xl peer-checked:scale-110 transition-transform">{mood.emoji}</span>
                  <span className="text-xs text-center">{mood.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="sleep-notes" className="text-sm font-medium text-gray-700">
              Sleep notes (optional)
            </Label>
            <Textarea
              id="sleep-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any dreams, thoughts, or insights about your sleep?"
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
          {/* Visual breathing guide */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-4 text-center">
            <div className="flex justify-center items-center space-x-3 mb-3">
              <div className="text-3xl animate-pulse">🫁</div>
              <div className="text-lg">→</div>
              <div className="text-3xl">😌</div>
            </div>
            <p className="text-sm text-gray-700 font-medium">Guided breathing for instant calm</p>
          </div>

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
                <span>😌 Calm</span>
                <span className="font-medium">{stressLevel[0]}/10</span>
                <span>😰 Very Stressed</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-3 flex items-center">
              <span className="text-lg mr-2">🌊</span>
              Breathing Pattern:
            </h4>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="text-center p-2 bg-white rounded">
                <div className="text-2xl mb-1">📥</div>
                <div className="font-medium text-blue-800">Inhale</div>
                <div className="text-blue-600">4 seconds</div>
              </div>
              <div className="text-center p-2 bg-white rounded">
                <div className="text-2xl mb-1">⏸️</div>
                <div className="font-medium text-blue-800">Hold</div>
                <div className="text-blue-600">4 seconds</div>
              </div>
              <div className="text-center p-2 bg-white rounded">
                <div className="text-2xl mb-1">📤</div>
                <div className="font-medium text-blue-800">Exhale</div>
                <div className="text-blue-600">6 seconds</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default setup for other session types with visuals
    return (
      <div className="space-y-6">
        {/* Visual representation based on session type */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 text-center">
          <div className="flex justify-center items-center space-x-3 mb-3">
            <div className={`w-12 h-12 ${colorClass} rounded-full flex items-center justify-center`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div className="text-lg">→</div>
            <div className="text-3xl">💪</div>
            <div className="text-lg">→</div>
            <div className="text-3xl">😊</div>
          </div>
          <p className="text-sm text-gray-700 font-medium">60-second wellness boost</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <span className="text-lg mr-2">✨</span>
            What you'll do:
          </h4>
          <p className="text-sm text-gray-700">{sessionType.description}</p>
        </div>

        <div className="text-center bg-purple-50 rounded-lg p-3">
          <div className="text-2xl font-bold text-purple-600 mb-1">60 seconds</div>
          <div className="text-sm text-purple-700 font-medium">Quick & effective</div>
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
      <DialogContent className="max-w-md w-full mx-4 p-0 sm:mx-auto flex items-center justify-center min-h-screen sm:min-h-0">
        <Card className="border-0 shadow-none w-full max-w-md">
          <CardContent className="p-6 sm:p-8">
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
                    onClick={() => {
                      if (sessionType.name === "Sleep Check-in") {
                        // Skip timer for sleep tracking, go directly to feedback
                        handleSessionComplete();
                      } else {
                        setStep('session');
                      }
                    }}
                    className={`flex-1 ${primaryColor} text-white`}
                  >
                    {sessionType.name === "Sleep Check-in" ? "Save Sleep Data" : "Start Session"}
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
