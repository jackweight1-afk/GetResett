import { useEffect, useState } from 'react';
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
import { useCurrency } from '@/hooks/useCurrency';
import { apiRequest } from '@/lib/queryClient';
import { CheckCircle, CreditCard, Smartphone } from 'lucide-react';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function CheckoutForm({ clientSecret, paymentData, onSuccess, onReady }: { 
  clientSecret: string; 
  paymentData: any;
  onSuccess: () => void;
  onReady?: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { localizedPrice } = useCurrency();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentData.trial) {
        // Free trial - setup payment method for future use
        const { error } = await stripe.confirmSetup({
          elements,
          confirmParams: {
            return_url: window.location.origin + "/?trial=success",
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
        // Immediate payment required
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

  const buttonText = () => {
    if (isProcessing) {
      return (
        <div className="flex items-center justify-center">
          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3" />
          {paymentData.trial ? "Setting up trial..." : "Processing payment..."}
        </div>
      );
    }
    
    if (paymentData.trial) {
      return (
        <div className="flex items-center justify-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Start 30-Day Free Trial
        </div>
      );
    }
    
    return (
      <div className="flex items-center justify-center">
        <CreditCard className="w-5 h-5 mr-2" />
        Subscribe for {localizedPrice.formatted}/month
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        onReady={() => {
          if (onReady) onReady();
        }}
        options={{
          layout: {
            type: 'tabs',
            defaultCollapsed: false,
            radios: false,
            spacedAccordionItems: false
          },
          wallets: {
            applePay: 'auto',
            googlePay: 'auto'
          },
          fields: {
            billingDetails: 'never'
          },
          terms: {
            card: 'never'
          }
        }}
      />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        size="lg"
      >
        {buttonText()}
      </Button>
    </form>
  );
}

export default function Checkout() {
  const { isAuthenticated, user } = useAuth();
  const { localizedPrice, isLoading: priceLoading } = useCurrency();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stripeReady, setStripeReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Don't do anything if still loading auth state
    if (isAuthenticated === undefined) return;
    
    if (!isAuthenticated || !user) {
      // Set a flag to prevent multiple redirects and redirect to login
      if (!sessionStorage.getItem('redirecting-to-login')) {
        sessionStorage.setItem('redirecting-to-login', 'true');
        sessionStorage.setItem('return-to-checkout', 'true');
        window.location.href = '/api/login';
      }
      return;
    }

    // Clear redirect flags
    sessionStorage.removeItem('redirecting-to-login');

    const createSubscription = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-subscription");
        const data = await response.json();
        
        console.log("Subscription response:", data);
        
        if (data.clientSecret) {
          setPaymentData(data);
          // Don't set loading to false immediately - wait for Stripe to be ready
        } else if (data.subscriptionId && data.status === 'trialing') {
          // User already has active trial
          window.location.href = '/?trial=active';
          return;
        } else {
          setError("Failed to initialize payment");
          setLoading(false);
        }
      } catch (error: any) {
        console.error("Subscription creation error:", error);
        if (error.message?.includes('401')) {
          // Auth issue, redirect to login
          sessionStorage.setItem('return-to-checkout', 'true');
          window.location.href = '/api/login';
          return;
        }
        setError("Failed to setup subscription");
        setLoading(false);
      }
    };

    createSubscription();
  }, [isAuthenticated, user]);

  if (loading || isAuthenticated === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="text-center p-8">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-6" />
          <p className="text-gray-600 text-lg">
            {!isAuthenticated ? "Redirecting to login..." : "Setting up your subscription..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="pt-8 pb-6 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-3xl">⚠</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Setup Failed</h3>
            <p className="text-red-600 mb-6 text-sm">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-md mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white text-2xl font-bold">G</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {paymentData?.trial ? "Start Your Free Trial" : "Subscribe to GetResett+"}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            {paymentData?.trial 
              ? "30 days free, then " + localizedPrice.formatted + "/month"
              : localizedPrice.formatted + "/month for unlimited access"}
          </p>
        </div>

        {/* Trial vs Payment Message */}
        {paymentData?.hasHadTrial ? (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2 text-lg">Welcome Back!</h4>
                <p className="text-blue-800 text-sm leading-relaxed mb-3">
                  You've already used your free trial with this email address. 
                  Subscribe now to continue your wellness journey with unlimited access.
                </p>
                <div className="flex items-center text-blue-700 text-xs">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span>Cancel anytime from your account settings</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-semibold text-green-900 mb-2 text-lg">30-Day Free Trial</h4>
                <p className="text-green-800 text-sm leading-relaxed mb-3">
                  No charge for 30 days! Your payment method will be saved but not charged. 
                  Cancel anytime before your trial ends to avoid any charges.
                </p>
                <div className="flex items-center text-green-700 text-xs">
                  <Smartphone className="w-4 h-4 mr-1" />
                  <span>Apple Pay and Google Pay supported</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Unified Payment Form */}
        <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white pb-8">
            <CardTitle className="text-center text-xl font-semibold">
              {paymentData?.trial ? "Start Free Trial" : "Complete Payment"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {paymentData?.clientSecret ? (
              <Elements 
                stripe={stripePromise} 
                options={{ 
                  clientSecret: paymentData.clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#9333ea',
                      borderRadius: '12px',
                      spacingUnit: '8px',
                      fontSizeBase: '16px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }
                  }
                }}
              >
                <div className={`transition-opacity duration-300 ${stripeReady ? 'opacity-100' : 'opacity-0'}`}>
                  <CheckoutForm
                    clientSecret={paymentData.clientSecret}
                    paymentData={paymentData}
                    onReady={() => {
                      setStripeReady(true);
                      setLoading(false);
                    }}
                    onSuccess={() => {
                      toast({
                        title: paymentData.trial ? "Free Trial Started!" : "Subscription Active!",
                        description: paymentData.trial 
                          ? "Welcome to your 30-day free trial of GetResett+"
                          : "You now have unlimited access to GetResett+",
                      });
                      setTimeout(() => {
                        window.location.href = paymentData.trial ? '/?trial=success' : '/?subscribed=true';
                      }, 2000);
                    }}
                  />
                </div>
                {!stripeReady && (
                  <div className="text-center py-8">
                    <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading payment options...</p>
                  </div>
                )}
              </Elements>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Setting up payment...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center space-y-2">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>🔒 Secured by Stripe</span>
            <span>•</span>
            <span>📱 Apple Pay & Google Pay</span>
          </div>
          <p className="text-xs text-gray-400">
            Cancel anytime from your account settings
          </p>
        </div>
      </div>
    </div>
  );
}