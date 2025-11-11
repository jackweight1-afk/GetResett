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
    color: 'from-orange-500 to-red-500',
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
      { title: 'Stretch: Neck Rolls', instruction: 'Setup & Move — Stand tall, shoulders down; drop chin to chest, roll head in full circles—3 clockwise, pause, 3 counterclockwise. Breath & Form — Inhale rolling back, exhale rolling forward; move slowly, no jerking. Safety & Options — Keep smooth and controlled, never force.', duration: 15, input: 'movement', isStretch: true },
      { title: 'Stretch: Arm Circles', instruction: 'Setup & Move — Stand feet shoulder-width, extend arms straight to sides at shoulder height; make large circles forward 5 times, reverse backward 5 times. Breath & Form — Breathe naturally and steady; shoulders down, core engaged for stability. Safety & Options — Make big circles not tiny ones; feel warmth building in shoulders.', duration: 15, input: 'movement', isStretch: true },
      { title: 'Stretch: Torso Twists', instruction: 'Setup & Move — Stand feet hip-width, knees soft, hands on hips; keep hips forward, twist torso right then left. Do 6 reps per side. Breath & Form — Exhale twisting, inhale returning center; rotate from waist not hips, core engaged, shoulders level. Safety & Options — Move within comfortable range, don\'t force it.', duration: 15, input: 'movement', isStretch: true },
      
      // Main workout
      { title: 'Jumping Jacks', instruction: 'Setup & Move — Stand tall, clear space, spring feet out/in with arms sweeping overhead for 30 seconds. Breath & Form — Inhale open, exhale close; keep core braced, shoulders loose, land softly. Safety & Options — Stop if dizzy or joints ache; step side-to-side raising arms for low impact.', duration: 30, input: 'movement', visualAid: '/movement/jumping-jacks.png', alternativeMove: 'Step side-to-side instead of jumping, raising arms with each step' },
      { title: 'High Knees', instruction: 'Setup & Move — Stand tall, elbows bent 90°, drive knees to hip height while pumping opposite arms; aim for quick, rhythmic lifts. Breath & Form — Breathe fast but controlled; stay light on balls of feet, core engaged, chest lifted. Safety & Options — Stop if balance slips or joints hurt; march with deliberate knee lifts and slower tempo.', duration: 20, input: 'movement', alternativeMove: 'March in place at moderate pace with controlled knee lifts' },
      { title: 'Bodyweight Squats', instruction: 'Setup & Move — Stand feet shoulder-width, toes out; sit back into squat as low as comfortable, drive through heels to stand. Do 10 reps. Breath & Form — Inhale down, exhale up; chest proud, weight in heels, knees track outward. Safety & Options — Stop if knees or back hurt; hold chair for balance or reduce depth.', duration: 25, input: 'movement', visualAid: '/movement/squats.png', alternativeMove: 'Hold onto chair for balance, reduce squat depth to comfort level' },
      { title: 'Arm Pulses', instruction: 'Setup & Move — Stand feet hip-width, extend arms straight forward at shoulder height; pulse rapidly up-down 3-4 inches for 20 seconds. Breath & Form — Breathe steady, don\'t hold breath; shoulders down, arms parallel to ground, core tight. Safety & Options — Push through the burn; keep arms at height, don\'t let them drop.', duration: 20, input: 'movement' },
      { title: 'Rest & Breathe', instruction: 'RECOVERY TIME: Stand or walk slowly in place. Let your arms hang loose. BREATHING TECHNIQUE: Slow, controlled breaths. (1) Inhale deeply through nose for 3 counts—feel belly expand. (2) Hold briefly. (3) Exhale fully through mouth for 3 counts—empty the lungs. Repeat 3 times. FOCUS: Notice your heartbeat slowing. Feel your muscles recovering. This brief rest prepares you for the final exercise. Shake out arms and legs gently. Roll shoulders back. You are doing great!', duration: 10, input: 'breath' },
      { title: 'Burpees (Modified)', instruction: 'Setup & Move — Stand feet wide, squat and place hands down, step back to plank, hold 1 second, step forward, stand and reach overhead. Do 5 reps. Breath & Form — Exhale stepping back, inhale in plank, exhale forward, inhale reaching up; keep plank straight, core engaged. Safety & Options — Take breaks as needed; skip plank—just squat, touch floor, stand and reach.', duration: 25, input: 'movement', alternativeMove: 'Squat down, touch floor, stand up and reach overhead—skip the plank step entirely' },
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
      { title: 'Stretch: Shoulder Rolls', instruction: 'Setup & Move — Stand feet hip-width, arms loose; lift shoulders up, roll BACK and DOWN in smooth circles. Do 5 backward, then 5 forward. Breath & Form — Inhale shoulders rise, exhale rolling down; slow, controlled movements. Safety & Options — Don\'t rush, take your time; loosens shoulders before punching.', duration: 12, input: 'movement', isStretch: true },
      { title: 'Stretch: Wrist Circles', instruction: 'Setup & Move — Make loose fists, arms forward; rotate wrists in full circles—5 clockwise, then 5 counterclockwise. Breath & Form — Breathe naturally; make full circles not tiny ones, warm up wrists for punching. Safety & Options — Prevents wrist strain, protects joints.', duration: 12, input: 'movement', isStretch: true },
      { title: 'Stretch: Hip Circles', instruction: 'Setup & Move — Feet shoulder-width, hands on hips, knees soft; keep feet planted, circle hips smoothly—3 clockwise, then 3 counterclockwise. Breath & Form — Breathe steadily; isolate movement—hips only, feel rotation loosening lower back. Safety & Options — Warms up core rotation for punches.', duration: 12, input: 'movement', isStretch: true },
      
      // Boxing movements
      { title: 'Stance', instruction: 'Setup & Move — Stand feet staggered, knees soft, fists up by cheeks, elbows tucked; rock gently on balls of feet. Breath & Form — Breathe steady, chin tucked, shoulders relaxed; eyes forward tracking target. Safety & Options — Pause if knees or back complain; widen stance or lower hands briefly to reset.', duration: 10, input: 'movement', visualAid: '/movement/boxing-stance.png' },
      { title: 'Jab Practice', instruction: 'Setup & Move — From stance, snap lead hand straight forward, fist rotating palm-down; snap back to guard. Do 20 quick jabs. Breath & Form — Exhale sharply each jab; punch straight, shoulder protects chin, other hand guards. Safety & Options — Keep guard up, don\'t telegraph; this is your fastest punch—snap it!', duration: 20, input: 'movement', visualAid: '/movement/jab.png' },
      { title: 'Cross Punches', instruction: 'Setup & Move — From stance, throw rear hand across body, rotating hips and shoulders; pivot rear foot, extend fully, snap back. Do 15 crosses. Breath & Form — Explosive exhale each punch; power from rotation, front hand guards, chin protected. Safety & Options — Stay controlled, don\'t drop lead hand or overextend; this is your power punch!', duration: 18, input: 'movement', visualAid: '/movement/cross-punch.png' },
      { title: 'Jab-Cross Combo', instruction: 'Setup & Move — From stance, snap lead jab then immediately rear cross, both hands to guard. That\'s 1 combo—do 10 total. Breath & Form — Sharp exhale on EACH punch; find rhythm: Jab-Cross, Jab-Cross. Stay balanced, light on feet. Safety & Options — Don\'t rush or drop guard between punches; fundamental boxing, flow!', duration: 20, input: 'movement' },
      { title: 'Hooks', instruction: 'Setup & Move — Return to stance; elbow bent 90°, rotate from waist, swing arm horizontal arc at shoulder level. Do 10 lead hooks, then 10 rear hooks with opposite hand. Breath & Form — Exhale each hook; power from rotation not arm, other hand guards, chin protected. Safety & Options — Don\'t swing wildly, use technique; builds core strength!', duration: 20, input: 'movement' },
      { title: 'Speed Round', instruction: 'Setup & Move — Final push! For 15 seconds, throw ANY punches as fast as you can—jabs, crosses, hooks. Let your energy OUT! Breath & Form — Quick, sharp exhales every punch; intensity is priority, stay on toes, move feet. Safety & Options — Stay controlled, don\'t hyperextend; explosive finish, give it everything!', duration: 15, input: 'movement' },
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
      { title: 'Stretch: Standing Side Bend', instruction: 'Setup & Move — Stand feet hip-width; reach RIGHT arm overhead, gently bend LEFT. Hold 5 seconds breathing into ribs. Return center, repeat opposite. Do 2 full cycles (4 total bends). Breath & Form — Inhale reaching up, exhale bending; pure side bend, hips stable, core gently engaged. Safety & Options — Feel stretch hip to armpit; opens side body.', duration: 15, input: 'movement', isStretch: true, visualAid: '/movement/side-bend.png' },
      { title: 'Stretch: Forward Fold', instruction: 'Setup & Move — Stand feet hip-width, knees soft; hinge forward at hips, let torso and arms hang heavy toward floor. Hold 8 seconds, relax completely. Breath & Form — Exhale folding down, breathe naturally during hold; each exhale, relax deeper. Bend knees if tight, don\'t force. Safety & Options — To come up, bend knees more and roll up slowly.', duration: 12, input: 'movement', isStretch: true },
      
      // Breath + movement
      { title: 'Reach & Squat', instruction: 'Setup & Move — Stand feet shoulder-width; INHALE reaching arms overhead, EXHALE squatting down with arms forward, INHALE standing and reaching up. Do 8 reps. Breath & Form — Your breath powers movement; INHALE = expand up, EXHALE = contract down. Never hold breath. Chest up, weight in heels, core engaged. Safety & Options — Smooth and rhythmic; energy and breath become one.', duration: 25, input: 'movement' },
      { title: 'Lunge & Twist', instruction: 'Setup & Move — Step RIGHT foot into lunge; INHALE arms overhead, EXHALE twist RIGHT with arms down, INHALE return center. Step back. Do 4 right, then 4 left. Breath & Form — Deep inhale UP, full exhale TWIST; front knee over ankle, back knee hovers, twist from waist. Safety & Options — Stop if knee pain; hold chair or reduce depth.', duration: 30, input: 'movement', visualAid: '/movement/lunge-twist.png', alternativeMove: 'Hold chair for balance or reduce lunge depth to comfort level' },
      { title: 'Plank Hold', instruction: 'Setup & Move — Start on hands and knees, hands under shoulders; step feet back into plank, hold 15 seconds. Breath & Form — Breathe steadily—do NOT hold breath! Inhale nose, exhale mouth, count breaths. Core engaged, neutral spine, shoulders over wrists. Safety & OPTIONS — Wrists hurt? Go to forearms. Too hard? Drop to knees.', duration: 15, input: 'movement', visualAid: '/movement/plank.png', alternativeMove: 'Do plank from knees, keeping upper body and thighs in straight line' },
      { title: 'Mountain Climbers', instruction: 'Setup & Move — From plank, bring RIGHT knee to chest, quickly switch to LEFT; continue alternating rapidly. Do 10 per leg (20 total). Breath & Form — Quick, rhythmic breaths; start controlled, build faster—like running in plank. Keep hips level, core engaged, land softly. Safety & Options — Protect wrists; prefer gentle? Step slowly instead of running.', duration: 20, input: 'movement', visualAid: '/movement/mountain-climbers.png', alternativeMove: 'Step knees forward slowly one at a time, controlled pace instead of running' },
      { title: 'Standing Twist', instruction: 'Setup & Move — Stand feet hip-width, arms forward chest height, palms together; INHALE stay centered, EXHALE twist RIGHT, INHALE return, EXHALE twist LEFT. Do 6 cycles (12 total). Breath & Form — Breath controls everything; twist from waist not hips, hips stable, slow and controlled. Safety & Options — Gentle spinal rotation, breath filling lungs.', duration: 18, input: 'movement' },
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
      { title: 'Stretch: Ankle Rolls', instruction: 'Setup & Move — Stand on one leg (hold wall for balance); lift RIGHT foot, rotate ankle in slow circles—5 clockwise, 5 counterclockwise. Lower, switch to LEFT, repeat. Breath & Form — Breathe naturally; slow, controlled circles with toes not whole leg. Warms up ankles and improves balance. Safety & Options — Don\'t rush; prepares ankles for walking.', duration: 15, input: 'movement', isStretch: true },
      { title: 'Stretch: Leg Swings', instruction: 'Setup & Move — Stand next to wall, hold RIGHT hand; swing LEFT leg forward-back like pendulum 5 times. Keep standing leg bent. Switch: hold LEFT, swing RIGHT 5 times. Breath & Form — Exhale swinging forward, inhale back; control the swing, don\'t fling. Torso upright, swing from hip. Safety & Options — Feel gentle stretch in hamstrings; loosens hips for walking.', duration: 15, input: 'movement', isStretch: true },
      
      // Walking routine
      { title: 'Slow Warm-Up', instruction: 'Setup & Move — Start easy, comfortable pace walking in place or around your space. Feel foot contact: heel, ball, push off with toes. Arms swing naturally (opposite to legs). Breath & Form — Natural, easy nose breaths; chest lifted, shoulders relaxed, eyes forward. Relaxed pace, no rushing. Safety & Options — Notice how your body feels; walking is natural, let it flow.', duration: 20, input: 'movement' },
      { title: 'Medium Pace', instruction: 'Setup & Move — Walk faster now; pump arms actively with elbows at 90°, swing from shoulders bringing hands to chest height. Roll through each step. Breath & Form — Deeper breaths (should increase but still able to talk); stand tall, core engaged, chin parallel. Moderate intensity pace. Safety & Options — Keep shoulders back not hunched, eyes forward not down. Heart rate increasing, body warming.', duration: 30, input: 'movement' },
      { title: 'Power Walk', instruction: 'Setup & Move — Walk as fast as you can without running; quick short steps, powerful arm drive at 90°, push off strongly with back foot. Engage core and glutes. Breath & Form — Faster rhythmic breaths (working hard but not gasping); tall spine, chest lifted, shoulders back. Land heel first, roll through, push off toes. Safety & Options — If too winded, slow slightly; stay walking, don\'t jog. Heart rate rising, energy releasing!', duration: 30, input: 'movement', visualAid: '/movement/power-walk.png' },
      { title: 'Recovery Walk', instruction: 'Setup & Move — Reduce to moderate pace; continue swinging arms but less vigorously. Relax shoulders, maintain tall posture. Keep moving for full 20 seconds. Breath & Form — Let breath settle; deep nose inhales, full mouth exhales. Comfortable walking speed. Safety & Options — Notice heartbeat slowing; active recovery brings heart rate down while maintaining movement.', duration: 20, input: 'movement' },
      { title: 'High Knee Walk', instruction: 'Setup & Move — Lift knees HIGH to waist level (or comfortable height); march with purpose driving knees UP. Pump arms vigorously opposite to knees. Land ball of foot with control. Breath & Form — Quick, rhythmic breaths matching pace; moderate speed focusing on knee height not speed. Stay upright, core engaged. Safety & Options — Land softly to protect knees; marching with moderate lifts is effective too.', duration: 20, input: 'movement', alternativeMove: 'Regular marching with moderate knee lifts is perfectly effective' },
      { title: 'Cool Down Walk', instruction: 'Setup & Move — Return to slow, relaxed pace; loose natural arm swing, no effort. Very gentle leisurely stroll for full 25 seconds. Breath & Form — Slow, deep breaths (inhale nose, exhale mouth); let each breath calm you. Still upright but relaxed—shoulders dropped, jaw unclenched. Safety & Options — Notice how alive your body feels; warmth in muscles, blood flowing. Cool-down prevents dizziness.', duration: 25, input: 'movement' },
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
