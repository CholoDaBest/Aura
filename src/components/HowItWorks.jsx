import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  useEffect(() => {
    // ----------------------------------
    // Magic Scroll Section Logic
    // ----------------------------------
    const magicSection = document.querySelector(".magic-scroll-section");
    if (magicSection) {
      const magicTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".magic-scroll-section",
          start: "top top",
          end: "bottom bottom", // Ties perfectly to the 300vh CSS height
          scrub: 1 // Smooth scrubbing
        }
      });

      const textSteps = gsap.utils.toArray(".magic-scroll-text-col .magic-step");
      
      if (textSteps.length > 0) {
        const stepDuration = 1 / textSteps.length;
        
        textSteps.forEach((step, i) => {
          const startTime = i * stepDuration;
          
          // Initially hide all but the first (CSS handles first via .is-active, but GSAP takes over)
          if(i !== 0) gsap.set(step, { opacity: 0, y: "10%" });
          
          // Fade In
          if(i !== 0) {
            magicTl.to(step, {
              opacity: 1,
              y: "-50%",
              duration: stepDuration * 0.3,
              ease: "power2.out"
            }, startTime);
          } else {
            // First step is already visible, just ensure it stays for a bit
            gsap.set(step, { opacity: 1, y: "-50%" });
          }

          // Fade Out (unless it's the last step)
          if (i !== textSteps.length - 1) {
            magicTl.to(step, {
              opacity: 0,
              y: "-90%",
              duration: stepDuration * 0.3,
              ease: "power2.in"
            }, startTime + (stepDuration * 0.7));
          }
        });
      }

      // Image Wipe Away (Sketch -> Render)
      // Mask starts fully hiding the render (wiped to the right edge)
      gsap.set(".magic-img-render-mask", { clipPath: "inset(0% 100% 0% 0%)" });
      
      // Animate the clip-path over the entire duration to reveal the render
      magicTl.to(".magic-img-render-mask", {
        clipPath: "inset(0% 0% 0% 0%)", 
        ease: "none",
        duration: 1 
      }, 0);

      return () => {
        if (magicTl) magicTl.kill();
      };
    }
  }, []);

  return (
    <section className="magic-scroll-section" id="how-it-works">
      <div className="magic-scroll-container">
        
        <div className="magic-scroll-text-col">
          <div className="magic-step is-active" id="step-1">
            <h3>01. Upload Sketch</h3>
            <p>Start with a simple hand-drawn sketch or basic 3D geometry. Our AI understands the spatial relationships and architectural intent instantly.</p>
          </div>
          <div className="magic-step" id="step-2">
            <h3>02. Define Style</h3>
            <p>Select from our curated premium styles or describe your vision using natural language. The possibilities are endless, but the quality is always pristine.</p>
          </div>
          <div className="magic-step" id="step-3">
            <h3>03. Render Magic</h3>
            <p>Watch as your raw concept transforms into a photorealistic architectural masterpiece in seconds. Ready to impress clients and win pitches.</p>
          </div>
        </div>

        <div className="magic-scroll-image-col">
          <div className="magic-image-wrapper">
            <img src="/magic-sketch.png" alt="Architectural Sketch" className="magic-img-sketch" loading="lazy" />
            <div className="magic-img-render-mask" style={{clipPath: `inset(0% 100% 0% 0%)`}}>
              <img src="/magic-render.png" alt="Photorealistic Render" className="magic-img-render" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
