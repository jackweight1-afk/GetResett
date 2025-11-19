import { useAuth } from "@/hooks/useAuth";
import { Building2 } from "lucide-react";

export function UsageStatus() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return null;

  if (user?.organisationId) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-sm font-medium">
        <Building2 className="w-4 h-4" />
        <span>Corporate Access</span>
      </div>
    );
  }
  
  return null;
}