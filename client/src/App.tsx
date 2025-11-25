import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Download from "@/pages/download";
import Business from "@/pages/business";
import BusinessContact from "@/pages/business-contact";
import Demo from "@/pages/demo";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Admin from "@/pages/admin";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import ErrorBoundary from "@/components/error-boundary";

function Router() {
  return (
    <Switch>
      {/* Public Marketing Pages */}
      <Route path="/" component={Landing} />
      <Route path="/download" component={Download} />
      <Route path="/business" component={Business} />
      <Route path="/business/contact" component={BusinessContact} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      
      {/* Auth Pages */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      
      {/* Protected Pages */}
      <Route path="/demo" component={Demo} />
      <Route path="/admin" component={Admin} />
      
      {/* 404 for everything else */}
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
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
