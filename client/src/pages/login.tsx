import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import logoUrl from "@assets/getreset_logo.jpg";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/login", { email, password });
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });

      // Redirect to demo or admin based on user
      if (email.toLowerCase() === "getresett@gmail.com") {
        setLocation("/admin");
      } else {
        setLocation("/demo");
      }
    } catch (error: any) {
      toast({
        title: "Couldn't sign you in",
        description: error.message || "Please check your email and password and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-purple-100/50">
          <div className="flex flex-col items-center mb-8">
            <img 
              src={logoUrl} 
              alt="GetReset Logo" 
              className="w-16 h-16 rounded-2xl shadow-lg mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-sm text-gray-600 mt-2">Sign in to your GetReset account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs">Work Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10"
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 pr-10"
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 hover:from-pink-600 hover:via-purple-600 hover:to-teal-600 text-white font-semibold"
              data-testid="button-login"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => setLocation("/signup")}
                className="text-teal-600 hover:text-teal-700 font-semibold"
                data-testid="link-signup"
              >
                Sign up
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <button
              onClick={() => setLocation("/")}
              className="text-sm text-gray-500 hover:text-gray-700"
              data-testid="link-home"
            >
              ← Back to home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
