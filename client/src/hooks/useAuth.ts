import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { useEffect } from "react";
import type { User } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
  });

  const isAuthenticated = !!user;

  // Track authentication state in sessionStorage to prevent login loops
  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem('user-authenticated', 'true');
    } else {
      sessionStorage.removeItem('user-authenticated');
    }
  }, [isAuthenticated]);

  return {
    user,
    isLoading,
    isAuthenticated,
  };
}
