import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from './useAuth';

interface SessionLimits {
  dailyCount: number;
  canAccess: boolean;
  isSubscribed: boolean;
  resetTime: string;
}

export function useSessionLimits() {
  const { isAuthenticated } = useAuth();
  const [localCount, setLocalCount] = useState(0);

  // Check subscription status from server
  const { data: subscriptionData } = useQuery<{ isSubscribed: boolean }>({
    queryKey: ['/api/auth/user'],
    enabled: isAuthenticated,
    select: (data: any) => {
      const isSubscribed = data?.subscriptionStatus === 'active' || data?.subscriptionStatus === 'trialing';
      // Debug: Check subscription status
      if (data?.subscriptionStatus) {
        console.log('Subscription check:', { 
          subscriptionStatus: data?.subscriptionStatus, 
          isSubscribed,
          stripeSubscriptionId: data?.stripeSubscriptionId 
        });
      }
      return { isSubscribed };
    }
  });

  // Get today's date string for storage key
  const getTodayKey = () => {
    return `session_count_${new Date().toDateString()}`;
  };

  // Load count from localStorage
  useEffect(() => {
    const todayKey = getTodayKey();
    const stored = localStorage.getItem(todayKey);
    
    if (stored) {
      setLocalCount(parseInt(stored, 10));
    } else {
      setLocalCount(0);
    }

    // Clean up old dates
    const today = new Date().toDateString();
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('session_count_') && !key.includes(today)) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  // Save count to localStorage
  const incrementCount = () => {
    const newCount = localCount + 1;
    setLocalCount(newCount);
    localStorage.setItem(getTodayKey(), newCount.toString());
  };

  // Calculate session limits
  const isSubscribed = subscriptionData?.isSubscribed || false;
  const dailyLimit = 3;
  const canAccess = isSubscribed || localCount < dailyLimit;
  const remainingSessions = Math.max(0, dailyLimit - localCount);

  // Calculate reset time (midnight)
  const getResetTime = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return {
    dailyCount: localCount,
    canAccess,
    isSubscribed,
    remainingSessions,
    resetTime: getResetTime(),
    incrementCount,
    totalLimit: dailyLimit
  };
}