import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// 从左侧滑入，向右侧淡出的动画
const slideIn = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(20px);
    opacity: 0;
  }
`;

const TipContainer = styled.div`
  text-align: center;
  margin-top: 20px;
  font-size: 0.9rem;
  color: #999;
  padding: 0 20px;
  min-height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Tip = styled(motion.div)`
  position: absolute;
`;

interface TipsCarouselProps {
  tips: string[];
  interval?: number; // 切换间隔，单位：毫秒
}

const TipsCarousel: React.FC<TipsCarouselProps> = ({ tips, interval = 2000 }) => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (tips.length <= 1) return;

    // 创建循环显示提示的定时器
    const timer = setInterval(() => {
      // 淡出动画
      setIsVisible(false);
      
      // 等待淡出完成后切换到下一条提示
      setTimeout(() => {
        setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
        setIsVisible(true);
      }, 300); // 300ms 是动画过渡时间
      
    }, interval);

    return () => clearInterval(timer);
  }, [tips, interval]);

  if (tips.length === 0) return null;

  return (
    <TipContainer>
      <AnimatePresence mode="wait">
        {isVisible && (
          <Tip
            key={currentTipIndex}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {tips[currentTipIndex]}
          </Tip>
        )}
      </AnimatePresence>
    </TipContainer>
  );
};

export default TipsCarousel; 