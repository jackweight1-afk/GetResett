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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-teal-600 flex items-center justify-center shadow-lg">
            <Building2 className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-3">
          <h1 
            data-testid="title-corporate-code"
            className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-teal-600 bg-clip-text text-transparent"
          >
            Do you have a company access code?
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
            If your organisation is partnering with GetResett, you can enter your code to unlock GetResett+ at no cost.
          </p>
        </div>

        {/* Corporate Code Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="code">Corporate code</Label>
            <Input
              data-testid="input-corporate-code"
              id="code"
              type="text"
              placeholder="Enter your code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 text-center text-lg tracking-wider uppercase"
            />
          </div>

          <div className="space-y-3">
            <Button
              data-testid="button-confirm"
              type="submit"
              size="lg"
              disabled={isLoading || !code.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-semibold"
            >
              {isLoading ? "Validating..." : "Confirm & continue"}
            </Button>

            <Button
              data-testid="button-skip"
              type="button"
              size="lg"
              variant="outline"
              onClick={handleSkip}
              className="w-full"
            >
              Skip for now
            </Button>
          </div>
        </form>

        {/* Helper Text */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          You can add a corporate code later in your account settings
        </div>
      </div>
    </div>
  );
}
