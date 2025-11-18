import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Building2 } from "lucide-react";

export default function CorporateCode() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/user/corporate-code", {
        code: code.trim(),
      });

      const result = await response.json();
      
      toast({
        title: "Corporate Access Unlocked!",
        description: `Welcome to ${result.organisation.name}`,
      });

      // Redirect to first reset
      setLocation("/first-reset");
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

  const handleSkip = () => {
    setLocation("/first-reset");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg border border-purple-100/50">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-purple-600 to-teal-600 flex items-center justify-center shadow-lg">
              <Building2 className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 
              data-testid="title-corporate-code"
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
            >
              Do you have a company access code?
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              If your organisation is partnering with GetReset, you can enter your code to unlock unlimited access.
            </p>
          </div>

          {/* Corporate Code Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="code" className="text-sm font-medium text-gray-700">Corporate code</Label>
              <Input
                data-testid="input-corporate-code"
                id="code"
                type="text"
                placeholder="Enter your code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1.5 text-center text-sm sm:text-base tracking-wider uppercase"
              />
            </div>

            <div className="space-y-3">
              <Button
                data-testid="button-confirm"
                type="submit"
                size="lg"
                disabled={isLoading || !code.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-medium text-sm sm:text-base"
              >
                {isLoading ? "Validating..." : "Confirm & continue"}
              </Button>

              <Button
                data-testid="button-skip"
                type="button"
                size="lg"
                variant="outline"
                onClick={handleSkip}
                className="w-full text-sm sm:text-base"
              >
                Skip for now
              </Button>
            </div>
          </form>

          {/* Helper Text */}
          <div className="text-center text-xs sm:text-sm text-gray-500 mt-6 pt-6 border-t border-gray-200">
            You can add a corporate code later in your account settings
          </div>
        </div>
      </div>
    </div>
  );
}
