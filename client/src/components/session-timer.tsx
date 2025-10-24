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
  Star,
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
  "fas fa-star": Star,
};

const colorMap = {
  purple: "text-purple-600",
  blue: "text-blue-600",
  sage: "text-sage",
  orange: "text-orange-600",
  teal: "text-teal",
  yellow: "text-yellow-600",
};

const buttonColorMap = {
  purple: "bg-purple-600 hover:bg-purple-700",
  blue: "bg-purple-600 hover:bg-purple-700",
  sage: "bg-purple-600 hover:bg-purple-700",
  orange: "bg-purple-600 hover:bg-purple-700",
  teal: "bg-purple-600 hover:bg-purple-700",
  yellow: "bg-purple-600 hover:bg-purple-700",
};

// Breathing pattern for stress relief sessions
const breathingPattern = [
  { phase: "Breathe In", duration: 4 },
  { phase: "Hold", duration: 4 },
  { phase: "Breathe Out", duration: 6 },
];

// Multiple sleep story variations
const sleepStoryVariations = [
  // Variation 1: Cloud Journey
  [
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
  ],
  // Variation 2: Forest Path
  [
    "Picture yourself walking slowly down a peaceful forest path...",
    "Tall, ancient trees create a gentle canopy above you...",
    "Sunlight filters through the leaves, creating dancing patterns of light...",
    "You can hear the soft rustling of leaves and distant bird songs...",
    "The path leads you to a comfortable moss-covered clearing...",
    "You lie down on the soft earth, feeling completely supported...",
    "The sounds of the forest create a natural lullaby around you...",
    "Your breathing slows to match the peaceful rhythm of nature...",
    "Every muscle in your body relaxes into the soft ground...",
    "The forest embraces you with its calm, protective energy...",
    "Your eyelids grow heavy as you sink into deep relaxation...",
    "Sleep comes naturally as the forest cradles you in peace..."
  ],
  // Variation 3: Ocean Waves
  [
    "You find yourself lying on warm, soft sand by a gentle ocean...",
    "The waves roll in and out with a soothing, hypnotic rhythm...",
    "Each wave that washes ashore takes away your stress and worries...",
    "The sunset paints the sky in soft shades of pink and orange...",
    "A gentle ocean breeze carries the scent of salt and serenity...",
    "You feel the sand warming your back, supporting you completely...",
    "The sound of waves becomes a natural, peaceful lullaby...",
    "Your breathing synchronizes with the ebb and flow of the tide...",
    "Each exhale releases more tension from your body...",
    "The rhythmic waves wash away all thoughts and concerns...", 
    "You drift deeper into a state of perfect, oceanic calm...",
    "Sleep arrives like a gentle wave, carrying you to peaceful dreams..."
  ]
];

// Multiple stretching variations for achy muscles
const stretchingVariations = [
  // Variation 1: Neck & Shoulders Focus
  [
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
  ],
  // Variation 2: Upper Body Release
  [
    "🌟 Start by taking three deep breaths and relaxing your face",
    "👐 Reach both arms up high and gently sway side to side",
    "🔄 Make small circles with your shoulders, forward then backward",
    "🤲 Press your palms together in front of your chest, then overhead",
    "💪 Gently pull your right elbow across your body with your left hand",
    "💪 Now pull your left elbow across your body with your right hand",
    "🙆‍♀️ Clasp hands behind your head, gently press elbows back",
    "🧘‍♀️ Tilt your head forward, feel the stretch in your neck",
    "🔄 Slowly roll your head in a half circle, right to left",
    "👐 Shrug your shoulders up to your ears, then drop them down",
    "💆‍♀️ Gently massage your temples with your fingertips",
    "🌬️ End with three slow, deep breaths"
  ],
  // Variation 3: Desk Worker Special
  [
    "💻 Push your chair back and stand up tall",
    "🤲 Reach your arms up and lean gently to the right",
    "🤲 Now reach up and lean gently to the left",
    "🔄 Place hands on your hips and twist your torso right",
    "🔄 Now twist your torso to the left, keeping hips forward",
    "💪 Bring your right arm across your chest, stretch gently",
    "💪 Bring your left arm across your chest, stretch gently",
    "🙆‍♀️ Lace fingers behind your back, lift your chest",
    "🧘‍♀️ Drop your chin to your chest, feel the neck stretch",
    "👐 Roll your shoulders backward in slow, large circles",
    "💆‍♀️ Gently rub the base of your skull with your fingers",
    "🌟 Take a moment to notice how much better you feel"
  ]
];

// Multiple focus variations for concentration
const focusVariations = [
  // Variation 1: Visual Focus
  [
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
  ],
  // Variation 2: Mental Clarity
  [
    "🧠 Take three deep breaths and clear your mental space",
    "💭 Imagine organizing your thoughts like files in a folder",
    "🎯 Focus on one single word: 'CLARITY' for 10 seconds",
    "🌟 Visualize a bright light illuminating your mind",
    "🔍 Notice the details of your current surroundings",
    "💎 Feel your attention becoming laser-focused",
    "🌊 Let distracting thoughts flow away like water",
    "⚡ Sense your mental energy becoming sharp and precise",
    "🎯 Direct all your attention to this present moment",
    "🧘‍♀️ Feel your concentration muscle growing stronger",
    "💪 Your focus is now steady and unshakeable",
    "✨ You are ready to tackle any task with clarity"
  ],
  // Variation 3: Mind Reset
  [
    "🔄 Take a deep breath and reset your attention",
    "🧘‍♀️ Take a moment to reset your mental state completely",
    "💭 Let go of all previous thoughts and start fresh",
    "🎯 Choose one object in your field of vision to focus on",
    "🌬️ Breathe in clarity, breathe out mental fog",
    "⭐ Imagine your mind as a calm, still lake",
    "🔢 Count your breaths: 1... 2... 3... up to 10",
    "💎 Feel your attention becoming crystal clear",
    "🌟 Your mind is now refreshed and ready to focus",
    "🎯 Direct this renewed attention to what matters most",
    "💪 You have complete control over your focus",
    "✨ Your concentration is now sharp and sustained"
  ]
];

// Multiple energy boost variations
const energyVariations = [
  // Variation 1: Quick Energizer
  [
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
  ],
  // Variation 2: Desk Energy Boost
  [
    "🌟 Sit up straight and take a powerful breath in",
    "💪 Press your palms together firmly in front of your chest",
    "🙌 Raise your arms overhead and reach for the sky",
    "🔄 Make large, energetic circles with your arms",
    "⚡ Clench and release your fists 10 times rapidly",
    "🦵 Lift one knee, then the other, like marching seated",
    "💨 Breathe in energy, breathe out fatigue",
    "🤸‍♀️ Wiggle your fingers and toes with excitement",
    "💪 Tense all your muscles for 3 seconds, then release",
    "🌟 Feel the energy flowing through your entire body",
    "⚡ Your mind is sharp and your body is energized",
    "🚀 You're ready to power through anything!"
  ],
  // Variation 3: Full Body Wake-Up
  [
    "🌅 Stand up and stretch like you're greeting the sun",
    "💪 Do 5 gentle jumping jacks to wake up your body",
    "🙌 Reach alternating arms up high, left then right",
    "🔄 Twist your torso side to side with enthusiasm",
    "⚡ Take 5 deep breaths, making each exhale longer",
    "🤸‍♀️ Gently bounce on the balls of your feet",
    "💨 Blow out any sleepiness with a big 'WHOOSH' sound",
    "🦶 Do a little dance move - anything that feels good",
    "💪 Give yourself a quick shoulder massage",
    "🌟 Smile widely and feel the positive energy",
    "⚡ Your whole system is now awake and energized",
    "🚀 You're bursting with renewed vitality!"
  ]
];

// Multiple anxiety relief variations focused on active grounding techniques
const anxietyReliefVariations = [
  // Variation 1: Countdown & Movement (15-second intervals)
  [
    "🔢 Let's interrupt anxious thoughts with active counting. Count backwards from 20 to 10, tapping your leg with each number. Say each number out loud and focus only on this task.",
    "🎯 Now count from 10 to 5, clapping your hands with each number. Feel your mind focusing on the present moment instead of anxious thoughts.",
    "✊ For numbers 5 to 1, stomp your foot and squeeze your fists with each count. Your anxiety is being replaced with focused attention.",
    "🌟 Excellent! Take three deep breaths. Your mind is now grounded in the present moment, not caught in anxious thoughts."
  ],
  // Variation 2: Hand Tracing & Questions (15-second intervals)
  [
    "✋ Hold up one hand. Trace up your thumb slowly while asking 'What day is today?' Trace down while answering out loud. Continue to your index finger, asking 'What can I see?' and answering as you trace down.",
    "🖕 Trace up your middle finger asking 'What do I hear?' Answer as you trace down. Move to your ring finger, asking 'What am I touching?' Describe what you feel as you trace down.",
    "🤙 Trace up your pinky asking 'Where am I?' State your exact location as you trace down. Now press your palms together and take three deep breaths.",
    "🌟 Perfect! Your anxious mind has been redirected to present-moment awareness through this grounding technique."
  ],
  // Variation 3: Active Present-Moment Tasks (15-second intervals)
  [
    "🎯 Let's interrupt the worry cycle with specific tasks. Look around and count 7 things of the same color - point to each one and say its name out loud. Then say the alphabet backwards from Z to T.",
    "🤲 Press your palms together firmly for 5 seconds, then release. Lift each foot and wiggle your toes. Listen for the furthest sound you can hear and point toward it.",
    "✊ Make fists and count to 3, then open them. Repeat 3 times. Say your full name out loud, then spell your first name backwards. March in place for 10 steps, counting each one.",
    "💪 Tense every muscle in your body for 3 seconds, then completely relax. Your anxious thoughts have been replaced with present-moment focus!"
  ]
];

// Multiple confidence boost variations
const confidenceVariations = [
  // Variation 1: Positive Affirmations
  [
    "🌟 Take a deep breath and stand or sit up tall",
    "💪 Say to yourself: 'I am capable and strong'",
    "✨ Repeat: 'I believe in my abilities and potential'",
    "🎯 Affirm: 'I face challenges with confidence and courage'",
    "🌈 Say: 'I am worthy of success and happiness'",
    "💎 Repeat: 'My unique qualities make me valuable'",
    "🚀 Affirm: 'I have everything I need to succeed'",
    "🔥 Say: 'I trust myself to make good decisions'",
    "⭐ Repeat: 'I am confident in who I am becoming'",
    "💫 Affirm: 'I radiate confidence and positivity'",
    "🌟 Say: 'I am ready to embrace new opportunities'",
    "✨ You are confident, capable, and ready to shine!"
  ],
  // Variation 2: Power Poses & Breathing
  [
    "🦸‍♀️ Stand up and place your hands on your hips - feel powerful",
    "💨 Take three deep, confident breaths through your nose",
    "🙌 Raise your arms above your head in a victory pose",
    "💪 Flex your muscles and feel your inner strength",
    "🌟 Look up slightly and smile - you've got this!",
    "🔥 Take up space - stretch your arms wide",
    "⚡ Say out loud: 'I am confident and capable'",
    "🎯 Point forward and declare: 'I'm ready for anything'",
    "💎 Place your hand on your heart - feel your power",
    "🚀 Take one more powerful breath and own your space",
    "✨ Visualize yourself succeeding at your next challenge",
    "🌟 You now carry this confidence with you wherever you go!"
  ],
  // Variation 3: Self-Empowerment Ritual
  [
    "🌅 Take a deep breath and imagine your most confident self",
    "💪 Think of a time when you overcame a difficult challenge",
    "✨ Feel that same strength and resilience flowing through you now",
    "🎯 Set an intention: 'I choose to believe in myself today'",
    "🔥 Imagine a bright light of confidence glowing in your chest",
    "💫 Let this light expand throughout your entire body",
    "🌟 Whisper to yourself: 'I am exactly where I need to be'",
    "💎 Remember: Every expert was once a beginner",
    "🚀 Visualize yourself walking into your next situation with poise",
    "⭐ Feel the support of everyone who believes in you",
    "🌈 Carry this feeling of self-assurance with you",
    "✨ You are confident, capable, and completely ready!"
  ]
];

// Random variation selector - consistent per session
let selectedVariations: { [key: string]: number } = {};

// Exercise instructions for different session types
const getSessionInstructions = (sessionType: SessionType, timeRemaining: number) => {
  if (sessionType.name === "Sleep Story") {
    // Select a consistent variation for this session
    if (!selectedVariations[sessionType.id]) {
      selectedVariations[sessionType.id] = Math.floor(Math.random() * sleepStoryVariations.length);
    }
    const variation = sleepStoryVariations[selectedVariations[sessionType.id]];
    
    // Calculate which segment of the story we're in (15 seconds per segment)
    const segmentDuration = 15;
    const currentSegment = Math.floor((60 - timeRemaining) / segmentDuration);
    return variation[Math.min(currentSegment, variation.length - 1)];
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
      sessionType.name === "Full Body Flow" || sessionType.name === "Quick Stretch" || 
      sessionType.description?.includes("muscles")) {
    // Select a consistent variation for this session
    if (!selectedVariations[sessionType.id]) {
      selectedVariations[sessionType.id] = Math.floor(Math.random() * stretchingVariations.length);
    }
    const variation = stretchingVariations[selectedVariations[sessionType.id]];
    
    const instructionDuration = 15; // 15 seconds per instruction  
    const currentInstruction = Math.floor((60 - timeRemaining) / instructionDuration);
    return variation[Math.min(currentInstruction, variation.length - 1)];
  }

  if (sessionType.name === "Energy Boost") {
    // Select a consistent variation for this session
    if (!selectedVariations[sessionType.id]) {
      selectedVariations[sessionType.id] = Math.floor(Math.random() * energyVariations.length);
    }
    const variation = energyVariations[selectedVariations[sessionType.id]];
    
    const instructionDuration = 15; // 15 seconds per instruction
    const currentInstruction = Math.floor((60 - timeRemaining) / instructionDuration);
    return variation[Math.min(currentInstruction, variation.length - 1)];
  }

  if (sessionType.name === "Mindful Moment") {
    if (timeRemaining > 45) return "👁️ Focus on your breath while looking at the screen";
    if (timeRemaining > 30) return "👂 Notice 5 things you can hear around you";
    if (timeRemaining > 15) return "🤲 Feel your body in contact with your chair";
    return "🌬️ Take three deep, mindful breaths";
  }

  if (sessionType.name === "Focus Reset") {
    // Select a consistent variation for this session
    if (!selectedVariations[sessionType.id]) {
      selectedVariations[sessionType.id] = Math.floor(Math.random() * focusVariations.length);
    }
    const variation = focusVariations[selectedVariations[sessionType.id]];
    
    const instructionDuration = 15; // 15 seconds per instruction
    const currentInstruction = Math.floor((60 - timeRemaining) / instructionDuration);
    return variation[Math.min(currentInstruction, variation.length - 1)];
  }

  if (sessionType.name === "Anxiety Relief") {
    // Select a consistent variation for this session
    if (!selectedVariations[sessionType.id]) {
      selectedVariations[sessionType.id] = Math.floor(Math.random() * anxietyReliefVariations.length);
    }
    const variation = anxietyReliefVariations[selectedVariations[sessionType.id]];
    
    const instructionDuration = 15; // 15 seconds per instruction for better pacing
    const currentInstruction = Math.floor((60 - timeRemaining) / instructionDuration);
    return variation[Math.min(currentInstruction, variation.length - 1)];
  }

  if (sessionType.name === "Confidence Boost") {
    // Select a consistent variation for this session
    if (!selectedVariations[sessionType.id]) {
      selectedVariations[sessionType.id] = Math.floor(Math.random() * confidenceVariations.length);
    }
    const variation = confidenceVariations[selectedVariations[sessionType.id]];
    
    const instructionDuration = 15; // 15 seconds per instruction
    const currentInstruction = Math.floor((60 - timeRemaining) / instructionDuration);
    return variation[Math.min(currentInstruction, variation.length - 1)];
  }

  return "Follow along with the session";
};

export default function SessionTimer({ sessionType, onComplete, onCancel }: SessionTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Reset selected variation when component unmounts (new session)
  useEffect(() => {
    return () => {
      delete selectedVariations[sessionType.id];
    };
  }, [sessionType.id]);

  const IconComponent = iconMap[sessionType.icon as keyof typeof iconMap] || Zap;
  const textColor = colorMap[sessionType.color as keyof typeof colorMap] || "text-gray-600";
  const primaryColor = buttonColorMap[sessionType.color as keyof typeof buttonColorMap] || "bg-gray-600 hover:bg-gray-700";

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
      <div className="flex justify-center space-x-3 px-4 pt-4 pb-4 min-h-[60px]">
        {!isRunning ? (
          <Button 
            onClick={handleStart}
            size="lg"
            className={`${buttonColorMap[sessionType.color as keyof typeof buttonColorMap] || "bg-purple-600 hover:bg-purple-700"} text-white px-8 py-3 text-base font-medium shadow-lg`}
          >
            <Play className="w-5 h-5 mr-2" />
            Start
          </Button>
        ) : (
          <>
            <Button 
              onClick={handlePause}
              variant="outline"
              size="lg"
              className="px-6 py-3 text-base font-medium text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white"
            >
              {isPaused ? (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleStop}
              variant="outline"
              size="lg"
              className="px-6 py-3 text-base font-medium text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white"
            >
              <Square className="w-5 h-5 mr-2" />
              Stop
            </Button>
          </>
        )}
      </div>
      
      {/* Mobile padding for bottom navigation */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
}
