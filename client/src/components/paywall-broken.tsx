import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Clock, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/useCurrency";

// Load Stripe outside of component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface PaywallProps {
  onSubscriptionComplete: () => void;
  onClose?: () => void;
  dailyCount: number;
}

const CheckoutForm = ({ onSubscriptionComplete }: { onSubscriptionComplete: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { localizedPrice } = useCurrency();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Create subscription
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Subscription creation failed');
      }
      
      const data = await response.json();
      
      if (!data.clientSecret) {
        throw new Error('Invalid response from server');
      }

      // Confirm payment for subscription
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: 'if_required'
      });

      if (result.error) {
        console.error("Stripe error:", result.error);
        toast({
          title: "Payment Setup Issue",
          description: result.error.message || "Please check your payment details and try again.",
          variant: "destructive",
        });
      } else {
        // Invalidate queries to refresh subscription status
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        
        toast({
          title: "Success!",
          description: "Your 30-day free trial has started. Enjoy unlimited sessions!",
        });
        onSubscriptionComplete();
      }
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast({
        title: "Setup Failed",
        description: error.message || "Please refresh the page and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="p-4 border rounded-lg bg-gray-50">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                  fontSmoothing: 'antialiased',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#fa755a',
                  iconColor: '#fa755a'
                }
              },
            }}
          />
        </div>
        
        <Button 
          type="submit" 
          size="lg"
          disabled={!stripe || !elements || loading}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3"
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              Processing...
            </div>
          ) : (
            "Start Free Trial"
          )}
        </Button>
      </div>
    </form>
  );
};

export function Paywall({ onSubscriptionComplete, onClose, dailyCount }: PaywallProps) {
  const { localizedPrice, isLoading: priceLoading } = useCurrency();
  const remainingSessions = Math.max(0, 3 - dailyCount);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
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

                <Button 
                  onClick={() => window.location.href = '/subscribe'}
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
            Your subscription will automatically renew monthly. Cancel anytime from your account settings.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}