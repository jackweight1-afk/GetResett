import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Welcome from "@/pages/welcome";
import Signup from "@/pages/signup";
import Login from "@/pages/login";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import CorporateCode from "@/pages/corporate-code";
import FirstReset from "@/pages/first-reset";
import Dashboard from "@/pages/dashboard";
import Resets from "@/pages/resets";
import Insights from "@/pages/insights";
import Account from "@/pages/account";
import Subscribe from "@/pages/subscribe";
import Payment from "@/pages/payment";
import Checkout from "@/pages/checkout";
import InstallPrompt from "@/components/install-prompt";
import ErrorBoundary from "@/components/error-boundary";
import { useLocation } from "wouter";

function Router() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  // Redirect logic based on auth state and onboarding completion
  React.useEffect(() => {
    if (isLoading) return;

    // Handle checkout redirect
    if (isAuthenticated && sessionStorage.getItem('return-to-checkout')) {
      sessionStorage.removeItem('return-to-checkout');
      setTimeout(() => {
        window.location.href = '/checkout';
      }, 100);
      return;
    }

    // If authenticated but onboarding not complete, redirect to appropriate step
    if (isAuthenticated && user && !user.hasCompletedOnboarding) {
      const onboardingPaths = ['/corporate-code', '/first-reset', '/welcome', '/signup', '/login'];
      if (!onboardingPaths.includes(location) && location !== '/') {
        // User is trying to access protected pages without completing onboarding
        window.location.href = '/corporate-code';
      }
    }

    // If authenticated and onboarding complete, redirect away from onboarding pages
    if (isAuthenticated && user?.hasCompletedOnboarding) {
      const onboardingPaths = ['/welcome', '/signup', '/login', '/corporate-code', '/first-reset'];
      if (onboardingPaths.includes(location)) {
        window.location.href = '/resets';
      }
    }
  }, [isAuthenticated, isLoading, user, location]);

  return (
    <Switch>
      {/* Public routes - available to everyone */}
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/payment" component={Payment} />
      <Route path="/checkout" component={Checkout} />
      
      {/* Onboarding routes - only for non-authenticated or incomplete onboarding */}
      <Route path="/welcome" component={Welcome} />
      <Route path="/signup" component={Signup} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/corporate-code" component={CorporateCode} />
      <Route path="/first-reset" component={FirstReset} />
      
      {isLoading ? (
        <Route path="/" component={Landing} />
      ) : !isAuthenticated ? (
        <>
          <Route path="/" component={Welcome} />
          <Route path="/resets" component={Resets} />
        </>
      ) : (
        <>
          <Route path="/" component={Resets} />
          <Route path="/resets" component={Resets} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/insights" component={Insights} />
          <Route path="/account" component={Account} />
          <Route path="/account/*" component={Account} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <InstallPrompt />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
