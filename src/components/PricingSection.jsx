import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  useEffect(() => {
    // 3D Tilt Pricing Cards
    const pricingCards = document.querySelectorAll('.pricing-section .pricing-card');

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
    const priceVals = document.querySelectorAll('.pricing-section .price-val[data-monthly]');
    
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
    <section id="pricing" className="pricing-section reveal-element" style={{ paddingTop: '8rem', marginBottom: '8rem' }}>
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
  );
}
