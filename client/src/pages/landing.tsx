import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Zap, Moon, Brain, Star, ArrowRight, Play, Users, Award, Shield, Sparkles, Timer, Clock, Target, TrendingUp, CheckCircle, Leaf, AlertTriangle, X } from "lucide-react";
import { useState, useEffect } from "react";

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
    { name: "David L.", role: "Software Engineer", text: "Perfect for my ADHD brain. Quick resets that actually work between meetings.", rating: 5 },
    { name: "Emma K.", role: "Teacher", text: "My students love doing the breathing exercises with me. We're all calmer now.", rating: 5 }
  ];

  const features = [
    { icon: Timer, title: "Just 60 Seconds", desc: "Perfect for ADHD minds and busy lives. Reset between meetings, during breaks, or whenever you need focus.", color: "from-slate-500 to-slate-600" },
    { icon: Brain, title: "Science-Backed", desc: "Evidence-based techniques from mindfulness research, designed for maximum impact in minimal time.", color: "from-blue-500 to-cyan-600" },
    { icon: Target, title: "Instant Results", desc: "Feel the difference immediately. Track your mood before and after each session.", color: "from-slate-500 to-slate-600" },
    { icon: Sparkles, title: "Never Boring", desc: "3 variations of each session type ensure you stay engaged and motivated daily.", color: "from-pink-500 to-rose-600" },
    { icon: TrendingUp, title: "Track Progress", desc: "Build wellness streaks and see your consistency improve over time with detailed insights.", color: "from-green-500 to-teal-600" },
    { icon: Shield, title: "Always Available", desc: "No internet needed once loaded. Your wellness toolkit works anywhere, anytime.", color: "from-amber-500 to-orange-600" }
  ];

  const sessionTypes = [
    { icon: Moon, name: "Sleep Prep", desc: "Wind down for better rest", color: "bg-slate-100 text-slate-700" },
    { icon: Zap, name: "Energy Boost", desc: "Quick vitality recharge", color: "bg-yellow-100 text-yellow-700" },
    { icon: Brain, name: "Focus Reset", desc: "Clear mental fog instantly", color: "bg-slate-100 text-slate-700" },
    { icon: Heart, name: "Stress Relief", desc: "Calm your nervous system", color: "bg-teal-100 text-teal-700" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 overflow-hidden relative">




      {/* Header */}
      <header className="relative px-4 sm:px-6 py-4 sm:py-6 backdrop-blur-md bg-white/80 border-b border-slate-100/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-slate-600 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-700" style={{ color: '#475569' }}>
              GetResett
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-xs sm:text-sm text-gray-600 font-medium hidden md:block">30-day free trial</span>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-slate-600 to-teal-600 hover:from-slate-700 hover:to-teal-700 text-white px-4 py-2 sm:px-8 sm:py-3 rounded-full shadow-lg font-semibold text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Try Free</span>
              <span className="sm:hidden">Try Free</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto text-center">
          {/* Authentication Error Alert */}
          {authError && (
            <div className="mb-8 mx-auto max-w-2xl">
              <Alert className="border-red-200 bg-red-50 text-red-800">
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
          
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Floating badge */}
            <div className="inline-block mb-6 sm:mb-8 px-4 sm:px-6 py-2 bg-gradient-to-r from-slate-100 to-teal-100 rounded-full border border-slate-200/50">
              <span className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Perfect for ADHD & Busy Minds
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-7xl xl:text-8xl font-black text-gray-900 mb-6 sm:mb-8 leading-[0.9] tracking-tight">
              <span className="block text-4xl sm:text-7xl md:text-8xl lg:text-7xl xl:text-8xl">Reset Your Day,</span>
              <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-slate-600 via-teal-500 to-slate-600 bg-clip-text text-transparent animate-pulse">
                One Minute
              </span>
              <span className="block text-4xl sm:text-7xl md:text-8xl lg:text-7xl xl:text-8xl">at a Time</span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-light px-4">
              Science-backed guided resets and interactive games designed for modern minds. 
              <span className="text-slate-600 font-semibold"> Instant results</span>, 
              <span className="text-teal-600 font-semibold"> lasting impact</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/api/login'}
                className="bg-gradient-to-r from-slate-600 to-teal-600 hover:from-slate-700 hover:to-teal-700 text-white text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 shadow-2xl hover:shadow-slate-500/25 transition-all duration-300 transform hover:scale-105 font-bold rounded-full relative overflow-hidden"
              >
                <span className="relative z-10">Try GetResett Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-slate-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.location.href = '/api/login'}
                className="border-2 border-slate-600 text-slate-600 hover:bg-slate-600 hover:text-white text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 font-bold hover:shadow-lg transition-all duration-300 rounded-full group"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 group-hover:scale-110 transition-transform" />
                Explore Sessions
              </Button>
            </div>

            {/* Key Benefits */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-500 px-4">
              <div className="flex items-center space-x-6 sm:space-x-8">
                <div className="flex items-center">
                  <Timer className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-slate-600" />
                  <span className="font-semibold text-sm sm:text-base">60 Second Sessions</span>
                </div>
                <div className="flex items-center">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-slate-600" />
                  <span className="font-semibold text-sm sm:text-base">Science-Backed</span>
                </div>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 text-slate-600" />
                <span className="font-semibold text-sm sm:text-base">Free to Try</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Session Types Preview */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Choose Your <span className="text-slate-600">Perfect Reset</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Each session is carefully crafted with 3 unique variations to keep you engaged and motivated every single day.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {sessionTypes.map((session, index) => (
              <Card key={session.name} className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${session.color} cursor-pointer`}>
                <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                  <div className="mb-4 sm:mb-6">
                    <session.icon className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto ${
                      session.color.includes('text-slate') ? 'text-slate-700' : 
                      session.color.includes('text-yellow') ? 'text-yellow-700' : 
                      'text-teal-700'
                    }`} />
                  </div>
                  <h3 className={`text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3 ${
                    session.color.includes('text-slate') ? 'text-slate-900' : 
                    session.color.includes('text-yellow') ? 'text-yellow-900' : 
                    'text-teal-900'
                  }`}>{session.name}</h3>
                  <p className={`text-xs sm:text-sm ${
                    session.color.includes('text-slate') ? 'text-slate-800' : 
                    session.color.includes('text-yellow') ? 'text-yellow-800' : 
                    'text-teal-800'
                  }`}>{session.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-700 mb-4 sm:mb-6">
              Why <span className="text-slate-600">GetResett</span> Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
              Built specifically for people with ADHD and busy schedules who need wellness that fits their lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card key={feature.title} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-white backdrop-blur-sm hover:bg-white">
                <CardContent className="p-6 sm:p-8">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg`}>
                    <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-20 bg-gradient-to-br from-slate-50 via-white to-teal-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 sm:mb-16">
            Real Results from <span className="bg-gradient-to-r from-slate-600 to-teal-600 bg-clip-text text-transparent">Real People</span>
          </h2>
          
          <div className="relative min-h-[280px] sm:min-h-[320px] overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === currentTestimonial 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mx-4 sm:mx-0">
                  <CardContent className="p-6 sm:p-8 lg:p-12">
                    <div className="flex justify-center mb-4 sm:mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 text-yellow-400 mx-0.5" />
                      ))}
                    </div>
                    <blockquote className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-6 sm:mb-8 italic font-light leading-relaxed max-w-3xl mx-auto">
                      "{testimonial.text}"
                    </blockquote>
                    <div className="flex items-center justify-center">
                      <div>
                        <div className="font-bold text-gray-900 text-base sm:text-lg">{testimonial.name}</div>
                        <div className="text-sm sm:text-base text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-2 sm:space-x-3 mt-6 sm:mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 ${
                  index === currentTestimonial 
                    ? 'bg-gradient-to-r from-slate-600 to-teal-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-4 sm:px-6 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-slate-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-slate-400">GetResett</span>
          </div>
          <p className="text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4">
            Transform your wellness routine, one minute at a time.
          </p>
          <div className="text-gray-500 text-sm sm:text-base">
            © 2024 GetResett. Built for busy minds who deserve better wellness.
          </div>
        </div>
      </footer>
    </div>
  );
}