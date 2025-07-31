import { useState } from "react";
import { useSessionLimits } from "@/hooks/useSessionLimits";
import { Paywall } from "./paywall";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SessionFlowProps {
  onStartSession: () => void;
  children?: React.ReactNode;
}

export function SessionFlow({ onStartSession, children }: SessionFlowProps) {
  const { dailyCount, canAccess, isSubscribed, incrementCount } = useSessionLimits();
  const [showPaywall, setShowPaywall] = useState(false);

  const handleSessionStart = () => {
    // Check if this is the 4th session (dailyCount will be 3, so they've used 3 sessions)
    if (!isSubscribed && dailyCount >= 3) {
      // Show paywall for 4th session and beyond
      setShowPaywall(true);
      return;
    }

    // For free users, increment count and start session
    if (!isSubscribed) {
      incrementCount();
    }
    
    onStartSession();
  };

  const handleSubscriptionComplete = () => {
    setShowPaywall(false);
    // After subscription, start the session without incrementing count
    onStartSession();
  };

  // If showing paywall
  if (showPaywall) {
    return (
      <Paywall
        dailyCount={dailyCount}
        onSubscriptionComplete={handleSubscriptionComplete}
        onClose={() => setShowPaywall(false)}
      />
    );
  }

  // Regular session flow
  return (
    <div className="w-full">
      {children}
      {!isSubscribed && dailyCount > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
          <p className="text-sm text-gray-600 text-center">
            You've used {dailyCount} of 3 free sessions today
          </p>
        </div>
      )}
      <div className="mt-6">
        <Button 
          onClick={handleSessionStart}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-6"
        >
          {!isSubscribed && dailyCount >= 3 ? 'Upgrade to Continue' : 'Start Session'}
        </Button>
      </div>
    </div>
  );
}