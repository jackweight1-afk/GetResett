import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import logoPath from "@assets/getreset_logo.jpg";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms & Privacy Policy",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      const user = await response.json();
      
      toast({
        title: "Account Created",
        description: "Welcome to GetResett!",
      });

      // Redirect to corporate code page
      setLocation("/corporate-code");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again",
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
            data-testid="title-signup"
            className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-teal-600 bg-clip-text text-transparent"
          >
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Join thousands finding calm every day
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                data-testid="input-name"
                id="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-1"
              />
            </div>

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
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                data-testid="checkbox-terms"
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, agreeToTerms: checked === true })
                }
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
              >
                I've read & agree to the{" "}
                <a href="/terms" className="text-purple-600 hover:underline">
                  Terms
                </a>{" "}
                &{" "}
                <a href="/privacy" className="text-purple-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
          </div>

          <Button
            data-testid="button-signup"
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-semibold"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        {/* Login Link */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login">
            <a 
              data-testid="link-login"
              className="text-purple-600 hover:text-purple-700 font-semibold underline"
            >
              Log in
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
