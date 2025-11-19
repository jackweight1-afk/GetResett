import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Download from "@/pages/download";
import Business from "@/pages/business";
import BusinessContact from "@/pages/business-contact";
import AdminDashboard from "@/pages/admin-dashboard";
import Welcome from "@/pages/welcome";
import Signup from "@/pages/signup";
import BusinessSignup from "@/pages/business-signup";
import Login from "@/pages/login";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import PendingApproval from "@/pages/pending-approval";
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
      const onboardingPaths = ['/first-reset', '/welcome', '/signup', '/login'];
      if (!onboardingPaths.includes(location) && location !== '/') {
        // User is trying to access protected pages without completing onboarding
        window.location.href = '/first-reset';
      }
    }

    // If authenticated and onboarding complete, redirect away from onboarding pages
    if (isAuthenticated && user?.hasCompletedOnboarding) {
      const onboardingPaths = ['/welcome', '/signup', '/login', '/first-reset'];
      if (onboardingPaths.includes(location)) {
        window.location.href = '/resets';
      }
    }
  }, [isAuthenticated, isLoading, user, location]);

  return (
    <Switch>
      {/* B2B Marketing Routes - Always public */}
      <Route path="/" component={Landing} />
      <Route path="/download" component={Download} />
      <Route path="/business" component={Business} />
      <Route path="/business/contact" component={BusinessContact} />
      
      {/* Public routes - available to everyone */}
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/payment" component={Payment} />
      <Route path="/checkout" component={Checkout} />
      
      {/* Onboarding routes - only for non-authenticated or incomplete onboarding */}
      <Route path="/welcome" component={Welcome} />
      <Route path="/signup" component={Signup} />
      <Route path="/business-signup" component={BusinessSignup} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/pending-approval" component={PendingApproval} />
      <Route path="/first-reset" component={FirstReset} />
      
      {isLoading ? (
        <Route>
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </Route>
      ) : !isAuthenticated ? (
        <>
          <Route path="/resets" component={Resets} />
          <Route component={NotFound} />
        </>
      ) : (
        <>
          <Route path="/resets" component={Resets} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/insights" component={Insights} />
          <Route path="/account" component={Account} />
          <Route path="/account/*" component={Account} />
          <Route path="/admin" component={AdminDashboard} />
          <Route component={NotFound} />
        </>
      )}
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
