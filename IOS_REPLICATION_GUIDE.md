# GetResett iOS Replication Guide
**Complete Reset Content, UI/UX Specifications & Design System**

---

## 📱 Overview

GetResett is a wellness app delivering science-backed, 60-second reset sessions for mental and physical well-being. This document provides everything needed to replicate the reset experiences and UI/UX in an iOS application using Swift/SwiftUI.

### Core Features
- **5 Emotional States**: Stressed, Anxious, Restless, Tired, Scattered
- **19 Total Resets**: 4 Stressed + 4 Anxiety (3 story + 1 interactive) + 4 Restless + 4 Tired + 4 Scattered
- **Manual Navigation**: Continue/Back buttons (no auto-advancing timers)
- **Mood Tracking**: 1-10 rating after each reset with loop-back flow
- **Mobile-First UX**: Concise text (2-3 sentences max), stress-free experience

---

## 🎨 Design System

### Color Palette

#### Emotional State Colors (Gradient Backgrounds)
```swift
// Stressed - Purple to Indigo
let stressedGradient = LinearGradient(
    colors: [Color(hex: "A78BFA"), Color(hex: "6366F1")],
    startPoint: .topLeading,
    endPoint: .bottomTrailing
)

// Anxious - Pink to Rose
let anxiousGradient = LinearGradient(
    colors: [Color(hex: "EC4899"), Color(hex: "F43F5E")],
    startPoint: .topLeading,
    endPoint: .bottomTrailing
)

// Restless - Amber to Orange
let restlessGradient = LinearGradient(
    colors: [Color(hex: "FBBF24"), Color(hex: "F97316")],
    startPoint: .topLeading,
    endPoint: .bottomTrailing
)

// Tired - Blue to Cyan
let tiredGradient = LinearGradient(
    colors: [Color(hex: "3B82F6"), Color(hex: "06B6D4")],
    startPoint: .topLeading,
    endPoint: .bottomTrailing
)

// Scattered - Green to Teal
let scatteredGradient = LinearGradient(
    colors: [Color(hex: "4ADE80"), Color(hex: "14B8A6")],
    startPoint: .topLeading,
    endPoint: .bottomTrailing
)
```

#### Base Colors
```swift
// Background
let backgroundGradient = LinearGradient(
    colors: [
        Color(hex: "FAF5FF"), // purple-50
        Color(hex: "EDE9FE"), // violet-50
        Color(hex: "EFF6FF")  // blue-50
    ],
    startPoint: .top,
    endPoint: .bottom
)

// Card backgrounds with glassmorphism
let cardBackground = Color.white.opacity(0.9)
let cardBackdropBlur = UIBlurEffect.Style.systemUltraThinMaterial

// Text
let primaryText = Color(hex: "18181B") // gray-900
let secondaryText = Color(hex: "71717A") // gray-500
```

### Typography

```swift
// Mobile-first sizing
struct AppFonts {
    // Headers
    static let h1 = Font.system(size: 32, weight: .bold) // Emotion selector title
    static let h2 = Font.system(size: 24, weight: .bold) // Reset list title
    static let h3 = Font.system(size: 20, weight: .semibold) // Reset step title
    
    // Body
    static let body = Font.system(size: 18, weight: .regular) // Reset step text
    static let bodySmall = Font.system(size: 16, weight: .regular) // Descriptions
    
    // UI Elements
    static let button = Font.system(size: 18, weight: .semibold)
    static let caption = Font.system(size: 14, weight: .regular)
}
```

### Spacing & Layout

```swift
struct Spacing {
    static let xs: CGFloat = 4
    static let sm: CGFloat = 8
    static let md: CGFloat = 16
    static let lg: CGFloat = 24
    static let xl: CGFloat = 32
    static let xxl: CGFloat = 48
    
    // Card padding
    static let cardPadding: CGFloat = 32
    
    // Button sizing
    static let buttonHeight: CGFloat = 56
    static let buttonCornerRadius: CGFloat = 16
}
```

### Animations

```swift
// Fade transitions between steps
let stepTransition = AnyTransition.asymmetric(
    insertion: .opacity.combined(with: .scale(scale: 0.95)),
    removal: .opacity
)
.animation(.easeInOut(duration: 0.5))

// Breathing orb animation
let breathingAnimation = Animation
    .easeInOut(duration: 4.0)
    .repeatForever(autoreverses: true)

// Button press feedback
let buttonPressScale: CGFloat = 0.95
let buttonAnimation = Animation.spring(response: 0.3, dampingFraction: 0.6)
```

---

## 📋 Data Models

### Core Reset Structure

```swift
struct ResetStep: Identifiable, Codable {
    let id: String
    let title: String
    let lines: [String] // Array of text lines (2-3 max)
    let animationKey: String? // Optional animation identifier
    let helperHint: String? // Optional breathing cue
}

struct Reset: Identifiable, Codable {
    let id: String
    let emotion: EmotionalState
    let name: String
    let description: String
    let scienceBenefit: String
    let durationHintSeconds: Int
    let steps: [ResetStep]
    let safetyNote: String?
}

enum EmotionalState: String, Codable, CaseIterable {
    case stressed
    case anxiety
    case restless
    case tired
    case scattered
    
    var label: String {
        switch self {
        case .stressed: return "Stressed"
        case .anxiety: return "Anxious"
        case .restless: return "Restless"
        case .tired: return "Tired"
        case .scattered: return "Scattered"
        }
    }
    
    var description: String {
        switch self {
        case .stressed: return "Feeling overwhelmed by pressure or demands"
        case .anxiety: return "Worried thoughts and racing mind"
        case .restless: return "Unable to settle or focus your energy"
        case .tired: return "Low energy and mental fatigue"
        case .scattered: return "Difficulty focusing or staying present"
        }
    }
    
    var gradient: LinearGradient {
        // Return corresponding gradient from design system
    }
    
    var icon: String {
        switch self {
        case .stressed: return "cloud.rain"
        case .anxiety: return "heart"
        case .restless: return "bolt"
        case .tired: return "battery.25"
        case .scattered: return "sparkles"
        }
    }
}
```

---

## 🎯 Reset Content Database

### STRESSED RESETS (4 total)

#### 1. Full-Body Tense & Release
**ID**: `stressed-tense-release`  
**Science**: Progressive muscle relaxation triggers parasympathetic calm and releases physical tension linked to stress  
**Duration**: ~75 seconds

**Steps**:
1. **Tense & Release**: "Using a progressive muscle tension and relaxation technique, we'll help you ease the tension from your body."

2. **Hands**: "Clench both fists tight. Hold for 5 seconds... now release. | Spread your fingers wide until you feel tension. Hold for 5 seconds. | Let your hands go soft and feel the tension melt away."

3. **Shoulders**: "Lift your shoulders toward your ears and push them back. | Feel the tension build. Hold for 5 seconds... now release. | Return to a comfortable position with good posture."

4. **Stomach & Core**: "Breathe in deep for 5 seconds. Feel your body fill with air. | As you breathe out, tense your stomach for 5 seconds. Breathe normally. | Repeat once more: breathe in for 4... tense as you breathe out for 5. | Feel the tension in your core start to release."

5. **Legs**: "Gently clench your glutes. Hold for 5 seconds... now release. | Tense your quads (top leg muscles). Hold for 5 seconds... release. | Curl your toes tight and squeeze. Hold for 5 seconds... release. | Notice how your whole body feels lighter and less tense."

6. **Reset Complete**: "Your body should feel lighter & calmer. | Reset complete."

---

#### 2. Grounding Walk
**ID**: `stressed-grounding-walk`  
**Science**: Visual orientation + sensory grounding (sight/sound/touch) reduce threat scanning and restore a sense of safety and control  
**Duration**: ~105 seconds

**Steps**:
1. **Grounding Walk**: "We'll take a short guided walk in your mind to settle your system. | Keep your eyes open and imagine it vividly—no need to move. | Click Continue on each page."

2. **The Path**: "Picture a clear, open path ahead. Firm ground, easy to walk on. | Hold your phone comfortably and let your shoulders drop. | Imagine taking your first step—feel the rhythm. Click Continue."

3. **Your Pace**: "Walk at a calm, even pace in your mind. | Match your steps to breathing: inhale over 2 steps, exhale over 3. | Repeat once more. Let the body feel heavier, the mind quieter."

4. **What You See**: "Let the scene become clearer. Notice three things: | The colour of the sky, the texture of the path, something at the edge. | Ordinary is safe. Take one breath: in for 2, out for 3."

5. **What You Hear**: "Pick up two layers of sound: far (wind, traffic) and near (footsteps). | Hold far and near together—like two gentle lines. | Breathe with your steps: in for 2, out for 3."

6. **What You Feel**: "Sense weight through your heels and toes as each step lands. | The ground carries you—steady, predictable, solid. | Relax your hands, soften your jaw. Take one longer exhale down through your legs."

7. **Space Ahead**: "Lift your gaze to the horizon—the path opens out. | With the next three breaths, think about what matters: family, friends, things you hold close. | Imagine them waiting at the end of your path. Feel the joy, relief, calm."

8. **Reset Complete**: "Let the path slow to a comfortable stop. | Notice: breathing steadier, shoulders softer, head clearer. | Carry this pace into the next thing you do. Reset complete."

---

#### 3. Safety Scan
**ID**: `stressed-safety-scan`  
**Science**: Eyes-open orientation (left/right, corners, near/far) and a familiar anchor signal "no immediate threat", reducing hypervigilance  
**Duration**: ~100 seconds

**Steps**:
1. **Safety Scan**: "Stress makes the body act like danger is close. | We'll use your eyes to show your system it's safe. | Relaxed grip on your phone. When you're ready, tap Continue."

2. **Left Side**: "Let your eyes travel left without moving your head much. | Notice three things: a colour, a shape, something still. No judging. | Hold for one calm breath, then tap Continue."

3. **Right Side**: "Now let your eyes move right. | Spot three details: a line, a texture, light or shadow. | Soften your shoulders. One calm breath; tap Continue."

4. **Orient the Room**: "Touch your gaze to each corner: top-left, top-right, bottom-right, bottom-left. | Notice any door or window. Corners mean structure; structure feels safe. | Tap Continue."

5. **Depth of Field**: "Focus on something near (phone, hand), then something far across the room. | Back to middle distance. Your world has depth—and room. | Tap Continue."

6. **Anchor Object**: "Choose one ordinary thing in view: a cup, chair, frame, or wall. | Hold a soft gaze there for a few seconds. | Ordinary means familiar; familiar means safe. Tap Continue."

7. **Widen & Settle**: "Keep your anchor in view while letting the edges of your vision soften. | Easy breath in, longer breath out. Relax jaw, shoulders, and grip 5%. | Hold the quiet for a moment, then tap Continue."

8. **Reset Complete**: "You've scanned, oriented, and anchored. | Notice: breathing steadier, shoulders softer, head clearer. | Carry this steadiness into whatever comes next. Reset complete."

---

#### 4. Two-Minute Triage
**ID**: `stressed-mental-triage`  
**Science**: Mentally "parking" items into simple containers reduces working-memory load and eases the stress response  
**Duration**: ~105 seconds

**Steps**:
1. **Two-Minute Triage**: "When stress builds, your brain tries to hold everything at once. | We'll sort it into simple places so your mind can breathe. | Follow each cue. Tap Continue when ready."

2. **Three Trays**: "Imagine three small trays: 'Now', 'Soon', and 'Later'. | They're empty, a clear place to park your thoughts. Tap Continue."

3. **Choose the Anchor**: "Think of one thing that truly matters today—a task, chore, or call. | Picture placing it on the Now tray. Watch the tray glow green. | This is your priority. Completing just this one thing means success. | Hold that thought for one easy breath, then tap Continue."

4. **Park the Near-Future**: "Pick one or two things that can wait until after your first task. | Place them in the 'Soon' tray. Watch it glow yellow. | You've got time. Your shoulders drop as time opens up. Tap Continue."

5. **Quiet the Noise**: "Let your remaining thoughts circle, then dump them in the 'Later' tray. | Watch them turn red as you place them down. A lid rests over it. | Not gone, just quiet for now. You can return when you choose."

6. **Space Before Action**: "Before starting your Now task, picture a 60-second runway. | A sip of water, roll your shoulders, one slow breath. | Space before action makes action easier. Tap Continue."

7. **Just the First Minute**: "Return to your Now item. Think only of the first minute. | One title, one number, one line. Simple and real. | Take a slightly longer out-breath. Tap Continue."

8. **Reset Complete**: "Everything has a place; your first step is clear. | Watch as motivation builds. Carry this steady pace forward. | Reset complete."

---

### ANXIETY RESETS (4 total: 3 story + 1 interactive)

#### 1. The Calm Corridor
**ID**: `anxiety-calm-corridor`  
**Science**: Guided imagery + autonomic regulation lowers limbic activation and restores perceived safety  
**Duration**: ~120 seconds

**Steps**:
1. **The Calm Corridor**: "When anxiety builds, the mind feels boxed in. | We'll walk a simple, steady path out of that box. | Follow each cue. When you're ready, tap Continue."

2. **Picture the Corridor**: "Imagine a long, quiet corridor. Soft light, still air, level floor. | At the far end, a door stands open with a warm glow behind it. | Tap Continue."

3. **Set the Pace**: "Begin to walk in your mind at an easy, even pace. | Match breathing to steps: inhale for 2, exhale for 3 (a touch longer). | Repeat once more. Shoulders drop as you settle. Tap Continue."

4. **More Room, More Air**: "With each step, the corridor widens. Walls ease away, ceiling lifts. | More air to breathe, more room to think. | Keep breathing: in 2, out 3. Tap Continue."

5. **Sight • Sound • Feel**: "See: calm light along the skirting, gentle glow at the door. | Hear: soft hush, quiet footfall. Feel: weight through heels and toes. | Grip relaxes 5%. Hold steadiness for one slow breath. Tap Continue."

6. **The Door Ahead**: "The light at the door feels familiar and welcoming. Air warms slightly. | Tell yourself: 'I'm safe. I'm on my way.' | Keep walking: in 2, out 3. Tap Continue."

7. **Open & Enter**: "The door opens easily. Step into a quiet room: soft light, calm air, fresh breeze. | With three exhales, release: 1—the noise, 2—the what-ifs, 3—keep only what matters now. | Wrapped in light and safety. Tap Continue."

8. **Reset Complete**: "Stand in the quiet room. Your troubles sit around, not bothering you. | Breathing steadier, chest softer, head clearer. Worries fade out the window. | The room is clear, like your mind. Carry this calm forward. Reset complete."

---

#### 2. Anchor in the Body
**ID**: `anxiety-anchor-body`  
**Science**: Interoception + longer exhales reduce anxious dissociation and rebalance the autonomic nervous system  
**Duration**: ~120 seconds

**Steps**:
1. **Anchor in the Body**: "Anxiety pulls you into the future. | We'll come back to the body, here and now. | Follow each cue. Tap Continue when ready."

2. **Ground & Hold**: "Notice your feet on the floor: toes, arches, heels. | Notice your seat or surface beneath you. Let your weight melt into it. | Feel the air on your skin, cool, warm, neutral. All fine. | These are your anchor points. | Tap Continue."

3. **Slow the Exhale**: "Breathe in through the nose for 3... out through the mouth for 5. | Repeat twice more: in for 3, out for 5. Longer exhales calm the body. | Tap Continue."

4. **Heartbeat = Information**: "Rest one hand on your chest. Feel your heartbeat—fast or slow is okay. | Use longer breaths to settle it: in for 3, out for 5. | Notice the beat soften. As your heart slows, so does your breath. Tap Continue."

5. **Release Signals**: "Unclench your jaw and let your tongue rest. Drop shoulders, correct posture. | Loosen your grip on the phone by 5%. | Each release says, 'I'm safe.' Tap Continue."

6. **Send the Breath Low**: "Imagine the in-breath traveling to your belly, the out-breath down your legs. | Do two rounds: in for 3, out for 5. Feel anxieties flow into the ground. | Tap Continue."

7. **Stay with the Body**: "Feel your anchors: feet on ground, clothes on skin, air on face, heartbeat. | Hold the calm for one more long out-breath. Notice the extra space in your chest. | Tap Continue."

8. **Reset Complete**: "You've moved from alarm to total awareness. | Breath steadier, body heavier, mind clearer. | Carry this calmer pace into the next thing you do. Reset complete."

---

#### 3. Control the Controllable
**ID**: `anxiety-control-controllable`  
**Science**: Separating controllable from uncontrollable reduces worry loops and increases self-efficacy; pairing with a tiny "first move" further lowers anxiety  
**Duration**: ~120 seconds

**Steps**:
1. **Control the Controllable**: "Anxiety swells when everything feels uncertain. | We'll draw a clear line: what's yours to act on, and what isn't. | Follow each cue. Tap Continue when ready."

2. **What's on Repeat?**: "Think of the single worry looping in your mind. Just one. | Keep it in mind—you don't need to fix it yet, just name it. | Tap Continue."

3. **Make Space to Think**: "Loosen your jaw, drop your shoulders, correct your posture. | Easy breath in for 3... longer breath out for 5. | A calmer body makes clearer decisions. Tap Continue."

4. **In or Out of Your Hands**: "Come back to your worry. Ask: Can I do something about this in 24 hours? | If yes → in your control. If no → outside your control for now. | Hold your answer. Tap Continue."

5. **First Tiny Step or Box & Shelf**: "IN YOUR CONTROL: Picture the smallest move you could take after this reset. Visualize starting it. | OUT OF YOUR CONTROL: Imagine a solid box. Place your worry inside, shut the lid. It's labeled 'Parked.' | Not gone—just not carried at this moment. Tap Continue."

6. **Keep This Thought**: "Soften your shoulders, hand to your chest. Breathe slowly, heart rate lowers. | Choose one: 'I can do this, one step at a time' or 'The thought is parked.' | Hold this affirmation for one long out-breath. Tap Continue."

7. **Make It Real**: "Chose a step? Pair it with when and where: 'After this reset, at my desk.' | Parked it? Decide when you'll review: 'Tomorrow afternoon.' | Tap Continue."

8. **Reset Complete**: "Line drawn. What's yours to act on is clear; what isn't is parked. | Take one steady out-breath. Carry this calm into your day. Reset complete."

---

#### 4. Bubble Pop Calm (Interactive)
**ID**: `anxiety-bubble-calm`  
**Type**: Interactive bubble-tapping game  
**Science**: Simple tactile interaction provides grounding and stress relief  
**Duration**: ~120 seconds

**Implementation Notes**:
- Display floating bubbles that slowly rise and drift across screen
- User taps bubbles to pop them with gentle fade-out animation
- Soft pastel colors (pinks, purples, blues)
- Calming background gradient
- Gentle "pop" sound effect (optional)
- No time pressure or score—pure calming interaction
- Display text: "Tap the bubbles as they float across the screen. Watch them gently pop and fade away. Take your time, there's no rush."

---

### RESTLESS RESETS (4 total)

#### 1. The Pulse Reset
**ID**: `restless-pulse-reset`  
**Science**: Bilateral rhythm + longer exhales help the nervous system sync and settle (rhythmic entrainment; vagal regulation)  
**Duration**: ~150 seconds  
**Safety Note**: "ease or skip any movement that isn't comfortable for you."

**Steps**:
1. **The Pulse Reset**: "When you're restless, your energy scatters in all directions. | We'll give your body one steady rhythm to follow. | Relaxed grip on your phone. Tap Continue when ready."

2. **Tap In**: "Rest your forearms on your thighs or desk. | Begin a light alternating tap: left... right... left... right. Smooth and gentle. | Find a comfortable pace. Let the sound be your metronome. Tap Continue."

3. **Sync It Up**: "Stay with the left-right taps. Breathe in for 4 taps, out for 4 taps. | Repeat once more: in for 4, out for 4. | Drop your shoulders as the body finds the groove. Tap Continue."

4. **Shoulders & Hands**: "Slowly bring the tempo down. Loosen shoulders, neck, arms, wrists, hands. | Bring movements to slow, tiny taps. Match breathing to the slow pace. | Feel energy flow through your arms into your legs. Slow and steady. Tap Continue."

5. **Continue the tempo**: "Continue the slow tempo for 6 more counts of 4. Match breathing with taps. | Notice other senses: What can you hear? Smell? | Your mind and body become one again. Tap Continue."

6. **The Quiet Space**: "Keep the relaxed tapping. Between each tap is a tiny pocket of quiet. | Rest your attention there: left (quiet)... right (quiet)... like waves. | Tap Continue."

7. **Land the Rhythm**: "Let the taps get softer... slower... then stop. Hands open on your thighs. | Feel the rhythm echo in your chest—steady, not hurried. | One last breath: in for 4, out for 6. Tap Continue."

8. **Reset Complete**: "Your rhythm is steady again. Energy gathered, not scattered. | Carry this calmer beat into whatever comes next. Reset complete."

---

#### 2. The Focus Path
**ID**: `restless-focus-path`  
**Science**: Smooth-pursuit and gentle saccades help the nervous system settle and pull attention into one clear track  
**Duration**: ~135 seconds  
**Safety Note**: "if any movement feels uncomfortable, slow down or blink, then rejoin."

**Steps**:
1. **The Focus Path**: "Restless mind, busy eyes—let's give them one steady route. | Hold your phone comfortably, shoulders easy. Eyes will follow a moving point. | Head stays still. When ready, tap Continue."

2. **Find Your Start**: "Sit tall or stand with feet planted. Soften jaw, drop shoulders. | Keep head quiet—only eyes will travel. | Small inhale... longer exhale. Tap Continue."

3. **Side to Side**: "Imagine a soft light at the left edge of your screen. | Let eyes follow it slowly to the right—smooth, no rush. | Breathe naturally as it moves. Tap Continue."

4. **Return Pass**: "The light drifts back to the left. Keep gaze fluid—no jumps. | Notice your out-breath lengthen as it comes home. | Repeat one more gentle pass. Tap Continue."

5. **Smooth Turns**: "The light draws a wide, slow circle. | Follow it all the way around... and again. Eyes move like water. | Neck easy, shoulders soft. Tap Continue."

6. **Rise & Settle**: "Watch the light rise to the top... then fall back down. | As it falls, let your body sink heavier into chair or feet. | Two vertical sweeps at an easy pace. Tap Continue."

7. **Easy Diagonals**: "Light moves top-left → bottom-right, then top-right → bottom-left. | One calm pass each way. Smooth movement. | Breathe out softly on downward legs. Tap Continue."

8. **Still Focus**: "Light settles in the centre and becomes a steady glow. | Rest gaze there. Let edges of vision soften. | Small inhale... longer exhale. Notice how quiet your head feels. Tap Continue."

9. **Reset Complete**: "Eyes steady, mind gathered, body calmer. | Keep this clear line of focus as you move to the next thing. Reset complete."

---

#### 3. Tension Outflow
**ID**: `restless-tension-outflow`  
**Science**: Short squeezes followed by clear releases help finish the fight–flight response and settle the body  
**Duration**: ~120 seconds  
**Safety Note**: "ease or skip any movement that isn't comfortable for you."

**Steps**:
1. **Tension Outflow**: "Restlessness usually means tension has nowhere to go. | We'll help it move out, bit by bit, without overdoing it. | Hold phone comfortably. Tap Continue."

2. **Grip & Let Go**: "Make soft fists with both hands—about 40% effort. Hold for 3... 2... 1... | Open hands slowly. Shake them out once or twice. | Repeat once more: hold 3... 2... 1... open and shake. Notice warmth in fingers. Tap Continue."

3. **Roll the Weight Off**: "Lift both shoulders up a little, then drop them. | Roll them back in two slow circles. Neck easy, jaw unclenched. | Repeat two more times. Feel more space across your chest. Tap Continue."

4. **Open, Then Ease**: "Small breath in—let chest open a touch. | Out-breath—let upper back soften towards neutral. | Repeat once: gentle open... gentle ease. Smooth and tidy. Tap Continue."

5. **Centre Release**: "Tighten stomach lightly for 3 seconds—just enough to notice. | Release and let breath drop lower. | One more light tighten... and release. Feel slack return to the middle. Tap Continue."

6. **Ground and Relax**: "Press both feet into the floor for 2 seconds. Let knees soften, weight settle. | Seated: notice chair doing the holding. Standing: feel floor take the load. | Tap Continue."

7. **Clear What's Left**: "Give hands a loose shake. Roll neck left and right (small range). | Loosen jaw and face. Bounce knees a centimetre if it helps. | Let last bits of tension drop away. Tap Continue."

8. **Reset Complete**: "Pause a moment. Notice: shoulders lower, hands warmer, body quieter. | Easy breath in... longer breath out. Energy's flowing again. Reset complete."

---

#### 4. The Stillness Curve
**ID**: `restless-stillness-curve`  
**Science**: Small, controlled movements that gradually fade help your balance system settle and reduce restlessness  
**Duration**: ~135 seconds  
**Safety Note**: "ease or skip any movement that isn't comfortable for you."

**Steps**:
1. **The Stillness Curve**: "We'll use tiny, easy movements and slow them down to calm your system. | Stand or sit where you feel steady. Hold phone comfortably. | When ready, tap Continue."

2. **Left to Right**: "Start a slow sway from left to right—only a few centimetres. | Feel weight move across feet (or hips if seated). | Shoulders soft, face loose. Tap Continue."

3. **Forward and Return**: "Lean a touch forward... then come back to centre. | Small, smooth range—controlled, not wobbly. | Do gently 8-10 times. Breathe naturally. Tap Continue."

4. **Easy Loops**: "Let upper body draw a slow circle—once clockwise, once anticlockwise. | Keep it tidy and relaxed. Head stays easy on top. | Seated: movement from ribs and hips. Do 8-10 times. Tap Continue."

5. **Taper the Movement**: "Make each circle smaller... smaller... | Sway becomes a tiny shift... then smaller again. | Guiding the dial down, not slamming brakes. Tap Continue."

6. **Neutral Balance**: "Find the point where you're barely moving—balanced but not stiff. | Let breath flow slowly on its own. Notice your heartbeat. | On next out-breath, relax grip on phone by 5%. Tap Continue."

7. **Notice the Quiet**: "Scan from head to toes: forehead, jaw, shoulders, chest, stomach, hips, legs, feet. | Where feels quieter than before? Rest your mind there. | One longer, easy out-breath. Tap Continue."

8. **Settle & Hold**: "Stay in that comfortable stillness for a few seconds. | Sink softly into stable position. Feet (or seat) holding you firm. | If a small wobble appears, let it pass—you're steady. Tap Continue."

9. **Reset Complete**: "Movement has eased into calm. | Notice: posture taller, breathing smoother, mind quieter. Reset complete."

---

### TIRED RESETS (4 total)

#### 1. Posture Ladder
**ID**: `tired-posture-ladder`  
**Science**: A little height + chest opening improves breathing mechanics and alertness  
**Duration**: ~105 seconds

**Steps**:
1. **Settle in**: "Light grip on your phone. Feet flat, hip-width apart. | We'll lift posture a notch at a time so energy rises without strain. Tap Continue."

2. **Find an easy height**: "Imagine a tiny thread lifting the crown of your head. Grow 1cm taller. | Keep ribs soft, bum relaxed. Notice extra space for air under your collarbones. | Tap Continue."

3. **Roll some space open**: "Roll both shoulders up... back... down. Pause. Repeat once, slower. | Feel shoulder blades settle lower; chest widens naturally. Tap Continue."

4. **Line up the head**: "Glide your chin gently back so ears stack over shoulders. | Unclench the jaw; tongue rests on roof of mouth. Breathe deeply and slowly. | Tap Continue."

5. **Let the ribs breathe**: "Inhale and feel yourself widen like an umbrella. Exhale, push air out, keep the form. | You've made space—a position of calm and confidence. Feel powerful and alert. | Tap Continue."

6. **Sweep and reset**: "Sweep your forearms forward and down, clearing the air in front of you. | Shoulder blades glide down; neck elongates upward. Face stays easy. | Tap Continue."

7. **Anchor tall**: "Rest forearms on thighs or desk with light contact. | Feel support below elbows and length above waist. Balanced, not rigid. Tap Continue."

8. **Wrap up**: "One clean breath in through the nose... longer breath out through the mouth. | Calm body, awake mind. Reset complete."

---

#### 2. Blink & Track
**ID**: `tired-blink-track`  
**Science**: Blink bursts + smooth eye travel wake the visual system and sharpen focus  
**Duration**: ~105 seconds

**Steps**:
1. **Set the screen**: "Hold the phone arm's length away. Head fairly still—eyes do the traveling. | Shoulders loose, face soft. Tap Continue."

2. **Freshen the eyes**: "Fixate on a small spot in the centre of the screen. Blink 5-7 quick times. | Vision should feel brighter and less gritty. Tap Continue."

3. **Left and right**: "Jump gaze to far left, then far right. Pause each side. One rep = 4 jumps. | Complete 5-10 sets. Notice heart rate and breath increase—nervous system waking. | Tap Continue."

4. **Up and down**: "Eyes to top edge, then bottom edge. Same small pause. | Complete 5-10 sets of 4 jumps. Focus sharpens without strain. Tap Continue."

5. **Diagonals**: "Top-left to bottom-right, then top-right to bottom-left. Complete 5-10 sets. | Jaw loose, shoulders easy, head quiet. Tap Continue."

6. **Soft circles**: "Trace a large, slow circle once clockwise, once anticlockwise. Silky, not jerky. | Do this 5 times. If eyes feel dry, blink softly and rejoin. Tap Continue."

7. **Hold the centre**: "Return to the centre point. Let edges soften, centre stays crisp. | Small inhale... longer exhale. Feel clarity arrive. Tap Continue."

8. **Wrap up**: "Notice the extra brightness in your view and the lift behind your eyes. | Carry this alertness into your next task. Reset complete."

---

#### 3. Circulation Primer
**ID**: `tired-circulation-primer`  
**Science**: Small rhythmic movement boosts blood flow and alertness without a jolt  
**Duration**: ~105 seconds  
**Safety Note**: "ease or skip any move that's uncomfortable."

**Steps**:
1. **Arrive**: "Sit or stand with a bit of space. We'll use small, joint-friendly movements. | If anything isn't comfortable, ease or skip it. Tap Continue."

2. **Wake the calves**: "Standing: lift heels off ground then lower, 10-12 reps. | Seated: alternate toe-presses and lifts, 10-12 reps. Feel warmth up the shins. Tap Continue."

3. **Wake the hands**: "Circle both wrists 5 times each way. Then light shake for a second or two. | Tingling in fingers = blood flow returning. Tap Continue."

4. **Open the shoulders**: "Elbows tucked, palms forward. Rotate forearms: palms to sky, pause, back down. | Three slow reps. Chest opens, neck stays long. Tap Continue."

5. **Gentle spine wave**: "Soft inhale: lift breastbone a few millimetres. Exhale: ease back to neutral. | Three smooth waves—no crunching or slumping. Tap Continue."

6. **Light rhythm**: "Standing: small march on the spot 15-20 seconds. Seated: brisk heel taps. | Let breath find the beat; keep shoulders relaxed. Tap Continue."

7. **Come back taller**: "Return to stillness a touch taller than when you began. | Notice a quiet hum in the body rather than heaviness. Tap Continue."

8. **Wrap up**: "Breathe in through the nose; out a fraction longer through the mouth. | Warm, switched on, ready. Reset complete."

---

#### 4. Sensory Switchboard
**ID**: `tired-sensory-switchboard`  
**Science**: Gentle touch + sound layering engages multiple sensory networks to lift alertness smoothly  
**Duration**: ~105 seconds

**Steps**:
1. **Start here**: "We'll wake touch and sound so your system switches on without a jolt. | Keep your grip on the phone relaxed. Tap Continue."

2. **Heat in the hands**: "Rub your palms together for 5-7 seconds. Notice heat spreading into fingers and thumbs. | That warmth is your 'on' signal. Tap Continue."

3. **Freshen the face**: "With warm hands, lightly press palms on cheeks, temples, scalp. Repeat 5 times. | Lift the skin rather than dragging it. Tap Continue."

4. **Switch on the ears**: "Run thumb and finger up outer ear edge from lobe to top, tiny upward tug, back down. | Repeat 5 times. This awakens the mind. Tap Continue."

5. **Brush the forearms**: "Brush one forearm from wrist to elbow, 3 slow passes, then swap. | Notice skin sensation and temperature changes. Tap Continue."

6. **Sort the sound**: "Pick a far sound. Notice it, stay with it for 5 seconds. | Pick a near sound (even breath). Notice it, stay with it for 5 seconds. Tap Continue."

7. **Snap the focus**: "Choose a tiny detail on the screen—a letter, an icon corner. | Hold it clearly for 3 seconds, then soften your gaze. Attention sharpens. Tap Continue."

8. **Wrap up**: "Sit or stand a touch taller. Short clean inhale; longer steady exhale. | Senses on, mind clear. Reset complete."

---

### SCATTERED RESETS (4 total)

#### 1. Focus Funnel
**ID**: `scattered-focus-funnel`  
**Science**: Attentional narrowing: wide → medium → narrow focus to reduce mental scatter  
**Duration**: ~90 seconds

**Steps**:
1. **Settle in**: "Hold your phone in a relaxed grip. Feet planted. | We'll bring the mind from 'everywhere' to 'just here'."

2. **Wide view**: "Look at the whole screen and a little beyond it. | Let your eyes notice edges, colours, and space around you."

3. **Medium view**: "Now let your gaze rest on the upper half of the screen only. | Fewer things. A touch quieter."

4. **Narrow view**: "Bring attention to one area the size of a coaster. | Stay there for a slow breath in… and a longer breath out."

5. **Single point**: "Choose one small point (icon corner, single letter). | Keep a soft, steady gaze. Jaw loose. Shoulders easy."

6. **Lock the lane**: "Quietly say in your head: 'Just this.' | Hold for one more breath. Let the rest fade to the edges."

7. **Tiny action rehearsal**: "Picture the very first tap or click you'll make after this screen. | See your thumb do it smoothly."

8. **Finish**: "From wide to one point. | Take a clean out-breath. You're centred again."

---

#### 2. Finger Ladder
**ID**: `scattered-finger-ladder`  
**Science**: Motor sequencing + bilateral rhythm to stabilise attention  
**Duration**: ~90 seconds  
**Safety Note**: "Skip or ease any movement that isn't comfortable for you."

**Steps**:
1. **Start**: "Rest elbows or forearms lightly. | We'll use a simple finger pattern to give your brain one clear track."

2. **Left hand pattern**: "Tap thumb to index–middle–ring–little, then back to ring–middle–index. | Slow and smooth."

3. **Right hand pattern**: "Same on the right: index–middle–ring–little… and back. | Keep the pace gentle; no rush."

4. **Together, alternating**: "Left does the pattern once, then right does it once. | Swap sides for two cycles. Breathe naturally."

5. **Together, mirrored**: "Both hands now, but mirrored (thumb to index at the same time, then middle, etc.). | One clean run up… and back."

6. **Slow the tempo**: "Do the mirrored run again, but a notch slower. | Feel the mind match the steadier rhythm."

7. **Stillness check**: "Rest your hands. | Notice how quiet the head feels when the sequence stops."

8. **Finish**: "One short in-breath, one longer out-breath. | Rhythm found, focus back. Reset complete."

---

#### 3. Grid Focus Drill
**ID**: `scattered-grid-focus`  
**Science**: Visuospatial working-memory; eyes-only tracking to tame "attention hopping"  
**Duration**: ~90 seconds

**Steps**:
1. **Set the scene**: "Imagine a simple 3×3 grid on your screen. | Nine squares, like a noughts-and-crosses board."

2. **Row scan**: "With only your eyes, trace the top row left-to-right… then the middle row… then the bottom row. | Smooth and slow."

3. **Column scan**: "Now trace the first column top-to-bottom… then the middle… then the last. | Keep breathing easily."

4. **Corners**: "Touch your gaze to each corner of the grid, clockwise. | One full lap."

5. **Centre**: "Settle your gaze on the centre square for one slow breath. | Let everything else soften."

6. **Short sequence**: "Follow this eyes-only path: top-middle → centre → bottom-middle → centre. | Do it twice, unhurried."

7. **Single square**: "Back to the centre square. | Hold gently there for a longer out-breath."

8. **Finish**: "The grid stays in your mind; noise drops. | You're steady enough to start the next thing."

---

#### 4. Single-Channel Mode
**ID**: `scattered-single-channel`  
**Science**: One sensory "channel" at a time to stop multi-task drift  
**Duration**: ~90 seconds

**Steps**:
1. **Start**: "Scattered often means too many channels at once. | We'll run one channel at a time."

2. **Eyes channel (10–15s)**: "Choose the eyes: look at a single spot on the screen. | Notice only shape, brightness, edges. Nothing else."

3. **Hands channel (10–15s)**: "Switch to hands: feel the phone's weight, the skin on your fingertips, the tiny warmth where you're holding it."

4. **Ears channel (10–15s)**: "Switch to ears: pick one far sound, then one near sound (even your breath). | Let the rest be background."

5. **Back to eyes (short)**: "Return to the same spot on the screen. | It's easier to hold now."

6. **Back to hands (short)**: "Feel the grip again; loosen it 5%. | Shoulders soften."

7. **Choose your working channel**: "Pick the channel you want to lead the next minute (eyes for reading, hands for doing, ears for listening). | Say it in your head: 'Eyes,' 'Hands,' or 'Ears.'"

8. **Finish**: "One channel, one lane. | Slow out-breath. Take that into your next action."

---

## 🎬 UI/UX Implementation Guide

### Screen Flow

```
1. Emotion Selector
   ↓
2. Reset List (filtered by emotion)
   ↓
3. Reset Player (step-by-step)
   ↓
4. Mood Rating (1-10 slider)
   ↓
5. Loop-back or Success
```

### 1. Emotion Selector Screen

**Layout**:
- Gradient background (purple-50 → violet-50 → blue-50)
- Title: "How are you feeling?" (h1, bold, centered)
- Subtitle: "Choose what you're experiencing right now, and we'll guide you through a science-backed reset" (bodySmall, gray-600)
- 5 emotion cards in grid (2 columns on mobile, 3 on tablet)
- Footer text: "All resets are under 2 minutes • Science-backed techniques • Instant relief"

**Emotion Card Component**:
```swift
struct EmotionCard: View {
    let emotion: EmotionalState
    
    var body: some View {
        Button(action: { selectEmotion() }) {
            VStack(alignment: .leading, spacing: 16) {
                // Icon circle with gradient
                Circle()
                    .fill(emotion.gradient)
                    .frame(width: 64, height: 64)
                    .overlay(
                        Image(systemName: emotion.icon)
                            .font(.system(size: 32))
                            .foregroundColor(.white)
                    )
                    .shadow(radius: 8)
                
                VStack(alignment: .leading, spacing: 8) {
                    Text(emotion.label)
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.primary)
                    
                    Text(emotion.description)
                        .font(.body)
                        .foregroundColor(.secondary)
                        .lineLimit(2)
                }
            }
            .padding(24)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(
                RoundedRectangle(cornerRadius: 24)
                    .fill(Color.white.opacity(0.8))
                    .shadow(color: .black.opacity(0.1), radius: 10, y: 4)
            )
        }
        .buttonStyle(ScaleButtonStyle())
    }
}

struct ScaleButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.95 : 1.0)
            .animation(.spring(response: 0.3, dampingFraction: 0.6), value: configuration.isPressed)
    }
}
```

---

### 2. Reset List Screen

**Layout**:
- Top navigation: Back button, emotion icon + label
- Title: emotion.label + " Resets" (h2, bold)
- List of reset cards (vertical stack, 16px spacing)
- Each card shows: name, description, duration, science benefit

**Reset Card Component**:
```swift
struct ResetListCard: View {
    let reset: Reset
    let emotion: EmotionalState
    
    var body: some View {
        Button(action: { startReset() }) {
            VStack(alignment: .leading, spacing: 12) {
                HStack {
                    Text(reset.name)
                        .font(.title3)
                        .fontWeight(.semibold)
                        .foregroundColor(.primary)
                    
                    Spacer()
                    
                    Text("\(reset.durationHintSeconds)s")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(
                            Capsule()
                                .fill(Color.gray.opacity(0.1))
                        )
                }
                
                Text(reset.description)
                    .font(.body)
                    .foregroundColor(.secondary)
                    .lineLimit(2)
                
                // Science benefit badge
                HStack(spacing: 4) {
                    Image(systemName: "brain.head.profile")
                        .font(.caption)
                    Text(reset.scienceBenefit)
                        .font(.caption)
                }
                .foregroundColor(emotion.gradient.colors.first)
            }
            .padding(20)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(
                RoundedRectangle(cornerRadius: 20)
                    .fill(Color.white.opacity(0.9))
                    .shadow(color: .black.opacity(0.08), radius: 8, y: 2)
            )
        }
        .buttonStyle(ScaleButtonStyle())
    }
}
```

---

### 3. Reset Player Screen

**Layout**:
- Top bar: "Finish Early" button (left), progress bar
- Main content area: step card (centered, glassmorphic)
- Bottom navigation: "Back" button (if step > 0), "Continue" button (primary)
- Progress dots indicator at bottom

**Step Card Component**:
```swift
struct ResetStepCard: View {
    let step: ResetStep
    let emotion: EmotionalState
    let stepIndex: Int
    let totalSteps: Int
    
    var body: some View {
        VStack(spacing: 32) {
            // Decorative gradient orb (animated)
            Circle()
                .fill(emotion.gradient.opacity(0.2))
                .frame(width: 128, height: 128)
                .blur(radius: 40)
                .scaleEffect(breathingScale)
                .animation(breathingAnimation, value: breathingScale)
            
            // Icon
            Circle()
                .fill(emotion.gradient)
                .frame(width: 64, height: 64)
                .overlay(
                    Image(systemName: "sparkles")
                        .font(.system(size: 32))
                        .foregroundColor(.white)
                )
                .shadow(radius: 8)
            
            // Title
            if !step.title.isEmpty {
                Text(step.title)
                    .font(.title2)
                    .fontWeight(.semibold)
                    .foregroundColor(.primary)
                    .multilineTextAlignment(.center)
                    .transition(stepTransition)
            }
            
            // Content lines
            VStack(spacing: 16) {
                ForEach(step.lines, id: \.self) { line in
                    Text(line)
                        .font(.body)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .lineSpacing(4)
                        .padding(.horizontal, 16)
                }
            }
            .transition(stepTransition)
            
            // Breathing cue indicator
            Circle()
                .fill(emotion.gradient)
                .frame(width: 12, height: 12)
                .scaleEffect(breathDotScale)
                .opacity(breathDotOpacity)
                .animation(breathingAnimation, value: breathDotScale)
        }
        .padding(48)
        .frame(maxWidth: .infinity)
        .frame(minHeight: 500)
        .background(
            RoundedRectangle(cornerRadius: 32)
                .fill(Color.white.opacity(0.95))
                .shadow(color: .black.opacity(0.15), radius: 20, y: 8)
        )
    }
}
```

**Navigation Buttons**:
```swift
struct ResetNavigationBar: View {
    let canGoBack: Bool
    let isLastStep: Bool
    let emotion: EmotionalState
    let onBack: () -> Void
    let onContinue: () -> Void
    
    var body: some View {
        HStack(spacing: 16) {
            if canGoBack {
                Button(action: onBack) {
                    Text("Back")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(.primary)
                        .frame(height: 56)
                        .padding(.horizontal, 32)
                        .background(
                            RoundedRectangle(cornerRadius: 16)
                                .stroke(Color.gray.opacity(0.3), lineWidth: 2)
                        )
                }
                .buttonStyle(ScaleButtonStyle())
            }
            
            Button(action: onContinue) {
                Text(isLastStep ? "Complete Reset" : "Continue")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 56)
                    .background(
                        RoundedRectangle(cornerRadius: 16)
                            .fill(emotion.gradient)
                            .shadow(color: emotion.gradient.colors.first!.opacity(0.3), radius: 8, y: 4)
                    )
            }
            .buttonStyle(ScaleButtonStyle())
        }
        .padding(.horizontal, 24)
    }
}
```

**Progress Indicator**:
```swift
struct ProgressDotsView: View {
    let currentStep: Int
    let totalSteps: Int
    let emotion: EmotionalState
    
    var body: some View {
        HStack(spacing: 8) {
            ForEach(0..<totalSteps, id: \.self) { index in
                RoundedRectangle(cornerRadius: 2)
                    .fill(index == currentStep ? emotion.gradient : Color.gray.opacity(0.3))
                    .frame(width: index == currentStep ? 24 : 8, height: 8)
                    .animation(.spring(response: 0.3), value: currentStep)
            }
        }
    }
}
```

---

### 4. Mood Rating Screen

**Layout**:
- Title: "How do you feel now?" (h2, centered)
- Subtitle: "Rate your mood from 1 (low) to 10 (high)" (body, gray)
- Slider with emoji indicators
- Submit button (large, centered)

```swift
struct MoodRatingView: View {
    @State private var mood: Double = 5.0
    let emotion: EmotionalState
    let onSubmit: (Int) -> Void
    
    var body: some View {
        VStack(spacing: 32) {
            VStack(spacing: 12) {
                Text("How do you feel now?")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                Text("Rate your mood from 1 (low) to 10 (high)")
                    .font(.body)
                    .foregroundColor(.secondary)
            }
            
            // Large mood display
            Text(moodEmoji)
                .font(.system(size: 80))
            
            Text("\(Int(mood))")
                .font(.system(size: 48, weight: .bold))
                .foregroundColor(.primary)
            
            // Slider
            VStack(spacing: 8) {
                Slider(value: $mood, in: 1...10, step: 1)
                    .accentColor(emotion.gradient.colors.first)
                
                HStack {
                    Text("1")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    Spacer()
                    Text("10")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
            }
            .padding(.horizontal, 24)
            
            // Submit button
            Button(action: { onSubmit(Int(mood)) }) {
                Text("Submit")
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 56)
                    .background(
                        RoundedRectangle(cornerRadius: 16)
                            .fill(emotion.gradient)
                    )
            }
            .buttonStyle(ScaleButtonStyle())
            .padding(.horizontal, 24)
        }
        .padding(32)
    }
    
    var moodEmoji: String {
        switch Int(mood) {
        case 1...3: return "😔"
        case 4...6: return "😐"
        case 7...8: return "🙂"
        case 9...10: return "😊"
        default: return "😐"
        }
    }
}
```

---

### 5. Loop-back Flow Logic

```swift
func handleMoodSubmission(mood: Int, emotion: EmotionalState) {
    if mood <= 3 {
        // Show "Try another reset?" prompt
        showAnotherResetPrompt(emotion: emotion)
    } else {
        // Show success and return to dashboard
        showSuccessScreen()
    }
}

struct AnotherResetPrompt: View {
    let emotion: EmotionalState
    let onYes: () -> Void
    let onNo: () -> Void
    
    var body: some View {
        VStack(spacing: 24) {
            Text("Try another reset?")
                .font(.title)
                .fontWeight(.bold)
            
            Text("You rated your mood low. Would you like to try another reset to feel better?")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            
            HStack(spacing: 16) {
                Button("Not Now") {
                    onNo()
                }
                .buttonStyle(.bordered)
                
                Button("Yes, Please") {
                    onYes()
                }
                .buttonStyle(.borderedProminent)
                .tint(emotion.gradient.colors.first)
            }
        }
        .padding(32)
    }
}
```

---

## 📊 Analytics & Tracking

### Session Data Model
```swift
struct SessionRecord: Codable {
    let id: UUID
    let userId: String
    let resetId: String
    let emotion: EmotionalState
    let moodBefore: Int? // Optional: if tracking pre-reset mood
    let moodAfter: Int
    let completedAt: Date
    let duration: Int // actual time spent in seconds
}
```

### Daily Usage Tracking
```swift
struct DailyUsage: Codable {
    let userId: String
    let date: Date
    let sessionCount: Int
}

// Check daily limit (3 free sessions)
func canStartSession(userId: String) -> Bool {
    let today = Calendar.current.startOfDay(for: Date())
    let usage = getDailyUsage(userId: userId, date: today)
    let isSubscribed = checkSubscriptionStatus(userId: userId)
    
    return isSubscribed || usage.sessionCount < 3
}
```

---

## 🔐 Subscription & Paywall

### When to Show Paywall
- After completing 3rd reset in a day (non-subscribers only)
- Before starting 4th reset
- Test accounts (specific emails) get unlimited access

```swift
struct PaywallView: View {
    let onSubscribe: () -> Void
    let onDismiss: () -> Void
    
    var body: some View {
        VStack(spacing: 24) {
            Text("You've used your 3 free resets today")
                .font(.title2)
                .fontWeight(.bold)
                .multilineTextAlignment(.center)
            
            Text("Subscribe to GetResett for unlimited resets and unlock your full potential")
                .font(.body)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
            
            // Pricing card
            VStack(spacing: 16) {
                Text("£1.99/month")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                
                VStack(alignment: .leading, spacing: 12) {
                    FeatureBullet(text: "Unlimited daily resets")
                    FeatureBullet(text: "All 19 science-backed techniques")
                    FeatureBullet(text: "Track your progress")
                    FeatureBullet(text: "Cancel anytime")
                }
            }
            .padding(24)
            .background(
                RoundedRectangle(cornerRadius: 20)
                    .fill(Color.white)
            )
            
            Button("Subscribe Now") {
                onSubscribe()
            }
            .buttonStyle(.borderedProminent)
            .controlSize(.large)
            
            Button("Maybe Later") {
                onDismiss()
            }
            .buttonStyle(.borderless)
        }
        .padding(32)
    }
}
```

---

## 🧪 Testing Checklist

### Manual Testing
- [ ] All 5 emotions display correctly
- [ ] Each emotion shows correct number of resets (4 stressed, 4 anxiety, 4 restless, 4 tired, 4 scattered)
- [ ] Step navigation works (Continue/Back)
- [ ] Progress bar updates correctly
- [ ] Text displays properly on all screen sizes (no overflow)
- [ ] Animations are smooth (60fps)
- [ ] Mood rating slider works
- [ ] Loop-back flow triggers correctly (mood ≤3)
- [ ] Daily session limit enforced
- [ ] Paywall appears at correct time
- [ ] Safety notes display for appropriate resets

### Accessibility
- [ ] VoiceOver compatibility
- [ ] Dynamic Type support
- [ ] High contrast mode
- [ ] Minimum touch target size: 44x44pt
- [ ] Screen reader announces step changes

### Performance
- [ ] App launches in <2 seconds
- [ ] Step transitions <500ms
- [ ] No memory leaks during extended sessions
- [ ] Offline mode (all reset content cached locally)

---

## 📝 Implementation Notes

### Text Formatting Rules
1. **Maximum 2-3 sentences per line** in steps
2. **Pipe character (|) separates paragraphs** within a step
3. **British English spelling** throughout (colour, centre, realise, etc.)
4. **Conversational, calming tone** - speak to stressed users
5. **Action-oriented** - clear instructions without jargon

### Animation Guidelines
1. **Breathing orb**: 4-second cycle (scale 1.0 → 1.2 → 1.0)
2. **Step transitions**: 0.5s fade with slight scale (0.95 → 1.0)
3. **Button press**: Spring animation, scale to 0.95
4. **Progress bar**: Smooth fill with 0.3s easing

### Safety Considerations
1. Display safety notes at start of applicable resets
2. Always allow users to exit mid-reset ("Finish Early")
3. Never auto-advance steps - user must tap Continue
4. Provide skip options for physical movements

---

## 🚀 Quick Start Implementation Plan

### Phase 1: Core UI (Week 1)
1. Design system setup (colors, fonts, spacing)
2. Emotion selector screen
3. Reset list screen
4. Basic step player (no animations)

### Phase 2: Reset Content (Week 2)
1. Import all 19 reset data structures
2. Implement step navigation
3. Add progress tracking
4. Test all content displays correctly

### Phase 3: Polish (Week 3)
1. Add animations and transitions
2. Implement mood rating
3. Add loop-back flow
4. Accessibility improvements

### Phase 4: Monetization (Week 4)
1. Session tracking
2. Daily limit enforcement
3. Paywall integration
4. Subscription flow (StoreKit)

---

**End of iOS Replication Guide**

*Last updated: [Today's Date]*  
*Web app reference: GetResett on Replit*  
*For questions or clarifications, refer to shared/resetData.ts in the web codebase*
