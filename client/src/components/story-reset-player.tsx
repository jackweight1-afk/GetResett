import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Reset, type StoryStep, EMOTIONAL_STATES, type EmotionalState } from '@shared/resetData';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles } from 'lucide-react';

interface StoryResetPlayerProps {
  reset: Reset;
  emotion: EmotionalState;
  onComplete: () => void;
  onExit: () => void;
}

export default function StoryResetPlayer({ reset, emotion, onComplete, onExit }: StoryResetPlayerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = reset.storyContent || [];
  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const emotionInfo = EMOTIONAL_STATES[emotion];

  const handleContinue = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 p-4 sm:p-6 flex items-center">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={onComplete}
              variant="ghost"
              className="text-gray-600"
              data-testid="button-finish-early"
            >
              Finish Early
            </Button>
          </div>

          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${emotionInfo.color} transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Story Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            {/* Main story card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl border border-gray-200 min-h-[400px] flex flex-col justify-center">
              {/* Decorative gradient orb */}
              <motion.div
                className={`absolute top-8 right-8 w-32 h-32 rounded-full bg-gradient-to-br ${emotionInfo.color} opacity-10 blur-3xl`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${emotionInfo.color} 
                           flex items-center justify-center mb-8 mx-auto shadow-lg`}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>

              {/* Step title (if present) */}
              {currentStep?.title && (
                <motion.h3
                  key={`title-${currentStepIndex}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl sm:text-3xl font-semibold text-gray-900 text-center mb-6"
                >
                  {currentStep.title}
                </motion.h3>
              )}

              {/* Story text */}
              <motion.p
                key={`text-${currentStepIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-base sm:text-lg md:text-xl text-gray-700 text-center leading-relaxed font-normal max-w-2xl mx-auto px-4"
              >
                {currentStep?.text}
              </motion.p>

              {/* Breathing cue */}
              <motion.div
                className="mt-12 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${emotionInfo.color}`}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </div>

            {/* Continue button */}
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleContinue}
                size="lg"
                className={`bg-gradient-to-r ${emotionInfo.color} text-white hover:opacity-90 shadow-lg px-12 py-6 text-lg font-semibold rounded-2xl`}
                data-testid="button-continue"
              >
                {currentStepIndex < steps.length - 1 ? 'Continue' : 'Complete Reset'}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? `w-8 bg-gradient-to-r ${emotionInfo.color}`
                  : idx < currentStepIndex
                  ? `w-2 bg-gradient-to-r ${emotionInfo.color} opacity-50`
                  : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Bottom hint */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Relax and listen • Breathe deeply • Let the story guide you
        </p>
      </div>
    </div>
  );
}
