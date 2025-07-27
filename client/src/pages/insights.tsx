import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect } from "react";
import Navigation from "@/components/navigation";
import BottomNavigation from "@/components/bottom-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserSession, SleepEntry } from "@shared/schema";
import { 
  TrendingUp, 
  Moon, 
  Wind, 
  Calendar,
  Clock,
  Target,
  Activity
} from "lucide-react";

interface UserStats {
  totalSessions: number;
  currentStreak: number;
  totalMinutes: number;
}

interface UserInsights {
  consistencyScore: number;
  averageSleepQuality: number;
  stressImprovement: number;
  favoriteSessionType: string;
  peakTime: string;
  correlations: {
    sleepExercise: string;
    stressSleep: string;
    moodStreaks: string;
    timeOfDay: string;
  };
}

export default function Insights() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

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

  const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["/api/stats"],
    enabled: isAuthenticated,
  });

  const { data: insights, isLoading: insightsLoading } = useQuery<UserInsights>({
    queryKey: ["/api/insights"],
    enabled: isAuthenticated,
  });

  const { data: recentSessions, isLoading: sessionsLoading } = useQuery<UserSession[]>({
    queryKey: ["/api/sessions"],
    enabled: isAuthenticated,
  });

  const { data: sleepEntries, isLoading: sleepLoading } = useQuery<SleepEntry[]>({
    queryKey: ["/api/sleep"],
    enabled: isAuthenticated,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wellness Insights</h1>
          <p className="text-gray-600">Track your progress and discover patterns in your wellness journey.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-teal" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats?.totalSessions || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats?.currentStreak || 0} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Minutes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statsLoading ? "..." : stats?.totalMinutes || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-sage/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-sage" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Consistency</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {insightsLoading ? "..." : `${insights?.consistencyScore || 0}%`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wind className="w-5 h-5 text-blue-600" />
                <span>Stress & Wellness</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Stress Level Change</span>
                    <span className={`font-semibold ${
                      (insights?.stressImprovement || 0) > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {insightsLoading ? "..." : `${(insights?.stressImprovement || 0) > 0 ? '+' : ''}${insights?.stressImprovement || 0}%`}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        (insights?.stressImprovement || 0) > 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min(Math.abs(insights?.stressImprovement || 0), 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Most Used Session Type</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {insightsLoading ? "..." : insights?.favoriteSessionType || "None yet"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Peak Activity Time</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {insightsLoading ? "..." : insights?.peakTime || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Moon className="w-5 h-5 text-purple-600" />
                <span>Sleep Quality</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-2">
                    {insightsLoading ? "..." : insights?.averageSleepQuality?.toFixed(1) || "0.0"}
                  </div>
                  <p className="text-sm text-gray-600">Average Sleep Quality</p>
                  <p className="text-xs text-gray-500">out of 10</p>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${((insights?.averageSleepQuality || 0) / 10) * 100}%` 
                    }}
                  ></div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    {sleepLoading ? "..." : `${sleepEntries?.length || 0} sleep entries recorded`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actionable Insights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-emerald">Your Personal Insights</CardTitle>
            <p className="text-gray-600">Discover patterns in your wellness journey</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insightsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                ))
              ) : insights?.correlations ? (
                <>
                  <div className="p-4 bg-emerald/10 rounded-lg border border-emerald/30">
                    <h4 className="font-semibold text-emerald mb-2">💤 Sleep & Movement</h4>
                    <p className="text-sm text-gray-800">{insights.correlations.sleepExercise}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-700 mb-2">😌 Stress & Sleep</h4>
                    <p className="text-sm text-gray-800">{insights.correlations.stressSleep}</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-semibold text-orange-700 mb-2">🔥 Consistency Impact</h4>
                    <p className="text-sm text-gray-800">{insights.correlations.moodStreaks}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-700 mb-2">⏰ Timing Patterns</h4>
                    <p className="text-sm text-gray-800">{insights.correlations.timeOfDay}</p>
                  </div>
                </>
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-500">Complete a few more sessions to unlock personalized insights</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Session History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-teal" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessionsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : recentSessions?.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No sessions recorded yet.</p>
                <p className="text-sm text-gray-400">Start your wellness journey today!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentSessions?.slice(0, 10).map((session: any) => (
                  <div key={session.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-teal rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-900">Session Completed</p>
                        <p className="text-sm text-gray-500">
                          {session.completedAt ? new Date(session.completedAt).toLocaleDateString() : 'N/A'} at{' '}
                          {session.completedAt ? new Date(session.completedAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {session.duration || 60}s
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <BottomNavigation />
    </div>
  );
}
