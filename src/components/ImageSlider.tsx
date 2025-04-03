import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// 示例图片数据
const slides = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: '我们的第一张照片',
    location: '北京',
    date: '2023-01-15'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1543175-8b70880b7933?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: '海边日落',
    location: '青岛',
    date: '2023-05-20'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1624264801339-6a1db81629a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: '郊外野餐',
    location: '苏州',
    date: '2023-08-10'
  }
];

const SliderContainer = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const Slide = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.5) 100%
    );
  }
`;

const SlideContent = styled(motion.div)`
  position: absolute;
  bottom: 15%;
  left: 10%;
  color: var(--light-text);
  z-index: 10;
  max-width: 600px;
  
  @media (max-width: 768px) {
    bottom: 20%;
    left: 5%;
    max-width: 90%;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 300;
  margin-bottom: 1rem;
  font-family: var(--font-sans);
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Caption = styled.p`
  font-size: 1.2rem;
  font-weight: 300;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  font-family: var(--font-family);
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const Location = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 0.5rem;
`;

const Date = styled.div`
  font-size: 1rem;
  opacity: 0.8;
`;

const ArrowButton = styled.button<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'left' ? 'left: 30px;' : 'right: 30px;'}
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 20;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    ${props => props.direction === 'left' ? 'left: 10px;' : 'right: 10px;'}
  }
`;

const Dots = styled.div`
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 20;
`;

const Dot = styled.div<{ active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  transition: all 0.3s ease;
  cursor: pointer;
`;

const ImageSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  const nextSlide = useCallback(() => {
    setCurrent(prev => prev === length - 1 ? 0 : prev + 1);
  }, [length]);

  const prevSlide = useCallback(() => {
    setCurrent(prev => prev === 0 ? length - 1 : prev - 1);
  }, [length]);

  const goToSlide = (index: number) => {
    setCurrent(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    
    return () => clearInterval(interval);
  }, [nextSlide]);

  const slideVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0
      };
    },
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0
      };
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.6
      }
    }
  };

  return (
    <SliderContainer>
      <AnimatePresence initial={false} custom={1}>
        <Slide
          key={current}
          variants={slideVariants}
          custom={1}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'tween', duration: 0.8 }}
          style={{ backgroundImage: `url(${slides[current].url})` }}
        >
          <SlideContent
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <Title>{slides[current].title}</Title>
            <Caption>记录美好的每一刻</Caption>
            <Location>{slides[current].location}</Location>
            <Date>{slides[current].date}</Date>
          </SlideContent>
        </Slide>
      </AnimatePresence>
      
      <ArrowButton direction="left" onClick={prevSlide}>
        &larr;
      </ArrowButton>
      <ArrowButton direction="right" onClick={nextSlide}>
        &rarr;
      </ArrowButton>
      
      <Dots>
        {slides.map((_, index) => (
          <Dot 
            key={index} 
            active={current === index} 
            onClick={() => goToSlide(index)} 
          />
        ))}
      </Dots>
    </SliderContainer>
  );
};

export default ImageSlider; 