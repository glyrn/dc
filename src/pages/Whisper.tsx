import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { getAccessLogs, formatTimeAgo, countTodayVisits } from '../services/accessLogService';
import Danmaku, { DanmakuMessage } from '../components/Danmaku';

// 页面容器
const PageContainer = styled(motion.div)`
  padding: 80px 20px 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: var(--background-color);
  
  @media (max-width: 768px) {
    padding: 75px 15px 20px;
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
  overflow: hidden;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

// 访问统计卡片
const StatsCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 20px;
  
  h2 {
    font-size: 1.2rem;
    margin-bottom: 15px;
    font-weight: 600;
    color: var(--secondary-color);
  }
`;

// 访问记录项
const VisitItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f7;
  
  &:last-child {
    border-bottom: none;
  }
  
  span.name {
    font-weight: 500;
    color: var(--secondary-color);
  }
  
  span.count {
    font-weight: 600;
    color: var(--accent-color);
  }
`;

// 无记录显示
const NoDataMessage = styled.div`
  padding: 40px;
  color: #888;
  font-size: 1rem;
  font-style: italic;
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

const Whisper: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessLogs, setAccessLogs] = useState<any[]>([]);
  const [danmakuMessages, setDanmakuMessages] = useState<DanmakuMessage[]>([]);
  
  useEffect(() => {
    fetchAccessLogs();
  }, []);
  
  // 获取访问日志
  const fetchAccessLogs = async () => {
    try {
      setIsLoading(true);
      
      // 获取过去7天的访问记录
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const logs = await getAccessLogs(sevenDaysAgo.toISOString());
      setAccessLogs(logs);
      
      // 转换日志为弹幕消息
      const messages: DanmakuMessage[] = logs.map(log => {
        const userName = formatIdentity(log.identity);
        const timeAgo = formatTimeAgo(log.timestamp);
        
        return {
          id: `${log.identity}-${log.timestamp}`,
          content: `${userName} ${timeAgo}来看过~`,
        };
      });
      
      // 添加今日访问次数消息
      const todayCounts = countTodayVisits(logs);
      Object.keys(todayCounts).forEach(identity => {
        const count = todayCounts[identity];
        if (count > 1) {  // 只显示多次访问的用户
          messages.push({
            id: `today-${identity}`,
            content: `${formatIdentity(identity)} 今天已经来过 ${count} 次啦！`,
            color: '#e53e3e',  // 使用红色
          });
        }
      });
      
      setDanmakuMessages(messages);
    } catch (err) {
      setError('获取访问记录失败，请稍后再试');
      console.error('获取访问日志失败:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 计算今天的访问统计
  const todayVisits = countTodayVisits(accessLogs);
  
  return (
    <PageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Title>悄悄话</Title>
      
      <ContentContainer>
        {isLoading ? (
          <div>加载中...</div>
        ) : error ? (
          <div>{error}</div>
        ) : danmakuMessages.length > 0 ? (
          <>
            <Danmaku messages={danmakuMessages} />
            <div style={{ marginTop: '20px', opacity: 0.6, fontSize: '14px' }}>
              ✨ 这里显示了最近来访的小伙伴 ✨
            </div>
          </>
        ) : (
          <NoDataMessage>暂无访问记录</NoDataMessage>
        )}
      </ContentContainer>
      
      {!isLoading && !error && Object.keys(todayVisits).length > 0 && (
        <StatsCard>
          <h2>今日访问统计</h2>
          {Object.entries(todayVisits).map(([identity, count]) => (
            <VisitItem key={identity}>
              <span className="name">{formatIdentity(identity)}</span>
              <span className="count">{count} 次</span>
            </VisitItem>
          ))}
        </StatsCard>
      )}
    </PageContainer>
  );
};

export default Whisper; 