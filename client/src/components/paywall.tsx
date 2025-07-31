import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Clock, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/useCurrency";

interface PaywallProps {
  onSubscriptionComplete: () => void;
  onClose?: () => void;
  dailyCount: number;
}

export function Paywall({ onSubscriptionComplete, onClose, dailyCount }: PaywallProps) {
  const { localizedPrice, isLoading: priceLoading } = useCurrency();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const remainingSessions = Math.max(0, 3 - dailyCount);

  const handleStartTrial = () => {
    // Redirect to the new, simpler payment page
    window.location.href = '/payment';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            You've used {dailyCount} of 3 daily resets
          </CardTitle>
          <CardDescription className="text-base">
            {remainingSessions > 0 
              ? `You have ${remainingSessions} free sessions left today.`
              : "Upgrade to GetResett+ for unlimited access."
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {remainingSessions === 0 && (
            <>
              <div className="text-center">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 mb-4">
                  <Clock className="w-4 h-4 mr-1" />
                  Free sessions reset at midnight
                </div>
              </div>

              <div className="text-center space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-purple-600">GetResett+</h3>
                  <div className="text-3xl font-bold text-green-600">
                    Free for 30 days
                  </div>
                  <div className="text-lg text-gray-700">
                    Then {priceLoading ? '...' : localizedPrice.formatted}/month
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>Unlimited wellness sessions</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>All session types included</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>Progress tracking & insights</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-green-600">✓</span>
                    <span>Cancel anytime</span>
                  </div>
                </div>

                <Button 
                  onClick={() => window.location.href = '/payment'}
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-6"
                >
                  Start Free Trial
                </Button>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className="flex-col space-y-3">
          {onClose && remainingSessions === 0 && (
            <Button 
              variant="outline"
              onClick={onClose}
              className="w-full"
            >
              Maybe Later
            </Button>
          )}
          {remainingSessions > 0 && (
            <Button 
              onClick={onSubscriptionComplete}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Continue with free session
            </Button>
          )}
          
          <p className="text-xs text-gray-500 text-center">
            Cancel anytime before trial ends. No commitment required.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}