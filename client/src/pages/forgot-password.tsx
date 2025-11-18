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
            data-testid="title-forgot-password"
            className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-teal-600 bg-clip-text text-transparent"
          >
            Forgot Password
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enter your email to reset your password
          </p>
        </div>

        {!resetSent ? (
          /* Reset Form */
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="input-email"
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                data-testid="button-reset"
                type="submit"
                size="lg"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-semibold"
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
              <div className="space-y-3">
                <p className="font-semibold">Reset link generated!</p>
                <p className="text-sm">
                  If an account exists with that email, you can reset your password.
                </p>
                {resetUrl && (
                  <div className="space-y-2 pt-2 border-t border-green-200">
                    <p className="text-xs font-semibold">Development Mode:</p>
                    <Link href={resetUrl}>
                      <a 
                        data-testid="link-reset-password"
                        className="text-xs text-purple-600 hover:text-purple-700 underline break-all"
                      >
                        Click here to reset your password
                      </a>
                    </Link>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Back to Login */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Remember your password?{" "}
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
