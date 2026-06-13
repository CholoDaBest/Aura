import './style.css';
import gsap from 'gsap';

// Custom Cursor Logic
const cursor = document.getElementById('custom-cursor');
const cursorFollower = document.getElementById('custom-cursor-follower');
if (cursor && cursorFollower) {
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    gsap.set(cursor, { x: mouseX, y: mouseY });
  });

  gsap.ticker.add(() => {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    gsap.set(cursorFollower, { x: followerX, y: followerY });
  });

  const clickables = document.querySelectorAll('a, button, .project-card');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => cursorFollower.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorFollower.classList.remove('active'));
  });
}

// Mobile Dashboard Menu Logic
const mobileBtn = document.getElementById('mobile-dashboard-btn');
const closeBtn = document.getElementById('mobile-close-sidebar');
const sidebar = document.querySelector('.dashboard-sidebar');

if (mobileBtn && closeBtn && sidebar) {
  mobileBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
  });
  closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
  });
  
  // Close when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && !mobileBtn.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}
