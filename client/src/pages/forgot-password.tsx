import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import logoPath from "@assets/getreset_logo.jpg";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetUrl, setResetUrl] = useState("");
  
  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/auth/forgot-password", {
        email: values.email,
      });

      const data = await response.json();
      
      setResetSent(true);
      
      // In development, show the reset URL
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }

      toast({
        title: "Reset Link Generated",
        description: "Check the instructions below to reset your password.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process request",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 px-4 py-6">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 sm:p-7 shadow-lg border border-purple-100/50">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img 
              src={logoPath} 
              alt="GetReset Logo" 
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl shadow-md"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-5">
            <h1 
              data-testid="title-forgot-password"
              className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5"
            >
              Forgot Password
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Enter your email
            </p>
          </div>

          {!resetSent ? (
            /* Reset Form */
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3.5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-email"
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                          className="text-sm h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  data-testid="button-send-reset"
                  type="submit"
                  size="default"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-medium text-xs sm:text-sm h-10"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </Form>
          ) : (
            /* Success Message */
            <Alert className="border-green-200 bg-green-50/80 backdrop-blur-sm text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-semibold text-xs sm:text-sm">Reset link generated!</p>
                  <p className="text-[11px] sm:text-xs">
                    If an account exists with that email, you can reset it.
                  </p>
                  {resetUrl && (
                    <div className="space-y-1.5 pt-2 border-t border-green-200">
                      <p className="text-[11px] font-semibold">Dev Mode:</p>
                      <Link 
                        href={resetUrl}
                        data-testid="link-reset-password"
                        className="text-[11px] text-purple-600 hover:text-purple-700 underline break-all"
                      >
                        Reset password now
                      </Link>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Back to Login */}
          <div className="text-center text-[11px] sm:text-xs text-gray-600 mt-4 pt-4 border-t border-gray-200">
            Remember your password?{" "}
            <Link 
              href="/login"
              data-testid="link-login"
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
