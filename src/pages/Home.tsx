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
  const lastScrollDirection = useRef<'up' | 'down' | null>(null);
  const [isInGallery, setIsInGallery] = useState(false);

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  // 更精确地检查当前是否在相册区域
  useEffect(() => {
    const checkScrollPosition = () => {
      if (!gallerySectionRef.current) return;
      
      const galleryRect = gallerySectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // 如果相册区域占据了大部分视口，则认为用户在相册区域
      // 这里使用30%作为阈值，可以根据实际需要调整
      const galleryVisibleRatio = 
        (Math.min(galleryRect.bottom, viewportHeight) - 
         Math.max(galleryRect.top, 0)) / viewportHeight;
      
      setIsInGallery(galleryVisibleRatio > 0.3);
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
    let scrollTimeout: NodeJS.Timeout | null = null;
    let isScrolling = false;
    
    const handleWheel = (e: WheelEvent) => {
      // 如果已经在进行滚动动画，则忽略新的滚动事件
      if (isScrolling) return;
      
      if (e.deltaY > 10 && !isInGallery) {
        // 向下滚动且在首页区域
        e.preventDefault();
        lastScrollDirection.current = 'down';
        isScrolling = true;
        scrollToNextSection();
        
        // 较短的动画完成等待时间
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
        }, 1200);
        
      } else if (e.deltaY < -10 && isInGallery) {
        // 向上滚动且在相册区域
        e.preventDefault();
        lastScrollDirection.current = 'up';
        isScrolling = true;
        scrollToTop();
        
        // 较短的动画完成等待时间
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
        }, 1200);
      }
    };

    // 添加触摸滑动事件
    let touchStartY = 0;
    let touchStartTime = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (isScrolling) return;
      
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      const touchTime = Date.now() - touchStartTime;
      
      // 计算滑动速度
      const velocity = Math.abs(deltaY) / touchTime;
      
      // 快速滑动或距离足够时触发
      const quickSwipe = velocity > 0.5 && Math.abs(deltaY) > 20;
      const longSwipe = Math.abs(deltaY) > 40;
      
      if ((quickSwipe || longSwipe) && deltaY > 0 && !isInGallery) {
        // 向下滑动且在首页区域
        e.preventDefault();
        lastScrollDirection.current = 'down';
        isScrolling = true;
        scrollToNextSection();
        
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
        }, 1200);
        
      } else if ((quickSwipe || longSwipe) && deltaY < 0 && isInGallery) {
        // 向上滑动且在相册区域
        e.preventDefault();
        lastScrollDirection.current = 'up';
        isScrolling = true;
        scrollToTop();
        
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
        }, 1200);
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
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [isInGallery]);

  // 滚动到相册部分
  const scrollToNextSection = () => {
    if (gallerySectionRef.current) {
      gallerySectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  // 滚动到页面顶部
  const scrollToTop = () => {
    if (heroSectionRef.current) {
      heroSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
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