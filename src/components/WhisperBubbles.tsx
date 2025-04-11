import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Whisper, formatWhisperTime } from '../services/whisperService';

// 泡泡容器
const BubblesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 20px 0;
`;

// 单个泡泡
const Bubble = styled(motion.div)<{ $size: number; $color: string }>`
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border-radius: 50%;
  background-color: ${props => props.$color};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

// 泡泡内部的小图标
const BubbleIcon = styled.div`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
`;

// 消息弹窗背景
const MessageModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

// 消息弹窗内容
const MessageModalContent = styled(motion.div)`
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  max-width: 90%;
  width: 400px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  position: relative;
`;

// 消息内容
const MessageText = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 15px;
  white-space: pre-wrap;
  word-break: break-word;
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

// 随机生成泡泡颜色
const getBubbleColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0',
    '#118AB2', '#073B4C', '#EF476F', '#F78C6B',
    '#7209B7', '#560BAD', '#480CA8', '#3A0CA3',
    '#3F37C9', '#4361EE', '#4895EF', '#4CC9F0'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// 随机生成泡泡大小
const getBubbleSize = (): number => {
  // 范围: 40px - 70px
  return Math.floor(Math.random() * 31) + 40;
};

interface WhisperBubblesProps {
  whispers: Whisper[];
}

const WhisperBubbles: React.FC<WhisperBubblesProps> = ({ whispers }) => {
  const [selectedWhisper, setSelectedWhisper] = useState<Whisper | null>(null);
  
  // 点击泡泡，显示消息
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
        {whispers.map(whisper => {
          // 对每个悄悄话，生成一个随机颜色和大小
          const color = getBubbleColor();
          const size = getBubbleSize();
          
          return (
            <Bubble
              key={whisper.id}
              $size={size}
              $color={color}
              onClick={() => handleBubbleClick(whisper)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <BubbleIcon>💭</BubbleIcon>
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