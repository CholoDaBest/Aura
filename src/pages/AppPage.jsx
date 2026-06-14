import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const AppPage = () => {
  // --- States ---
  const [activeStyle, setActiveStyle] = useState('modern-minimalist');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImageSrc, setUploadedImageSrc] = useState(null);
  const [showProWorkspace, setShowProWorkspace] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [sliderPos, setSliderPos] = useState(50);

  // --- Refs ---
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const proImageCanvasRef = useRef(null);
  const cropperRef = useRef(null);
  const sliderContainerRef = useRef(null);
  const tooltipTimeline = useRef(null);
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  
  // --- Custom Cursor ---
  useEffect(() => {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    const onMouseMove = (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      if (cursorRef.current) gsap.set(cursorRef.current, { x: mouseX, y: mouseY });
    };

    window.addEventListener('mousemove', onMouseMove);

    const ticker = () => {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      if (followerRef.current) gsap.set(followerRef.current, { x: followerX, y: followerY });
    };

    gsap.ticker.add(ticker);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      gsap.ticker.remove(ticker);
    };
  }, []);

  // --- Hover effect for interactive elements ---
  useEffect(() => {
    const handleMouseEnter = () => { if (followerRef.current) followerRef.current.classList.add('active'); };
    const handleMouseLeave = () => { if (followerRef.current) followerRef.current.classList.remove('active'); };

    const clickables = document.querySelectorAll('a, button, .style-pill, .aura-card, .slider-container, .upload-container');
    clickables.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      clickables.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }); // run after every render to attach to new DOM nodes

  // --- Loading Tooltips ---
  const startLoadingTooltips = () => {
    const tooltips = gsap.utils.toArray('.loading-tooltip');
    if (!tooltips.length) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set(tooltips[0], { opacity: 1, y: 0 });
      return;
    }
    gsap.set(tooltips, { y: 16, opacity: 0 });
    tooltipTimeline.current = gsap.timeline({ repeat: -1 });
    tooltips.forEach((tooltip) => {
      tooltipTimeline.current.to(tooltip, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
        .to(tooltip, { y: -16, opacity: 0, duration: 0.6, ease: 'power3.in', delay: 1.5 });
    });
  };

  const stopLoadingTooltips = () => {
    if (tooltipTimeline.current) tooltipTimeline.current.kill();
  };

  // --- Handlers ---
  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImageSrc(e.target.result);
        setShowProWorkspace(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // When pro workspace shows up, init GSAP & Canvas
  useEffect(() => {
    if (showProWorkspace && uploadedImageSrc && proImageCanvasRef.current) {
      gsap.set(document.body, { overflow: 'hidden' });
      const proWorkspaceOverlay = document.getElementById('pro-workspace-overlay');
      
      const tl = gsap.timeline({ defaults: { ease: "power4.inOut", duration: 1.2 } });
      tl.to('main, footer, nav', {
        scale: 0.95, opacity: 0, filter: "blur(10px)", z: -500, transformOrigin: "center top"
      }, 0)
      .fromTo(proWorkspaceOverlay, 
        { display: 'none', y: '100%', opacity: 0 },
        { display: 'flex', y: '0%', scale: 1, opacity: 1, transformOrigin: "center center" }
      , 0.1);

      const proCtx = proImageCanvasRef.current.getContext('2d');
      const img = new Image();
      img.onload = () => {
        proImageCanvasRef.current.width = img.width;
        proImageCanvasRef.current.height = img.height;
        proCtx.drawImage(img, 0, 0);
        
        // Timeout for cropper init to allow GSAP animation to finish
        setTimeout(() => {
          if (cropperRef.current) {
             if(typeof cropperRef.current.destroy === 'function') cropperRef.current.destroy();
             else cropperRef.current.overlayCanvas?.remove();
          }
          cropperRef.current = new AuraCropper(proImageCanvasRef.current);
        }, 1200);
      };
      img.src = uploadedImageSrc;
    }
  }, [showProWorkspace, uploadedImageSrc]);

  const handleCloseProWorkspace = () => {
    const proWorkspaceOverlay = document.getElementById('pro-workspace-overlay');
    gsap.to(proWorkspaceOverlay, { 
      y: '100%', opacity: 0, duration: 0.8, ease: "power3.in", 
      onComplete: () => setShowProWorkspace(false) 
    });
    gsap.to('main, footer, nav', { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" });
    gsap.set(document.body, { overflow: 'auto' });
    if (cropperRef.current) { 
      if(typeof cropperRef.current.destroy === 'function') cropperRef.current.destroy();
      else cropperRef.current.overlayCanvas?.remove();
      cropperRef.current = null; 
    }
  };

  const handleGenerate = () => {
    handleCloseProWorkspace();
    setIsLoading(true);
    setTimeout(() => startLoadingTooltips(), 0);

    setTimeout(() => {
      stopLoadingTooltips();
      setIsLoading(false);
      setShowResult(true);
      setTimeout(() => {
        const resultSection = document.getElementById('result-section');
        if (resultSection) {
          resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 2000);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // --- Slider Logic ---
  useEffect(() => {
    let isDraggingSlider = false;

    const onMouseDown = () => isDraggingSlider = true;
    const onMouseUp = () => isDraggingSlider = false;
    const onMouseMove = (e) => {
      if (!isDraggingSlider || !sliderContainerRef.current) return;
      const rect = sliderContainerRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const percent = (x / rect.width) * 100;
      setSliderPos(percent);
    };

    const onTouchMove = (e) => {
      if (!isDraggingSlider || !sliderContainerRef.current) return;
      const rect = sliderContainerRef.current.getBoundingClientRect();
      let x = e.touches[0].clientX - rect.left;
      x = Math.max(0, Math.min(x, rect.width));
      const percent = (x / rect.width) * 100;
      setSliderPos(percent);
    };

    const container = sliderContainerRef.current;
    if (container) {
      container.addEventListener('mousedown', onMouseDown);
      container.addEventListener('touchstart', onMouseDown);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchend', onMouseUp);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousedown', onMouseDown);
        container.removeEventListener('touchstart', onMouseDown);
      }
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [showResult]);

  return (
    <>
      {/* Backgrounds */}
      <div className="ambient-glow"></div>
      <div className="grid-bg"></div>

      {/* Custom Cursor */}
      <div className="custom-cursor" id="custom-cursor" ref={cursorRef}></div>
      <div className="custom-cursor-follower" id="custom-cursor-follower" ref={followerRef}></div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <a href="/" style={{ color: 'inherit', textDecoration: 'none' }}>AURA</a>
        </div>
        <div className="nav-links">
          <a href="/dashboard">Dashboard</a>
          <a href="#">Projects</a>
        </div>
        <div className="nav-actions">
          <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="avatar" style={{ width: '32px', height: '32px', background: '#fff', color: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
              AD
            </div>
          </div>
        </div>
      </nav>

      {/* Upload Section */}
      {!showResult && (
      <section className="upload-section reveal-element" id="upload" style={{ marginTop: '8rem', minHeight: '80vh' }}>
        <div className="style-selector-container">
          <div className="style-selector-track" id="styleSelectorTrack">
            {['modern-minimalist', 'industrial', 'japandi', 'brutalist', 'midcentury'].map(style => (
              <button 
                key={style}
                className={`style-pill ${activeStyle === style ? 'active' : ''}`}
                data-style={style}
                onClick={(e) => {
                  setActiveStyle(style);
                  const pillRect = e.currentTarget.getBoundingClientRect();
                  const trackRect = e.currentTarget.parentElement.getBoundingClientRect();
                  const scrollLeft = e.currentTarget.offsetLeft - (trackRect.width / 2) + (pillRect.width / 2);
                  e.currentTarget.parentElement.scrollTo({ left: scrollLeft, behavior: 'smooth' });
                }}
              >
                {style.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>
        <br />
        
        <div 
          className={`upload-container ${isDragging ? 'dragover' : ''}`} 
          id="drop-zone"
          ref={dropZoneRef}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => { if (!isLoading) fileInputRef.current.click(); }}
        >
          <div className="upload-content" id="upload-content" style={{ display: isLoading ? 'none' : 'block' }}>
            <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            <h2 className="upload-title">Drag & Drop your sketch here</h2>
            <p className="upload-subtitle">or click to browse from your device</p>
            <input 
              type="file" 
              id="file-input" 
              accept="image/*" 
              style={{ display: 'none' }} 
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files.length) handleFile(e.target.files[0]);
              }}
            />
          </div>

          <div id="loading-state" style={{ display: isLoading ? 'flex' : 'none', position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', background: 'rgba(9,9,11,0.9)', zIndex: 20 }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: '#09090b', border: '1px solid #27272a', borderRadius: '12px', minWidth: '250px' }}>
              <div style={{ width: '2rem', height: '2rem', background: '#27272a', borderRadius: '6px', animation: 'pulse 2s infinite' }}></div>
              <div style={{ position: 'relative', height: '1.5rem', flex: 1, overflow: 'hidden', pointerEvents: 'none' }}>
                <span className="loading-tooltip" style={{ position: 'absolute', inset: 0, color: '#d4d4d8', opacity: 0, fontFamily: "'Space Grotesk', sans-serif" }}>Analyzing geometry...</span>
                <span className="loading-tooltip" style={{ position: 'absolute', inset: 0, color: '#d4d4d8', opacity: 0, fontFamily: "'Space Grotesk', sans-serif" }}>Calculating lighting...</span>
                <span className="loading-tooltip" style={{ position: 'absolute', inset: 0, color: '#d4d4d8', opacity: 0, fontFamily: "'Space Grotesk', sans-serif" }}>Baking textures...</span>
                <span className="loading-tooltip" style={{ position: 'absolute', inset: 0, color: '#d4d4d8', opacity: 0, fontFamily: "'Space Grotesk', sans-serif" }}>Finalizing scene...</span>
              </div>
            </div>
          </div>

        </div>
        
        {/* Custom Brush Cursor Ring */}
        <div id="brush-cursor" className="brush-cursor"></div>
      </section>
      )}

      {/* Result Section */}
      {showResult && (
      <section className="result-section" id="result-section" style={{ display: 'block' }}>
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>Your Vision, Realized.</h2>
        
        <div className="slider-container" id="slider-container" ref={sliderContainerRef}>
          <img id="slider-before" src={uploadedImageSrc} alt="Before Sketch" className="slider-img" />
          <img 
            id="slider-after" 
            src="/hero.png" 
            alt="After Render" 
            className="slider-img slider-after" 
            style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
          />
          <div className="slider-handle" id="slider-handle" style={{ left: `${sliderPos}%` }}>
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
      )}

      {/* Pro Workspace Overlay */}
      <div id="pro-workspace-overlay" style={{ display: showProWorkspace ? 'flex' : 'none' }}>
        <nav className="pro-workspace-nav">
          <button className="btn-close" id="pro-workspace-close" onClick={handleCloseProWorkspace}>Close</button>
          <div className="nav-brand">AURA PRO</div>
          <button className="btn-generate cta-button primary" id="pro-workspace-generate" onClick={handleGenerate}>Generate</button>
        </nav>
        
        <div className="pro-workspace-body">
          <main id="pro-canvas-container">
            <canvas id="pro-image-canvas" ref={proImageCanvasRef}></canvas>
          </main>
          
          <aside className="pro-workspace-sidebar">
            <h2>Pro Controls</h2>
            
            <div className="control-group">
              <label htmlFor="ai-creativity">AI Creativity (Control Scale)</label>
              <input type="range" id="ai-creativity" min="0" max="100" defaultValue="50" />
            </div>
            
            <div className="control-group">
              <label htmlFor="lighting">Lighting Override</label>
              <select id="lighting" defaultValue="none">
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
                  <input type="radio" name="resolution" value="4k" defaultChecked /> 4K
                </label>
                <label className="res-radio">
                  <input type="radio" name="resolution" value="8k" /> 8K
                </label>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

// AuraCropper class logic
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

    // Need to bind context and keep reference so they can be removed
    this._onMouseDown = this.onMouseDown.bind(this);
    this._onMouseMove = this.onMouseMove.bind(this);
    this._onMouseUp = this.onMouseUp.bind(this);
    this._onWindowResize = this.onWindowResize.bind(this);

    this.bindEvents();
    this.draw();
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
    this.overlayCanvas.addEventListener('mousedown', this._onMouseDown);
    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('mouseup', this._onMouseUp);
    window.addEventListener('resize', this._onWindowResize);
  }

  destroy() {
    this.overlayCanvas.removeEventListener('mousedown', this._onMouseDown);
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('mouseup', this._onMouseUp);
    window.removeEventListener('resize', this._onWindowResize);
    this.overlayCanvas.remove();
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

export default AppPage;
