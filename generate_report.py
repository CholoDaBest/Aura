import docx
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

def create_report():
    doc = docx.Document()
    
    # Title
    title = doc.add_heading('Aura AI Architecture Project - Personal Progress & Reflection Report', 0)
    title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    doc.add_paragraph("This document serves as my personal development log and progress report for my college diploma project: Aura AI. Here, I document not just what I built, but my thought process, the struggles I faced along the way, and the solutions I devised to overcome them.\n")
    
    # 1. Project Overview & Vision
    doc.add_heading('1. Project Overview & My Vision', level=1)
    doc.add_paragraph("For my diploma, I wanted to build something highly impactful and visually stunning. My goal with Aura AI was to create a modern web application that transforms basic architectural sketches into high-end, photorealistic cinematic renders using AI. I decided to focus heavily on a premium user experience. I wanted the interface to feel alive, which meant integrating glassmorphic UI elements and rich micro-animations. It was an ambitious goal, but I knew it would make the project stand out.")
    
    # 2. Technology Stack & My Choices
    doc.add_heading('2. Technology Stack & My Choices', level=1)
    doc.add_paragraph("I had to think carefully about which technologies would allow me to achieve this level of performance and aesthetic quality:")
    tech_list = doc.add_paragraph()
    tech_list.add_run("Frontend: ").bold = True
    tech_list.add_run("I chose to stick with Vanilla HTML/CSS/JS (ESModules) bundled with Vite. I wanted absolute control over the DOM without the overhead of heavy frameworks, which helped me keep performance snappy.\n")
    tech_list.add_run("Animations: ").bold = True
    tech_list.add_run("To get that cinematic, buttery-smooth feel, I integrated GSAP (GreenSock) for timeline animations and Lenis for smooth scroll hijacking. Learning GSAP's ScrollTrigger was initially tough, but it paid off.\n")
    tech_list.add_run("Backend/Integration: ").bold = True
    tech_list.add_run("I set up an Express.js server using Multer to handle image uploads securely. For the AI generation, I integrated the FAL AI Client. Dealing with CORS and async AI generation timeouts was a major hurdle I had to debug.\n")
    
    # 3. Development Journey: Struggles & Solutions
    doc.add_heading('3. Development Journey: Struggles & Solutions', level=1)
    
    doc.add_heading('The Landing Page & Preloader', level=2)
    doc.add_paragraph("My first challenge was setting the right mood. I built a cinematic preloader and an atmospheric background with glowing orbs and laser grids.")
    p = doc.add_paragraph(style='List Bullet')
    p.add_run("The Struggle: ").bold = True
    p.add_run("Getting the glowing orbs and custom cursor to track smoothly without causing performance lag on the main thread was difficult. The cursor felt jittery initially.")
    p = doc.add_paragraph(style='List Bullet')
    p.add_run("The Solution: ").bold = True
    p.add_run("I optimized the animations by using CSS transforms (`translate3d`) and `requestAnimationFrame` for the custom cursor tracking, which shifted the load to the GPU and made it incredibly smooth.")
    
    doc.add_heading('Interactive AI Inpainting Canvas', level=2)
    doc.add_paragraph("I wanted users to be able to paint masks directly over their sketches to indicate where the AI should focus.")
    p = doc.add_paragraph(style='List Bullet')
    p.add_run("The Struggle: ").bold = True
    p.add_run("Handling HTML5 Canvas state for brushing and erasing was complex. Ensuring the mask perfectly aligned with the uploaded image across different screen sizes broke the layout multiple times.")
    p = doc.add_paragraph(style='List Bullet')
    p.add_run("The Solution: ").bold = True
    p.add_run("I had to rethink my approach to canvas scaling. I eventually calculated a bounding box ratio and dynamically resized the canvas elements using a resize observer, ensuring the mask coordinates accurately mapped to the original image resolution before sending it to the backend.")
    
    doc.add_heading('Before/After Slider & Magic Scroll', level=2)
    doc.add_paragraph("To show off the AI results, I built a custom interactive image slider and a 'Magic Scroll' section where text steps correspond to image wipe effects.")
    p = doc.add_paragraph(style='List Bullet')
    p.add_run("The Struggle: ").bold = True
    p.add_run("Synchronizing the GSAP ScrollTrigger with the sticky image container caused a lot of layout jumping (jank). Furthermore, the slider handle calculation was sometimes off on mobile touch events.")
    p = doc.add_paragraph(style='List Bullet')
    p.add_run("The Solution: ").bold = True
    p.add_run("I spent hours reading GSAP documentation and solved the jumping by pinning the container properly and setting predefined heights. For the slider, I unified mouse and touch event listeners to normalize the clientX coordinates.")
    
    doc.add_heading('User Dashboard & Grid Architecture', level=2)
    doc.add_paragraph("I designed a masonry-style dashboard to display generated projects with a sidebar for tracking Pro Plan credits.")
    p = doc.add_paragraph(style='List Bullet')
    p.add_run("The Struggle: ").bold = True
    p.add_run("Creating a pure CSS masonry grid that didn't break chronological ordering of the projects was frustrating. Flexbox columns messed up the left-to-right reading order.")
    p = doc.add_paragraph(style='List Bullet')
    p.add_run("The Solution: ").bold = True
    p.add_run("I decided to use CSS Grid with dense packing and dynamic row spanning calculations via a small JS utility, preserving both the aesthetic and the logical ordering of the user's renders.")
    
    # 4. Design System Reflections
    doc.add_heading('4. My Design Philosophy', level=1)
    doc.add_paragraph("Throughout this journey, I refused to compromise on aesthetics. I adhered strictly to a dark-mode first design using the 'Space Grotesk' font. I pushed myself to replace static elements with micro-interactions. For instance, hovering over project cards scales them slightly and reveals metallic borders. Every small detail was a deliberate choice to make the application feel premium and responsive.")
    
    # Conclusion
    doc.add_heading('5. Moving Forward', level=1)
    doc.add_paragraph("Building Aura AI so far has been an intense learning experience. I've grown significantly in my understanding of advanced DOM manipulation, complex CSS layouts, and integrating third-party AI APIs. Moving forward, my next steps involve solidifying the backend authentication and refining the API communication to ensure error states and timeouts are handled gracefully for the end user.")
    
    doc.save('Aura_Project_Progress.docx')
    print("Personal report generated successfully at Aura_Project_Progress.docx")

if __name__ == '__main__':
    create_report()
