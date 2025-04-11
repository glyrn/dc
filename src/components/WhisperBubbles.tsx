import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Whisper, formatWhisperTime } from '../services/whisperService';

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
  min-height: 500px;
  width: 100%;
  margin: 20px 0;
  overflow: hidden;
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
  left: ${props => props.$left}%;
  top: ${props => props.$top}px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  z-index: ${props => Math.floor(props.$left % 3)};
  
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
const BubbleIcon = styled.div`
  font-size: 1.6rem;
  margin-bottom: 8px;
  text-align: center;
`;

// 时间显示
const TimeLabel = styled.div`
  font-size: 0.7rem;
  color: rgba(0, 0, 0, 0.5);
  text-align: center;
  font-weight: 500;
`;

// 分页按钮
const PaginationButton = styled.button`
  background: white;
  border: none;
  border-radius: 30px;
  padding: 8px 16px;
  margin: 10px 5px;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #666;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8f8f8;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
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
`;

// 消息时间
const MessageTime = styled.div`
  font-size: 0.9rem;
  color: #888;
  text-align: right;
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

// 随机选择气泡图标
const getRandomIcon = (): string => {
  const icons = ['💭', '✨', '🧩', '🎐', '🌈', '🍬', '🫧', '🎨'];
  return icons[Math.floor(Math.random() * icons.length)];
};

// 生成随机大小
const getRandomSize = (): number => {
  // 范围：80px - 120px
  return Math.floor(Math.random() * 40) + 80;
};

// 检测两个气泡是否重叠
const isOverlapping = (
  bubble1: { left: number; top: number; size: number },
  bubble2: { left: number; top: number; size: number },
  containerWidth: number
) => {
  // 将百分比转换为像素
  const left1 = (bubble1.left / 100) * containerWidth;
  const left2 = (bubble2.left / 100) * containerWidth;
  
  // 计算两个气泡中心点之间的距离
  const dx = left1 - left2;
  const dy = bubble1.top - bubble2.top;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // 计算两个气泡半径之和（一个简单的近似值）
  const minDistance = (bubble1.size + bubble2.size) / 2;
  
  // 如果距离小于半径之和，则认为重叠
  return distance < minDistance;
};

// 生成不重叠的气泡位置
const generateNonOverlappingPositions = (
  count: number, 
  containerWidth: number, 
  containerHeight: number
): Array<{left: number; top: number; size: number}> => {
  const positions: Array<{left: number; top: number; size: number}> = [];
  const maxAttempts = 50; // 最大尝试次数
  
  for (let i = 0; i < count; i++) {
    let newBubble = {
      left: Math.random() * 80, // 0-80%
      top: Math.random() * (containerHeight - 150), // 避免超出底部
      size: getRandomSize()
    };
    
    let attempts = 0;
    let overlapping = false;
    
    // 检查是否与现有的气泡重叠
    do {
      overlapping = false;
      
      for (const existingBubble of positions) {
        if (isOverlapping(newBubble, existingBubble, containerWidth)) {
          overlapping = true;
          // 生成新的随机位置
          newBubble = {
            left: Math.random() * 80,
            top: Math.random() * (containerHeight - 150),
            size: getRandomSize()
          };
          break;
        }
      }
      
      attempts++;
    } while (overlapping && attempts < maxAttempts);
    
    // 如果尝试多次仍然不行，可能屏幕空间不足，就减小气泡尺寸再试一次
    if (overlapping && attempts >= maxAttempts) {
      newBubble.size = 60; // 较小的尺寸
      
      for (let j = 0; j < 20; j++) {
        newBubble.left = Math.random() * 80;
        newBubble.top = Math.random() * (containerHeight - 150);
        
        let stillOverlapping = false;
        for (const existingBubble of positions) {
          if (isOverlapping(newBubble, existingBubble, containerWidth)) {
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
    
    // 即使多次尝试后仍然重叠，也添加这个气泡（但保持小尺寸）
    positions.push(newBubble);
  }
  
  return positions;
};

// 确定每页显示的气泡数量
const BUBBLES_PER_PAGE = 6; // 可以根据屏幕大小调整

interface WhisperBubblesProps {
  whispers: Whisper[];
}

const WhisperBubbles: React.FC<WhisperBubblesProps> = ({ whispers }) => {
  const [selectedWhisper, setSelectedWhisper] = useState<Whisper | null>(null);
  const [bubblePositions, setBubblePositions] = useState<Array<{
    left: number;
    top: number;
    size: number;
  }>>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 分页处理后的气泡列表
  const paginatedWhispers = React.useMemo(() => {
    const startIndex = currentPage * BUBBLES_PER_PAGE;
    return whispers.slice(startIndex, startIndex + BUBBLES_PER_PAGE);
  }, [whispers, currentPage]);
  
  // 总页数
  const totalPages = Math.ceil(whispers.length / BUBBLES_PER_PAGE);
  
  // 初始化气泡位置
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = 500; // 容器高度
      
      const positions = generateNonOverlappingPositions(
        paginatedWhispers.length,
        containerWidth,
        containerHeight
      );
      
      setBubblePositions(positions);
    }
  }, [paginatedWhispers]);
  
  // 点击气泡，显示完整内容
  const handleBubbleClick = (whisper: Whisper) => {
    setSelectedWhisper(whisper);
  };
  
  // 关闭消息弹窗
  const closeModal = () => {
    setSelectedWhisper(null);
  };
  
  // 页面导航
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  return (
    <>
      <BubblesContainer ref={containerRef}>
        {paginatedWhispers.map((whisper, index) => {
          // 为每个悄悄话生成随机渐变色和图标
          const gradient = getRandomGradient();
          const icon = getRandomIcon();
          
          // 获取位置信息
          const position = bubblePositions[index] || {
            left: 0,
            top: 0,
            size: 100
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
              <BubbleIcon>{icon}</BubbleIcon>
              <TimeLabel>{formatWhisperTime(whisper.timestamp)}</TimeLabel>
            </Bubble>
          );
        })}
      </BubblesContainer>
      
      {/* 分页控制 */}
      {totalPages > 1 && (
        <PaginationContainer>
          <PaginationButton 
            onClick={goToPrevPage} 
            disabled={currentPage === 0}
          >
            上一页
          </PaginationButton>
          <span style={{ margin: '0 10px', lineHeight: '36px', color: '#666' }}>
            {currentPage + 1} / {totalPages}
          </span>
          <PaginationButton 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages - 1}
          >
            下一页
          </PaginationButton>
        </PaginationContainer>
      )}
      
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