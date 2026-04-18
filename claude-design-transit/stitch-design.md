# Design System Strategy: Celestial Command

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Orbital Observatory."** 

This system moves away from the "flat web" of the past decade, embracing a cinematic, high-precision aesthetic that mirrors the instrumentation of deep-space exploration. We are not just building an interface; we are crafting a lens through which users observe complex data. 

To break the "template" look, the design system utilizes **intentional asymmetry**—aligning technical readouts to a rigorous but non-standard grid—and **tonal depth**. Large-scale typography overlaps glass containers, and high-contrast light beams (data lines) guide the eye across the canvas. Every element must feel like a deliberate piece of a high-functioning machine.

---

## 2. Colors: Solar and Sidereal
The color palette is grounded in the infinite depth of space, punctuated by the high-energy brilliance of a solar event.

*   **Primary (Solar Gold):** `#ffe3b7` (Primary) to `#ffba20` (Surface Tint). This represents energy and action. Use for mission-critical buttons and active states.
*   **Secondary/Tertiary (Laser Data):** `#bdf4ff` (Secondary) and `#91ff89` (Tertiary). These are your transmission lines—cyan and green beams that visualize data flow and connectivity.
*   **Neutrals (Deep Space):** The background is anchored in `#0f131f` (Surface/Background), a midnight blue that provides a high-contrast stage for typography.

### The "No-Line" Rule
Traditional 1px borders are strictly prohibited for sectioning. Structural boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section sitting against a `surface` background provides all the definition required. Boundaries should be felt, not seen.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers of frosted material.
1.  **Base:** `surface` (#0f131f)
2.  **Sectioning:** `surface-container-low` (#171b28)
3.  **Interactive Elements:** `surface-container-high` (#262a37)
4.  **Pop-overs/Modals:** `surface-bright` (#353946)

### The "Glass & Gradient" Rule
To achieve a premium, custom feel, use **Glassmorphism** for floating cards. Apply a semi-transparent `surface-variant` with a 20px-40px backdrop blur. 
**Signature Texture:** Use linear gradients (e.g., `#ffe3b7` to `#ffc041`) for primary CTA backgrounds to give them the radiant "glow" of the solar panels seen in our reference imagery.

---

## 3. Typography: Technical Authority
The typography system balances the raw power of mission titles with the precision of scientific documentation.

*   **Display & Headlines (Space Grotesk):** Bold, wide, and authoritative. Headlines should feel like "Mission Titles"—all caps is encouraged for `display-lg` and `headline-sm` to convey urgency and scale.
*   **Body (Manrope):** A clean, technical sans-serif. Manrope provides high legibility for dense data readouts.
*   **Labels (Inter):** Small, precise, and monospaced-adjacent. Used for data points, coordinates, and system status.

**Editorial Tip:** Use extreme scale contrast. Pair a `display-lg` mission header directly with a `body-sm` metadata block to create an "asymmetric tension" that feels sophisticated and modern.

---

## 4. Elevation & Depth
Elevation in this design system is conveyed through **Tonal Layering** and light simulation rather than drop shadows.

*   **The Layering Principle:** Depth is achieved by stacking tiers. Place a `surface-container-highest` card on a `surface-container-low` background. The subtle shift in hex value creates a "natural lift."
*   **Ambient Shadows:** If a card must float, use an extra-diffused shadow: `blur: 60px`, `spread: -10px`, `opacity: 6%`. The shadow color must be a tinted version of the background (`#000000` is forbidden).
*   **The "Ghost Border":** If a container requires an edge for accessibility, use the `outline-variant` (#4f4632) at **15% opacity**. It should appear as a faint glimmer of light catching a glass edge.
*   **Constellation Logo:** The logo should be treated as a glowing element. Use a subtle outer glow (`#ffe3b7` at 20% opacity) to make the bear line-art feel like a radiant star-cluster.

---

## 5. Components: High-Precision Instruments

### Buttons
*   **Primary:** Solar Gold gradient background, `on-primary` text. Square corners (`0px`).
*   **Secondary:** Ghost Border style. No fill, `secondary` text color, subtle glow on hover.
*   **Tertiary:** Plain text with a "Laser Beam" (1px cyan underline) that expands on hover.

### Cards & Lists
*   **Forbidden:** Divider lines.
*   **Action:** Separate list items with `16px` or `24px` of vertical white space or a subtle shift to `surface-container-lowest` on alternate rows. 
*   **Visuals:** Incorporate "High-Precision UI Elements"—small technical crosshairs or corner-brackets in `outline` color to "frame" content.

### Input Fields
*   **Style:** Minimalist. Only a bottom border using `outline-variant`. On focus, the border transforms into a `tertiary` (green) laser line with a subtle glow.
*   **Error State:** Use `error` (#ffb4ab) sparingly. The error state should feel like a system warning, not a design flourish.

### Signature Component: The Transmission Line
Use 1px–2px lines in `secondary` or `tertiary` colors to connect disparate data points or cards, mimicking the laser relay beams in the project’s visual references. These lines should have a `linear-gradient` fade to 0% opacity at their endpoints.

---

## 6. Do’s and Don’ts

### Do:
*   **Embrace the Dark:** Maintain the ultra-deep navy background. High-end cinematic experiences rely on deep blacks and rich dark blues to make highlights pop.
*   **Use Asymmetry:** Place data readouts in unexpected corners. Let the content breathe.
*   **Precision Details:** Add "Micro-Data" (tiny coordinates, timestamps) in `label-sm` near the corners of glass containers to reinforce the scientific tone.

### Don’t:
*   **No Rounded Corners:** `0px` is the rule. The system is technical, sharp, and precise. Rounding edges softens the "mission-critical" impact.
*   **No Heavy Borders:** Never use 100% opaque borders. They clutter the UI and break the "Glassmorphism" immersion.
*   **No Generic Icons:** Avoid "bubbly" or friendly icons. Use thin-stroke, geometric line art that matches the "Polaris Bear" constellation style.