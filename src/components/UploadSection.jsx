import React, { useEffect } from 'react';
import gsap from 'gsap';

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

export default function UploadSection() {
  useEffect(() => {
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

    // Upload functionality
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadContent = document.getElementById('upload-content');

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
          if (proImageCanvas) {
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
          }
        };
        reader.readAsDataURL(file);
      }
    }

    const clickHandler = (e) => {
      if (uploadContent.style.display !== 'none') {
        fileInput.click();
      }
    };
    
    const changeHandler = (e) => {
      if (e.target.files.length) {
        handleFile(e.target.files[0]);
      }
    };
    
    const dragoverHandler = (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    };
    
    const dragleaveHandler = () => {
      dropZone.classList.remove('dragover');
    };
    
    const dropHandler = (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      
      if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
      }
    };

    // Bind Pro Workspace Buttons
    const btnClosePro = document.getElementById('pro-workspace-close');
    const btnGeneratePro = document.getElementById('pro-workspace-generate');
    const proWorkspaceOverlay = document.querySelector('#pro-workspace-overlay');

    const closeProHandler = () => {
      gsap.to(proWorkspaceOverlay, { y: '100%', opacity: 0, duration: 0.8, ease: "power3.in", onComplete: () => { if (proWorkspaceOverlay) proWorkspaceOverlay.style.display = 'none'; } });
      gsap.to('main, footer, nav', { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" });
      gsap.set(document.body, { overflow: 'auto' });
      if (activeCropper) { activeCropper.overlayCanvas.remove(); activeCropper = null; }
    };

    const generateProHandler = async () => {
      // Mock generate: Close workspace, scroll to results
      closeProHandler();
      
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
          const sliderBefore = document.getElementById('slider-before');
          if (sliderBefore) sliderBefore.src = uploadedImageSrc;
          resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 2000);
    };

    if (dropZone && fileInput && uploadContent) {
      dropZone.addEventListener('click', clickHandler);
      fileInput.addEventListener('change', changeHandler);
      dropZone.addEventListener('dragover', dragoverHandler);
      dropZone.addEventListener('dragleave', dragleaveHandler);
      dropZone.addEventListener('drop', dropHandler);
    }
    
    if (btnClosePro) btnClosePro.addEventListener('click', closeProHandler);
    if (btnGeneratePro) btnGeneratePro.addEventListener('click', generateProHandler);

    // Cleanup
    return () => {
      if (dropZone) {
        dropZone.removeEventListener('click', clickHandler);
        dropZone.removeEventListener('dragover', dragoverHandler);
        dropZone.removeEventListener('dragleave', dragleaveHandler);
        dropZone.removeEventListener('drop', dropHandler);
      }
      if (fileInput) fileInput.removeEventListener('change', changeHandler);
      if (btnClosePro) btnClosePro.removeEventListener('click', closeProHandler);
      if (btnGeneratePro) btnGeneratePro.removeEventListener('click', generateProHandler);
      stopLoadingTooltips();
    };
  }, []);

  useEffect(() => {
    // Before/After Slider Logic
    const sliderContainer = document.getElementById('slider-container');
    const sliderHandle = document.getElementById('slider-handle');
    const sliderAfter = document.getElementById('slider-after');

    if (sliderContainer && sliderHandle && sliderAfter) {
      let isDragging = false;

      const mouseDownHandler = () => isDragging = true;
      const mouseUpHandler = () => isDragging = false;
      const mouseMoveHandler = (e) => {
        if (!isDragging) return;
        updateSlider(e.clientX);
      };

      const touchStartHandler = () => isDragging = true;
      const touchEndHandler = () => isDragging = false;
      const touchMoveHandler = (e) => {
        if (!isDragging) return;
        updateSlider(e.touches[0].clientX);
      };

      sliderContainer.addEventListener('mousedown', mouseDownHandler);
      window.addEventListener('mouseup', mouseUpHandler);
      window.addEventListener('mousemove', mouseMoveHandler);

      sliderContainer.addEventListener('touchstart', touchStartHandler);
      window.addEventListener('touchend', touchEndHandler);
      window.addEventListener('touchmove', touchMoveHandler);

      function updateSlider(clientX) {
        const rect = sliderContainer.getBoundingClientRect();
        let x = clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const percent = (x / rect.width) * 100;
        
        sliderHandle.style.left = `${percent}%`;
        sliderAfter.style.clipPath = `polygon(0 0, ${percent}% 0, ${percent}% 100%, 0 100%)`;
      }

      return () => {
        sliderContainer.removeEventListener('mousedown', mouseDownHandler);
        window.removeEventListener('mouseup', mouseUpHandler);
        window.removeEventListener('mousemove', mouseMoveHandler);
        sliderContainer.removeEventListener('touchstart', touchStartHandler);
        window.removeEventListener('touchend', touchEndHandler);
        window.removeEventListener('touchmove', touchMoveHandler);
      };
    }
  }, []);

  useEffect(() => {
    // Style Selector Logic
    const track = document.getElementById('styleSelectorTrack');
    let pills = [];
    let pillClickHandler = null;
    
    if (track) {
      pills = Array.from(track.querySelectorAll('.style-pill'));
      pillClickHandler = (e) => {
        pills.forEach(p => p.classList.remove('active'));
        const clickedPill = e.currentTarget;
        clickedPill.classList.add('active');
        const pillRect = clickedPill.getBoundingClientRect();
        const trackRect = track.getBoundingClientRect();
        const scrollLeft = clickedPill.offsetLeft - (trackRect.width / 2) + (pillRect.width / 2);
        track.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      };

      pills.forEach(pill => {
        pill.addEventListener('click', pillClickHandler);
      });

      return () => {
        pills.forEach(pill => {
          pill.removeEventListener('click', pillClickHandler);
        });
      };
    }
  }, []);

  return (
    <>
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
            <h2 className="upload-title">Drag &amp; Drop your sketch here</h2>
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
                <input type="range" id="brush-size" min="5" max="150" defaultValue="40" className="brush-slider" />
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
          <img id="slider-before" src="" alt="Before Sketch" className="slider-img" loading="lazy" />
          <img id="slider-after" src="/hero.png" alt="After Render" className="slider-img slider-after" loading="lazy" />
          
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
              <input type="range" id="ai-creativity" min="0" max="100" defaultValue="50" />
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
}
