import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

// 定义通知消息接口
export interface NotificationMessage {
  id: string;
  content: string;
  color?: string;
}

// 淡入动画
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// 淡出动画
const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
`;

// 通知容器
const NotificationsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 10px;
`;

// 通知轮播项
const NotificationItem = styled.div<{
  isVisible: boolean;
  color: string;
  isExiting: boolean;
}>`
  width: 100%;
  max-width: 500px;
  background-color: ${props => `rgba(${props.color}, 0.1)`};
  border: 1px solid ${props => `rgba(${props.color}, 0.3)`};
  border-radius: 10px;
  padding: 16px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  animation: ${props => props.isExiting ? fadeOut : fadeIn} 0.6s ease-in-out;
  animation-fill-mode: forwards;
  position: absolute;
  font-size: 16px;
  text-align: center;
  color: #333;
  font-weight: 500;
  display: ${props => props.isVisible ? 'block' : 'none'};
  
  /* 添加文本溢出处理 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  /* 针对移动设备优化 */
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 14px 18px;
    position: relative;
    text-align: left;
    white-space: normal; /* 允许文本换行 */
    max-height: 60px; /* 限制最大高度 */
    overflow-y: auto; /* 内容过多时显示滚动条 */
    overflow-wrap: break-word; /* 单词过长时换行 */
    word-break: break-all; /* 强制字符换行 */
  }
`;

// 无消息提示
const NoMessagesText = styled.div`
  color: #999;
  font-style: italic;
  text-align: center;
`;

interface VisitNotificationProps {
  messages: NotificationMessage[];
}

const VisitNotification: React.FC<VisitNotificationProps> = ({ messages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  
  // 确保消息列表有效
  const validMessages = messages.filter(msg => msg && msg.id && msg.content);
  const hasMessages = validMessages.length > 0;
  
  // 如果currentIndex无效，重置为0
  useEffect(() => {
    if (currentIndex >= validMessages.length && validMessages.length > 0) {
      setCurrentIndex(0);
    }
  }, [validMessages, currentIndex]);
  
  // 自动轮播逻辑
  useEffect(() => {
    if (!hasMessages) return;
    
    const showDuration = 3000; // 每条消息显示3秒
    const transitionDuration = 600; // 过渡动画600ms
    
    // 设置自动切换定时器
    const timer = setTimeout(() => {
      if (validMessages.length <= 1) return;
      
      // 开始退出动画
      setIsExiting(true);
      
      // 退出动画完成后，切换到下一条消息
      const exitTimer = setTimeout(() => {
        setIsVisible(false);
        
        // 短暂延迟后显示下一条
        setTimeout(() => {
          setCurrentIndex(prev => (prev + 1) % validMessages.length);
          setIsExiting(false);
          setIsVisible(true);
        }, 100);
      }, transitionDuration);
      
      return () => clearTimeout(exitTimer);
    }, showDuration);
    
    return () => clearTimeout(timer);
  }, [currentIndex, hasMessages, validMessages.length]);
  
  // 确定消息颜色
  const getColorRGB = (message: NotificationMessage): string => {
    if (!message || !message.color) return '240, 240, 240';
    
    switch (message.color) {
      case 'red': return '229, 62, 62';
      case 'orange': return '221, 107, 32';
      case 'yellow': return '214, 158, 46';
      case 'green': return '56, 161, 105';
      case 'blue': return '49, 130, 206';
      case 'purple': return '128, 90, 213';
      case 'pink': return '213, 63, 140';
      default: return '240, 240, 240';
    }
  };
  
  // 手动切换到下一条消息
  const goToNextMessage = () => {
    if (validMessages.length <= 1) return;
    
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % validMessages.length);
        setIsExiting(false);
        setIsVisible(true);
      }, 100);
    }, 300);
  };
  
  // 当前显示的消息
  const currentMessage = hasMessages ? validMessages[currentIndex] : null;
  
  return (
    <NotificationsContainer>
      {hasMessages ? (
        currentMessage && (
          <NotificationItem 
            key={currentMessage.id}
            isVisible={isVisible}
            isExiting={isExiting}
            color={getColorRGB(currentMessage)}
          >
            {currentMessage.content}
          </NotificationItem>
        )
      ) : (
        <NoMessagesText>暂无访问记录</NoMessagesText>
      )}
    </NotificationsContainer>
  );
};

export default VisitNotification; 