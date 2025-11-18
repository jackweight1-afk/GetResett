import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import logoPath from "@assets/getreset_logo.jpg";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const user = await response.json();
      
      // Invalidate auth queries to refetch user data
      queryClient.invalidateQueries({ queryKey: ["/auth/me"] });
      
      toast({
        title: "Welcome back!",
        description: "Successfully logged in",
      });

      // Redirect based on onboarding status
      if (user.hasCompletedOnboarding) {
        setLocation("/resets");
      } else {
        setLocation("/corporate-code");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src={logoPath} 
            alt="GetResett Logo" 
            className="h-16 w-16 rounded-xl shadow-md"
          />
        </div>

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 
            data-testid="title-login"
            className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-teal-600 bg-clip-text text-transparent"
          >
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Log in to continue your wellness journey
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                data-testid="input-email"
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                data-testid="input-password"
                id="password"
                type="password"
                placeholder="Your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="mt-1"
              />
            </div>
          </div>

          <Button
            data-testid="button-login"
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-semibold"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        {/* Signup Link */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link href="/signup">
            <a 
              data-testid="link-signup"
              className="text-purple-600 hover:text-purple-700 font-semibold underline"
            >
              Sign up
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
