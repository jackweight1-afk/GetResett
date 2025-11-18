import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import logoPath from "@assets/getreset_logo.jpg";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 px-4 py-6">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-5 sm:p-7 shadow-lg border border-purple-100/50 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img 
              src={logoPath} 
              alt="GetReset Logo" 
              className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl shadow-lg"
            />
          </div>
          
          {/* Title */}
          <div className="space-y-1.5 mb-5">
            <h1 
              data-testid="title-welcome"
              className="text-xl sm:text-2xl font-bold text-gray-900"
            >
              Welcome to GetReset
            </h1>
            <p 
              data-testid="text-subtitle"
              className="text-xs sm:text-sm text-gray-600 max-w-xs mx-auto leading-snug"
            >
              Quick wellbeing resets for a calmer mind in under 2 minutes
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link href="/signup">
              <Button 
                data-testid="button-get-started"
                size="default"
                className="w-full bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white font-medium text-xs sm:text-sm h-10 shadow-md"
              >
                Get started
              </Button>
            </Link>
            
            <div className="text-[11px] sm:text-xs text-gray-600">
              Already have an account?{" "}
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
    </div>
  );
}
