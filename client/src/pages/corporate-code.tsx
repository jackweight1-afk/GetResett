import { useState, useEffect } from "react";
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

  // Check for code in URL parameters (from invite link)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlCode = urlParams.get('code');
    if (urlCode) {
      setCode(urlCode.toUpperCase());
    }
  }, []);

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 px-4 py-6">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 sm:p-7 shadow-lg border border-purple-100/50">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br from-purple-600 to-teal-600 flex items-center justify-center shadow-lg">
              <Building2 className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-5">
            <h1 
              data-testid="title-corporate-code"
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-2"
            >
              Company access code?
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xs mx-auto leading-snug">
              Enter your code to unlock unlimited access
            </p>
          </div>

          {/* Corporate Code Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <Label htmlFor="code" className="text-xs font-medium text-gray-700">Corporate code</Label>
              <Input
                data-testid="input-corporate-code"
                id="code"
                type="text"
                placeholder="Enter code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 text-center text-sm tracking-wider uppercase h-10"
              />
            </div>

            <div className="space-y-2.5">
              <Button
                data-testid="button-confirm"
                type="submit"
                size="default"
                disabled={isLoading || !code.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-medium text-xs sm:text-sm h-10"
              >
                {isLoading ? "Validating..." : "Confirm & continue"}
              </Button>

              <Button
                data-testid="button-skip"
                type="button"
                size="default"
                variant="outline"
                onClick={handleSkip}
                className="w-full text-xs sm:text-sm h-10"
              >
                Skip for now
              </Button>
            </div>
          </form>

          {/* Helper Text */}
          <div className="text-center text-[11px] sm:text-xs text-gray-500 mt-4 pt-4 border-t border-gray-200">
            Add code later in account settings
          </div>
        </div>
      </div>
    </div>
  );
}
