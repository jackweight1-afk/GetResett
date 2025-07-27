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

// Exercise instructions for different session types
const getSessionInstructions = (sessionType: SessionType, timeRemaining: number) => {
  if (sessionType.name === "Stress Relief") {
    // Calculate which breathing phase we're in
    const cycleTime = 14; // 4 + 4 + 6 seconds per cycle
    const totalCycles = Math.floor(60 / cycleTime);
    const currentCycle = Math.floor((60 - timeRemaining) / cycleTime);
    const timeInCycle = (60 - timeRemaining) % cycleTime;
    
    if (timeInCycle < 4) {
      return "Breathe In";
    } else if (timeInCycle < 8) {
      return "Hold";
    } else {
      return "Breathe Out";
    }
  }

  if (sessionType.name === "Upper Body Stretch" || sessionType.name === "Lower Body Stretch" || sessionType.name === "Full Body Flow") {
    if (sessionType.name === "Upper Body Stretch") {
      if (timeRemaining > 45) return "Neck rolls - slowly roll your head in circles";
      if (timeRemaining > 30) return "Shoulder shrugs - lift shoulders to ears and release";
      if (timeRemaining > 15) return "Arm circles - extend arms and make large circles";
      return "Deep breathing - relax and breathe deeply";
    }
    if (sessionType.name === "Lower Body Stretch") {
      if (timeRemaining > 45) return "Hip circles - place hands on hips and make circles";
      if (timeRemaining > 30) return "Calf raises - rise up on toes and lower slowly";
      if (timeRemaining > 15) return "Ankle rolls - lift foot and rotate ankle";
      return "Deep breathing - relax and breathe deeply";
    }
    if (sessionType.name === "Full Body Flow") {
      if (timeRemaining > 45) return "Reach arms overhead and stretch upward";
      if (timeRemaining > 30) return "Twist gently from side to side";
      if (timeRemaining > 15) return "Roll shoulders and stretch neck";
      return "Deep breathing - integrate your whole body";
    }
  }

  if (sessionType.name === "Energy Boost") {
    if (timeRemaining > 45) return "Arm circles - extend arms and make large circles";
    if (timeRemaining > 30) return "Marching in place - lift knees high";
    if (timeRemaining > 15) return "Shoulder blade squeezes - pull shoulder blades together";
    return "Deep breaths - energize with deep breathing";
  }

  if (sessionType.name === "Mindful Moment") {
    if (timeRemaining > 45) return "Close your eyes and focus on your breath";
    if (timeRemaining > 30) return "Notice 5 things you can hear around you";
    if (timeRemaining > 15) return "Feel your body in contact with your chair";
    return "Take three deep, mindful breaths";
  }

  if (sessionType.name === "Focus Reset") {
    if (timeRemaining > 45) return "Clear your mind of all distractions";
    if (timeRemaining > 30) return "Focus on a single point in front of you";
    if (timeRemaining > 15) return "Count backwards from 20 to 1";
    return "Set your intention for focused work";
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
