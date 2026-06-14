import React, { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import '../style.css'; // Adjust path as needed
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Hero from '../components/Hero.jsx';
import AuthModal from '../components/AuthModal.jsx';
import BentoGrid from '../components/BentoGrid.jsx';

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
    // --- JS Logic From main.js ---
    // import './style.css';
// import Lenis from '@studio-freight/lenis';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

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
  } else {
    setPreloaderShown(true);
  }
}

// Smooth scroll initialization
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Initial Hero Animation
const heroTitle = new SplitType('.hero-title', { types: 'words, chars' });
gsap.from(heroTitle.chars, {
  opacity: 0,
  y: 80,
  rotationX: -90,
  transformOrigin: '0% 50% -50',
  stagger: 0.02,
  duration: 1.2,
  ease: 'power4.out',
  delay: 0.2
});

gsap.fromTo('.hero-subtext', 
  { opacity: 0, y: 30 }, 
  { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.8 }
);
gsap.fromTo('.hero-actions', 
  { opacity: 0, y: 30 }, 
  { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1.0 }
);
gsap.to('.hero-image', {
  scale: 1,
  duration: 2,
  ease: 'power2.out',
  delay: 0.5
});

// Typographic Section Titles Animation
const sectionTitles = document.querySelectorAll('.section-title');
sectionTitles.forEach(title => {
  const splitTitle = new SplitType(title, { types: 'words, chars' });
  gsap.from(splitTitle.chars, {
    scrollTrigger: {
      trigger: title,
      start: 'top 85%',
    },
    opacity: 0,
    y: 50,
    rotationX: -90,
    transformOrigin: '0% 50% -50',
    stagger: 0.02,
    duration: 1,
    ease: 'power4.out',
  });
});

// Scroll Reveal Animations
gsap.utils.toArray('.reveal-element').forEach((element) => {
  gsap.to(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
    },
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
  });
});

// Upload functionality
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const previewImage = document.getElementById('preview-image');
const uploadContent = document.getElementById('upload-content');

if (dropZone && fileInput && uploadContent) {
  dropZone.addEventListener('click', (e) => {
    if (uploadContent.style.display !== 'none') {
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
      handleFile(e.target.files[0]);
    }
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  // Canvas Elements
  const canvasWorkspace = document.getElementById('canvas-workspace');
  const imageCanvas = document.getElementById('image-canvas');
  const maskCanvas = document.getElementById('mask-canvas');
  const imgCtx = imageCanvas ? imageCanvas.getContext('2d') : null;
  const maskCtx = maskCanvas ? maskCanvas.getContext('2d') : null;
  
  // Toolbar Elements
  const btnBrush = document.getElementById('btn-brush');
  const btnEraser = document.getElementById('btn-eraser');
  const btnClearMask = document.getElementById('btn-clear-mask');
  const brushSizeInput = document.getElementById('brush-size');
  const brushCursorRing = document.getElementById('brush-cursor');
  const btnGenerate = document.getElementById('btn-generate-ai');
  const promptInput = document.getElementById('prompt-input');

  let currentFile = null;
  let uploadedImageSrc = null;
  let activeCropper = null;

  async function handleFile(file) {
    if (file && file.type.startsWith('image/')) {
      currentFile = file;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        uploadedImageSrc = e.target.result;
        
        // 1. Enter Pro Workspace via GSAP
        const appWrapper = document.querySelector('.feature-section').parentElement; // Approx wrapper
        const proWorkspaceOverlay = document.querySelector('#pro-workspace-overlay');
        
        gsap.set(document.body, { overflow: 'hidden' });
        
        const tl = gsap.timeline({ defaults: { ease: "power4.inOut", duration: 1.2 } });
        tl.to('main, footer, nav', {
          scale: 0.95, opacity: 0, filter: "blur(10px)", z: -500, transformOrigin: "center top"
        }, 0)
        .to(proWorkspaceOverlay, {
          display: 'flex', y: '0%', scale: 1, opacity: 1, transformOrigin: "center center"
        }, 0.1);

        // 2. Load Image into Canvas
        const proImageCanvas = document.getElementById('pro-image-canvas');
        const proCtx = proImageCanvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          proImageCanvas.width = img.width;
          proImageCanvas.height = img.height;
          proCtx.drawImage(img, 0, 0);
          
          // Initialize Cropper
          setTimeout(() => {
            if (activeCropper) activeCropper.overlayCanvas.remove();
            activeCropper = new AuraCropper('pro-image-canvas');
          }, 1200); // Wait for transition
        };
        img.src = uploadedImageSrc;
      };
      reader.readAsDataURL(file);
    }
  }

  // Bind Pro Workspace Buttons
  const btnClosePro = document.getElementById('pro-workspace-close');
  const btnGeneratePro = document.getElementById('pro-workspace-generate');
  const proWorkspaceOverlay = document.querySelector('#pro-workspace-overlay');

  if (btnClosePro) {
    btnClosePro.addEventListener('click', () => {
      gsap.to(proWorkspaceOverlay, { y: '100%', opacity: 0, duration: 0.8, ease: "power3.in", onComplete: () => proWorkspaceOverlay.style.display = 'none' });
      gsap.to('main, footer, nav', { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" });
      gsap.set(document.body, { overflow: 'auto' });
      if (activeCropper) { activeCropper.overlayCanvas.remove(); activeCropper = null; }
    });
  }

  if (btnGeneratePro) {
    btnGeneratePro.addEventListener('click', async () => {
      // Mock generate: Close workspace, scroll to results
      btnClosePro.click();
      
      const loadingState = document.getElementById('loading-state');
      if(loadingState) {
        loadingState.style.display = 'flex';
        startLoadingTooltips();
      }

      // Normally we'd extract the cropped image here using activeCropper.getCropData()
      
      setTimeout(() => { 
        stopLoadingTooltips();
        if(loadingState) loadingState.style.display = 'none'; 
        
        const uploadSection = document.getElementById('upload');
        const resultSection = document.getElementById('result-section');
        if(uploadSection && resultSection) {
          uploadSection.style.display = 'none';
          resultSection.style.display = 'block';
          document.getElementById('slider-before').src = uploadedImageSrc;
          resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 2000);
    });
  }
}

// Before/After Slider Logic
const sliderContainer = document.getElementById('slider-container');
const sliderHandle = document.getElementById('slider-handle');
const sliderAfter = document.getElementById('slider-after');

if (sliderContainer && sliderHandle && sliderAfter) {
  let isDragging = false;

  sliderContainer.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  sliderContainer.addEventListener('touchstart', () => isDragging = true);
  window.addEventListener('touchend', () => isDragging = false);
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    updateSlider(e.touches[0].clientX);
  });

  function updateSlider(clientX) {
    const rect = sliderContainer.getBoundingClientRect();
    let x = clientX - rect.left;
    x = Math.max(0, Math.min(x, rect.width));
    const percent = (x / rect.width) * 100;
    
    sliderHandle.style.left = `${percent}%`;
    sliderAfter.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
  }
}

// Style Selector Logic
const track = document.getElementById('styleSelectorTrack');
if (track) {
  const pills = track.querySelectorAll('.style-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      pills.forEach(p => p.classList.remove('active'));
      const clickedPill = e.currentTarget;
      clickedPill.classList.add('active');
      const pillRect = clickedPill.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      const scrollLeft = clickedPill.offsetLeft - (trackRect.width / 2) + (pillRect.width / 2);
      track.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    });
  });
}

// Rotating Loading Tooltips
let tooltipTimeline = null;
function startLoadingTooltips() {
  const tooltips = gsap.utils.toArray('.loading-tooltip');
  if (!tooltips.length) return;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    gsap.set(tooltips[0], { opacity: 1, y: 0 });
    return;
  }
  gsap.set(tooltips, { y: 16, opacity: 0 });
  tooltipTimeline = gsap.timeline({ repeat: -1 });
  tooltips.forEach((tooltip) => {
    tooltipTimeline.to(tooltip, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
      .to(tooltip, { y: -16, opacity: 0, duration: 0.6, ease: 'power3.in', delay: 1.5 });
  });
}
function stopLoadingTooltips() {
  if (tooltipTimeline) tooltipTimeline.kill();
}

// Billing Toggle Logic
const billingToggle = document.getElementById('billing-toggle');
const labelMonthly = document.getElementById('label-monthly');
const labelYearly = document.getElementById('label-yearly');
const priceVals = document.querySelectorAll('.price-val[data-monthly]');

if (billingToggle) {
  billingToggle.addEventListener('click', () => {
    billingToggle.classList.toggle('toggled');
    const isYearly = billingToggle.classList.contains('toggled');
    
    if (isYearly) {
      labelYearly.classList.add('active');
      labelMonthly.classList.remove('active');
    } else {
      labelMonthly.classList.add('active');
      labelYearly.classList.remove('active');
    }

    priceVals.forEach(val => {
      gsap.to(val, {
        opacity: 0, y: -10, duration: 0.15, onComplete: () => {
          val.textContent = isYearly ? val.dataset.yearly : val.dataset.monthly;
          gsap.fromTo(val, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.15 });
        }
      });
    });
  });
}

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

  const clickables = document.querySelectorAll('a, button, .style-pill, .aura-card, .slider-container, .upload-container');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => cursorFollower.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorFollower.classList.remove('active'));
  });
}

/**
 * Advanced Image Cropping Tool for Aura AI
 */
class AuraCropper {
  constructor(canvasElement) {
    this.imageCanvas = typeof canvasElement === 'string' 
      ? document.getElementById(canvasElement) 
      : canvasElement;
      
    if (!this.imageCanvas) throw new Error('Canvas element not found');

    this.container = this.imageCanvas.parentElement;
    if (window.getComputedStyle(this.container).position === 'static') {
      this.container.style.position = 'relative';
    }

    this.overlayCanvas = document.createElement('canvas');
    this.overlayCanvas.style.position = 'absolute';
    this.overlayCanvas.style.top = this.imageCanvas.offsetTop + 'px';
    this.overlayCanvas.style.left = this.imageCanvas.offsetLeft + 'px';
    this.overlayCanvas.style.width = this.imageCanvas.clientWidth + 'px';
    this.overlayCanvas.style.height = this.imageCanvas.clientHeight + 'px';
    this.overlayCanvas.style.cursor = 'crosshair';
    this.overlayCanvas.style.zIndex = '10'; 
    this.container.appendChild(this.overlayCanvas);

    this.ctx = this.overlayCanvas.getContext('2d');
    
    this.width = this.imageCanvas.clientWidth;
    this.height = this.imageCanvas.clientHeight;
    this.overlayCanvas.width = this.width;
    this.overlayCanvas.height = this.height;

    const initialSize = Math.min(this.width, this.height) * 0.6;
    this.cropBox = {
      x: (this.width - initialSize) / 2,
      y: (this.height - initialSize) / 2,
      w: initialSize,
      h: initialSize
    };

    this.minSize = 50;
    this.handleSize = 14;
    this.isDragging = false;
    this.dragType = null;
    this.dragStart = { x: 0, y: 0 };
    this.initialCropBox = null;
    this.rafPending = false;

    this.cursors = { tl: 'nwse-resize', tr: 'nesw-resize', bl: 'nesw-resize', br: 'nwse-resize', move: 'move', default: 'crosshair' };

    this.bindEvents();
    this.draw();
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  onWindowResize() {
    this.overlayCanvas.style.top = this.imageCanvas.offsetTop + 'px';
    this.overlayCanvas.style.left = this.imageCanvas.offsetLeft + 'px';
    this.width = this.imageCanvas.clientWidth;
    this.height = this.imageCanvas.clientHeight;
    this.overlayCanvas.width = this.width;
    this.overlayCanvas.height = this.height;
    this.overlayCanvas.style.width = this.width + 'px';
    this.overlayCanvas.style.height = this.height + 'px';
    this.constrainCropBox();
    this.draw();
  }

  bindEvents() {
    this.overlayCanvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  getHandleRects() {
    const { x, y, w, h } = this.cropBox;
    const s = this.handleSize;
    return {
      tl: { x: x - s/2, y: y - s/2, w: s, h: s },
      tr: { x: x + w - s/2, y: y - s/2, w: s, h: s },
      bl: { x: x - s/2, y: y + h - s/2, w: s, h: s },
      br: { x: x + w - s/2, y: y + h - s/2, w: s, h: s }
    };
  }

  getHitType(mouseX, mouseY) {
    const rects = this.getHandleRects();
    for (const [key, rect] of Object.entries(rects)) {
      const padding = 10;
      if (mouseX >= rect.x - padding && mouseX <= rect.x + rect.w + padding &&
          mouseY >= rect.y - padding && mouseY <= rect.y + rect.h + padding) {
        return key;
      }
    }
    const { x, y, w, h } = this.cropBox;
    if (mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h) return 'move';
    return null;
  }

  onMouseDown(e) {
    const rect = this.overlayCanvas.getBoundingClientRect();
    const hit = this.getHitType(e.clientX - rect.left, e.clientY - rect.top);
    if (hit) {
      this.isDragging = true;
      this.dragType = hit;
      this.dragStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      this.initialCropBox = { ...this.cropBox };
    }
  }

  onMouseMove(e) {
    const rect = this.overlayCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (!this.isDragging) {
      const hit = this.getHitType(mouseX, mouseY);
      this.overlayCanvas.style.cursor = hit ? this.cursors[hit] : this.cursors.default;
      return;
    }

    const dx = mouseX - this.dragStart.x;
    const dy = mouseY - this.dragStart.y;
    let newX = this.initialCropBox.x; let newY = this.initialCropBox.y;
    let newW = this.initialCropBox.w; let newH = this.initialCropBox.h;

    if (this.dragType === 'move') { newX += dx; newY += dy; } 
    else {
      if (this.dragType.includes('l')) { newX += dx; newW -= dx; }
      if (this.dragType.includes('r')) { newW += dx; }
      if (this.dragType.includes('t')) { newY += dy; newH -= dy; }
      if (this.dragType.includes('b')) { newH += dy; }
    }

    if (this.dragType !== 'move') {
      if (newW < this.minSize) { newW = this.minSize; newX = this.dragType.includes('l') ? this.initialCropBox.x + this.initialCropBox.w - this.minSize : newX; }
      if (newH < this.minSize) { newH = this.minSize; newY = this.dragType.includes('t') ? this.initialCropBox.y + this.initialCropBox.h - this.minSize : newY; }
    }

    if (newX < 0) { if (this.dragType === 'move') newX = 0; else { newW += newX; newX = 0; } }
    if (newY < 0) { if (this.dragType === 'move') newY = 0; else { newH += newY; newY = 0; } }
    if (newX + newW > this.width) { if (this.dragType === 'move') newX = this.width - newW; else newW = this.width - newX; }
    if (newY + newH > this.height) { if (this.dragType === 'move') newY = this.height - newH; else newH = this.height - newY; }

    this.cropBox = { x: newX, y: newY, w: newW, h: newH };
    if (!this.rafPending) {
      this.rafPending = true;
      requestAnimationFrame(() => { this.draw(); this.rafPending = false; });
    }
  }

  onMouseUp() { this.isDragging = false; this.dragType = null; }
  
  constrainCropBox() {
    if (this.cropBox.x < 0) this.cropBox.x = 0;
    if (this.cropBox.y < 0) this.cropBox.y = 0;
    if (this.cropBox.x + this.cropBox.w > this.width) this.cropBox.x = this.width - this.cropBox.w;
    if (this.cropBox.y + this.cropBox.h > this.height) this.cropBox.y = this.height - this.cropBox.h;
  }

  draw() {
    const ctx = this.ctx; const cw = this.width; const ch = this.height;
    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; ctx.fillRect(0, 0, cw, ch);
    
    const { x, y, w, h } = this.cropBox;
    ctx.clearRect(x, y, w, h);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, w, h);
    
    ctx.beginPath(); ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'; ctx.lineWidth = 1;
    ctx.moveTo(x + w / 3, y); ctx.lineTo(x + w / 3, y + h);
    ctx.moveTo(x + (w * 2) / 3, y); ctx.lineTo(x + (w * 2) / 3, y + h);
    ctx.moveTo(x, y + h / 3); ctx.lineTo(x + w, y + h / 3);
    ctx.moveTo(x, y + (h * 2) / 3); ctx.lineTo(x + w, y + (h * 2) / 3);
    ctx.stroke();
    
    const rects = this.getHandleRects();
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'; ctx.lineWidth = 1.5;
    for (const rect of Object.values(rects)) {
      ctx.beginPath(); ctx.arc(rect.x + rect.w/2, rect.y + rect.h/2, rect.w/2, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    }
  }
}

// ----------------------------------
// Magic Scroll Section Logic
// ----------------------------------
const magicSection = document.querySelector(".magic-scroll-section");
if (magicSection) {
  const magicTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".magic-scroll-section",
      start: "top top",
      end: "bottom bottom", // Ties perfectly to the 300vh CSS height
      scrub: 1 // Smooth scrubbing
    }
  });

  const textSteps = gsap.utils.toArray(".magic-scroll-text-col .magic-step");
  
  if (textSteps.length > 0) {
    const stepDuration = 1 / textSteps.length;
    
    textSteps.forEach((step, i) => {
      const startTime = i * stepDuration;
      
      // Initially hide all but the first (CSS handles first via .is-active, but GSAP takes over)
      if(i !== 0) gsap.set(step, { opacity: 0, y: "10%" });
      
      // Fade In
      if(i !== 0) {
        magicTl.to(step, {
          opacity: 1,
          y: "-50%",
          duration: stepDuration * 0.3,
          ease: "power2.out"
        }, startTime);
      } else {
        // First step is already visible, just ensure it stays for a bit
        gsap.set(step, { opacity: 1, y: "-50%" });
      }

      // Fade Out (unless it's the last step)
      if (i !== textSteps.length - 1) {
        magicTl.to(step, {
          opacity: 0,
          y: "-90%",
          duration: stepDuration * 0.3,
          ease: "power2.in"
        }, startTime + (stepDuration * 0.7));
      }
    });
  }

  // Image Wipe Away (Sketch -> Render)
  // Mask starts fully hiding the render (wiped to the right edge)
  gsap.set(".magic-img-render-mask", { clipPath: "inset(0% 100% 0% 0%)" });
  
  // Animate the clip-path over the entire duration to reveal the render
  magicTl.to(".magic-img-render-mask", {
    clipPath: "inset(0% 0% 0% 0%)", 
    ease: "none",
    duration: 1 
  }, 0);
}




// ----------------------------------
// Magnetic Physics Buttons
// ----------------------------------
const magneticButtons = document.querySelectorAll('.cta-button, .login-btn');

magneticButtons.forEach(btn => {
  // Use quickTo for buttery smooth 60fps tracking
  const xTo = gsap.quickTo(btn, "x", { duration: 0.8, ease: "elastic.out(1, 0.3)" });
  const yTo = gsap.quickTo(btn, "y", { duration: 0.8, ease: "elastic.out(1, 0.3)" });

  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from center, scaled down for subtle magnetic pull
    const distanceX = (e.clientX - centerX) * 0.4;
    const distanceY = (e.clientY - centerY) * 0.4;
    
    xTo(distanceX);
    yTo(distanceY);
  });

  btn.addEventListener('mouseleave', () => {
    // Snap back to origin
    xTo(0);
    yTo(0);
  });
});

// ----------------------------------
// 3D Tilt Pricing Cards
// ----------------------------------
const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
  const tiltTo = gsap.quickTo(card, "transform", { duration: 0.6, ease: "power3.out" });

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation up to 12 degrees
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    tiltTo(`perspective(1500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  });

  card.addEventListener('mouseleave', () => {
    tiltTo(`perspective(1500px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
  });
});

// ----------------------------------
// Interactive Style Chips
// ----------------------------------
const styleChips = document.querySelectorAll('.style-chip');
const styleImgs = document.querySelectorAll('.style-img');

styleChips.forEach(chip => {
  chip.addEventListener('click', () => {
    styleChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');

    const targetStyle = chip.getAttribute('data-style');
    
    styleImgs.forEach(img => img.classList.remove('active'));
    
    const targetImg = document.getElementById(`style-img-${targetStyle}`);
    if(targetImg) targetImg.classList.add('active');
  });
  
  // Make chips magnetic as well!
  const xTo = gsap.quickTo(chip, "x", { duration: 0.6, ease: "elastic.out(1, 0.3)" });
  const yTo = gsap.quickTo(chip, "y", { duration: 0.6, ease: "elastic.out(1, 0.3)" });
  
  chip.addEventListener('mousemove', (e) => {
    const rect = chip.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    xTo((e.clientX - centerX) * 0.3);
    yTo((e.clientY - centerY) * 0.3);
  });
  
  chip.addEventListener('mouseleave', () => {
    xTo(0);
    yTo(0);
  });
});

// ----------------------------------
// Mobile Menu Toggle
// ----------------------------------
const setupMobileMenu = (btnId, closeId, menuId) => {
  const btn = document.getElementById(btnId);
  const closeBtn = document.getElementById(closeId);
  const menu = document.getElementById(menuId);
  
  if(btn && closeBtn && menu) {
    btn.addEventListener('click', () => { menu.classList.add('open'); });
    closeBtn.addEventListener('click', () => { menu.classList.remove('open'); });
    
    // Close on link click
    const links = menu.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => { menu.classList.remove('open'); });
    });
  }
};

setupMobileMenu('mobile-menu-btn', 'mobile-close-btn', 'mobile-menu');
setupMobileMenu('mobile-menu-btn-pricing', 'mobile-close-btn-pricing', 'mobile-menu-pricing');
setupMobileMenu('mobile-dashboard-btn', 'mobile-close-sidebar', document.querySelector('.dashboard-sidebar') ? document.querySelector('.dashboard-sidebar').id = 'dashboard-sidebar' : 'dashboard-sidebar');

// ----------------------------------
// Community Gallery Before/After Sliders (Click & Drag)
// ----------------------------------
let activeGalleryInner = null;

const updateGallerySplit = (inner, clientX) => {
  const rect = inner.getBoundingClientRect();
  const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
  const percent = (x / rect.width) * 100;
  inner.style.setProperty('--split', `${percent}%`);
};

document.querySelectorAll('.aura-card').forEach(card => {
  const inner = card.querySelector('.aura-card-inner');
  if(!inner) return;
  
  card.addEventListener('mousedown', (e) => {
    activeGalleryInner = inner;
    updateGallerySplit(inner, e.clientX);
  });
  
  card.addEventListener('touchstart', (e) => {
    activeGalleryInner = inner;
    updateGallerySplit(inner, e.touches[0].clientX);
  }, { passive: true });
});

window.addEventListener('mousemove', (e) => {
  if(activeGalleryInner) {
    updateGallerySplit(activeGalleryInner, e.clientX);
  }
});

window.addEventListener('mouseup', () => {
  activeGalleryInner = null;
});

window.addEventListener('touchmove', (e) => {
  if(activeGalleryInner) {
    updateGallerySplit(activeGalleryInner, e.touches[0].clientX);
  }
}, { passive: true });

window.addEventListener('touchend', () => {
  activeGalleryInner = null;
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
      
      {/* Inject the rest of the body */}
      
    
    
    

    
    <div className="ambient-glow"></div>
    <div className="grid-bg"></div>
    <div className="grid-laser"></div>
    <div className="grid-laser-2"></div>
    <div className="glow-orb orb-left"></div>
    <div className="glow-orb orb-right"></div>
    
    <div className="custom-cursor" id="custom-cursor"></div>
    <div className="custom-cursor-follower" id="custom-cursor-follower"></div>

    
      <Hero />

    
    <section className="magic-scroll-section" id="how-it-works">
      <div className="magic-scroll-container">
        
        
        <div className="magic-scroll-text-col">
          <div className="magic-step is-active" id="step-1">
            <h3>01. Upload Sketch</h3>
            <p>Start with a simple hand-drawn sketch or basic 3D geometry. Our AI understands the spatial relationships and architectural intent instantly.</p>
          </div>
          <div className="magic-step" id="step-2">
            <h3>02. Define Style</h3>
            <p>Select from our curated premium styles or describe your vision using natural language. The possibilities are endless, but the quality is always pristine.</p>
          </div>
          <div className="magic-step" id="step-3">
            <h3>03. Render Magic</h3>
            <p>Watch as your raw concept transforms into a photorealistic architectural masterpiece in seconds. Ready to impress clients and win pitches.</p>
          </div>
        </div>

        
        <div className="magic-scroll-image-col">
          <div className="magic-image-wrapper">
            
            <img src="/magic-sketch.png" alt="Architectural Sketch" className="magic-img-sketch"  loading="lazy" />
            
            
            <div className="magic-img-render-mask" style={{clipPath: `inset(0% 100% 0% 0%)`}}>
              <img src="/magic-render.png" alt="Photorealistic Render" className="magic-img-render"  loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>

    
    <section className="style-preview-section reveal-element">
      <div className="style-header">
        <h2 className="section-title ">One sketch. Infinite possibilities.</h2>
        <p className="section-text">Select an architectural style below to instantly restyle the space.</p>
      </div>
      
      <div className="style-preview-container">
        
        <div className="style-viewport">
          <img id="style-img-modern" src="/modern_living.png" className="style-img active" alt="Modern Minimalist"  loading="lazy" />
          <img id="style-img-industrial" src="/industrial_living.png" className="style-img" alt="Industrial Loft"  loading="lazy" />
          <img id="style-img-japandi" src="/japandi_living.png" className="style-img" alt="Japandi"  loading="lazy" />
          <img id="style-img-biophilic" src="/biophilic_living.png" className="style-img" alt="Biophilic Architecture"  loading="lazy" />
        </div>
        
        
        <div className="style-chips-wrapper">
          <button className="style-chip active" data-style={{}}>Modern Minimalist</button>
          <button className="style-chip" data-style={{}}>Industrial Loft</button>
          <button className="style-chip" data-style={{}}>Japandi</button>
          <button className="style-chip" data-style={{}}>Biophilic Architecture</button>
        </div>
      </div>
    </section>
    
    <section className="aura-gallery-section">
      <div className="aura-gallery-header">
        <h2 className="aura-headline">Community Renders</h2>
        <p className="aura-subtext">Drag the sliders on any card to reveal the original architectural sketch. A collection of spatial redesigns by the Aura community.</p>
      </div>
    
      <div className="aura-masonry-grid">
        <div className="aura-card size-featured">
          <div className="aura-card-inner">
            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="After: Minimalist Living Room" className="img-after"  loading="lazy" />
            <img src="https://images.unsplash.com/photo-1583847268964-b28ce8fba18e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" alt="Before: Cluttered Room" className="img-before"  loading="lazy" />
            <div className="gallery-slider-handle"></div>
            <div className="aura-card-overlay">
              <span className="aura-badge">Featured</span>
              <h3>Linear Calm</h3>
              <p>By @alex_design</p>
            </div>
          </div>
        </div>
        <div className="aura-card size-tall">
          <div className="aura-card-inner">
            <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="After: Modern Kitchen" className="img-after"  loading="lazy" />
            <img src="https://images.unsplash.com/photo-1556910103-1c02745a828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Before: Old Kitchen" className="img-before"  loading="lazy" />
            <div className="gallery-slider-handle"></div>
            <div className="aura-card-overlay">
              <h3>Onyx Kitchen</h3>
              <p>By @studio_k</p>
            </div>
          </div>
        </div>
        <div className="aura-card size-standard">
          <div className="aura-card-inner">
            <img src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="After: Sunny Bedroom" className="img-after"  loading="lazy" />
            <img src="https://images.unsplash.com/photo-1522771731470-bea437360f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Before: Dark Bedroom" className="img-before"  loading="lazy" />
            <div className="gallery-slider-handle"></div>
            <div className="aura-card-overlay">
              <h3>Morning Light</h3>
              <p>By @jane_doe</p>
            </div>
          </div>
        </div>
        <div className="aura-card size-standard">
          <div className="aura-card-inner">
            <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="After: Brutalist Bathroom" className="img-after"  loading="lazy" />
            <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Before: Standard Bathroom" className="img-before"  loading="lazy" />
            <div className="aura-card-overlay">
              <h3>Brutalist Wash</h3>
              <p>By @raw_form</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    
    <section id="features" className="feature-section">
      <div className="feature-text reveal-element">
        <h2 className="section-title">Flawless Lighting. Premium Textures.</h2>
        <p className="section-text">Aura's engine understands architectural materials. From polished concrete to dark oak, every surface is rendered with absolute physical accuracy.</p>
      </div>
      <div className="feature-image-wrapper reveal-element">
        <img src="/demo.png" alt="Sketch to Render Comparison" className="feature-image"  loading="lazy" />
      </div>
    </section>

    
    <section className="upload-section reveal-element" id="upload" style={{marginTop: `8rem`, minHeight: `80vh`}}>
      <div className="style-selector-container">
        <div className="style-selector-track" id="styleSelectorTrack">
          <button className="style-pill active" data-style={{}}>Modern Minimalist</button>
          <button className="style-pill" data-style={{}}>Industrial</button>
          <button className="style-pill" data-style={{}}>Japandi</button>
          <button className="style-pill" data-style={{}}>Brutalist</button>
          <button className="style-pill" data-style={{}}>Mid-Century</button>
        </div>
      </div>
      <br />
      <div className="upload-container" id="drop-zone">
        <div className="upload-content" id="upload-content">
          <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          <h2 className="upload-title">Drag & Drop your sketch here</h2>
          <p className="upload-subtitle">or click to browse from your device</p>
          <input type="file" id="file-input" accept="image/*" style={{display: `none`}} />
        </div>
        <div id="loading-state" style={{display: `none`, position: `absolute`, inset: `0`, alignItems: `center`, justifyContent: `center`, background: `rgba(9,9,11,0.9)`, zIndex: `20`}}>
          <div style={{display: `flex`, gap: `1rem`, alignItems: `center`, padding: `1rem`, background: `#09090b`, border: `1px solid #27272a`, borderRadius: `12px`, minWidth: `250px`}}>
            <div style={{width: `2rem`, height: `2rem`, background: `#27272a`, borderRadius: `6px`, animation: `pulse 2s infinite`}}></div>
            <div style={{position: `relative`, height: `1.5rem`, flex: `1`, overflow: `hidden`, pointerEvents: `none`}}>
              <span className="loading-tooltip" style={{position: `absolute`, inset: `0`, color: `#d4d4d8`, opacity: `0`, fontFamily: `'Space Grotesk', sans-serif`}}>Analyzing geometry...</span>
              <span className="loading-tooltip" style={{position: `absolute`, inset: `0`, color: `#d4d4d8`, opacity: `0`, fontFamily: `'Space Grotesk', sans-serif`}}>Calculating lighting...</span>
              <span className="loading-tooltip" style={{position: `absolute`, inset: `0`, color: `#d4d4d8`, opacity: `0`, fontFamily: `'Space Grotesk', sans-serif`}}>Baking textures...</span>
              <span className="loading-tooltip" style={{position: `absolute`, inset: `0`, color: `#d4d4d8`, opacity: `0`, fontFamily: `'Space Grotesk', sans-serif`}}>Finalizing scene...</span>
            </div>
          </div>
        </div>

        
        <div id="canvas-workspace" style={{display: `none`}} className="canvas-workspace">
          <div className="canvas-layer-container">
            <canvas id="image-canvas"></canvas>
            <canvas id="mask-canvas"></canvas>
          </div>
          
          <div className="inpainting-toolbar">
            <div className="toolbar-group">
              <button id="btn-brush" className="toolbar-btn active" title="Brush">🖌️</button>
              <button id="btn-eraser" className="toolbar-btn" title="Eraser">🧹</button>
            </div>
            <div className="toolbar-group brush-size-group">
              <span style={{fontSize: `0.75rem`, color: `var(--text-secondary)`}}>Size</span>
              <input type="range" id="brush-size" min="5" max="150" value="40" className="brush-slider" />
            </div>
            <div className="toolbar-group">
              <button id="btn-clear-mask" className="toolbar-btn" title="Clear Mask">🗑️</button>
            </div>
            <div className="toolbar-group generate-group">
              <input type="text" id="prompt-input" className="prompt-input" placeholder="Paint an area, then describe changes..." />
              <button id="btn-generate-ai" className="cta-button primary toolbar-generate">Generate</button>
            </div>
          </div>
        </div>
      </div>
      
      
      <div id="brush-cursor" className="brush-cursor"></div>
    </section>

    
    <section className="result-section" id="result-section" style={{display: `none`}}>
      <h2 className="section-title" style={{textAlign: `center`, marginBottom: `2rem`}}>Your Vision, Realized.</h2>
      
      <div className="slider-container" id="slider-container">
        
        <img id="slider-before" src="" alt="Before Sketch" className="slider-img"  loading="lazy" />
        
        
        <img id="slider-after" src="/hero.png" alt="After Render" className="slider-img slider-after"  loading="lazy" />
        
        
        <div className="slider-handle" id="slider-handle">
          <div className="slider-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </div>
        </div>
      </div>
      
      <div className="result-actions">
        <button className="cta-button secondary">Download HD Render</button>
        <button className="cta-button primary">Share Link</button>
      </div>
    </section>

    
    <div id="pro-workspace-overlay" style={{display: `none`}}>
      <nav className="pro-workspace-nav">
        <button className="btn-close" id="pro-workspace-close">Close</button>
        <div className="nav-brand">AURA PRO</div>
        <button className="btn-generate cta-button primary" id="pro-workspace-generate">Generate</button>
      </nav>
      
      <div className="pro-workspace-body">
        <main id="pro-canvas-container">
          <canvas id="pro-image-canvas"></canvas>
        </main>
        
        <aside className="pro-workspace-sidebar">
          <h2>Pro Controls</h2>
          
          <div className="control-group">
            <label htmlFor="ai-creativity">AI Creativity (Control Scale)</label>
            <input type="range" id="ai-creativity" min="0" max="100" value="50" />
          </div>
          
          <div className="control-group">
            <label htmlFor="lighting">Lighting Override</label>
            <select id="lighting">
              <option value="none">Auto (from sketch)</option>
              <option value="studio">Studio</option>
              <option value="cinematic">Cinematic</option>
              <option value="natural">Natural Sunlight</option>
              <option value="neon">Neon Cyberpunk</option>
            </select>
          </div>

          <div className="control-group">
            <label>Output Resolution</label>
            <div className="resolution-options">
              <label className="res-radio">
                <input type="radio" name="resolution" value="4k" checked /> 4K
              </label>
              <label className="res-radio">
                <input type="radio" name="resolution" value="8k" /> 8K
              </label>
            </div>
          </div>
        </aside>
      </div>
    </div>
    
    <BentoGrid />

    
    <section className="marquee-section reveal-element">
      <div className="marquee-header">
        <h2 className="section-title" style={{fontSize: `2.5rem`}}>Trusted by Top Studios.</h2>
      </div>
      <div className="marquee-container">
        <div className="marquee-track">
          
          <div className="marquee-card">
            <p>"Aura cut our conceptual design phase from 3 weeks to 3 days. It's fundamentally changed how we pitch."</p>
            <div className="marquee-author">
              <img className="author-avatar" src="/avatar_sarah.png" alt="Sarah Jenkins" style={{objectFit: `cover`}} loading="lazy" />
              <div className="author-info"><strong>Sarah Jenkins</strong><span>Lead Architect, Studio J</span></div>
            </div>
          </div>
          <div className="marquee-card">
            <p>"The material accuracy is insane. Clients think we spent $5,000 on V-Ray renders when it was a quick sketch."</p>
            <div className="marquee-author">
              <img className="author-avatar" src="/avatar_marcus.png" alt="Marcus Chen" style={{objectFit: `cover`}} loading="lazy" />
              <div className="author-info"><strong>Marcus Chen</strong><span>Interior Designer</span></div>
            </div>
          </div>
          <div className="marquee-card">
            <p>"We use Aura to generate 10 variations of a living room before the client even finishes their coffee."</p>
            <div className="marquee-author">
              <img className="author-avatar" src="/avatar_elena.png" alt="Elena Rossi" style={{objectFit: `cover`}} loading="lazy" />
              <div className="author-info"><strong>Elena Rossi</strong><span>Founder, Rossi Real Estate</span></div>
            </div>
          </div>
          <div className="marquee-card">
            <p>"Nothing else comes close. The lighting engine perfectly understands natural light falloff."</p>
            <div className="marquee-author">
              <img className="author-avatar" src="/avatar_david.png" alt="David Kim" style={{objectFit: `cover`}} loading="lazy" />
              <div className="author-info"><strong>David Kim</strong><span>3D Visualization Artist</span></div>
            </div>
          </div>
          
          
          <div className="marquee-card">
            <p>"Aura cut our conceptual design phase from 3 weeks to 3 days. It's fundamentally changed how we pitch."</p>
            <div className="marquee-author">
              <img className="author-avatar" src="/avatar_sarah.png" alt="Sarah Jenkins" style={{objectFit: `cover`}} loading="lazy" />
              <div className="author-info"><strong>Sarah Jenkins</strong><span>Lead Architect, Studio J</span></div>
            </div>
          </div>
          <div className="marquee-card">
            <p>"The material accuracy is insane. Clients think we spent $5,000 on V-Ray renders when it was a quick sketch."</p>
            <div className="marquee-author">
              <img className="author-avatar" src="/avatar_marcus.png" alt="Marcus Chen" style={{objectFit: `cover`}} loading="lazy" />
              <div className="author-info"><strong>Marcus Chen</strong><span>Interior Designer</span></div>
            </div>
          </div>
          <div className="marquee-card">
            <p>"We use Aura to generate 10 variations of a living room before the client even finishes their coffee."</p>
            <div className="marquee-author">
              <img className="author-avatar" src="/avatar_elena.png" alt="Elena Rossi" style={{objectFit: `cover`}} loading="lazy" />
              <div className="author-info"><strong>Elena Rossi</strong><span>Founder, Rossi Real Estate</span></div>
            </div>
          </div>
          <div className="marquee-card">
            <p>"Nothing else comes close. The lighting engine perfectly understands natural light falloff."</p>
            <div className="marquee-author">
              <img className="author-avatar" src="/avatar_david.png" alt="David Kim" style={{objectFit: `cover`}} loading="lazy" />
              <div className="author-info"><strong>David Kim</strong><span>3D Visualization Artist</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

      <Footer />

    
      <AuthModal />

    
    </div>
    </>
  );
}
