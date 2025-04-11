import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Whisper, formatWhisperTime, deleteWhisper } from '../services/whisperService';

// 浮动动画
const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

// 轻微水平飘动
const drift = keyframes`
  0% {
    transform: translateX(0px);
  }
  50% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0px);
  }
`;

// 气泡容器 - 改为相对定位，并提供足够空间
const BubblesContainer = styled.div`
  position: relative;
  min-height: 400px;
  width: 100%;
  margin: 20px 0;
  overflow: hidden;
  
  @media (max-width: 768px) {
    min-height: 350px;
  }
`;

// 手绘风泡泡 - 使用绝对定位实现自由漂浮
const Bubble = styled(motion.div)<{ 
  $gradient: string; 
  $left: number; 
  $top: number;
  $size: number;
}>`
  background: ${props => props.$gradient};
  border-radius: 40px 60px 55px 45px / 50px 40px 60px 45px;
  padding: 18px 22px;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: absolute;
  left: ${props => props.$left}px;
  top: ${props => props.$top}px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  z-index: ${props => Math.floor(props.$left % 3)};
  
  @media (max-width: 768px) {
    padding: 12px 16px;
  }
  
  &:nth-child(3n) {
    animation: ${float} 4s ease-in-out infinite;
  }
  
  &:nth-child(3n+1) {
    animation: ${float} 5s ease-in-out infinite;
    animation-delay: 0.5s;
  }
  
  &:nth-child(3n+2) {
    animation: ${drift} 6s ease-in-out infinite;
    animation-delay: 1s;
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }
`;

// 气泡图标
const BubbleIcon = styled.div<{ $size: number }>`
  font-size: ${props => props.$size <= 70 ? '1.2rem' : '1.6rem'};
  margin-bottom: 8px;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: ${props => props.$size <= 70 ? '1rem' : '1.4rem'};
    margin-bottom: 4px;
  }
`;

// 时间显示
const TimeLabel = styled.div<{ $size: number }>`
  font-size: ${props => props.$size <= 70 ? '0.6rem' : '0.7rem'};
  color: rgba(0, 0, 0, 0.5);
  text-align: center;
  font-weight: 500;
  
  @media (max-width: 768px) {
    font-size: ${props => props.$size <= 70 ? '0.5rem' : '0.6rem'};
  }
`;

// 消息弹窗背景
const MessageModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

// 消息弹窗内容
const MessageModalContent = styled(motion.div)`
  background-color: white;
  border-radius: 18px;
  padding: 30px;
  max-width: 90%;
  width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  position: relative;
  
  @media (max-width: 768px) {
    padding: 20px;
    width: 85%;
  }
`;

// 消息内容
const MessageText = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 15px;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'Courier New', monospace;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
  }
`;

// 消息时间
const MessageTime = styled.div`
  font-size: 0.9rem;
  color: #888;
  text-align: right;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

// 关闭按钮
const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  
  &:hover {
    color: #333;
  }
`;

// 生成随机渐变色
const getRandomGradient = (): string => {
  const gradients = [
    'linear-gradient(135deg, #f3d5e0, #d7f1ed)', // 浅粉+薄荷绿
    'linear-gradient(135deg, #e0f2fe, #fef9c3)', // 雾蓝+奶白
    'linear-gradient(135deg, #ddd6fe, #fae8ff)', // 薰衣草紫+浅粉
    'linear-gradient(135deg, #d8f3dc, #bee1e6)', // 薄荷绿+浅蓝
    'linear-gradient(135deg, #ffefeb, #f0e4ff)', // 浅橘+薰衣草
    'linear-gradient(135deg, #e2f0cb, #ffdde1)', // 嫩绿+浅粉
    'linear-gradient(135deg, #dbecf4, #f0e2e7)', // 天蓝+浅粉
    'linear-gradient(135deg, #f8e1ee, #e7f9f9)' // 粉红+薄荷
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

// 随机选择气泡图标 - 使用更兼容的表情符号
const getRandomIcon = (): string => {
  // 使用更基础、广泛支持的表情符号
  const icons = ['💬', '🌟', '❤️', '🎵', '🎨', '🌈', '🎁', '🔔'];
  return icons[Math.floor(Math.random() * icons.length)];
};

// 生成随机大小 - 考虑移动设备
const getRandomSize = (isMobile: boolean): number => {
  if (isMobile) {
    // 移动端范围：60px - 90px
    return Math.floor(Math.random() * 30) + 60;
  } else {
    // 桌面端范围：80px - 120px
    return Math.floor(Math.random() * 40) + 80;
  }
};

// 检测两个气泡是否重叠
const isOverlapping = (
  bubble1: { left: number; top: number; size: number },
  bubble2: { left: number; top: number; size: number }
) => {
  // 直接使用像素计算距离
  const dx = bubble1.left - bubble2.left;
  const dy = bubble1.top - bubble2.top;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // 计算两个气泡半径之和
  const minDistance = (bubble1.size + bubble2.size) / 2 * 0.9;
  
  // 如果距离小于半径之和，则认为重叠
  return distance < minDistance;
};

// 检测设备是否为移动设备
const isMobileDevice = (): boolean => {
  return window.innerWidth <= 768;
};

// 计算屏幕空间可以放下多少个气泡（自动适应）
const calculateMaxBubbles = (
  containerWidth: number,
  containerHeight: number,
  whispers: Whisper[]
): {positions: Array<{left: number; top: number; size: number}>, count: number} => {
  const positions: Array<{left: number; top: number; size: number}> = [];
  let count = 0;
  const maxAttempts = 50; // 最大尝试次数
  const isMobile = isMobileDevice();
  
  // 移动设备和桌面设备的布局参数差异
  const layoutParams = {
    paddingLeft: 20, // 左边距，单位像素
    paddingRight: 20, // 右边距，单位像素
    paddingTop: 20, // 上边距，单位像素
    paddingBottom: isMobile ? 100 : 150, // 下边距，单位像素
    minSize: isMobile ? 50 : 60, // 移动设备最小气泡尺寸
    maxInitialBubbles: isMobile ? 8 : 12, // 移动设备初始显示更少的气泡
  };
  
  // 限制尝试的气泡数量，避免移动设备过度拥挤
  const maxBubblesToTry = Math.min(whispers.length, layoutParams.maxInitialBubbles);
  
  // 可用空间
  const usableWidth = containerWidth - layoutParams.paddingLeft - layoutParams.paddingRight;
  const usableHeight = containerHeight - layoutParams.paddingTop - layoutParams.paddingBottom;
  
  // 尝试添加气泡，直到无法再添加为止
  for (let i = 0; i < maxBubblesToTry; i++) {
    // 生成气泡尺寸
    const bubbleSize = getRandomSize(isMobile);
    
    // 确保气泡完全在可用区域内
    const maxLeftPosition = usableWidth - bubbleSize;
    const maxTopPosition = usableHeight - bubbleSize;
    
    // 如果可用空间不足，退出循环
    if (maxLeftPosition <= 0 || maxTopPosition <= 0) {
      break;
    }
    
    let newBubble = {
      left: layoutParams.paddingLeft + Math.random() * maxLeftPosition,
      top: layoutParams.paddingTop + Math.random() * maxTopPosition,
      size: bubbleSize
    };
    
    let attempts = 0;
    let overlapping = false;
    
    // 检查是否与现有的气泡重叠
    do {
      overlapping = false;
      
      for (const existingBubble of positions) {
        if (isOverlapping(newBubble, existingBubble)) {
          overlapping = true;
          // 生成新的随机位置，但保持在安全边界内
          newBubble = {
            left: layoutParams.paddingLeft + Math.random() * maxLeftPosition,
            top: layoutParams.paddingTop + Math.random() * maxTopPosition,
            size: getRandomSize(isMobile)
          };
          break;
        }
      }
      
      attempts++;
    } while (overlapping && attempts < maxAttempts);
    
    // 如果尝试多次仍然不行，可能屏幕空间不足，就减小气泡尺寸再试一次
    if (overlapping && attempts >= maxAttempts) {
      const smallSize = layoutParams.minSize;
      
      // 重新计算小尺寸气泡的可用空间
      const smallMaxLeftPosition = usableWidth - smallSize;
      const smallMaxTopPosition = usableHeight - smallSize;
      
      newBubble.size = smallSize;
      
      for (let j = 0; j < 20; j++) {
        newBubble.left = layoutParams.paddingLeft + Math.random() * smallMaxLeftPosition;
        newBubble.top = layoutParams.paddingTop + Math.random() * smallMaxTopPosition;
        
        let stillOverlapping = false;
        for (const existingBubble of positions) {
          if (isOverlapping(newBubble, existingBubble)) {
            stillOverlapping = true;
            break;
          }
        }
        
        if (!stillOverlapping) {
          overlapping = false;
          break;
        }
      }
    }
    
    // 如果经过多次尝试后还是重叠，表示空间不足
    if (overlapping && attempts >= maxAttempts) {
      break; // 无法再添加更多气泡
    }
    
    // 添加这个气泡
    positions.push(newBubble);
    count++;
  }
  
  return { positions, count };
};

interface WhisperBubblesProps {
  whispers: Whisper[];
  onWhisperDeleted?: (whisperId: string) => void;
}

const WhisperBubbles: React.FC<WhisperBubblesProps> = ({ whispers, onWhisperDeleted }) => {
  const [selectedWhisper, setSelectedWhisper] = useState<Whisper | null>(null);
  const [bubblePositions, setBubblePositions] = useState<Array<{
    left: number;
    top: number;
    size: number;
  }>>([]);
  const [visibleWhispers, setVisibleWhispers] = useState<Whisper[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // 检测移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // 初始化气泡位置，根据容器大小自动计算能显示的气泡数量
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = isMobile ? 350 : 500; // 根据设备类型调整容器高度
      
      const result = calculateMaxBubbles(containerWidth, containerHeight, whispers);
      setBubblePositions(result.positions);
      setVisibleWhispers(whispers.slice(0, result.count));
    }
  }, [whispers, isMobile]);
  
  // 窗口大小变化时重新计算
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = isMobile ? 350 : 500;
        
        const result = calculateMaxBubbles(containerWidth, containerHeight, whispers);
        setBubblePositions(result.positions);
        setVisibleWhispers(whispers.slice(0, result.count));
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [whispers, isMobile]);
  
  // 防止截断的调试信息
  useEffect(() => {
    // 检查气泡是否有任何部分超出容器
    if (containerRef.current && bubblePositions.length > 0) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      
      bubblePositions.forEach(position => {
        const rightEdge = position.left + position.size;
        const bottomEdge = position.top + position.size;
        
        if (rightEdge > containerWidth || bottomEdge > containerHeight) {
          console.warn('气泡可能超出容器边界:', position);
        }
      });
    }
  }, [bubblePositions]);
  
  // 点击气泡，显示完整内容
  const handleBubbleClick = (whisper: Whisper) => {
    setSelectedWhisper(whisper);
  };
  
  // 关闭消息弹窗并删除悄悄话
  const closeModal = async () => {
    if (selectedWhisper && !isDeleting) {
      try {
        setIsDeleting(true);
        
        // 删除悄悄话
        await deleteWhisper(selectedWhisper.id);
        
        // 通知父组件删除成功
        if (onWhisperDeleted) {
          onWhisperDeleted(selectedWhisper.id);
        }
        
        // 从本地状态移除该悄悄话
        setVisibleWhispers(prev => prev.filter(w => w.id !== selectedWhisper.id));
        
        // 关闭弹窗
        setSelectedWhisper(null);
      } catch (error) {
        console.error('删除悄悄话失败:', error);
        // 即使删除失败，也关闭弹窗
        setSelectedWhisper(null);
      } finally {
        setIsDeleting(false);
      }
    } else {
      setSelectedWhisper(null);
    }
  };
  
  return (
    <>
      <BubblesContainer ref={containerRef}>
        {visibleWhispers.map((whisper, index) => {
          // 为每个悄悄话生成随机渐变色和图标
          const gradient = getRandomGradient();
          const icon = getRandomIcon();
          
          // 获取位置信息
          const position = bubblePositions[index] || {
            left: 20,
            top: 20,
            size: isMobile ? 70 : 100
          };
          
          return (
            <Bubble
              key={whisper.id}
              $gradient={gradient}
              $left={position.left}
              $top={position.top}
              $size={position.size}
              onClick={() => handleBubbleClick(whisper)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <BubbleIcon $size={position.size}>{icon}</BubbleIcon>
              <TimeLabel $size={position.size}>{formatWhisperTime(whisper.timestamp)}</TimeLabel>
            </Bubble>
          );
        })}
      </BubblesContainer>
      
      {/* 消息弹窗 */}
      <AnimatePresence>
        {selectedWhisper && (
          <MessageModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <MessageModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <CloseButton onClick={closeModal}>&times;</CloseButton>
              <MessageText>{selectedWhisper.message}</MessageText>
              <MessageTime>{formatWhisperTime(selectedWhisper.timestamp)}</MessageTime>
            </MessageModalContent>
          </MessageModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhisperBubbles; 