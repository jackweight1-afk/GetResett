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
      "Regulate your mind & body in 1-2 minutes",
      "Choose from resets for stress, anxiety, or scattered focus",
      "Let's try your first one"
    ],
  },
  {
    id: "breathing",
    title: "Quick Breathing Reset",
    content: [
      "Breathe in through your nose (4 counts)",
      "Hold (4 counts)",
      "Breathe out through your mouth (6 counts)",
      "Repeat 3 times & notice how you feel"
    ],
  },
  {
    id: "completion",
    title: "Great job!",
    content: [
      "Use resets anytime for calm & focus",
      "19 resets across 5 emotional states",
      "3 free daily, unlimited with GetReset+"
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 px-4 py-6">
      <div className="w-full max-w-md space-y-5">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-purple-600 to-teal-600 flex items-center justify-center shadow-lg">
            <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-2">
          {walkthrough.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === currentStep 
                  ? "w-10 bg-gradient-to-r from-purple-600 to-teal-600" 
                  : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-5 sm:p-7 space-y-4 border border-purple-100/50">
          <h1 
            data-testid={`title-step-${currentContent.id}`}
            className="text-xl sm:text-2xl font-bold text-center text-gray-900"
          >
            {currentContent.title}
          </h1>

          <div className="space-y-2.5">
            {currentContent.content.map((line, index) => (
              <p 
                key={index}
                data-testid={`text-content-${index}`}
                className="text-xs sm:text-sm text-gray-700 text-center leading-snug"
              >
                {line}
              </p>
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2.5 pt-4">
            {!isFirstStep && (
              <Button
                data-testid="button-back"
                variant="outline"
                size="default"
                onClick={handleBack}
                className="flex-1 text-xs sm:text-sm h-10"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            
            <Button
              data-testid={isLastStep ? "button-complete" : "button-next"}
              size="default"
              onClick={handleNext}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-medium text-xs sm:text-sm h-10"
            >
              {isLoading ? "Completing..." : isLastStep ? "Go to my dashboard" : "Continue"}
              {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
