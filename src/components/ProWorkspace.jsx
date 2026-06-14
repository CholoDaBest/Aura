import React, { useEffect } from 'react';
import gsap from 'gsap';

export class AuraCropper {
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

export default function ProWorkspace({ uploadedImageSrc }) {
  useEffect(() => {
    // initCanvas logic
    if (uploadedImageSrc) {
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
            if (window.activeCropper) window.activeCropper.overlayCanvas.remove();
            window.activeCropper = new AuraCropper('pro-image-canvas');
          }, 1200); // Wait for transition
        };
        img.src = uploadedImageSrc;
      }
    }
  }, [uploadedImageSrc]);

  useEffect(() => {
    // Bind Pro Workspace Buttons
    const btnClosePro = document.getElementById('pro-workspace-close');
    const btnGeneratePro = document.getElementById('pro-workspace-generate');
    const proWorkspaceOverlay = document.querySelector('#pro-workspace-overlay');

    const handleClose = () => {
      gsap.to(proWorkspaceOverlay, { y: '100%', opacity: 0, duration: 0.8, ease: "power3.in", onComplete: () => proWorkspaceOverlay.style.display = 'none' });
      gsap.to('main, footer, nav', { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" });
      gsap.set(document.body, { overflow: 'auto' });
      if (window.activeCropper) { 
        window.activeCropper.overlayCanvas.remove(); 
        window.activeCropper = null; 
      }
    };

    const handleGenerate = async () => {
      // Mock generate: Close workspace, scroll to results
      if (btnClosePro) btnClosePro.click();
      
      const loadingState = document.getElementById('loading-state');
      if (loadingState) {
        loadingState.style.display = 'flex';
        if (typeof window.startLoadingTooltips === 'function') {
          window.startLoadingTooltips();
        }
      }

      // Normally we'd extract the cropped image here using activeCropper.getCropData()
      
      setTimeout(() => { 
        if (typeof window.stopLoadingTooltips === 'function') {
          window.stopLoadingTooltips();
        }
        if (loadingState) loadingState.style.display = 'none'; 
        
        const uploadSection = document.getElementById('upload');
        const resultSection = document.getElementById('result-section');
        if (uploadSection && resultSection) {
          uploadSection.style.display = 'none';
          resultSection.style.display = 'block';
          const sliderBefore = document.getElementById('slider-before');
          if (sliderBefore && window.uploadedImageSrc) {
            sliderBefore.src = window.uploadedImageSrc;
          }
          resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 2000);
    };

    if (btnClosePro) {
      btnClosePro.addEventListener('click', handleClose);
    }

    if (btnGeneratePro) {
      btnGeneratePro.addEventListener('click', handleGenerate);
    }

    return () => {
      if (btnClosePro) {
        btnClosePro.removeEventListener('click', handleClose);
      }
      if (btnGeneratePro) {
        btnGeneratePro.removeEventListener('click', handleGenerate);
      }
    };
  }, []);

  return (
    <div id="pro-workspace-overlay" style={{display: 'none'}}>
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
  );
}
