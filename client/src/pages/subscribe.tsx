import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCurrency } from "@/hooks/useCurrency";
import { apiRequest } from "@/lib/queryClient";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, Crown, Sparkles } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // For trial subscriptions, we use confirmSetup instead of confirmPayment
      const { error } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/?subscribed=true",
        },
      });

      if (error) {
        console.error("Setup error:", error);
        toast({
          title: "Setup Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Setup successful - payment method saved for trial
        onSuccess();
      }
    } catch (error: any) {
      console.error("Setup failed:", error);
      toast({
        title: "Setup Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-6"
      >
        {isProcessing ? (
          <div className="flex items-center">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
            Processing...
          </div>
        ) : (
          "Start Free Trial"
        )}
      </Button>
    </form>
  );
}

export default function Subscribe() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { localizedPrice, isLoading: priceLoading } = useCurrency();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);
  const [error, setError] = useState("");

  // Check for success parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast({
        title: "Free Trial Started!",
        description: "You now have unlimited access for 30 days. Cancel anytime before trial ends.",
      });
      // Redirect to home after showing success message
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  }, [toast]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to start your free trial.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  // Create subscription when component loads (prevent infinite loop)
  useEffect(() => {
    let isMounted = true;
    
    console.log('Effect check:', { isAuthenticated, clientSecret, isCreatingSubscription, error, user });
    
    if (isAuthenticated && user && !clientSecret && !isCreatingSubscription && !error) {
      setIsCreatingSubscription(true);
      
      // Add delay to ensure session is fully established
      setTimeout(async () => {
        try {
          // First ensure user is authenticated
          const authRes = await apiRequest("GET", "/api/auth/user");
          if (!authRes.ok) {
            throw new Error("Authentication required");
          }
          
          const response = await apiRequest("POST", "/api/create-subscription");
          const data = await response.json();
          
          {
            console.log("Full subscription response:", JSON.stringify(data, null, 2));
            if (isMounted) {
              if (data.clientSecret) {
                console.log("Setting clientSecret:", data.clientSecret);
                setClientSecret(data.clientSecret);
                setError("");
              } else if (data.subscriptionId && data.status === 'trialing') {
                // Already trialing, redirect to success
                console.log("Already trialing, redirecting...");
                window.location.href = '/?subscribed=true';
              } else {
                console.error("No client secret in response:", data);
                // Try to force clientSecret from any payment intent
                if (data.subscriptionId) {
                  console.log("Subscription exists but no clientSecret, redirecting...");
                  window.location.href = '/?subscribed=true';
                } else {
                  throw new Error("No client secret received");
                }
              }
            }
          }
        } catch (error: any) {
          if (isMounted) {
            console.error("Error creating subscription:", error);
            
            // If unauthorized, try refreshing auth state
            if (error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('Authentication required')) {
              console.log("Authentication failed, redirecting to login...");
              window.location.href = '/api/login';
              return;
            }
            
            setError("Failed to set up payment");
            toast({
              title: "Error", 
              description: "Failed to set up payment. Please try again.",
              variant: "destructive",
            });
          }
        }
        finally {
          if (isMounted) {
            setIsCreatingSubscription(false);
          }
        }
      }, 500); // 500ms delay to ensure authentication is ready
    }
    
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user, clientSecret, isCreatingSubscription, error, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
            className="w-10 h-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Start Your Free Trial</h1>
        </div>

        {/* Plan Details */}
        <Card className="mb-6">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-purple-600 mb-2">
              GetResett+
            </CardTitle>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-green-600">
                FREE for 30 days
              </div>
              <div className="text-lg text-gray-600">
                Then {priceLoading ? '...' : localizedPrice.formatted}/month
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-3">What you get:</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-green-700">30 days completely free</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-green-700">Unlimited daily reset sessions</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-green-700">Access to all session types</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-green-700">Advanced progress insights</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-green-700">Cancel anytime before trial ends</span>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                <strong>Trial Details:</strong> Your payment method will be saved but not charged for 30 days. 
                Cancel anytime before the trial ends to avoid charges. No commitment required.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Information</CardTitle>
            <p className="text-sm text-gray-600">
              Secure payment powered by Stripe. Your card won't be charged during the 30-day trial.
            </p>
          </CardHeader>
          <CardContent>
            {!clientSecret && !error ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-6 h-6 border-4 border-purple-600 border-t-transparent rounded-full mr-3" />
                <span className="text-gray-600">Setting up your trial...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button 
                  onClick={() => {
                    setError("");
                    setClientSecret("");
                    setIsCreatingSubscription(false);
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <Elements stripe={stripePromise} options={{ 
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#9333ea',
                    borderRadius: '8px'
                  }
                }
              }}>
                <CheckoutForm onSuccess={() => {
                  toast({
                    title: "Free Trial Started!",
                    description: "You now have unlimited access for 30 days.",
                  });
                  setTimeout(() => {
                    window.location.href = '/';
                  }, 1500);
                }} />
              </Elements>
            )}
          </CardContent>
        </Card>

        {/* Security & Trust */}
        <div className="mt-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
            <span>Secured by Stripe</span>
          </div>
          <p className="text-xs text-gray-500">
            Your payment information is encrypted and secure. 
            Cancel anytime from your account settings.
          </p>
        </div>
      </div>
    </div>
  );
}