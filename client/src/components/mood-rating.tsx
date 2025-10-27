import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Smile, Meh, Frown } from 'lucide-react';

interface MoodRatingProps {
  onSave: (rating: number) => Promise<void>;  // Save data only
  onComplete: () => void;                      // Complete flow and navigate
  onTryAnother: () => void;                    // Try another reset
}

export default function MoodRating({ onSave, onComplete, onTryAnother }: MoodRatingProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleRate = async (rating: number) => {
    setSelectedRating(rating);
    setShowResult(true);
    
    // Save the rating immediately (for both high and low scores)
    // This ensures all mood data is captured for analytics
    await onSave(rating);
    
    // For high ratings (>=8), automatically complete the flow after showing success message
    if (rating >= 8) {
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
    
    // For low ratings (<8), user will manually choose next action via "Choose Another Reset" button
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background p-4 sm:p-6 flex items-center">
      <div className="max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl p-8 sm:p-12 shadow-elegant-lg border border-border/50"
        >
          {!showResult ? (
            <>
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-muted-olive to-deep-espresso 
                             flex items-center justify-center mb-8 mx-auto shadow-elegant`}>
                <Smile className="w-10 h-10 text-light-stone" />
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-3">
                How are you feeling now?
              </h2>
              
              <p className="text-base sm:text-lg text-muted-foreground text-center mb-10">
                Rate your current mood from 1 to 10
              </p>

              {/* Rating scale */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-3 mb-8">
                {[...Array(10)].map((_, idx) => {
                  const rating = idx + 1;
                  const isSelected = selectedRating === rating;
                  
                  return (
                    <motion.button
                      key={rating}
                      onClick={() => handleRate(rating)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      data-testid={`mood-rating-${rating}`}
                      className={`aspect-square rounded-2xl font-bold text-lg sm:text-xl
                               transition-all duration-200 shadow-elegant hover:shadow-elegant-lg
                               ${isSelected 
                                 ? 'bg-gradient-to-br from-muted-olive to-deep-espresso text-light-stone scale-110' 
                                 : 'bg-card text-foreground hover:bg-muted border border-border/50'
                               }`}
                    >
                      {rating}
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mb-8">
                <span className="flex items-center gap-1">
                  <Frown className="w-4 h-4" />
                  Not great
                </span>
                <span className="flex items-center gap-1">
                  Amazing
                  <Smile className="w-4 h-4" />
                </span>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              {selectedRating && selectedRating >= 8 ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-deep-espresso to-muted-olive 
                                flex items-center justify-center mb-6 mx-auto shadow-elegant">
                    <Smile className="w-10 h-10 text-light-stone" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                    That's wonderful!
                  </h3>
                  <p className="text-lg text-muted-foreground mb-6">
                    You're feeling better. Keep up the great work!
                  </p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-muted-olive via-warm-sand to-deep-espresso 
                                flex items-center justify-center mb-6 mx-auto shadow-elegant">
                    <Meh className="w-10 h-10 text-light-stone" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                    Let's try another reset
                  </h3>
                  <p className="text-lg text-muted-foreground mb-8">
                    Different techniques work at different times. Let's find what helps you right now.
                  </p>

                  <Button
                    onClick={onTryAnother}
                    className="w-full bg-gradient-to-r from-muted-olive to-deep-espresso text-light-stone 
                             text-lg py-6 rounded-xl hover:shadow-elegant-lg transition-all"
                    data-testid="button-try-another"
                  >
                    Choose Another Reset
                  </Button>
                </>
              )}
            </motion.div>
          )}
        </motion.div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Your progress is being tracked • You're building healthy habits
        </p>
      </div>
    </div>
  );
}
