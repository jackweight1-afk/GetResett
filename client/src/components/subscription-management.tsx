import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useCurrency } from "@/hooks/useCurrency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Crown, CreditCard, Calendar, AlertTriangle, CheckCircle } from "lucide-react";

export function SubscriptionManagement() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cancellingSubscription, setCancellingSubscription] = useState(false);
  const { localizedPrice } = useCurrency();

  const { data: usageData } = useQuery<{
    canAccess: boolean;
    isSubscribed: boolean;
    dailyCount: number;
  }>({
    queryKey: ["/api/usage/check"],
    enabled: isAuthenticated,
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Subscription Canceled",
        description: "Your subscription has been canceled. You'll continue to have access until the end of your billing period.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/usage/check"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setCancellingSubscription(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
      setCancellingSubscription(false);
    },
  });

  const handleCancelSubscription = () => {
    setCancellingSubscription(true);
    cancelSubscriptionMutation.mutate();
  };

  if (!usageData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-purple-600" />
            <span>Subscription Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (usageData.isSubscribed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-purple-600" />
            <span>GetResett+ Subscription</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Active Premium Member</h3>
              <p className="text-sm text-gray-600">Unlimited daily reset sessions</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-purple-600">{localizedPrice.formatted}</div>
              <div className="text-xs text-gray-500">per month</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Unlimited daily reset sessions</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Access to all session types and variations</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Advanced progress insights and analytics</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>Next billing date: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Cancel Subscription
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span>Cancel GetResett+ Subscription?</span>
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-3">
                    <p>Are you sure you want to cancel your GetResett+ subscription?</p>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <h4 className="font-medium text-yellow-800 mb-2">What happens when you cancel:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• You'll lose unlimited access to reset sessions</li>
                        <li>• You'll return to the free plan (3 sessions per day)</li>
                        <li>• After session 3, you'll see the upgrade paywall again</li>
                        <li>• Your session history and insights will be preserved</li>
                      </ul>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      You can always resubscribe later to regain unlimited access.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleCancelSubscription}
                    disabled={cancellingSubscription}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {cancellingSubscription ? "Canceling..." : "Yes, Cancel Subscription"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Free user
  const remainingSessions = Math.max(0, 3 - usageData.dailyCount);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <span>Free Plan</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">🆓</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Free User</h3>
            <p className="text-sm text-gray-600">
              {remainingSessions > 0 
                ? `${remainingSessions} sessions remaining today`
                : "Daily limit reached"
              }
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-600">3/3</div>
            <div className="text-xs text-gray-500">daily sessions</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>3 free reset sessions per day</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Access to all session types</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Basic progress tracking</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>Sessions reset daily at midnight</span>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-purple-800 mb-2">Upgrade to GetResett+</h4>
            <ul className="text-sm text-purple-700 space-y-1 mb-3">
              <li>• Unlimited daily sessions</li>
              <li>• Advanced insights and analytics</li>
              <li>• Priority support</li>
            </ul>
            <div className="text-lg font-bold text-purple-600 mb-4">{localizedPrice.formatted}<span className="text-sm font-normal">/month</span></div>
            
            <Button 
              onClick={() => {
                // Navigate to the feeling check page which will trigger the upgrade flow
                window.location.href = '/';
              }}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to GetResett+
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Or upgrade when you try to start your 4th session today
          </p>
        </div>
      </CardContent>
    </Card>
  );
}