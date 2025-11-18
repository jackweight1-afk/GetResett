import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Zap, Moon, Brain, Star, ArrowRight, Play, Users, Award, Shield, Sparkles, Timer, Clock, Target, TrendingUp, CheckCircle, Leaf, AlertTriangle, X } from "lucide-react";
import { useState, useEffect } from "react";
import logoUrl from "@assets/getreset_logo.jpg";

export default function Landing() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 4000);
    
    // Check for authentication errors in URL
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    if (error === 'auth_failed') {
      setAuthError('Authentication failed. If you use 2FA with Google, please try again or contact support.');
      // Clear the error from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  const testimonials = [
    { name: "Sarah M.", role: "Marketing Manager", text: "60 seconds completely changed my workday stress levels. I'm actually productive again!", rating: 5 },
    { name: "David L.", role: "Software Engineer", text: "Quick resets that actually work between meetings. Game-changer for focus.", rating: 5 },
    { name: "Emma K.", role: "Teacher", text: "My students love doing the breathing exercises with me. We're all calmer now.", rating: 5 }
  ];

  const features = [
    { icon: Timer, title: "Just 60 Seconds", desc: "Fits seamlessly into busy schedules. Reset between meetings, during breaks, or whenever you need to refocus.", color: "from-purple-500 to-indigo-600" },
    { icon: Brain, title: "Science-Backed", desc: "Evidence-based techniques from mindfulness research, designed for maximum impact in minimal time.", color: "from-blue-500 to-cyan-600" },
    { icon: Target, title: "Instant Results", desc: "Feel the difference immediately. Track your mood before and after each session.", color: "from-indigo-500 to-purple-600" },
    { icon: Sparkles, title: "Multiple Options", desc: "Multiple variations of each reset type ensure you stay engaged and find what works best for you.", color: "from-pink-500 to-rose-600" },
    { icon: TrendingUp, title: "Track Progress", desc: "Build wellness habits and see your consistency improve over time with detailed insights.", color: "from-green-500 to-teal-600" },
    { icon: Shield, title: "Always Available", desc: "No internet needed once loaded. Your wellness toolkit works anywhere, anytime.", color: "from-amber-500 to-orange-600" }
  ];

  const sessionTypes = [
    { icon: Moon, name: "Sleep Prep", desc: "Wind down for better rest", color: "bg-indigo-100 text-indigo-700" },
    { icon: Zap, name: "Energy Boost", desc: "Quick vitality recharge", color: "bg-yellow-100 text-yellow-700" },
    { icon: Brain, name: "Focus Reset", desc: "Clear mental fog instantly", color: "bg-purple-100 text-purple-700" },
    { icon: Heart, name: "Stress Relief", desc: "Calm your nervous system", color: "bg-teal-100 text-teal-700" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-teal-100 overflow-hidden relative">




      {/* Header */}
      <header className="relative px-4 sm:px-6 py-6 sm:py-8 mb-8">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src={logoUrl} 
              alt="GetResett Logo" 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-lg object-cover"
            />
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              GetReset
            </span>
          </div>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all text-sm sm:text-base font-semibold"
            data-testid="button-get-started"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Authentication Error Alert */}
          {authError && (
            <div className="mb-6">
              <Alert className="border-red-200 bg-red-50/80 backdrop-blur-sm text-red-800 rounded-3xl">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{authError}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAuthError(null)}
                    className="h-auto p-1 text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Science-backed resets for your busy mind
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
              Quick, effective wellness sessions designed for hectic schedules and busy professionals.
              <br />
              Feel better in under 2 minutes.
            </p>

            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold rounded-full"
              data-testid="button-hero-cta"
            >
              Try GetResett Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <p className="text-sm text-gray-500 mt-4">
              30-day free trial • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Why GetResett works
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Built for people who need wellness that fits their lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-purple-100/50"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${feature.color} 
                               flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-xl border border-purple-100/50 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Ready to reset?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands finding calm in less than 2 minutes. Start your free trial today.
            </p>
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold rounded-full"
              data-testid="button-cta-bottom"
            >
              Try GetResett Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-8 sm:py-12 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src={logoUrl} 
              alt="GetResett Logo" 
              className="w-10 h-10 rounded-2xl shadow-lg object-cover"
            />
            <span className="text-xl font-bold text-gray-900">GetReset</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Transform your wellness, one reset at a time
          </p>
          <div className="text-gray-500 text-xs">
            © 2024 GetResett. Built for busy professionals.
          </div>
        </div>
      </footer>
    </div>
  );
}