import React, { useEffect } from 'react';
import gsap from 'gsap';

export default function Features() {
  useEffect(() => {
    // ----------------------------------
    // Magnetic Physics Buttons
    // ----------------------------------
    const magneticButtons = document.querySelectorAll('.cta-button, .login-btn');
    const magneticCleanup = [];

    magneticButtons.forEach(btn => {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.8, ease: "elastic.out(1, 0.3)" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.8, ease: "elastic.out(1, 0.3)" });

      const onMouseMove = (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distanceX = (e.clientX - centerX) * 0.4;
        const distanceY = (e.clientY - centerY) * 0.4;
        
        xTo(distanceX);
        yTo(distanceY);
      };

      const onMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      btn.addEventListener('mousemove', onMouseMove);
      btn.addEventListener('mouseleave', onMouseLeave);

      magneticCleanup.push(() => {
        btn.removeEventListener('mousemove', onMouseMove);
        btn.removeEventListener('mouseleave', onMouseLeave);
      });
    });

    // ----------------------------------
    // Community Gallery Before/After Sliders (Click & Drag)
    // ----------------------------------
    let activeGalleryInner = null;

    const updateGallerySplit = (inner, clientX) => {
      const rect = inner.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percent = (x / rect.width) * 100;
      inner.style.setProperty('--split', `${percent}%`);
    };

    const galleryInnerElements = [];
    
    document.querySelectorAll('.aura-card').forEach(card => {
      const inner = card.querySelector('.aura-card-inner');
      if(!inner) return;
      
      galleryInnerElements.push({ card, inner });
      
      card.addEventListener('mousedown', (e) => {
        activeGalleryInner = inner;
        updateGallerySplit(inner, e.clientX);
      });
      
      card.addEventListener('touchstart', (e) => {
        activeGalleryInner = inner;
        updateGallerySplit(inner, e.touches[0].clientX);
      }, { passive: true });
    });

    const onWindowMouseMove = (e) => {
      if(activeGalleryInner) {
        updateGallerySplit(activeGalleryInner, e.clientX);
      }
    };

    const onWindowMouseUp = () => {
      activeGalleryInner = null;
    };

    const onWindowTouchMove = (e) => {
      if(activeGalleryInner) {
        updateGallerySplit(activeGalleryInner, e.touches[0].clientX);
      }
    };

    const onWindowTouchEnd = () => {
      activeGalleryInner = null;
    };

    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('mouseup', onWindowMouseUp);
    window.addEventListener('touchmove', onWindowTouchMove, { passive: true });
    window.addEventListener('touchend', onWindowTouchEnd);

    // Cleanup function
    return () => {
      magneticCleanup.forEach(cleanup => cleanup());
      
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup', onWindowMouseUp);
      window.removeEventListener('touchmove', onWindowTouchMove);
      window.removeEventListener('touchend', onWindowTouchEnd);
    };
  }, []);

  return (
    <>
      <section className="aura-gallery-section">
        <div className="aura-gallery-header">
          <h2 className="aura-headline">Community Renders</h2>
          <p className="aura-subtext">Drag the sliders on any card to reveal the original architectural sketch. A collection of spatial redesigns by the Aura community.</p>
        </div>
      
        <div className="aura-masonry-grid">
          <div className="aura-card size-featured">
            <div className="aura-card-inner">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="After: Minimalist Living Room" className="img-after" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1583847268964-b28ce8fba18e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Before: Cluttered Room" className="img-before" loading="lazy" />
              <div className="gallery-slider-handle"></div>
              <div className="aura-card-overlay">
                <span className="aura-badge">Featured</span>
                <h3>Linear Calm</h3>
                <p>By @alex_design</p>
              </div>
            </div>
          </div>
          <div className="aura-card size-tall">
            <div className="aura-card-inner">
              <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="After: Modern Kitchen" className="img-after" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1556910103-1c02745a828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Before: Old Kitchen" className="img-before" loading="lazy" />
              <div className="gallery-slider-handle"></div>
              <div className="aura-card-overlay">
                <h3>Onyx Kitchen</h3>
                <p>By @studio_k</p>
              </div>
            </div>
          </div>
          <div className="aura-card size-standard">
            <div className="aura-card-inner">
              <img src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="After: Sunny Bedroom" className="img-after" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1522771731470-bea437360f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Before: Dark Bedroom" className="img-before" loading="lazy" />
              <div className="gallery-slider-handle"></div>
              <div className="aura-card-overlay">
                <h3>Morning Light</h3>
                <p>By @jane_doe</p>
              </div>
            </div>
          </div>
          <div className="aura-card size-standard">
            <div className="aura-card-inner">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="After: Brutalist Bathroom" className="img-after" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Before: Standard Bathroom" className="img-before" loading="lazy" />
              <div className="aura-card-overlay">
                <h3>Brutalist Wash</h3>
                <p>By @raw_form</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="feature-section">
        <div className="feature-text reveal-element">
          <h2 className="section-title">Flawless Lighting. Premium Textures.</h2>
          <p className="section-text">Aura's engine understands architectural materials. From polished concrete to dark oak, every surface is rendered with absolute physical accuracy.</p>
        </div>
        <div className="feature-image-wrapper reveal-element">
          <img src="/demo.png" alt="Sketch to Render Comparison" className="feature-image" loading="lazy" />
        </div>
      </section>
    </>
  );
}
