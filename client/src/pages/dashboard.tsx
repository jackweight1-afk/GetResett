import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect, useState } from "react";
import Navigation from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SessionModal from "@/components/session-modal";
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
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-teal to-sage rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-semibold mb-2">
                Welcome back, {user?.firstName || "there"}
              </h2>
              <p className="text-white/90 mb-4">Ready for your next 60-second reset? You're doing great!</p>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {statsLoading ? "..." : stats?.currentStreak || 0}
                  </div>
                  <div className="text-sm text-white/80">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {statsLoading ? "..." : stats?.totalSessions || 0}
                  </div>
                  <div className="text-sm text-white/80">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {statsLoading ? "..." : stats?.totalMinutes || 0}
                  </div>
                  <div className="text-sm text-white/80">Minutes</div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-white opacity-5 rounded-full -mr-10 -mb-10"></div>
          </div>
        </div>

        {/* Session Selection Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Choose Your Reset</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    className="border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedSession(sessionType)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-sm text-gray-500">~60s</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">{sessionType.name}</h4>
                      <p className="text-gray-600 text-sm mb-4">{sessionType.description}</p>
                      <div className={`flex items-center text-sm ${textColor} font-medium`}>
                        <span>Start Session</span>
                        <ArrowRight className="w-4 h-4 ml-2" />
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
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Your Wellness Insights</h3>
            <Button 
              variant="ghost" 
              className="text-teal hover:text-teal/80"
              onClick={() => window.location.href = "/insights"}
            >
              View Full Report
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="text-teal w-5 h-5" />
                  <h4 className="font-semibold text-gray-900">Consistency</h4>
                </div>
                <p className="text-2xl font-bold text-teal mb-2">
                  {insightsLoading ? "..." : `${insights?.consistencyScore || 0}%`}
                </p>
                <p className="text-sm text-gray-600">You're maintaining great daily habits!</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Wind className="text-sage w-5 h-5" />
                  <h4 className="font-semibold text-gray-900">Stress Levels</h4>
                </div>
                <p className="text-2xl font-bold text-sage mb-2">
                  {insightsLoading ? "..." : `${(insights?.stressImprovement || 0) > 0 ? '+' : ''}${insights?.stressImprovement || 0}%`}
                </p>
                <p className="text-sm text-gray-600">Change since last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Moon className="text-purple-600 w-5 h-5" />
                  <h4 className="font-semibold text-gray-900">Sleep Quality</h4>
                </div>
                <p className="text-2xl font-bold text-purple-600 mb-2">
                  {insightsLoading ? "..." : `${insights?.averageSleepQuality || 0}/10`}
                </p>
                <p className="text-sm text-gray-600">Average this week</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {selectedSession && (
        <SessionModal 
          sessionType={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  );
}
