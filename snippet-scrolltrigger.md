# GSAP ScrollTrigger 'Magic' Section Snippet

This snippet uses Vanilla JS and GSAP's ScrollTrigger to create an Apple-style scrolling section where text fades in and out while an image is wiped away based on the scroll progress.

## Assumptions

- You have included `gsap` and the `ScrollTrigger` plugin in your project.
- Your HTML structure looks something like this:

```html
<section class="sticky-container">
  <div class="text-column">
    <!-- Multiple text steps that fade in and out -->
    <div class="text-step">Step 1: The sketch</div>
    <div class="text-step">Step 2: Adding details</div>
    <div class="text-step">Step 3: The final render</div>
  </div>
  <div class="image-column">
    <img src="after-render.jpg" class="img-after" alt="Render">
    <img src="before-sketch.jpg" class="img-before" alt="Sketch">
  </div>
</section>
```

- Basic CSS to position the images absolutely on top of each other:

```css
.sticky-container {
  display: flex;
  height: 100vh; /* Full viewport height for the pinned section */
  align-items: center;
}
.text-column {
  flex: 1;
  position: relative;
  padding: 0 5%;
}
.text-step {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
}
.text-step:first-child {
  /* Give the first item relative positioning so the column has structure */
  position: relative; 
}
.image-column {
  flex: 1;
  position: relative;
  height: 80vh; /* Adjust as needed */
  margin-right: 5%;
  border-radius: 20px;
  overflow: hidden;
}
.image-column img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.img-before {
  z-index: 2; /* Ensure sketch is on top initially */
}
.img-after {
  z-index: 1;
}
```

## JavaScript Implementation

```javascript
// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize the main timeline tied to the scroll of the sticky container
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".sticky-container",
    start: "top top", // Pin when the top of container hits the top of viewport
    end: "+=3000",    // Total scroll duration (pixels) - adjust for desired scroll length
    scrub: true,      // Smoothly scrub the animation based on scroll progress
    pin: true,        // Pin the container in place
    anticipatePin: 1
  }
});

// 1. Text Fades In and Out
// Grab all text steps within the text column
const textSteps = gsap.utils.toArray(".text-column .text-step");

if (textSteps.length > 0) {
  // Distribute the duration evenly among all text steps on a scale of 0 to 1
  const stepDuration = 1 / textSteps.length;
  
  textSteps.forEach((step, i) => {
    const startTime = i * stepDuration;
    
    // Initial state setup via GSAP
    gsap.set(step, { opacity: 0, y: 30 });

    // Fade in and slide up slightly
    tl.to(step, {
      opacity: 1,
      y: 0,
      duration: stepDuration * 0.4,
      ease: "power2.out"
    }, startTime);

    // Fade out and slide up (unless it's the very last step)
    if (i !== textSteps.length - 1) {
      tl.to(step, {
        opacity: 0,
        y: -30,
        duration: stepDuration * 0.4,
        ease: "power2.in"
      }, startTime + (stepDuration * 0.6)); // Start fading out after it's been visible
    }
  });
}

// 2. Image Wipe Away (Sketch to Render)
// Make sure clipPath is initialized correctly to show the full image
gsap.set(".image-column .img-before", { clipPath: "inset(0% 0% 0% 0%)" });

// Animate the clip-path over the entire duration of the pinned scroll (duration: 1)
// 'inset(top right bottom left)' -> wiping from right to left
tl.to(".image-column .img-before", {
  clipPath: "inset(0% 100% 0% 0%)", 
  ease: "none", // Linear easing is best for a natural scrubbed wipe
  duration: 1   // This covers the full timeline progress from 0 to 1
}, 0); // Start at the very beginning of the timeline (time 0)
```
