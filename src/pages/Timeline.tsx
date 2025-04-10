import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import timelineData from '../timeline-data.json'; // 导入时间轴数据
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// 增强的页面标题组件
const PageTitle = styled(motion.h1)`
  text-align: center;
  margin: 0 auto 60px;
  color: var(--secondary-color, #333);
  font-size: clamp(1.8rem, 5vw, 2.5rem); // 响应式字体大小
  font-weight: 700;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
  
  &:after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 10%;
    right: 10%;
    height: 4px;
    border-radius: 2px;
    background: linear-gradient(90deg, transparent, var(--accent-color, #6c5ce7), transparent);
  }

  @media (max-width: 768px) {
    margin-bottom: 40px;
    font-size: clamp(1.5rem, 4vw, 2rem);
    &:after {
      bottom: -8px;
      height: 3px;
    }
  }
`;

// 时间轴主容器
const TimelineContainer = styled.div`
  padding: 100px 20px 80px; // 增加了顶部和底部的padding
  max-width: 1200px; // 稍微增加了最大宽度
  margin: 0 auto;
  position: relative;
  overflow-x: hidden; // 防止在小屏幕上滚动

  /* 中间的垂直线 - 优化了渐变效果 */
  &::before {
    content: '';
    position: absolute;
    top: 160px;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    background: linear-gradient(to bottom, 
      rgba(108, 92, 231, 0), 
      rgba(108, 92, 231, 0.8) 10%, 
      rgba(108, 92, 231, 0.8) 90%, 
      rgba(108, 92, 231, 0));
    z-index: 0;
    border-radius: 2px;
  }

  /* 针对移动设备的优化 */
  @media (max-width: 768px) {
    padding: 80px 10px 60px; // 减小左右内边距
    &::before {
      left: 20px; // 向左移动，更贴近屏幕边缘
      width: 3px;
    }
  }
`;

// 增强的时间轴卡片
const TimelineItemCard = styled(motion.div)`
  background: white;
  border-radius: 16px; // 更圆润的边角
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  position: relative;
  z-index: 2;
  max-width: 90%; // 稍微调整宽度
  margin-left: auto;
  margin-right: auto;
  border: 1px solid rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(108, 92, 231, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
    border-color: rgba(108, 92, 231, 0.2);
  }

  /* 移动端适配 */
  @media (max-width: 768px) {
    padding: 15px; // 减小内边距
    max-width: calc(100% - 15px); // 确保不超出屏幕
    margin-left: 0;
    margin-right: 0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.08);
  }
`;

// 优化的TimelineItem组件
const TimelineItem = styled.div`
  margin-bottom: 70px; // 增加间距使其更加通透
  position: relative;
  width: 50%;
  padding: 0 40px;
  box-sizing: border-box;
  z-index: 1;

  /* 左侧内容样式 */
  &:nth-child(odd) {
    left: 0;
    text-align: right;

    /* 增强的时间点圆圈 */
    &::before {
      content: '';
      position: absolute;
      top: 25px;
      right: -10px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: var(--accent-color, #6c5ce7);
      box-shadow: 0 0 0 6px rgba(108, 92, 231, 0.2), 0 0 20px rgba(108, 92, 231, 0.4);
      z-index: 3;
      transition: all 0.3s ease;
    }
     
    /* 更细腻的连接线 */
    &::after {
      content: '';
      position: absolute;
      top: 25px;
      right: 0;
      width: 30px;
      height: 3px;
      background: linear-gradient(to right, rgba(108, 92, 231, 0.1), rgba(108, 92, 231, 0.8));
      z-index: 0;
      border-radius: 1px;
    }

    /* 悬停效果 */
    &:hover::before {
      background-color: #5c4ac7;
      transform: scale(1.1);
      box-shadow: 0 0 0 8px rgba(108, 92, 231, 0.3), 0 0 25px rgba(108, 92, 231, 0.5);
    }
  }

  /* 右侧内容样式 */
  &:nth-child(even) {
    left: 50%;
    text-align: left;

    /* 增强的时间点圆圈 */
    &::before {
      content: '';
      position: absolute;
      top: 25px;
      left: -10px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: var(--accent-color, #6c5ce7);
      box-shadow: 0 0 0 6px rgba(108, 92, 231, 0.2), 0 0 20px rgba(108, 92, 231, 0.4);
      z-index: 3;
      transition: all 0.3s ease;
    }
    
    /* 更细腻的连接线 */
    &::after {
      content: '';
      position: absolute;
      top: 25px;
      left: 0;
      width: 30px;
      height: 3px;
      background: linear-gradient(to left, rgba(108, 92, 231, 0.1), rgba(108, 92, 231, 0.8));
      z-index: 0;
      border-radius: 1px;
    }

    /* 悬停效果 */
    &:hover::before {
      background-color: #5c4ac7;
      transform: scale(1.1);
      box-shadow: 0 0 0 8px rgba(108, 92, 231, 0.3), 0 0 25px rgba(108, 92, 231, 0.5);
    }
  }

  /* 清除最后一个元素的下边距 */
  &:last-child {
    margin-bottom: 0;
  }

  /* 改进的移动端适配 */
  @media (max-width: 768px) {
    width: 100%;
    left: 0 !important;
    padding: 0 0 0 45px; // 减小左边距，为时间点留出正好的空间
    text-align: left !important;
    margin-bottom: 40px; // 减小底部间距
    
    /* 移动端下统一只使用左侧的圆圈和连接线 */
    &::before {
      left: 9px !important; // 调整位置
      right: auto !important;
      width: 18px; // 减小尺寸
      height: 18px;
      box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.15), 0 0 15px rgba(108, 92, 231, 0.3);
    }
     
    /* 移动端下只保留和显示左侧的连接线 */
    &::after {
      content: '' !important; // 确保显示
      left: 17px !important; // 从圆圈右侧开始
      right: auto !important;
      width: 20px; // 减小长度
      height: 2px; // 减小高度
      top: 18px;
      background: linear-gradient(to right, rgba(108, 92, 231, 0.8), rgba(108, 92, 231, 0.1)) !important;
    }
    
    /* 移动端下悬停效果调整 */
    &:hover::before {
      transform: scale(1.05);
      box-shadow: 0 0 0 5px rgba(108, 92, 231, 0.2), 0 0 15px rgba(108, 92, 231, 0.4);
    }
  }
`;

// 优化的日期组件
const TimelineDate = styled.div`
  display: inline-block;
  font-size: 0.95em;
  color: white;
  margin-bottom: 12px;
  font-weight: 600;
  background-color: var(--accent-color, #6c5ce7);
  padding: 6px 14px;
  border-radius: 30px;
  box-shadow: 0 4px 10px rgba(108, 92, 231, 0.25);
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  
  /* 日期悬停效果 */
  ${TimelineItemCard}:hover & {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(108, 92, 231, 0.3);
    background-color: #5c4ac7;
  }

  @media (max-width: 768px) {
    font-size: 0.85em;
    padding: 4px 12px;
    margin-bottom: 8px;
  }
`;

// 优化的标题组件
const TimelineTitle = styled.h3`
  font-size: 1.5em;
  color: #333;
  margin: 10px 0 15px;
  font-weight: 700;
  line-height: 1.3;
  transition: color 0.3s ease;
  
  ${TimelineItemCard}:hover & {
    color: var(--accent-color, #6c5ce7);
  }

  @media (max-width: 768px) {
    font-size: 1.2em;
    margin: 6px 0 10px;
  }
`;

// 优化的描述文本
const TimelineDescription = styled.p`
  font-size: 1.05em;
  color: #555;
  line-height: 1.8;
  margin-bottom: 5px;

  @media (max-width: 768px) {
    font-size: 0.95em;
    line-height: 1.6;
    margin-bottom: 0;
  }
`;

// 动画变体定义
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12
    }
  }
};

const lineVariants = {
  hidden: { scaleY: 0 },
  visible: { 
    scaleY: 1,
    transition: { 
      duration: 1.5,
      ease: "easeInOut"
    }
  }
};

// 年份标签组件，用于在时间轴上显示年份分组
const YearLabel = styled(motion.div)`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--accent-color, #6c5ce7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  display: inline-block;
  margin: 30px 0;
  z-index: 3;
  box-shadow: 0 4px 10px rgba(108, 92, 231, 0.3);
  
  @media (max-width: 768px) {
    left: 22px; // 更靠近左侧，与时间轴对齐
    transform: translateX(0);
    font-size: 0.85em;
    padding: 5px 10px;
    margin: 20px 0;
    border-radius: 15px;
  }
`;

// 主组件
const Timeline: React.FC = () => {
  const controls = useAnimation();
  const lineControls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [titleRef, titleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (titleInView) {
      controls.start({ 
        opacity: 1, 
        y: 0,
        transition: { 
          type: "spring", 
          stiffness: 100,
          damping: 15,
          duration: 0.7 
        }
      });
      
      // 标题显示后，开始线条动画
      setTimeout(() => {
        lineControls.start('visible');
      }, 500);
    }
  }, [controls, lineControls, titleInView]);

  // 排序数据：按日期从新到旧排列
  const sortedData = [...timelineData].sort((a, b) => {
    if (a.date === '未来') return -1;
    if (b.date === '未来') return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  // 以年份分组数据
  const groupedByYear = sortedData.reduce((acc, item) => {
    // 特殊处理"未来"
    const year = item.date === '未来' ? '未来' : new Date(item.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(item);
    return acc;
  }, {} as Record<string, typeof timelineData>);

  // 将分组数据处理为平面列表，添加年份标签
  const processedData: Array<{type: 'item'|'year', data: any}> = [];
  Object.entries(groupedByYear).forEach(([year, items]) => {
    processedData.push({type: 'year', data: year});
    items.forEach(item => {
      processedData.push({type: 'item', data: item});
    });
  });

  return (
    <TimelineContainer ref={containerRef}>
      <PageTitle 
        ref={titleRef}
        initial={{ opacity: 0, y: -30 }}
        animate={controls}
      >
        记录每一个重要时刻
      </PageTitle>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="timeline-items-container"
      >
        {processedData.map((item, index) => {
          if (item.type === 'year') {
            return (
              <YearLabel 
                key={`year-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.data}年
              </YearLabel>
            );
          } else {
            return (
              <TimelineItemWithScroll 
                key={`item-${index}`} 
                item={item.data} 
                index={index} 
                totalItems={processedData.length}
                containerRef={containerRef as React.RefObject<HTMLDivElement>}
              />
            );
          }
        })}
      </motion.div>
    </TimelineContainer>
  );
};

// 修改参数类型定义
interface TimelineItemWithScrollProps {
  item: any;
  index: number;
  totalItems: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

const TimelineItemWithScroll = ({ 
  item, 
  index,
  totalItems,
  containerRef
}: TimelineItemWithScrollProps) => {
  const controls = useAnimation();
  const itemRef = useRef<HTMLDivElement>(null);
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // 合并ref
  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      itemRef.current = node;
      inViewRef(node);
    },
    [inViewRef],
  );

  // 计算反向的索引
  const reverseIndex = totalItems - 1 - index;

  useEffect(() => {
    if (inView) {
      // 显示当前项
      controls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          type: "spring",
          stiffness: 80,
          damping: 12,
          delay: Math.min(reverseIndex * 0.3, 1.2) // 限制最大延迟
        }
      });
    }
  }, [controls, inView, reverseIndex]);

  // 格式化日期显示
  const formatDate = (dateString: string) => {
    if (dateString === '未来') return '未来';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <TimelineItem ref={setRefs}>
      <TimelineItemCard
        initial={{ opacity: 0, y: 50, scale: 0.85 }}
        animate={controls}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <TimelineDate>{formatDate(item.date)}</TimelineDate>
        <TimelineTitle>{item.title}</TimelineTitle>
        <TimelineDescription>{item.description}</TimelineDescription>
      </TimelineItemCard>
    </TimelineItem>
  );
};

export default Timeline; 