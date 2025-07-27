import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import FeelingCheck from "./feeling-check";
import SessionModal from "@/components/session-modal-new";
import type { SessionType } from "@shared/schema";

type FlowStep = "initial-feeling" | "session" | "post-feeling" | "insights";

export default function GuidedFlow() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<FlowStep>("initial-feeling");
  const [selectedSessionType, setSelectedSessionType] = useState<SessionType | null>(null);
  const [sessionCount, setSessionCount] = useState(0);

  const { data: sessionTypes } = useQuery<SessionType[]>({
    queryKey: ['/api/session-types'],
    enabled: !!user,
  });

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const handleInitialFeelingSelected = (feeling: string, sessionTypeId: string) => {
    const sessionType = sessionTypes?.find(st => st.id === sessionTypeId);
    if (sessionType) {
      setSelectedSessionType(sessionType);
      setCurrentStep("session");
    }
  };

  const handleSessionComplete = () => {
    setSessionCount(prev => prev + 1);
    setSelectedSessionType(null);
    setCurrentStep("post-feeling");
  };

  const handlePostFeelingSelected = (feeling: string, sessionTypeId: string) => {
    const sessionType = sessionTypes?.find(st => st.id === sessionTypeId);
    if (sessionType) {
      setSelectedSessionType(sessionType);
      setCurrentStep("session");
    }
  };

  const handleFeelBetter = () => {
    setCurrentStep("insights");
    // Redirect to insights page
    setTimeout(() => {
      window.location.href = "/insights";
    }, 1000);
  };

  const handleSessionCancel = () => {
    setSelectedSessionType(null);
    if (sessionCount === 0) {
      setCurrentStep("initial-feeling");
    } else {
      setCurrentStep("post-feeling");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wellness journey...</p>
        </div>
      </div>
    );
  }

  if (currentStep === "insights") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Great work!</h2>
          <p className="text-gray-600 mb-6">
            You've completed {sessionCount} reset{sessionCount !== 1 ? 's' : ''} and are feeling better. 
            Let's see your insights and progress.
          </p>
          <div className="animate-pulse text-purple-600">
            Taking you to your analytics...
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {currentStep === "initial-feeling" && (
        <FeelingCheck 
          onFeelingSelected={handleInitialFeelingSelected}
          onFeelBetter={handleFeelBetter}
          isPostSession={false}
        />
      )}

      {currentStep === "post-feeling" && (
        <FeelingCheck 
          onFeelingSelected={handlePostFeelingSelected}
          onFeelBetter={handleFeelBetter}
          isPostSession={true}
        />
      )}

      {currentStep === "session" && selectedSessionType && (
        <SessionModal 
          sessionType={selectedSessionType}
          onClose={handleSessionCancel}
          onComplete={handleSessionComplete}
        />
      )}
    </>
  );
}