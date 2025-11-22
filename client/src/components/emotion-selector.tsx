import { EMOTIONAL_STATES, type EmotionalState } from '@shared/resetData';
import { motion } from 'framer-motion';
import { Heart, Zap, CloudRain, Battery, Sparkles, LogOut, User, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

interface EmotionSelectorProps {
  onSelect: (emotion: EmotionalState) => void;
  isAuthenticated?: boolean;
  hasPremiumAccess?: boolean;
  userName?: string;
}

const emotionIcons: Record<EmotionalState, typeof CloudRain> = {
  stressed: CloudRain,
  anxiety: Heart,
  restless: Zap,
  tired: Battery,
  scattered: Sparkles,
};

export default function EmotionSelector({ onSelect, isAuthenticated = false, hasPremiumAccess = false, userName = '' }: EmotionSelectorProps) {
  const [, setLocation] = useLocation();

  const handleSignOut = () => {
    window.location.href = '/api/logout';
  };

  const handleAccount = () => {
    setLocation('/account');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with premium badge and user controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          {/* Premium Badge */}
          {isAuthenticated && hasPremiumAccess && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 via-pink-400 to-teal-400 text-white px-4 py-2 rounded-full shadow-lg"
              data-testid="badge-premium"
            >
              <Crown className="w-4 h-4" />
              <span className="text-xs sm:text-sm font-bold">GetReset+ Premium</span>
            </motion.div>
          )}

          {/* Account and Sign Out buttons */}
          {isAuthenticated && (
            <div className="flex gap-2 w-full sm:w-auto justify-end ml-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAccount}
                className="bg-white/80 backdrop-blur-sm hover:bg-white text-xs sm:text-sm"
                data-testid="button-account"
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Account
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="bg-white/80 backdrop-blur-sm hover:bg-white text-xs sm:text-sm"
                data-testid="button-signout"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            How are you feeling?
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Choose what you're experiencing right now, and we'll guide you through a science-backed reset
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {(Object.entries(EMOTIONAL_STATES) as [EmotionalState, typeof EMOTIONAL_STATES[EmotionalState]][]).map(
            ([emotion, info], index) => {
              const Icon = emotionIcons[emotion];
              
              return (
                <motion.button
                  key={emotion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onSelect(emotion)}
                  data-testid={`emotion-card-${emotion}`}
                  className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 
                           shadow-lg hover:shadow-2xl transition-all duration-300 
                           hover:scale-105 active:scale-95 border border-purple-100/50
                           text-left overflow-hidden"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${info.color} opacity-0 
                                 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${info.color} 
                                   flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl
                                   transition-all duration-300 group-hover:scale-110`}>
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {info.label}
                    </h3>
                    
                    <p className="text-sm sm:text-base text-gray-600">
                      {info.description}
                    </p>
                  </div>

                  {/* Decorative element */}
                  <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-gradient-to-br ${info.color} 
                                 opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                </motion.button>
              );
            }
          )}
        </div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-gray-500 mt-8 sm:mt-12"
        >
          All resets are under 2 minutes • Science-backed techniques • Instant relief
        </motion.p>
      </div>
    </div>
  );
}
