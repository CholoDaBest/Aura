# Magic Scroll Section

Here is the HTML and CSS snippet for the premium "How it Works" section. It uses a 300vh scrolling section with a `position: sticky` container to achieve the Apple-style scroll-linked animations. 

## HTML

```html
<section class="magic-scroll-section">
  <div class="magic-scroll-container">
    
    <!-- Left Column: Text Steps -->
    <div class="magic-scroll-text-col">
      <div class="magic-step is-active" id="step-1">
        <h3>01. Upload Sketch</h3>
        <p>Start with a simple hand-drawn sketch or basic 3D geometry. Our AI understands the spatial relationships and architectural intent instantly.</p>
      </div>
      <div class="magic-step" id="step-2">
        <h3>02. Define Style</h3>
        <p>Select from our curated premium styles or describe your vision using natural language. The possibilities are endless, but the quality is always pristine.</p>
      </div>
      <div class="magic-step" id="step-3">
        <h3>03. Render Magic</h3>
        <p>Watch as your raw concept transforms into a photorealistic architectural masterpiece in seconds. Ready to impress clients and win pitches.</p>
      </div>
    </div>

    <!-- Right Column: Image Wipe Effect -->
    <div class="magic-scroll-image-col">
      <div class="magic-image-wrapper">
        <!-- Base Sketch Image -->
        <img src="/assets/sketch-placeholder.jpg" alt="Architectural Sketch" class="magic-img-sketch" />
        
        <!-- Render Image with Mask for Wipe Effect -->
        <!-- JS will control the width of this mask based on scroll progress -->
        <div class="magic-img-render-mask" style="width: 0%;">
          <img src="/assets/render-placeholder.jpg" alt="Photorealistic Render" class="magic-img-render" />
        </div>
      </div>
    </div>

  </div>
</section>
```

## CSS

```css
/* 
  Global/Base requirements as requested: 
  Dark mode: #09090b 
  Modern sans-serif typography 
*/
:root {
  --bg-dark: #09090b;
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa; /* Zinc 400 for premium subtle contrast */
  --accent: #ffffff;
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

body {
  background-color: var(--bg-dark);
  color: var(--text-primary);
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 
  Magic Scroll Section 
  Height is 300vh to allow for 3 distinct scrolling phases 
*/
.magic-scroll-section {
  position: relative;
  width: 100%;
  background-color: var(--bg-dark);
  height: 300vh;
}

/* 
  Sticky Container 
  Stays fixed in the viewport while the section is being scrolled 
*/
.magic-scroll-container {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8vw;
  box-sizing: border-box;
}

/* ----------------------------------
   Text Column (Left)
----------------------------------- */
.magic-scroll-text-col {
  flex: 0 0 35%;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.magic-step {
  position: absolute;
  top: 50%;
  transform: translateY(-40%); /* Slightly offset for an upward slide-in effect */
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

/* Active class to be toggled via JS based on scroll position */
.magic-step.is-active {
  opacity: 1;
  transform: translateY(-50%);
  pointer-events: auto;
}

.magic-step h3 {
  font-size: 2.75rem;
  font-weight: 500;
  letter-spacing: -0.03em;
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
}

.magic-step p {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--text-secondary);
  font-weight: 400;
  margin: 0;
  max-width: 440px;
}

/* ----------------------------------
   Image Column (Right)
----------------------------------- */
.magic-scroll-image-col {
  flex: 0 0 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.magic-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  /* Sharp corners as requested */
  border-radius: 0; 
  background-color: #18181b; 
}

.magic-img-sketch,
.magic-img-render {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.magic-img-sketch {
  z-index: 1;
}

/* Mask container for the reveal wipe effect */
.magic-img-render-mask {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  /* The width here controls the wipe effect. 
     JS should interpolate this from 0% to 100% as the user scrolls between Step 2 and Step 3 */
  width: 0%; 
  overflow: hidden;
  z-index: 2;
  border-right: 1px solid rgba(255, 255, 255, 0.2); /* Subtle line for the wipe edge */
  box-shadow: 20px 0 30px -10px rgba(0,0,0,0.5); /* Adds depth to the wiping edge */
  will-change: width;
}

/* Ensure the inner image doesn't squash when the mask width changes, 
   but stays pinned to its native aspect ratio/size */
.magic-img-render-mask .magic-img-render {
  width: 100vw;
  /* Keep max-width matching the container width constraint */
  max-width: calc(1600px * 0.50); 
}

/* ----------------------------------
   Responsive Adjustments
----------------------------------- */
@media (max-width: 1024px) {
  .magic-scroll-container {
    flex-direction: column;
    padding: 4rem 2rem;
  }
  
  .magic-scroll-text-col {
    flex: 0 0 auto;
    height: 40vh;
    width: 100%;
    align-items: center;
    text-align: center;
  }
  
  .magic-step {
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .magic-scroll-image-col {
    flex: 0 0 auto;
    width: 100%;
    max-width: 500px;
    height: 50vh;
  }
  
  .magic-img-render-mask .magic-img-render {
    max-width: 500px; /* Match max-width constraint for mobile */
  }
}
```

## JavaScript Implementation Note

To complete the effect, you will need a small JS observer (like IntersectionObserver or GSAP ScrollTrigger) to:
1. Detect which 1/3rd of the `.magic-scroll-section` the user is currently scrolling through.
2. Toggle the `.is-active` class between `#step-1`, `#step-2`, and `#step-3`.
3. Animate the `width` property on `.magic-img-render-mask` from `0%` to `100%` directly mapped to the scroll progress of the section.
