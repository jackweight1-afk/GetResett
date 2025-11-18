import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import logoPath from "@assets/getreset_logo.jpg";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-10 shadow-lg border border-purple-100/50 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src={logoPath} 
              alt="GetReset Logo" 
              className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl shadow-lg"
            />
          </div>
          
          {/* Title */}
          <div className="space-y-3 mb-8">
            <h1 
              data-testid="title-welcome"
              className="text-3xl sm:text-4xl font-bold text-gray-900"
            >
              Welcome to GetReset
            </h1>
            <p 
              data-testid="text-subtitle"
              className="text-sm sm:text-base text-gray-600"
            >
              Short, guided wellbeing resets for a calmer, more focused mind – in under 2 minutes.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <Link href="/signup">
              <Button 
                data-testid="button-get-started"
                size="lg"
                className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-medium text-sm sm:text-base shadow-md"
              >
                Get started
              </Button>
            </Link>
            
            <div className="text-xs sm:text-sm text-gray-600 pt-2">
              Already have an account?{" "}
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
    </div>
  );
}
