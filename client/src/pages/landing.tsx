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
              <h1 className="text-xl font-semibold text-gray-900">Reset</h1>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center relative">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-1/4 w-32 h-32 bg-emerald/10 rounded-full blur-2xl"></div>
            <div className="absolute top-40 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Day
            <span className="block">
              <span className="text-purple-600 font-black text-5xl md:text-7xl">One Minute</span> at a Time
            </span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover how <span className="font-semibold text-gray-900">60 seconds can change everything</span>. Science-backed wellness sessions that fit into your busiest days. 
            <span className="text-purple-600 font-bold">Join 10,000+ people who reset daily.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-10 py-4 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 font-semibold"
            >
              Start Your Reset Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white text-lg px-10 py-4 font-semibold hover:shadow-lg transition-all"
            >
              See How It Works
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-24">
          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-white to-purple-50/30">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Moon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sleep Insights</h3>
              <p className="text-gray-700 leading-relaxed">Track your sleep quality and receive personalized recommendations for better rest.</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-white to-blue-50/30">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Wind className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Stress Relief</h3>
              <p className="text-gray-700 leading-relaxed">Guided breathing exercises designed to calm your mind and reduce daily stress.</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-white to-emerald-50/30">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald to-sage rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Target className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Targeted Stretches</h3>
              <p className="text-gray-700 leading-relaxed">Quick stretches for specific body areas to release tension and improve mobility.</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-white to-orange-50/30">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Dumbbell className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Energy Boost</h3>
              <p className="text-gray-700 leading-relaxed">Energizing exercises to boost circulation and improve your mood instantly.</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-white to-teal-50/30">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal to-teal/80 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Clock className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">60-Second Sessions</h3>
              <p className="text-gray-700 leading-relaxed">Perfect for busy schedules - every session is designed to fit in just one minute.</p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-lg hover:shadow-xl transition-all hover:scale-105 bg-gradient-to-br from-white to-yellow-50/30">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <TrendingUp className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Progress Tracking</h3>
              <p className="text-gray-700 leading-relaxed">Monitor your wellness journey with detailed insights and progress analytics.</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border border-gray-200 rounded-3xl p-12 text-center mt-24 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald/5 via-purple-500/5 to-emerald/5"></div>
          <div className="relative">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Your Better Day Starts Now</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">Join <span className="text-purple-600 font-bold">10,000+ people</span> who've made wellness effortless with Reset.</p>
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xl px-12 py-5 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 font-bold rounded-2xl"
            >
              Create Free Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
