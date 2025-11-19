import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { type EmotionalState, type Reset } from '@shared/resetData';
import EmotionSelector from '@/components/emotion-selector';
import ResetSelector from '@/components/reset-selector';
import InteractiveResetPlayer from '@/components/interactive-reset-player';
import StoryResetPlayer from '@/components/story-reset-player';
import MoodRating from '@/components/mood-rating';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type FlowStep = 'emotion' | 'reset-select' | 'reset-play' | 'mood-rating' | 'complete';

export default function Resets() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [step, setStep] = useState<FlowStep>('emotion');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionalState | null>(null);
  const [selectedReset, setSelectedReset] = useState<Reset | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleEmotionSelect = (emotion: EmotionalState) => {
    setSelectedEmotion(emotion);
    setStep('reset-select');
  };

  const handleResetSelect = (reset: Reset) => {
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

  // Block access for inactive or non-corporate users
  useEffect(() => {
    if (!isLoading && user) {
      if (!user.isActive || !user.organisationId) {
        setLocation('/pending-approval');
      }
    }
  }, [user, isLoading, setLocation]);
  
  // Show loading state while checking user status
  if (isLoading) {
    return null;
  }
  
  // Don't render if user doesn't have corporate access
  if (user && (!user.isActive || !user.organisationId)) {
    return null;
  }

  // Render current step
  if (step === 'emotion') {
    return (
      <EmotionSelector 
        onSelect={handleEmotionSelect}
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
