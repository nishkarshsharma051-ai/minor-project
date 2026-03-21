# Design System Strategy: The Monochromatic Curator

## 1. Overview & Creative North Star
The North Star for this design system is **"The Digital Gallery."** 

Unlike generic analytics dashboards that clutter the viewport with borders and "boxes inside boxes," this system treats student data like high-end editorial content. We move beyond "minimalism" into "intentional void"—where white space isn't just empty, but a structural element that directs the eye. 

To break the "template" look, we utilize **Asymmetric Information Density**. Important KPIs are given massive, display-scale typography and sweeping negative space, while secondary metadata is tucked into tight, high-contrast clusters. We eschew the rigid grid in favor of overlapping layers and tonal depth, ensuring the application feels like a bespoke tool for high-level decision-making rather than a spreadsheet.

---

## 2. Colors: Tonal Architecture
We operate within a strict monochromatic spectrum, but "black and white" does not mean "flat." We use depth to define function.

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders (`#E5E7EB`) for sectioning or layout containment. 
Boundaries must be defined solely through background color shifts. A `surface-container-low` (#f3f3f4) card should sit on a `background` (#f9f9f9) canvas. If you find yourself reaching for a border, you have failed to use the spacing scale or tonal hierarchy effectively.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers, similar to stacked sheets of heavy-weight cotton paper.
*   **Base:** `surface` (#f9f9f9) - The primary canvas.
*   **Secondary Sections:** `surface-container-low` (#f3f3f4) - Used for sidebars or grouping related cards.
*   **Actionable Elements:** `surface-container-lowest` (#ffffff) - Used for the cards themselves to provide "lift" against the greyish base.
*   **Elevated Details:** `surface-container-high` (#e8e8e8) - Used for inset elements like search bars within a card.

### The "Glass & Gradient" Rule
To add "soul" to the monochrome palette:
*   **CTAs:** Use a subtle vertical gradient on `primary` buttons, transitioning from `#3b3b3b` (top) to `#000000` (bottom). This prevents buttons from looking like "dead holes" in the UI.
*   **Floating Elements:** Use Glassmorphism for overlays (Modals/Popovers). Use `surface_container_lowest` at 80% opacity with a `24px` backdrop-blur.

---

## 3. Typography: Editorial Authority
We use **Inter** as a variable font to create a sophisticated hierarchy that feels like a premium broadsheet.

*   **The Display Scale:** Use `display-lg` (3.5rem) for primary student metrics (e.g., a GPA or Attendance percentage). This massive scale creates a focal point that demands attention.
*   **The Headline/Body Contrast:** Headlines (`headline-md`) should be set to `SemiBold` (600) with a tighter letter-spacing (-0.02em). Body text (`body-md`) should be set to `Regular` (400) with generous line-height (1.6) to ensure the analytics remain readable during long sessions.
*   **The Label System:** `label-sm` should be used sparingly in `on_surface_variant` (#474747) and set in All Caps with +0.05em tracking to denote metadata or "helper" categories.

---

## 4. Elevation & Depth: Tonal Layering
Traditional "drop shadows" are a relic. We achieve hierarchy through **Natural Light Simulation.**

### The Layering Principle
Depth is achieved by "stacking" surface tiers. Place a `surface-container-lowest` card (Pure White) on a `surface` (Off-White) background. The 1% shift in hex code is enough for the human eye to perceive a change in plane without the visual noise of a line.

### Ambient Shadows
When an element must "float" (e.g., a dragged card or a notification), use an **Extra-Diffused Shadow**:
*   `box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.04);`
*   The shadow color is never pure black; it is a tinted version of the surface color to mimic ambient occlusion.

### The "Ghost Border" Fallback
If a border is required for accessibility (e.g., an input field), use a **Ghost Border**:
*   `outline-variant` (#c6c6c6) at **15% opacity**.
*   Standard 100% opaque borders are strictly forbidden.

---

## 5. Components

### Cards & Lists
*   **Rule:** Forbid the use of divider lines between list items.
*   **Implementation:** Use vertical spacing (`spacing-4` / 1.4rem) to separate entries. For list hover states, shift the background to `surface-container-highest` (#e2e2e2) with a `md` (0.75rem) corner radius.

### Buttons
*   **Primary:** Background `primary` (#000000), text `on_primary` (#e2e2e2). Corner radius `DEFAULT` (0.5rem).
*   **Secondary:** Background `transparent`, Ghost Border (15% opacity), text `primary`.
*   **Tertiary:** No background or border. Text `primary` with an underline that only appears on hover.

### Input Fields
*   Never use a 4-sided box. Use a `surface-container-low` background with a subtle bottom-weighted `primary` border (2px) that only appears when the field is `:focused`.

### Signature Component: The "Data Monolith"
For student analytics, use a component that combines a `display-sm` metric with a `body-sm` sparkline, wrapped in a `surface-container-lowest` card. No labels—the data should be so clear it explains itself.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use extreme white space. If a section feels "almost empty," you are doing it right.
*   **Do** use `soft rounded corners` (12px/0.75rem) consistently across all containers to humanize the high-contrast palette.
*   **Do** use "Secondary text" (#6B7280) for all non-essential information to keep the visual "weight" on the data.

### Don't:
*   **Don't** use pure `#000000` for long-form body text; use `on_surface` (#1a1c1c) to reduce eye strain.
*   **Don't** use standard icons. Use thin-stroke (1.5px) monochrome icons to match the weight of the Inter typeface.
*   **Don't** use "Alert Red" for errors unless it’s critical. Use the `error_container` (#ffdad6) with `on_error_container` (#410002) text for a more sophisticated, less jarring warning.