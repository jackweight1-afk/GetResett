import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { SessionType } from "@shared/schema";
import { 
  Moon, 
  Wind, 
  Target, 
  Dumbbell, 
  Waves, 
  Zap,
  Pause,
  Play,
  Square
} from "lucide-react";

interface SessionTimerProps {
  sessionType: SessionType;
  onComplete: () => void;
  onCancel: () => void;
}

const iconMap = {
  "fas fa-moon": Moon,
  "fas fa-wind": Wind,
  "fas fa-street-view": Target,
  "fas fa-dumbbell": Dumbbell,
  "fas fa-spa": Waves,
  "fas fa-bullseye": Zap,
};

const colorMap = {
  purple: "text-purple-600",
  blue: "text-blue-600",
  sage: "text-sage",
  orange: "text-orange-600",
  teal: "text-teal",
  yellow: "text-yellow-600",
};

const primaryColorMap = {
  purple: "bg-purple-600 hover:bg-purple-700",
  blue: "bg-blue-600 hover:bg-blue-700",
  sage: "bg-sage hover:bg-sage/90",
  orange: "bg-orange-600 hover:bg-orange-700",
  teal: "bg-teal hover:bg-teal/90",
  yellow: "bg-yellow-600 hover:bg-yellow-700",
};

// Breathing pattern for stress relief sessions
const breathingPattern = [
  { phase: "Breathe In", duration: 4 },
  { phase: "Hold", duration: 4 },
  { phase: "Breathe Out", duration: 6 },
];

// Sleep story content
const sleepStorySegments = [
  "Imagine yourself floating on a soft, white cloud as you watch the screen...",
  "The cloud gently drifts across a peaceful blue sky, carrying you away from all worries...",
  "Below you, rolling green hills stretch as far as the eye can see...",
  "A warm, gentle breeze surrounds you, making you feel completely safe and relaxed...",
  "The cloud slowly descends toward a calm, crystal-clear lake...",
  "You feel yourself melting into the cloud, becoming one with its softness...",
  "All tension leaves your body as you drift deeper into this peaceful place...",
  "Your breathing becomes slow and steady, matching the rhythm of gentle waves...",
  "You are completely at peace, floating in perfect tranquility...",
  "Let yourself sink deeper into this calm, restful state...",
  "Your mind is clear, your body is relaxed, sleep is coming naturally...",
  "Allow yourself to drift off into peaceful, restorative sleep..."
];

// Stretching instructions for achy muscles
const stretchingInstructions = [
  "🧘‍♀️ Sit tall and roll your shoulders back 3 times slowly",
  "💪 Gently tilt your head to the right, hold for 5 seconds",
  "💪 Now tilt your head to the left, hold for 5 seconds", 
  "🤲 Interlace your fingers and stretch your arms overhead",
  "🔄 Slowly twist your torso to the right, then return to center",
  "🔄 Now twist your torso to the left, then return to center",
  "👐 Bring your arms behind your back and clasp your hands",
  "🫸 Reach your right arm across your chest, pull gently with left hand",
  "🫷 Now reach your left arm across your chest, pull gently with right hand",
  "🙆‍♀️ Place hands behind your head and open your elbows wide",
  "💆‍♀️ Gently massage your neck with circular motions",
  "✨ Take a deep breath and feel your muscles relax completely"
];

// Focus exercises for concentration
const focusInstructions = [
  "👁️ Look at a fixed point on the screen and breathe deeply",
  "🧠 Count slowly from 1 to 10, focusing only on the numbers",
  "🌊 Imagine waves washing away distracting thoughts",
  "🎯 Focus on the center of the screen while breathing steadily",
  "💭 Notice any wandering thoughts, then gently return focus here",
  "⭐ Visualize a bright star and keep your attention on it",
  "🔢 Count backwards from 20 to 1, one number per breath",
  "🌟 Feel your mind becoming clearer and more focused",
  "💎 Imagine your attention becoming sharp like a diamond",
  "🧘‍♀️ Sit tall and feel your concentration strengthening",
  "🎯 You are becoming more focused and alert",
  "✨ Your mind is now clear, calm, and ready to concentrate"
];

// Energy boost exercises
const energyInstructions = [
  "⚡ Take 3 quick, energizing breaths through your nose",
  "🙌 Raise both arms up high and stretch toward the ceiling",
  "💪 Make fists and pump your arms 10 times",
  "🦵 March in place for 10 seconds, lifting knees high",
  "🤲 Clap your hands together 10 times with energy",
  "🔄 Roll your shoulders back and forward 5 times each",
  "💨 Take a deep breath in and blow out forcefully",
  "🤸‍♀️ Shake out your hands and arms vigorously",
  "🦶 Tap your feet on the ground 10 times",
  "💪 Flex your muscles and feel the energy building",
  "⚡ You're feeling more energized and alert",
  "🌟 Your energy is renewed and ready for action!"
];

// Exercise instructions for different session types
const getSessionInstructions = (sessionType: SessionType, timeRemaining: number) => {
  if (sessionType.name === "Sleep Story") {
    // Calculate which segment of the story we're in (5 seconds per segment)
    const segmentDuration = 5;
    const currentSegment = Math.floor((60 - timeRemaining) / segmentDuration);
    return sleepStorySegments[Math.min(currentSegment, sleepStorySegments.length - 1)];
  }
  
  if (sessionType.name === "Stress Relief") {
    // Calculate which breathing phase we're in
    const cycleTime = 14; // 4 + 4 + 6 seconds per cycle
    const timeInCycle = (60 - timeRemaining) % cycleTime;
    
    if (timeInCycle < 4) {
      return "Breathe In";
    } else if (timeInCycle < 8) {
      return "Hold";
    } else {
      return "Breathe Out";
    }
  }

  // Handle achy muscles with detailed stretching instructions
  if (sessionType.name === "Upper Body Stretch" || sessionType.name === "Lower Body Stretch" || 
      sessionType.name === "Full Body Flow" || sessionType.name === "Quick Stretch") {
    const instructionDuration = 5; // 5 seconds per instruction
    const currentInstruction = Math.floor((60 - timeRemaining) / instructionDuration);
    return stretchingInstructions[Math.min(currentInstruction, stretchingInstructions.length - 1)];
  }

  if (sessionType.name === "Energy Boost") {
    const instructionDuration = 5; // 5 seconds per instruction
    const currentInstruction = Math.floor((60 - timeRemaining) / instructionDuration);
    return energyInstructions[Math.min(currentInstruction, energyInstructions.length - 1)];
  }

  if (sessionType.name === "Mindful Moment") {
    if (timeRemaining > 45) return "👁️ Focus on your breath while looking at the screen";
    if (timeRemaining > 30) return "👂 Notice 5 things you can hear around you";
    if (timeRemaining > 15) return "🤲 Feel your body in contact with your chair";
    return "🌬️ Take three deep, mindful breaths";
  }

  if (sessionType.name === "Focus Reset") {
    const instructionDuration = 5; // 5 seconds per instruction
    const currentInstruction = Math.floor((60 - timeRemaining) / instructionDuration);
    return focusInstructions[Math.min(currentInstruction, focusInstructions.length - 1)];
  }

  return "Follow along with the session";
};

export default function SessionTimer({ sessionType, onComplete, onCancel }: SessionTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const IconComponent = iconMap[sessionType.icon as keyof typeof iconMap] || Zap;
  const textColor = colorMap[sessionType.color as keyof typeof colorMap] || "text-gray-600";
  const primaryColor = primaryColorMap[sessionType.color as keyof typeof primaryColorMap] || "bg-gray-600 hover:bg-gray-700";

  const progress = ((60 - timeRemaining) / 60) * 100;
  const instruction = getSessionInstructions(sessionType, timeRemaining);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeRemaining, onComplete]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(60);
    onCancel();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center space-y-6">
      <div className="flex items-center justify-center">
        <div className={`w-16 h-16 ${colorMap[sessionType.color as keyof typeof colorMap] || "bg-gray-100 text-gray-600"} rounded-full flex items-center justify-center`}>
          <IconComponent className="w-8 h-8" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{sessionType.name}</h3>
        <p className="text-sm text-gray-600">Stay focused and follow the guidance</p>
      </div>

      {/* Timer Display */}
      <div className="relative">
        <div className="w-32 h-32 md:w-40 md:h-40 mx-auto relative">
          {/* Background circle */}
          <svg className="w-32 h-32 md:w-40 md:h-40" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className={colorMap[sessionType.color as keyof typeof colorMap]?.includes('purple') ? 'text-purple-600' : 
                        colorMap[sessionType.color as keyof typeof colorMap]?.includes('blue') ? 'text-blue-600' :
                        colorMap[sessionType.color as keyof typeof colorMap]?.includes('sage') ? 'text-sage' :
                        colorMap[sessionType.color as keyof typeof colorMap]?.includes('orange') ? 'text-orange-600' :
                        colorMap[sessionType.color as keyof typeof colorMap]?.includes('teal') ? 'text-teal' : 'text-purple-600'}
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl md:text-3xl font-bold text-gray-900">
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-4 md:p-6 min-h-[100px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-base md:text-lg font-medium text-gray-900 mb-2">
            {instruction}
          </div>
          {sessionType.name === "Stress Relief" && (
            <div className="text-xs md:text-sm text-gray-500">
              4 seconds in, 4 seconds hold, 6 seconds out
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress value={progress} className="w-full" />
        <div className="text-sm text-gray-500">
          {Math.round(progress)}% complete
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-3 px-4 pt-4">
        {!isRunning ? (
          <Button 
            onClick={handleStart}
            className={`${primaryColorMap[sessionType.color as keyof typeof primaryColorMap] || "bg-purple-600 hover:bg-purple-700"} text-white px-6 md:px-8 py-2 md:py-3 text-sm md:text-base`}
          >
            <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Start
          </Button>
        ) : (
          <Button 
            onClick={handlePause}
            variant="outline"
            className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base"
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Pause
              </>
            )}
          </Button>
        )}
        
        <Button 
          onClick={handleStop}
          variant="outline"
          className="px-4 md:px-6 py-2 md:py-3 text-sm md:text-base"
        >
          <Square className="w-4 h-4 md:w-5 md:h-5 mr-2" />
          Stop
        </Button>
      </div>
      
      {/* Mobile padding for bottom navigation */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
}
