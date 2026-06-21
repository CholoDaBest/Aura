import React, { useEffect } from 'react';
import gsap from 'gsap';

export default function StylePreview() {
  useEffect(() => {
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
  }, []);

  return (
    <section className="style-preview-section reveal-element">
      <div className="style-header">
        <h2 className="section-title ">One sketch. Infinite possibilities.</h2>
        <p className="section-text">Select an architectural style below to instantly restyle the space.</p>
      </div>
      
      <div className="style-preview-container">
        
        <div className="style-viewport">
          <img id="style-img-modern" src="/modern_living.png" className="style-img active" alt="Modern Minimalist" loading="lazy" />
          <img id="style-img-industrial" src="/industrial_living.png" className="style-img" alt="Industrial Loft" loading="lazy" />
          <img id="style-img-japandi" src="/japandi_living.png" className="style-img" alt="Japandi" loading="lazy" />
          <img id="style-img-biophilic" src="/biophilic_living.png" className="style-img" alt="Biophilic Architecture" loading="lazy" />
          <img id="style-img-cyberpunk" src="/cyberpunk_living.png" className="style-img" alt="Neon Cyberpunk" loading="lazy" />
        </div>
        
        <div className="style-chips-wrapper">
          <button className="style-chip active" data-style="modern">Modern Minimalist</button>
          <button className="style-chip" data-style="industrial">Industrial Loft</button>
          <button className="style-chip" data-style="japandi">Japandi</button>
          <button className="style-chip" data-style="biophilic">Biophilic Architecture</button>
          <button className="style-chip" data-style="cyberpunk">Neon Cyberpunk</button>
        </div>
      </div>
    </section>
  );
}
