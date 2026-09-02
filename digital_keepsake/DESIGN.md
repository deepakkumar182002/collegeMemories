---
name: Digital Keepsake
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#5a413d'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#8e706c'
  outline-variant: '#e2bfb9'
  surface-tint: '#b22b1d'
  primary: '#570000'
  on-primary: '#ffffff'
  primary-container: '#800000'
  on-primary-container: '#ff8371'
  inverse-primary: '#ffb4a8'
  secondary: '#565e77'
  on-secondary: '#ffffff'
  secondary-container: '#d7dffd'
  on-secondary-container: '#5a627b'
  tertiary: '#332500'
  on-tertiary: '#ffffff'
  tertiary-container: '#4d3a00'
  on-tertiary-container: '#c6a34d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#8f0f07'
  secondary-fixed: '#dae2ff'
  secondary-fixed-dim: '#bec6e3'
  on-secondary-fixed: '#131b30'
  on-secondary-fixed-variant: '#3e465e'
  tertiary-fixed: '#ffdf96'
  tertiary-fixed-dim: '#e7c268'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#5a4400'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  headline-xl:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  note-lg:
    fontFamily: Caveat
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.2'
  note-md:
    fontFamily: Caveat
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.2'
  label-caps:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style
The design system balances the raw, tactile nostalgia of a physical scrapbook with the clarity of a modern digital archive. It is designed to evoke sentimentality, warmth, and the messy, vibrant energy of college life.

The aesthetic direction is **Tactile Glassmorphism**. It utilizes aged paper textures and physical metaphors (Polaroids, sticky notes, stamps) as the foundational layer, while employing frosted glass overlays for navigational elements and modern UI controls. This creates a "time machine" effect where modern technology sits atop historical memories. High-fidelity textures like grain, subtle paper crinkles, and notebook grids are essential to ground the experience in a physical reality.

## Colors
The palette is rooted in collegiate heritage and aged materials. 
- **Primary (Maroon):** Used for key actions and branding to evoke school spirit.
- **Secondary (Navy):** Reserved for high-level navigation and primary headings to provide a professional, structured contrast to the organic background.
- **Backgrounds:** Use `#FDFBF7` for the main canvas. Layer `#F4F1EA` for secondary "paper" components like lists or sidebar containers.
- **Accents:** Use Mustard, Sky, Pink, and Purple sparingly for "sticker" elements, status chips, and categorization markers.
- **Text:** Maintain high legibility with Charcoal Grey for all long-form body text.

## Typography
The typography strategy uses a dual-personality approach:
- **Functional UI:** Use **Montserrat** for headers and **Inter** for body text to ensure the platform remains a high-performance tool.
- **Personal Layer:** Use **Caveat** for "handwritten" content—captions, dates on the back of photos, sticky notes, and margin doodles.

When using Caveat, apply a slight -2 to -5 degree rotation to elements to mimic natural handwriting. Montserrat headers should always be in Deep Navy to maintain authority.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a heavy emphasis on intentional "organic misalignment." 

- **Grid:** Use a standard 12-column grid for structural elements (navigation, settings), but allow content cards (Polaroids, notes) to overlap grid lines or sit at slight angles.
- **Rhythm:** Use an 8px base unit. Larger margins (40px+) should be used on desktop to simulate the edges of a physical book.
- **Responsive:** On mobile, stack components vertically but maintain the "scrapbook" feel by alternating the tilt direction of cards (e.g., first card tilts 2deg right, second card tilts 1deg left).

## Elevation & Depth
Depth is created through a mix of physical stacking and modern blurs:
- **Tier 1 (Base):** The textured paper background (flat).
- **Tier 2 (The Scrapbook):** Polaroids and sticky notes with hard, slight "paper-thin" shadows (1px-2px offset, low blur) to feel like they are glued to the page.
- **Tier 3 (Interface):** Glassmorphic panels (Backdrop-filter: blur(12px)) used for the main navigation dock and modal overlays. These should have a subtle white inner-glow to represent a glass surface.
- **Tier 4 (Floating):** Doodles and "stickers" should have a slightly higher elevation (8px shadow) to appear as if they were just dropped onto the page.

## Shapes
Shapes in the design system should feel imperfect.
- **General UI:** Standard components use `roundedness: 1` (4px-8px) for a soft but clean look.
- **Polaroids:** Perfectly square corners for the photo, but the white "frame" should have a very subtle 2px radius.
- **Sticky Notes:** Use irregular border-radii (e.g., top-left: 2px, bottom-right: 12px) to simulate dog-eared or curled paper.
- **ID Cards:** Use `rounded-xl` to mimic the die-cut plastic of a real college ID.

## Components
- **Polaroid Frames:** A white container with a bottom-heavy margin for "handwritten" Caveat captions. Photos inside should have a subtle "film grain" overlay.
- **Sticky Notes:** Pastel-colored squares (Mustard, Pink, Purple) with a slight drop shadow. Use a "tape" texture (semi-transparent rectangle) at the top to "affix" them to the screen.
- **College ID Profile:** A horizontal card with a Deep Navy header, a small profile photo, and a "Barcode" decorative element at the bottom.
- **Film-Strip Gallery:** A horizontal scroll component with black perforated edges and a slight "shimmer" animation on the thumbnails.
- **Buttons:** 
  - *Primary:* Solid Maroon with Montserrat Bold text.
  - *Secondary:* Deep Navy outline with a subtle glass blur background.
- **Doodles & Stamps:** SVG overlays of stars, underlines, and "Approved" stamps that animate into view on scroll.
- **Timeline:** A vertical dashed line resembling a notebook spiral or a stitched thread, connecting different "chapters" of memories.