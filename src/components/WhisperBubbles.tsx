import React, { useState } from 'react';
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

// 气泡容器
const BubblesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 20px 0;
  justify-content: flex-start;
`;

// 手绘风泡泡
const Bubble = styled(motion.div)<{ $gradient: string }>`
  background: ${props => props.$gradient};
  border-radius: 40px 60px 55px 45px / 50px 40px 60px 45px;
  padding: 18px 22px;
  width: fit-content;
  cursor: pointer;
  position: relative;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  animation: ${float} 4s ease-in-out infinite;
  
  &:nth-child(even) {
    animation: ${float} 5s ease-in-out infinite;
    animation-delay: 0.5s;
  }
  
  &:nth-child(3n) {
    animation: ${drift} 6s ease-in-out infinite;
    animation-delay: 1s;
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
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

interface WhisperBubblesProps {
  whispers: Whisper[];
}

const WhisperBubbles: React.FC<WhisperBubblesProps> = ({ whispers }) => {
  const [selectedWhisper, setSelectedWhisper] = useState<Whisper | null>(null);
  
  // 点击气泡，显示完整内容
  const handleBubbleClick = (whisper: Whisper) => {
    setSelectedWhisper(whisper);
  };
  
  // 关闭消息弹窗
  const closeModal = () => {
    setSelectedWhisper(null);
  };
  
  return (
    <>
      <BubblesContainer>
        {whispers.map((whisper) => {
          // 为每个悄悄话生成随机渐变色和图标
          const gradient = getRandomGradient();
          const icon = getRandomIcon();
          
          return (
            <Bubble
              key={whisper.id}
              $gradient={gradient}
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