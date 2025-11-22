import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

interface AuthResponse {
  user: User | null;
}

export function useAuth() {
  const { data, isLoading, error } = useQuery<AuthResponse>({
    queryKey: ["/api/auth/me"],
    retry: false,
    // Handle 401 gracefully for anonymous users
    queryFn: async (): Promise<AuthResponse> => {
      const response = await fetch("/api/auth/me");
      if (response.status === 401 || response.status === 403) {
        // User is not authenticated - return null user instead of throwing
        return { user: null };
      }
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return response.json();
    },
  });

  return {
    user: data?.user ?? null,
    isAuthenticated: !!data?.user,
    isLoading,
    error,
    hasPremiumAccess: data?.user?.hasPremiumAccess ?? false,
  };
}
