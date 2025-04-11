import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// 定义弹幕消息接口
export interface DanmakuMessage {
  id: string;
  content: string;
  color?: string;
  speed?: number;
  top?: number;
}

// 弹幕容器
const DanmakuContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 10;
`;

// 弹幕动画 - 从右到左移动
const moveLeftAnimation = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(-100%);
  }
`;

// 弹幕项目
const DanmakuItem = styled.div<{
  speed: number;
  top: number;
  color: string;
}>`
  position: absolute;
  right: 0;
  top: ${props => props.top}%;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 14px;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: ${props => props.color};
  animation: ${moveLeftAnimation} ${props => props.speed}s linear;
  animation-fill-mode: forwards;
  pointer-events: none;
  user-select: none;
  border: 1px solid rgba(0, 0, 0, 0.05);
  font-weight: 500;
  z-index: 100;
`;

interface DanmakuProps {
  messages: DanmakuMessage[];
  maxDisplayCount?: number;
}

const Danmaku: React.FC<DanmakuProps> = ({ 
  messages, 
  maxDisplayCount = 15 
}) => {
  const [displayMessages, setDisplayMessages] = useState<DanmakuMessage[]>([]);

  // 处理弹幕逻辑
  useEffect(() => {
    if (messages.length === 0) return;

    // 初始显示部分消息
    setDisplayMessages(messages.slice(0, maxDisplayCount).map(msg => ({
      ...msg,
      top: msg.top || Math.floor(Math.random() * 80) + 10, // 10% - 90%的位置
      speed: msg.speed || Math.floor(Math.random() * 8) + 12, // 12-20秒的速度
      color: msg.color || getRandomColor()
    })));

    // 如果消息超过maxDisplayCount，设置一个定时器循环显示剩余消息
    if (messages.length > maxDisplayCount) {
      let currentIndex = maxDisplayCount;
      
      const interval = setInterval(() => {
        if (currentIndex >= messages.length) {
          currentIndex = 0; // 循环播放
        }
        
        // 添加新消息
        const newMessage = {
          ...messages[currentIndex],
          id: `${messages[currentIndex].id}-${Date.now()}`, // 确保id唯一
          top: Math.floor(Math.random() * 80) + 10,
          speed: Math.floor(Math.random() * 8) + 12,
          color: messages[currentIndex].color || getRandomColor()
        };
        
        setDisplayMessages(prev => [...prev.slice(-maxDisplayCount + 1), newMessage]);
        currentIndex++;
      }, 2000); // 每2秒添加一条新消息
      
      return () => clearInterval(interval);
    }
  }, [messages, maxDisplayCount]);

  // 随机颜色生成
  function getRandomColor(): string {
    const colors = [
      '#e53e3e', // 红色
      '#dd6b20', // 橙色
      '#d69e2e', // 黄色
      '#38a169', // 绿色
      '#3182ce', // 蓝色
      '#5a67d8', // 靛蓝色
      '#805ad5', // 紫色
      '#d53f8c', // 粉色
      '#718096'  // 灰色
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  return (
    <DanmakuContainer>
      {displayMessages.map(message => (
        <DanmakuItem 
          key={message.id}
          speed={message.speed || 15} 
          top={message.top || 50}
          color={message.color || '#000'}
        >
          {message.content}
        </DanmakuItem>
      ))}
    </DanmakuContainer>
  );
};

export default Danmaku; 