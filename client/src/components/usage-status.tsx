import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Crown, Zap } from "lucide-react";

export function UsageStatus() {
  const { isAuthenticated } = useAuth();
  
  const { data: usageData } = useQuery<{
    canAccess: boolean;
    isSubscribed: boolean;
    dailyCount: number;
  }>({
    queryKey: ["/api/usage/check"],
    enabled: isAuthenticated,
  });

  if (!usageData) return null;

  if (usageData.isSubscribed) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-sm font-medium">
        <Crown className="w-4 h-4" />
        <span>GetResett+ Member</span>
      </div>
    );
  }

  const remainingSessions = Math.max(0, 3 - usageData.dailyCount);
  
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
      <Zap className="w-4 h-4" />
      <span>{remainingSessions} free sessions left today</span>
    </div>
  );
}