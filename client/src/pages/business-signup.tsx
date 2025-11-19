import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import logoPath from "@assets/getreset_logo.jpg";
import { Building2, KeyRound } from "lucide-react";

export default function BusinessSignup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [corporateCode, setCorporateCode] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!corporateCode.trim()) {
      toast({
        title: "Code Required",
        description: "Please enter your corporate access code",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/auth/verify-corporate-code", {
        corporateCode: corporateCode.toUpperCase().trim(),
      });

      const data = await response.json();
      setOrganizationName(data.organizationName);
      setCodeVerified(true);
      toast({
        title: "Code Verified",
        description: `Welcome to ${data.organizationName}!`,
      });
    } catch (error: any) {
      toast({
        title: "Invalid Code",
        description: error.message || "Please check your code and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are the same",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/auth/register", {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        corporateCode: corporateCode.toUpperCase().trim(),
      });

      await response.json();
      
      await queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      toast({
        title: "Welcome to GetReset!",
        description: `You now have unlimited access to all resets`,
      });
      
      setLocation("/resets");
    } catch (error: any) {
      if (error.message && error.message.includes("Email already registered")) {
        toast({
          title: "Account Already Exists",
          description: "An account with this email already exists. Please log in instead.",
          variant: "destructive",
          action: (
            <Link href="/login" className="text-white underline font-medium">
              Log In
            </Link>
          ),
        });
      } else {
        toast({
          title: "Registration Failed",
          description: error.message || "Please try again",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 px-4 py-6">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 sm:p-7 shadow-lg border border-purple-100/50">
          <div className="flex justify-center mb-4">
            <img 
              src={logoPath} 
              alt="GetReset Logo" 
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl shadow-md"
            />
          </div>

          <div className="text-center mb-4">
            <h1 
              data-testid="title-business-signup"
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5"
            >
              {codeVerified ? "Create Your Account" : "GetReset for Business"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              {codeVerified 
                ? `Join ${organizationName} with unlimited access`
                : "Enter your company code to get started"
              }
            </p>
          </div>

          {!codeVerified ? (
            <form onSubmit={handleVerifyCode} className="space-y-3.5">
              <div className="space-y-1.5">
                <Label htmlFor="corporateCode" className="text-xs font-medium text-gray-700">
                  Corporate Access Code
                </Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="corporateCode"
                    data-testid="input-corporate-code"
                    type="text"
                    placeholder="GR-XXXXXX"
                    value={corporateCode}
                    onChange={(e) => setCorporateCode(e.target.value.toUpperCase())}
                    className="h-10 pl-10 text-sm"
                    disabled={isLoading}
                    required
                  />
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500">
                  Contact your company admin for your access code
                </p>
              </div>

              <Button
                type="submit"
                data-testid="button-verify-code"
                className="w-full h-10 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium text-sm shadow-md"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium" data-testid="link-login">
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-start gap-2">
                <Building2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-purple-900">{organizationName}</p>
                  <p className="text-[11px] text-purple-700">Unlimited resets included</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs font-medium text-gray-700">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    data-testid="input-firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="h-10 text-sm"
                    disabled={isLoading}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs font-medium text-gray-700">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    data-testid="input-lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="h-10 text-sm"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  data-testid="input-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-10 text-sm"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  data-testid="input-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-10 text-sm"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-medium text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  data-testid="input-confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="h-10 text-sm"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Checkbox
                  id="terms"
                  data-testid="checkbox-terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, agreeToTerms: checked as boolean })
                  }
                  className="mt-0.5"
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-xs text-gray-600 leading-tight">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>

              <Button
                type="submit"
                data-testid="button-signup"
                className="w-full h-10 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium text-sm shadow-md"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <div className="text-center pt-2">
                <p className="text-xs text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                    Log in
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
