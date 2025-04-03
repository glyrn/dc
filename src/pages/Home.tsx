import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import PhotoGrid from '../components/PhotoGrid';
import { Link } from 'react-router-dom';

const HomeContainer = styled.div`
  overflow-x: hidden;
`;

const HeroSection = styled.section`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-color);
  padding: 0 1.5rem;
`;

const HeroContent = styled.div`
  max-width: 980px;
  text-align: center;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 56px;
  line-height: 1.07143;
  font-weight: 600;
  letter-spacing: -0.005em;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 40px;
  }
  
  @media (max-width: 480px) {
    font-size: 32px;
  }
`;

const HeroSubtitle = styled(motion.h2)`
  font-size: 28px;
  line-height: 1.1;
  font-weight: 400;
  color: var(--gray-text);
  letter-spacing: -0.003em;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
  
  @media (max-width: 480px) {
    font-size: 19px;
  }
`;

const ActionButton = styled(motion.button)`
  background-color: var(--accent-color);
  color: white;
  font-size: 17px;
  line-height: 1.17648;
  font-weight: 400;
  border-radius: 980px;
  padding: 12px 22px;
  margin-top: 0.8rem;
  margin-right: 20px;
  cursor: pointer;
  
  &:hover {
    background-color: #0077ed;
  }
`;

const ActionLink = styled(Link)`
  color: var(--accent-color);
  font-size: 17px;
  line-height: 1.23536;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Section = styled.section`
  padding: 100px 0;
  background-color: var(--primary-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 70px 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 48px;
  line-height: 1.08349;
  font-weight: 600;
  letter-spacing: -0.003em;
  text-align: center;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const SectionSubtitle = styled.h3`
  font-size: 24px;
  line-height: 1.16667;
  font-weight: 400;
  letter-spacing: 0.009em;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--gray-text);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    font-size: 19px;
  }
`;

const ChevronDown = styled(motion.div)`
  position: absolute;
  bottom: 40px;
  width: 30px;
  height: 20px;
  cursor: pointer;
  
  &:before, &:after {
    content: '';
    position: absolute;
    top: 0;
    height: 2px;
    width: 15px;
    background-color: var(--secondary-color);
  }
  
  &:before {
    left: 0;
    transform: rotate(45deg);
  }
  
  &:after {
    right: 0;
    transform: rotate(-45deg);
  }
`;

const Home: React.FC = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  const scrollToNextSection = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <HomeContainer>
      {/* 英雄区 - 只有一句话 */}
      <HeroSection>
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            见证我们的每一刻
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            珍藏每一个难忘瞬间
          </HeroSubtitle>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/upload">
              <ActionButton
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                上传照片
              </ActionButton>
            </Link>
            <ActionLink to="/gallery">浏览照片相册 {'>'}</ActionLink>
          </motion.div>
        </HeroContent>
        <ChevronDown
          onClick={scrollToNextSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { duration: 0.8, delay: 1 },
            y: { repeat: Infinity, duration: 1.5 } 
          }}
        />
      </HeroSection>
      
      {/* 照片网格区域 */}
      <Section>
        <SectionTitle>我们的照片墙</SectionTitle>
        <SectionSubtitle>
          用影像定格每一刻，记录爱的故事
        </SectionSubtitle>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ width: '100%' }}
        >
          <PhotoGrid />
        </motion.div>
      </Section>
    </HomeContainer>
  );
};

export default Home; 