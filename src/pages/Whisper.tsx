import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { getAccessLogs, formatTimeAgo } from '../services/accessLogService';
import { getAllWhispers, sendWhisper, deleteWhisper } from '../services/whisperService';
import type { Whisper as WhisperType } from '../services/whisperService';
import VisitNotification, { NotificationMessage } from '../components/VisitNotification';
import WhisperBubbles from '../components/WhisperBubbles';
import WhisperInput from '../components/WhisperInput';
import { isAuthenticated } from '../services/authService';
import TipsCarousel from '../components/TipsCarousel';

// 页面容器
const PageContainer = styled(motion.div)`
  padding: 80px 20px 100px; // 增加底部padding，为固定的输入框留出空间
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: var(--background-color);
  
  @media (max-width: 768px) {
    padding: 75px 15px 100px;
  }
`;

// 标题
const Title = styled.h1`
  font-size: 1.8rem;
  color: var(--text-color);
  margin-bottom: 30px;
  font-weight: 600;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: var(--accent-color);
    border-radius: 3px;
  }
`;

// 内容区域
const ContentContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
`;

// 内容分割线
const Divider = styled.div`
  height: 1px;
  background-color: #eee;
  margin: 20px 0;
`;

// 区域标题
const SectionTitle = styled.h2`
  font-size: 1.3rem;
  color: var(--text-color);
  margin-bottom: 15px;
  font-weight: 500;
`;

// 悄悄话区域
const WhispersContainer = styled.div`
  margin-top: 30px;
  min-height: 200px;
`;

// 加载提示
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #999;
`;

// 错误提示
const ErrorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: #e53e3e;
  text-align: center;
  padding: 0 20px;
`;

// 空状态提示
const EmptyState = styled.div`
  text-align: center;
  padding: 30px 0;
  color: #999;
  font-size: 1rem;
`;

// 用户名称转换函数
const formatIdentity = (identity: string): string => {
  switch (identity) {
    case 'flisa':
      return 'Flisa';
    case 'goree':
      return 'Goree';
    default:
      return identity;
  }
};

// 生成随机颜色
const getRandomColor = (): string => {
  const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const WhisperPage: React.FC = () => {
  const navigate = useNavigate();
  const [isAccessLogsLoading, setIsAccessLogsLoading] = useState(true);
  const [isWhispersLoading, setIsWhispersLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [accessLogsError, setAccessLogsError] = useState<string | null>(null);
  const [whispersError, setWhispersError] = useState<string | null>(null);
  const [notificationMessages, setNotificationMessages] = useState<NotificationMessage[]>([]);
  const [whispers, setWhispers] = useState<WhisperType[]>([]);
  
  useEffect(() => {
    // 检查用户登录状态
    if (!isAuthenticated()) {
      // 未登录则跳转到首页
      navigate('/');
      return;
    }
    
    fetchAccessLogs();
    fetchWhispers();
  }, [navigate]);
  
  // 获取访问日志
  const fetchAccessLogs = async () => {
    try {
      setIsAccessLogsLoading(true);
      setAccessLogsError(null);
      
      // 获取过去7天的访问记录
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      // 传递 navigate 给 getAccessLogs
      const logs = await getAccessLogs(navigate, sevenDaysAgo.toISOString());
      
      // 按时间排序，最近的排在前面
      const sortedLogs = [...logs].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      // 为每个用户只保留最近一次访问记录
      const uniqueIdentityLogs = sortedLogs.reduce<Record<string, any>>((acc, log) => {
        if (!acc[log.identity]) {
          acc[log.identity] = log;
        }
        return acc;
      }, {});
      
      // 转换为通知消息
      const messages: NotificationMessage[] = Object.values(uniqueIdentityLogs)
        .filter(log => log && log.identity && log.timestamp) // 确保log对象有效
        .map((log: any) => {
          const userName = formatIdentity(log.identity);
          const timeAgo = formatTimeAgo(log.timestamp);
          
          return {
            id: `${log.identity}-${log.timestamp}`,
            content: `${userName} ${timeAgo}来过`,
            color: getRandomColor()
          };
        });
        
      // 计算恋爱天数并添加到消息中
      const loveStartDate = new Date(2025, 1, 14); // 注意：月份是从0开始的，所以2月是1
      const today = new Date();
      const timeDiff = today.getTime() - loveStartDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      
      // 根据当前时间获取问候语
      const getGreeting = (): string => {
        const hour = today.getHours();
        if (hour >= 5 && hour < 12) {
          return "宝宝早安";
        } else if (hour >= 12 && hour < 14) {
          return "宝宝萬";
        } else if (hour >= 14 && hour < 18) {
          return "宝宝下午好";
        } else {
          return "宝宝睡觉啦";
        }
      };
      
      // 添加恋爱天数消息
      const loveMessage: NotificationMessage = {
        id: 'love-days',
        content: `${getGreeting()} ${daysDiff} ❤️ ｜日子在慢慢发光 ✨`,
        color: 'pink' // 使用预定义的粉色
      };
      
      messages.push(loveMessage);
      
      setNotificationMessages(messages);
    } catch (err) {
      // 如果错误是认证错误，它已经被 handleApiResponse 处理（跳转），无需额外操作
      if (!(err instanceof Error && err.message.includes("认证已过期"))) {
        setAccessLogsError('获取访问记录失败，请稍后再试');
        console.error('获取访问日志失败:', err);
      }
    } finally {
      setIsAccessLogsLoading(false);
    }
  };
  
  // 获取悄悄话
  const fetchWhispers = async () => {
    try {
      setIsWhispersLoading(true);
      setWhispersError(null);
      
      // 传递 navigate 给 getAllWhispers
      const fetchedWhispers = await getAllWhispers(navigate);
      setWhispers(fetchedWhispers);
    } catch (err) {
      // 如果错误是认证错误，它已经被 handleApiResponse 处理（跳转），无需额外操作
      if (!(err instanceof Error && err.message.includes("认证已过期"))) {
        setWhispersError('获取悄悄话失败，请稍后再试');
        console.error('获取悄悄话失败:', err);
      }
    } finally {
      setIsWhispersLoading(false);
    }
  };
  
  // 发送悄悄话
  const handleSendWhisper = async (message: string) => {
    try {
      setIsSending(true);
      
      // 传递 navigate 给 sendWhisper
      const newWhisper = await sendWhisper(navigate, message);
      
      // 更新悄悄话列表
      setWhispers(prevWhispers => [newWhisper, ...prevWhispers]);
    } catch (err) {
      // 如果错误是认证错误，它已经被 handleApiResponse 处理（跳转），无需额外操作
      if (!(err instanceof Error && err.message.includes("认证已过期"))) {
        console.error('发送悄悄话失败:', err);
        alert('发送失败，请稍后再试');
      }
    } finally {
      setIsSending(false);
    }
  };
  
  // 处理悄悄话删除的回调 (从 WhisperBubbles 组件传来)
  const handleWhisperDeleted = async (whisperId: string) => {
    try {
      // 调用 deleteWhisper 服务函数，传递 navigate
      await deleteWhisper(navigate, whisperId);
      // 从状态中移除已删除的悄悄话
      setWhispers(prevWhispers => prevWhispers.filter(w => w.id !== whisperId));
    } catch (err) {
      // 如果错误是认证错误，它已经被 handleApiResponse 处理（跳转），无需额外操作
      if (!(err instanceof Error && err.message.includes("认证已过期"))) {
        console.error(`删除悄悄话 (id: ${whisperId}) 失败:`, err);
        alert('删除失败，请稍后再试');
      }
    }
  };
  
  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      
      <ContentContainer>
        {isAccessLogsLoading ? (
          <LoadingContainer>加载中...</LoadingContainer>
        ) : accessLogsError ? (
          <ErrorContainer>{accessLogsError}</ErrorContainer>
          ) : (
              
          <VisitNotification messages={notificationMessages} />
        )}
        
        <WhispersContainer>
          {isWhispersLoading ? (
            <LoadingContainer>加载悄悄话中...</LoadingContainer>
          ) : whispersError ? (
            <ErrorContainer>{whispersError}</ErrorContainer>
          ) : whispers.length === 0 ? (
            <EmptyState>这里好安静，快来留下第一个悄悄话吧！</EmptyState>
          ) : (
            <WhisperBubbles
              whispers={whispers}
              onWhisperDeleted={handleWhisperDeleted}
              navigate={navigate}
            />
          )}
        </WhispersContainer>
      </ContentContainer>
      
      {/* 使用轮播提示替换静态提示 */}
      <TipsCarousel 
        tips={[
          "戳戳彩色泡泡，解锁神秘留言 ✨", 
          "泡泡被戳破就会消失哦"
        ]} 
        interval={4000} 
      />
      
      {/* 悄悄话输入框 */}
      <WhisperInput onSend={handleSendWhisper} isLoading={isSending} />
    </PageContainer>
  );
};

export default WhisperPage; 