import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Clock, Target, TrendingUp, Moon, Wind, Dumbbell, Brain, Zap, Heart, Timer, Waves, PlayCircle, Circle } from "lucide-react";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="text-center relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-1/4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <div className="absolute top-40 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Reset your day.
            <span className="block">
              <span className="text-purple-600 font-black text-5xl md:text-7xl">One minute</span> at a time.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
            Science-backed sixty second wellness sessions that fit into your busiest days
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg px-10 py-4 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold rounded-2xl"
            >
              Start Your First Reset
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white text-lg px-10 py-4 font-semibold hover:shadow-lg transition-all rounded-2xl"
            >
              See How It Works
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-24">
          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-white to-purple-50/30">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="text-purple-600 text-3xl font-bold">60</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Just 60 Seconds</h3>
              <p className="text-gray-700 leading-relaxed">Perfect for busy schedules. Reset between meetings, during breaks, or whenever you need a moment.</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-white to-blue-50/30">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="text-white text-2xl">🔬</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Science-Backed</h3>
              <p className="text-gray-700 leading-relaxed">Every session is rooted in proven wellness research. Real techniques that actually work.</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-white to-emerald-50/30">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="text-white text-2xl">⚡</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Impact</h3>
              <p className="text-gray-700 leading-relaxed">Feel the difference immediately. Reduced stress, better focus, improved energy - in just one minute.</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-white to-orange-50/30">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="text-white text-2xl">🧘‍♀️</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Stress Relief</h3>
              <p className="text-gray-700 leading-relaxed">Guided breathing exercises designed to calm your mind and reduce daily stress.</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-white to-teal-50/30">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="text-white text-2xl">🚀</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Energy Boost</h3>
              <p className="text-gray-700 leading-relaxed">Energizing exercises to boost circulation and improve your mood instantly.</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-white to-yellow-50/30">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="text-white text-2xl">😴</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sleep Stories</h3>
              <p className="text-gray-700 leading-relaxed">Calming narratives and breathing techniques to help you unwind and rest better.</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border border-gray-200 rounded-3xl p-12 text-center mt-24 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald/5 via-purple-500/5 to-emerald/5"></div>
          <div className="relative">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Your Better Day Starts Now</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">Join thousands who've made wellness effortless with GetResett</p>
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xl px-12 py-5 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 font-bold rounded-2xl"
            >
              Start Your First Reset
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center border-t border-gray-100">
          <p className="text-gray-500 text-sm">
            © 2025 GetResett. Science-backed wellness for everyone.
          </p>
        </footer>
      </div>
    </div>
  );
}
