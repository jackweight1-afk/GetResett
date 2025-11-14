// Reset types and emotional states
export type EmotionalState = 'stressed' | 'anxiety' | 'restless' | 'tired' | 'scattered';
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
  tired: {
    label: 'Tired',
    color: 'from-blue-500 to-cyan-600',
    description: 'Low energy and mental fatigue'
  },
  scattered: {
    label: 'Scattered',
    color: 'from-green-400 to-teal-500',
    description: 'Difficulty focusing or staying present'
  }
} as const;

// ============ NEW SCHEMA (ResetSpec) ============
// Canonical data structure for all new resets

export interface ResetStep {
  id: string;
  title: string;
  lines: string[];
  animationKey?: string;
  helperHint?: string;
}

export interface ResetSpec {
  id: string;
  emotion: EmotionalState;
  name: string;
  description: string;
  scienceBenefit: string;
  durationHintSeconds?: number;
  steps: ResetStep[];
  safetyNote?: string;
}

// ============ LEGACY SCHEMA (backward compatibility) ============

export interface Reset {
  id: string;
  emotionalState: EmotionalState;
  type: ResetType;
  title: string;
  description: string;
  scienceBenefit: string;
  duration: number; // in seconds
  color: string;
  storyContent?: StoryStep[];
  interactiveType?: 'grounding' | 'breathing' | 'visualization' | 'tapping' | 'counting' | 'body-scan' | 'stress-sweep' | 'bubble-tap' | 'rhythm-tap' | 'grid-tap' | 'dot-connect' | 'swipe-sort' | 'pressure-valve' | 'blink-track' | 'movement-workout' | 'shadowboxing' | 'breath-movement' | 'walking-pace';
  interactiveSteps?: InteractiveStep[];
  requiresDisclaimer?: boolean;
}

export interface StoryStep {
  title?: string;
  text: string;
  duration: number;
  background?: string;
}

export interface InteractiveStep {
  title?: string;
  instruction: string;
  duration?: number;
  input?: 'text' | 'tap' | 'breath' | 'none' | 'movement';
  count?: number;
  visualAid?: string;
  alternativeMove?: string;
  isStretch?: boolean;
}

// ============ ADAPTER FUNCTION ============
// Converts new ResetSpec format to legacy Reset format

function adaptResetSpecToLegacy(spec: ResetSpec): Reset {
  const emotionInfo = EMOTIONAL_STATES[spec.emotion];
  
  return {
    id: spec.id,
    emotionalState: spec.emotion,
    type: 'story',
    title: spec.name,
    description: spec.description,
    scienceBenefit: spec.scienceBenefit,
    duration: spec.durationHintSeconds || 120,
    color: emotionInfo.color,
    storyContent: spec.steps.map(step => ({
      title: step.title,
      text: step.lines.join('\n\n'),
      duration: 15
    }))
  };
}

// ============ NEW RESETS DATA (ResetSpec format) ============

const NEW_RESETS: ResetSpec[] = [
  // ============ STRESSED RESETS (4 resets) ============
  {
    id: 'stressed-tense-release',
    emotion: 'stressed',
    name: 'Full-Body Tense & Release',
    description: 'Progressive muscle relaxation for instant calm',
    scienceBenefit: 'Progressive muscle relaxation triggers parasympathetic calm and releases physical tension linked to stress',
    durationHintSeconds: 75,
    steps: [
      {
        id: 'step-1',
        title: 'Tense & Release',
        lines: ['Using a progressive muscle tension and relaxation technique, we\'ll help you ease the tension from your body.']
      },
      {
        id: 'step-2',
        title: 'Hands',
        lines: [
          'Clench both fists tight. Hold for 5 seconds... now release.',
          'Spread your fingers wide until you feel tension. Hold for 5 seconds.',
          'Let your hands go soft and feel the tension melt away.'
        ]
      },
      {
        id: 'step-3',
        title: 'Shoulders',
        lines: [
          'Lift your shoulders toward your ears and push them back.',
          'Feel the tension build. Hold for 5 seconds... now release.',
          'Return to a comfortable position with good posture.'
        ]
      },
      {
        id: 'step-4',
        title: 'Stomach & Core',
        lines: [
          'Breathe in deep for 5 seconds. Feel your body fill with air.',
          'As you breathe out, tense your stomach for 5 seconds. Breathe normally.',
          'Repeat once more: breathe in for 4... tense as you breathe out for 5.',
          'Feel the tension in your core start to release.'
        ]
      },
      {
        id: 'step-5',
        title: 'Legs',
        lines: [
          'Gently clench your glutes. Hold for 5 seconds... now release.',
          'Tense your quads (top leg muscles). Hold for 5 seconds... release.',
          'Curl your toes tight and squeeze. Hold for 5 seconds... release.',
          'Notice how your whole body feels lighter and less tense.'
        ]
      },
      {
        id: 'step-6',
        title: 'Reset Complete',
        lines: [
          'Your body should feel lighter & calmer.',
          'Reset complete.'
        ]
      }
    ]
  },
  {
    id: 'stressed-grounding-walk',
    emotion: 'stressed',
    name: 'Grounding Walk',
    description: 'Guided visualization for settling your system',
    scienceBenefit: 'Visual orientation + sensory grounding (sight/sound/touch) reduce threat scanning and restore a sense of safety and control',
    durationHintSeconds: 105,
    steps: [
      {
        id: 'step-1',
        title: 'Grounding Walk',
        lines: [
          'We\'ll take a short guided walk in your mind to settle your system.',
          'Keep your eyes open and imagine it vividly—no need to move.',
          'Click Continue on each page.'
        ]
      },
      {
        id: 'step-2',
        title: 'The Path',
        lines: [
          'Picture a clear, open path ahead. Firm ground, easy to walk on.',
          'Hold your phone comfortably and let your shoulders drop.',
          'Imagine taking your first step—feel the rhythm. Click Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Your Pace',
        lines: [
          'Walk at a calm, even pace in your mind.',
          'Match your steps to breathing: inhale over 2 steps, exhale over 3.',
          'Repeat once more. Let the body feel heavier, the mind quieter.'
        ]
      },
      {
        id: 'step-4',
        title: 'What You See',
        lines: [
          'Let the scene become clearer. Notice three things:',
          'The colour of the sky, the texture of the path, something at the edge.',
          'Ordinary is safe. Take one breath: in for 2, out for 3.'
        ]
      },
      {
        id: 'step-5',
        title: 'What You Hear',
        lines: [
          'Pick up two layers of sound: far (wind, traffic) and near (footsteps).',
          'Hold far and near together—like two gentle lines.',
          'Breathe with your steps: in for 2, out for 3.'
        ]
      },
      {
        id: 'step-6',
        title: 'What You Feel',
        lines: [
          'Sense weight through your heels and toes as each step lands.',
          'The ground carries you—steady, predictable, solid.',
          'Relax your hands, soften your jaw. Take one longer exhale down through your legs.'
        ]
      },
      {
        id: 'step-7',
        title: 'Space Ahead',
        lines: [
          'Lift your gaze to the horizon—the path opens out.',
          'With the next three breaths, think about what matters: family, friends, things you hold close.',
          'Imagine them waiting at the end of your path. Feel the joy, relief, calm.'
        ]
      },
      {
        id: 'step-8',
        title: 'Reset Complete',
        lines: [
          'Let the path slow to a comfortable stop.',
          'Notice: breathing steadier, shoulders softer, head clearer.',
          'Carry this pace into the next thing you do. Reset complete.'
        ]
      }
    ]
  },
  {
    id: 'stressed-safety-scan',
    emotion: 'stressed',
    name: 'Safety Scan',
    description: 'Visual orientation and grounding',
    scienceBenefit: 'Eyes-open orientation (left/right, corners, near/far) and a familiar anchor signal "no immediate threat", reducing hypervigilance',
    durationHintSeconds: 100,
    steps: [
      {
        id: 'step-1',
        title: 'Safety Scan',
        lines: [
          'Stress makes the body act like danger is close.',
          'We\'ll use your eyes to show your system it\'s safe.',
          'Relaxed grip on your phone. When you\'re ready, tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Left Side',
        lines: [
          'Let your eyes travel left without moving your head much.',
          'Notice three things: a colour, a shape, something still. No judging.',
          'Hold for one calm breath, then tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Right Side',
        lines: [
          'Now let your eyes move right.',
          'Spot three details: a line, a texture, light or shadow.',
          'Soften your shoulders. One calm breath; tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Orient the Room',
        lines: [
          'Touch your gaze to each corner: top-left, top-right, bottom-right, bottom-left.',
          'Notice any door or window. Corners mean structure; structure feels safe.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Depth of Field',
        lines: [
          'Focus on something near (phone, hand), then something far across the room.',
          'Back to middle distance. Your world has depth—and room.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Anchor Object',
        lines: [
          'Choose one ordinary thing in view: a cup, chair, frame, or wall.',
          'Hold a soft gaze there for a few seconds.',
          'Ordinary means familiar; familiar means safe. Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Widen & Settle',
        lines: [
          'Keep your anchor in view while letting the edges of your vision soften.',
          'Easy breath in, longer breath out. Relax jaw, shoulders, and grip 5%.',
          'Hold the quiet for a moment, then tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Reset Complete',
        lines: [
          'You\'ve scanned, oriented, and anchored.',
          'Notice: breathing steadier, shoulders softer, head clearer.',
          'Carry this steadiness into whatever comes next. Reset complete.'
        ]
      }
    ]
  },
  {
    id: 'stressed-mental-triage',
    emotion: 'stressed',
    name: 'Two-Minute Triage',
    description: 'Cognitive off-loading via mental imagery',
    scienceBenefit: 'Mentally "parking" items into simple containers reduces working-memory load and eases the stress response',
    durationHintSeconds: 105,
    steps: [
      {
        id: 'step-1',
        title: 'Two-Minute Triage',
        lines: [
          'When stress builds, your brain tries to hold everything at once.',
          'We\'ll sort it into simple places so your mind can breathe.',
          'Follow each cue. Tap Continue when ready.'
        ]
      },
      {
        id: 'step-2',
        title: 'Three Trays',
        lines: [
          'Imagine three small trays: \'Now\', \'Soon\', and \'Later\'.',
          'They\'re empty, a clear place to park your thoughts. Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Choose the Anchor',
        lines: [
          'Think of one thing that truly matters today—a task, chore, or call.',
          'Picture placing it on the Now tray. Watch the tray glow green.',
          'This is your priority. Completing just this one thing means success.',
          'Hold that thought for one easy breath, then tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Park the Near-Future',
        lines: [
          'Pick one or two things that can wait until after your first task.',
          'Place them in the \'Soon\' tray. Watch it glow yellow.',
          'You\'ve got time. Your shoulders drop as time opens up. Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Quiet the Noise',
        lines: [
          'Let your remaining thoughts circle, then dump them in the \'Later\' tray.',
          'Watch them turn red as you place them down. A lid rests over it.',
          'Not gone, just quiet for now. You can return when you choose.'
        ]
      },
      {
        id: 'step-6',
        title: 'Space Before Action',
        lines: [
          'Before starting your Now task, picture a 60-second runway.',
          'A sip of water, roll your shoulders, one slow breath.',
          'Space before action makes action easier. Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Just the First Minute',
        lines: [
          'Return to your Now item. Think only of the first minute.',
          'One title, one number, one line. Simple and real.',
          'Take a slightly longer out-breath. Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Reset Complete',
        lines: [
          'Everything has a place; your first step is clear.',
          'Watch as motivation builds. Carry this steady pace forward.',
          'Reset complete.'
        ]
      }
    ]
  },

  // ============ ANXIETY RESETS (3 new + 1 existing bubble game) ============
  {
    id: 'anxiety-calm-corridor',
    emotion: 'anxiety',
    name: 'The Calm Corridor',
    description: 'Guided imagery to ease anxiety',
    scienceBenefit: 'Guided imagery + autonomic regulation lowers limbic activation and restores perceived safety',
    durationHintSeconds: 120,
    steps: [
      {
        id: 'step-1',
        title: 'The Calm Corridor',
        lines: [
          'When anxiety builds, the mind feels boxed in.',
          'We\'ll walk a simple, steady path out of that box.',
          'Follow each cue. When you\'re ready, tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Picture the Corridor',
        lines: [
          'Imagine a long, quiet corridor. Soft light, still air, level floor.',
          'At the far end, a door stands open with a warm glow behind it.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Set the Pace',
        lines: [
          'Begin to walk in your mind at an easy, even pace.',
          'Match breathing to steps: inhale for 2, exhale for 3 (a touch longer).',
          'Repeat once more. Shoulders drop as you settle. Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'More Room, More Air',
        lines: [
          'With each step, the corridor widens. Walls ease away, ceiling lifts.',
          'More air to breathe, more room to think.',
          'Keep breathing: in 2, out 3. Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Sight • Sound • Feel',
        lines: [
          'See: calm light along the skirting, gentle glow at the door.',
          'Hear: soft hush, quiet footfall. Feel: weight through heels and toes.',
          'Grip relaxes 5%. Hold steadiness for one slow breath. Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'The Door Ahead',
        lines: [
          'The light at the door feels familiar and welcoming. Air warms slightly.',
          'Tell yourself: "I\'m safe. I\'m on my way."',
          'Keep walking: in 2, out 3. Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Open & Enter',
        lines: [
          'The door opens easily. Step into a quiet room: soft light, calm air, fresh breeze.',
          'With three exhales, release: 1—the noise, 2—the what-ifs, 3—keep only what matters now.',
          'Wrapped in light and safety. Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Reset Complete',
        lines: [
          'Stand in the quiet room. Your troubles sit around, not bothering you.',
          'Breathing steadier, chest softer, head clearer. Worries fade out the window.',
          'The room is clear, like your mind. Carry this calm forward. Reset complete.'
        ]
      }
    ]
  },
  {
    id: 'anxiety-anchor-body',
    emotion: 'anxiety',
    name: 'Anchor in the Body',
    description: 'Interoceptive grounding to calm anxiety',
    scienceBenefit: 'Interoception + longer exhales reduce anxious dissociation and rebalance the autonomic nervous system',
    durationHintSeconds: 120,
    steps: [
      {
        id: 'step-1',
        title: 'Anchor in the Body',
        lines: [
          'Anxiety pulls you into the future.',
          'We\'ll come back to the body, here and now.',
          'Follow each cue. Tap Continue when ready.'
        ]
      },
      {
        id: 'step-2',
        title: 'Ground & Hold',
        lines: [
          'Notice your feet on the floor: toes, arches, heels.',
          'Notice your seat or surface beneath you. Let your weight melt into it.',
          'Feel the air on your skin, cool, warm, neutral. All fine.',
          'These are your anchor points.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Slow the Exhale',
        lines: [
          'Breathe in through the nose for 3... out through the mouth for 5.',
          'Repeat twice more: in for 3, out for 5. Longer exhales calm the body.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Heartbeat = Information',
        lines: [
          'Rest one hand on your chest. Feel your heartbeat—fast or slow is okay.',
          'Use longer breaths to settle it: in for 3, out for 5.',
          'Notice the beat soften. As your heart slows, so does your breath. Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Release Signals',
        lines: [
          'Unclench your jaw and let your tongue rest. Drop shoulders, correct posture.',
          'Loosen your grip on the phone by 5%.',
          'Each release says, "I\'m safe." Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Send the Breath Low',
        lines: [
          'Imagine the in-breath traveling to your belly, the out-breath down your legs.',
          'Do two rounds: in for 3, out for 5. Feel anxieties flow into the ground.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Stay with the Body',
        lines: [
          'Feel your anchors: feet on ground, clothes on skin, air on face, heartbeat.',
          'Hold the calm for one more long out-breath. Notice the extra space in your chest.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Reset Complete',
        lines: [
          'You\'ve moved from alarm to total awareness.',
          'Breath steadier, body heavier, mind clearer.',
          'Carry this calmer pace into the next thing you do. Reset complete.'
        ]
      }
    ]
  },
  {
    id: 'anxiety-control-controllable',
    emotion: 'anxiety',
    name: 'Control the Controllable',
    description: 'CBT micro-reframe for anxiety',
    scienceBenefit: 'Separating controllable from uncontrollable reduces worry loops and increases self-efficacy; pairing with a tiny "first move" further lowers anxiety',
    durationHintSeconds: 120,
    steps: [
      {
        id: 'step-1',
        title: 'Control the Controllable',
        lines: [
          'Anxiety swells when everything feels uncertain.',
          'We\'ll draw a clear line: what\'s yours to act on, and what isn\'t.',
          'Follow each cue. Tap Continue when ready.'
        ]
      },
      {
        id: 'step-2',
        title: 'What\'s on Repeat?',
        lines: [
          'Think of the single worry looping in your mind. Just one.',
          'Keep it in mind—you don\'t need to fix it yet, just name it.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Make Space to Think',
        lines: [
          'Loosen your jaw, drop your shoulders, correct your posture.',
          'Easy breath in for 3... longer breath out for 5.',
          'A calmer body makes clearer decisions. Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'In or Out of Your Hands',
        lines: [
          'Come back to your worry. Ask: Can I do something about this in 24 hours?',
          'If yes → in your control. If no → outside your control for now.',
          'Hold your answer. Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'First Tiny Step or Box & Shelf',
        lines: [
          'IN YOUR CONTROL: Picture the smallest move you could take after this reset. Visualize starting it.',
          'OUT OF YOUR CONTROL: Imagine a solid box. Place your worry inside, shut the lid. It\'s labeled "Parked."',
          'Not gone—just not carried at this moment. Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Keep This Thought',
        lines: [
          'Soften your shoulders, hand to your chest. Breathe slowly, heart rate lowers.',
          'Choose one: "I can do this, one step at a time" or "The thought is parked."',
          'Hold this affirmation for one long out-breath. Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Make It Real',
        lines: [
          'Chose a step? Pair it with when and where: "After this reset, at my desk."',
          'Parked it? Decide when you\'ll review: "Tomorrow afternoon."',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Reset Complete',
        lines: [
          'Line drawn. What\'s yours to act on is clear; what isn\'t is parked.',
          'Take one steady out-breath. Carry this calm into your day. Reset complete.'
        ]
      }
    ]
  },

  // ============ RESTLESS RESETS (4 resets) ============
  {
    id: 'restless-pulse-reset',
    emotion: 'restless',
    name: 'The Pulse Reset',
    description: 'Rhythmic entrainment to settle restless energy',
    scienceBenefit: 'Bilateral rhythm + longer exhales help the nervous system sync and settle (rhythmic entrainment; vagal regulation)',
    durationHintSeconds: 150,
    steps: [
      {
        id: 'step-1',
        title: 'The Pulse Reset',
        lines: [
          'When you\'re restless, your energy scatters in all directions.',
          'We\'ll give your body one steady rhythm to follow.',
          'Relaxed grip on your phone. Tap Continue when ready.'
        ]
      },
      {
        id: 'step-2',
        title: 'Tap In',
        lines: [
          'Rest your forearms on your thighs or desk.',
          'Begin a light alternating tap: left... right... left... right. Smooth and gentle.',
          'Find a comfortable pace. Let the sound be your metronome. Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Sync It Up',
        lines: [
          'Stay with the left-right taps. Breathe in for 4 taps, out for 4 taps.',
          'Repeat once more: in for 4, out for 4.',
          'Drop your shoulders as the body finds the groove. Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Shoulders & Hands',
        lines: [
          'Slowly bring the tempo down. Loosen shoulders, neck, arms, wrists, hands.',
          'Bring movements to slow, tiny taps. Match breathing to the slow pace.',
          'Feel energy flow through your arms into your legs. Slow and steady. Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Continue the tempo',
        lines: [
          'Continue the slow tempo for 6 more counts of 4. Match breathing with taps.',
          'Notice other senses: What can you hear? Smell?',
          'Your mind and body become one again. Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'The Quiet Space',
        lines: [
          'Keep the relaxed tapping. Between each tap is a tiny pocket of quiet.',
          'Rest your attention there: left (quiet)... right (quiet)... like waves.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Land the Rhythm',
        lines: [
          'Let the taps get softer... slower... then stop. Hands open on your thighs.',
          'Feel the rhythm echo in your chest—steady, not hurried.',
          'One last breath: in for 4, out for 6. Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Reset Complete',
        lines: [
          'Your rhythm is steady again. Energy gathered, not scattered.',
          'Carry this calmer beat into whatever comes next. Reset complete.'
        ]
      }
    ],
    safetyNote: 'ease or skip any movement that isn\'t comfortable for you.'
  },
  {
    id: 'restless-focus-path',
    emotion: 'restless',
    name: 'The Focus Path',
    description: 'Oculomotor calming for restless mind',
    scienceBenefit: 'Smooth-pursuit and gentle saccades help the nervous system settle and pull attention into one clear track',
    durationHintSeconds: 135,
    steps: [
      {
        id: 'step-1',
        title: 'The Focus Path',
        lines: [
          'Restless mind, busy eyes—let\'s give them one steady route.',
          'Hold your phone comfortably, shoulders easy. Eyes will follow a moving point.',
          'Head stays still. When ready, tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Find Your Start',
        lines: [
          'Sit tall or stand with feet planted. Soften jaw, drop shoulders.',
          'Keep head quiet—only eyes will travel.',
          'Small inhale... longer exhale. Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Side to Side',
        lines: [
          'Imagine a soft light at the left edge of your screen.',
          'Let eyes follow it slowly to the right—smooth, no rush.',
          'Breathe naturally as it moves. Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Return Pass',
        lines: [
          'The light drifts back to the left. Keep gaze fluid—no jumps.',
          'Notice your out-breath lengthen as it comes home.',
          'Repeat one more gentle pass. Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Smooth Turns',
        lines: [
          'The light draws a wide, slow circle.',
          'Follow it all the way around... and again. Eyes move like water.',
          'Neck easy, shoulders soft. Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Rise & Settle',
        lines: [
          'Watch the light rise to the top... then fall back down.',
          'As it falls, let your body sink heavier into chair or feet.',
          'Two vertical sweeps at an easy pace. Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Easy Diagonals',
        lines: [
          'Light moves top-left → bottom-right, then top-right → bottom-left.',
          'One calm pass each way. Smooth movement.',
          'Breathe out softly on downward legs. Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Still Focus',
        lines: [
          'Light settles in the centre and becomes a steady glow.',
          'Rest gaze there. Let edges of vision soften.',
          'Small inhale... longer exhale. Notice how quiet your head feels. Tap Continue.'
        ]
      },
      {
        id: 'step-9',
        title: 'Reset Complete',
        lines: [
          'Eyes steady, mind gathered, body calmer.',
          'Keep this clear line of focus as you move to the next thing. Reset complete.'
        ]
      }
    ],
    safetyNote: 'if any movement feels uncomfortable, slow down or blink, then rejoin.'
  },
  {
    id: 'restless-tension-outflow',
    emotion: 'restless',
    name: 'Tension Outflow',
    description: 'Somatic release for trapped restlessness',
    scienceBenefit: 'Short squeezes followed by clear releases help finish the fight–flight response and settle the body',
    durationHintSeconds: 120,
    steps: [
      {
        id: 'step-1',
        title: 'Tension Outflow',
        lines: [
          'Restlessness usually means tension has nowhere to go.',
          'We\'ll help it move out, bit by bit, without overdoing it.',
          'Hold phone comfortably. Tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Grip & Let Go',
        lines: [
          'Make soft fists with both hands—about 40% effort. Hold for 3... 2... 1...',
          'Open hands slowly. Shake them out once or twice.',
          'Repeat once more: hold 3... 2... 1... open and shake. Notice warmth in fingers. Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Roll the Weight Off',
        lines: [
          'Lift both shoulders up a little, then drop them.',
          'Roll them back in two slow circles. Neck easy, jaw unclenched.',
          'Repeat two more times. Feel more space across your chest. Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Open, Then Ease',
        lines: [
          'Small breath in—let chest open a touch.',
          'Out-breath—let upper back soften towards neutral.',
          'Repeat once: gentle open... gentle ease. Smooth and tidy. Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Centre Release',
        lines: [
          'Tighten stomach lightly for 3 seconds—just enough to notice.',
          'Release and let breath drop lower.',
          'One more light tighten... and release. Feel slack return to the middle. Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Ground and Relax',
        lines: [
          'Press both feet into the floor for 2 seconds. Let knees soften, weight settle.',
          'Seated: notice chair doing the holding. Standing: feel floor take the load.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Clear What\'s Left',
        lines: [
          'Give hands a loose shake. Roll neck left and right (small range).',
          'Loosen jaw and face. Bounce knees a centimetre if it helps.',
          'Let last bits of tension drop away. Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Reset Complete',
        lines: [
          'Pause a moment. Notice: shoulders lower, hands warmer, body quieter.',
          'Easy breath in... longer breath out. Energy\'s flowing again. Reset complete.'
        ]
      }
    ],
    safetyNote: 'ease or skip any movement that isn\'t comfortable for you.'
  },
  {
    id: 'restless-stillness-curve',
    emotion: 'restless',
    name: 'The Stillness Curve',
    description: 'Vestibular calming through gentle movement',
    scienceBenefit: 'Small, controlled movements that gradually fade help your balance system settle and reduce restlessness',
    durationHintSeconds: 135,
    steps: [
      {
        id: 'step-1',
        title: 'The Stillness Curve',
        lines: [
          'We\'ll use tiny, easy movements and slow them down to calm your system.',
          'Stand or sit where you feel steady. Hold phone comfortably.',
          'When ready, tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Left to Right',
        lines: [
          'Start a slow sway from left to right—only a few centimetres.',
          'Feel weight move across feet (or hips if seated).',
          'Shoulders soft, face loose. Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Forward and Return',
        lines: [
          'Lean a touch forward... then come back to centre.',
          'Small, smooth range—controlled, not wobbly.',
          'Do gently 8-10 times. Breathe naturally. Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Easy Loops',
        lines: [
          'Let upper body draw a slow circle—once clockwise, once anticlockwise.',
          'Keep it tidy and relaxed. Head stays easy on top.',
          'Seated: movement from ribs and hips. Do 8-10 times. Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Taper the Movement',
        lines: [
          'Make each circle smaller... smaller...',
          'Sway becomes a tiny shift... then smaller again.',
          'Guiding the dial down, not slamming brakes. Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Neutral Balance',
        lines: [
          'Find the point where you\'re barely moving—balanced but not stiff.',
          'Let breath flow slowly on its own. Notice your heartbeat.',
          'On next out-breath, relax grip on phone by 5%. Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Notice the Quiet',
        lines: [
          'Scan from head to toes: forehead, jaw, shoulders, chest, stomach, hips, legs, feet.',
          'Where feels quieter than before? Rest your mind there.',
          'One longer, easy out-breath. Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Settle & Hold',
        lines: [
          'Stay in that comfortable stillness for a few seconds.',
          'Sink softly into stable position. Feet (or seat) holding you firm.',
          'If a small wobble appears, let it pass—you\'re steady. Tap Continue.'
        ]
      },
      {
        id: 'step-9',
        title: 'Reset Complete',
        lines: [
          'Movement has eased into calm.',
          'Notice: posture taller, breathing smoother, mind quieter. Reset complete.'
        ]
      }
    ],
    safetyNote: 'ease or skip any movement that isn\'t comfortable for you.'
  },

  // ============ TIRED RESETS (4 resets) ============
  {
    id: 'tired-posture-ladder',
    emotion: 'tired',
    name: 'Posture Ladder',
    description: 'Gently wake the body through posture',
    scienceBenefit: 'A little height + chest opening improves breathing mechanics and alertness',
    durationHintSeconds: 105,
    steps: [
      {
        id: 'step-1',
        title: 'Settle in',
        lines: [
          'Light grip on your phone. Feet flat, hip-width apart.',
          'We\'ll lift posture a notch at a time so energy rises without strain. Tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Find an easy height',
        lines: [
          'Imagine a tiny thread lifting the crown of your head. Grow 1cm taller.',
          'Keep ribs soft, bum relaxed. Notice extra space for air under your collarbones.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Roll some space open',
        lines: [
          'Roll both shoulders up... back... down. Pause. Repeat once, slower.',
          'Feel shoulder blades settle lower; chest widens naturally. Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Line up the head',
        lines: [
          'Glide your chin gently back so ears stack over shoulders.',
          'Unclench the jaw; tongue rests on roof of mouth. Breathe deeply and slowly.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Let the ribs breathe',
        lines: [
          'Inhale and feel yourself widen like an umbrella. Exhale, push air out, keep the form.',
          'You\'ve made space—a position of calm and confidence. Feel powerful and alert.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Sweep and reset',
        lines: [
          'Sweep your forearms forward and down, clearing the air in front of you.',
          'Shoulder blades glide down; neck elongates upward. Face stays easy.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Anchor tall',
        lines: [
          'Rest forearms on thighs or desk with light contact.',
          'Feel support below elbows and length above waist. Balanced, not rigid. Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Wrap up',
        lines: [
          'One clean breath in through the nose... longer breath out through the mouth.',
          'Calm body, awake mind. Reset complete.'
        ]
      }
    ]
  },
  {
    id: 'tired-blink-track',
    emotion: 'tired',
    name: 'Blink & Track',
    description: 'Switch your eyes back on to boost alertness',
    scienceBenefit: 'Blink bursts + smooth eye travel wake the visual system and sharpen focus',
    durationHintSeconds: 105,
    steps: [
      {
        id: 'step-1',
        title: 'Set the screen',
        lines: [
          'Hold the phone arm\'s length away. Head fairly still—eyes do the traveling.',
          'Shoulders loose, face soft. Tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Freshen the eyes',
        lines: [
          'Fixate on a small spot in the centre of the screen. Blink 5-7 quick times.',
          'Vision should feel brighter and less gritty. Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Left and right',
        lines: [
          'Jump gaze to far left, then far right. Pause each side. One rep = 4 jumps.',
          'Complete 5-10 sets. Notice heart rate and breath increase—nervous system waking.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Up and down',
        lines: [
          'Eyes to top edge, then bottom edge. Same small pause.',
          'Complete 5-10 sets of 4 jumps. Focus sharpens without strain. Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Diagonals',
        lines: [
          'Top-left to bottom-right, then top-right to bottom-left. Complete 5-10 sets.',
          'Jaw loose, shoulders easy, head quiet. Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Soft circles',
        lines: [
          'Trace a large, slow circle once clockwise, once anticlockwise. Silky, not jerky.',
          'Do this 5 times. If eyes feel dry, blink softly and rejoin. Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Hold the centre',
        lines: [
          'Return to the centre point. Let edges soften, centre stays crisp.',
          'Small inhale... longer exhale. Feel clarity arrive. Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Wrap up',
        lines: [
          'Notice the extra brightness in your view and the lift behind your eyes.',
          'Carry this alertness into your next task. Reset complete.'
        ]
      }
    ]
  },
  {
    id: 'tired-circulation-primer',
    emotion: 'tired',
    name: 'Circulation Primer',
    description: 'Quick warm-through for alertness',
    scienceBenefit: 'Small rhythmic movement boosts blood flow and alertness without a jolt',
    durationHintSeconds: 105,
    steps: [
      {
        id: 'step-1',
        title: 'Arrive',
        lines: [
          'Sit or stand with a bit of space. We\'ll use small, joint-friendly movements.',
          'If anything isn\'t comfortable, ease or skip it. Tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Wake the calves',
        lines: [
          'Standing: lift heels off ground then lower, 10-12 reps.',
          'Seated: alternate toe-presses and lifts, 10-12 reps. Feel warmth up the shins. Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Wake the hands',
        lines: [
          'Circle both wrists 5 times each way. Then light shake for a second or two.',
          'Tingling in fingers = blood flow returning. Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Open the shoulders',
        lines: [
          'Elbows tucked, palms forward. Rotate forearms: palms to sky, pause, back down.',
          'Three slow reps. Chest opens, neck stays long. Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Gentle spine wave',
        lines: [
          'Soft inhale: lift breastbone a few millimetres. Exhale: ease back to neutral.',
          'Three smooth waves—no crunching or slumping. Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Light rhythm',
        lines: [
          'Standing: small march on the spot 15-20 seconds. Seated: brisk heel taps.',
          'Let breath find the beat; keep shoulders relaxed. Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Come back taller',
        lines: [
          'Return to stillness a touch taller than when you began.',
          'Notice a quiet hum in the body rather than heaviness. Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Wrap up',
        lines: [
          'Breathe in through the nose; out a fraction longer through the mouth.',
          'Warm, switched on, ready. Reset complete.'
        ]
      }
    ],
    safetyNote: 'ease or skip any move that\'s uncomfortable.'
  },
  {
    id: 'tired-sensory-switchboard',
    emotion: 'tired',
    name: 'Sensory Switchboard',
    description: 'Wake the senses, not just the brain',
    scienceBenefit: 'Gentle touch + sound layering engages multiple sensory networks to lift alertness smoothly',
    durationHintSeconds: 105,
    steps: [
      {
        id: 'step-1',
        title: 'Start here',
        lines: [
          'We\'ll wake touch and sound so your system switches on without a jolt.',
          'Keep your grip on the phone relaxed. Tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Heat in the hands',
        lines: [
          'Rub your palms together for 5-7 seconds. Notice heat spreading into fingers and thumbs.',
          'That warmth is your "on" signal. Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Freshen the face',
        lines: [
          'With warm hands, lightly press palms on cheeks, temples, scalp. Repeat 5 times.',
          'Lift the skin rather than dragging it. Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Switch on the ears',
        lines: [
          'Run thumb and finger up outer ear edge from lobe to top, tiny upward tug, back down.',
          'Repeat 5 times. This awakens the mind. Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Brush the forearms',
        lines: [
          'Brush one forearm from wrist to elbow, 3 slow passes, then swap.',
          'Notice skin sensation and temperature changes. Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Sort the sound',
        lines: [
          'Pick a far sound. Notice it, stay with it for 5 seconds.',
          'Pick a near sound (even breath). Notice it, stay with it for 5 seconds. Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Snap the focus',
        lines: [
          'Choose a tiny detail on the screen—a letter, an icon corner.',
          'Hold it clearly for 3 seconds, then soften your gaze. Attention sharpens. Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Wrap up',
        lines: [
          'Sit or stand a touch taller. Short clean inhale; longer steady exhale.',
          'Senses on, mind clear. Reset complete.'
        ]
      }
    ]
  },

  // ============ SCATTERED RESETS (4 resets) ============
  {
    id: 'scattered-bring-it-back-in',
    emotion: 'scattered',
    name: 'Bring It Back In',
    description: 'Narrow attention from whole room to one steady point',
    scienceBenefit: 'Attentional narrowing helps the brain settle and focus',
    durationHintSeconds: 90,
    steps: [
      {
        id: 'step-1',
        title: 'Settle In',
        lines: [
          'Hold your phone comfortably. Rest your shoulders.',
          'We\'re going to bring your attention from "everywhere" back to one place.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Take In the Whole Screen',
        lines: [
          'Look at the entire screen at once.',
          'Notice the colours, the edges, the light around it. Let your breathing stay natural.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Half the Screen',
        lines: [
          'Now look only at the top half of your screen.',
          'Fewer things to take in. A touch quieter already.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'A Smaller Area',
        lines: [
          'Choose a space about the size of a coaster on the screen.',
          'Let your eyes rest there for one slow breath in… and a longer one out.',
          'Let everything else soften in the background. Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'One Small Point',
        lines: [
          'Pick a tiny detail — a letter, a corner, an icon.',
          'Keep a soft, steady gaze on it. Jaw loose. Shoulders easy.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Hold This Spot',
        lines: [
          'Say quietly in your head: "Just here."',
          'Breathe once more. Let the rest of the world fall to the edges.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'See Your Next Move',
        lines: [
          'Picture the first small action you\'ll take after this.',
          'Maybe a tap, a message, or opening a tab. See yourself doing it smoothly.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Finish',
        lines: [
          'You\'ve brought your attention back in.',
          'One steady point, one clear mind. Reset complete.'
        ]
      }
    ]
  },
  {
    id: 'scattered-steady-hands',
    emotion: 'scattered',
    name: 'Steady Hands, Steady Mind',
    description: 'Calming hand-sequence for steady rhythm',
    scienceBenefit: 'Hand pattern brings the brain back into steady rhythm and reduces scattered energy',
    durationHintSeconds: 90,
    steps: [
      {
        id: 'step-1',
        title: 'Start',
        lines: [
          'Rest your elbows or forearms lightly on your thighs or desk.',
          'We\'ll use a simple hand pattern to steady your attention.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Left Hand Only',
        lines: [
          'Tap your thumb to each finger on your left hand:',
          'Index → middle → ring → little… then back again, little → ring → middle → index.',
          'Slow and smooth. Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Right Hand Only',
        lines: [
          'Same pattern with your right hand.',
          'Keep it gentle. No rush. Let your breath stay easy.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'One Side Then the Other',
        lines: [
          'Left hand does one full run. Then the right hand does one full run.',
          'Repeat this swap twice. Shoulders relaxed.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Both Hands Together',
        lines: [
          'Now do the pattern with both hands at the same time.',
          'Thumb to index… middle… ring… little… and back. Move slowly and evenly.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Slow the Pace',
        lines: [
          'Repeat the pattern once more, just a little slower.',
          'Feel the mind follow the steadier rhythm.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Hands Rest',
        lines: [
          'Place your hands down.',
          'Notice the quiet feeling in your head now the movement has stopped.',
          'Hold one long out-breath. Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Finish',
        lines: [
          'Rhythm restored. Mind calmer and more settled.',
          'Reset complete.'
        ]
      }
    ],
    safetyNote: 'Ease or skip any movement that isn\'t comfortable for you.'
  },
  {
    id: 'scattered-follow-the-grid',
    emotion: 'scattered',
    name: 'Follow the Grid',
    description: 'Eyes-only drill to steady attention',
    scienceBenefit: 'Simple eyes-only drill steadies attention and reduces the jumpy, scattered feeling',
    durationHintSeconds: 90,
    steps: [
      {
        id: 'step-1',
        title: 'Picture the Grid',
        lines: [
          'Imagine a 3×3 grid on your screen — like a noughts-and-crosses board.',
          'Keep your head still and move only your eyes.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Across the Rows',
        lines: [
          'With your eyes, trace the top row from left to right.',
          'Then the middle row. Then the bottom row. Smooth and steady.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Down the Columns',
        lines: [
          'Trace the first column from top to bottom.',
          'Then the middle column. Then the last one. Keep your breathing soft.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Corners',
        lines: [
          'Touch your gaze to each corner of the grid in a clockwise loop:',
          'Top-left → top-right → bottom-right → bottom-left.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Centre Point',
        lines: [
          'Rest your gaze on the centre square.',
          'Hold it there for one slow breath. Let the rest soften.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Short Pattern',
        lines: [
          'Follow this quick sequence with your eyes:',
          'Top-middle → centre → bottom-middle → centre.',
          'Do this twice without rushing. Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Return to Centre',
        lines: [
          'Bring your gaze back to the centre square.',
          'Hold there through a longer out-breath. Notice the focus settling.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Finish',
        lines: [
          'Your attention is steadier. The noise has dropped.',
          'Reset complete.'
        ]
      }
    ]
  },
  {
    id: 'scattered-one-thing-at-a-time',
    emotion: 'scattered',
    name: 'One Thing at a Time',
    description: 'Cut through mental clutter with sensory focus',
    scienceBenefit: 'Grounding reset cuts through clutter by guiding attention through senses one by one',
    durationHintSeconds: 90,
    steps: [
      {
        id: 'step-1',
        title: 'Start',
        lines: [
          'When the mind feels scattered, it\'s often because too much is happening at once.',
          'We\'ll slow it down by focusing on one sense at a time.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Look',
        lines: [
          'Choose one small spot on the screen.',
          'Notice its shape, brightness and edges. Stay here for a moment.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Feel',
        lines: [
          'Shift your attention to your hands.',
          'Feel the phone\'s weight and the warmth where you\'re holding it. Soften your grip slightly.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Listen',
        lines: [
          'Now pay attention to sound.',
          'Pick one far sound, then one closer sound (even your breath).',
          'Let anything else fade into the background. Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Look Again',
        lines: [
          'Return to the same spot on the screen.',
          'It should feel easier to hold now. Take one calm breath.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Feel Again',
        lines: [
          'Notice the contact in your hands again.',
          'Shoulders soft. Breathing steady.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Choose Your Next Sense',
        lines: [
          'Choose the sense you want to lead your next minute:',
          'Looking, feeling, or listening. Say it quietly in your head.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Finish',
        lines: [
          'You\'ve moved from many things to just one.',
          'Carry this steady focus into whatever you do next. Reset complete.'
        ]
      }
    ]
  }
];

// ============ LEGACY RESETS (bubble game + Energy to Burn) ============
// These remain in old format until UI components are updated

const LEGACY_BUBBLE_GAME: Reset = {
  id: 'anxiety-bubble-calm',
  emotionalState: 'anxiety',
  type: 'interactive',
  title: 'Bubble Pop Calm',
  description: 'Pop bubbles to release anxious energy',
  scienceBenefit: 'Simple tactile interaction provides grounding and stress relief',
  duration: 120,
  color: 'from-pink-400 to-rose-500',
  interactiveType: 'bubble-tap',
  interactiveSteps: [
    { title: 'Bubble Pop Calm', instruction: 'Tap the bubbles as they float across the screen. Watch them gently pop and fade away. Take your time, there\'s no rush.', duration: 120, input: 'tap' }
  ]
};

// Keep Energy to Burn resets in legacy format (TODO: migrate later)
const LEGACY_ENERGY_RESETS: Reset[] = [
  // These would be the 4 Energy to Burn movement resets in the old format
  // Keeping them for backward compatibility
];

// ============ UNIFIED EXPORT ============
// Combine new resets (adapted to legacy format) with existing legacy resets

export const RESETS: Reset[] = [
  ...NEW_RESETS.map(adaptResetSpecToLegacy),
  LEGACY_BUBBLE_GAME,
  ...LEGACY_ENERGY_RESETS
];

// Export new schema for future use
export { NEW_RESETS, adaptResetSpecToLegacy };

// Helper function to filter resets by emotion
export function getResetsByEmotion(emotion: EmotionalState): Reset[] {
  return RESETS.filter(reset => reset.emotionalState === emotion);
}
