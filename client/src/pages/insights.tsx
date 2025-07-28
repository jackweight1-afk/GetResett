import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect, useState } from "react";
import Navigation from "@/components/navigation";
import BottomNavigation from "@/components/bottom-navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import type { UserSession, SleepEntry } from "@shared/schema";
import { 
  TrendingUp, 
  Moon, 
  Wind, 
  Calendar,
  Clock,
  Target,
  Activity,
  ChevronDown,
  ChevronUp,
  Heart,
  Zap,
  BarChart3,
  Flame
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
  const [openSections, setOpenSections] = useState<string[]>(['daily-mood']);

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

  // Toggle section open/close
  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Mock data for visualization (replace with real data from API)
  const dailyMoodData = [
    { date: 'Mon', before: 2, after: 4 },
    { date: 'Tue', before: 3, after: 4 },
    { date: 'Wed', before: 2, after: 5 },
    { date: 'Thu', before: 3, after: 4 },
    { date: 'Fri', before: 2, after: 4 },
    { date: 'Sat', before: 4, after: 5 },
    { date: 'Sun', before: 3, after: 5 },
  ];

  const mostUsedSessions = [
    { name: 'Stress Relief', count: 12, color: 'bg-blue-500' },
    { name: 'Sleep Prep', count: 8, color: 'bg-purple-500' },
    { name: 'Energy Boost', count: 5, color: 'bg-orange-500' },
    { name: 'Focus Flow', count: 4, color: 'bg-emerald-500' },
  ];

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wellness Insights</h1>
          <p className="text-gray-600">Track your progress and discover patterns in your wellness journey.</p>
        </div>

        {/* Collapsible Insight Sections */}
        <div className="space-y-4">
          
          {/* Daily Mood Log */}
          <Card className="overflow-hidden">
            <Collapsible 
              open={openSections.includes('daily-mood')} 
              onOpenChange={() => toggleSection('daily-mood')}
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Daily Mood Log</h3>
                      <p className="text-sm text-gray-600">Track your emotional journey</p>
                    </div>
                  </div>
                  {openSections.includes('daily-mood') ? 
                    <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  }
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-4">
                  <div className="grid grid-cols-7 gap-2">
                    {dailyMoodData.map((day, index) => (
                      <div key={index} className="text-center">
                        <div className="text-xs text-gray-500 mb-2">{day.date}</div>
                        <div className="space-y-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-400 h-2 rounded-full" 
                              style={{ width: `${(day.before / 5) * 100}%` }}
                            ></div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-400 h-2 rounded-full" 
                              style={{ width: `${(day.after / 5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{day.before}→{day.after}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-red-400 rounded"></div>
                      <span>Before</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-3 h-3 bg-green-400 rounded"></div>
                      <span>After</span>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Mood Improvements Visual */}
          <Card className="overflow-hidden">
            <Collapsible 
              open={openSections.includes('mood-improvements')} 
              onOpenChange={() => toggleSection('mood-improvements')}
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Mood Improvements</h3>
                      <p className="text-sm text-gray-600">See your progress over time</p>
                    </div>
                  </div>
                  {openSections.includes('mood-improvements') ? 
                    <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  }
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4">
                  <div className="bg-gradient-to-r from-red-100 to-green-100 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium text-gray-700">Weekly Average</span>
                      <span className="text-2xl font-bold text-green-600">+2.1</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Before Sessions</span>
                        <span className="font-medium">2.3/5</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>After Sessions</span>
                        <span className="font-medium text-green-600">4.4/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Sessions Completed */}
          <Card className="overflow-hidden">
            <Collapsible 
              open={openSections.includes('sessions-completed')} 
              onOpenChange={() => toggleSection('sessions-completed')}
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Sessions Completed</h3>
                      <p className="text-sm text-gray-600">Your reset activity</p>
                    </div>
                  </div>
                  {openSections.includes('sessions-completed') ? 
                    <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  }
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{statsLoading ? "..." : stats?.totalSessions || 0}</div>
                      <div className="text-sm text-gray-600">Total Sessions</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{statsLoading ? "..." : stats?.totalMinutes || 0}</div>
                      <div className="text-sm text-gray-600">Total Minutes</div>
                    </div>
                  </div>
                  <div className="text-center text-sm text-gray-500">
                    That's {statsLoading ? "..." : Math.round((stats?.totalMinutes || 0) / 60)} hours of wellness!
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Mood Before and After Sessions */}
          <Card className="overflow-hidden">
            <Collapsible 
              open={openSections.includes('mood-before-after')} 
              onOpenChange={() => toggleSection('mood-before-after')}
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Mood Before & After Sessions</h3>
                      <p className="text-sm text-gray-600">See session impact</p>
                    </div>
                  </div>
                  {openSections.includes('mood-before-after') ? 
                    <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  }
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="text-lg font-bold text-red-600">2.1</div>
                      <div className="text-xs text-gray-600">Avg Before</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-bold text-gray-600">→</div>
                      <div className="text-xs text-gray-600">Sessions</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">4.3</div>
                      <div className="text-xs text-gray-600">Avg After</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>+2.2 point improvement</span>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Most Used Reset Sessions */}
          <Card className="overflow-hidden">
            <Collapsible 
              open={openSections.includes('most-used-sessions')} 
              onOpenChange={() => toggleSection('most-used-sessions')}
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Most Used Reset Sessions</h3>
                      <p className="text-sm text-gray-600">Your favorite resets</p>
                    </div>
                  </div>
                  {openSections.includes('most-used-sessions') ? 
                    <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  }
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-3">
                  {mostUsedSessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 ${session.color} rounded-full`}></div>
                        <span className="font-medium text-gray-900">{session.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{session.count} times</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${session.color}`}
                            style={{ width: `${(session.count / 12) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Usage Streaks */}
          <Card className="overflow-hidden">
            <Collapsible 
              open={openSections.includes('usage-streaks')} 
              onOpenChange={() => toggleSection('usage-streaks')}
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Flame className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Usage Streaks</h3>
                      <p className="text-sm text-gray-600">Keep the momentum going</p>
                    </div>
                  </div>
                  {openSections.includes('usage-streaks') ? 
                    <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  }
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600">{statsLoading ? "..." : stats?.currentStreak || 0}</div>
                      <div className="text-sm text-gray-600">Current Streak</div>
                      <div className="text-xs text-gray-500">days</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-3xl font-bold text-purple-600">12</div>
                      <div className="text-sm text-gray-600">Best Streak</div>
                      <div className="text-xs text-gray-500">days</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                      <Flame className="w-4 h-4" />
                      <span>You're on fire! Keep it up!</span>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </div>

        <BottomNavigation />
      </div>
    </div>
  );
}