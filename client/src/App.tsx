import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import GuidedFlow from "@/pages/guided-flow";
import Insights from "@/pages/insights";
import Account from "@/pages/account";
import Subscribe from "@/pages/subscribe";
import Payment from "@/pages/payment";
import Checkout from "@/pages/checkout";
import InstallPrompt from "@/components/install-prompt";
import ErrorBoundary from "@/components/error-boundary";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Check if user should be redirected back to checkout after login
  React.useEffect(() => {
    if (isAuthenticated && sessionStorage.getItem('return-to-checkout')) {
      sessionStorage.removeItem('return-to-checkout');
      window.location.href = '/checkout';
    }
  }, [isAuthenticated]);

  return (
    <Switch>
      {/* Public routes - available to everyone */}
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/payment" component={Payment} />
      <Route path="/checkout" component={Checkout} />
      
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={GuidedFlow} />
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
