import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Brain, Zap, Shield, Users, Building2, Timer } from "lucide-react";
import { useState, useEffect } from "react";
import logoUrl from "@assets/getreset_logo.jpg";
import moodSelectionImg from '@assets/screenshots/mood-selection-real.png';
import resetPlayerImg from '@assets/screenshots/reset-player-real.png';
import moodRatingImg from '@assets/screenshots/mood-rating-real.png';

export default function Landing() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-teal-50">
      {/* Header */}
      <header className="px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            data-testid="button-home"
          >
            <img 
              src={logoUrl} 
              alt="GetReset Logo" 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-lg object-cover"
            />
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              GetReset
            </span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`px-4 sm:px-6 py-12 sm:py-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Because Sometimes,
            <br />
            <span className="block">You Just Need A Minute</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
            Science-backed micro wellbeing resets to help you find calm in a busy day
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/download'}
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 via-purple-500 to-teal-500 hover:from-pink-600 hover:via-purple-600 hover:to-teal-600 text-white text-base sm:text-lg px-10 py-6 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold rounded-full"
              data-testid="button-download"
            >
              Download GetReset
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/business'}
              className="w-full sm:w-auto border-2 border-teal-500 text-teal-700 hover:bg-teal-50 text-base sm:text-lg px-10 py-6 shadow-md hover:shadow-lg transition-all duration-300 font-semibold rounded-full"
              data-testid="button-business-cta"
            >
              <Building2 className="w-5 h-5 mr-2" />
              GetReset for Business
            </Button>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Built for the pace of modern life
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We understand busy schedules. That's why every reset is designed to deliver maximum impact in minimal time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: Timer, 
                title: "60-90 Seconds", 
                desc: "Quick enough to fit between meetings, calls, or tasks",
                color: "from-purple-600 to-violet-600"
              },
              { 
                icon: Brain, 
                title: "Science-Backed", 
                desc: "Evidence-based techniques proven to reduce stress and improve focus",
                color: "from-blue-600 to-cyan-600"
              },
              { 
                icon: Zap, 
                title: "Instant Results", 
                desc: "Feel calmer, clearer, and more present right away",
                color: "from-teal-600 to-emerald-600"
              },
              { 
                icon: Heart, 
                title: "For Everyone", 
                desc: "No prior experience needed. Just press play and follow along",
                color: "from-pink-600 to-rose-600"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 bg-white/30 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Reset in 3 simple steps
            </h2>
          </div>

          <div className="space-y-10 sm:space-y-12">
            {/* Step 1 - Pick your mood */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-teal-500 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">1</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Pick your mood</h3>
                </div>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Stressed? Tired? Scattered? Choose how you're feeling right now and we'll guide you to the perfect reset.
                </p>
              </div>
              <div className="flex justify-center">
                <img 
                  src={moodSelectionImg} 
                  alt="Mood selection interface" 
                  className="w-full max-w-[320px] sm:max-w-md rounded-2xl shadow-2xl"
                  data-testid="img-step-1"
                />
              </div>
            </div>

            {/* Step 2 - Follow the guided reset */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-teal-500 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">2</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Follow the guided reset</h3>
                </div>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Simple breathing, visualization, or movement exercises—all under 2 minutes. Just follow along at your own pace.
                </p>
              </div>
              <div className="flex justify-center">
                <img 
                  src={resetPlayerImg} 
                  alt="Guided reset session in progress" 
                  className="w-full max-w-[320px] sm:max-w-md rounded-2xl shadow-2xl"
                  data-testid="img-step-2"
                />
              </div>
            </div>

            {/* Step 3 - Feel the difference */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-teal-500 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">3</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Feel the difference</h3>
                </div>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Rate your mood after each reset and track your progress over time. Notice the shift from stressed to centered.
                </p>
              </div>
              <div className="flex justify-center">
                <img 
                  src={moodRatingImg} 
                  alt="Reset completion and mood rating" 
                  className="w-full max-w-[320px] sm:max-w-md rounded-2xl shadow-2xl"
                  data-testid="img-step-3"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business CTA Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 bg-gradient-to-br from-pink-500 via-purple-500 to-teal-500">
        <div className="max-w-4xl mx-auto text-center">
          <Users className="w-16 h-16 mx-auto mb-6 opacity-90 text-white" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Bring GetReset to your workplace
          </h2>
          <p className="text-lg sm:text-xl mb-8 opacity-90 max-w-2xl mx-auto text-white">
            Support your team's wellbeing with unlimited resets, usage analytics, and quarterly wellbeing training sessions.
          </p>
          <button
            onClick={() => window.location.href = '/business'}
            className="inline-flex items-center justify-center bg-white text-teal-700 hover:bg-gray-50 hover:text-teal-800 text-base sm:text-lg px-10 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold rounded-full"
            data-testid="button-business-cta"
          >
            Explore GetReset for Business
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-8 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img 
              src={logoUrl} 
              alt="GetReset Logo" 
              className="w-10 h-10 rounded-xl"
            />
            <span className="text-xl font-bold">GetReset</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 GetReset. Science-backed wellbeing resets for busy minds.
          </p>
        </div>
      </footer>
    </div>
  );
}
