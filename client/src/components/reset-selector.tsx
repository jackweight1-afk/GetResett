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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-4 text-muted-foreground hover:text-foreground"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {emotionInfo.label} Resets
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">
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
              className="group relative bg-card rounded-2xl p-5 sm:p-6
                       shadow-elegant hover:shadow-elegant-lg transition-all duration-300 
                       hover:scale-[1.02] active:scale-[0.98] border border-border/50
                       text-left overflow-hidden"
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${reset.color}`} />
              
              {/* Duration badge */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl 
                               bg-deep-espresso text-light-stone text-xs sm:text-sm font-medium shadow-elegant">
                  <Clock className="w-3 h-3" />
                  {formatDuration(reset.duration)}
                </div>
              </div>

              {/* Content */}
              <div className="pr-20">
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  {reset.title}
                </h3>
                
                <p className="text-sm sm:text-base text-muted-foreground mb-3 line-clamp-2">
                  {reset.description}
                </p>

                {/* Science benefit */}
                <div className="flex items-start gap-2 mt-3 pt-3 border-t border-border/50">
                  <Info className="w-4 h-4 text-muted-olive mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-deep-espresso font-medium">
                    {reset.scienceBenefit}
                  </p>
                </div>
              </div>

              {/* Hover effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${reset.color} opacity-0 
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
          <p className="text-sm text-muted-foreground">
            Each reset uses scientifically-proven techniques • Take as many as you need
          </p>
        </motion.div>
      </div>
    </div>
  );
}
