import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Clock, Target, TrendingUp, Moon, Wind, Dumbbell } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-mint-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald to-mint rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Reset</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-emerald hover:bg-emerald/90 text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Day
            <span className="text-emerald block">One Minute at a Time</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover how 60 seconds can change everything. Science-backed wellness sessions that fit into your busiest days. 
            <span className="text-emerald font-semibold">Join 10,000+ people who reset daily.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-emerald hover:bg-emerald/90 text-white text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all"
            >
              Start Your Reset Journey
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-emerald text-emerald hover:bg-emerald hover:text-white text-lg px-8 py-3"
            >
              See How It Works
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Moon className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sleep Insights</h3>
              <p className="text-gray-600">Track your sleep quality and receive personalized recommendations for better rest.</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Wind className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stress Relief</h3>
              <p className="text-gray-600">Guided breathing exercises designed to calm your mind and reduce daily stress.</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-sage/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-sage" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Targeted Stretches</h3>
              <p className="text-gray-600">Quick stretches for specific body areas to release tension and improve mobility.</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Energy Boost</h3>
              <p className="text-gray-600">Energizing exercises to boost circulation and improve your mood instantly.</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-teal/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-teal" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">60-Second Sessions</h3>
              <p className="text-gray-600">Perfect for busy schedules - every session is designed to fit in just one minute.</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-600">Monitor your wellness journey with detailed insights and progress analytics.</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald via-teal to-mint rounded-2xl p-8 text-white text-center mt-20 shadow-2xl">
          <h2 className="text-3xl font-semibold mb-4">Your Better Day Starts Now</h2>
          <p className="text-emerald-100 mb-6 text-lg">Join 10,000+ people who've made wellness effortless with Reset.</p>
          <Button 
            size="lg"
            onClick={() => window.location.href = '/api/login'}
            className="bg-white text-teal hover:bg-gray-100 text-lg px-8 py-3"
          >
            Create Free Account
          </Button>
        </div>
      </div>
    </div>
  );
}
