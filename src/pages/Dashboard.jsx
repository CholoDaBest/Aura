import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const cursorRef = useRef(null);
  const cursorFollowerRef = useRef(null);
  const sidebarRef = useRef(null);
  const mobileBtnRef = useRef(null);

  useEffect(() => {
    // Add dashboard-body class to body
    document.body.classList.add('dashboard-body');

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

      const clickables = document.querySelectorAll('a, button, .project-card');
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
        document.body.classList.remove('dashboard-body');
      };
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        window.innerWidth <= 1024 &&
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        mobileBtnRef.current &&
        !mobileBtnRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    };
    
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [sidebarOpen]);

  return (
    <>
      {/* Custom Cursor */}
      <div className="custom-cursor" id="custom-cursor" ref={cursorRef}></div>
      <div className="custom-cursor-follower" id="custom-cursor-follower" ref={cursorFollowerRef}></div>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`} ref={sidebarRef}>
          <div className="sidebar-header">
            <a href="/" className="logo">Aura.</a>
            <button className="mobile-close-sidebar" onClick={() => setSidebarOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
            </button>
          </div>
          <nav className="sidebar-nav">
            <a href="#" className="nav-item active">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              Projects
            </a>
            <a href="#" className="nav-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              Settings
            </a>
            <a href="#" className="nav-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              Billing
            </a>
          </nav>
          
          <div className="sidebar-footer">
            <div className="credits-widget">
              <div className="credits-header">
                <span>Pro Plan</span>
                <span>482 / 500</span>
              </div>
              <div className="credits-bar">
                <div className="credits-fill" style={{ width: '96%' }}></div>
              </div>
              <p className="credits-subtext">18 credits remaining</p>
            </div>
            <div className="user-profile">
              <div className="avatar">AD</div>
              <div className="user-info">
                <span className="user-name">Alex Designer</span>
                <span className="user-email">alex@studio.com</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <header className="dashboard-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button className="mobile-dashboard-btn" ref={mobileBtnRef} onClick={() => setSidebarOpen(true)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"></path></svg>
              </button>
              <h1>My Projects</h1>
            </div>
            <a href="/" className="cta-button primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              <span className="desktop-text">New Render</span>
              <span className="mobile-text" style={{ display: 'none' }}>New</span>
            </a>
          </header>

          <div className="projects-grid">
            {/* Project 1 */}
            <div className="project-card">
              <div className="project-image">
                <img src="/magic-render.png" alt="Modern Villa" />
                <div className="project-overlay">
                  <button className="icon-btn" title="Download HD"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></button>
                  <button className="icon-btn" title="Share"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></button>
                </div>
              </div>
              <div className="project-info">
                <h3>Modern Villa Living Room</h3>
                <p>Rendered 2 hours ago • Industrial Style</p>
              </div>
            </div>
            {/* Project 2 */}
            <div className="project-card">
              <div className="project-image">
                <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Kitchen" />
                <div className="project-overlay">
                  <button className="icon-btn" title="Download HD"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></button>
                  <button className="icon-btn" title="Share"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></button>
                </div>
              </div>
              <div className="project-info">
                <h3>Onyx Kitchen Remodel</h3>
                <p>Rendered yesterday • Modern Style</p>
              </div>
            </div>
            {/* Project 3 */}
            <div className="project-card">
              <div className="project-image">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Bathroom" />
                <div className="project-overlay">
                  <button className="icon-btn" title="Download HD"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg></button>
                  <button className="icon-btn" title="Share"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></button>
                </div>
              </div>
              <div className="project-info">
                <h3>Brutalist Wash</h3>
                <p>Rendered 3 days ago • Minimalist Style</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
