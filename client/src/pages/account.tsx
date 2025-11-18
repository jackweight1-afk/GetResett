import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { User, Mail, Calendar, Trash2, LogOut, Shield, ArrowLeft, Building2, Check } from "lucide-react";
import BottomNavigation from "@/components/bottom-navigation";
import { UsageStatus } from "@/components/usage-status";
import { SubscriptionManagement } from "@/components/subscription-management";
import { useSessionLimits } from "@/hooks/useSessionLimits";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Account() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const sessionLimits = useSessionLimits();
  const [, setLocation] = useLocation();
  const [corporateCode, setCorporateCode] = useState("");
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalSessions: number;
    currentStreak: number;
    totalMinutes: number;
    favoriteSessionType: string;
  }>({
    queryKey: ['/api/user/stats'],
    enabled: !!user,
  });

  const handleAddCorporateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!corporateCode.trim()) {
      toast({
        title: "Code Required",
        description: "Please enter a corporate code",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingCode(true);
    try {
      const response = await apiRequest("POST", "/user/corporate-code", {
        code: corporateCode.trim(),
      });

      const result = await response.json();
      
      // Invalidate auth queries to refetch user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      toast({
        title: "Corporate Access Unlocked!",
        description: `Welcome to ${result.organisation.name}. You now have unlimited access to all resets.`,
      });

      setCorporateCode("");
    } catch (error: any) {
      toast({
        title: "Invalid Code",
        description: error.message || "Please check your code and try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingCode(false);
    }
  };

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted.",
        });
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-20 md:pb-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            data-testid="button-back-to-resets"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resets
          </Button>
          <UsageStatus />
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-emerald" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                {user?.profileImageUrl && (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-emerald-200"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : 'Reset User'}
                  </h3>
                  <p className="text-sm text-gray-500">Wellness Enthusiast</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{user?.email || 'No email provided'}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                    month: 'long', 
                    year: 'numeric' 
                  }) : 'Recently'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-emerald" />
                <span>Your Reset Journey</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald">
                    {stats?.totalSessions || 0}
                  </div>
                  <div className="text-sm text-gray-500">Total Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-mint">
                    {stats?.currentStreak || 0}
                  </div>
                  <div className="text-sm text-gray-500">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-sage">
                    {stats?.totalMinutes || 0}
                  </div>
                  <div className="text-sm text-gray-500">Minutes Reset</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal">
                    {stats?.favoriteSessionType || 'None'}
                  </div>
                  <div className="text-sm text-gray-500">Favorite Reset</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Management */}
        <SubscriptionManagement />

        {/* Corporate Code Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-purple-600" />
              <span>Corporate Access</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user?.organisationId ? (
              <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-semibold text-green-900">Corporate Access Active</p>
                  <p className="text-sm text-green-700">You have unlimited access to all resets</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddCorporateCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="corporate-code">Company Access Code</Label>
                  <p className="text-sm text-gray-500">
                    If your organisation partners with GetResett, enter your code to unlock unlimited access at no cost.
                  </p>
                  <Input
                    data-testid="input-corporate-code-account"
                    id="corporate-code"
                    type="text"
                    placeholder="Enter your code"
                    value={corporateCode}
                    onChange={(e) => setCorporateCode(e.target.value)}
                    className="text-center text-lg tracking-wider uppercase"
                  />
                </div>
                <Button
                  data-testid="button-add-corporate-code"
                  type="submit"
                  disabled={isSubmittingCode || !corporateCode.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-semibold"
                >
                  {isSubmittingCode ? "Validating..." : "Add Corporate Code"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center space-x-2 text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive"
                    className="flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Account</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove all of your data from our servers, including:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>All session history and progress</li>
                        <li>Personal insights and analytics</li>
                        <li>Account preferences and settings</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, delete my account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">
                Need help? Contact our support team at{' '}
                <a href="mailto:support@reset.app" className="text-emerald hover:underline">
                  support@reset.app
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <BottomNavigation />
    </div>
  );
}