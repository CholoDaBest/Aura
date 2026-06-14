import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  useEffect(() => {
    // Mobile menu logic
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileClose = document.getElementById('mobile-close-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileBtn && mobileMenu && mobileClose) {
      const openMenu = () => mobileMenu.classList.add('active');
      const closeMenu = () => mobileMenu.classList.remove('active');
      
      mobileBtn.addEventListener('click', openMenu);
      mobileClose.addEventListener('click', closeMenu);
      
      return () => {
        mobileBtn.removeEventListener('click', openMenu);
        mobileClose.removeEventListener('click', closeMenu);
      };
    }
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="logo"><Link to="/" style={{color: `inherit`, textDecoration: `none`}}>AURA</Link></div>
        <div className="nav-links">
          <a href="/#how-it-works">How it works</a>
          <a href="/#features">Features</a>
          <Link to="/pricing">Pricing</Link>
          <Link to="/dashboard" className="login-btn">Log in</Link>
        </div>
        <div className="nav-actions">
          <a href="/#upload" className="cta-button desktop-cta" style={{textDecoration: `none`, display: `flex`, alignItems: `center`, justifyContent: `center`}}>Start Free Trial</a>
          <button className="mobile-menu-btn" id="mobile-menu-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"></path></svg>
          </button>
        </div>
      </nav>
      
      <div className="mobile-menu" id="mobile-menu">
        <div className="mobile-menu-header">
          <div className="logo">AURA</div>
          <button className="mobile-close-btn" id="mobile-close-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="mobile-nav-links">
          <a href="/#how-it-works">How it works</a>
          <a href="/#features">Features</a>
          <Link to="/pricing">Pricing</Link>
          <Link to="/dashboard">Log in</Link>
          <button className="cta-button primary" style={{marginTop: `2rem`}}>Start Free Trial</button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
