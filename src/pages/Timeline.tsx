import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import timelineData from '../timeline-data.json'; // 导入时间轴数据
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const PageTitle = styled(motion.h1)`
  text-align: center;
  margin-bottom: 50px;
  color: var(--secondary-color, #333);
  font-size: 2.2rem;
  font-weight: 700;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, var(--accent-color, #6c5ce7), transparent);
  }
`;

const TimelineContainer = styled.div`
  padding: 100px 20px 40px; /* 顶部留出导航栏空间，底部加一些 padding */
  max-width: 1000px; /* 限制最大宽度 */
  margin: 0 auto; /* 居中显示 */
  position: relative;

  /* 中间的垂直线 */
  &::before {
    content: '';
    position: absolute;
    top: 160px; /* 从标题下方开始 */
    bottom: 40px; /* 在底部 padding 之前结束 */
    left: 50%;
    transform: translateX(-50%);
    width: 3px;
    background: linear-gradient(to bottom, 
      rgba(108, 92, 231, 0.2), 
      rgba(108, 92, 231, 0.8), 
      rgba(108, 92, 231, 0.2));
    z-index: 0;
    border-radius: 1.5px;
  }

  @media (max-width: 768px) {
    &::before {
      left: 20px;
      transform: translateX(0);
    }
  }
`;

const TimelineItemCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  z-index: 2;
  max-width: 85%;
  margin-left: auto;
  margin-right: auto;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const TimelineItem = styled.div`
  margin-bottom: 60px;
  position: relative;
  width: 50%; /* 每个项目占一半宽度 */
  padding: 0 40px; /* 左右留出间距 */
  box-sizing: border-box;
  z-index: 1; /* 确保内容在伪元素线条之上 */

  /* 根据索引决定左右 */
  &:nth-child(odd) {
    left: 0;
    text-align: right; /* 左侧内容右对齐 */

    /* 时间点圆圈 */
    &::before {
      content: '';
      position: absolute;
      top: 20px; /* 根据内容调整垂直位置 */
      right: -8px; /* 定位到中线上，考虑圆圈半径和边框 */
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: var(--accent-color, #6c5ce7);
      box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.3);
      z-index: 3; /* 在内容和线条之间 */
    }
     /* 时间点连接线 (可选，视觉效果) */
     &::after {
      content: '';
      position: absolute;
      top: 20px;
      right: 0;
      width: 30px; /* 从内容到圆圈的连接线 */
      height: 2px;
      background: rgba(108, 92, 231, 0.2);
      z-index: 0;
    }
  }

  &:nth-child(even) {
    left: 50%; /* 右侧内容从中间开始 */
    text-align: left; /* 右侧内容左对齐 */

     /* 时间点圆圈 */
    &::before {
      content: '';
      position: absolute;
      top: 20px;
      left: -8px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: var(--accent-color, #6c5ce7);
      box-shadow: 0 0 0 4px rgba(108, 92, 231, 0.3);
      z-index: 3;
    }
    /* 时间点连接线 (可选) */
    &::after {
      content: '';
      position: absolute;
      top: 20px;
      left: 0;
      width: 30px;
      height: 2px;
      background: rgba(108, 92, 231, 0.2);
      z-index: 0;
    }
  }

  /* 清除最后一个元素的下边距 */
  &:last-child {
    margin-bottom: 0;
  }

   /* 响应式调整：在小屏幕上，所有项都在左侧 */
   @media (max-width: 768px) {
    width: 100%;
    left: 0 !important; /* 覆盖之前的 left 设置 */
    padding: 0 0 0 50px; /* 左侧留出圆圈和线的空间 */
    text-align: left !important; /* 所有都左对齐 */
    margin-bottom: 40px;

    /* 调整圆圈和连接线到左侧 */
    &::before {
        left: 16px !important; /* 强制在左侧 */
        right: auto !important;
    }
     &::after {
        left: 0 !important;
        right: auto !important;
        width: 30px;
    }

     /* 重新定位中轴线到左边 */
     ${TimelineContainer}::before {
        left: 20px; /* 调整中轴线位置 */
        transform: translateX(0);
    }
  }
`;

const TimelineDate = styled.div`
  display: inline-block;
  font-size: 0.95em;
  color: white;
  margin-bottom: 8px;
  font-weight: 600;
  background-color: var(--accent-color, #6c5ce7);
  padding: 5px 12px;
  border-radius: 20px;
  box-shadow: 0 3px 6px rgba(108, 92, 231, 0.2);
`;

const TimelineTitle = styled.h3`
  font-size: 1.4em;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
`;

const TimelineDescription = styled.p`
  font-size: 1em;
  color: #555;
  line-height: 1.7;
`;

// 帧动画变体定义
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.4, // 稍微减少延迟
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.85 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 15
    }
  }
};

const lineVariants = {
  hidden: { scaleY: 0 },
  visible: { 
    scaleY: 1,
    transition: { 
      duration: 2,
      ease: "easeInOut"
    }
  }
};

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

  // 排序数据：确保按日期顺序排列（从晚到早）- 反向排序
  const sortedData = [...timelineData].sort((a, b) => {
    // 处理"未来"特殊情况
    if (a.date === '未来') return -1; // 未来应该在最上面
    if (b.date === '未来') return 1;
    
    // 常规日期比较 - 注意这里是反向排序
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // 确保最早的事件索引最大
  const reversedForAnimation = [...sortedData].reverse();

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
        style={{ 
          display: 'flex', 
          flexDirection: 'column-reverse', // 反向布局，让最早的事件在底部
          position: 'relative'
        }}
      >
        <motion.div 
          className="timeline-line"
          initial="hidden"
          animate={lineControls}
          variants={lineVariants}
          style={{
            position: 'absolute',
            top: '20px',
            bottom: '0',
            left: '50%',
            width: '3px',
            height: 'calc(100% - 20px)',
            background: 'linear-gradient(to bottom, rgba(108, 92, 231, 0.8), rgba(108, 92, 231, 0.2))',
            zIndex: 0,
            borderRadius: '1.5px',
            transformOrigin: 'bottom',
            transform: 'translateX(-50%)'
          }}
        />
        {reversedForAnimation.map((item, index) => (
          <TimelineItemWithScroll 
            key={index} 
            item={item} 
            index={index} 
            totalItems={reversedForAnimation.length}
            containerRef={containerRef as React.RefObject<HTMLDivElement>}
          />
        ))}
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
      // 保存在我们的ref中
      itemRef.current = node;
      // 传递给inViewRef
      inViewRef(node);
    },
    [inViewRef],
  );

  // 计算反向的索引（最早的事件索引最小，最新的最大）
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
          stiffness: 70,
          damping: 15,
          delay: reverseIndex * 0.5 // 最早的事件最先开始动画
        }
      });

      // 自动滚动逻辑 - 当新项显示时，滚动页面
      if (containerRef.current && reverseIndex < totalItems - 1) {
        const itemHeight = itemRef.current?.getBoundingClientRect().height || 0;
        const scrollTo = containerRef.current.scrollTop + itemHeight + 60; // 60是项目间距

        setTimeout(() => {
          containerRef.current?.scrollTo({
            top: scrollTo,
            behavior: 'smooth'
          });
        }, (reverseIndex * 0.5 + 0.7) * 1000); // 在项目动画开始后滚动
      }
    }
  }, [controls, inView, reverseIndex, totalItems, containerRef]);

  return (
    <TimelineItem ref={setRefs}>
      <TimelineItemCard
        initial={{ opacity: 0, y: 50, scale: 0.85 }}
        animate={controls}
      >
        <TimelineDate>{item.date}</TimelineDate>
        <TimelineTitle>{item.title}</TimelineTitle>
        <TimelineDescription>{item.description}</TimelineDescription>
      </TimelineItemCard>
    </TimelineItem>
  );
};

export default Timeline; 