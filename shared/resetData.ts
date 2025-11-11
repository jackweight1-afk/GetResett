// Reset types and emotional states
export type EmotionalState = 'stressed' | 'anxiety' | 'restless' | 'overwhelmed' | 'tired' | 'scattered' | 'energy';
export type ResetType = 'story' | 'interactive';

// Emotion state definitions
export const EMOTIONAL_STATES = {
  stressed: {
    label: 'Stressed',
    color: 'from-purple-400 to-indigo-500',
    description: 'Feeling overwhelmed by pressure or demands'
  },
  anxiety: {
    label: 'Anxious',
    color: 'from-pink-500 to-rose-600',
    description: 'Worried thoughts and racing mind'
  },
  restless: {
    label: 'Restless',
    color: 'from-amber-400 to-orange-500',
    description: 'Unable to settle or focus your energy'
  },
  overwhelmed: {
    label: 'Overwhelmed',
    color: 'from-indigo-500 to-purple-600',
    description: 'Too much to handle all at once'
  },
  tired: {
    label: 'Tired',
    color: 'from-blue-500 to-cyan-600',
    description: 'Low energy and mental fatigue'
  },
  scattered: {
    label: 'Scattered',
    color: 'from-green-400 to-teal-500',
    description: 'Difficulty focusing or staying present'
  },
  energy: {
    label: 'Energy to Burn',
    color: 'from-red-500 to-orange-600',
    description: 'Excess energy that needs physical release'
  }
} as const;

export interface Reset {
  id: string;
  emotionalState: EmotionalState;
  type: ResetType;
  title: string;
  description: string;
  scienceBenefit: string;
  duration: number; // in seconds
  color: string;
  // For story resets
  storyContent?: StoryStep[];
  // For interactive resets
  interactiveType?: 'grounding' | 'breathing' | 'visualization' | 'tapping' | 'counting' | 'body-scan' | 'stress-sweep' | 'bubble-tap' | 'rhythm-tap' | 'grid-tap' | 'dot-connect' | 'swipe-sort' | 'pressure-valve' | 'blink-track' | 'movement-workout' | 'shadowboxing' | 'breath-movement' | 'walking-pace';
  interactiveSteps?: InteractiveStep[];
  requiresDisclaimer?: boolean;
}

export interface StoryStep {
  title?: string;
  text: string;
  duration: number; // seconds to show this step
  background?: string; // optional background color/gradient
}

export interface InteractiveStep {
  title?: string;
  instruction: string;
  duration?: number;
  input?: 'text' | 'tap' | 'breath' | 'none' | 'movement';
  count?: number; // for exercises that need counting
  visualAid?: string; // path to image/animation for movement guidance
  alternativeMove?: string; // low-impact alternative instruction
  isStretch?: boolean; // marks this as a stretch step
}

// All 24 resets: 4 per emotional state
export const RESETS: Reset[] = [
  // ============ STRESSED (4 resets) ============
  {
    id: 'stressed-grounding-walk',
    emotionalState: 'stressed',
    type: 'story',
    title: 'Grounding Walk',
    description: 'A sensory grounding journey to calm your mind',
    scienceBenefit: 'Scientifically shown to reduce stress through sensory awareness',
    duration: 60,
    color: 'from-purple-400 to-indigo-500',
    storyContent: [
      { title: 'Grounding Walk', text: 'We\'re going to ground your mind using a simple imagined walk. Keep your eyes open and follow each step.', duration: 6 },
      { title: 'Picture the Path', text: 'Imagine stepping onto a quiet path. Visualise the space opening around you — the sky, the trees, the open air.', duration: 8 },
      { title: 'Your Pace', text: 'Imagine taking slow, steady steps. Feel the ground supporting you with each one. Match the rhythm of these steps with your breathing.', duration: 10 },
      { title: 'Notice the Scene', text: 'Picture 5 things around you: The colours of the sky… The shapes of the trees… The sound of your steps… A soft breeze… And the clear space ahead.', duration: 12 },
      { title: 'Breathe', text: 'Inhale gently with a step… Exhale with the next… Each slow breath releases more of the pressure you\'ve been holding.', duration: 12 },
      { title: 'Reset Complete', text: 'Your mind is clearer. Your body is lighter. Reset complete.', duration: 8 }
    ]
  },
  {
    id: 'stressed-waves-release',
    emotionalState: 'stressed',
    type: 'story',
    title: 'Waves of Release',
    description: 'Use gentle wave imagery to release tension',
    scienceBenefit: 'Visualization paired with breathing reduces stress',
    duration: 75,
    color: 'from-purple-400 to-indigo-500',
    storyContent: [
      { title: 'Waves of Release', text: 'We\'re going to use steady visualisation to help release stress from your body. Keep your eyes open and follow each step.', duration: 6 },
      { title: 'Calm Water', text: 'Imagine gentle waves moving across calm water. Let your gaze rest softly on the screen as you picture it.', duration: 8 },
      { title: 'Gather the Tension', text: 'Picture a wave lifting up. As it rises, imagine it collecting the tension you\'re holding in your shoulders and chest.', duration: 10 },
      { title: 'Release', text: 'Now imagine the wave falling. As it lowers, let the tension move away from you with it. Exhale as the wave settles.', duration: 10 },
      { title: 'Again', text: 'Let the next wave rise — gathering any strain around your neck and face. Let it fall — releasing everything you don\'t need.', duration: 12 },
      { title: 'One More', text: 'Inhale as the last wave rises gently. Exhale as it falls and carries away the rest of your stress.', duration: 12 },
      { title: 'Reset Complete', text: 'You\'re calm, clear, and present. Reset complete.', duration: 8 }
    ]
  },
  {
    id: 'stressed-tense-release',
    emotionalState: 'stressed',
    type: 'interactive',
    title: 'Full-Body Tense & Release',
    description: 'Progressive muscle relaxation for instant calm',
    scienceBenefit: 'Reduces cortisol and activates relaxation response',
    duration: 90,
    color: 'from-purple-500 to-pink-500',
    interactiveType: 'body-scan',
    interactiveSteps: [
      { title: 'Full-Body Tense & Release', instruction: 'In this reset, we\'ll quickly release the stress stored in your muscles. Follow each short step, keep your eyes open, and move at your own pace.', duration: 6 },
      { title: 'Hands', instruction: 'Clench both fists firmly. Hold the tension for… 3… 2… 1… Now release. Let your fingers soften and drop.', duration: 8 },
      { title: 'Arms', instruction: 'Tense your forearms and biceps by gently pulling them in. Hold for… 3… 2… 1… Release. Feel the warmth as your arms relax.', duration: 10 },
      { title: 'Shoulders', instruction: 'Bring your shoulders slightly up toward your ears. Hold the tension for… 3… 2… 1… Let them drop. Let your shoulders feel heavier and looser.', duration: 10 },
      { title: 'Stomach', instruction: 'Tighten your stomach muscles gently — not too hard. Hold for… 3… 2… 1… Release. Let your breathing flow naturally again.', duration: 10 },
      { title: 'Legs', instruction: 'Tense your thighs and calves at the same time. Hold for… 3… 2… 1… Release. Feel your legs sink and soften.', duration: 10 },
      { title: 'Full Body', instruction: 'Tense your whole body just a little — arms, shoulders, stomach, legs. Hold for… 3… 2… 1… Release everything. Let your whole body loosen.', duration: 12 },
      { title: 'Reset Complete', instruction: 'Your body should now feel softer, lighter, and clearer. Reset complete.', duration: 8 }
    ]
  },
  {
    id: 'stressed-stress-sweep',
    emotionalState: 'stressed',
    type: 'interactive',
    title: 'Stress Sweep',
    description: 'Type and swipe away your stressors',
    scienceBenefit: 'Expressive release reduces stress hormones',
    duration: 60,
    color: 'from-indigo-500 to-purple-500',
    interactiveType: 'stress-sweep',
    interactiveSteps: [
      { title: 'Stress Sweep', instruction: 'Let\'s clear the thoughts that are stressing you right now. You\'ll type them in, then swipe them away one by one.', duration: 6 },
      { title: 'What\'s stressing you?', instruction: 'Type up to 5 words or short phrases that describe what\'s weighing on you. Examples: "work", "money", "pressure", "tired".', input: 'text', count: 5, duration: 25 },
      { title: 'You\'re in control', instruction: 'These words will now float on your screen. Your task is simple: tap or swipe each one away. This helps your mind release them.', duration: 8 },
      { title: 'Clear Your Stress', instruction: 'Tap or swipe each word to clear it. Take your time. Each swipe represents letting go.', input: 'tap', duration: 20 },
      { title: 'Reset Complete', instruction: 'You\'ve cleared what was weighing on you. Take a breath and notice the space you\'ve created.', duration: 8 }
    ]
  },

  // ============ ANXIETY (4 resets) ============
  {
    id: 'anxiety-breathing-storm',
    emotionalState: 'anxiety',
    type: 'story',
    title: 'Breathing Through the Storm',
    description: 'Calm anxiety with guided breathing',
    scienceBenefit: 'Regulates autonomic nervous system',
    duration: 60,
    color: 'from-pink-400 to-rose-500',
    storyContent: [
      { title: 'Breathing Through the Storm', text: 'We\'re going to guide your mind and body to calm with a simple breathing exercise. Focus on the screen and follow the steps.', duration: 6 },
      { title: 'Imagine the Storm', text: 'Picture a storm in the distance, dark clouds, and distant thunder. Now picture the storm slowly moving further away. Let the sound of the thunder become softer with each breath you take.', duration: 12 },
      { title: 'Slow Down Your Breathing', text: 'Take a slow, deep breath in for 4 counts. Hold for 4 counts. Now slowly exhale for 6 counts, pushing the tension out. Repeat: Inhale for 4... Hold for 4... Exhale for 6…', duration: 18 },
      { title: 'Let It Fade', text: 'With each breath, imagine the storm becoming quieter, the clouds drifting away. Feel your body relax with every exhale. Your mind is clearer, your body at ease.', duration: 12 },
      { title: 'Reset Complete', text: 'The storm is now far away, and you are calm. Feel the space between your thoughts. Reset complete.', duration: 8 }
    ]
  },
  {
    id: 'anxiety-grounding',
    emotionalState: 'anxiety',
    type: 'story',
    title: '5-4-3-2-1 Grounding',
    description: 'Ground yourself using your five senses',
    scienceBenefit: 'Interrupts anxious thoughts and brings you present',
    duration: 90,
    color: 'from-pink-400 to-rose-500',
    storyContent: [
      { title: '5-4-3-2-1 Grounding', text: 'This is a quick exercise that helps ground you by focusing on your senses. Follow along and feel your stress melt away.', duration: 6 },
      { title: 'Focus on What You See', text: 'Look around you and pick out 5 things you can see. Focus on the details of each — shapes, colours, texture. List them quietly in your mind. Feel your mind start to settle.', duration: 14 },
      { title: 'Focus on What You Feel', text: 'Now, pay attention to 4 things you can feel. It could be the sensation of the floor beneath your feet, the clothes on your skin, or your own breathing. Allow yourself to feel present in these sensations.', duration: 14 },
      { title: 'Focus on What You Hear', text: 'Next, focus on 3 things you can hear. It could be a distant sound, the air conditioning, or the sound of your own breath. Stay with these sounds and let them anchor you in the present.', duration: 12 },
      { title: 'Focus on What You Smell', text: 'Now, take a moment to notice 2 smells around you. It could be the air, a scent in the room, or something in your environment. Inhale gently and focus on the sensation of the smell. Notice how your body feels more grounded.', duration: 14 },
      { title: 'Focus on What You Taste', text: 'Finally, notice the taste in your mouth. Is it a lingering flavour from your last meal? Or perhaps the freshness of water? Focus on it and let it bring you into the present moment.', duration: 12 },
      { title: 'Reset Complete', text: 'You\'ve just grounded yourself in the present moment. Feel how much calmer and more focused you are. Reset complete.', duration: 8 }
    ]
  },
  {
    id: 'anxiety-calm-counting',
    emotionalState: 'anxiety',
    type: 'interactive',
    title: 'Counting Horizons',
    description: 'Count slowly with guided breathing',
    scienceBenefit: 'Activates prefrontal cortex, regulating anxiety',
    duration: 60,
    color: 'from-blue-400 to-indigo-500',
    interactiveType: 'counting',
    interactiveSteps: [
      { title: 'Counting Horizons', instruction: 'We\'ll count slowly together, using your breath as an anchor.', duration: 5 },
      { instruction: 'Count 1... breathe in slowly for 3', duration: 4, input: 'breath' },
      { instruction: 'Count 2... breathe out slowly for 3', duration: 4, input: 'breath' },
      { instruction: 'Count 3... breathe in deeply for 3', duration: 4, input: 'breath' },
      { instruction: 'Count 4... breathe out fully for 3', duration: 4, input: 'breath' },
      { instruction: 'Count 5... feel yourself calming', duration: 4, input: 'breath' },
      { instruction: 'Continue counting breaths up to 10...', duration: 24, count: 10, input: 'breath' },
      { title: 'Reset Complete', instruction: 'Your mind is calmer. Your anxiety has eased. Reset complete.', duration: 6 }
    ]
  },
  {
    id: 'anxiety-bubble-calm',
    emotionalState: 'anxiety',
    type: 'interactive',
    title: 'Bubble Pop Calm',
    description: 'Quick focus challenge to shift from anxiety',
    scienceBenefit: 'Cognitive distraction breaks anxious thought cycles',
    duration: 75,
    color: 'from-purple-500 to-indigo-600',
    interactiveType: 'bubble-tap',
    interactiveSteps: [
      { title: 'Bubble Pop Calm', instruction: 'This game will help you shift focus from anxiety to something light and engaging. You\'ll need to tap on the floating bubbles to clear them.', duration: 6 },
      { title: 'Tap the Bubbles', instruction: 'Bubbles will float across the screen. Tap to pop the bubbles before they float away. Each pop releases a small piece of tension.', duration: 8 },
      { title: 'Pop the Bubbles', instruction: 'Pop as many bubbles as you can in the next 50 seconds. The faster you tap, the more relaxed you\'ll feel. Keep the rhythm steady and notice the calm building.', input: 'tap', duration: 50 },
      { title: 'Reset Complete', instruction: 'You\'ve just focused your mind and released anxiety with this simple task. Take a moment to notice how much lighter you feel. Reset complete.', duration: 8 }
    ]
  },

  // ============ RESTLESS (4 resets) ============
  {
    id: 'restless-micro-movement',
    emotionalState: 'restless',
    type: 'story',
    title: 'Micro-Movement Reset',
    description: 'Channel restless energy with controlled movements',
    scienceBenefit: 'Somatic regulation through intentional movement',
    duration: 75,
    color: 'from-amber-400 to-orange-500',
    storyContent: [
      { title: 'The Micro-Movement Reset', text: 'When you feel restless, your body wants to move. Instead of fighting it, we\'re going to guide that energy in a controlled, calming way.', duration: 8 },
      { title: 'Hands', text: 'Spread your fingers wide for 3 seconds… Now bring them back in gently. Repeat this twice, slowly.', duration: 10 },
      { title: 'Forearms', text: 'Rotate your forearms slowly in circles. Three circles clockwise, then three anti-clockwise. Keep it slow and controlled.', duration: 12 },
      { title: 'Shoulders', text: 'Lift your shoulders slightly, then roll them back. Do this slowly for three gentle rolls. Feel some of the tension melt away.', duration: 12 },
      { title: 'Loosen the Restlessness', text: 'Now let your whole body relax. Let the small movements settle. Let stillness return naturally.', duration: 12 },
      { title: 'Reset Complete', text: 'Your body has released the restlessness. You should feel calmer and more centred. Reset complete.', duration: 8 }
    ]
  },
  {
    id: 'restless-mind-focusing',
    emotionalState: 'restless',
    type: 'story',
    title: 'Mind Focusing Path',
    description: 'Direct your attention to calm restless energy',
    scienceBenefit: 'Single-focus attention reduces restlessness',
    duration: 60,
    color: 'from-amber-400 to-orange-500',
    storyContent: [
      { title: 'Mind Focusing Path', text: 'This reset will focus your attention in a single direction to calm your mind. Look at the screen and follow each step.', duration: 7 },
      { title: 'Choose Your Point', text: 'Choose a fixed point on the screen — a corner, a shape, or a dot. Keep your eyes gently focused on it.', duration: 8 },
      { title: 'Breathe Steadily', text: 'Take a slow breath in for 3… And out for 4… Keep your focus on that single point.', duration: 10 },
      { title: 'Trace the Path', text: 'Now slowly move your eyes in a simple path on the screen. Down… across… up… back across. Do this twice more. Let the path guide your focus.', duration: 15 },
      { title: 'Let It Settle', text: 'Bring your eyes back to the original point. Stay here for one slow breath in, and one slow breath out.', duration: 10 },
      { title: 'Reset Complete', text: 'Your focus is steadier, and the restlessness has eased. Reset complete.', duration: 7 }
    ]
  },
  {
    id: 'restless-tap-rhythm',
    emotionalState: 'restless',
    type: 'interactive',
    title: 'Tap Rhythm Sync',
    description: 'Follow rhythmic patterns to calm energy',
    scienceBenefit: 'Bilateral stimulation regulates nervous system',
    duration: 90,
    color: 'from-yellow-400 to-amber-500',
    interactiveType: 'rhythm-tap',
    interactiveSteps: [
      { title: 'Tap Rhythm Sync', instruction: 'You\'ll see a simple rhythm pattern appear on-screen. Tap the screen in time with the rhythm. Let the rhythm calm the restlessness.', duration: 7 },
      { title: 'Follow the Beat', instruction: 'Tap left… tap right… Tap left… tap right… Match the on-screen indicators as they appear.', input: 'tap', duration: 15 },
      { title: 'Keep the Rhythm', instruction: 'The rhythm will get slightly faster. Stay with it — tap left, tap right, tap left, tap right. Let the steady pattern settle your energy.', input: 'tap', duration: 20 },
      { title: 'Slow Down', instruction: 'The rhythm will now slow. Follow it all the way down until it stops. Your mind follows the rhythm. Your body follows the calm.', input: 'tap', duration: 30 },
      { title: 'Reset Complete', instruction: 'Your nervous system has synced with the slower rhythm. Restlessness should feel reduced. Reset complete.', duration: 8 }
    ]
  },
  {
    id: 'restless-focus-grid',
    emotionalState: 'restless',
    type: 'interactive',
    title: 'Focus Grid Breaker',
    description: 'Quick tapping game to channel fidgeting',
    scienceBenefit: 'Cognitive redirect reduces restless energy',
    duration: 90,
    color: 'from-lime-400 to-green-500',
    interactiveType: 'grid-tap',
    interactiveSteps: [
      { title: 'Focus Grid Breaker', instruction: 'You\'ll see a grid of circles. One circle will light up at a time. Tap the lit circle as quickly as you can.', duration: 7 },
      { title: 'Quick Taps', instruction: 'A circle will glow. Tap it. Another one will glow. Tap that too. Stay focused. Keep tapping.', input: 'tap', duration: 20 },
      { title: 'Faster Lights', instruction: 'The glowing circles will now appear faster. Tap them as they show up. Feel your mind becoming fully focused.', input: 'tap', duration: 25 },
      { title: 'Final Focus Push', instruction: 'One last quick burst — Tap the final few circles as they appear. Almost there.', input: 'tap', duration: 20 },
      { title: 'Reset Complete', instruction: 'You\'ve channelled your restless energy into focused action. Feel the calm that follows. Reset complete.', duration: 8 }
    ]
  },

  // ============ OVERWHELMED (4 resets) ============
  {
    id: 'overwhelmed-one-thing',
    emotionalState: 'overwhelmed',
    type: 'story',
    title: 'The One-Thing Horizon',
    description: 'Focus on just one thing to reduce overwhelm',
    scienceBenefit: 'Narrowing attention reduces cognitive load',
    duration: 60,
    color: 'from-indigo-400 to-purple-500',
    storyContent: [
      { title: 'The One-Thing Horizon', text: 'When everything feels like too much, your mind is trying to hold hundreds of things at once. This reset brings you back to one.', duration: 8 },
      { title: 'Pick an Anchor', text: 'Look around and choose a single object near you — your phone, a light, a cup, anything. This will be your focus point.', duration: 10 },
      { title: 'Anchor In', text: 'Look at your object. Take a slow breath in for 3… And out for 4… Hold your attention there.', duration: 10 },
      { title: 'Simple Details', text: 'Silently describe one detail you can see — a colour, a shape, a texture. That\'s all you need to focus on.', duration: 10 },
      { title: 'Reduce the Noise', text: 'Anything you were worrying about can wait. Right now, there is only this one thing.', duration: 10 },
      { title: 'Reset Complete', text: 'Your mind has shifted from everything to one thing. Overwhelm should feel lighter. Reset complete.', duration: 8 }
    ]
  },
  {
    id: 'overwhelmed-shortest-path',
    emotionalState: 'overwhelmed',
    type: 'story',
    title: 'The Shortest Path Home',
    description: 'Quick grounding to signal safety',
    scienceBenefit: 'Visual orientation regulates nervous system',
    duration: 90,
    color: 'from-indigo-400 to-purple-500',
    storyContent: [
      { title: 'The Shortest Path Home', text: 'When you feel overwhelmed, your body needs one message: You are safe. We\'ll guide your nervous system back there now.', duration: 8 },
      { title: 'Look Around', text: 'Gently look left, then right. Let your eyes scan the space around you. This signals to your brain that there is no immediate threat.', duration: 12 },
      { title: 'Breath Reset', text: 'Inhale for 3… Hold for 1… Exhale for 5… Do this twice more.', duration: 15 },
      { title: 'Feel the Ground', text: 'Notice how your body is supported. Your feet, your back, your hands. Feel the weight of your body being held.', duration: 14 },
      { title: 'Bring It Back', text: 'Now bring your eyes to one point on your screen. Breathe once more, slowly.', duration: 12 },
      { title: 'Reset Complete', text: 'Your nervous system has softened. Overwhelm fades as your body returns to safety. Reset complete.', duration: 10 }
    ]
  },
  {
    id: 'overwhelmed-thought-sorter',
    emotionalState: 'overwhelmed',
    type: 'interactive',
    title: 'Thought Sorter',
    description: 'Sort bubbles to organize your mind',
    scienceBenefit: 'Categorization reduces perceived chaos',
    duration: 90,
    color: 'from-blue-400 to-cyan-500',
    interactiveType: 'swipe-sort',
    interactiveSteps: [
      { title: 'Thought Sorter', instruction: 'You\'ll sort bubbles on screen into two simple categories. This helps your brain feel clearer and more organised.', duration: 7 },
      { title: 'Simple Choices', instruction: 'Choose two categories, like: "Now" vs "Later" • "Important" vs "Not Important" • "Work" vs "Life". Your choice.', duration: 10 },
      { title: 'Drag to Sort', instruction: 'Bubbles will appear on the screen with simple words on them. Drag each bubble to one of your two categories.', input: 'tap', duration: 20 },
      { title: 'Keep Going', instruction: 'The bubbles come a little faster now. Trust your instinct. Just place them where they feel right.', input: 'tap', duration: 20 },
      { title: 'Last Few', instruction: 'Just a few more bubbles. Sort them into place — almost done.', input: 'tap', duration: 15 },
      { title: 'Reset Complete', instruction: 'You\'ve turned overwhelm into order. Your brain should feel clearer and lighter. Reset complete.', duration: 8 }
    ]
  },
  {
    id: 'overwhelmed-pressure-valve',
    emotionalState: 'overwhelmed',
    type: 'interactive',
    title: 'The Pressure Valve',
    description: 'Release tension with visual feedback',
    scienceBenefit: 'Isometric tensing reduces stress hormones',
    duration: 75,
    color: 'from-purple-500 to-pink-500',
    interactiveType: 'pressure-valve',
    interactiveSteps: [
      { title: 'The Pressure Valve', instruction: 'You\'ll release overwhelm through small, controlled muscle squeezes. As you do, the on-screen bar will show your pressure releasing.', duration: 7 },
      { title: 'Hands First', instruction: 'Gently squeeze your hands into fists for 2 seconds. Release slowly. Watch the bar drop.', duration: 8 },
      { title: 'Shoulder Release', instruction: 'Lift your shoulders slightly, hold for 2… and release. The pressure bar drops again.', duration: 10 },
      { title: 'Soften the Jaw', instruction: 'Gently clench your jaw for 2 seconds… Then soften it completely. The bar falls once more.', duration: 10 },
      { title: 'Full-Body Ease', instruction: 'Take one slow breath. Visualise the bar emptying as your body softens.', duration: 12 },
      { title: 'Reset Complete', instruction: 'Your physical tension has eased, and your overwhelm has loosened its grip. Reset complete.', duration: 10 }
    ]
  },

  // ============ TIRED (4 resets) ============
  {
    id: 'tired-two-minute-reboot',
    emotionalState: 'tired',
    type: 'story',
    title: 'The Two-Minute Reboot',
    description: 'Quick sensory activation for alertness',
    scienceBenefit: 'Stimulates reticular activating system',
    duration: 90,
    color: 'from-blue-400 to-cyan-500',
    storyContent: [
      { title: 'The Two-Minute Reboot', text: 'When you feel tired, your senses go into low power mode. This reset gently switches them back online.', duration: 8 },
      { title: 'Look Around', text: 'Turn your head slightly and look around your environment. Notice three things that catch your eye. Anything.', duration: 12 },
      { title: 'Small Adjustment', text: 'Straighten your back just a little. Open your chest. Let your body shift into a more alert position.', duration: 12 },
      { title: 'Breath Lift', text: 'Inhale for 2 seconds… Exhale for 2 seconds… Repeat twice. This breath pattern gently increases alertness.', duration: 14 },
      { title: 'Wake Up Your Mind', text: 'Focus on one detail on your screen right now. Hold your attention on it for three seconds. That\'s it.', duration: 12 },
      { title: 'Reset Complete', text: 'Your senses are sharper, your posture is lifted, and your mind is more awake. Reset complete.', duration: 10 }
    ]
  },
  {
    id: 'tired-slow-rise',
    emotionalState: 'tired',
    type: 'story',
    title: 'The Slow Rise Story',
    description: 'Gentle cognitive activation',
    scienceBenefit: 'Gradual mental ramping increases wakefulness',
    duration: 90,
    color: 'from-blue-400 to-cyan-500',
    storyContent: [
      { title: 'The Slow Rise Story', text: 'Fatigue makes your mind feel foggy and slow. This reset wakes you up gradually, without forcing it.', duration: 8 },
      { title: 'Notice the Space', text: 'Look around your environment. Find one thing that\'s bright or contrasting. Hold your attention there.', duration: 12 },
      { title: 'Small Motion', text: 'Roll your shoulders gently, once forward, once back. Tiny movements signal your body to reactivate.', duration: 10 },
      { title: 'Simple Thinking Task', text: 'Name silently: One sound you hear • One thing you can see • One thing you can touch. This shifts your brain out of fog mode.', duration: 16 },
      { title: 'One Energising Breath', text: 'Inhale for 3… Exhale for 2… Repeat once.', duration: 12 },
      { title: 'Reset Complete', text: 'Your mind has risen gently from tiredness into clarity. Reset complete.', duration: 10 }
    ]
  },
  {
    id: 'tired-tap-to-wake',
    emotionalState: 'tired',
    type: 'interactive',
    title: 'Tap to Wake',
    description: 'Rhythmic tapping for alertness',
    scienceBenefit: 'Activates motor circuits and mental alertness',
    duration: 90,
    color: 'from-orange-400 to-red-400',
    interactiveType: 'rhythm-tap',
    interactiveSteps: [
      { title: 'Tap to Wake', instruction: 'You\'ll tap the screen in simple rhythms. This activates the brain areas linked to attention and alertness.', duration: 7 },
      { title: 'Slow Start', instruction: 'Tap the circle on screen once every second. A soft pulse guides you.', input: 'tap', duration: 12 },
      { title: 'Pick Up the Rhythm', instruction: 'The circle now glows slightly faster. Tap to match the new pace.', input: 'tap', duration: 15 },
      { title: 'Short Activation', instruction: 'For 5 seconds, tap as quickly as you comfortably can. This gives your brain a fast energy spike.', input: 'tap', duration: 15 },
      { title: 'Settle the Rhythm', instruction: 'The circle slows again. Match the steady pulse for a few more taps.', input: 'tap', duration: 20 },
      { title: 'Reset Complete', instruction: 'Your brain should feel more awake and alert. Reset complete.', duration: 8 }
    ]
  },
  {
    id: 'tired-blink-breaker',
    emotionalState: 'tired',
    type: 'interactive',
    title: 'Blink Breaker',
    description: 'Visual stimulation to boost wakefulness',
    scienceBenefit: 'Blink rate increases dopamine and alertness',
    duration: 60,
    color: 'from-green-400 to-teal-500',
    interactiveType: 'blink-track',
    interactiveSteps: [
      { title: 'Blink Breaker', instruction: 'This reset uses visual focus and blinking patterns to wake up your eyes and mind.', duration: 6 },
      { title: 'Hold the Spot', instruction: 'A circle appears in the centre of your screen. Look directly at it for three seconds.', duration: 8 },
      { title: 'Fast Blinks', instruction: 'Blink quickly 5 times while keeping your eyes on the circle. This refreshes your visual system.', duration: 10 },
      { title: 'Follow It', instruction: 'The circle now moves slowly around the screen. Follow it with your eyes.', input: 'tap', duration: 15 },
      { title: 'Sharpen In', instruction: 'The circle returns to the centre. Hold your gaze steady for 2 seconds.', duration: 8 },
      { title: 'Reset Complete', instruction: 'Your eyes and mind are refreshed, and the fatigue should feel lighter. Reset complete.', duration: 8 }
    ]
  },

  // ============ SCATTERED (4 resets) ============
  {
    id: 'scattered-one-thing-anchor',
    emotionalState: 'scattered',
    type: 'story',
    title: 'The One-Thing Anchor',
    description: 'Narrow attention to regain focus',
    scienceBenefit: 'Single-stimulus focus reduces mental overload',
    duration: 75,
    color: 'from-green-400 to-teal-500',
    storyContent: [
      { title: 'The One-Thing Anchor', text: 'When your mind feels scattered, focusing on one simple thing helps pull everything back together. We\'ll anchor your attention in a calm, steady way.', duration: 10 },
      { title: 'Pick One Point', text: 'Look at one point on your screen. Any point. Hold your focus there.', duration: 10 },
      { title: 'Match the Moment', text: 'Inhale gently for 3 seconds… Exhale for 3 seconds… Keep your eyes on your chosen point.', duration: 12 },
      { title: 'The Quietening', text: 'Imagine your thoughts moving behind the anchor point, like they\'re fading into the background. Let each breath make the point feel steadier.', duration: 15 },
      { title: 'Reset Complete', text: 'Your attention has narrowed and your mind is calmer. Reset complete.', duration: 10 }
    ]
  },
  {
    id: 'scattered-thought-path',
    emotionalState: 'scattered',
    type: 'story',
    title: 'The Thought Path',
    description: 'Organize scattered thoughts with sequencing',
    scienceBenefit: 'Sequencing reduces mental fragmentation',
    duration: 60,
    color: 'from-green-400 to-teal-500',
    storyContent: [
      { title: 'The Thought Path', text: 'A scattered mind usually means your thoughts are jumping around. We\'ll straighten the path with a simple ordering reset.', duration: 8 },
      { title: 'Look Around', text: 'Look around your space and silently pick three objects you can see. Just notice them.', duration: 10 },
      { title: 'Order Them', text: 'Now mentally arrange those three objects in a simple order: First… Second… Third.', duration: 12 },
      { title: 'Walk the Path', text: 'Now repeat the order once more in your mind. This helps your brain shift from scattered to structured.', duration: 12 },
      { title: 'Reset Complete', text: 'Your mind has a clearer path and your thoughts feel more organised. Reset complete.', duration: 8 }
    ]
  },
  {
    id: 'scattered-dot-connect',
    emotionalState: 'scattered',
    type: 'interactive',
    title: 'Dot Connect',
    description: 'Connect dots to strengthen focus',
    scienceBenefit: 'Sequential tasks improve attentional switching',
    duration: 90,
    color: 'from-cyan-400 to-blue-500',
    interactiveType: 'dot-connect',
    interactiveSteps: [
      { title: 'Dot Connect', instruction: 'You\'ll connect dots on your screen in the correct order. This helps your mind shift from scattered to focused.', duration: 7 },
      { title: 'Begin', instruction: 'Tap dot number 1. A glow will show you where to go next.', input: 'tap', duration: 10 },
      { title: 'Keep Connecting', instruction: 'Tap the dots in order: 1… 2… 3… and so on. Let the sequence guide your attention.', input: 'tap', duration: 40 },
      { title: 'One Last Tap', instruction: 'Tap the final dot in the sequence. Feel your focus narrow and settle.', input: 'tap', duration: 15 },
      { title: 'Reset Complete', instruction: 'Your mind has shifted from scattered to centred. Reset complete.', duration: 8 }
    ]
  },
  {
    id: 'scattered-swipe-sort',
    emotionalState: 'scattered',
    type: 'interactive',
    title: 'Swipe to Sort',
    description: 'Categorize tasks to clear mental clutter',
    scienceBenefit: 'Quick sorting activates executive processes',
    duration: 75,
    color: 'from-purple-400 to-indigo-500',
    interactiveType: 'swipe-sort',
    interactiveSteps: [
      { title: 'Swipe to Sort', instruction: 'You\'ll see simple words appear on your screen. Swipe them left or right based on whether they feel "Important Now" or "Later".', duration: 8 },
      { title: 'First Words', instruction: 'A word appears. Swipe it left for "Later" or right for "Important Now". Trust your instinct.', input: 'tap', duration: 15 },
      { title: 'Keep Going', instruction: 'More words now—keep swiping. Your brain is organising itself as you go.', input: 'tap', duration: 25 },
      { title: 'Last Swipe', instruction: 'Here\'s your last word. Swipe it where it belongs.', input: 'tap', duration: 12 },
      { title: 'Reset Complete', instruction: 'Your brain has sorted and simplified. You should feel clearer and more focused. Reset complete.', duration: 8 }
    ]
  },

  // ============ ENERGY TO BURN (4 resets) ============
  {
    id: 'energy-micro-workout',
    emotionalState: 'energy',
    type: 'interactive',
    title: '3-Minute Micro-Workout',
    description: 'Quick full-body movements to burn excess energy',
    scienceBenefit: 'High-intensity movement rapidly reduces restlessness',
    duration: 180,
    color: 'from-red-500 to-orange-600',
    interactiveType: 'movement-workout',
    requiresDisclaimer: true,
    interactiveSteps: [
      { title: '3-Minute Micro-Workout', instruction: 'This quick workout will help you burn that extra energy. We\'ll start with stretches, then move into energizing exercises. Follow the visuals and move at your own pace.', duration: 8, isStretch: false },
      
      // Stretch section (compulsory)
      { title: 'Stretch: Neck Rolls', instruction: 'SETUP: Stand tall with feet hip-width apart, shoulders relaxed down away from ears. EXECUTION: Drop your chin gently to chest, then slowly roll your head to the right shoulder, back, left shoulder, and forward in a smooth circle—that is 1 rep. Do 3 slow circles clockwise. Pause at center, then reverse: 3 circles counterclockwise. BREATHING: Inhale through nose as you roll backward, exhale through mouth as you come forward. FOCUS: Move slowly—no rushing. Feel the gentle stretch in your neck muscles. COMMON MISTAKE: Jerking or forcing the movement (keep it smooth and controlled). PURPOSE: Releases neck tension and increases blood flow before movement.', duration: 15, input: 'movement', isStretch: true },
      { title: 'Stretch: Arm Circles', instruction: 'SETUP: Stand with feet shoulder-width apart, core engaged. Extend both arms straight out to sides at shoulder height, palms facing down. EXECUTION: Make large, controlled circles with your arms—forward 5 times (think drawing big hoops), then reverse direction and circle backward 5 times. BREATHING: Breathe naturally and steadily—do not hold your breath. FORM CUES: Keep shoulders down (not hunched), arms straight but elbows soft (not locked). Engage your core to stabilize. SENSATION: You should feel warmth building in your shoulders and upper back. COMMON MISTAKE: Tiny circles (go big!), tense shoulders (stay relaxed). PURPOSE: Mobilizes shoulder joints and warms up upper body.', duration: 15, input: 'movement', isStretch: true },
      { title: 'Stretch: Torso Twists', instruction: 'SETUP: Stand with feet hip-width apart, knees soft (slight bend), hands on hips or arms hanging loose. EXECUTION: Keep hips facing forward (stable base), twist your torso to the right as far as comfortable, letting arms swing naturally. Return to center. Twist to the left. That is 1 rep each side—do 6 reps per side. BREATHING: Exhale as you twist, inhale as you return to center. FORM CUES: Rotate from your waist, not your hips. Keep core engaged. Shoulders stay level (no tilting). FEEL: Gentle stretch through obliques and lower back. COMMON MISTAKE: Forcing the twist (move within your comfortable range), twisting from hips instead of waist. PURPOSE: Warms up your spine and core for rotation movements.', duration: 15, input: 'movement', isStretch: true },
      
      // Main workout
      { title: 'Jumping Jacks', instruction: 'SETUP: Stand tall, feet together, arms at sides. CHECK: You need enough space to jump and spread arms overhead. EXECUTION: (1) Jump while simultaneously spreading feet wider than shoulder-width and raising both arms overhead in a Y-shape. (2) Land softly on balls of feet with knees slightly bent—absorb the impact! (3) Jump again, returning feet together and bringing arms back to sides. TARGET: Do 15-20 reps in 30 seconds. BREATHING: Inhale as you jump OUT (feet wide, arms up), exhale as you jump IN (feet together, arms down). Keep steady rhythm—do not hold breath. FORM FOCUS: Land softly every time. Engage core to protect lower back. Shoulders relaxed, not hunched up. COMMON MISTAKES: Landing with locked knees (dangerous!), holding breath, jumping too fast and losing control. SAFETY: If you feel dizzy, slow down or stop. MODIFICATION: Step side-to-side instead of jumping, still raising arms overhead with each step.', duration: 30, input: 'movement', visualAid: '/movement/jumping-jacks.png', alternativeMove: 'Step side-to-side instead of jumping, raising arms with each step' },
      { title: 'High Knees', instruction: 'SETUP: Stand tall, feet hip-width apart, arms bent at 90 degrees at sides. EXECUTION: Run in place, lifting each knee up toward chest height (aim for waist level). Alternate knees rapidly. Pump arms vigorously in running motion—opposite arm to opposite knee. BREATHING: Quick, natural breaths matching your pace. Do not hold breath. TEMPO: Quick pace—aim for 40-50 knee lifts total (20-25 per leg) in 20 seconds. FORM CUES: Stay on balls of feet (light, bouncy). Engage core for stability. Keep chest up and shoulders back. Drive knees UP, not just forward. FEEL: Heart rate rising, legs working hard. COMMON MISTAKES: Leaning too far forward (stay upright), lifting knees barely off ground (get them HIGH), dragging feet. SAFETY: Land lightly—protect your knees. MODIFICATION: March in place at your own pace, focus on controlled knee lifts rather than speed.', duration: 20, input: 'movement', alternativeMove: 'March in place at moderate pace with controlled knee lifts' },
      { title: 'Bodyweight Squats', instruction: 'SETUP: Stand with feet shoulder-width to slightly wider, toes pointing slightly outward (10-15 degrees). Arms extended forward for balance or hands on hips. EXECUTION: (1) INHALE and push hips back like sitting in a chair. (2) Lower down until thighs are parallel to floor (or as low as comfortable). Knees track over toes. (3) EXHALE and drive through heels to stand back up, squeezing glutes at top. Do 10 controlled reps. BREATHING: Inhale on the way down, exhale as you push up. FORM CHECKPOINTS: Chest up (do not round forward). Knees stay behind toes. Weight in heels, not toes. Core engaged throughout. Neutral spine—no arching or rounding. FEEL: Quads, glutes, and hamstrings working. COMMON MISTAKES: Knees caving inward (push them OUT), rounding lower back (keep chest proud), rising onto toes (weight in heels!). SAFETY: Only go as low as comfortable. Stop if you feel knee or back pain. MODIFICATION: Hold onto a chair or wall for balance. Reduce depth if needed—partial squats are still effective.', duration: 25, input: 'movement', visualAid: '/movement/squats.png', alternativeMove: 'Hold onto chair for balance, reduce squat depth to comfort level' },
      { title: 'Arm Pulses', instruction: 'SETUP: Stand with feet hip-width apart, core engaged. Extend both arms straight forward at shoulder height, palms facing down. EXECUTION: Make small, rapid up-and-down pulses with straight arms—move only 3-4 inches up and down. Keep arms extended (do not bend elbows). Pulse continuously for 20 seconds. BREATHING: Breathe naturally and steadily—resist urge to hold breath. FORM CUES: Shoulders stay down and back (not hunched). Arms parallel to ground. Core tight to support position. Fingers pointed forward, palms flat. SENSATION: Burning in shoulders and upper back—this is working! COMMON MISTAKES: Bending elbows (keep straight), letting arms drop (maintain height), holding breath, shrugging shoulders up. PURPOSE: Builds shoulder endurance and stability. Push through the burn!', duration: 20, input: 'movement' },
      { title: 'Rest & Breathe', instruction: 'RECOVERY TIME: Stand or walk slowly in place. Let your arms hang loose. BREATHING TECHNIQUE: Slow, controlled breaths. (1) Inhale deeply through nose for 3 counts—feel belly expand. (2) Hold briefly. (3) Exhale fully through mouth for 3 counts—empty the lungs. Repeat 3 times. FOCUS: Notice your heartbeat slowing. Feel your muscles recovering. This brief rest prepares you for the final exercise. Shake out arms and legs gently. Roll shoulders back. You are doing great!', duration: 10, input: 'breath' },
      { title: 'Burpees (Modified)', instruction: 'SETUP: Stand with feet shoulder-width apart. EXECUTION: (1) Bend knees and place hands on floor in front of feet. (2) Step right foot back, then left foot back into plank position (hands under shoulders, body straight). (3) Hold plank 1 second. (4) Step right foot forward, then left foot forward back to squat. (5) Stand up and reach arms overhead. That is 1 rep—do 5 total. BREATHING: Exhale as you step back, inhale in plank, exhale as you step forward, inhale as you reach up. TEMPO: Controlled, not rushed. Quality over speed. FORM FOCUS: Plank should be a straight line (engage core, do not sag hips). Land feet firmly when stepping. Controlled movements throughout. COMMON MISTAKES: Sagging hips in plank, rushing through reps, forgetting to breathe. SAFETY: This is challenging! Take breaks between reps if needed. MODIFICATION: Skip the plank entirely—just squat down, touch floor, stand up and reach overhead.', duration: 25, input: 'movement', alternativeMove: 'Squat down, touch floor, stand up and reach overhead—skip the plank step entirely' },
      { title: 'Cool Down', instruction: 'Shake out your arms and legs. Take 3 deep breaths. Notice how alive your body feels.', duration: 10, input: 'movement' },
      { title: 'Reset Complete', instruction: 'You\'ve burned that excess energy. Your body feels lighter and your mind clearer. Reset complete.', duration: 7 }
    ]
  },
  {
    id: 'energy-shadowboxing',
    emotionalState: 'energy',
    type: 'interactive',
    title: 'Quick Shadowboxing',
    description: 'Channel energy through boxing movements',
    scienceBenefit: 'Explosive movement releases tension and improves focus',
    duration: 150,
    color: 'from-orange-500 to-red-500',
    interactiveType: 'shadowboxing',
    requiresDisclaimer: true,
    interactiveSteps: [
      { title: 'Quick Shadowboxing', instruction: 'Release your energy through controlled punches and movements. We\'ll stretch first, then get into the flow. No equipment needed.', duration: 7, isStretch: false },
      
      // Stretch section
      { title: 'Stretch: Shoulder Rolls', instruction: 'SETUP: Stand with feet hip-width apart, arms hanging loose at sides. EXECUTION: Lift shoulders up toward ears, roll them BACK and DOWN in a smooth circle. Do 5 rolls backward. Then reverse: roll shoulders UP, FORWARD, and DOWN for 5 rolls forward. BREATHING: Inhale as shoulders rise, exhale as they roll down. FOCUS: Slow, controlled circles. Feel tension releasing from shoulders and upper back. COMMON MISTAKE: Rushing the movement—take your time. PURPOSE: Loosens shoulder joints and upper traps before punching movements.', duration: 12, input: 'movement', isStretch: true },
      { title: 'Stretch: Wrist Circles', instruction: 'SETUP: Make loose fists with both hands, arms extended forward. EXECUTION: Rotate wrists in circles—5 circles clockwise, then 5 circles counterclockwise. Move slowly and feel full range of motion. BREATHING: Breathe naturally. FOCUS: Your wrists need to be warmed up for punching. Move through full circles. COMMON MISTAKE: Tiny movements (make full circles). PURPOSE: Prevents wrist strain during punching. This protects your joints.', duration: 12, input: 'movement', isStretch: true },
      { title: 'Stretch: Hip Circles', instruction: 'SETUP: Feet shoulder-width apart, hands on hips, knees soft. EXECUTION: Keep feet planted and circle your hips smoothly—3 slow circles clockwise (imagine drawing a circle with your hips). Then reverse: 3 circles counterclockwise. BREATHING: Breathe steadily. FOCUS: Loosen up your lower back and hips. Feel the rotation. COMMON MISTAKE: Moving upper body instead of hips (isolate the movement). PURPOSE: Warms up your core rotation for powerful punches.', duration: 12, input: 'movement', isStretch: true },
      
      // Boxing movements
      { title: 'Stance', instruction: 'SETUP: Stand with feet shoulder-width apart. If right-handed, step left foot slightly forward (southpaw? reverse this). POSITION: Knees slightly bent for mobility. Weight evenly distributed, slightly on balls of feet. Raise both fists to chin level, elbows tucked in protecting ribs. Non-dominant hand (lead) slightly forward, dominant hand (rear) by cheek. BREATHING: Natural, steady breaths. FORM FOCUS: Chin slightly down (protect it). Shoulders relaxed but ready. Core engaged. Stay light on your feet. FEEL: Athletic, ready to move. This is your home base—return here after every punch. PURPOSE: Proper stance gives you balance, power, and protection.', duration: 10, input: 'movement', visualAid: '/movement/boxing-stance.png' },
      { title: 'Jab Practice', instruction: 'FROM STANCE: Lead hand (front hand) at chin. EXECUTION: Snap your lead hand straight forward, rotating fist so palm faces down at full extension. Immediately snap it back to guard position. Do 20 quick jabs. BREATHING: Exhale sharply with each jab (breathe out as you punch). FORM CUES: Punch straight, not looping. Shoulder comes up slightly to protect chin. Other hand stays at guard. Rotate from shoulder, extend arm fully. Snap back fast—guard up! TEMPO: Quick and snappy, not slow. COMMON MISTAKES: Dropping guard hand, telegraphing (winding up), pushing instead of snapping. FEEL: This is your fastest punch—use it!', duration: 20, input: 'movement', visualAid: '/movement/jab.png' },
      { title: 'Cross Punches', instruction: 'FROM STANCE: Rear hand (back hand) by cheek. EXECUTION: Throw your rear hand straight across your body toward target. Rotate hips and shoulders for power—pivot rear foot, heel lifts off ground. Extend arm fully, rotating fist palm-down. Snap back to guard. Do 15 crosses. BREATHING: Explosive exhale with each cross. FORM FOCUS: Power comes from rotation, not just arm. Keep front hand up (guard!). Drive from back foot. Full hip rotation. Chin stays protected. TEMPO: Powerful but controlled. COMMON MISTAKES: Not rotating hips (losing power), dropping lead hand, overextending and losing balance. FEEL: This is your power punch!', duration: 18, input: 'movement', visualAid: '/movement/cross-punch.png' },
      { title: 'Jab-Cross Combo', instruction: 'NOW COMBINE: Put jab and cross together. FROM STANCE: (1) Snap lead hand jab straight out. (2) Immediately follow with rear cross, rotating hips. (3) Both hands return to guard. That is 1 combo—do 10 total. BREATHING: Sharp exhale on EACH punch (two breaths per combo). RHYTHM: Jab-Cross, Jab-Cross. Find your rhythm. FORM FOCUS: Stay balanced. Reset to stance between combos. Lead hand up while throwing cross. Move as one fluid motion. FOOTWORK: Stay light on balls of feet, small bounce. COMMON MISTAKES: Rushing (take your time), forgetting to breathe, dropping guard between punches. FEEL: This is fundamental boxing—the most important combination. Flow!', duration: 20, input: 'movement' },
      { title: 'Hooks', instruction: 'SETUP: Return to stance. LEAD HOOK: Keep elbow bent 90 degrees, rotate from waist and shoulders, swing arm in horizontal arc at shoulder level. Pivot front foot. Do 10 lead hooks. REAR HOOK: Same motion with rear hand, pivot back foot, full hip rotation. Do 10 rear hooks. BREATHING: Exhale with each hook. FORM CUES: Elbow stays bent (not straight). Hook comes from rotation, not arm swing. Keep other hand at guard. Chin protected. Weight shifts into the punch. TEMPO: Controlled power. COMMON MISTAKES: Swinging wildly (use technique), telegraphing, dropping hands. FEEL: Rotating your entire body—hooks hit from the side! This builds core strength.', duration: 20, input: 'movement' },
      { title: 'Speed Round', instruction: 'FINAL PUSH: For 15 seconds, throw ANY punches as fast as you can. Mix jabs, crosses, hooks—whatever feels good! FOCUS: Speed and volume. Let your energy OUT! BREATHING: Quick, sharp exhales with every punch. FORM: Try to maintain technique even at speed, but intensity is the priority here. Stay on your toes. Move your feet. Imagine hitting targets. SAFETY: Stay controlled—do not hyperextend or hurt yourself. PURPOSE: Cardiovascular spike and energy release. This is your explosive finish—give it everything! You got this!', duration: 15, input: 'movement' },
      { title: 'Cool Down', instruction: 'RELEASE: Drop your hands to sides. Shake out both arms vigorously—let go of tension. SHOULDERS: Roll shoulders backward slowly 3 times. BREATHING: Take one deep breath IN through nose (fill lungs)... Hold 2 seconds... Exhale fully through mouth (release everything). Repeat 2 more times. NOTICE: Your heart rate, the warmth in your muscles, the energy coursing through you. Well done, fighter. You channeled that restless energy perfectly.', duration: 12, input: 'movement' },
      { title: 'Reset Complete', instruction: 'You\'ve channeled that energy into focused power. Feel the satisfaction. Reset complete.', duration: 7 }
    ]
  },
  {
    id: 'energy-breath-movement',
    emotionalState: 'energy',
    type: 'interactive',
    title: 'Breath-Plus-Movement',
    description: 'Synchronized breathing with dynamic stretches',
    scienceBenefit: 'Combines cardio with breath control for balanced energy release',
    duration: 120,
    color: 'from-amber-500 to-orange-500',
    interactiveType: 'breath-movement',
    requiresDisclaimer: true,
    interactiveSteps: [
      { title: 'Breath-Plus-Movement', instruction: 'We\'ll move your body while controlling your breath. This balances physical energy with mental calm. Gentle stretches first.', duration: 8, isStretch: false },
      
      // Stretch section
      { title: 'Stretch: Standing Side Bend', instruction: 'SETUP: Stand with feet hip-width apart, arms at sides. EXECUTION: (1) Reach RIGHT arm straight up overhead, palm facing in. (2) Gently bend upper body to the LEFT, creating a side curve. Hold stretch 5 seconds—breathe into right side ribs. (3) Return to center, lower arm. (4) Repeat on opposite side: LEFT arm up, bend RIGHT. Do 2 full cycles (total 4 bends). BREATHING: Inhale as you reach up, exhale as you bend, breathe steadily during hold. FORM FOCUS: Do not lean forward or back—pure side bend. Keep hips stable. Engage core gently. FEEL: Stretch along entire side of torso from hip to armpit. COMMON MISTAKE: Bending forward instead of sideways. PURPOSE: Opens up side body and prepares for dynamic movement.', duration: 15, input: 'movement', isStretch: true, visualAid: '/movement/side-bend.png' },
      { title: 'Stretch: Forward Fold', instruction: 'SETUP: Stand with feet hip-width apart, knees soft (slightly bent). EXECUTION: (1) Hinge forward at hips, letting your torso fold down. (2) Let arms and head hang heavy toward floor—surrender to gravity. (3) Hold 8 seconds. Relax completely. BREATHING: Exhale as you fold down, breathe naturally during hold. Each exhale, relax deeper. FORM CUES: Bend knees generously if hamstrings are tight. Do not force it. Let gravity do the work. Relax neck, jaw, shoulders. FEEL: Gentle stretch in hamstrings and lower back. Blood flowing to head. COMMON MISTAKE: Locking knees (keep them soft!), forcing stretch. SAFETY: To come up, bend knees more and roll up slowly vertebra by vertebra. PURPOSE: Releases lower back tension and calms nervous system.', duration: 12, input: 'movement', isStretch: true },
      
      // Breath + movement
      { title: 'Reach & Squat', instruction: 'SETUP: Stand with feet shoulder-width apart. MOVEMENT PATTERN: (1) INHALE: Reach both arms straight up overhead—stretch tall toward ceiling. (2) EXHALE: Push hips back and lower into squat, bringing arms forward for balance. (3) INHALE: Press through heels, stand up, reach arms overhead again. Do 8 total reps. BREATHING IS KEY: Your breath powers the movement. INHALE = reach up (expand), EXHALE = squat down (contract). Never hold breath. FORM FOCUS: Full breath with each rep. Chest up in squat. Weight in heels. Core engaged. TEMPO: Smooth and rhythmic—match your natural breath pace. FEEL: Energy moving through your body, breath and movement becoming one. COMMON MISTAKES: Rushing the breath, forgetting to sync movement with breath. PURPOSE: Synchronizes breath with dynamic movement for energy balance.', duration: 25, input: 'movement' },
      { title: 'Lunge & Twist', instruction: 'SETUP: Stand tall. EXECUTION: (1) Step RIGHT foot forward into lunge position (both knees at 90 degrees, back knee hovering above floor). (2) INHALE: Reach both arms overhead. (3) EXHALE: Twist torso to the RIGHT (toward front leg), bringing arms down to sides. (4) INHALE: Return to center, arms overhead. (5) Step back to standing. Repeat 4 times right leg, then switch: 4 times left leg. BREATHING: Deep inhale UP, full exhale TWIST. FORM CHECKPOINTS: Front knee over ankle (not past toes). Back knee hovers—do not rest on floor. Twist from waist, not shoulders. Keep hips square. BALANCE: If wobbly, widen your stance or reduce lunge depth. FEEL: Legs working, core rotating, breath controlling the flow. COMMON MISTAKES: Knee extending past toes, shallow breathing, forcing twist. SAFETY: Stop if knee pain. MODIFICATION: Hold onto a chair for balance, or reduce lunge depth.', duration: 30, input: 'movement', visualAid: '/movement/lunge-twist.png', alternativeMove: 'Hold chair for balance or reduce lunge depth to comfort level' },
      { title: 'Plank Hold', instruction: 'SETUP: Start on hands and knees. Place hands directly under shoulders. Step feet back one at a time into plank position—body forms a straight line from head to heels. HOLD: Maintain this position for 15 seconds. BREATHING: This is crucial! Breathe steadily and fully—do not hold breath. Inhale through nose, exhale through mouth. Count your breaths. FORM CHECKPOINTS: Engage core (pull belly button toward spine). Neutral spine (do not sag hips or pike butt up). Shoulders over wrists. Gaze at floor between hands. Press away from floor through hands. FEEL: Full body engagement—abs, shoulders, legs all working. COMMON MISTAKES: Holding breath (BREATHE!), sagging hips, looking forward (keep neutral neck). SAFETY: If wrists hurt, go to forearms. If too challenging, see modification. MODIFICATION: Drop to knees while keeping shoulders-to-knees in straight line (still effective!).', duration: 15, input: 'movement', visualAid: '/movement/plank.png', alternativeMove: 'Do plank from knees, keeping upper body and thighs in straight line' },
      { title: 'Mountain Climbers', instruction: 'FROM PLANK: Hands under shoulders, body straight. EXECUTION: (1) Bring RIGHT knee toward chest. (2) Quickly switch, extending right leg back while bringing LEFT knee to chest. (3) Continue alternating rapidly. Do 10 reps per leg (20 total knee drives). BREATHING: Quick, rhythmic breaths matching your pace. Do not hold breath! TEMPO: Start controlled, build to faster pace. Like running in plank position. FORM FOCUS: Keep hips level (do not bounce up and down). Core engaged throughout. Hands planted firmly. Land ball of foot softly each time. FEEL: Heart rate climbing, core working, cardio burn! COMMON MISTAKES: Hiking hips way up, sloppy form, forgetting to breathe. SAFETY: Protect your wrists—keep hands firmly planted. MODIFICATION: Step slowly instead of running motion—still effective, lower impact.', duration: 20, input: 'movement', visualAid: '/movement/mountain-climbers.png', alternativeMove: 'Step knees forward slowly one at a time, controlled pace instead of running' },
      { title: 'Standing Twist', instruction: 'SETUP: Stand with feet hip-width apart, arms extended forward at chest height, palms together. BREATH-MOVEMENT SYNC: (1) INHALE: Stay centered, lengthen spine. (2) EXHALE: Twist torso to the RIGHT, arms moving with torso (keep palms together). (3) INHALE: Return to center. (4) EXHALE: Twist torso to the LEFT. Do 6 complete cycles (12 twists total). BREATHING PATTERN: Breath controls everything. Inhale to prepare, exhale to twist. FORM CUES: Twist from waist and mid-back, not from hips. Keep hips stable facing forward. Arms stay at chest height. Shoulders level. Engage core. TEMPO: Slow and controlled—this is about breath, not speed. FEEL: Gentle spinal rotation, breath filling your lungs, energy centering. COMMON MISTAKES: Rushing, twisting from hips, holding breath. PURPOSE: Brings breath and rotation together, calming yet energizing.', duration: 18, input: 'movement' },
      { title: 'Final Breath', instruction: 'POSITION: Stand still with feet hip-width apart, arms relaxed at sides. BREATHING TECHNIQUE: We will do 3 cycles of extended exhale breathing (calms nervous system). (1) INHALE through nose slowly for 4 counts—fill belly first, then chest. (2) HOLD briefly for 2 counts at the top. (3) EXHALE through mouth slowly for 6 counts—empty completely, belly draws in. Repeat this cycle 3 times total. FOCUS: Feel your heartbeat slowing. Notice the stillness after each exhale. Your body has moved, now your breath brings you back to center. BENEFITS: Extended exhale (longer than inhale) activates your parasympathetic nervous system—your natural calm response. PURPOSE: Balances the energy you burned with breath control and calm.', duration: 20, input: 'breath' },
      { title: 'Reset Complete', instruction: 'You\'ve balanced movement with breath. Your energy is centered. Reset complete.', duration: 7 }
    ]
  },
  {
    id: 'energy-walk-it-off',
    emotionalState: 'energy',
    type: 'interactive',
    title: 'Walk It Off',
    description: 'Guided walking pace to burn energy mindfully',
    scienceBenefit: 'Rhythmic walking regulates nervous system and burns energy',
    duration: 180,
    color: 'from-yellow-500 to-orange-500',
    interactiveType: 'walking-pace',
    requiresDisclaimer: true,
    interactiveSteps: [
      { title: 'Walk It Off', instruction: 'This reset guides you through a 3-minute walking routine. You can do this in place or moving around your space. We\'ll vary the pace to burn that energy. Quick stretch first!', duration: 10, isStretch: false },
      
      // Stretch section
      { title: 'Stretch: Ankle Rolls', instruction: 'SETUP: Stand on one leg (hold wall or chair for balance if needed). EXECUTION: Lift RIGHT foot slightly off ground. Rotate ankle in slow circles—5 circles clockwise, feeling full range of motion. Then reverse: 5 circles counterclockwise. Lower right foot, switch to LEFT foot and repeat (5 clockwise, 5 counterclockwise). BREATHING: Breathe naturally and steadily. FOCUS: Slow, controlled circles. This warms up ankle joints and improves balance. FORM TIP: Draw circles with your toes, not your whole leg. COMMON MISTAKE: Rushing—take your time with each circle. PURPOSE: Prepares ankles for walking and prevents injury. Activates stabilizer muscles.', duration: 15, input: 'movement', isStretch: true },
      { title: 'Stretch: Leg Swings', instruction: 'SETUP: Stand next to wall or chair, holding on with RIGHT hand for balance. EXECUTION: Swing LEFT leg forward and back like a pendulum—smooth, controlled swings. Do 5 swings (forward counts as 1). Keep standing leg slightly bent. Switch sides: hold with LEFT hand, swing RIGHT leg 5 times. BREATHING: Exhale as leg swings forward, inhale as it swings back. FORM FOCUS: Control the swing—do not fling wildly. Keep torso upright (do not lean). Standing leg stays stable. Swing from hip joint. FEEL: Gentle dynamic stretch in hamstrings and hip flexors. COMMON MISTAKES: Swinging too aggressively, leaning forward, locking standing knee. PURPOSE: Loosens hip joints and prepares legs for walking movement.', duration: 15, input: 'movement', isStretch: true },
      
      // Walking routine
      { title: 'Slow Warm-Up', instruction: 'BEGIN WALKING: Start at an easy, comfortable pace. You can walk in place or move around your space—whatever works! FOCUS POINTS: Feel each foot making contact with the ground—heel, then ball of foot, then push off with toes. Let arms swing naturally at sides (opposite arm to opposite leg). Posture: Chest lifted, shoulders relaxed back and down, eyes forward. BREATHING: Natural, easy breaths through nose. TEMPO: Relaxed pace—no rushing. MINDFULNESS: Notice how your body feels. Feel the rhythm. Walking is natural—let your body remember. PURPOSE: Gradual warm-up prepares your cardiovascular system for increased activity.', duration: 20, input: 'movement' },
      { title: 'Medium Pace', instruction: 'PICK UP THE PACE: Walk a bit faster now—increase your step frequency. ARMS: Start pumping arms more actively. Bend elbows at 90 degrees, swing from shoulders. Forward arm swing should bring hands to about chest height. POSTURE: Stand tall, engage core, keep chin parallel to ground. Roll through each step. BREATHING: Deeper breaths now—you should notice breathing increase but still be able to talk. PACE: Moderate intensity—like you are heading somewhere with purpose. FEEL: Heart rate increasing, body warming up, energy moving. DURATION: Maintain this pace for full 30 seconds. COMMON MISTAKES: Hunched shoulders (keep them back), looking down (eyes forward), tense arms. PURPOSE: Cardiovascular conditioning—building aerobic fitness and burning energy.', duration: 30, input: 'movement' },
      { title: 'Power Walk', instruction: 'POWER WALK TIME: Walk as fast as you comfortably can without running. This is your high-intensity interval! TECHNIQUE: Quick, short steps. Powerful arm drive—elbows at 90 degrees, pump vigorously. Push off strongly with back foot each step. Engage core and glutes. POSTURE: Tall spine, chest lifted, shoulders back. Do not lean forward—stay upright. Land heel first, roll through, push off toes explosively. BREATHING: Faster, rhythmic breaths. You should be working hard but not gasping. PACE: Challenging but sustainable for 30 seconds. FEEL: Heart rate rising significantly, slight burn in legs, energy being released! SAFETY: If you get too winded, slow slightly. COMMON MISTAKES: Breaking into a jog (stay walking!), tense upper body, shallow breathing. PURPOSE: High-intensity burst burns energy and improves fitness. You got this!', duration: 30, input: 'movement', visualAid: '/movement/power-walk.png' },
      { title: 'Recovery Walk', instruction: 'SLOW IT DOWN: Reduce pace to moderate speed—recover from that power interval. BREATHING: Let your breath settle back down. Deep inhales through nose, full exhales through mouth. ARMS: Continue swinging but less vigorously. Relax shoulders. POSTURE: Maintain tall posture. Keep moving—walking during recovery is better than stopping. FOCUS: Notice your heartbeat gradually slowing. Feel the work you just did. PACE: Comfortable walking speed. DURATION: Full 20 seconds of recovery. FEEL: Breathing returning to normal, muscles recovering, energy stabilizing. PURPOSE: Active recovery allows heart rate to come down while maintaining movement. This interval training pattern maximizes energy burn.', duration: 20, input: 'movement' },
      { title: 'High Knee Walk', instruction: 'EXAGGERATED MOVEMENT: Continue walking but lift knees HIGHER with each step—aim to bring knees to waist level (or as high as comfortable). TECHNIQUE: March with purpose. Drive knees UP. Maintain upright posture. Pump arms vigorously (opposite arm to opposite knee). Land ball of foot with control. BREATHING: Quick, rhythmic breaths matching your pace. PACE: Moderate speed—focus on height of knee lift, not speed. Count steps if helpful—aim for 20-30 total steps. FEEL: Hip flexors working hard, core engaged, cardio intensity! CHALLENGE: This is tough—give it your best effort for 20 seconds! COMMON MISTAKES: Leaning back (stay upright), small knee lifts (get them HIGH), holding breath. SAFETY: Land softly to protect knees. MODIFICATION: Regular marching is fine—even moderate knee lifts are effective.', duration: 20, input: 'movement', alternativeMove: 'Regular marching with moderate knee lifts is perfectly effective' },
      { title: 'Cool Down Walk', instruction: 'WIND DOWN: Return to slow, relaxed walking pace. Let everything settle. ARMS: Loose, natural swing. No effort. BREATHING: Slow, deep breaths. Inhale through nose, exhale through mouth. Let each breath calm you further. POSTURE: Still upright but relaxed. Shoulders dropped, jaw unclenched. FOCUS: Notice how alive your body feels. Feel the warmth in your muscles, the blood flowing. Appreciate what your body just did. PACE: Very gentle—leisurely stroll pace. MINDFULNESS: Presence in each step. Feeling grounded. DURATION: Full 25 seconds of gentle walking. PURPOSE: Gradual cool-down prevents dizziness and helps your cardiovascular system transition back to rest. Well done!', duration: 25, input: 'movement' },
      { title: 'Final Stretch', instruction: 'COME TO A STOP: Stand with feet hip-width apart, arms at sides. MOVEMENT: (1) INHALE deeply through nose as you reach both arms up overhead—stretch tall, maybe even rise onto tiptoes. (2) Hold briefly at the top—feel the full-body stretch. (3) EXHALE fully through mouth as you lower arms back down to sides, settle onto flat feet. Repeat this sequence 3 times total. FOCUS: Each inhale fills you with energy, each exhale releases any remaining tension. FEEL: Lengthening through entire body, breath expanding lungs fully, sense of completion. PURPOSE: Final stretch releases any remaining tightness and signals to your body that activity is complete. Honors the work you did.', duration: 15, input: 'movement' },
      { title: 'Reset Complete', instruction: 'You\'ve walked off that excess energy. Your body feels satisfied and your mind is calm. Reset complete.', duration: 10 }
    ]
  }
];

// Helper functions
export function getResetsByEmotion(emotion: EmotionalState): Reset[] {
  return RESETS.filter(reset => reset.emotionalState === emotion);
}

export function getResetById(id: string): Reset | undefined {
  return RESETS.find(reset => reset.id === id);
}
