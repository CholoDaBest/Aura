import React, { useEffect } from 'react';

export default function BentoGrid() {
  useEffect(() => {
    // ----------------------------------
    // Bento Grid Spotlight Effect
    // ----------------------------------
    const bentoGrid = document.querySelector('.bento-grid');
    if (bentoGrid) {
      const handleMouseMove = (e) => {
        const cards = document.querySelectorAll('.bento-item');
        for (const card of cards) {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
        }
      };
      
      bentoGrid.addEventListener('mousemove', handleMouseMove);
      
      // Cleanup event listener on unmount
      return () => {
        bentoGrid.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, []);

  return (
    <section className="bento-section reveal-element" id="capabilities">
      <div className="bento-header" style={{textAlign: `center`, marginBottom: `4rem`}}>
        <h2 className="section-title ">Engineered for Excellence.</h2>
        <p className="section-text" style={{maxWidth: `600px`, margin: `0 auto`}}>Everything you need to deliver world-class visualizations, packed into one seamless and intuitive workflow.</p>
      </div>
      <div className="bento-grid">
        <div className="bento-item">
          <div className="bento-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
          </div>
          <div className="bento-content">
            <h3>Hyper-Realism Engine</h3>
            <p>Our proprietary model is trained exclusively on high-end architectural photography and award-winning design catalogs. Experience perfect light falloff, authentic material reflections, and depth of field that rivals physical cameras.</p>
          </div>
        </div>
        <div className="bento-item">
          <div className="bento-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
          <div className="bento-content">
            <h3>4K+ Export</h3>
            <p>Generate massive, artifact-free resolution perfect for large print displays or crucial pitch decks.</p>
          </div>
        </div>
        <div className="bento-item">
          <div className="bento-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <div className="bento-content">
            <h3>Material Override</h3>
            <p>Instantly swap marble for raw concrete or dark oak with a single text prompt.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
