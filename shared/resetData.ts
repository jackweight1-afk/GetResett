// Reset types and emotional states
export type EmotionalState = 'stressed' | 'anxiety' | 'restless' | 'overwhelmed' | 'tired' | 'scattered';
export type ResetType = 'story' | 'interactive';

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
  interactiveType?: 'grounding' | 'breathing' | 'visualization' | 'tapping' | 'counting' | 'body-scan';
  interactiveSteps?: InteractiveStep[];
}

export interface StoryStep {
  text: string;
  duration: number; // seconds to show this step
  background?: string; // optional background color/gradient
}

export interface InteractiveStep {
  instruction: string;
  duration?: number;
  input?: 'text' | 'tap' | 'breath' | 'none';
  count?: number; // for exercises that need counting
}

// All 24 resets: 4 per emotional state (2 story + 2 interactive)
export const RESETS: Reset[] = [
  // ============ STRESSED (4 resets) ============
  {
    id: 'stressed-mountain',
    emotionalState: 'stressed',
    type: 'story',
    title: 'Mountain Meditation',
    description: 'Guided story to become as steady as a mountain',
    scienceBenefit: 'Visualization therapy helps create inner stability',
    duration: 120,
    color: 'from-slate-400 to-slate-500',
    storyContent: [
      { text: 'Take a deep breath and imagine standing at the base of a majestic mountain...', duration: 8 },
      { text: 'This mountain has stood here for thousands of years, unmoved by storms, winds, and changing seasons...', duration: 10 },
      { text: 'Feel yourself becoming like this mountain - solid, grounded, unshakeable...', duration: 10 },
      { text: 'Stress may swirl around you like passing clouds, but your core remains steady and strong...', duration: 12 },
      { text: 'With each breath, you sink deeper roots into the earth beneath you...', duration: 10 },
      { text: 'The mountain does not fight the storm. It simply exists, patient and enduring...', duration: 12 },
      { text: 'You are this mountain. Strong. Grounded. At peace...', duration: 10 },
      { text: 'Take a final deep breath, carrying this steadiness with you...', duration: 8 }
    ]
  },
  {
    id: 'stressed-haven',
    emotionalState: 'stressed',
    type: 'story',
    title: 'Safe Haven Journey',
    description: 'Walk through a peaceful sanctuary in your mind',
    scienceBenefit: 'CBT safe place technique creates instant calm',
    duration: 120,
    color: 'from-teal-400 to-cyan-500',
    storyContent: [
      { text: 'Imagine a place where you feel completely safe and at peace...', duration: 8 },
      { text: 'It might be a quiet beach, a cozy room, or a serene forest clearing...', duration: 10 },
      { text: 'Notice every detail - the colors, the sounds, the temperature of the air...', duration: 12 },
      { text: 'In this place, stress cannot reach you. You are completely protected...', duration: 12 },
      { text: 'Feel your shoulders drop, your jaw relax, your breathing slow...', duration: 10 },
      { text: 'This sanctuary exists within you. You can return here anytime you need...', duration: 12 },
      { text: 'Take one more moment to soak in this peace...', duration: 8 },
      { text: 'When you\'re ready, slowly return, bringing this calm with you...', duration: 8 }
    ]
  },
  {
    id: 'stressed-progressive',
    emotionalState: 'stressed',
    type: 'interactive',
    title: 'Progressive Relaxation',
    description: 'Systematically tense and release muscle groups',
    scienceBenefit: 'Reduces cortisol levels and activates relaxation response',
    duration: 60,
    color: 'from-slate-500 to-pink-500',
    interactiveType: 'body-scan',
    interactiveSteps: [
      { instruction: 'Clench your fists tightly. Hold for 5 seconds...', duration: 7 },
      { instruction: 'Release. Feel the tension flow out...', duration: 5 },
      { instruction: 'Tense your shoulders up to your ears. Hold...', duration: 7 },
      { instruction: 'Drop them down. Notice the relief...', duration: 5 },
      { instruction: 'Scrunch your face muscles. Hold tight...', duration: 7 },
      { instruction: 'Release completely. Let everything soften...', duration: 5 },
      { instruction: 'Take a deep breath. Feel the calm in your relaxed body...', duration: 14 }
    ]
  },
  {
    id: 'stressed-box-breathing',
    emotionalState: 'stressed',
    type: 'interactive',
    title: 'Box Breathing',
    description: 'Navy SEAL breathing technique for instant calm',
    scienceBenefit: 'Balances your nervous system',
    duration: 90,
    color: 'from-slate-500 to-slate-600',
    interactiveType: 'breathing',
    interactiveSteps: [
      { instruction: 'Breathe in for 4 counts', duration: 4, input: 'breath' },
      { instruction: 'Hold for 4 counts', duration: 4, input: 'none' },
      { instruction: 'Breathe out for 4 counts', duration: 4, input: 'breath' },
      { instruction: 'Hold for 4 counts', duration: 4, input: 'none' }
    ]
  },

  // ============ ANXIETY (4 resets) ============
  {
    id: 'anxiety-grounding',
    emotionalState: 'anxiety',
    type: 'interactive',
    title: 'Grounding 5-4-3-2-1',
    description: 'Use your senses to anchor to the present',
    scienceBenefit: 'Interrupts anxiety spirals instantly',
    duration: 180,
    color: 'from-slate-500 to-slate-600',
    interactiveType: 'grounding',
    interactiveSteps: [
      { instruction: 'Name 5 things you can see around you', count: 5, input: 'text' },
      { instruction: 'Name 4 things you can touch or feel', count: 4, input: 'text' },
      { instruction: 'Name 3 things you can hear right now', count: 3, input: 'text' },
      { instruction: 'Name 2 things you can smell', count: 2, input: 'text' },
      { instruction: 'Name 1 thing you can taste', count: 1, input: 'text' }
    ]
  },
  {
    id: 'anxiety-worry-release',
    emotionalState: 'anxiety',
    type: 'interactive',
    title: 'Worry Release Ritual',
    description: 'Guided practice to let worries float away',
    scienceBenefit: 'Expressive writing therapy reduces anxiety',
    duration: 120,
    color: 'from-pink-400 to-rose-500',
    interactiveType: 'visualization',
    interactiveSteps: [
      { instruction: 'Write down your biggest worry right now', input: 'text', duration: 20 },
      { instruction: 'Imagine placing it in a balloon...', duration: 10 },
      { instruction: 'Watch the balloon slowly float up into the sky...', duration: 15 },
      { instruction: 'See it get smaller and smaller until it disappears...', duration: 15 },
      { instruction: 'Notice how light you feel without carrying that worry...', duration: 15 },
      { instruction: 'Take a deep breath of relief...', duration: 10 }
    ]
  },
  {
    id: 'anxiety-body-anchor',
    emotionalState: 'anxiety',
    type: 'story',
    title: 'Body Anchor Story',
    description: 'Use your body as a safe anchor in the present',
    scienceBenefit: 'Somatic experiencing grounds you when thoughts spiral',
    duration: 120,
    color: 'from-teal-500 to-emerald-500',
    storyContent: [
      { text: 'When anxiety takes you into the future, your body keeps you in the now...', duration: 10 },
      { text: 'Feel your feet on the ground. Solid. Stable. Real...', duration: 10 },
      { text: 'Notice the weight of your body in your seat. You are here. You are safe...', duration: 12 },
      { text: 'Your body is like an anchor, holding you steady in stormy mental waters...', duration: 12 },
      { text: 'Anxiety lives in thoughts about the future. Your body exists only right now...', duration: 14 },
      { text: 'Press your feet firmly down. Feel the connection to the earth...', duration: 12 },
      { text: 'You are anchored. Present. Safe in this moment...', duration: 10 },
      { text: 'Breathe deeply, knowing your body is your safe home...', duration: 10 }
    ]
  },
  {
    id: 'anxiety-calm-counting',
    emotionalState: 'anxiety',
    type: 'interactive',
    title: 'Calm Counting',
    description: 'Count slowly with guided breathing',
    scienceBenefit: 'Activates prefrontal cortex, regulating anxiety',
    duration: 90,
    color: 'from-blue-400 to-indigo-500',
    interactiveType: 'counting',
    interactiveSteps: [
      { instruction: 'Count 1... breathe in slowly', duration: 5, input: 'breath' },
      { instruction: 'Count 2... breathe out slowly', duration: 5, input: 'breath' },
      { instruction: 'Count 3... breathe in deeply', duration: 5, input: 'breath' },
      { instruction: 'Count 4... breathe out fully', duration: 5, input: 'breath' },
      { instruction: 'Count 5... feel yourself calming', duration: 5, input: 'breath' },
      { instruction: 'Continue counting breaths up to 10...', duration: 30, count: 10 }
    ]
  },

  // ============ RESTLESS (4 resets) ============
  {
    id: 'restless-finger-tapping',
    emotionalState: 'restless',
    type: 'interactive',
    title: 'Finger Tapping',
    description: 'Follow rhythmic tapping patterns',
    scienceBenefit: 'Channels restless energy productively',
    duration: 120,
    color: 'from-amber-400 to-orange-500',
    interactiveType: 'tapping',
    interactiveSteps: [
      { instruction: 'Tap each finger to your thumb: 1-2-3-4', duration: 8, input: 'tap' },
      { instruction: 'Reverse: 4-3-2-1', duration: 8, input: 'tap' },
      { instruction: 'Repeat on other hand: 1-2-3-4', duration: 8, input: 'tap' },
      { instruction: 'Reverse: 4-3-2-1', duration: 8, input: 'tap' },
      { instruction: 'Both hands together: 1-2-3-4', duration: 8, input: 'tap' },
      { instruction: 'Notice the restless energy transforming...', duration: 10 },
      { instruction: 'Continue at your own pace...', duration: 60, input: 'tap' }
    ]
  },
  {
    id: 'restless-energy-flow',
    emotionalState: 'restless',
    type: 'story',
    title: 'Energy Flow Story',
    description: 'Visualize energy moving through your body',
    scienceBenefit: 'Guided imagery redirects restless energy',
    duration: 120,
    color: 'from-yellow-400 to-amber-500',
    storyContent: [
      { text: 'That restless energy you feel? It\'s not your enemy - it\'s life force...', duration: 10 },
      { text: 'Imagine it as golden light, buzzing through your body...', duration: 10 },
      { text: 'Instead of fighting it, guide it - down your arms and out your fingertips...', duration: 12 },
      { text: 'Watch it flow down your legs and into the earth below...', duration: 12 },
      { text: 'The earth absorbs this energy, transforming it into something useful...', duration: 14 },
      { text: 'With each breath out, more restless energy flows away...', duration: 12 },
      { text: 'What remains is calm, focused energy you can use...', duration: 10 },
      { text: 'Take one more breath, feeling grounded and ready...', duration: 10 }
    ]
  },
  {
    id: 'restless-moving-meditation',
    emotionalState: 'restless',
    type: 'interactive',
    title: 'Moving Meditation',
    description: 'Trace flowing patterns with your finger',
    scienceBenefit: 'Channels energy into mindful activity',
    duration: 120,
    color: 'from-green-400 to-emerald-500',
    interactiveType: 'visualization',
    interactiveSteps: [
      { instruction: 'Trace slow circles in the air with your finger', duration: 15, input: 'tap' },
      { instruction: 'Switch to figure-8 patterns', duration: 15, input: 'tap' },
      { instruction: 'Draw a square slowly and deliberately', duration: 15, input: 'tap' },
      { instruction: 'Create your own flowing pattern', duration: 20, input: 'tap' },
      { instruction: 'Feel the restless energy becoming focused movement', duration: 15 },
      { instruction: 'Let your hands rest. Notice the calm...', duration: 20 }
    ]
  },
  {
    id: 'restless-gentle-stretches',
    emotionalState: 'restless',
    type: 'interactive',
    title: 'Gentle Stretches',
    description: 'Quick restorative stretch sequence',
    scienceBenefit: 'Increases blood flow and oxygen',
    duration: 120,
    color: 'from-lime-400 to-green-500',
    interactiveType: 'body-scan',
    interactiveSteps: [
      { instruction: 'Roll your shoulders back 5 times', duration: 10, count: 5 },
      { instruction: 'Tilt your head side to side gently', duration: 10 },
      { instruction: 'Stretch your arms up high, then release', duration: 10 },
      { instruction: 'Rotate your wrists in circles', duration: 10 },
      { instruction: 'Flex and point your feet', duration: 10 },
      { instruction: 'Take a full body stretch and sigh it out', duration: 15 },
      { instruction: 'Notice how your energy feels now...', duration: 15 }
    ]
  },

  // ============ OVERWHELMED (4 resets) ============
  {
    id: 'overwhelmed-one-thing',
    emotionalState: 'overwhelmed',
    type: 'interactive',
    title: 'One Thing at a Time',
    description: 'Simple, focused micro-tasks',
    scienceBenefit: 'Reduces cognitive load instantly',
    duration: 120,
    color: 'from-slate-400 to-slate-500',
    interactiveType: 'visualization',
    interactiveSteps: [
      { instruction: 'Write down just ONE thing overwhelming you', input: 'text', duration: 20 },
      { instruction: 'Now write the smallest possible step you could take', input: 'text', duration: 20 },
      { instruction: 'Imagine doing just that one tiny step...', duration: 15 },
      { instruction: 'Notice how manageable it feels when it\'s just one thing...', duration: 15 },
      { instruction: 'Everything else can wait. Just this one thing...', duration: 15 },
      { instruction: 'Take a breath. You\'ve got this...', duration: 15 }
    ]
  },
  {
    id: 'overwhelmed-simplify',
    emotionalState: 'overwhelmed',
    type: 'story',
    title: 'Simplify Story',
    description: 'Guided journey to declutter your mind',
    scienceBenefit: 'External organization reduces mental overwhelm',
    duration: 120,
    color: 'from-blue-400 to-cyan-500',
    storyContent: [
      { text: 'Imagine your mind as a room filled with scattered papers...', duration: 10 },
      { text: 'Each paper represents a thought, a task, a worry...', duration: 10 },
      { text: 'You don\'t need to deal with all of them right now...', duration: 10 },
      { text: 'Pick up just one paper. Look at it. Then set it aside in an organized pile...', duration: 14 },
      { text: 'One by one, you\'re not doing the tasks - just organizing them...', duration: 14 },
      { text: 'The room becomes clearer. You can breathe easier...', duration: 12 },
      { text: 'You see now that it\'s manageable. One thing at a time...', duration: 12 },
      { text: 'Take a final breath, feeling clearer and more organized...', duration: 10 }
    ]
  },
  {
    id: 'overwhelmed-wise-mind',
    emotionalState: 'overwhelmed',
    type: 'story',
    title: 'Wise Mind Guide',
    description: 'Meet your inner wise guide for perspective',
    scienceBenefit: 'DBT wise mind practice balances emotion and logic',
    duration: 90,
    color: 'from-slate-400 to-slate-500',
    storyContent: [
      { text: 'Take a moment to imagine a wise, calm version of yourself...', duration: 10 },
      { text: 'This wise guide has already gotten through everything you\'re facing...', duration: 12 },
      { text: 'They look at you with compassion and say: "You\'re doing better than you think..."', duration: 14 },
      { text: '"The overwhelm is temporary. You have everything you need..."', duration: 12 },
      { text: '"Break it down. Breathe. One step at a time..."', duration: 12 },
      { text: 'Feel their calm confidence flowing into you...', duration: 10 },
      { text: 'You ARE this wise guide. This wisdom is within you...', duration: 10 }
    ]
  },
  {
    id: 'overwhelmed-body-scan',
    emotionalState: 'overwhelmed',
    type: 'interactive',
    title: 'Body Scan',
    description: 'Quick body awareness check-in',
    scienceBenefit: 'Grounds you in physical sensations',
    duration: 120,
    color: 'from-slate-500 to-pink-500',
    interactiveType: 'body-scan',
    interactiveSteps: [
      { instruction: 'Notice your feet. Are they tense? Relax them...', duration: 12 },
      { instruction: 'Scan your legs. Let any tension melt away...', duration: 12 },
      { instruction: 'Feel your belly. Breathe deeply into it...', duration: 12 },
      { instruction: 'Check your shoulders. Drop them down...', duration: 12 },
      { instruction: 'Relax your jaw and face muscles...', duration: 12 },
      { instruction: 'Feel your whole body, calm and grounded...', duration: 15 },
      { instruction: 'Take one more deep, releasing breath...', duration: 15 }
    ]
  },

  // ============ TIRED (4 resets) ============
  {
    id: 'tired-energy-restoration',
    emotionalState: 'tired',
    type: 'story',
    title: 'Energy Restoration Story',
    description: 'Visualize gathering energy from nature',
    scienceBenefit: 'Guided imagery increases mental energy',
    duration: 90,
    color: 'from-amber-400 to-yellow-500',
    storyContent: [
      { text: 'Imagine standing in a warm beam of sunlight...', duration: 10 },
      { text: 'This golden light is pure energy, flowing into you with each breath...', duration: 12 },
      { text: 'It fills your chest, spreading warmth and vitality throughout your body...', duration: 12 },
      { text: 'Your cells drink in this light like plants absorbing sunshine...', duration: 12 },
      { text: 'Feel energy returning to your muscles, clarity to your mind...', duration: 12 },
      { text: 'You are being recharged, renewed, restored...', duration: 12 },
      { text: 'Take a deep breath, feeling more awake and energized...', duration: 10 }
    ]
  },
  {
    id: 'tired-power-nap-sounds',
    emotionalState: 'tired',
    type: 'story',
    title: 'Power Nap Sounds',
    description: 'Calming sounds for quick recovery',
    scienceBenefit: 'Restores mental energy rapidly',
    duration: 120,
    color: 'from-sky-400 to-blue-500',
    storyContent: [
      { text: 'Take a deep breath and let yourself sink into comfort...', duration: 12 },
      { text: 'Imagine gentle ocean waves, rhythmic and soothing...', duration: 15 },
      { text: 'Each wave washes away tension, bringing calm...', duration: 15 },
      { text: 'Your breathing slows, matching the rhythm of the waves...', duration: 15 },
      { text: 'You\'re not sleeping, just deeply resting...', duration: 15 },
      { text: 'This brief rest is restoring your energy and focus...', duration: 15 },
      { text: 'Take one more breath, feeling refreshed and renewed...', duration: 15 }
    ]
  },
  {
    id: 'tired-energizing-breath',
    emotionalState: 'tired',
    type: 'interactive',
    title: 'Energizing Breath',
    description: 'Quick breathing technique for alertness',
    scienceBenefit: 'Increases oxygen and alertness',
    duration: 60,
    color: 'from-orange-400 to-red-400',
    interactiveType: 'breathing',
    interactiveSteps: [
      { instruction: 'Take a quick, sharp inhale through your nose', duration: 2, input: 'breath' },
      { instruction: 'Exhale forcefully through your mouth', duration: 2, input: 'breath' },
      { instruction: 'Repeat: Quick in, strong out', duration: 3, input: 'breath' },
      { instruction: 'Continue this pattern 10 times', duration: 30, count: 10, input: 'breath' },
      { instruction: 'Return to normal breathing...', duration: 10 },
      { instruction: 'Notice increased alertness and energy', duration: 10 }
    ]
  },
  {
    id: 'tired-gentle-stretches',
    emotionalState: 'tired',
    type: 'interactive',
    title: 'Gentle Stretches',
    description: 'Quick restorative stretch sequence',
    scienceBenefit: 'Increases blood flow and oxygen',
    duration: 120,
    color: 'from-green-400 to-teal-500',
    interactiveType: 'body-scan',
    interactiveSteps: [
      { instruction: 'Reach your arms overhead and stretch tall', duration: 10 },
      { instruction: 'Roll your shoulders back 5 times', duration: 10, count: 5 },
      { instruction: 'Tilt your head gently side to side', duration: 10 },
      { instruction: 'Twist gently at your waist, left then right', duration: 15 },
      { instruction: 'Shake out your hands and feet', duration: 10 },
      { instruction: 'Take 3 deep, energizing breaths', duration: 15, count: 3 },
      { instruction: 'Notice the increased energy in your body', duration: 15 }
    ]
  },

  // ============ SCATTERED (4 resets) ============
  {
    id: 'scattered-one-breath',
    emotionalState: 'scattered',
    type: 'interactive',
    title: 'One Breath Focus',
    description: 'Return to center with intentional breathing',
    scienceBenefit: 'Activates focus centers in the brain',
    duration: 90,
    color: 'from-cyan-400 to-blue-500',
    interactiveType: 'breathing',
    interactiveSteps: [
      { instruction: 'Focus all your attention on your next breath in...', duration: 6, input: 'breath' },
      { instruction: 'And all your attention on the breath out...', duration: 6, input: 'breath' },
      { instruction: 'One breath. Just this one. Fully present...', duration: 8, input: 'breath' },
      { instruction: 'Repeat. Each breath an anchor to now...', duration: 30, input: 'breath' },
      { instruction: 'When your mind wanders, gently return to breath...', duration: 15 },
      { instruction: 'Feel your scattered energy gathering back to center...', duration: 15 }
    ]
  },
  {
    id: 'scattered-box-visualization',
    emotionalState: 'scattered',
    type: 'interactive',
    title: 'Box Visualization',
    description: 'Trace a box to gather wandering thoughts',
    scienceBenefit: 'Visual focus trains attention control',
    duration: 120,
    color: 'from-slate-400 to-slate-500',
    interactiveType: 'visualization',
    interactiveSteps: [
      { instruction: 'Imagine a box floating in front of you', duration: 10 },
      { instruction: 'Trace the top edge slowly with your eyes', duration: 10, input: 'tap' },
      { instruction: 'Trace down the right side', duration: 10, input: 'tap' },
      { instruction: 'Along the bottom edge', duration: 10, input: 'tap' },
      { instruction: 'Up the left side, completing the box', duration: 10, input: 'tap' },
      { instruction: 'Repeat, going slower each time', duration: 30, input: 'tap' },
      { instruction: 'Feel your scattered attention gathering to one point', duration: 15 }
    ]
  },
  {
    id: 'scattered-anchor-story',
    emotionalState: 'scattered',
    type: 'story',
    title: 'Attention Anchor Story',
    description: 'Guided imagery to reclaim your focus',
    scienceBenefit: 'Metaphor helps reorganize scattered attention',
    duration: 120,
    color: 'from-teal-400 to-cyan-500',
    storyContent: [
      { text: 'Imagine your attention like leaves scattered by the wind...', duration: 12 },
      { text: 'Each thought pulling you in a different direction...', duration: 10 },
      { text: 'Now picture a magnet, pulling all those scattered pieces back...', duration: 12 },
      { text: 'One by one, the leaves return, gathering at your center...', duration: 14 },
      { text: 'Your scattered energy becomes a single, focused beam of light...', duration: 14 },
      { text: 'You are not fighting distraction. You are choosing focus...', duration: 12 },
      { text: 'Feel yourself centered, gathered, ready...', duration: 12 },
      { text: 'Breathe in your renewed clarity and purpose...', duration: 10 }
    ]
  },
  {
    id: 'scattered-sensory-focus',
    emotionalState: 'scattered',
    type: 'interactive',
    title: 'Single Sense Focus',
    description: 'Anchor attention through one sense at a time',
    scienceBenefit: 'Trains selective attention and reduces mental clutter',
    duration: 90,
    color: 'from-emerald-400 to-green-500',
    interactiveType: 'grounding',
    interactiveSteps: [
      { instruction: 'Focus only on what you can hear for 20 seconds', duration: 20 },
      { instruction: 'Now shift: focus only on what you can feel (touch)', duration: 20 },
      { instruction: 'Finally: focus only on what you can see', duration: 20 },
      { instruction: 'Notice how your scattered attention is now under your control', duration: 15 },
      { instruction: 'You can choose where to place your focus', duration: 15 }
    ]
  }
];

// Helper to get resets by emotional state
export function getResetsByEmotion(emotion: EmotionalState): Reset[] {
  return RESETS.filter(r => r.emotionalState === emotion);
}

// Emotional state info
export const EMOTIONAL_STATES: Record<EmotionalState, {
  label: string;
  color: string;
  description: string;
}> = {
  stressed: {
    label: 'Stressed',
    color: 'from-slate-500 to-slate-600',
    description: 'Feeling pressure and tension'
  },
  anxiety: {
    label: 'Anxious',
    color: 'from-pink-500 to-rose-600',
    description: 'Worried or uneasy'
  },
  restless: {
    label: 'Restless',
    color: 'from-amber-500 to-orange-600',
    description: 'Unable to stay still'
  },
  overwhelmed: {
    label: 'Overwhelmed',
    color: 'from-slate-500 to-slate-600',
    description: 'Too much to handle'
  },
  tired: {
    label: 'Tired',
    color: 'from-blue-500 to-cyan-600',
    description: 'Low energy and fatigued'
  },
  scattered: {
    label: 'Scattered',
    color: 'from-green-500 to-teal-600',
    description: 'Unfocused and distracted'
  }
};
