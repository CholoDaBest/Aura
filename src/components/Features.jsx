import React from 'react';

export default function Features() {
  return (
    <section id="features" className="feature-section">
      <div className="feature-text reveal-element">
        <h2 className="section-title">Flawless Lighting. Premium Textures.</h2>
        <p className="section-text">Aura's engine understands architectural materials. From polished concrete to dark oak, every surface is rendered with absolute physical accuracy.</p>
      </div>
      <div className="feature-image-wrapper reveal-element">
        <img src="/demo.png" alt="Sketch to Render Comparison" className="feature-image" loading="lazy" />
      </div>
    </section>
  );
}
