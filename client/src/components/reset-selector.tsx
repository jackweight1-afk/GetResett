import { getResetsByEmotion, EMOTIONAL_STATES, type Reset, type EmotionalState } from '@shared/resetData';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResetSelectorProps {
  emotion: EmotionalState;
  onSelect: (reset: Reset) => void;
  onBack: () => void;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} sec`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) return `${minutes} min`;
  return `${minutes} min`;
}

export default function ResetSelector({ emotion, onSelect, onBack }: ResetSelectorProps) {
  const resets = getResetsByEmotion(emotion);
  const emotionInfo = EMOTIONAL_STATES[emotion];
  
  // Extract color classes for dynamic use
  const gradientColor = emotionInfo.color;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-4 text-gray-700 hover:text-gray-900"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              {emotionInfo.label} Resets
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Choose a science-backed reset to help you feel better
            </p>
          </motion.div>
        </div>

        {/* Reset Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {resets.map((reset, index) => (
            <motion.button
              key={reset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(reset)}
              data-testid={`reset-${reset.id}`}
              className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-5 sm:p-6
                       shadow-md hover:shadow-xl transition-all duration-300 
                       hover:scale-[1.02] active:scale-[0.98] border border-purple-100/50
                       text-left overflow-hidden"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${emotionInfo.color}`} />
              
              {/* Duration badge */}
              <div className="absolute top-4 right-4">
                <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full 
                               bg-gradient-to-r ${emotionInfo.color} text-white text-xs sm:text-sm font-medium shadow-md`}>
                  <Clock className="w-3 h-3" />
                  {formatDuration(reset.duration)}
                </div>
              </div>

              {/* Content */}
              <div className="pr-20">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                  {reset.title}
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">
                  {reset.description}
                </p>

                {/* Science benefit */}
                <div className="flex items-start gap-2 mt-3 pt-3 border-t border-gray-200">
                  <Info className={`w-4 h-4 mt-0.5 flex-shrink-0 bg-gradient-to-r ${emotionInfo.color} bg-clip-text text-transparent`} 
                       style={{WebkitTextFillColor: 'transparent'}} />
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">
                    {reset.scienceBenefit}
                  </p>
                </div>
              </div>

              {/* Hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${emotionInfo.color} opacity-0 
                             group-hover:opacity-5 transition-opacity duration-300 rounded-2xl pointer-events-none`} />
            </motion.button>
          ))}
        </div>

        {/* Bottom message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            Each reset uses scientifically-proven techniques • Take as many as you need
          </p>
        </motion.div>
      </div>
    </div>
  );
}
