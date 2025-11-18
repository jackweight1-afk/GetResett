import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Sparkles, ChevronRight, ChevronLeft } from "lucide-react";

const walkthrough = [
  {
    id: "intro",
    title: "Welcome to Resets",
    content: [
      "Resets help you regulate your mind and body in 1–2 minutes.",
      "Whether you're feeling stressed, anxious, or scattered, we have guided sessions to help you feel better.",
      "Let's try your first one now."
    ],
  },
  {
    id: "breathing",
    title: "Quick Breathing Reset",
    content: [
      "Take a deep breath in through your nose for 4 counts.",
      "Hold for 4 counts.",
      "Breathe out slowly through your mouth for 6 counts.",
      "Repeat this 3 times and notice how you feel."
    ],
  },
  {
    id: "completion",
    title: "Great job!",
    content: [
      "You can use resets anytime to feel calmer and more focused.",
      "We have 19 different resets across 5 emotional states.",
      "You get 3 free resets per day, or unlimited with GetResett+."
    ],
  },
];

export default function FirstReset() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const currentContent = walkthrough[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === walkthrough.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/user/complete-onboarding", {});
      
      // Invalidate auth queries to refetch user data
      queryClient.invalidateQueries({ queryKey: ["/auth/me"] });
      
      toast({
        title: "Onboarding Complete!",
        description: "Welcome to GetResett",
      });

      setLocation("/resets");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-600 to-teal-600 flex items-center justify-center shadow-lg">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2">
          {walkthrough.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentStep 
                  ? "w-12 bg-gradient-to-r from-purple-600 to-teal-600" 
                  : "w-2 bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          <h1 
            data-testid={`title-step-${currentContent.id}`}
            className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 via-violet-600 to-teal-600 bg-clip-text text-transparent"
          >
            {currentContent.title}
          </h1>

          <div className="space-y-4">
            {currentContent.content.map((line, index) => (
              <p 
                key={index}
                data-testid={`text-content-${index}`}
                className="text-lg text-gray-700 dark:text-gray-300 text-center"
              >
                {line}
              </p>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-3 pt-6">
            {!isFirstStep && (
              <Button
                data-testid="button-back"
                variant="outline"
                size="lg"
                onClick={handleBack}
                className="flex-1"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
            )}
            
            <Button
              data-testid={isLastStep ? "button-complete" : "button-next"}
              size="lg"
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-semibold"
            >
              {isLoading ? "Completing..." : isLastStep ? "Go to my dashboard" : "Continue"}
              {!isLastStep && <ChevronRight className="h-5 w-5 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
