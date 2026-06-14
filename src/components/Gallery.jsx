import React, { useEffect } from 'react';

export default function Gallery() {
  useEffect(() => {
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

    const cards = document.querySelectorAll('.aura-card');
    
    // Store handler references for potential cleanup if we needed, but since they're attached
    // to elements inside the component, we only strictly need to clean up window listeners.
    cards.forEach(card => {
      const inner = card.querySelector('.aura-card-inner');
      if(!inner) return;
      
      card.addEventListener('mousedown', (e) => {
        activeGalleryInner = inner;
        updateGallerySplit(inner, e.clientX);
      });
      
      card.addEventListener('touchstart', (e) => {
        activeGalleryInner = inner;
        updateGallerySplit(inner, e.touches[0].clientX);
      }, { passive: true });
    });

    const onMouseMove = (e) => {
      if(activeGalleryInner) {
        updateGallerySplit(activeGalleryInner, e.clientX);
      }
    };
    
    const onMouseUp = () => {
      activeGalleryInner = null;
    };
    
    const onTouchMove = (e) => {
      if(activeGalleryInner) {
        updateGallerySplit(activeGalleryInner, e.touches[0].clientX);
      }
    };
    
    const onTouchEnd = () => {
      activeGalleryInner = null;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Cleanup function
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <section className="aura-gallery-section">
      <div className="aura-gallery-header">
        <h2 className="aura-headline">Community Renders</h2>
        <p className="aura-subtext">Drag the sliders on any card to reveal the original architectural sketch. A collection of spatial redesigns by the Aura community.</p>
      </div>
    
      <div className="aura-masonry-grid">
        <div className="aura-card size-featured">
          <div className="aura-card-inner">
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="After: Minimalist Living Room" className="img-after"  loading="lazy" />
            <img src="https://images.unsplash.com/photo-1583847268964-b28ce8fba18e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Before: Cluttered Room" className="img-before"  loading="lazy" />
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
            <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="After: Modern Kitchen" className="img-after"  loading="lazy" />
            <img src="https://images.unsplash.com/photo-1556910103-1c02745a828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Before: Old Kitchen" className="img-before"  loading="lazy" />
            <div className="gallery-slider-handle"></div>
            <div className="aura-card-overlay">
              <h3>Onyx Kitchen</h3>
              <p>By @studio_k</p>
            </div>
          </div>
        </div>
        <div className="aura-card size-standard">
          <div className="aura-card-inner">
            <img src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="After: Sunny Bedroom" className="img-after"  loading="lazy" />
            <img src="https://images.unsplash.com/photo-1522771731470-bea437360f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Before: Dark Bedroom" className="img-before"  loading="lazy" />
            <div className="gallery-slider-handle"></div>
            <div className="aura-card-overlay">
              <h3>Morning Light</h3>
              <p>By @jane_doe</p>
            </div>
          </div>
        </div>
        <div className="aura-card size-standard">
          <div className="aura-card-inner">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="After: Brutalist Bathroom" className="img-after"  loading="lazy" />
            <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Before: Standard Bathroom" className="img-before"  loading="lazy" />
            <div className="aura-card-overlay">
              <h3>Brutalist Wash</h3>
              <p>By @raw_form</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
