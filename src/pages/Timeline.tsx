import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
// import timelineData from '../timeline-data.json'; // 移除本地数据导入
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaPlus } from 'react-icons/fa';
// 移除未使用的 IconType 导入
// import { IconType } from 'react-icons';

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

// 年份标签组件，用于在时间轴上显示年份分组
/*
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
*/

const LoadingSpinner = styled.div`
  // 这里可以添加一个加载动画的样式
  text-align: center;
  padding: 50px;
  font-size: 1.5em;
  color: var(--accent-color, #6c5ce7);
`;

const ErrorMessage = styled.div`
  // 错误信息的样式
  text-align: center;
  padding: 50px;
  font-size: 1.2em;
  color: red;
  background-color: #ffebee;
  border: 1px solid red;
  border-radius: 8px;
  margin: 20px;
`;

// 新增按钮样式
const AddButton = styled(motion.button)`
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--accent-color, #6c5ce7);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(108, 92, 231, 0.4);
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    right: 20px;
    bottom: 20px;
  }
`;

// 模态框背景
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  backdrop-filter: blur(5px);
`;

// 模态框容器
const ModalContent = styled(motion.div)`
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;

  @media (max-width: 768px) {
    padding: 20px;
    width: 95%;
  }
`;

// 表单样式
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--text-color, #333);
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: #f9f9f9;

  &:focus {
    outline: none;
    border-color: var(--accent-color-light, #a195e9);
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.15);
  }

  &[type="date"] {
    color: #555;
    cursor: pointer;
  }

  &::-webkit-calendar-picker-indicator {
    opacity: 0.6;
    cursor: pointer;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--accent-color, #6c5ce7);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.variant === 'primary' ? `
    background: var(--accent-color, #6c5ce7);
    color: white;
    &:hover {
      background: #5c4ac7;
    }
  ` : `
    background: #f5f5f5;
    color: #666;
    &:hover {
      background: #e5e5e5;
    }
  `}
`;

const ErrorText = styled.div`
  color: #ff4444;
  font-size: 14px;
  margin-top: 5px;
`;

// 定义时间轴条目的类型
interface TimelineItemData {
  date: string;
  title: string;
  description: string;
}

// 定义兜底用的假数据
const mockTimelineData: TimelineItemData[] = [
  {
    "date": "2024-01-01",
    "title": "假数据：新年快乐",
    "description": "这是一个占位符事件，用于在 API 加载失败时显示。"
  },
  {
    "date": "2023-12-25",
    "title": "假数据：圣诞节",
    "description": "另一个示例事件，展示时间轴的基本布局。"
  },
  {
    "date": "未来",
    "title": "假数据：未来的计划",
    "description": "展望未来，这里可以放一些规划中的内容。"
  }
];

// 临时的类型化组件包装器
const TypedFaPlus = FaPlus as React.FC<any>;

const Timeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timelineData, setTimelineData] = useState<TimelineItemData[]>([]); // 状态存储 API 或假数据
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // 错误状态或提示
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({
    date: '',
    title: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // 从环境变量获取 API 基础 URL，如果未定义则默认为空字符串 (相对路径)
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
      // 如果环境变量未设置，可以在控制台给个提示
      if (!process.env.REACT_APP_API_BASE_URL) {
        console.warn(
          'REACT_APP_API_BASE_URL is not defined. Using relative path for API calls.'
        );
      }
      const apiUrl = `${apiBaseUrl}/api/timeline`;

      try {
        // 使用构建好的 apiUrl
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTimelineData(data);
      } catch (e) {
        console.error(`Failed to fetch timeline data from ${apiUrl}, using mock data:`, e);
        setError('无法加载实时数据，当前显示为离线示例。');
        setTimelineData(mockTimelineData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ date: '', title: '', description: '' });
    setFormErrors({ date: '', title: '', description: '' });
  };

  const validateForm = () => {
    const errors = {
      date: '',
      title: '',
      description: ''
    };
    let isValid = true;

    if (!formData.date) {
      errors.date = '请选择日期';
      isValid = false;
    }

    if (!formData.title.trim()) {
      errors.title = '请输入标题';
      isValid = false;
    }

    if (!formData.description.trim()) {
      errors.description = '请输入内容';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
      const apiUrl = `${apiBaseUrl}/api/timeline`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('添加失败');
      }

      const newItem = await response.json();
      setTimelineData(prev => [newItem, ...prev]);
      handleCloseModal();
    } catch (error) {
      console.error('Error adding timeline item:', error);
      setFormErrors(prev => ({
        ...prev,
        submit: '添加失败，请稍后重试'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除对应字段的错误信息
    setFormErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  return (
    <>
      <TimelineContainer ref={containerRef}>

        {/* 加载状态 */} 
        {loading && <LoadingSpinner>玩命加载中...</LoadingSpinner>}

        {/* 错误/提示信息 (非加载状态下才显示) */} 
        {!loading && error && <ErrorMessage>{error}</ErrorMessage>} 

        {/* 时间轴内容 (非加载状态下，无论是否有错误都渲染数据) */} 
        {!loading && timelineData.map((item, index) => (
          <TimelineItemWithScroll 
            key={index} 
            item={item} 
            index={index} 
            totalItems={timelineData.length}
            containerRef={containerRef}
          />
        ))}

        {/* 可选：如果API成功但返回空数据，可以显示提示 */} 
        {!loading && !error && timelineData.length === 0 && 
          <ErrorMessage>暂无时间轴数据。</ErrorMessage>} 
      </TimelineContainer>

      <AddButton
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAddClick}
      >
        <TypedFaPlus size={24} />
      </AddButton>

      {isModalOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseModal}
        >
          <ModalContent
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '20px' }}>添加新时刻</h2>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>日期</Label>
                <Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
                {formErrors.date && <ErrorText>{formErrors.date}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>标题</Label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="输入标题"
                />
                {formErrors.title && <ErrorText>{formErrors.title}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>内容</Label>
                <TextArea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="输入内容"
                />
                {formErrors.description && <ErrorText>{formErrors.description}</ErrorText>}
              </FormGroup>

              <ButtonGroup>
                <Button type="button" onClick={handleCloseModal}>
                  取消
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? '添加中...' : '添加'}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

// 更新 TimelineItemWithScroll 的 Props 接口
interface TimelineItemWithScrollProps {
  item: TimelineItemData;
  index: number;
  totalItems: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
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