import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const cursorRef = useRef(null);
  const cursorFollowerRef = useRef(null);

  useEffect(() => {
    // Custom Cursor Logic
    const cursor = cursorRef.current;
    const cursorFollower = cursorFollowerRef.current;
    
    if (cursor && cursorFollower) {
      let mouseX = 0, mouseY = 0;
      let followerX = 0, followerY = 0;

      const onMouseMove = (e) => {
        mouseX = e.clientX; mouseY = e.clientY;
        gsap.set(cursor, { x: mouseX, y: mouseY });
      };

      window.addEventListener('mousemove', onMouseMove);

      const tickerFn = () => {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        gsap.set(cursorFollower, { x: followerX, y: followerY });
      };

      gsap.ticker.add(tickerFn);

      const clickables = document.querySelectorAll('a, button');
      const onMouseEnter = () => cursorFollower.classList.add('active');
      const onMouseLeave = () => cursorFollower.classList.remove('active');

      clickables.forEach(el => {
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });

      return () => {
        window.removeEventListener('mousemove', onMouseMove);
        gsap.ticker.remove(tickerFn);
        clickables.forEach(el => {
          el.removeEventListener('mouseenter', onMouseEnter);
          el.removeEventListener('mouseleave', onMouseLeave);
        });
      };
    }
  }, []);

  useEffect(() => {
    // 3D Tilt Pricing Cards
    const pricingCards = document.querySelectorAll('.pricing-card');

    const handleMouseMove = (e, card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;
      
      gsap.to(card, {
        transform: `perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
        duration: 0.6,
        ease: "power3.out"
      });
    };

    const handleMouseLeave = (card) => {
      gsap.to(card, {
        transform: `perspective(1500px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        duration: 0.6,
        ease: "power3.out"
      });
    };

    const listeners = [];

    pricingCards.forEach(card => {
      const moveHandler = (e) => handleMouseMove(e, card);
      const leaveHandler = () => handleMouseLeave(card);
      card.addEventListener('mousemove', moveHandler);
      card.addEventListener('mouseleave', leaveHandler);
      listeners.push({ card, moveHandler, leaveHandler });
    });

    return () => {
      listeners.forEach(({ card, moveHandler, leaveHandler }) => {
        card.removeEventListener('mousemove', moveHandler);
        card.removeEventListener('mouseleave', leaveHandler);
      });
    };
  }, []);

  const handleBillingToggle = () => {
    const newIsYearly = !isYearly;
    const priceVals = document.querySelectorAll('.price-val[data-monthly]');
    
    priceVals.forEach(val => {
      gsap.to(val, {
        opacity: 0, y: -10, duration: 0.15, onComplete: () => {
          val.textContent = newIsYearly ? val.dataset.yearly : val.dataset.monthly;
          gsap.fromTo(val, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.15 });
        }
      });
    });
    
    setIsYearly(newIsYearly);
  };

  return (
    <>
      {/* Atmospheric Backgrounds */}
      <div className="ambient-glow"></div>
      <div className="grid-bg"></div>
      <div className="grid-laser"></div>
      <div className="grid-laser-2"></div>
      <div className="glow-orb orb-left"></div>
      <div className="glow-orb orb-right"></div>
      
      {/* Custom Cursor */}
      <div className="custom-cursor" id="custom-cursor" ref={cursorRef}></div>
      <div className="custom-cursor-follower" id="custom-cursor-follower" ref={cursorFollowerRef}></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo"><a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>AURA</a></div>
        <div className="nav-links">
          <a href="/#how-it-works">How it works</a>
          <a href="/#features">Features</a>
          <a href="/pricing">Pricing</a>
          <a href="/dashboard" className="login-btn">Log in</a>
        </div>
        <div className="nav-actions">
          <button className="cta-button desktop-cta">Start Free Trial</button>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"></path></svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="logo">AURA</div>
          <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="mobile-nav-links">
          <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)}>How it works</a>
          <a href="/#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <a href="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
          <a href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Log in</a>
          <button className="cta-button primary" style={{ marginTop: '2rem' }}>Start Free Trial</button>
        </div>
      </div>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section reveal-element" style={{ paddingTop: '8rem' }}>
        <div className="pricing-header">
          <h2 className="section-title">Simple, transparent pricing.</h2>
          <p className="section-text">Start for free. Upgrade when you need production-ready renders.</p>
          
          <div className="billing-toggle-wrapper">
            <span className={`toggle-label ${!isYearly ? 'active' : ''}`}>Monthly</span>
            <button className={`billing-toggle ${isYearly ? 'toggled' : ''}`} onClick={handleBillingToggle}>
              <div className="toggle-knob"></div>
            </button>
            <span className={`toggle-label ${isYearly ? 'active' : ''}`}>Yearly <span className="discount-badge">Save 20%</span></span>
          </div>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3 className="tier-name">Sketcher</h3>
            <div className="tier-price"><span className="currency">$</span><span className="price-val">0</span><span className="period">/mo</span></div>
            <p className="tier-desc">Perfect for hobbyists and trying out the engine.</p>
            <ul className="tier-features">
              <li>5 renders per month</li>
              <li>720p export quality</li>
              <li>Basic modern style</li>
              <li>Community support</li>
            </ul>
            <button className="cta-button">Start for free</button>
          </div>

          <div className="pricing-card highlighted">
            <div className="highlight-bar"></div>
            <h3 className="tier-name">Architect</h3>
            <div className="tier-price"><span className="currency">$</span><span className="price-val" data-monthly="29" data-yearly="24">29</span><span className="period">/mo</span></div>
            <p className="tier-desc">For professionals who need pitch-perfect visuals.</p>
            <ul className="tier-features">
              <li>Unlimited renders</li>
              <li>4K export quality</li>
              <li>All architectural styles</li>
              <li>Commercial license</li>
              <li>Priority generation queue</li>
            </ul>
            <button className="cta-button primary">Upgrade to Architect</button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="logo">AURA</div>
        <p>&copy; 2026 Aura AI Architecture.</p>
      </footer>
    </>
  );
};

export default Pricing;
