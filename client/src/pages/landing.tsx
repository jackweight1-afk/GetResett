import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Zap, Moon, Brain, Star, ArrowRight, Play, Users, Award, Shield, Sparkles, Timer, Clock, Target, TrendingUp, CheckCircle, Leaf } from "lucide-react";
import { useState, useEffect } from "react";

export default function Landing() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 4000);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const testimonials = [
    { name: "Sarah M.", role: "Marketing Manager", text: "60 seconds completely changed my workday stress levels. I'm actually productive again!", rating: 5 },
    { name: "David L.", role: "Software Engineer", text: "Perfect for my ADHD brain. Quick resets that actually work between meetings.", rating: 5 },
    { name: "Emma K.", role: "Teacher", text: "My students love doing the breathing exercises with me. We're all calmer now.", rating: 5 }
  ];

  const features = [
    { icon: Timer, title: "Just 60 Seconds", desc: "Perfect for ADHD minds and busy lives. Reset between meetings, during breaks, or whenever you need focus.", color: "from-purple-500 to-purple-600" },
    { icon: Brain, title: "Science-Backed", desc: "Evidence-based techniques from mindfulness research, designed for maximum impact in minimal time.", color: "from-teal-500 to-teal-600" },
    { icon: Target, title: "Instant Results", desc: "Feel the difference immediately. Track your mood before and after each session.", color: "from-indigo-500 to-indigo-600" },
    { icon: Sparkles, title: "Never Boring", desc: "3 variations of each session type ensure you stay engaged and motivated daily.", color: "from-pink-500 to-pink-600" },
    { icon: TrendingUp, title: "Track Progress", desc: "Build wellness streaks and see your consistency improve over time with detailed insights.", color: "from-emerald-500 to-emerald-600" },
    { icon: Shield, title: "Always Available", desc: "No internet needed once loaded. Your wellness toolkit works anywhere, anytime.", color: "from-amber-500 to-amber-600" }
  ];

  const sessionTypes = [
    { icon: Moon, name: "Sleep Prep", desc: "Wind down for better rest", color: "bg-indigo-100 text-indigo-700" },
    { icon: Zap, name: "Energy Boost", desc: "Quick vitality recharge", color: "bg-yellow-100 text-yellow-700" },
    { icon: Brain, name: "Focus Reset", desc: "Clear mental fog instantly", color: "bg-purple-100 text-purple-700" },
    { icon: Heart, name: "Stress Relief", desc: "Calm your nervous system", color: "bg-teal-100 text-teal-700" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 overflow-hidden relative">
      {/* Animated cursor follower */}
      <div 
        className="fixed w-4 h-4 bg-gradient-to-r from-purple-400 to-teal-400 rounded-full pointer-events-none z-50 opacity-30 transition-all duration-300 ease-out"
        style={{ 
          left: mousePosition.x - 8, 
          top: mousePosition.y - 8,
          transform: `scale(${isVisible ? 1 : 0})`
        }}
      />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-r from-purple-200 to-teal-200 rounded-full opacity-20 animate-pulse blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-80 h-80 bg-gradient-to-r from-teal-200 to-purple-200 rounded-full opacity-20 animate-pulse delay-1000 blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-300 rounded-full opacity-10 animate-bounce delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-teal-300 rounded-full opacity-10 animate-bounce delay-3000"></div>
      </div>

      {/* Header */}
      <header className="relative px-4 sm:px-6 py-4 sm:py-6 backdrop-blur-md bg-white/80 border-b border-purple-100/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-600 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300 hover:rotate-12">
              <Heart className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              GetResett
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-xs sm:text-sm text-gray-600 font-medium hidden md:block">30-day free trial</span>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white px-4 py-2 sm:px-8 sm:py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold text-sm sm:text-base"
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
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Floating badge */}
            <div className="inline-block mb-6 sm:mb-8 px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-100 to-teal-100 rounded-full border border-purple-200/50">
              <span className="text-xs sm:text-sm font-semibold text-purple-700 flex items-center">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Perfect for ADHD & Busy Minds
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-gray-900 mb-6 sm:mb-8 leading-tight">
              <span className="block text-3xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">Reset Your Day,</span>
              <span className="block text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl bg-gradient-to-r from-purple-600 via-teal-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
                One Minute
              </span>
              <span className="block text-3xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">at a Time</span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-light px-4">
              Science-backed 60-second wellness sessions designed for modern minds. 
              <span className="text-purple-600 font-semibold"> Instant results</span>, 
              <span className="text-teal-600 font-semibold"> lasting impact</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/api/login'}
                className="bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 text-white text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 font-bold rounded-full relative overflow-hidden"
              >
                <span className="relative z-10">Try GetResett Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-purple-600 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 font-bold hover:shadow-lg transition-all duration-300 rounded-full group"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-500 px-4">
              <div className="flex items-center space-x-6 sm:space-x-8">
                <div className="flex items-center">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  <span className="font-semibold text-sm sm:text-base">10K+ users</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-sm sm:text-base">4.9/5 rating</span>
                </div>
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="font-semibold text-sm sm:text-base">Featured App</span>
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
              Choose Your <span className="text-purple-600">Perfect Reset</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Each session is carefully crafted with 3 unique variations to keep you engaged and motivated every single day.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {sessionTypes.map((session, index) => (
              <Card key={session.name} className={`border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${session.color} cursor-pointer`}>
                <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                  <div className="mb-4 sm:mb-6">
                    <session.icon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto" />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3">{session.name}</h3>
                  <p className="text-xs sm:text-sm opacity-80">{session.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Why <span className="text-teal-600">GetResett</span> Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for people with ADHD and busy schedules who need wellness that fits their lifestyle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={feature.title} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-center">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative px-6 py-20 bg-gradient-to-r from-purple-50 to-teal-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-16">
            Real Results from <span className="text-purple-600">Real People</span>
          </h2>
          
          <div className="relative h-48 overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === currentTestimonial 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-12">
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-2xl text-gray-700 mb-6 italic font-light">
                      "{testimonial.text}"
                    </blockquote>
                    <div className="flex items-center justify-center">
                      <div>
                        <div className="font-bold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial 
                    ? 'bg-purple-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 py-20 bg-gradient-to-r from-purple-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl sm:text-6xl font-bold mb-8">
            Ready to Reset Your Life?
          </h2>
          <p className="text-xl sm:text-2xl mb-12 opacity-90 font-light">
            Join thousands who've transformed their daily wellness routine with just 60 seconds.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-white text-purple-600 hover:bg-gray-100 text-xl px-12 py-6 shadow-2xl font-bold rounded-full transform hover:scale-105 transition-all duration-300"
            >
              Try GetResett Free Now
            </Button>
            <div className="flex items-center space-x-2 text-white/80">
              <CheckCircle className="w-5 h-5" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-teal-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">GetResett</span>
          </div>
          <p className="text-gray-400 mb-6">
            Transform your wellness routine, one minute at a time.
          </p>
          <div className="text-gray-500 text-sm">
            © 2024 GetResett. Built for busy minds who deserve better wellness.
          </div>
        </div>
      </footer>
    </div>
  );
}