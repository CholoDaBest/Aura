import React from 'react';

function Hero() {
  return (
    <>
      <header className="hero">
        <div className="hero-content">
          <div className="badge reveal-element">Aura Engine v2.0 Live</div>
          <h1 className="hero-title ">From Sketch to Cinematic Render.</h1>
          <p className="hero-subtext">Instantly transform basic interior photos and drawings into hyper-realistic, high-end architectural visualizations.</p>
          <div className="hero-actions">
            <a href="/#upload" className="cta-button primary" style={{textDecoration: `none`, display: `flex`, alignItems: `center`, justifyContent: `center`}}>Start Now</a>
            <button className="cta-button secondary">View Gallery</button>
          </div>
        </div>
        <div className="hero-image-wrapper reveal-element">
          <img src="/hero.png" alt="Aura Architectural Render" className="hero-image"  loading="lazy" />
        </div>
      </header>

      <div className="trust-stats-bar reveal-element" style={{display: `flex`, justifyContent: `center`, gap: `4rem`, flexWrap: `wrap`, padding: `2rem`, maxWidth: `1200px`, margin: `0 auto 4rem auto`, borderTop: `1px solid rgba(255,255,255,0.1)`, borderBottom: `1px solid rgba(255,255,255,0.1)`}}>
        <div style={{display: `flex`, alignItems: `center`, gap: `1rem`}}>
          <div style={{display: `flex`, marginLeft: `10px`}}>
            <img src="/avatar_sarah.png" style={{width: `40px`, height: `40px`, borderRadius: `50%`, border: `2px solid #09090b`, marginLeft: `-10px`}} loading="lazy" />
            <img src="/avatar_marcus.png" style={{width: `40px`, height: `40px`, borderRadius: `50%`, border: `2px solid #09090b`, marginLeft: `-10px`}} loading="lazy" />
            <img src="/avatar_elena.png" style={{width: `40px`, height: `40px`, borderRadius: `50%`, border: `2px solid #09090b`, marginLeft: `-10px`}} loading="lazy" />
          </div>
          <div>
            <div style={{fontWeight: `bold`, fontSize: `1.1rem`, color: `#fff`}}>2.68M+ users</div>
            <div style={{fontSize: `0.85rem`, color: `var(--text-secondary)`}}>Got their spaces reimagined</div>
          </div>
        </div>
        <div style={{display: `flex`, alignItems: `center`, gap: `1rem`}}>
          <div>
            <div style={{fontWeight: `bold`, fontSize: `1.1rem`, color: `#fff`}}>Rated Top-Notch</div>
            <div style={{fontSize: `0.85rem`, color: `var(--text-secondary)`}}>from 1,300+ reviews</div>
          </div>
          <div style={{color: `#10b981`, fontSize: `1.2rem`, letterSpacing: `2px`}}>★★★★★</div>
        </div>
        <div style={{display: `flex`, alignItems: `center`, gap: `2rem`}}>
          <div style={{textAlign: `center`}}>
            <div style={{fontWeight: `bold`, color: `#fff`}}>7.75M+</div>
            <div style={{fontSize: `0.8rem`, color: `var(--text-secondary)`}}>Projects</div>
          </div>
          <div style={{textAlign: `center`}}>
            <div style={{fontWeight: `bold`, color: `#fff`}}>170+</div>
            <div style={{fontSize: `0.8rem`, color: `var(--text-secondary)`}}>Countries</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
