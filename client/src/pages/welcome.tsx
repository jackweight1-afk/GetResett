import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import logoPath from "@assets/getreset_logo.jpg";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={logoPath} 
            alt="GetResett Logo" 
            className="h-24 w-24 rounded-2xl shadow-lg"
          />
        </div>
        
        {/* Title */}
        <div className="space-y-3">
          <h1 
            data-testid="title-welcome"
            className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-violet-600 to-teal-600 bg-clip-text text-transparent"
          >
            Welcome to GetResett
          </h1>
          <p 
            data-testid="text-subtitle"
            className="text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto px-4"
          >
            Short, guided wellbeing resets for a calmer, more focused mind – in under 2 minutes.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4 pt-6">
          <Link href="/signup">
            <Button 
              data-testid="button-get-started"
              size="lg"
              className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-semibold py-6 text-lg shadow-lg"
            >
              Get started
            </Button>
          </Link>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
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
    </div>
  );
}
