import React, { useEffect } from 'react';

function AuthModal() {
  useEffect(() => {
    const authOverlay = document.getElementById('auth-overlay');
    const authClose = document.getElementById('auth-close');
    const authTriggerButtons = document.querySelectorAll('.cta-button');

    if (authOverlay && authClose) {
      const openModal = (e) => {
        e.preventDefault();
        authOverlay.style.display = 'flex';
        setTimeout(() => authOverlay.classList.add('visible'), 10);
      };
      const closeModal = () => {
        authOverlay.classList.remove('visible');
        setTimeout(() => authOverlay.style.display = 'none', 400);
      };

      authTriggerButtons.forEach(btn => {
        if (btn.textContent.includes('Start') || btn.textContent.includes('Upgrade') || btn.textContent.includes('Sign')) {
          btn.addEventListener('click', openModal);
        }
      });

      authClose.addEventListener('click', closeModal);
      
      return () => {
        authTriggerButtons.forEach(btn => {
          if (btn.textContent.includes('Start') || btn.textContent.includes('Upgrade') || btn.textContent.includes('Sign')) {
            btn.removeEventListener('click', openModal);
          }
        });
        authClose.removeEventListener('click', closeModal);
      };
    }
  }, []);

  return (
    <div className="auth-overlay" id="auth-overlay" style={{display: `none`}}>
      <div className="auth-modal">
        <button className="auth-close" id="auth-close">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <h2 className="auth-title">Welcome to Aura.</h2>
        <p className="auth-subtitle">Sign in to start creating architectural renders.</p>
        <div className="auth-providers">
          <button className="auth-provider-btn">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-11H6v2h5v5h2v-5h5v-2h-5V6h-2v5z" fill="currentColor" stroke="none"/></svg>
            Continue with Google
          </button>
        </div>
        <div className="auth-divider"><span>or continue with email</span></div>
        <form className="auth-form" id="auth-form" onSubmit={(e) => { e.preventDefault(); window.location.href='/app'; }}>
          <input type="email" placeholder="name@domain.com" className="auth-input" required />
          <button type="submit" className="cta-button primary auth-submit">Send Magic Link</button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
