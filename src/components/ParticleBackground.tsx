import React, { useRef, useEffect } from 'react';
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
  const particles: Particle[] = [];
  const colors = ['#fff', '#ffccdd', '#ffaaaa', '#ffdddd', '#eeeeee'];
  
  // 初始化粒子
  const initParticles = (canvas: HTMLCanvasElement) => {
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
  };
  
  // 动画循环
  const animate = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 更新和绘制每个粒子
    for (const particle of particles) {
      // 移动粒子
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // 处理边界
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
      
      // 绘制粒子
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity;
      ctx.fill();
      
      // 连接附近的粒子
      connectParticles(particle, ctx);
    }
    
    requestAnimationFrame(() => animate(canvas, ctx));
  };
  
  // 连接附近的粒子
  const connectParticles = (particle: Particle, ctx: CanvasRenderingContext2D) => {
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
  };
  
  // 设置canvas和开始动画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 设置canvas大小
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // 清空并初始化粒子
    particles.length = 0;
    initParticles(canvas);
    
    // 开始动画
    animate(canvas, ctx);
    
    // 清理
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);
  
  return <ParticleCanvas ref={canvasRef} />;
};

export default ParticleBackground; 