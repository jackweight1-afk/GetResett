import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Reset, type InteractiveStep } from '@shared/resetData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Hand, Wind, Activity, Hash, Scan, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface InteractiveResetPlayerProps {
  reset: Reset;
  onComplete: () => void;
  onExit: () => void;
}

const iconMap = {
  grounding: Eye,
  tapping: Hand,
  breathing: Wind,
  visualization: Activity,
  counting: Hash,
  'body-scan': Scan
};

export default function InteractiveResetPlayer({ reset, onComplete, onExit }: InteractiveResetPlayerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [completedItems, setCompletedItems] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isAutoAdvancing, setIsAutoAdvancing] = useState(false);

  const steps = reset.interactiveSteps || [];
  const currentStep = steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / steps.length) * 100;
  const Icon = reset.interactiveType ? iconMap[reset.interactiveType] : Activity;

  // Auto-advance timer for steps with duration
  useEffect(() => {
    if (!currentStep?.duration || currentStep.input === 'text') return;
    
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
      setCompletedItems([]); // Reset completed items for next step
      setIsAutoAdvancing(false);
    } else {
      onComplete();
    }
  };

  const handleAddItem = () => {
    if (inputValue.trim()) {
      setCompletedItems([...completedItems, inputValue.trim()]);
      setInputValue('');
      
      // Auto-advance if we've reached the count
      if (currentStep.count && completedItems.length + 1 >= currentStep.count) {
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

    // Grounding exercise with list inputs
    if (currentStep.input === 'text' && currentStep.count) {
      return (
        <div className="space-y-6">
          <div className="bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
            <p className="text-sm text-gray-600 mb-2">
              {completedItems.length} of {currentStep.count} complete
            </p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${reset.color}`}
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
                placeholder="e.g., A blue chair"
                className="flex-1 rounded-xl border-purple-200 focus:border-purple-400"
                data-testid="input-grounding-item"
                autoFocus
              />
              <Button
                onClick={handleAddItem}
                disabled={!inputValue.trim()}
                className={`rounded-xl bg-gradient-to-r ${reset.color} text-white px-6`}
                data-testid="button-add-item"
              >
                Add
              </Button>
            </div>
          )}
        </div>
      );
    }

    // Breathing visualization
    if (currentStep.input === 'breath') {
      const isInhale = currentStep.instruction.toLowerCase().includes('in');
      
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br ${reset.color} shadow-2xl`}
            animate={{
              scale: isInhale ? [1, 1.5, 1] : [1.5, 1, 1.5],
            }}
            transition={{
              duration: currentStep.duration || 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <p className="mt-8 text-lg text-gray-600">
            {isInhale ? 'Breathe in...' : 'Breathe out...'}
          </p>
        </div>
      );
    }

    // Tapping exercise
    if (currentStep.input === 'tap') {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br ${reset.color} 
                     shadow-xl flex items-center justify-center cursor-pointer active:scale-95`}
          >
            <Hand className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
          </motion.div>
          <p className="mt-6 text-sm text-gray-500">Follow the rhythm</p>
        </div>
      );
    }

    // Default: just show the instruction
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={onExit}
              variant="ghost"
              className="text-gray-600"
              data-testid="button-finish-early"
            >
              Finish Early
            </Button>
            {timeLeft > 0 && (
              <div className="flex items-center gap-2 text-sm text-purple-600">
                <span className="font-mono font-semibold">{timeLeft}s left</span>
              </div>
            )}
          </div>

          <Progress value={progress} className="h-2 mb-4" data-testid="progress-bar" />
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 sm:p-10 shadow-2xl border border-purple-100"
          >
            {/* Icon */}
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${reset.color} 
                           flex items-center justify-center mb-6 mx-auto shadow-lg`}>
              <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-3">
              {reset.title}
            </h2>

            {/* Instruction */}
            <p className="text-base sm:text-lg text-gray-700 text-center mb-8 leading-relaxed">
              {currentStep?.instruction}
            </p>

            {/* Step-specific content */}
            {renderStepContent()}

            {/* Manual Next button for non-auto-advancing steps */}
            {(!isAutoAdvancing || !currentStep?.duration) && currentStep?.input !== 'text' && (
              <Button
                onClick={handleNext}
                className={`w-full mt-6 rounded-xl bg-gradient-to-r ${reset.color} text-white py-6 text-lg`}
                data-testid="button-continue"
              >
                {currentStepIndex < steps.length - 1 ? 'Continue' : 'Complete'}
              </Button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Step counter */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Step {currentStepIndex + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}
