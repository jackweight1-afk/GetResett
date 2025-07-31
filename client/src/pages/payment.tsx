import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function PaymentForm({ clientSecret, isTrialMode, onSuccess }: { 
  clientSecret: string; 
  isTrialMode: boolean; 
  onSuccess: () => void;
}) {
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
      if (isTrialMode) {
        const { error } = await stripe.confirmSetup({
          elements,
          confirmParams: {
            return_url: window.location.origin + "/?subscribed=true",
          },
        });

        if (error) {
          toast({
            title: "Setup Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          onSuccess();
        }
      } else {
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: window.location.origin + "/?subscribed=true",
          },
        });

        if (error) {
          toast({
            title: "Payment Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          onSuccess();
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
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
          isTrialMode ? "Start Free Trial" : "Subscribe for £1.99/month"
        )}
      </Button>
    </form>
  );
}

export default function Payment() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const createPayment = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-subscription");
        const data = await response.json();
        
        console.log("Payment response:", data);
        
        if (data.clientSecret) {
          setPaymentData(data);
          setLoading(false);
        } else {
          setError("Failed to initialize payment");
          setLoading(false);
        }
      } catch (error: any) {
        console.error("Payment setup error:", error);
        setError("Payment setup failed");
        setLoading(false);
      }
    };

    createPayment();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    window.location.href = '/api/login';
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Setting up payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">⚠</span>
              </div>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {paymentData?.trial ? "Start Your Free Trial" : "Subscribe to GetResett"}
          </h1>
          <p className="text-gray-600">
            {paymentData?.trial 
              ? "30 days free, then £1.99/month. Cancel anytime."
              : "£1.99/month for unlimited access. Cancel anytime."}
          </p>
        </div>

        {paymentData?.hasHadTrial && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-blue-900 mb-2">Payment Required</h4>
            <p className="text-blue-800 text-sm">
              You've already used your free trial. Subscribe now to continue unlimited access.
            </p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Elements 
              stripe={stripePromise} 
              options={{ 
                clientSecret: paymentData.clientSecret,
                mode: paymentData.trial ? 'setup' : 'payment',
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#9333ea',
                    borderRadius: '8px'
                  }
                }
              }}
            >
              <PaymentForm
                clientSecret={paymentData.clientSecret}
                isTrialMode={paymentData.trial}
                onSuccess={() => {
                  toast({
                    title: paymentData.trial ? "Free Trial Started!" : "Subscription Active!",
                    description: "You now have unlimited access to GetResett.",
                  });
                  setTimeout(() => {
                    window.location.href = '/?subscribed=true';
                  }, 1500);
                }}
              />
            </Elements>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Secured by Stripe • Cancel anytime</p>
        </div>
      </div>
    </div>
  );
}