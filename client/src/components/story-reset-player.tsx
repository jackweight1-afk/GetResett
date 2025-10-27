import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Reset, type StoryStep } from '@shared/resetData';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles } from 'lucide-react';

interface StoryResetPlayerProps {
  reset: Reset;
  onComplete: () => void;
  onExit: () => void;
}

export default function StoryResetPlayer({ reset, onComplete, onExit }: StoryResetPlayerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const steps = reset.storyContent || [];
  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Auto-advance through story steps
  useEffect(() => {
    if (!currentStep) return;

    setTimeLeft(currentStep.duration);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
          } else {
            onComplete();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStepIndex, currentStep]);

  const handleSkipToNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-4 sm:p-6 flex items-center">
      <div className="max-w-3xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={onComplete}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              data-testid="button-finish-early"
            >
              Finish Early
            </Button>
            <div className="flex items-center gap-2 text-sm text-deep-espresso">
              <span className="font-mono font-semibold">{timeLeft}s</span>
            </div>
          </div>

          <Progress value={progress} className="h-2" data-testid="progress-bar" />
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
            <div className="bg-card rounded-3xl p-8 sm:p-12 shadow-elegant-lg border border-border/50 min-h-[400px] flex flex-col justify-center">
              {/* Decorative gradient orb */}
              <motion.div
                className={`absolute top-8 right-8 w-32 h-32 rounded-full bg-gradient-to-br ${reset.color} opacity-10 blur-3xl`}
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
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${reset.color} 
                           flex items-center justify-center mb-8 mx-auto shadow-lg`}
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>

              {/* Story text */}
              <motion.p
                key={`text-${currentStepIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl sm:text-2xl md:text-3xl text-foreground text-center leading-relaxed font-light"
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
                  className={`w-3 h-3 rounded-full bg-gradient-to-r ${reset.color}`}
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

            {/* Skip button */}
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleSkipToNext}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-skip"
              >
                Skip to next
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
                  ? 'w-8 bg-deep-espresso'
                  : idx < currentStepIndex
                  ? 'w-2 bg-muted-olive'
                  : 'w-2 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        {/* Bottom hint */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Relax and listen • Breathe deeply • Let the story guide you
        </p>
      </div>
    </div>
  );
}
