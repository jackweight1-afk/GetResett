import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import logoPath from "@assets/getreset_logo.jpg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState("");
  
  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Get token from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, []);

  const handleSubmit = async (values: ResetPasswordForm) => {
    if (!token) {
      toast({
        title: "Invalid Reset Link",
        description: "No reset token found. Please use the link from your email.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/auth/reset-password", {
        token,
        password: values.password,
      });

      const data = await response.json();
      
      toast({
        title: "Password Reset Successful",
        description: "You can now log in with your new password",
      });

      // Redirect to login after 1 second
      setTimeout(() => {
        setLocation("/login");
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Invalid or expired reset token",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg border border-purple-100/50">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src={logoPath} 
              alt="GetReset Logo" 
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl shadow-md"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 
              data-testid="title-reset-password"
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
            >
              Reset Password
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Enter your new password below
            </p>
          </div>

          {/* Reset Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">New Password</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-password"
                          type="password"
                          placeholder="At least 6 characters"
                          {...field}
                          className="text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Confirm New Password</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-confirm-password"
                          type="password"
                          placeholder="Re-enter your password"
                          {...field}
                          className="text-sm sm:text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                data-testid="button-reset-password"
                type="submit"
                size="lg"
                disabled={isLoading || !token}
                className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-medium text-sm sm:text-base"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </Form>

          {/* Back to Login */}
          <div className="text-center text-xs sm:text-sm text-gray-600 mt-6 pt-6 border-t border-gray-200">
            Remember your password?{" "}
            <Link href="/login">
              <a 
                data-testid="link-login"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Log in
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
