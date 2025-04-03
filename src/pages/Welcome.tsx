import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Typewriter from '../components/Typewriter';

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
`;

const Title = styled(motion.h1)`
  font-size: 64px;
  font-weight: 700;
  margin-bottom: 2rem;
  background: linear-gradient(to right, #f5f5f5, #aaa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 48px;
  }
  
  @media (max-width: 480px) {
    font-size: 36px;
  }
`;

const Subtitle = styled(motion.div)`
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 3rem;
  color: #bbb;
  
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
  transition: all 0.3s ease;
  
  &:hover {
    background-color: white;
    color: black;
  }
`;

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  
  // 清除之前保存在localStorage中的访问记录
  useEffect(() => {
    localStorage.removeItem('hasVisited');
  }, []);
  
  const handleEnter = () => {
    // 直接导航到主页，不记录访问状态
    navigate('/home');
  };
  
  return (
    <WelcomeContainer>
      <BackgroundGradient />
      <ContentWrapper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Title>CutCut</Title>
        <Subtitle>
          <Typewriter 
            text="这是一个专属于我们的空间，记录每一个珍贵瞬间" 
            delay={100} 
          />
        </Subtitle>
        <EnterButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEnter}
        >
          进入网站
        </EnterButton>
      </ContentWrapper>
    </WelcomeContainer>
  );
};

export default Welcome; 