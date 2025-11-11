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
  const { user, isAuthenticated } = useAuth();
  const [localCount, setLocalCount] = useState(0);

  // Check subscription status from server
  const { data: subscriptionData } = useQuery<{ isSubscribed: boolean }>({
    queryKey: ['/api/auth/user'],
    enabled: isAuthenticated,
    select: (data: any) => {
      const isSubscribed = data?.subscriptionStatus === 'active' || data?.subscriptionStatus === 'trialing';
      // Debug: Check subscription status
      if (data?.subscriptionStatus) {
        // Subscription status checked
      }
      return { isSubscribed };
    }
  });

  // Get today's date string for storage key (timezone-aware)
  const getTodayKey = () => {
    const today = new Date();
    const localDateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return `session_count_${localDateString}`;
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

    // Clean up old dates (timezone-aware)
    const today = new Date();
    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('session_count_') && !key.includes(todayString)) {
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
  const testAccounts = ['huzefausama25@gmail.com', 'jackweight1@gmail.com'];
  const userEmail = user?.email?.toLowerCase() || '';
  const hasUnlimitedAccess = testAccounts.includes(userEmail);
  const dailyLimit = 3;
  const canAccess = isSubscribed || hasUnlimitedAccess || localCount < dailyLimit;
  const remainingSessions = hasUnlimitedAccess ? 999 : Math.max(0, dailyLimit - localCount);
  
  // Debug logging for test account bypass
  if (userEmail && testAccounts.some(email => userEmail === email)) {
    console.log('[SessionLimits] Test account detected:', {
      userEmail,
      hasUnlimitedAccess,
      canAccess,
      localCount,
      isSubscribed,
      remainingSessions
    });
  }

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
    isSubscribed: isSubscribed || hasUnlimitedAccess,
    remainingSessions,
    resetTime: getResetTime(),
    incrementCount,
    totalLimit: dailyLimit
  };
}