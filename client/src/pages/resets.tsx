import { useState } from 'react';
import { type EmotionalState, type Reset } from '@shared/resetData';
import EmotionSelector from '@/components/emotion-selector';
import ResetSelector from '@/components/reset-selector';
import InteractiveResetPlayer from '@/components/interactive-reset-player';
import StoryResetPlayer from '@/components/story-reset-player';
import MoodRating from '@/components/mood-rating';
import { useToast } from '@/hooks/use-toast';

type FlowStep = 'emotion' | 'reset-select' | 'reset-play' | 'mood-rating' | 'complete';

export default function Resets() {
  const { toast } = useToast();
  
  const [step, setStep] = useState<FlowStep>('emotion');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionalState | null>(null);
  const [selectedReset, setSelectedReset] = useState<Reset | null>(null);

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
    // Simple demo - just show success message (no backend tracking)
    toast({
      title: "Great work!",
      description: "Thanks for trying the demo.",
    });
  };

  const handleMoodComplete = () => {
    // Navigate back to emotion selection after mood rating is complete
    toast({
      title: "Great work!",
      description: "Ready for another reset?",
    });
    
    setStep('emotion');
    setSelectedEmotion(null);
    setSelectedReset(null);
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
  };

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
    }
    
    return (
      <InteractiveResetPlayer
        reset={selectedReset}
        emotion={selectedEmotion}
        onComplete={handleResetComplete}
        onExit={handleExit}
      />
    );
  }

  if (step === 'mood-rating' && selectedReset) {
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
