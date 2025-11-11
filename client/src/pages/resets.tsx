import { useState } from 'react';
import { type EmotionalState, type Reset } from '@shared/resetData';
import EmotionSelector from '@/components/emotion-selector';
import ResetSelector from '@/components/reset-selector';
import InteractiveResetPlayer from '@/components/interactive-reset-player';
import StoryResetPlayer from '@/components/story-reset-player';
import MoodRating from '@/components/mood-rating';
import { Paywall } from '@/components/paywall';
import { useAuth } from '@/hooks/useAuth';
import { useSessionLimits } from '@/hooks/useSessionLimits';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type FlowStep = 'emotion' | 'reset-select' | 'reset-play' | 'mood-rating' | 'complete';

export default function Resets() {
  const { user } = useAuth();
  const { toast } = useToast();
  const sessionLimits = useSessionLimits();
  
  const [step, setStep] = useState<FlowStep>('emotion');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionalState | null>(null);
  const [selectedReset, setSelectedReset] = useState<Reset | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  const handleEmotionSelect = (emotion: EmotionalState) => {
    setSelectedEmotion(emotion);
    setStep('reset-select');
  };

  const handleResetSelect = (reset: Reset) => {
    // Debug logging for session limits
    console.log('[Resets] handleResetSelect:', {
      userEmail: user?.email,
      canAccess: sessionLimits.canAccess,
      isSubscribed: sessionLimits.isSubscribed,
      dailyCount: sessionLimits.dailyCount,
      remainingSessions: sessionLimits.remainingSessions
    });
    
    // Check session limits before starting reset
    if (!sessionLimits.canAccess && !sessionLimits.isSubscribed) {
      console.log('[Resets] Showing paywall');
      setShowPaywall(true);
      return;
    }
    
    // Increment session count for non-subscribers
    if (!sessionLimits.isSubscribed) {
      console.log('[Resets] Incrementing count (non-subscriber)');
      sessionLimits.incrementCount();
    } else {
      console.log('[Resets] NOT incrementing count (subscriber or test account)');
    }
    
    setSelectedReset(reset);
    setStep('reset-play');
  };

  const handleResetComplete = async () => {
    setStep('mood-rating');
  };

  const handleSaveMoodRating = async (rating: number) => {
    // Save the feeling entry with mood rating (no navigation)
    try {
      if (user?.id && selectedEmotion) {
        await apiRequest('POST', '/api/feelings', {
          feeling: selectedEmotion,
          moodRating: rating,
          isPostSession: true,
        });
      }

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/feelings'] });

    } catch (error) {
      console.error('Error saving mood rating:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress.",
        variant: "destructive",
      });
    }
  };

  const handleMoodComplete = () => {
    // Navigate back to emotion selection after mood rating is complete
    toast({
      title: "Great work!",
      description: "Your progress has been saved.",
    });
    
    setStep('emotion');
    setSelectedEmotion(null);
    setSelectedReset(null);
    setSessionId(null);
  };

  const handleTryAnother = () => {
    // Keep the emotion selection but go back to reset selection
    setStep('reset-select');
    setSelectedReset(null);
  };

  const handleExit = () => {
    setStep('emotion');
    setSelectedEmotion(null);
    setSelectedReset(null);
    setSessionId(null);
  };

  // Show paywall if needed
  if (showPaywall) {
    return (
      <Paywall
        dailyCount={sessionLimits.dailyCount}
        onSubscriptionComplete={() => {
          setShowPaywall(false);
          // User can continue with their session after subscribing
          if (selectedReset) {
            setStep('reset-play');
          }
        }}
        onClose={() => {
          setShowPaywall(false);
          // Return to reset selection
          setStep('reset-select');
        }}
      />
    );
  }

  // Render current step
  if (step === 'emotion') {
    return (
      <EmotionSelector 
        onSelect={handleEmotionSelect} 
        remainingSessions={sessionLimits.remainingSessions}
        isSubscribed={sessionLimits.isSubscribed}
      />
    );
  }

  if (step === 'reset-select' && selectedEmotion) {
    return (
      <ResetSelector
        emotion={selectedEmotion}
        onSelect={handleResetSelect}
        onBack={() => setStep('emotion')}
      />
    );
  }

  if (step === 'reset-play' && selectedReset && selectedEmotion) {
    if (selectedReset.type === 'story') {
      return (
        <StoryResetPlayer
          reset={selectedReset}
          emotion={selectedEmotion}
          onComplete={handleResetComplete}
          onExit={handleExit}
        />
      );
    } else {
      return (
        <InteractiveResetPlayer
          reset={selectedReset}
          emotion={selectedEmotion}
          onComplete={handleResetComplete}
          onExit={handleExit}
        />
      );
    }
  }

  if (step === 'mood-rating') {
    return (
      <MoodRating
        onSave={handleSaveMoodRating}
        onComplete={handleMoodComplete}
        onTryAnother={handleTryAnother}
      />
    );
  }

  return null;
}
