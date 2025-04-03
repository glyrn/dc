import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Typewriter from '../components/Typewriter';
import ParticleBackground from '../components/ParticleBackground';

const WelcomeContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #000;
  color: #fff;
  padding: 0 1.5rem;
  position: relative;
  overflow: hidden;
`;

const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(30, 30, 30, 0.8) 0%, rgba(0, 0, 0, 1) 70%);
  z-index: 1;
`;

const ContentWrapper = styled(motion.div)`
  z-index: 2;
  text-align: center;
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(motion.h1)`
  font-size: 64px;
  font-weight: 700;
  margin-bottom: 2rem;
  background: linear-gradient(to right, #f5f5f5, #aaa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.2));
  
  @media (max-width: 768px) {
    font-size: 48px;
  }
  
  @media (max-width: 480px) {
    font-size: 36px;
  }
`;

const SubtitleWrapper = styled(motion.div)`
  margin-bottom: 3rem;
`;

const Subtitle = styled.div`
  font-size: 24px;
  font-weight: 400;
  color: #bbb;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const EnterButton = styled(motion.button)`
  background-color: transparent;
  color: white;
  font-size: 18px;
  font-weight: 500;
  border: 2px solid white;
  border-radius: 50px;
  padding: 15px 40px;
  cursor: pointer;
  margin-top: 20px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.2);
    transition: width 0.5s ease;
    z-index: -1;
  }
  
  &:hover:before {
    width: 100%;
  }
`;

// 闪光效果
const Sparkle = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 0 10px white, 0 0 20px white;
  z-index: 3;
`;

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);
  const [sparkles, setSparkles] = useState<{id: number; x: number; y: number}[]>([]);
  
  // 清除之前保存在localStorage中的访问记录
  useEffect(() => {
    localStorage.removeItem('hasVisited');
  }, []);
  
  // 随机生成闪光效果
  useEffect(() => {
    const interval = setInterval(() => {
      if (sparkles.length >= 20) {
        // 限制最大闪光数量
        setSparkles(prev => prev.slice(1));
      }
      
      // 生成新闪光
      const newSparkle = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
      };
      
      setSparkles(prev => [...prev, newSparkle]);
      
      // 3秒后移除闪光
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
      }, 3000);
    }, 300);
    
    return () => clearInterval(interval);
  }, [sparkles.length]);
  
  const handleTypingComplete = () => {
    setShowButton(true);
  };
  
  const handleEnter = () => {
    // 点击按钮后导航到主页
    navigate('/home');
  };
  
  return (
    <WelcomeContainer>
      <ParticleBackground />
      <BackgroundGradient />
      
      {/* 随机闪光效果 */}
      {sparkles.map(sparkle => (
        <Sparkle
          key={sparkle.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{ duration: 3 }}
          style={{
            left: sparkle.x,
            top: sparkle.y
          }}
        />
      ))}
      
      <ContentWrapper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Title
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          CutCut
        </Title>
        
        <SubtitleWrapper
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Subtitle>
            <Typewriter 
              text="这是一个专属于我们的空间，记录每一个珍贵瞬间" 
              delay={100}
              onComplete={handleTypingComplete}
            />
          </Subtitle>
        </SubtitleWrapper>
        
        {showButton && (
          <EnterButton
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: [
                "0 0 0 rgba(255, 255, 255, 0)",
                "0 0 20px rgba(255, 255, 255, 0.5)",
                "0 0 10px rgba(255, 255, 255, 0.3)"
              ]
            }}
            transition={{ 
              duration: 0.8,
              boxShadow: { duration: 2, repeat: Infinity, repeatType: "reverse" }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnter}
          >
            进入网站
          </EnterButton>
        )}
      </ContentWrapper>
    </WelcomeContainer>
  );
};

export default Welcome; 