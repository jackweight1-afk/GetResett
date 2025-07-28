import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Clock, Target, TrendingUp, Moon, Wind, Dumbbell } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">GetResett</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          {/* Modern gradient background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-200/20 via-emerald-100/30 to-blue-200/20 rounded-full blur-3xl"></div>
            <div className="absolute top-40 left-1/4 w-64 h-64 bg-emerald-400/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute top-60 right-1/4 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Reset your day.
            <span className="block mt-2">
              <span className="text-emerald-600 font-black">One minute</span> at a time.
            </span>
          </h1>
          <p className="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto font-light">
            Science-backed sixty second wellness sessions that fit into your busiest days
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 font-medium border-0"
            >
              Start Your First Reset
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 text-xl px-12 py-6 rounded-2xl font-medium hover:shadow-xl transition-all duration-300 hover:border-purple-400"
            >
              See How It Works
            </Button>
          </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why GetResett Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Quick, science-backed sessions designed for real life</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Just 60 Seconds</h3>
                <p className="text-gray-600 leading-relaxed text-lg">Perfect for busy schedules. Reset between meetings, during breaks, or whenever you need a moment.</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Science-Backed</h3>
                <p className="text-gray-600 leading-relaxed text-lg">Every session is rooted in proven wellness research. Real techniques that actually work.</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-10 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Instant Impact</h3>
                <p className="text-gray-600 leading-relaxed text-lg">Feel the difference immediately. Reduced stress, better focus, improved energy - in just one minute.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="bg-gradient-to-br from-purple-50 to-emerald-50 rounded-3xl p-16 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-emerald-500/5 to-purple-500/5"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Your Better Day Starts Now</h2>
              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">Join thousands who've made wellness effortless with GetResett</p>
              <Button 
                size="lg"
                onClick={() => window.location.href = '/api/login'}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-xl px-16 py-6 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 font-medium border-0"
              >
                Start Your First Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center border-t border-gray-100">
          <p className="text-gray-500 text-sm">
            © 2025 GetResett. Science-backed wellness for everyone.
          </p>
        </footer>
      </div>
    </div>
  );
}
