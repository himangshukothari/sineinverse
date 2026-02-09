# Game Block Generation Prompts for AI Studio

> **Purpose**: Use these prompts in AI Studio to generate beautiful, interactive game blocks.
> **Output**: Each block = React component + CSS module
> **Theme**: All blocks must be Valentine/Romantic themed

---

## File Structure for Each Block

```
game-blocks/
└── [block-name]-[theme]/
    ├── Block.tsx           # Main React component
    ├── Block.module.css    # Scoped styles
    ├── types.ts            # TypeScript interfaces
    └── README.md           # Block documentation
```

### Required Interface (All Blocks)

```typescript
interface BlockProps {
  config: BlockConfig;      // User-provided content
  onComplete: () => void;   // Called when block is done
}

interface BlockConfig {
  // Block-specific fields
}
```

---

# INTRO BLOCK PROMPTS

## Intro Block v1: Floating Hearts Entrance

```
Create a beautiful React intro block component for a Valentine's greeting card website.

REQUIREMENTS:
- Use React + TypeScript + CSS Modules
- Component name: IntroBlock
- Props: { recipientName: string, senderName: string, onStart: () => void }

VISUAL DESIGN:
- Full screen with gradient background (soft pink to rose gold)
- Recipient's name appears with elegant fade-in animation
- Floating CSS hearts in background (pure CSS, no emojis)
- "From [senderName]" appears below with delay
- Big pulsing "Open Your Gift" button at bottom
- Premium, luxury feel like a high-end invitation

ANIMATIONS (CSS only, no libraries):
- Name: letter-by-letter reveal with 50ms stagger
- Hearts: float upward with gentle sway, varied sizes
- Button: subtle pulse glow effect
- All animations should be smooth 60fps

COLORS:
- Primary: #f43f5e (rose-500)
- Secondary: #fda4af (rose-300)
- Gold accent: #d4af37
- Background: linear-gradient(135deg, #fff1f2, #ffe4e6)

OUTPUT: Block.tsx and Block.module.css files with complete, production-ready code.
```

## Intro Block v2: Envelope Opening

```
Create an elegant React intro block with envelope opening animation for a Valentine's card.

REQUIREMENTS:
- React + TypeScript + CSS Modules
- Component: EnvelopeIntro
- Props: { recipientName: string, message: string, onOpen: () => void }

VISUAL DESIGN:
- Centered 3D envelope with realistic paper texture
- Envelope has wax seal with heart design
- Click/tap to open with flip animation
- Letter slides up from inside envelope
- Letter reveals recipient name and teaser message

ANIMATIONS:
- Envelope flap: 3D rotate transform on X-axis
- Letter: translateY slide up after flap opens
- Wax seal: breaks/fades when clicked
- Sparkle particles around seal
- All using CSS transforms and keyframes

STYLING:
- Envelope: cream/ivory color with subtle shadow
- Wax seal: deep red (#be123c)
- Letter: white with subtle paper texture
- Premium, tactile appearance

OUTPUT: Complete Block.tsx and Block.module.css
```

## Intro Block v3: Typewriter Love Letter

```
Create a romantic typewriter-style intro for a Valentine's greeting card.

REQUIREMENTS:
- React + TypeScript + CSS Modules
- Component: TypewriterIntro
- Props: { lines: string[], recipientName: string, onComplete: () => void }

VISUAL DESIGN:
- Vintage paper background with subtle aging effects
- Typewriter font (use Google Fonts: 'Special Elite' or similar)
- Text appears letter by letter with typewriter sound timing
- Blinking cursor during typing
- Subtle coffee stain decorations in corners

ANIMATIONS:
- Each letter: instant appear with slight cursor jump
- Lines: 100ms delay between lines
- Paper: very subtle breathing/floating effect
- Cursor: classic 530ms blink interval

FEATURES:
- Skip button (subtle) to complete instantly
- Auto-advance after typing complete
- Responsive sizing

OUTPUT: Complete React component with CSS
```

---

# MEMORY MATCH PROMPTS

## Memory Match v1: Photo Hearts

```
Create an interactive memory match game for a Valentine's card with heart-shaped cards.

REQUIREMENTS:
- React + TypeScript + CSS Modules
- Component: MemoryMatch
- Props: { 
    images: string[],  // 6 images (creates 12 cards = 6 pairs)
    onComplete: (moves: number, time: number) => void 
  }

GAMEPLAY:
- 12 heart-shaped cards in 4x3 grid
- Click to flip and reveal image
- Match pairs to clear them
- Track moves and time
- Celebration animation on completion

VISUAL DESIGN:
- Cards: heart-shaped with rose gold border
- Card back: elegant pattern with mini hearts
- Flip: 3D rotation with perspective
- Matched cards: glow and scale up, then fade with hearts burst
- Grid: centered with soft shadow

ANIMATIONS:
- Card flip: 400ms 3D rotateY
- Match found: pulse + particle burst
- Wrong match: gentle shake
- Victory: confetti hearts falling

COLORS:
- Card back: #f43f5e
- Card border: #d4af37 (gold)
- Background: soft cream #fefbf6

OUTPUT: Complete game component ready to use
```

## Memory Match v2: Polaroid Memories

```
Create a memory match game with Polaroid-style photo cards for couples.

REQUIREMENTS:
- React + TypeScript + CSS Modules  
- Component: PolaroidMemory
- Props: { photos: string[], captions?: string[], onComplete: () => void }

VISUAL:
- Cards look like Polaroid instant photos
- White border, slight rotation variation (-3 to +3 degrees)
- Handwritten-style caption under each photo
- Scattered layout feel (grid but random rotations)
- Vintage, nostalgic romantic mood

ANIMATIONS:
- Flip: photos develop like real Polaroid (fade in from white)
- Match: photos "pin" together with heart clip
- Shake: photo flutter like in wind
- Complete: photos arrange into heart shape

TECHNICAL:
- Touch/click accurate on rotated cards
- Smooth 60fps animations
- Works on mobile

OUTPUT: Block.tsx and Block.module.css
```

---

# SPIN WHEEL PROMPTS

## Spin Wheel v1: Fortune of Love

```
Create a beautiful spin wheel game for revealing romantic messages.

REQUIREMENTS:
- React + TypeScript + CSS Modules
- Component: SpinWheel
- Props: { 
    segments: { text: string, color?: string }[],
    onResult: (segment: string) => void 
  }

VISUAL DESIGN:
- Large centered wheel with 6-8 segments
- Alternating rose/gold colors
- Ornate center hub with heart design
- Golden pointer/arrow at top
- Luxury casino/fortune wheel feel

WHEEL DESIGN:
- Segments have curved text following arc
- Gold separator lines between segments
- Subtle inner shadow for depth
- Outer rim with decorative beading

ANIMATIONS:
- Spin: realistic physics (fast start, slow ease-out)
- Duration: 4-6 seconds
- Multiple rotations (5-8 full spins)
- Landing: gentle bounce at stop
- Result: winning segment glows/pulses

INTERACTION:
- "Spin" button with shimmer effect
- Disable during spin
- Result popup after stop

OUTPUT: Complete spinning wheel component
```

## Spin Wheel v2: Roulette of Reasons

```
Create an elegant roulette-style wheel for "Reasons I Love You" game.

REQUIREMENTS:
- React + TypeScript + CSS Modules
- Component: LoveRoulette
- Props: { reasons: string[], onReveal: (reason: string) => void }

VISUAL:
- Circular wheel divided into segments
- Each segment: number + icon
- Deep red and gold color scheme
- Realistic 3D depth effect
- Ball that rolls around rim before dropping

MECHANICS:
- Click to release ball
- Ball circles outer rim multiple times
- Falls into random segment with bounce physics
- Segment lifts/highlights to reveal full reason text

STYLING:
- Wood-grain stand at bottom
- Metallic sheen on wheel surface
- Soft shadows for realism
- Velvet texture for background

OUTPUT: Interactive wheel with realistic ball physics
```

## Spin Wheel v3: Flower Picker

```
Create a romantic flower-themed wheel for Valentine's gifts.

REQUIREMENTS:
- React + TypeScript + CSS Modules
- Component: FlowerWheel  
- Props: { petals: { text: string }[], onPick: (text: string) => void }

VISUAL:
- Wheel designed as blooming flower
- Each segment is a petal (soft curves)
- Center: detailed rose graphic
- Petals: gradient pinks and reds
- Butterflies floating around

ANIMATIONS:
- Spin: petals slightly wave during rotation
- Stop: selected petal "blooms" larger
- Butterfly lands on chosen petal
- Petal reveals message with unfold effect

AMBIENT:
- Subtle particle pollen in background
- Gentle floating animation on idle
- Premium botanical illustration style

OUTPUT: Complete floral wheel component
```

---

# SCRATCH CARD PROMPTS

## Scratch Card v1: Golden Ticket

```
Create a luxury scratch card reveal for Valentine's gifts.

REQUIREMENTS:
- React + TypeScript + CSS Modules
- Component: ScratchCard
- Props: { 
    revealContent: ReactNode,
    coverImage?: string,
    onReveal: () => void 
  }

VISUAL:
- Card size: 280x180px or responsive
- Scratch layer: golden metallic gradient
- "Scratch to reveal" text on overlay
- Underneath: message or image
- Luxury feel, like real lottery ticket

SCRATCH MECHANICS:
- Canvas-based scratch effect
- Touch/mouse drawing erases overlay
- Variable brush size (40-60px)
- Sparkle particles follow scratch path
- Auto-reveal when 60% scratched

STYLING:
- Card: rounded corners, embossed border
- Metallic shimmer on scratch layer
- Reveal: confetti burst animation
- Gold and rose color scheme

TECHNICAL:
- Works on touch devices
- Smooth performance
- Proper cleanup on unmount

OUTPUT: Canvas-based scratch card component
```

## Scratch Card v2: Love Letter Seal

```
Create a wax seal scratch reveal for romantic messages.

REQUIREMENTS:
- React + TypeScript + CSS Modules
- Component: WaxSealReveal
- Props: { message: string, onBreak: () => void }

VISUAL:
- Aged parchment paper background
- Large circular wax seal covering message
- Seal: detailed heart crest design
- Seal color: deep burgundy/red

INTERACTION:
- Scratch/rub seal to break it
- Seal cracks appear as you scratch
- Pieces fall away with physics
- Message revealed underneath

ANIMATIONS:
- Crack lines: SVG animated paths
- Pieces: gravity fall + slight rotation
- Reveal: message fades in from beneath
- Dust particles on break

OUTPUT: Interactive wax seal breaking component
```

---

# FINALE BLOCK PROMPTS

## Finale v1: The Big Question

```
Create a dramatic finale block for Valentine's proposals/asks.

REQUIREMENTS:
- React + TypeScript + CSS Modules
- Component: FinaleAsk
- Props: { 
    question: string,
    yesText: string,
    noText: string,
    onYes: () => void,
    onNo: () => void 
  }

VISUAL:
- Full screen dramatic reveal
- Question appears with spotlight effect
- Two buttons: Yes and No
- Romantic background (stars/hearts)
- Premium, high-stakes feel

YES BUTTON:
- Large, prominent, glowing
- Pulse animation to draw attention
- Click: explosion of hearts + celebration

NO BUTTON:
- Smaller, muted colors
- Runs away from cursor (playful)
- Gets smaller each attempt
- Eventually "gives up" and triggers yes anyway

CELEBRATION:
- Full-screen confetti hearts
- "Yes!" text with bounce animation
- Success sound cue (optional)

OUTPUT: Interactive finale component with playful no button
```

## Finale v2: Heartbeat Reveal

```
Create a heartbeat-themed finale with dramatic reveal.

REQUIREMENTS:
- React + TypeScript + CSS Modules
- Component: HeartbeatFinale
- Props: { 
    message: string,
    ctaText: string,
    onAction: () => void 
  }

VISUAL:
- Giant pulsing heart that syncs with animation
- Heart rate monitor line running across
- Message revealed inside heart
- EKG beeps becoming faster as you watch

ANIMATION SEQUENCE:
1. Heart appears, slow steady beat
2. Beat gradually speeds up (excitement)
3. Heart "stops" dramatically (flatline effect)
4. Beat returns fast with big message reveal
5. CTA button with pulse

STYLING:
- Deep red heart with gradient
- Glowing edges on beat
- Dark background with vignette
- Medical/romantic fusion aesthetic

OUTPUT: Dramatic heartbeat reveal component
```

---

# USAGE NOTES FOR AI STUDIO

1. **Copy one prompt at a time** - Each prompt is self-contained
2. **Specify output format** - Ask for both .tsx and .module.css
3. **Request complete code** - No placeholders or "..." 
4. **Test locally** - Drop into game-blocks folder and test
5. **Iterate** - If not perfect, ask AI to refine specific parts

## Quality Checklist
- [ ] No emojis used (we don't use emojis)
- [ ] CSS modules (not inline styles)
- [ ] TypeScript interfaces defined
- [ ] Animations are 60fps smooth
- [ ] Works on mobile/touch
- [ ] Valentine's romantic theme
- [ ] Colors match brand (rose/gold/cream)
