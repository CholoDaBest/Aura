import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

with open('main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Extract body
body_match = re.search(r'<body>(.*?)<script type="module" src="/main\.js"></script>\s*</body>', html, re.DOTALL)
if body_match:
    body = body_match.group(1)
else:
    body = html

# Remove the preloader script logic from body, we'll handle it in react
body = re.sub(r'<script>.*?</script>', '', body, flags=re.DOTALL)
preloader_div = r'<div id="preloader" class="preloader">\s*<div class="preloader-logo">Aura.</div>\s*<div class="preloader-progress-bar">\s*<div class="preloader-progress"></div>\s*</div>\s*</div>'
body = re.sub(preloader_div, '', body, flags=re.DOTALL)

# Convert class to className
body = body.replace('class=', 'className=')
body = body.replace('for=', 'htmlFor=')

# Convert SVG attributes
body = body.replace('stroke-width=', 'strokeWidth=')
body = body.replace('stroke-linecap=', 'strokeLinecap=')
body = body.replace('stroke-linejoin=', 'strokeLinejoin=')
body = body.replace('clip-path=', 'clipPath=')

# Fix inline styles (very basic approach, we will replace specific ones or use a regex)
def style_to_react(match):
    style_str = match.group(1)
    # Split by ;
    rules = style_str.split(';')
    react_style = []
    for rule in rules:
        rule = rule.strip()
        if ':' not in rule:
            continue
        key, val = rule.split(':', 1)
        key = key.strip()
        val = val.strip()
        # to camelCase
        parts = key.split('-')
        if len(parts) > 1:
            key = parts[0] + ''.join(p.capitalize() for p in parts[1:])
        if 'rgba' not in val:
            val = val.replace('"', "'")
        react_style.append(f"{key}: `{val}`")
    return "style={{" + ", ".join(react_style) + "}}"

body = re.sub(r'style="([^"]*)"', style_to_react, body)

# Fix self-closing tags
body = re.sub(r'<img(.*?)/ loading="lazy">', r'<img\1 loading="lazy" />', body)
body = re.sub(r'<img([^>]*?)(?<!/)>', lambda m: m.group(0) if '/>' in m.group(0) else f'<img{m.group(1)} />', body)
body = re.sub(r'<input([^>]*?)(?<!/)>', lambda m: m.group(0) if '/>' in m.group(0) else f'<input{m.group(1)} />', body)
body = body.replace('<br>', '<br />')
body = body.replace('//', '/') # some img tags have / loading="lazy" replaced to //
body = body.replace('onsubmit="event.preventDefault(); window.location.href=\'/app.html\';"', 'onSubmit={(e) => { e.preventDefault(); window.location.href=\'/app.html\'; }}')

# Some specific img fixes from the regex
body = body.replace('/ loading="lazy"', 'loading="lazy"')
body = body.replace('//>', '/>')

# Remove comments for safer JSX
body = re.sub(r'<!--(.*?)-->', '', body, flags=re.DOTALL)

# Fix class on JS string imports
js = js.replace("import './style.css';", "// import './style.css';")
js = js.replace("import Lenis from '@studio-freight/lenis';", "// import Lenis from '@studio-freight/lenis';")
js = js.replace("import gsap from 'gsap';", "// import gsap from 'gsap';")
js = js.replace("import { ScrollTrigger } from 'gsap/ScrollTrigger';", "// import { ScrollTrigger } from 'gsap/ScrollTrigger';")
js = js.replace("import SplitType from 'split-type';", "// import SplitType from 'split-type';")

# Create Home.jsx content
jsx_content = f"""import React, {{ useEffect, useState }} from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import {{ ScrollTrigger }} from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import '../style.css'; // Adjust path as needed

gsap.registerPlugin(ScrollTrigger);

export default function Home() {{
  const [preloaderShown, setPreloaderShown] = useState(false);

  useEffect(() => {{
    if (sessionStorage.getItem("auraPreloaderShown")) {{
      setPreloaderShown(true);
    }} else {{
      sessionStorage.setItem("auraPreloaderShown", "true");
    }}
  }}, []);

  useEffect(() => {{
    // --- JS Logic From main.js ---
    {js}
    
    // Cleanup function
    return () => {{
      ScrollTrigger.getAll().forEach(t => t.kill());
      if (typeof lenis !== 'undefined') lenis.destroy();
    }};
  }}, []);

  return (
    <div className="home-container">
      {{!preloaderShown && (
        <div id="preloader" className="preloader">
          <div className="preloader-logo">Aura.</div>
          <div className="preloader-progress-bar">
            <div className="preloader-progress"></div>
          </div>
        </div>
      )}}
      
      {{/* Inject the rest of the body */}}
      {body}
    </div>
  );
}}
"""

os.makedirs('src/pages', exist_ok=True)
with open('src/pages/Home.jsx', 'w', encoding='utf-8') as f:
    f.write(jsx_content)

print("Created src/pages/Home.jsx")
