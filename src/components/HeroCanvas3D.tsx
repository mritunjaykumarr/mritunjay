import { useEffect, useRef } from 'react';

export default function HeroCanvas3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(Math.floor(width / 18), 60);
    interface Particle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      radius: number;
      color: string;
    }

    const particles: Particle[] = [];
    const colors = ['#6366f1', '#8b5cf6', '#3b82f6', '#06b6d4', '#ec4899'];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * width * 1.5;
      const y = (Math.random() - 0.5) * height * 1.5;
      const z = Math.random() * 450 + 50;
      particles.push({
        x,
        y,
        z,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    interface Polyhedron {
      x: number;
      y: number;
      z: number;
      rx: number;
      ry: number;
      vrx: number;
      vry: number;
      size: number;
    }

    const polyhedra: Polyhedron[] = [
      { x: width * 0.22 - width / 2, y: -height * 0.18, z: 250, rx: 0, ry: 0, vrx: 0.005, vry: 0.008, size: 45 },
      { x: width * 0.32 - width / 2, y: height * 0.22, z: 300, rx: 0, ry: 0, vrx: 0.007, vry: 0.004, size: 50 },
      { x: -width * 0.32 + width / 2, y: height * 0.1, z: 200, rx: 0, ry: 0, vrx: -0.004, vry: 0.006, size: 38 },
    ];

    const fov = 400;

    const project3D = (x: number, y: number, z: number) => {
      const scale = fov / (fov + z);
      return {
        x: width / 2 + x * scale,
        y: height / 2 + y * scale,
        scale,
      };
    };

    const drawCubeWireframe = (poly: Polyhedron, rotMouseX: number, rotMouseY: number) => {
      const size = poly.size;
      const vertices = [
        [-size, -size, -size], [size, -size, -size], [size, size, -size], [-size, size, -size],
        [-size, -size, size], [size, -size, size], [size, size, size], [-size, size, size],
      ];

      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ];

      const rx = poly.rx + rotMouseY * 0.0004;
      const ry = poly.ry + rotMouseX * 0.0004;

      const projected = vertices.map(([vx, vy, vz]) => {
        let x1 = vx * Math.cos(ry) + vz * Math.sin(ry);
        let z1 = -vx * Math.sin(ry) + vz * Math.cos(ry);
        let y2 = vy * Math.cos(rx) - z1 * Math.sin(rx);
        let z2 = vy * Math.sin(rx) + z1 * Math.cos(rx);
        return project3D(poly.x + x1, poly.y + y2, poly.z + z2);
      });

      ctx.save();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.22)';
      ctx.lineWidth = 1.2;

      edges.forEach(([start, end]) => {
        const p1 = projected[start];
        const p2 = projected[end];
        if (p1.scale > 0 && p2.scale > 0) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });

      projected.forEach((p) => {
        if (p.scale > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2 * p.scale, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(139, 92, 246, 0.6)';
          ctx.fill();
        }
      });
      ctx.restore();
    };

    const render = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const ambientGlow = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        10,
        mouse.x,
        mouse.y,
        450
      );
      ambientGlow.addColorStop(0, 'rgba(99, 102, 241, 0.14)');
      ambientGlow.addColorStop(0.5, 'rgba(139, 92, 246, 0.04)');
      ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, width, height);

      const rotMouseX = mouse.x - width / 2;
      const rotMouseY = mouse.y - height / 2;

      polyhedra.forEach((poly) => {
        poly.rx += poly.vrx;
        poly.ry += poly.vry;
        drawCubeWireframe(poly, rotMouseX, rotMouseY);
      });

      const projectedParticles: { x: number; y: number; scale: number; color: string; p: Particle }[] = [];

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.x < -width) p.x = width;
        if (p.x > width) p.x = -width;
        if (p.y < -height) p.y = height;
        if (p.y > height) p.y = -height;
        if (p.z < 20) p.z = 450;
        if (p.z > 450) p.z = 20;

        const proj = project3D(p.x + rotMouseX * 0.08, p.y + rotMouseY * 0.08, p.z);
        if (proj.scale > 0) {
          projectedParticles.push({ ...proj, color: p.color, p });
        }
      });

      for (let i = 0; i < projectedParticles.length; i++) {
        for (let j = i + 1; j < projectedParticles.length; j++) {
          const p1 = projectedParticles[i];
          const p2 = projectedParticles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.22 * Math.min(p1.scale, p2.scale);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      projectedParticles.forEach((p) => {
        const radius = p.p.radius * p.scale * 1.4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(radius, 0.5), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="hero-3d-canvas"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
