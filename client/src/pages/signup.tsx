import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import logoUrl from "@assets/getreset_logo.jpg";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure you've entered the same password in both fields.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Choose a stronger password",
        description: "Your password needs to be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response: any = await apiRequest("POST", "/api/auth/signup", { email, password });
      
      // All users get premium access since they must be whitelisted
      toast({
        title: "✨ Welcome to GetReset+!",
        description: "Your company has given you premium access with unlimited resets and exclusive community content.",
        duration: 5000,
      });

      // Redirect to demo
      setTimeout(() => {
        setLocation("/demo");
      }, 1500);
    } catch (error: any) {
      // Handle specific error for non-whitelisted emails
      const errorMessage = error.message || "Could not create account";
      const isAccessDenied = errorMessage.includes("not authorized") || errorMessage.includes("Access Denied");
      
      toast({
        title: isAccessDenied ? "Email Not Registered" : "Couldn't create your account",
        description: isAccessDenied 
          ? "Your work email hasn't been added yet. Please ask your HR team to add you to the GetReset+ employee list."
          : errorMessage,
        variant: "destructive",
        duration: 7000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-teal-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-purple-100/50">
          <div className="flex flex-col items-center mb-8">
            <img 
              src={logoUrl} 
              alt="GetReset Logo" 
              className="w-16 h-16 rounded-2xl shadow-lg mb-4"
            />
            <h1 className="text-2xl font-bold text-gray-900">Employee Login</h1>
            <p className="text-sm text-gray-600 mt-2 text-center">Sign up with your work email to access GetReset+</p>
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
              <p className="text-[11px] text-gray-500">
                Your email must be authorized by your employer
              </p>
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
                  minLength={6}
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="h-10 pr-10"
                  data-testid="input-confirm-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  data-testid="button-toggle-confirm-password"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 hover:from-pink-600 hover:via-purple-600 hover:to-teal-600 text-white font-semibold"
              data-testid="button-signup"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => setLocation("/login")}
                className="text-teal-600 hover:text-teal-700 font-semibold"
                data-testid="link-login"
              >
                Sign in
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
