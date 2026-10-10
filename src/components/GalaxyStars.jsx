import { useEffect, useRef } from 'react';
import { useTheme } from '../common/ThemeContext';

function GalaxyStars() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const isDark = theme === 'dark';

    // 1. Generate Star / Solar Particles
    const particleCount = isDark ? 160 : 65;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: isDark ? Math.random() * 1.8 + 0.4 : Math.random() * 1.4 + 0.3,
      alpha: isDark ? Math.random() * 0.8 + 0.2 : Math.random() * 0.18 + 0.05,
      speed: isDark ? Math.random() * 0.015 + 0.005 : Math.random() * 0.006 + 0.002,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
      // Dark mode: stars (white, cyan, violet) | Light mode: soft warm embers
      color: isDark
        ? Math.random() > 0.7 ? '#818cf8' : Math.random() > 0.4 ? '#38bdf8' : '#ffffff'
        : Math.random() > 0.7 ? '#fb923c' : Math.random() > 0.4 ? '#fdba74' : '#fcd34d',
      vy: isDark ? (Math.random() - 0.5) * 0.1 : -Math.random() * 0.2 - 0.05
    }));

    // 2. Cosmic Nebulae Lights (Dark) or Soft Warm Ambient Glow (Light)
    const lights = isDark
      ? [
          { x: width * 0.8, y: height * 0.2, r: 240, color: 'rgba(99, 102, 241, 0.05)' },
          { x: width * 0.2, y: height * 0.7, r: 280, color: 'rgba(56, 189, 248, 0.04)' },
          { x: width * 0.5, y: height * 0.4, r: 350, color: 'rgba(139, 92, 246, 0.03)' }
        ]
      : [
          { x: width * 0.9, y: height * 0.12, r: 300, color: 'rgba(251, 146, 60, 0.025)' },
          { x: width * 0.1, y: height * 0.8, r: 250, color: 'rgba(245, 158, 11, 0.02)' },
          { x: width * 0.5, y: height * 0.5, r: 280, color: 'rgba(251, 191, 36, 0.015)' }
        ];

    // 3. Floating Celestial Planets (Active in Dark Mode Galaxy; subtle low-intensity warm orb in Light Mode)
    const planets = isDark
      ? [
          // Saturn-style ringed planet
          {
            x: width * 0.85,
            y: height * 0.25,
            radius: 32,
            hasRing: true,
            ringRadiusX: 65,
            ringRadiusY: 18,
            ringAngle: -0.35,
            color1: '#1e293b',
            color2: '#0f172a',
            glowColor: 'rgba(56, 189, 248, 0.25)',
            angle: 0,
            speed: 0.0003
          },
          // Luminous Moon / Gas Orb
          {
            x: width * 0.12,
            y: height * 0.75,
            radius: 24,
            hasRing: false,
            color1: '#312e81',
            color2: '#1e1b4b',
            glowColor: 'rgba(129, 140, 248, 0.3)',
            angle: 0,
            speed: 0.0005
          }
        ]
      : [
          // Subtle low-intensity warm solar orb in Light Mode
          {
            x: width * 0.88,
            y: height * 0.18,
            radius: 28,
            hasRing: false,
            color1: 'rgba(253, 186, 116, 0.18)',
            color2: 'rgba(251, 146, 60, 0.10)',
            glowColor: 'rgba(251, 146, 60, 0.07)',
            isSun: true
          }
        ];

    // 4. Shooting Stars / Meteors
    let meteor = null;
    let lastMeteorTime = Date.now();

    const spawnMeteor = () => {
      meteor = {
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 90 + 60,
        speed: Math.random() * 8 + 7,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        opacity: isDark ? 1 : 0.22,
        color: isDark ? 'rgba(255, 255, 255,' : 'rgba(251, 146, 60,'
      };
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // A. Ambient Nebulae / Solar Core Lights
      lights.forEach((l) => {
        const grad = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r);
        grad.addColorStop(0, l.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // B. Floating Celestial Planets / Soft Solar Orb
      planets.forEach((p) => {
        // Slow subtle drift
        p.y += Math.sin(Date.now() * 0.0008) * 0.15;

        // Planet Atmosphere Glow
        const glowGrad = ctx.createRadialGradient(p.x, p.y, p.radius * 0.8, p.x, p.y, p.radius * 2.2);
        glowGrad.addColorStop(0, p.glowColor);
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Planet Body
        const planetGrad = ctx.createRadialGradient(
          p.x - p.radius * 0.3,
          p.y - p.radius * 0.3,
          p.radius * 0.1,
          p.x,
          p.y,
          p.radius
        );
        planetGrad.addColorStop(0, p.color1);
        planetGrad.addColorStop(1, p.color2);

        ctx.fillStyle = planetGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Planetary Rings (Saturn style)
        if (p.hasRing) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.ringAngle);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.ringRadiusX, p.ringRadiusY, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.lineWidth = 3.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(0, 0, p.ringRadiusX * 1.15, p.ringRadiusY * 1.15, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(129, 140, 248, 0.2)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }
      });

      // C. Twinkling Stars & Floating Solar Embers
      const maxAlpha = isDark ? 0.95 : 0.25;
      const minAlpha = isDark ? 0.15 : 0.05;
      particles.forEach((pt) => {
        pt.alpha += pt.speed * pt.twinkleDir;
        if (pt.alpha >= maxAlpha) {
          pt.alpha = maxAlpha;
          pt.twinkleDir = -1;
        } else if (pt.alpha <= minAlpha) {
          pt.alpha = minAlpha;
          pt.twinkleDir = 1;
        }

        // Float motion
        pt.y += pt.vy;
        if (pt.y < 0) pt.y = height;
        if (pt.y > height) pt.y = 0;

        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.alpha;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // D. Meteors / Shooting Stars
      const now = Date.now();
      if (!meteor && now - lastMeteorTime > 5000 && Math.random() < 0.4) {
        spawnMeteor();
        lastMeteorTime = now;
      }

      if (meteor) {
        meteor.x += Math.cos(meteor.angle) * meteor.speed;
        meteor.y += Math.sin(meteor.angle) * meteor.speed;
        meteor.opacity -= 0.016;

        if (meteor.opacity <= 0) {
          meteor = null;
        } else {
          ctx.strokeStyle = `${meteor.color} ${meteor.opacity})`;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(
            meteor.x - Math.cos(meteor.angle) * meteor.length,
            meteor.y - Math.sin(meteor.angle) * meteor.length
          );
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
}

export default GalaxyStars;
