import React, { useEffect, useRef } from 'react';

export default function Skills() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = Math.min(W, H) / 2 - 52;

    const skills = [
      { label: 'HTML', value: 0.95 },
      { label: 'CSS', value: 0.9 },
      { label: 'JavaScript', value: 0.82 },
      { label: 'React', value: 0.72 },
      { label: 'Accessibility', value: 0.78 },
      { label: 'Performance', value: 0.80 },
    ];
    const n = skills.length;
    const angleStep = (Math.PI * 2) / n;

    let progress = 0;
    const duration = 1400;
    let startTime: number | null = null;

    function easeOut(t: number) { return 1 - Math.pow(1 - t, 3); }

    function getPoint(i: number, factor: number) {
      const angle = angleStep * i - Math.PI / 2;
      return {
        x: cx + Math.cos(angle) * R * factor,
        y: cy + Math.sin(angle) * R * factor,
      };
    }

    function draw(ts: number) {
      if (!startTime) startTime = ts;
      progress = Math.min((ts - startTime) / duration, 1);
      const p = easeOut(progress);

      ctx!.clearRect(0, 0, W, H);

      // Grid rings
      for (let level = 1; level <= 5; level++) {
        ctx!.beginPath();
        for (let i = 0; i < n; i++) {
          const pt = getPoint(i, level / 5);
          i === 0 ? ctx!.moveTo(pt.x, pt.y) : ctx!.lineTo(pt.x, pt.y);
        }
        ctx!.closePath();
        ctx!.strokeStyle = level === 5 ? 'rgba(124,58,237,0.22)' : 'rgba(124,58,237,0.08)';
        ctx!.lineWidth = level === 5 ? 1.5 : 1;
        ctx!.stroke();
      }

      // Axis lines
      for (let i = 0; i < n; i++) {
        const pt = getPoint(i, 1);
        ctx!.beginPath();
        ctx!.moveTo(cx, cy);
        ctx!.lineTo(pt.x, pt.y);
        ctx!.strokeStyle = 'rgba(124,58,237,0.12)';
        ctx!.lineWidth = 1;
        ctx!.setLineDash([4, 4]);
        ctx!.stroke();
        ctx!.setLineDash([]);
      }

      // Filled area
      const gradient = ctx!.createRadialGradient(cx, cy, 0, cx, cy, R);
      gradient.addColorStop(0, 'rgba(124,58,237,0.3)');
      gradient.addColorStop(1, 'rgba(57,211,83,0.06)');

      ctx!.beginPath();
      skills.forEach((s, i) => {
        const pt = getPoint(i, s.value * p);
        i === 0 ? ctx!.moveTo(pt.x, pt.y) : ctx!.lineTo(pt.x, pt.y);
      });
      ctx!.closePath();
      ctx!.fillStyle = gradient;
      ctx!.fill();
      ctx!.strokeStyle = 'rgba(167,139,250,0.85)';
      ctx!.lineWidth = 2;
      ctx!.stroke();

      // Dots
      skills.forEach((s, i) => {
        const pt = getPoint(i, s.value * p);
        ctx!.beginPath();
        ctx!.arc(pt.x, pt.y, 4.5, 0, Math.PI * 2);
        ctx!.fillStyle = '#a78bfa';
        ctx!.fill();
        ctx!.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx!.lineWidth = 1;
        ctx!.stroke();
      });

      // Labels
      ctx!.font = '600 12px "Plus Jakarta Sans", sans-serif';
      skills.forEach((s, i) => {
        const pt = getPoint(i, 1.25);
        ctx!.fillStyle = '#8b90b8';
        ctx!.textAlign = 'center';
        ctx!.textBaseline = 'middle';
        ctx!.fillText(s.label, pt.x, pt.y);
      });

      if (progress < 1) requestAnimationFrame(draw);
    }

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        startTime = null;
        requestAnimationFrame(draw);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(canvas);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="section skills-section">
      <div className="container">
        <div className="section-eyebrow">06 · Skills</div>
        <h2 className="section-title reveal">My Technical <span className="grad">Stack</span></h2>
        
        <div className="skills-layout">
          <div className="skills-cards reveal">
            <div className="skill-cat">
              <h4><i className="fa-solid fa-code"></i> Frontend</h4>
              <div className="skill-tags">
                <span>HTML5</span><span>CSS3</span><span>JavaScript</span><span>React</span><span>Sass</span><span>WordPress</span>
              </div>
            </div>
            <div className="skill-cat">
              <h4><i className="fa-solid fa-server"></i> Backend</h4>
              <div className="skill-tags">
                <span>Node.js</span><span>Express</span><span>MongoDB</span><span>PostgreSQL</span>
              </div>
            </div>
            <div className="skill-cat">
              <h4><i className="fa-solid fa-language"></i> Languages</h4>
              <div className="skill-tags">
                <span>Java</span><span>JavaScript</span><span>C#</span><span>Python</span>
              </div>
            </div>
            <div className="skill-cat">
              <h4><i className="fa-solid fa-wrench"></i> Tools</h4>
              <div className="skill-tags">
                <span>Git</span><span>GitHub</span><span>Figma</span><span>Render</span><span>Vercel</span>
              </div>
            </div>
          </div>

          <div className="skills-visual reveal reveal-right">
            <div className="radar-canvas-wrap">
              <canvas ref={canvasRef} width="400" height="400" id="radarChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
