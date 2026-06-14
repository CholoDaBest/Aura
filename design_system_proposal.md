# Aura Design System Proposal

Based on the Anti-Slop Frontend Skill guidelines, here is the refined design direction for the **Aura** architectural rendering platform. The goal is to move away from the generic "AI tech startup" look (emerald glows, quirky tech fonts) toward a premium, precision-tool aesthetic suitable for architects and 3D artists.

## 0. Design Read
> **"Reading this as: premium B2B landing page for architectural professionals, with a cold luxury / structural minimalist language, leaning toward native CSS + Geist + restrained motion."**

## 1. The Three Dials
* **`DESIGN_VARIANCE: 6`** (Minimalist / Clean) — The layout should feature highly structured, asymmetric grids and generous whitespace. The interface must act as a quiet, museum-like frame for the high-fidelity architectural renderings.
* **`MOTION_INTENSITY: 4`** (Subtle / Physical) — Smooth, deliberate reveals. Avoid bouncy springs or hyper-kinetic scroll hijacks. Any motion should feel like physical glass or precise machinery sliding into place.
* **`VISUAL_DENSITY: 3`** (Art Gallery / Airy) — Low density. Avoid cramming data. Let the architectural assets breathe with significant negative space.

## 2. Color Palette: "Cold Luxury & Blueprint"
*The current aesthetic of Zinc 950 + Emerald #10b981 + Glow Orbs reads as a generic "AI/Web3 startup". We are shifting to a precise, structural palette.*

* **Background (Base):** True Off-Black (`#0a0a0a`) — Provides infinite depth and makes 3D renderings pop.
* **Surface (Cards/Elements):** Smoke / Silver-Grey (`#171717` to `#262626`) — Used sparingly for containment.
* **Text (Primary):** Chrome / Crisp White (`#f5f5f5`) — High contrast without the eye strain of pure `#ffffff`.
* **Accent:** Blueprint Cobalt (`#005EFC`) — A single, highly saturated pop of color that evokes architectural blueprints and precision software.
* **Lighting/Materiality:** **Ban all "glow orbs" and AI purple/emerald neon.** Use sharp, structural inner borders (`border-white/10`) and subtle, physical highlights (glass refraction) to denote elevation.

## 3. Typography & Shape
* **Current Font:** Space Grotesk (Reads too quirky/indie-tech).
* **Proposed Typography:** **`Geist Display`** (for precise, neutral, striking headlines) paired with **`Geist Mono`** (for technical specs, measurements, and UI labels). This combination feels like a precision engineering tool rather than a playful startup.
* **Shape Lock:** Maintain the **0px border radius** (sharp corners). In an architectural context, sharp corners reinforce structural integrity, precision, and brutalist minimalism. Do not mix with pill buttons or rounded cards.

## 4. Next Steps
* Update `index.css` or Tailwind config to reflect the Cobalt + Off-Black palette.
* Strip out radial glow gradients and replace them with sharp `border-white/10` delineations.
* Swap Space Grotesk for Geist/Geist Mono via Next/Font or custom `@font-face`.
