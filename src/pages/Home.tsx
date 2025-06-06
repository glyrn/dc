import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import Typewriter from '../components/Typewriter';
import Gallery from './Gallery';

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
  margin-bottom: 2.5rem;
  
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

// 包装Gallery组件的容器
const GallerySection = styled.section`
  padding-top: 40px;
  background-color: var(--primary-color);
`;

const Home: React.FC = () => {
  const controls = useAnimation();
  const gallerySectionRef = useRef<HTMLElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const hasScrolled = useRef(false);
  const [isInGallery, setIsInGallery] = useState(false);

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  // 检查当前是否在相册区域
  useEffect(() => {
    const checkScrollPosition = () => {
      if (!gallerySectionRef.current) return;
      
      const galleryTop = gallerySectionRef.current.getBoundingClientRect().top;
      // 如果相册区域的顶部在视窗内或以上，认为用户在相册区域
      setIsInGallery(galleryTop <= window.innerHeight / 2);
    };

    // 初始检查
    checkScrollPosition();
    
    // 监听滚动事件
    window.addEventListener('scroll', checkScrollPosition);
    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, []);

  // 添加滚轮事件监听器
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // 防止连续触发
      if (hasScrolled.current) return;
      
      if (e.deltaY > 0 && !isInGallery) {
        // 向下滚动且在首页区域
        e.preventDefault();
        scrollToNextSection();
        hasScrolled.current = true;
      } else if (e.deltaY < 0 && isInGallery) {
        // 向上滚动且在相册区域
        e.preventDefault();
        scrollToTop();
        hasScrolled.current = true;
      }
      
      // 2秒后重置标记，允许再次触发
      if (hasScrolled.current) {
        setTimeout(() => {
          hasScrolled.current = false;
        }, 2000);
      }
    };

    // 添加触摸滑动事件
    let touchStartY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (hasScrolled.current) return;
      
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      
      if (deltaY > 50 && !isInGallery) {
        // 向下滑动且在首页区域
        e.preventDefault();
        scrollToNextSection();
        hasScrolled.current = true;
      } else if (deltaY < -50 && isInGallery) {
        // 向上滑动且在相册区域
        e.preventDefault();
        scrollToTop();
        hasScrolled.current = true;
      }
      
      // 2秒后重置标记，允许再次触发
      if (hasScrolled.current) {
        setTimeout(() => {
          hasScrolled.current = false;
        }, 2000);
      }
    };

    // 注册事件监听器
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // 清理函数
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isInGallery]);

  // 滚动到相册部分
  const scrollToNextSection = () => {
    if (gallerySectionRef.current) {
      gallerySectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // 滚动到页面顶部
  const scrollToTop = () => {
    if (heroSectionRef.current) {
      heroSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HomeContainer>
      {/* 英雄区 - 只有一句话 */}
      <HeroSection ref={heroSectionRef}>
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
            <Typewriter text="珍藏每一个难忘瞬间" delay={150} />
          </HeroSubtitle>
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
      
      {/* 嵌入相册页面 */}
      <GallerySection ref={gallerySectionRef}>
        <Gallery />
      </GallerySection>
    </HomeContainer>
  );
};

export default Home; 