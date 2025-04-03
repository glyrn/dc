import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

const AnimationContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
`;

const Heart = styled(motion.div)<{ color: string }>`
  position: absolute;
  width: 60px;
  height: 60px;
  background-color: ${props => props.color};
  transform-origin: center;
  filter: drop-shadow(0 0 8px rgba(255, 107, 107, 0.5));
  z-index: 3;
  
  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 60px;
    height: 60px;
    background-color: ${props => props.color};
    border-radius: 50%;
    top: 0px;
  }
  
  &:before {
    left: -30px;
  }
  
  &:after {
    right: -30px;
  }
`;

const LeftHeart = styled(Heart)`
  left: calc(50% - 150px);
  transform: rotate(-45deg);
`;

const RightHeart = styled(Heart)`
  right: calc(50% - 150px);
  transform: rotate(-45deg);
`;

const HeartConnection = styled(motion.div)`
  position: absolute;
  width: 0;
  height: 2px;
  background-color: #ff6b6b;
  top: calc(50% - 1px);
  z-index: 2;
  box-shadow: 0 0 10px #ff6b6b, 0 0 20px #ff6b6b;
`;

const Cupid = styled(motion.div)`
  position: absolute;
  width: 80px;
  height: 100px;
  bottom: 50px;
  left: calc(50% - 40px);
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CupidBody = styled(motion.div)`
  width: 50px;
  height: 50px;
  background-color: #ffdddd;
  border-radius: 50%;
  position: relative;
  z-index: 3;
`;

const CupidFace = styled.div`
  position: absolute;
  top: 15px;
  left: 10px;
  width: 30px;
  height: 20px;
  
  &:before, &:after {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    background-color: #555;
    border-radius: 50%;
  }
  
  &:before {
    left: 5px;
  }
  
  &:after {
    right: 5px;
  }
`;

const CupidMouth = styled.div`
  position: absolute;
  width: 8px;
  height: 4px;
  border-radius: 50%;
  background-color: #ff9999;
  bottom: 0;
  left: 11px;
`;

const Wings = styled(motion.div)`
  position: absolute;
  top: 15px;
  width: 80px;
  height: 40px;
  z-index: 2;
  
  &:before, &:after {
    content: '';
    position: absolute;
    width: 30px;
    height: 40px;
    background-color: white;
    border-radius: 50% 50% 0 50%;
  }
  
  &:before {
    left: 5px;
    transform: rotate(-20deg);
  }
  
  &:after {
    right: 5px;
    transform: rotate(20deg) scaleX(-1);
  }
`;

const Bow = styled(motion.div)`
  position: relative;
  width: 40px;
  height: 60px;
  margin-top: 10px;
  
  &:before {
    content: '';
    position: absolute;
    width: 40px;
    height: 60px;
    border: 3px solid #d4af37;
    border-right: none;
    border-radius: 60px 0 0 60px;
    top: 0;
  }
  
  &:after {
    content: '';
    position: absolute;
    width: 3px;
    height: 60px;
    background-color: #d4af37;
    right: 0;
    top: 0;
  }
`;

const Arrow = styled(motion.div)`
  position: absolute;
  width: 200px;
  height: 3px;
  background-color: #d4af37;
  top: calc(50% - 1.5px);
  left: calc(50% - 55px);
  z-index: 3;
  
  &:before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 12px solid #d4af37;
    right: -12px;
    top: -4.5px;
  }
`;

// 创建粒子组件
const Particle = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  background-color: ${props => props.color || '#ffaa00'};
  border-radius: 50%;
`;

const ShineEffect = styled(motion.div)`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
  z-index: 1;
`;

interface HeartAnimationProps {
  onComplete: () => void;
}

const HeartAnimation: React.FC<HeartAnimationProps> = ({ onComplete }) => {
  const [animationStep, setAnimationStep] = useState(0);
  const [showArrow, setShowArrow] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [arrowParticles, setArrowParticles] = useState<{id: number, x: number, y: number, color: string}[]>([]);
  const [showShine, setShowShine] = useState(false);
  const [showHeartParticles, setShowHeartParticles] = useState(false);
  const [heartParticles, setHeartParticles] = useState<{id: number, x: number, y: number, color: string}[]>([]);
  
  const arrowRef = useRef<HTMLDivElement>(null);
  const leftHeartRef = useRef<HTMLDivElement>(null);
  const rightHeartRef = useRef<HTMLDivElement>(null);
  
  const leftHeartControls = useAnimation();
  const rightHeartControls = useAnimation();
  const cupidControls = useAnimation();
  const wingsControls = useAnimation();
  const arrowControls = useAnimation();
  const connectionControls = useAnimation();
  const shineControls = useAnimation();
  
  // 心跳动画
  useEffect(() => {
    const heartbeat = async () => {
      await Promise.all([
        leftHeartControls.start({
          scale: [1, 1.1, 1],
          transition: { duration: 0.8, repeat: Infinity, repeatType: "reverse" }
        }),
        rightHeartControls.start({
          scale: [1, 1.1, 1],
          transition: { duration: 0.8, repeat: Infinity, repeatType: "reverse", delay: 0.4 }
        })
      ]);
    };
    
    heartbeat();
  }, [leftHeartControls, rightHeartControls]);
  
  // 丘比特和翅膀动画
  useEffect(() => {
    if (animationStep === 0) {
      // 丘比特出现动画
      cupidControls.start({
        opacity: 1,
        y: [50, 0],
        transition: { duration: 1 }
      });
      
      // 翅膀扇动动画
      wingsControls.start({
        rotateY: [0, 20, 0],
        transition: { duration: 1.5, repeat: Infinity, repeatType: "reverse" }
      });
    }
  }, [animationStep, cupidControls, wingsControls]);
  
  // 生成箭飞行时的粒子效果
  const generateArrowParticles = () => {
    if (!arrowRef.current) return;
    
    // 获取箭的位置
    const arrowRect = arrowRef.current.getBoundingClientRect();
    const arrowX = arrowRect.x + arrowRect.width / 2;
    const arrowY = arrowRect.y + arrowRect.height / 2;
    
    // 创建新粒子
    const newParticle = {
      id: Date.now() + Math.random(),
      x: arrowX,
      y: arrowY,
      color: ['#ffaa00', '#ffcc00', '#ffdd00', '#ffffff'][Math.floor(Math.random() * 4)]
    };
    
    setArrowParticles(prev => [...prev, newParticle]);
    
    // 2秒后移除粒子
    setTimeout(() => {
      setArrowParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 2000);
  };
  
  // 生成心形粒子爆炸效果
  const generateHeartParticles = () => {
    if (!leftHeartRef.current || !rightHeartRef.current) return;
    
    const leftHeartRect = leftHeartRef.current.getBoundingClientRect();
    const rightHeartRect = rightHeartRef.current.getBoundingClientRect();
    
    const centerX = (leftHeartRect.x + rightHeartRect.x + leftHeartRect.width + rightHeartRect.width) / 2;
    const centerY = (leftHeartRect.y + rightHeartRect.y + leftHeartRect.height + rightHeartRect.height) / 2;
    
    const newParticles = [];
    
    // 创建30个粒子
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x: centerX,
        y: centerY,
        color: ['#ff6b6b', '#ff8888', '#ffcccc', '#ffffff'][Math.floor(Math.random() * 4)]
      });
    }
    
    setHeartParticles(newParticles);
    
    // 3秒后移除所有粒子
    setTimeout(() => {
      setHeartParticles([]);
    }, 3000);
  };
  
  // 箭飞行时的粒子效果
  useEffect(() => {
    if (animationStep === 1 && showArrow) {
      const interval = setInterval(generateArrowParticles, 100);
      return () => clearInterval(interval);
    }
  }, [animationStep, showArrow]);
  
  // 点击丘比特后的动画
  const handleCupidClick = async () => {
    if (animationStep !== 0) return;
    
    setAnimationStep(1);
    setShowArrow(true);
    
    // 射箭动画
    await arrowControls.start({
      x: 300,
      transition: { duration: 1.5, ease: "easeOut" }
    });
    
    // 显示闪光效果
    setShowShine(true);
    shineControls.start({
      opacity: [0, 1, 0],
      scale: [0.5, 1.5, 0],
      transition: { duration: 1 }
    });
    
    // 生成心形粒子爆炸效果
    setShowHeartParticles(true);
    generateHeartParticles();
    
    // 心连接动画
    setIsConnected(true);
    await connectionControls.start({
      width: 300,
      opacity: 1,
      boxShadow: ['0 0 5px #ff6b6b', '0 0 20px #ff6b6b', '0 0 5px #ff6b6b'],
      transition: { duration: 1, ease: "easeOut" }
    });
    
    // 心形跳动停止，变为同步跳动
    await Promise.all([
      leftHeartControls.stop(),
      rightHeartControls.stop(),
      leftHeartControls.start({
        scale: [1, 1.2, 1],
        filter: ['drop-shadow(0 0 8px rgba(255, 107, 107, 0.5))', 'drop-shadow(0 0 15px rgba(255, 107, 107, 0.8))', 'drop-shadow(0 0 8px rgba(255, 107, 107, 0.5))'],
        transition: { duration: 0.8, repeat: 3, repeatType: "reverse" }
      }),
      rightHeartControls.start({
        scale: [1, 1.2, 1],
        filter: ['drop-shadow(0 0 8px rgba(255, 107, 107, 0.5))', 'drop-shadow(0 0 15px rgba(255, 107, 107, 0.8))', 'drop-shadow(0 0 8px rgba(255, 107, 107, 0.5))'],
        transition: { duration: 0.8, repeat: 3, repeatType: "reverse" }
      })
    ]);
    
    // 等待一会儿后调用完成回调
    setTimeout(() => {
      onComplete();
    }, 1500);
  };
  
  return (
    <AnimationContainer>
      <LeftHeart 
        ref={leftHeartRef}
        color="#ff6b6b" 
        animate={leftHeartControls}
        initial={{ scale: 1 }}
      />
      
      <RightHeart 
        ref={rightHeartRef}
        color="#ff6b6b" 
        animate={rightHeartControls}
        initial={{ scale: 1 }}
      />
      
      {isConnected && (
        <HeartConnection 
          initial={{ width: 0, opacity: 0 }}
          animate={connectionControls}
          style={{ left: 'calc(50% - 150px)' }}
        />
      )}
      
      {/* 丘比特 */}
      <Cupid 
        initial={{ opacity: 0, y: 50 }}
        animate={cupidControls}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCupidClick}
        style={{ cursor: animationStep === 0 ? 'pointer' : 'default' }}
      >
        <CupidBody>
          <CupidFace>
            <CupidMouth />
          </CupidFace>
        </CupidBody>
        <Wings animate={wingsControls} />
        <Bow />
      </Cupid>
      
      <AnimatePresence>
        {showArrow && (
          <Arrow 
            ref={arrowRef}
            initial={{ x: 0 }}
            animate={arrowControls}
          />
        )}
      </AnimatePresence>
      
      {/* 箭飞行时的粒子 */}
      {arrowParticles.map(particle => (
        <Particle
          key={particle.id}
          color={particle.color}
          style={{ 
            left: particle.x, 
            top: particle.y,
            position: 'fixed' 
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ 
            opacity: 0,
            scale: 0,
            x: Math.random() * 20 - 10,
            y: Math.random() * 20 - 10,
            transition: { duration: 2 } 
          }}
        />
      ))}
      
      {/* 心形连接时的闪光效果 */}
      {showShine && (
        <ShineEffect
          style={{ left: 'calc(50% - 50px)', top: 'calc(50% - 50px)' }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={shineControls}
        />
      )}
      
      {/* 心形粒子爆炸效果 */}
      {showHeartParticles && heartParticles.map(particle => (
        <Particle
          key={particle.id}
          color={particle.color}
          style={{ 
            left: particle.x, 
            top: particle.y,
            position: 'fixed' 
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{ 
            opacity: 0,
            scale: 0,
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            transition: { duration: 3, ease: "easeOut" } 
          }}
        />
      ))}
    </AnimationContainer>
  );
};

export default HeartAnimation; 