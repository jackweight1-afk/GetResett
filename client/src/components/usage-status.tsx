import { useAuth } from "@/hooks/useAuth";
import { useSessionLimits } from "@/hooks/useSessionLimits";
import { Crown, Zap } from "lucide-react";

export function UsageStatus() {
  const { isAuthenticated } = useAuth();
  const sessionLimits = useSessionLimits();

  if (!isAuthenticated) return null;

  if (sessionLimits.isSubscribed) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-sm font-medium">
        <Crown className="w-4 h-4" />
        <span>GetResett+ Member</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
      <Zap className="w-4 h-4" />
      <span>{sessionLimits.remainingSessions} free sessions left today</span>
    </div>
  );
}