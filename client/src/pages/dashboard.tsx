import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect, useState, useMemo, lazy, Suspense } from "react";
import Navigation from "@/components/navigation";
import BottomNavigation from "@/components/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { SessionType, UserSession } from "@shared/schema";
import { 
  Moon, 
  Wind, 
  Target, 
  Dumbbell, 
  Waves, 
  Zap,
  ArrowRight,
  TrendingUp,
  Clock
} from "lucide-react";

// Lazy load the session modal for better initial page load
const SessionModal = lazy(() => import("@/components/session-modal-new"));

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
}

const iconMap = {
  "fas fa-moon": Moon,
  "fas fa-wind": Wind,
  "fas fa-street-view": Target,
  "fas fa-dumbbell": Dumbbell,
  "fas fa-spa": Waves,
  "fas fa-bullseye": Zap,
};

const colorMap = {
  purple: "bg-purple-100 text-purple-700",
  blue: "bg-blue-100 text-blue-700",
  sage: "bg-sage/15 text-sage border border-sage/30",
  mint: "bg-mint/15 text-mint border border-mint/30",
  emerald: "bg-emerald/15 text-emerald border border-emerald/30",
  orange: "bg-orange-100 text-orange-700",
  teal: "bg-teal/15 text-teal border border-teal/30",
  yellow: "bg-yellow-100 text-yellow-700",
};

const textColorMap = {
  purple: "text-purple-700",
  blue: "text-blue-700", 
  sage: "text-sage",
  mint: "text-mint",
  emerald: "text-emerald",
  orange: "text-orange-700",
  teal: "text-teal",
  yellow: "text-yellow-700",
};

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(null);

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

  const { data: sessionTypes, isLoading: sessionTypesLoading } = useQuery<SessionType[]>({
    queryKey: ["/api/session-types"],
    enabled: isAuthenticated,
  });

  const { data: recentSessions, isLoading: sessionsLoading } = useQuery<UserSession[]>({
    queryKey: ["/api/sessions"],
    enabled: isAuthenticated,
  });

  const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["/api/stats"],
    enabled: isAuthenticated,
  });

  const { data: insights, isLoading: insightsLoading } = useQuery<UserInsights>({
    queryKey: ["/api/insights"],
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 pb-20 md:pb-0">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-teal-600 rounded-2xl sm:rounded-3xl p-6 md:p-8 text-black relative overflow-hidden shadow-xl">
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-white">
                Welcome back, {user?.firstName || "there"}!
              </h2>
              <p className="text-white/90 font-medium mb-6 text-sm sm:text-base lg:text-lg">Ready for your next 60-second reset? You're doing great!</p>
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    {statsLoading ? "..." : stats?.currentStreak || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 font-medium">Day Streak</div>
                </div>
                <div className="text-center bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    {statsLoading ? "..." : stats?.totalSessions || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 font-medium">Sessions</div>
                </div>
                <div className="text-center bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                    {statsLoading ? "..." : stats?.totalMinutes || 0}
                  </div>
                  <div className="text-xs sm:text-sm text-white/80 font-medium">Minutes</div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-white opacity-5 rounded-full -mr-10 -mb-10 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-0 w-24 h-24 bg-teal-300 opacity-10 rounded-full -ml-12 animate-bounce delay-2000"></div>
          </div>
        </div>

        {/* Session Selection Grid */}
        <div className="mb-6 md:mb-8">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center sm:text-left">Choose Your Perfect Reset</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sessionTypesLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border border-gray-100">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              sessionTypes?.map((sessionType: SessionType) => {
                const IconComponent = iconMap[sessionType.icon as keyof typeof iconMap] || Clock;
                const colorClass = colorMap[sessionType.color as keyof typeof colorMap] || "bg-gray-100 text-gray-600";
                const textColor = textColorMap[sessionType.color as keyof typeof textColorMap] || "text-gray-600";
                
                return (
                  <Card 
                    key={sessionType.id}
                    className="border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm overflow-hidden group"
                    onClick={() => setSelectedSession(sessionType)}
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ${colorClass} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                          {sessionType.name === "Sleep Check-in" ? "Track" : "60s"}
                        </div>
                      </div>
                      <h4 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{sessionType.name}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-2">{sessionType.description}</p>
                      <div className={`flex items-center text-sm ${textColor} font-semibold group-hover:translate-x-1 transition-transform`}>
                        <span>Start Session</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="border border-gray-100">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h3>
              <div className="space-y-4">
                {sessionsLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4 animate-pulse">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                      <div className="h-3 bg-gray-200 rounded w-8"></div>
                    </div>
                  ))
                ) : recentSessions?.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No sessions yet. Start your first reset!</p>
                ) : (
                  recentSessions?.slice(0, 3).map((session: UserSession) => {
                    const sessionType = sessionTypes?.find((st: SessionType) => st.id === session.sessionTypeId);
                    const IconComponent = iconMap[sessionType?.icon as keyof typeof iconMap] || Clock;
                    const colorClass = colorMap[sessionType?.color as keyof typeof colorMap] || "bg-gray-100 text-gray-600";
                    
                    return (
                      <div key={session.id} className="flex items-center space-x-4">
                        <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{sessionType?.name}</div>
                          <div className="text-sm text-gray-500">
                            {session.completedAt ? new Date(session.completedAt).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">{session.duration || 60}s</div>
                      </div>
                    );
                  })
                )}
              </div>
              {(recentSessions?.length || 0) > 0 && (
                <Button variant="ghost" className="mt-4 text-teal hover:text-teal/80" size="sm">
                  View All Sessions
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border border-gray-100">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sessions Completed</span>
                  <span className="font-semibold text-gray-900">
                    {statsLoading ? "..." : stats?.totalSessions || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-teal h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${Math.min((stats?.totalSessions || 0) * 10, 100)}%` 
                    }}
                  ></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-sage">
                      {insightsLoading ? "..." : insights?.favoriteSessionType?.split(" ")[0] || "None"}
                    </div>
                    <div className="text-xs text-gray-500">Most Used</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {insightsLoading ? "..." : insights?.peakTime || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500">Peak Time</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights Preview */}
        <div className="bg-gradient-to-r from-purple-50 via-white to-teal-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">Your Wellness Insights</h3>
            <Button 
              variant="ghost" 
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-semibold rounded-full px-6"
              onClick={() => window.location.href = "/insights"}
            >
              View Full Report
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-teal-50/30">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <TrendingUp className="text-white w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Consistency</h4>
                <p className="text-3xl font-black text-teal-600 mb-2">
                  {insightsLoading ? "..." : `${insights?.consistencyScore || 0}%`}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">You're maintaining great daily habits!</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-emerald-50/30">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Wind className="text-white w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Stress Levels</h4>
                <p className="text-3xl font-black text-emerald-600 mb-2">
                  {insightsLoading ? "..." : `${(insights?.stressImprovement || 0) > 0 ? '+' : ''}${insights?.stressImprovement || 0}%`}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">Change since last week</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50/30 sm:col-span-2 lg:col-span-1">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Moon className="text-white w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">Sleep Quality</h4>
                <p className="text-3xl font-black text-purple-600 mb-2">
                  {insightsLoading ? "..." : `${insights?.averageSleepQuality || 0}/10`}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">Average this week</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {selectedSession && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full" />
          </div>
        }>
          <SessionModal 
            sessionType={selectedSession}
            onClose={() => setSelectedSession(null)}
          />
        </Suspense>
      )}
      
      <BottomNavigation />
    </div>
  );
}
