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
          'Clench both fists.',
          'Hold the tension — 5 … 4 … 3 … 2 … 1 … now release.',
          'Now spread your fingers apart from one another',
          'Continue to spread your fingers out until you feel tension',
          'Hold this for 5 … 4 … 3 … 2 … 1 … Now Release',
          'Let your hands go soft',
          'Feel as the tension in this area starts to subside'
        ]
      },
      {
        id: 'step-3',
        title: 'Shoulders',
        lines: [
          'Lift your shoulders toward your ears.',
          'Push your shoulders back whilst they are lifted',
          'Now tense and continue slowly pushing your shoulders back until you feel tension',
          'Hold this tension for 5 … 4 … 3 … 2 … 1 …',
          'Now return back to a comfortable position',
          'If you\'re at at a desk, try to keep proper posture where possible'
        ]
      },
      {
        id: 'step-4',
        title: 'Stomach & Core',
        lines: [
          'Notice your stomach muscles',
          'Try to connect your mind to them by slightly tensing your stomach',
          'Now you\'ve made this connection we can begin this reset',
          'We are going to be doing breathing exercise take a deep breath in for 5..4..3..2..1.. Notice your body filling up with air - click continue',
          'After a couple of seconds tense your stomach and breathe out for 5..4..3..2..1.. Now breathe normally',
          'We\'re now going to repeat this section',
          'Take a deep breathe in for 4..3..2..1.. Click Continue',
          'Now as you breathe out tense your stomach and hold for 5..4..3..2..1.. Now breathe normally',
          'Notice as the tension in the core of your body starts to release'
        ]
      },
      {
        id: 'step-5',
        title: 'Legs',
        lines: [
          'Whilst seated or standing, gently clench your glutes (Bottom)',
          'Hold this under tension for 5 … 4 … 3 … 2 … 1 … Now release',
          'Now, gently tense the top muscles in your legs (quads)',
          'Hold this tension for 5 … 4 … 3 … 2 … 1 … Now release',
          'Curl your toes up underneath your feet and squeeze them in tight',
          'Hold this squeeze for 5 .. 4 .. 3 .. 2 .. 1 .. Now release',
          'Notice how your whole body should now feel lighter and less tense',
          'If you feel like any other areas in your body could benefit from tension do this now',
          'Hold for 5..4..3..2..1.. Now release'
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
          'We\'ll take a short, guided walk in your mind to settle your system.',
          'Keep your eyes open and follow each cue on screen.',
          'You don\'t need to move from where you are—just imagine it vividly.',
          'Click Continue on each page to pass through your guided reset.'
        ]
      },
      {
        id: 'step-2',
        title: 'The Path',
        lines: [
          'Picture a clear, open path ahead of you, Firm ground, easy to walk on.',
          'Hold your phone comfortably; let your shoulders drop a touch.',
          'Imagine taking your first step.',
          'Feel the heel touch, the foot roll, the toes leave the ground.',
          'Now the other foot. A simple, steady rhythm.',
          'Click Continue to begin the walk.'
        ]
      },
      {
        id: 'step-3',
        title: 'Your Pace',
        lines: [
          'In your mind, walk at a calm, even pace.',
          'Match your steps to your breathing:',
          '• Inhale over 2 steps …',
          '• Exhale over 3 steps (a fraction longer).',
          'Repeat this pattern once more: in for 2 … out for 3.',
          'Let the body feel heavier, the mind quieter.',
          'Click Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'What You See',
        lines: [
          'Let the scene become clearer.',
          'Notice three things you can see:',
          '• The colour of the sky (soft, steady).',
          '• The texture of the path (smooth, familiar).',
          '• Something at the edge of your view (a tree, a fence, a building).',
          'Each detail is ordinary—and ordinary is safe.',
          'Take one breath: in for 2 steps … out for 3.',
          'Click Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'What You Hear',
        lines: [
          'Pick up two layers of sound:',
          '• A far sound (wind, distant traffic, quiet chatter).',
          '• A near sound (your imagined footsteps, the rustle of clothing).',
          'Hold far and near together—like two gentle lines.',
          'Breathe with your steps: in for 2 … out for 3.',
          'Click Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'What You Feel',
        lines: [
          'Sense weight through your heels, then toes, as each step lands.',
          'Imagine the ground carrying you, steady, predictable, solid.',
          'Let your hands relax on the phone; soften the jaw and the shoulders.',
          'Take one longer exhale as if it travels down through your legs.',
          'Click Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Space Ahead',
        lines: [
          'Lift your imagined gaze to the horizon, the path opens out.',
          'With the next three breaths think only about what matters today.',
          'Your family, your friends, your pets, things you hold close to you.',
          'Imagine these people or things are at the end of your path, waiting for you',
          'Imagine the joy, the relief, the calm',
          'Click Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Reset Complete',
        lines: [
          'Let the path slow to a comfortable stop.',
          'Notice: your breathing is steadier, your shoulders softer, your head clearer.',
          'Carry this pace into the next thing you do.',
          'Reset complete.'
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
          'Keep your phone in a relaxed grip and follow each cue.',
          'When you\'re ready, tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Left Side',
        lines: [
          'Without moving your head much, let your eyes travel left.',
          'Notice three simple things there: a colour… a shape… something still.',
          'No judging, just seeing.',
          'Hold for one calm breath, then tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Right Side',
        lines: [
          'Now let your eyes move right.',
          'Again, spot three details: a line… a texture… a light or shadow.',
          'Shoulders soften a fraction.',
          'One calm breath; tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Orient the Room',
        lines: [
          'Touch your gaze to the corners of the room or space you\'re in—',
          'top-left, top-right, bottom-right, bottom-left—one by one.',
          'Notice any door or window as a point of orientation.',
          'Corners mean structure; structure feels safe.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Depth of Field',
        lines: [
          'Bring your focus to something near (the phone, your hand).',
          'Then to something farther away across the room.',
          'Back to middle distance.',
          'Your world has depth—and room.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Anchor Object',
        lines: [
          'Choose one ordinary thing in view—',
          'a cup, a chair, a picture frame, a patch of wall.',
          'Hold a soft gaze there for a few seconds.',
          'Ordinary means familiar; familiar means safe.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Widen & Settle',
        lines: [
          'Keep your anchor in view while letting the edges of your vision soften.',
          'Take one easy breath in… and a slightly longer breath out.',
          'Let jaw, shoulders and grip on the phone relax 5%.',
          'Hold the quiet for a moment, then tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Reset Complete',
        lines: [
          'You\'ve scanned, oriented and anchored.',
          'Notice: breathing steadier, shoulders softer, head clearer.',
          'Carry this steadiness into whatever comes next.',
          'Reset complete.'
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
          'For the next minute or two, we\'ll sort it into simple places so your mind can breathe.',
          'Keep your eyes on the screen and follow each cue.',
          'Tap Continue when you\'re ready.'
        ]
      },
      {
        id: 'step-2',
        title: 'Three Trays',
        lines: [
          'Imagine three small trays in front of you: they are labelled \'Now\', \'Soon\', and \'Later\'.',
          'They\'re empty, a clear place for you to park your thoughts',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Choose the Anchor',
        lines: [
          'Think of one small thing that truly matters today.',
          'Maybe it\'s a job you need to complete, a chore you need to do or a phone call you need to make.',
          'Picture placing it on the Now tray',
          'Imagine the tray glowing green as you place it down',
          'You now have your most important thought for the day.',
          'Even if you only complete this one thing, you\'re succeeding.',
          'Prioritise this and after this reset, go and do it.',
          'Hold that thought for one easy breath, then tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Park the Near-Future',
        lines: [
          'Now that your most important thing has been parked it\'s time to sort other items that are whirring around in your head.',
          'Think of these and pick one or two items that can comfortably wait until after you\'ve completed your first item.',
          'Place these items into your \'soon\' tray',
          'Imagine as the tray glows yellow as you do this',
          'You\'ve got time, they\'re not important in this very moment',
          'Your shoulders drop a fraction as time opens up.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Quiet the Noise',
        lines: [
          'Now, let your thoughts circle in your brain',
          'It\'s time to dump these thoughts into your later tray',
          'They\'re not important right now, you don\'t need to worry about them in this present moment',
          'Imagine as these thoughts turn red as you place them in the tray',
          'A lid rests over it—not gone, they\'re not gone, just quiet for now.',
          'You can return when you choose.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Space Before Action',
        lines: [
          'Before you start the Now item, picture a gentle 60-second runway:',
          'a sip of water, stand and roll the shoulders, one slow breath.',
          'Space before action makes action easier.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Just the First Minute',
        lines: [
          'Now, let\'s return to your now item',
          'Think only of the first minute',
          'Type out the essay title, type in the phone number, write one line… send one message.',
          'Only the first minute. Simple and real.',
          'Take a slightly longer out-breath.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Reset Complete',
        lines: [
          'Now, continue with your now thought',
          'Watch as you find more motivation to complete it',
          'Maybe now you can begin to think of your \'soon\' thoughts\'',
          'Everything has a place; your first step is clear.',
          'Carry this steady pace into the next thing you do.',
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
          'For the next couple of minutes, we\'ll walk a simple, steady path out of that box.',
          'Keep your eyes on the screen and follow each cue.',
          'When you\'re ready, tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Picture the Corridor',
        lines: [
          'Imagine you\'re standing at the start of a long, quiet corridor.',
          'The light is soft; the air feels still and safe.',
          'The floor is level under your feet.',
          'At the far end, a door stands slightly open with a warm glow behind it.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Set the Pace',
        lines: [
          'Begin to "walk" in your mind at an easy, even pace.',
          'Match it to your breathing:',
          '• Inhale for 2 steps …',
          '• Exhale for 3 steps (a touch longer).',
          'Repeat once more: in for 2 … out for 3.',
          'Let shoulders drop a fraction as you settle.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'More Room, More Air',
        lines: [
          'With each step, picture the corridor widening a little.',
          'Walls slowly ease away from you; the ceiling lifts a touch.',
          'There\'s more air to breathe, more room to think.',
          'Keep your breath pattern: in 2 … out 3.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Sight • Sound • Feel',
        lines: [
          'See: a calm, even light along the skirting; a gentle glow at the door.',
          'Hear: a soft, distant hush; your quiet footfall in your mind.',
          'Feel: weight through heels → toes as each step "lands"; your grip on the phone relaxing 5%.',
          'Hold that steadiness for one slow breath.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'The Door Ahead',
        lines: [
          'The light at the door feels familiar and welcoming.',
          'As you draw closer, the air warms slightly — cosy, not hot.',
          'Tell yourself quietly: "I\'m safe. I\'m on my way."',
          'Keep walking: in 2 … out 3.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Open & Enter',
        lines: [
          'The door opens easily beneath your hand.',
          'Step through into a quiet room: soft light, calm air, comfortable space, you notice fresh air coming in through a window.',
          'With your next three exhales, we\'re going to release your tension and release into this calm and safe room',
          'They will be wrapped in light and safety',
          '• Exhale 1 — put down the noise, in your brain',
          '• Exhale 2 — put down the "what-if thoughts, think about the present moment".',
          '• Exhale 3 — keep only what matters right now in your mind.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Reset Complete',
        lines: [
          'Stand inside the quiet room for a moment.',
          'Notice: your troubles sitting around you, not bothering you',
          'breathing steadier, chest softer, head clearer.',
          'Notice as your worries fade away out of the open window',
          'The room is clear, representing your mind',
          'Carry this calm space into your day and the next thing you do',
          'Reset complete.'
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
          'For the next couple of minutes, we\'ll come back to the body, here and now.',
          'Keep your eyes on the screen and follow each cue.',
          'Tap Continue when you\'re ready.'
        ]
      },
      {
        id: 'step-2',
        title: 'Ground & Hold',
        lines: [
          'Notice your feet on the floor. Toes, arches, heels.',
          'Notice your seat or the surface beneath you. Let your weight melt into it.',
          'Feel the air on your skin, cool, warm, neutral. All fine.',
          'These are your anchor points.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Slow the Exhale',
        lines: [
          'Breathe in through the nose for 3.. 2.. 1..',
          'Breathe out through the mouth for 5.. 4.. 3.. 2.. 1..',
          'Again: in for 3.. 2.. 1.. And out for 5.. 4.. 3.. 2.. 1..',
          'One more time, in for 3.. 2.. 1.. And out for 5.. 4.. 3.. 2.. 1.. Longer out-breaths release more carbon dioxide, which helps the body feel calmer.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Heartbeat = Information',
        lines: [
          'Rest one hand lightly on your chest (over clothes is fine).',
          'Feel your heartbeat, fast or slow, it\'s okay.',
          'You don\'t need to change it.',
          'Just let it be,actively use your longer breaths to settle it\'s beating',
          'Breathe in for 3..2..1.. And out for 5..4..3..2..1..',
          'Notice as you feel the beat of your heart soften',
          'As your racing heart slows, as does your breath',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Release Signals',
        lines: [
          'Unclench your jaw; let the tongue rest.',
          'Drop your shoulders down,shoulders back, correct your posture',
          'Unclench your hands; loosen your grip on the phone by 5%.',
          'Each release is a small message to yourself, \'I\'m safe\'',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Send the Breath Low',
        lines: [
          'As you breathe, imagine the in-breath travelling down to your belly…',
          'and the out-breath flowing out and down your legs into the ground.',
          'Do two quiet rounds in for 3..2..1.. And out for 5..4..3..2..1..',
          'Notice as your anxieties leave your body and flow into the ground',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Stay with the Body',
        lines: [
          'Feel your anchors together: feet on the ground, the clothes on your skin , air on your face, beat of your heart',
          'Hold the calm for one more long out-breath.',
          'Notice the extra space in your chest.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Reset Complete',
        lines: [
          'You\'re centred, you\'ve moved from alarm to total awareness.',
          'Breath steadier, body heavier, mind clearer.',
          'Carry this calmer pace into the next thing you do.',
          'Reset complete.'
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
          'For the next couple of minutes, we\'ll draw a clear line: what\'s yours to act on, and what isn\'t.',
          'Keep your eyes on the screen and follow each cue.',
          'Tap Continue when you\'re ready.'
        ]
      },
      {
        id: 'step-2',
        title: 'What\'s on Repeat?',
        lines: [
          'Think of the single worry that\'s been looping in your mind.',
          'Just one. Keep it in mind while you complete this reset',
          'You don\'t need to fix it yet,just name it & identify it',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Make Space to Think',
        lines: [
          'Loosen your jaw and drop your shoulders, correct your posture.',
          'Take one easy breath in and gold for 3..2..1.. and a slightly longer breath out, hold for 5..4..3..2..1..',
          'A calmer body makes clearer decisions.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'In or Out of Your Hands',
        lines: [
          'Come back to your worry.',
          'Ask yourself, plainly: Can I do something about this in the next 24 hours?',
          'If yes → it\'s in your control.',
          'If no → it\'s outside your control for now.',
          'Hold your answer.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'First Tiny Step or Box & Shelf',
        lines: [
          'IF IT\'S IN YOUR CONTROL:',
          'Picture the smallest useful move you could take after this reset:',
          'Name what this step could be, identify the first step you can take',
          'Imagine yourself taking this step, visualise what this looks like',
          'See yourself starting it. Make it simple, don\'t overcomplicate.',
          '',
          'IF IT\'S OUT OF YOUR CONTROL:',
          'Imagine a neutral coloured box beside the screen.',
          'Notice as it looks solid and strong, the lid is open',
          'Take your worry that you cannot control right now, and place it in this box, shut the lid tight.',
          'Notice as the box is labelled "Parked".',
          'Not gone — you\'re just not carrying the burden at this moment in time.',
          'Come back to it when you can take action against the thought',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Keep This Thought',
        lines: [
          'Now you\'ve chosen a path and de-cluttered your mind,Soften your shoulders, hold your hand to your chest, breathe slowly, notice as your heart rate lowers',
          'Complete some affirmations, to help you justify your plan',
          '• "I can do this, one step at a time, I have a plan"',
          '• "I can ask for help, I know people who will be able to help me"',
          '• "The thought is parked, it can wait until I am in a position to sort it"',
          'Hold this affirmation for one long out-breath.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Make It Real',
        lines: [
          'If you chose a step: quietly pair it with when and where you\'ll start —',
          '"After this reset, at my desk, 10 minutes on the first line."',
          'If you parked it: decide when you\'ll review the box —',
          '"Tomorrow afternoon, after lunch."',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Reset Complete',
        lines: [
          'Line drawn.',
          'What\'s yours to act on is clear; what isn\'t is parked.',
          'Take one steady out-breath and carry this calm into your day.',
          'Reset complete.'
        ]
      }
    ]
  },

  // ============ RESTLESS RESETS (1 reset) ============
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
          'For the next couple of minutes we\'ll give your body one steady rhythm to follow.',
          'Keep your phone in a relaxed grip and follow each cue.',
          'Tap Continue when you\'re ready.'
        ]
      },
      {
        id: 'step-2',
        title: 'Tap In',
        lines: [
          'Rest your forearms on your thighs or desk.',
          'Begin a light alternating tap: left thigh… right thigh… left… right…',
          'Keep it smooth and even — gentle, not loud.',
          'Let the sound be your metronome.',
          'Go at the pace which feels comfortable to you',
          'Once you\'ve found your pace, Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Sync It Up',
        lines: [
          'Stay with the left–right taps.',
          'Breathe in for four taps …',
          'Breathe out for four taps.',
          'Repeat once more: in for 4 taps… out for 4 taps.',
          'Drop your shoulders a fraction and correct your posture as the body finds the groove.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Shoulders & Hands',
        lines: [
          'Keep tapping at the same tempo,',
          'As you continue through the taps slowly start to bring the tempo down',
          'Loosen the stiffness in your shoulders, neck, arms, wrists and hands',
          'Bring the movements to slow tiny taps',
          'Slowly bring your breathing down to the same pace as the slow taps',
          'Take note of the tap, feel the energy go through your arms into your legs',
          'You should now be at a slow, steady pace with you taps and your breathing',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Continue the tempo',
        lines: [
          'Continue at the slow steady tempo for a further 6 counts of 4',
          'Ensuring you\'re matching your breathing with your slow taps',
          'Start to take notice of other sense in this section',
          'What can you hear & smell?',
          'Notice as your mind and body start to become one again',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'The Quiet Space',
        lines: [
          'Keep the relaxed tapping.',
          'Between each pair of taps there\'s a tiny pocket of quiet.',
          'Rest your attention in that quiet for a moment, then the next.',
          'Left (quiet) … right (quiet) … like waves arriving and receding.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Land the Rhythm',
        lines: [
          'Let the taps get softer… and slower… and then stop.',
          'Place both hands open on your thighs.',
          'Feel the echo of the rhythm in your chest — steady, not hurried.',
          'Take one last breath in for 4, out for 6.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Reset Complete',
        lines: [
          'Your rhythm is steady again.',
          'Energy gathered, not scattered.',
          'Carry this calmer beat into whatever comes next.',
          'Reset complete.'
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
          'Hold your phone with a light grip.',
          'Place both feet flat, hip-width apart.',
          'We\'ll lift posture a notch at a time so energy rises without strain.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Find an easy height',
        lines: [
          'Imagine a tiny thread lifting the crown of your head.',
          'Grow one centimetre taller; keep ribs soft, bum relaxed.',
          'Notice the extra space for air under your collarbones.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Roll some space open',
        lines: [
          'Roll both shoulders up… back… down.',
          'Pause. Repeat once, a touch slower.',
          'Feel the shoulder blades settle lower; chest widens naturally.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Line up the head',
        lines: [
          'Glide your chin gently back (not down) so ears stack over shoulders.',
          'Unclench the jaw; let the tongue rest on the roof of your mouth.',
          'Breathing often clears here — Take a note of this, breathe deeply and slowly',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Let the ribs breathe',
        lines: [
          'Inhale and exaggerate the rib movement, feel yourself widen like an umbrella.',
          'As you exhale, push the air out of your chest, whilst keeping the form you\'ve built in the inhale',
          'You\'ve made space and found a position of calm and confidence',
          'Sit in this pose for a second, feel how your body feels powerful and alert',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Sweep and reset',
        lines: [
          'Sweep your forearms forward and down, as if clearing the air in front of you',
          'Let the shoulder blades glide down your back; elongate the neck upwards, stretching it out.',
          'Don\'t tense your face muscles, let them stay easy',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Anchor tall',
        lines: [
          'Rest forearms on thighs or desk with light contact.',
          'Feel support below the elbows and length above the waist at the same time.',
          'Balanced, not rigid.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Wrap up',
        lines: [
          'One clean breath in through the nose… a longer, steady breath out through the mouth.',
          'Calm body, awake mind.',
          'Reset complete.'
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
          'Hold the phone about arm\'s length away.',
          'Keep your head fairly still; we\'ll let the eyes do the travelling.',
          'Shoulders loose, face soft.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Freshen the eyes',
        lines: [
          'Fixate on a small spot in the centre of the screen.',
          'Blink 5–7 quick times.',
          'Your vision should feel a touch brighter and less gritty.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Left and right',
        lines: [
          'Jump your gaze to the far left edge, then the far right edge.',
          'Pause a heartbeat each side.',
          'One rep is 4 gaze jumps',
          'Left, right, left right',
          'Pause for a second after every 4th gaze jump',
          'Complete 5-10 sets of gaze jumps',
          'Notice as your heart rate and breath increase with the rapid eye movement',
          'You\'re slowly starting to wake up your nervous system',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Up and down',
        lines: [
          'Eyes to the top edge, then the bottom edge.',
          'Same small pause.',
          'Do four cycles again following the pattern on the previous page',
          'Pause for a second after every 4th gaze jump',
          'Complete 5-10 sets of gaze jumps',
          'Your focus sharpens without strain.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Diagonals',
        lines: [
          'Now we\'re going from top-left → bottom-right… then top-right → bottom-left.',
          'Pause for a second after every 4th gaze jump',
          'Complete 5-10 sets of gaze jumps',
          'Jaw stays loose; shoulders easy; head quiet.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Soft circles',
        lines: [
          'Trace a large, slow circle once clockwise, once anticlockwise.',
          'Make it silky, not jerky.',
          'Do this 5 times',
          'If eyes feel dry, add one soft blink and rejoin.',
          'Once done, Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Hold the centre',
        lines: [
          'Return to the centre point.',
          'Let the edges of your vision soften while the centre stays crisp.',
          'Small inhale… longer exhale. Feel clarity arrive.',
          'Once done, Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Wrap up',
        lines: [
          'Notice the extra brightness in your view and the lift behind your eyes.',
          'Time to get at it, carry this alertness into your next task .',
          'Reset complete.'
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
          'Sit or stand with a bit of space.',
          'We\'ll use small, joint-friendly movements.',
          'If anything isn\'t comfortable, ease or skip it.',
          'Read each page, complete the exercise, then Tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Wake the calves',
        lines: [
          'Standing: lift both heels off the ground then lower, 10–12 easy reps.',
          'Seated: alternate toe-presses into the ground into toe lifts, again 10-12 easy reps.',
          'Feel warmth move up the shins; breathing stays steady.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Wake the hands',
        lines: [
          'Circle both wrists five times each way.',
          'Then give the hands a light shake for a second or two.',
          'Tingling in fingers = blood flow returning.',
          'Once done, Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Open the shoulders',
        lines: [
          'Elbows tucked by your sides, palms forward.',
          'Rotate forearms so palms face the sky; pause; return to palms facing the floor',
          'Do three slow reps. Chest opens; neck stays long.',
          'Once done, Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Gentle spine wave',
        lines: [
          'On a soft inhale, lift the breastbone a few millimetres.',
          'On the exhale, ease back to neutral.',
          'Do three smooth waves — no crunching or slumping.',
          'Once done, Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Light rhythm',
        lines: [
          'Standing: small march on the spot 15–20 seconds.',
          'Seated: brisk heel taps or alternate knee lifts.',
          'Let breath find the beat; keep shoulders relaxed.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Come back taller',
        lines: [
          'Return to stillness a touch taller than when you began.',
          'Notice a quiet hum in the body rather than heaviness.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Wrap up',
        lines: [
          'Breathe In through the nose; out a fraction longer through the mouth.',
          'Warm, switched on, ready.',
          'Reset complete.'
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
          'Keep your grip on the phone relaxed.',
          'Read each page, complete the exercise, then Tap Continue.'
        ]
      },
      {
        id: 'step-2',
        title: 'Heat in the hands',
        lines: [
          'Rub your palms together for 5–7 seconds.',
          'Pause and notice the heat spreading into fingers and thumbs.',
          'That warmth is your "on" signal.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-3',
        title: 'Freshen the face',
        lines: [
          'With warm hands, lightly press the palms of your hands on your cheeks → temples → scalp once.',
          'Repeat this 5 times',
          'Lift the skin rather than dragging it.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-4',
        title: 'Switch on the ears',
        lines: [
          'Run thumb and finger up the outer ear edge from lobe of your ears to the tops on both sides,',
          'then a tiny upward tug.',
          'Then run your fingers back down to your lobes',
          'Repeat this 5 times',
          'This adds an unnatural movement that awakens the mind.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-5',
        title: 'Brush the forearms',
        lines: [
          'Brush one forearm from wrist to elbow three slow passes, then swap.',
          'Notice the skin sensation and the temperature changes of your skin',
          'Do this 3 times on each arm',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-6',
        title: 'Sort the sound',
        lines: [
          'Pick out a sound that is far away, notice it, identify it and stay with it for 5 seconds',
          'Then pick out a near sound (even your breath), notice this, identify it and stay with it for 5 seconds',
          'Then try to notice your stillness for 5 seconds',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-7',
        title: 'Snap the focus',
        lines: [
          'Choose a tiny detail on the screen — a letter, an icon corner.',
          'Hold it clearly for three seconds, then soften your gaze.',
          'Feel attention sharpen without strain.',
          'Tap Continue.'
        ]
      },
      {
        id: 'step-8',
        title: 'Wrap up',
        lines: [
          'Sit or stand a touch taller.',
          'Short clean inhale; longer steady exhale.',
          'Senses on; mind clear.',
          'Reset complete.'
        ]
      }
    ]
  },

  // ============ SCATTERED RESETS (4 resets) ============
  {
    id: 'scattered-focus-funnel',
    emotion: 'scattered',
    name: 'Focus Funnel',
    description: 'Narrow attention from wide to single point',
    scienceBenefit: 'Attentional narrowing: wide → medium → narrow focus to reduce mental scatter',
    durationHintSeconds: 90,
    steps: [
      {
        id: 'step-1',
        title: 'Settle in',
        lines: [
          'Hold your phone in a relaxed grip. Feet planted.',
          'We\'ll bring the mind from "everywhere" to "just here".'
        ]
      },
      {
        id: 'step-2',
        title: 'Wide view',
        lines: [
          'Look at the whole screen and a little beyond it.',
          'Let your eyes notice edges, colours, and space around you.'
        ]
      },
      {
        id: 'step-3',
        title: 'Medium view',
        lines: [
          'Now let your gaze rest on the upper half of the screen only.',
          'Fewer things. A touch quieter.'
        ]
      },
      {
        id: 'step-4',
        title: 'Narrow view',
        lines: [
          'Bring attention to one area the size of a coaster.',
          'Stay there for a slow breath in… and a longer breath out.'
        ]
      },
      {
        id: 'step-5',
        title: 'Single point',
        lines: [
          'Choose one small point (icon corner, single letter).',
          'Keep a soft, steady gaze. Jaw loose. Shoulders easy.'
        ]
      },
      {
        id: 'step-6',
        title: 'Lock the lane',
        lines: [
          'Quietly say in your head: "Just this."',
          'Hold for one more breath. Let the rest fade to the edges.'
        ]
      },
      {
        id: 'step-7',
        title: 'Tiny action rehearsal',
        lines: [
          'Picture the very first tap or click you\'ll make after this screen.',
          'See your thumb do it smoothly.'
        ]
      },
      {
        id: 'step-8',
        title: 'Finish',
        lines: [
          'From wide to one point.',
          'Take a clean out-breath. You\'re centred again.'
        ]
      }
    ]
  },
  {
    id: 'scattered-finger-ladder',
    emotion: 'scattered',
    name: 'Finger Ladder',
    description: 'Motor sequencing to stabilize attention',
    scienceBenefit: 'Motor sequencing + bilateral rhythm to stabilise attention',
    durationHintSeconds: 90,
    steps: [
      {
        id: 'step-1',
        title: 'Start',
        lines: [
          'Rest elbows or forearms lightly.',
          'We\'ll use a simple finger pattern to give your brain one clear track.'
        ]
      },
      {
        id: 'step-2',
        title: 'Left hand pattern',
        lines: [
          'Tap thumb to index–middle–ring–little, then back to ring–middle–index.',
          'Slow and smooth.'
        ]
      },
      {
        id: 'step-3',
        title: 'Right hand pattern',
        lines: [
          'Same on the right: index–middle–ring–little… and back.',
          'Keep the pace gentle; no rush.'
        ]
      },
      {
        id: 'step-4',
        title: 'Together, alternating',
        lines: [
          'Left does the pattern once, then right does it once.',
          'Swap sides for two cycles. Breathe naturally.'
        ]
      },
      {
        id: 'step-5',
        title: 'Together, mirrored',
        lines: [
          'Both hands now, but mirrored (thumb to index at the same time, then middle, etc.).',
          'One clean run up… and back.'
        ]
      },
      {
        id: 'step-6',
        title: 'Slow the tempo',
        lines: [
          'Do the mirrored run again, but a notch slower.',
          'Feel the mind match the steadier rhythm.'
        ]
      },
      {
        id: 'step-7',
        title: 'Stillness check',
        lines: [
          'Rest your hands.',
          'Notice how quiet the head feels when the sequence stops.'
        ]
      },
      {
        id: 'step-8',
        title: 'Finish',
        lines: [
          'One short in-breath, one longer out-breath.',
          'Rhythm found, focus back. Reset complete.'
        ]
      }
    ],
    safetyNote: 'Skip or ease any movement that isn\'t comfortable for you.'
  },
  {
    id: 'scattered-grid-focus',
    emotion: 'scattered',
    name: 'Grid Focus Drill',
    description: 'Eyes-only tracking to tame attention hopping',
    scienceBenefit: 'Visuospatial working-memory; eyes-only tracking to tame "attention hopping"',
    durationHintSeconds: 90,
    steps: [
      {
        id: 'step-1',
        title: 'Set the scene',
        lines: [
          'Imagine a simple 3×3 grid on your screen.',
          'Nine squares, like a noughts-and-crosses board.'
        ]
      },
      {
        id: 'step-2',
        title: 'Row scan',
        lines: [
          'With only your eyes, trace the top row left-to-right… then the middle row… then the bottom row.',
          'Smooth and slow.'
        ]
      },
      {
        id: 'step-3',
        title: 'Column scan',
        lines: [
          'Now trace the first column top-to-bottom… then the middle… then the last.',
          'Keep breathing easily.'
        ]
      },
      {
        id: 'step-4',
        title: 'Corners',
        lines: [
          'Touch your gaze to each corner of the grid, clockwise.',
          'One full lap.'
        ]
      },
      {
        id: 'step-5',
        title: 'Centre',
        lines: [
          'Settle your gaze on the centre square for one slow breath.',
          'Let everything else soften.'
        ]
      },
      {
        id: 'step-6',
        title: 'Short sequence',
        lines: [
          'Follow this eyes-only path: top-middle → centre → bottom-middle → centre.',
          'Do it twice, unhurried.'
        ]
      },
      {
        id: 'step-7',
        title: 'Single square',
        lines: [
          'Back to the centre square.',
          'Hold gently there for a longer out-breath.'
        ]
      },
      {
        id: 'step-8',
        title: 'Finish',
        lines: [
          'The grid stays in your mind; noise drops.',
          'You\'re steady enough to start the next thing.'
        ]
      }
    ]
  },
  {
    id: 'scattered-single-channel',
    emotion: 'scattered',
    name: 'Single-Channel Mode',
    description: 'One sensory channel at a time',
    scienceBenefit: 'One sensory "channel" at a time to stop multi-task drift',
    durationHintSeconds: 90,
    steps: [
      {
        id: 'step-1',
        title: 'Start',
        lines: [
          'Scattered often means too many channels at once.',
          'We\'ll run one channel at a time.'
        ]
      },
      {
        id: 'step-2',
        title: 'Eyes channel (10–15s)',
        lines: [
          'Choose the eyes: look at a single spot on the screen.',
          'Notice only shape, brightness, edges. Nothing else.'
        ]
      },
      {
        id: 'step-3',
        title: 'Hands channel (10–15s)',
        lines: [
          'Switch to hands: feel the phone\'s weight, the skin on your fingertips, the tiny warmth where you\'re holding it.'
        ]
      },
      {
        id: 'step-4',
        title: 'Ears channel (10–15s)',
        lines: [
          'Switch to ears: pick one far sound, then one near sound (even your breath).',
          'Let the rest be background.'
        ]
      },
      {
        id: 'step-5',
        title: 'Back to eyes (short)',
        lines: [
          'Return to the same spot on the screen.',
          'It\'s easier to hold now.'
        ]
      },
      {
        id: 'step-6',
        title: 'Back to hands (short)',
        lines: [
          'Feel the grip again; loosen it 5%.',
          'Shoulders soften.'
        ]
      },
      {
        id: 'step-7',
        title: 'Choose your working channel',
        lines: [
          'Pick the channel you want to lead the next minute (eyes for reading, hands for doing, ears for listening).',
          'Say it in your head: "Eyes," "Hands," or "Ears."'
        ]
      },
      {
        id: 'step-8',
        title: 'Finish',
        lines: [
          'One channel, one lane.',
          'Slow out-breath. Take that into your next action.'
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
