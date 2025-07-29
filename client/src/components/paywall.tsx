import { useState } from "react";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Clock, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

// Load Stripe outside of component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!);

interface PaywallProps {
  onSubscriptionComplete: () => void;
  dailyCount: number;
}

const CheckoutForm = ({ onSubscriptionComplete }: { onSubscriptionComplete: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      const { clientSecret } = await response.json();

      // Confirm payment for subscription (not one-time payment)
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: 'if_required'
      });

      if (result.error) {
        toast({
          title: "Payment Failed",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        // Invalidate queries to refresh subscription status
        await queryClient.invalidateQueries({ queryKey: ["/api/usage/check"] });
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        
        toast({
          title: "Welcome to GetResett+!",
          description: "You now have unlimited access to all reset sessions.",
        });
        onSubscriptionComplete();
      }
    } catch (error: any) {
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again.",
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
            "Subscribe for £1.99/month"
          )}
        </Button>
      </div>
    </form>
  );
};

export function Paywall({ onSubscriptionComplete, dailyCount }: PaywallProps) {
  const remainingSessions = Math.max(0, 3 - dailyCount);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
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

              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    GetResett+ Monthly
                  </CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">£1.99</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                      Unlimited daily reset sessions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                      Access to all session types
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                      Advanced progress insights
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                      Cancel anytime
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Elements stripe={stripePromise}>
                <CheckoutForm onSubscriptionComplete={onSubscriptionComplete} />
              </Elements>
            </>
          )}
        </CardContent>

        <CardFooter className="flex-col space-y-3">
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