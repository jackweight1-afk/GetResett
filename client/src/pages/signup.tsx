import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import logoUrl from "@assets/getreset_logo.jpg";
import { Sparkles } from "lucide-react";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response: any = await apiRequest("POST", "/api/auth/signup", { email, password });
      
      // Show premium upgrade notification if applicable
      if (response.isPremium) {
        toast({
          title: "✨ Welcome to GetReset+!",
          description: "Your company has given you premium access with unlimited resets and exclusive community content.",
          duration: 5000,
        });
      } else {
        toast({
          title: "Account created!",
          description: "Welcome to GetReset",
        });
      }

      // Redirect to demo
      setTimeout(() => {
        setLocation("/demo");
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Could not create account",
        variant: "destructive",
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
            <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
            <p className="text-sm text-gray-600 mt-2 text-center">Join GetReset and start your mental fitness journey</p>
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
                Use your work email if your company provides GetReset+
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-10"
                data-testid="input-password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="h-10"
                data-testid="input-confirm-password"
              />
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
