import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Reset, type InteractiveStep, EMOTIONAL_STATES, type EmotionalState } from '@shared/resetData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Hand, Wind, Activity, Hash, Scan, Check, Sparkles, Grid3x3, Zap, BarChart3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface InteractiveResetPlayerProps {
  reset: Reset;
  emotion: EmotionalState;
  onComplete: () => void;
  onExit: () => void;
}

const iconMap = {
  grounding: Eye,
  tapping: Hand,
  breathing: Wind,
  visualization: Activity,
  counting: Hash,
  'body-scan': Scan,
  'stress-sweep': Sparkles,
  'bubble-tap': Sparkles,
  'rhythm-tap': Hand,
  'grid-tap': Grid3x3,
  'dot-connect': Zap,
  'swipe-sort': Activity,
  'pressure-valve': BarChart3,
  'blink-track': Eye
};

export default function InteractiveResetPlayer({ reset, emotion, onComplete, onExit }: InteractiveResetPlayerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [dismissedItems, setDismissedItems] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);

  const steps = reset.interactiveSteps || [];
  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const Icon = reset.interactiveType ? iconMap[reset.interactiveType] : Activity;
  const emotionInfo = EMOTIONAL_STATES[emotion];

  // Auto-advance timer for steps with duration
  useEffect(() => {
    if (!currentStep?.duration || currentStep.input === 'text') return;
    
    // Don't auto-advance for stress-sweep tap step - wait for user to dismiss all items
    if (reset.interactiveType === 'stress-sweep' && currentStep.input === 'tap') {
      setIsAutoAdvancing(false);
      return;
    }
    
    setTimeLeft(currentStep.duration);
    setIsAutoAdvancing(true);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setInputValue('');
      setDismissedItems([]);
      // Only reset completedItems for non-stress-sweep resets
      if (reset.interactiveType !== 'stress-sweep') {
        setCompletedItems([]);
      }
      setIsAutoAdvancing(false);
    } else {
      onComplete();
    }
  };

  const handleDismissStressor = (index: number) => {
    setDismissedItems(prev => [...prev, index]);
    
    // Auto-advance when all stressors are dismissed
    if (dismissedItems.length + 1 >= completedItems.length) {
      setTimeout(handleNext, 800);
    }
  };

  const handleAddItem = () => {
    if (inputValue.trim()) {
      const newItems = [...completedItems, inputValue.trim()];
      setCompletedItems(newItems);
      setInputValue('');
      
      // Auto-advance if we've reached the count
      if (currentStep.count && newItems.length >= currentStep.count) {
        setTimeout(handleNext, 800);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleAddItem();
    }
  };

  const renderStepContent = () => {
    if (!currentStep) return null;

    // Text input exercises (grounding, stress-sweep, etc.)
    if (currentStep.input === 'text' && currentStep.count) {
      return (
        <div className="space-y-6">
          <div className="bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-sm text-gray-600 mb-2">
              {completedItems.length} of {currentStep.count} complete
            </p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${emotionInfo.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${(completedItems.length / currentStep.count) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Completed items */}
          {completedItems.length > 0 && (
            <div className="space-y-2">
              {completedItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 bg-green-50 rounded-xl p-3"
                >
                  <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </motion.div>
              ))}
            </div>
          )}

          {/* Input */}
          {completedItems.length < (currentStep.count || 0) && (
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={reset.interactiveType === 'stress-sweep' ? 'e.g., work, money, deadline...' : 'Type your response...'}
                className="flex-1 rounded-xl border-gray-300 focus:ring-2 focus:ring-offset-0"
                style={{
                  '--tw-ring-color': `var(--gradient-${emotion})`,
                } as React.CSSProperties}
                data-testid="input-grounding-item"
                autoFocus
              />
              <Button
                onClick={handleAddItem}
                disabled={!inputValue.trim()}
                className={`rounded-xl bg-gradient-to-r ${emotionInfo.color} text-white px-6 shadow-md hover:shadow-lg transition-shadow`}
                data-testid="button-add-item"
              >
                Add
              </Button>
            </div>
          )}
        </div>
      );
    }

    // Stress Sweep: Display collected items for swiping away
    if (reset.interactiveType === 'stress-sweep' && currentStep.input === 'tap' && completedItems.length > 0) {
      const remainingCount = completedItems.length - dismissedItems.length;
      
      return (
        <div className="space-y-4 py-8">
          <p className="text-center text-sm text-gray-600 mb-6">
            Tap each word to release it
          </p>
          <div className="grid grid-cols-2 gap-3">
            {completedItems.map((stressor, idx) => {
              const isDismissed = dismissedItems.includes(idx);
              if (isDismissed) return null;
              
              return (
                <motion.button
                  key={idx}
                  onClick={() => handleDismissStressor(idx)}
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5, x: 100 }}
                  whileTap={{ scale: 0.95 }}
                  className={`bg-gradient-to-br ${emotionInfo.color} text-white rounded-2xl p-4 shadow-lg 
                             hover:shadow-xl transition-all cursor-pointer active:scale-90`}
                  data-testid={`stressor-${idx}`}
                >
                  <span className="font-medium text-sm sm:text-base">{stressor}</span>
                </motion.button>
              );
            })}
          </div>
          <p className="text-center text-xs text-gray-500 mt-4">
            {remainingCount} {remainingCount === 1 ? 'stressor' : 'stressors'} remaining
          </p>
        </div>
      );
    }

    // Breathing visualization
    if (currentStep.input === 'breath') {
      const isInhale = currentStep.instruction.toLowerCase().includes('in');
      
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br ${emotionInfo.color} shadow-2xl`}
            animate={{
              scale: isInhale ? [1, 1.5, 1] : [1.5, 1, 1.5],
            }}
            transition={{
              duration: currentStep.duration || 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <p className="mt-8 text-lg text-gray-600 font-medium">
            {isInhale ? 'Breathe in...' : 'Breathe out...'}
          </p>
        </div>
      );
    }

    // Blink-track: Circle moves around the screen
    if (reset.interactiveType === 'blink-track' && currentStep.input === 'tap') {
      return (
        <div className="relative h-96 flex items-center justify-center">
          <motion.div
            animate={{
              x: [0, 150, 150, -150, -150, 0, 0],
              y: [0, 0, 120, 120, -120, -120, 0],
            }}
            transition={{
              duration: currentStep.duration || 15,
              ease: "easeInOut",
              times: [0, 0.15, 0.3, 0.5, 0.65, 0.85, 1]
            }}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${emotionInfo.color} shadow-2xl flex items-center justify-center`}
            data-testid="blink-track-circle"
          >
            <Eye className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </motion.div>
          <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-500 font-medium">
            Follow the circle with your eyes
          </p>
        </div>
      );
    }

    // Tapping/Interactive exercises (covers rhythm-tap, bubble-tap, grid-tap, etc.)
    if (currentStep.input === 'tap') {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br ${emotionInfo.color} 
                     shadow-2xl flex items-center justify-center cursor-pointer active:scale-95 
                     hover:shadow-3xl transition-shadow`}
            data-testid="interactive-tap-circle"
          >
            <Icon className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
          </motion.div>
          <p className="mt-6 text-sm text-gray-500 font-medium">
            {reset.interactiveType === 'rhythm-tap' && 'Tap to the rhythm'}
            {reset.interactiveType === 'bubble-tap' && 'Tap to pop bubbles'}
            {reset.interactiveType === 'grid-tap' && 'Tap the lit circles'}
            {reset.interactiveType === 'dot-connect' && 'Tap to connect dots'}
            {!['rhythm-tap', 'bubble-tap', 'grid-tap', 'dot-connect'].includes(reset.interactiveType || '') && 'Follow the rhythm'}
          </p>
        </div>
      );
    }

    // Pressure valve visualization
    if (reset.interactiveType === 'pressure-valve') {
      const pressureLevel = Math.max(0, 100 - (currentStepIndex * 25));
      
      return (
        <div className="space-y-6 py-8">
          <div className="bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-sm text-gray-600 mb-3 text-center font-medium">Pressure Level</p>
            <div className="h-8 bg-gray-200 rounded-full overflow-hidden relative">
              <motion.div
                className={`h-full bg-gradient-to-r ${emotionInfo.color}`}
                initial={{ width: '100%' }}
                animate={{ width: `${pressureLevel}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-gray-700">{pressureLevel}%</span>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 italic">
            Release with each movement...
          </p>
        </div>
      );
    }

    // Default: just show the instruction (no specific interaction)
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={onComplete}
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
              data-testid="button-finish-early"
            >
              Finish Early
            </Button>
            {timeLeft > 0 && (
              <div className={`flex items-center gap-2 text-sm bg-gradient-to-r ${emotionInfo.color} bg-clip-text text-transparent font-bold`}>
                <span className="font-mono font-semibold">{timeLeft}s</span>
              </div>
            )}
          </div>

          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div 
              className={`h-full bg-gradient-to-r ${emotionInfo.color} transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-gray-200"
          >
            {/* Icon */}
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${emotionInfo.color} 
                           flex items-center justify-center mb-6 mx-auto shadow-lg`}>
              <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>

            {/* Title (if step has one) */}
            {currentStep?.title && (
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-4">
                {currentStep.title}
              </h2>
            )}

            {/* Instruction */}
            <p className="text-base sm:text-lg text-gray-700 text-center mb-8 leading-relaxed px-2">
              {currentStep?.instruction}
            </p>

            {/* Step-specific content */}
            {renderStepContent()}

            {/* Manual Continue button for non-auto-advancing steps */}
            {(!isAutoAdvancing || !currentStep?.duration) && currentStep?.input !== 'text' && (
              <Button
                onClick={handleNext}
                className={`w-full mt-6 rounded-xl bg-gradient-to-r ${emotionInfo.color} text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow`}
                data-testid="button-continue"
              >
                {currentStepIndex < steps.length - 1 ? 'Continue' : 'Complete Reset'}
              </Button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Step counter and skip button */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Step {currentStepIndex + 1} of {steps.length}
          </p>
          
          {/* Always show a discreet skip button */}
          <Button
            onClick={handleNext}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600 text-xs"
            data-testid="button-skip-step"
          >
            Skip to next →
          </Button>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Relax and listen • Breathe deeply • Let the reset guide you
        </p>
      </div>
    </div>
  );
}
