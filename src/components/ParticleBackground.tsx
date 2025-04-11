import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';

const ParticleCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.5;
`;

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]).current;
  const colors = useMemo(() => ['#fff', '#ffccdd', '#ffaaaa', '#ffdddd', '#eeeeee'], []);
  const dimensions = useRef<{ width: number; height: number } | null>(null);
  const isReady = useRef<boolean>(false);
  
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    particles.length = 0;
    
    const count = Math.floor(canvas.width * canvas.height / 10000);
    
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: Math.random() * 0.2 - 0.1,
        speedY: Math.random() * 0.2 - 0.1,
        opacity: Math.random() * 0.5 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }, [colors, particles]);
  
  const connectParticles = useCallback((particle: Particle, ctx: CanvasRenderingContext2D) => {
    for (const otherParticle of particles) {
      if (particle === otherParticle) continue;
      
      const distance = Math.sqrt(
        Math.pow(particle.x - otherParticle.x, 2) + 
        Math.pow(particle.y - otherParticle.y, 2)
      );
      
      if (distance < 100) {
        ctx.beginPath();
        ctx.strokeStyle = particle.color;
        ctx.globalAlpha = 0.1 * (1 - distance / 100);
        ctx.lineWidth = 0.5;
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(otherParticle.x, otherParticle.y);
        ctx.stroke();
      }
    }
  }, [particles]);
  
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (const particle of particles) {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      ctx.fill();
      
      connectParticles(particle, ctx);
    }
  }, [particles, connectParticles]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let animationFrameId: number;
    
    const setCanvasSize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      dimensions.current = { width: canvas.width, height: canvas.height };
      isReady.current = true;
      initParticles();
    };
    
    const startAnimation = () => {
      if (!isReady.current || particles.length === 0) return;
      
      const render = () => {
        animate();
        animationFrameId = requestAnimationFrame(render);
      };
      cancelAnimationFrame(animationFrameId);
      render();
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    startAnimation();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [initParticles, animate, particles]);
  
  return <ParticleCanvas ref={canvasRef} />;
};

export default ParticleBackground; 