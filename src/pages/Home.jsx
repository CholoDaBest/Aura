import React, { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import '../style.css'; // Adjust path as needed
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Hero from '../components/Hero.jsx';
import AuthModal from '../components/AuthModal.jsx';
import BentoGrid from '../components/BentoGrid.jsx';
import Testimonials from '../components/Testimonials.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import StylePreview from '../components/StylePreview.jsx';
import Features from '../components/Features.jsx';
import UploadSection from '../components/UploadSection.jsx';
import ProWorkspace from '../components/ProWorkspace.jsx';
import Gallery from '../components/Gallery.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [preloaderShown, setPreloaderShown] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("auraPreloaderShown")) {
      setPreloaderShown(true);
    } else {
      sessionStorage.setItem("auraPreloaderShown", "true");
    }
  }, []);

  useEffect(() => {
    // ----------------------------------
    // Cinematic Preloader
    // ----------------------------------
    const preloader = document.getElementById("preloader");
    if (preloader) {
      if (!sessionStorage.getItem("auraPreloaderShown")) {
        sessionStorage.setItem("auraPreloaderShown", "true");
        document.body.style.overflow = "hidden"; // Lock scroll
        
        const preloadTl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = ""; // Unlock scroll
            setPreloaderShown(true); // Let React remove it
          }
        });

        preloadTl.to(".preloader-logo", { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
                 .to(".preloader-progress-bar", { opacity: 1, duration: 0.5 }, "-=0.5")
                 .to(".preloader-progress", { width: "100%", duration: 1.5, ease: "power2.inOut" })
                 .to(".preloader-logo", { color: "#10b981", textShadow: "0 0 20px rgba(16,185,129,0.5)", duration: 0.5 }, "-=0.2")
                 .to(".preloader-progress-bar", { opacity: 0, duration: 0.3 }, "-=0.5")
                 .to(".preloader", { y: "-100%", duration: 1.2, ease: "expo.inOut" }, "+=0.3");
      }
    }

    // ----------------------------------
    // Smooth Scrolling (Lenis)
    // ----------------------------------
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ----------------------------------
    // Reveal Animations on Scroll
    // ----------------------------------
    const revealElements = gsap.utils.toArray('.reveal-element');
    revealElements.forEach(el => {
      gsap.fromTo(el, 
        { opacity: 0, y: 40 },
        {
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // ----------------------------------
    // Custom Cursor Follower
    // ----------------------------------
    const cursorFollower = document.getElementById('cursor-follower');
    if (cursorFollower) {
      let mouseX = 0, mouseY = 0;
      let followerX = 0, followerY = 0;

      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if(e.target.closest('a, button, .style-pill, .aura-card, .slider-container, .upload-container')) {
          cursorFollower.classList.add('active');
        } else {
          cursorFollower.classList.remove('active');
        }
      });

      gsap.ticker.add(() => {
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        gsap.set(cursorFollower, { x: followerX, y: followerY });
      });
    }

    // ----------------------------------
    // Magnetic Physics Buttons
    // ----------------------------------
    const magneticButtons = document.querySelectorAll('.cta-button, .login-btn');
    
    magneticButtons.forEach(btn => {
      const xTo = gsap.quickTo(btn, "x", { duration: 0.8, ease: "elastic.out(1, 0.3)" });
      const yTo = gsap.quickTo(btn, "y", { duration: 0.8, ease: "elastic.out(1, 0.3)" });

      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = (e.clientX - centerX) * 0.4;
        const distanceY = (e.clientY - centerY) * 0.4;
        
        xTo(distanceX);
        yTo(distanceY);
      });

      btn.addEventListener('mouseleave', () => {
        xTo(0);
        yTo(0);
      });
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      if (typeof lenis !== 'undefined') lenis.destroy();
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="home-container">
        {!preloaderShown && (
          <div id="preloader" className="preloader">
            <div className="preloader-logo">Aura.</div>
            <div className="preloader-progress-bar">
              <div className="preloader-progress"></div>
            </div>
          </div>
        )}
        <div id="cursor-follower" className="cursor-follower"></div>
        
        <Hero />
        <HowItWorks />
        <StylePreview />
        <Gallery />
        <Features />
        <UploadSection />
        <BentoGrid />
        <Testimonials />
        
        <Footer />
        <AuthModal />
        <ProWorkspace />
      </div>
    </>
  );
}
