import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import diaryService from '../services/diaryService';
import { FaChevronLeft, FaChevronRight, FaSpinner, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

// 定义日记数据类型
interface DiaryEntry {
  date: string;
  title: string;
  content: string;
  mood: string;
  isEmpty?: boolean;
}

// 容器样式
const DiaryContainer = styled.div`
  padding: 100px 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;

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

// 日历视图样式
const CalendarView = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-bottom: 40px;
`;

const WeekdayHeader = styled.div`
  text-align: center;
  font-weight: 600;
  padding: 10px;
  color: var(--secondary-color, #333);
`;

const CalendarCell = styled.div<{
  isCurrentMonth: boolean;
  hasEntry: boolean;
  isSelected: boolean;
  isToday: boolean;
}>`
  height: 80px;
  border-radius: 12px;
  padding: 8px;
  background-color: ${props => props.isSelected ? 'var(--accent-color, #6c5ce7)' : 'white'};
  color: ${props => props.isSelected ? 'white' : props.isCurrentMonth ? '#333' : '#aaa'};
  cursor: ${props => props.isCurrentMonth ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  border: ${props => props.isToday ? '2px solid var(--accent-color, #6c5ce7)' : 'none'};
  opacity: ${props => props.isCurrentMonth ? 1 : 0.5};

  &:hover {
    transform: ${props => props.isCurrentMonth ? 'translateY(-3px)' : 'none'};
    box-shadow: ${props => props.isCurrentMonth ? '0 6px 15px rgba(0, 0, 0, 0.1)' : '0 4px 12px rgba(0, 0, 0, 0.05)'};
  }
  
  ${props => props.hasEntry && !props.isSelected && `
    &::after {
      content: '';
      position: absolute;
      bottom: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--accent-color, #6c5ce7);
    }
  `}
`;

const DateNumber = styled.div`
  font-size: 1.2rem;
  font-weight: ${props => props.className?.includes('today') ? '700' : '400'};
`;

const MonthNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const MonthTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--secondary-color, #333);
`;

const NavButton = styled.button`
  background-color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.12);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

// 日记详情视图样式
const DiaryDetailView = styled(motion.div)`
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

const DiaryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const DiaryTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--secondary-color, #333);
`;

const DiaryDate = styled.div`
  font-size: 1rem;
  color: #666;
  background-color: #f5f5f7;
  padding: 5px 12px;
  border-radius: 20px;
`;

const DiaryContent = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #444;
  margin-bottom: 30px;
`;

const MoodTag = styled.div<{ mood: string }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 15px;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-right: 10px;
  
  ${({ mood }) => {
    switch(mood) {
      case 'happy':
        return 'background-color: #E3F2FD; color: #1565C0;';
      case 'joyful':
        return 'background-color: #E8F5E9; color: #2E7D32;';
      case 'reflective':
        return 'background-color: #E0F7FA; color: #00838F;';
      case 'accomplished':
        return 'background-color: #FFF3E0; color: #E65100;';
      case 'excited':
        return 'background-color: #F3E5F5; color: #6A1B9A;';
      default:
        return 'background-color: #ECEFF1; color: #455A64;';
    }
  }}
  
  &::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
    
    ${({ mood }) => {
      switch(mood) {
        case 'happy':
          return 'background-color: #1565C0;';
        case 'joyful':
          return 'background-color: #2E7D32;';
        case 'reflective':
          return 'background-color: #00838F;';
        case 'accomplished':
          return 'background-color: #E65100;';
        case 'excited':
          return 'background-color: #6A1B9A;';
        default:
          return 'background-color: #455A64;';
      }
    }}
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: var(--accent-color, #6c5ce7);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 0;
  
  svg {
    margin-right: 8px;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

// 加载状态
const LoadingState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
  
  svg {
    width: 40px;
    height: 40px;
    margin-bottom: 20px;
  }
  
  p {
    color: #666;
    font-size: 1rem;
  }
`;

// 错误状态
const ErrorState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
  color: #dc3545;
  text-align: center;

  svg {
    font-size: 2rem;
    margin-bottom: 10px;
  }
`;

// Temporary typed wrappers for react-icons
const TypedFaSpinner = FaSpinner as React.FC<any>;
const TypedFaExclamationTriangle = FaExclamationTriangle as React.FC<any>;
const TypedFaChevronLeft = FaChevronLeft as React.FC<any>;
const TypedFaChevronRight = FaChevronRight as React.FC<any>;
const TypedFaArrowLeft = FaArrowLeft as React.FC<any>;

// 获取某月的天数
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// 获取某月第一天是周几
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

// 格式化日期为字符串 YYYY-MM-DD
const formatDate = (year: number, month: number, day: number): string => {
  const d = new Date(year, month, day);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dt = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dt}`;
};

// 新增一个空日记的提示组件
const EmptyDiaryMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  
  h3 {
    font-size: 1.4rem;
    margin-bottom: 15px;
    color: #555;
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 500px;
    margin: 0 auto;
  }
`;

// 日记组件
const Diary: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysWithEntries, setDaysWithEntries] = useState<number[]>([]);
  const [selectedDiary, setSelectedDiary] = useState<DiaryEntry | null>(null);
  const [view, setView] = useState<'calendar' | 'detail'>('calendar');
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 加载当月日记状态
  const loadMonthStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const days = await diaryService.getDiaryMonthStatus(currentYear, currentMonth + 1);
      setDaysWithEntries(days);
    } catch (err) {
      setError('无法加载日记状态，请稍后重试。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [currentYear, currentMonth]);

  useEffect(() => {
    loadMonthStatus();
  }, [loadMonthStatus]);

  // 处理日期点击 - 修改为对所有日期都显示详情视图
  const handleDateClick = async (day: number) => {
    const dateStr = formatDate(currentYear, currentMonth, day);
    const hasEntry = daysWithEntries.includes(day);
    
    setIsDetailLoading(true);
    setSelectedDiary(null);
    setError(null);
    setView('detail'); // 总是切换到详情视图
    
    // 如果有日记条目，尝试获取它
    if (hasEntry) {
      try {
        const entry = await diaryService.getDiaryEntry(dateStr);
        if (entry) {
          setSelectedDiary(entry as DiaryEntry);
        } else {
          // API 返回了空值，但理论上应该有日记
          setError('无法加载日记详情。');
        }
      } catch (err) {
        setError('加载日记详情时出错，请稍后重试。');
        console.error(err);
      }
    } else {
      // 创建一个特殊的"空日记"对象，标记为 isEmpty: true
      // 这样在渲染时可以识别它不是真实日记
      setSelectedDiary({
        date: dateStr,
        title: '没有日记',
        content: '', 
        mood: 'neutral',
        isEmpty: true // 添加一个标志
      } as DiaryEntry);
    }
    
    setIsDetailLoading(false);
  };

  // 月份导航
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setView('calendar');
    setSelectedDiary(null);
  };

  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setView('calendar');
    setSelectedDiary(null);
  };

  // 返回日历视图
  const backToCalendar = () => {
    setView('calendar');
    setSelectedDiary(null);
  };

  // 检查日期是否有条目
  const hasEntryForDay = (day: number): boolean => {
    return daysWithEntries.includes(day);
  };

  // 渲染加载状态
  const renderLoading = () => (
    <LoadingState initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <TypedFaSpinner />
      </motion.div>
      <span>加载中...</span>
    </LoadingState>
  );

  // 渲染错误状态
  const renderError = () => (
    <ErrorState initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <TypedFaExclamationTriangle />
      <span>{error}</span>
    </ErrorState>
  );

  // 生成日历单元格
  const renderCalendarCells = () => {
    const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfWeek = getFirstDayOfMonth(currentYear, currentMonth);
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    const cells = [];

    // 上个月的末尾几天
    const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      cells.push(
        <CalendarCell
          key={`prev-${day}`}
          isCurrentMonth={false}
          hasEntry={false}
          isSelected={false}
          isToday={false}
          onClick={() => {}}
        >
          <DateNumber>{day}</DateNumber>
        </CalendarCell>
      );
    }

    // 当前月份的日期
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const isToday = day === todayDate && currentMonth === todayMonth && currentYear === todayYear;
      const hasEntry = hasEntryForDay(day);
      const dateStr = formatDate(currentYear, currentMonth, day);
      const isSelected = selectedDiary?.date === dateStr && view === 'detail';

      cells.push(
        <CalendarCell
          key={day}
          isCurrentMonth={true}
          hasEntry={hasEntry}
          isSelected={isSelected}
          isToday={isToday}
          onClick={() => handleDateClick(day)}
        >
          <DateNumber className={isToday ? 'today' : ''}>{day}</DateNumber>
        </CalendarCell>
      );
    }

    // 下个月的开头几天
    const totalCells = cells.length;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= remainingCells; i++) {
      cells.push(
        <CalendarCell
          key={`next-${i}`}
          isCurrentMonth={false}
          hasEntry={false}
          isSelected={false}
          isToday={false}
          onClick={() => {}}
        >
          <DateNumber>{i}</DateNumber>
        </CalendarCell>
      );
    }

    // 如果总单元格数少于 35 (5行 * 7列)，补足空行以保持高度稳定
    while (cells.length < 35) {
      const fillDay = cells.length - totalCells + remainingCells + 1;
      cells.push(
        <CalendarCell
          key={`fill-${cells.length}`}
          isCurrentMonth={false}
          hasEntry={false}
          isSelected={false}
          isToday={false}
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <DateNumber>{fillDay}</DateNumber>
        </CalendarCell>
      );
    }

    return cells;
  };

  // 获取心情中文名称
  const getMoodLabel = (mood: string): string => {
    const labels: { [key: string]: string } = {
      happy: '开心',
      joyful: '愉悦',
      reflective: '沉思',
      accomplished: '成就感',
      excited: '兴奋',
    };
    return labels[mood] || mood;
  };

  // 渲染详情部分
  const renderDiaryDetail = () => {
    if (isDetailLoading) {
      return renderLoading();
    }
    
    if (error) {
      return renderError();
    }
    
    if (!selectedDiary) {
      return <p>无法加载此日记。</p>;
    }
    
    // 检查是否是空日记（没有日记记录的日期）
    if ((selectedDiary as any).isEmpty) {
      return (
        <EmptyDiaryMessage>
          <h3>{selectedDiary.date} 没有日记记录</h3>
          <p>这一天还没有添加日记内容。您可以返回日历查看其他日期，或者等待未来添加此日期的日记。</p>
        </EmptyDiaryMessage>
      );
    }
    
    // 有日记记录，显示正常的日记详情
    return (
      <DiaryDetailView>
        <DiaryHeader>
          <DiaryTitle>{selectedDiary.title}</DiaryTitle>
          <DiaryDate>{selectedDiary.date}</DiaryDate>
        </DiaryHeader>
        <DiaryContent>{selectedDiary.content}</DiaryContent>
        <MoodTag mood={selectedDiary.mood}>
          {getMoodLabel(selectedDiary.mood)}
        </MoodTag>
      </DiaryDetailView>
    );
  };

  return (
    <DiaryContainer>
      <PageTitle initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        我的日记本
      </PageTitle>

      <AnimatePresence mode="wait">
        {view === 'calendar' && (
          <motion.div key="calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MonthNavigation>
              <NavButton onClick={goToPrevMonth} aria-label="上个月">
                <TypedFaChevronLeft />
              </NavButton>
              <MonthTitle>
                {currentYear}年 {currentMonth + 1}月
              </MonthTitle>
              <NavButton onClick={goToNextMonth} aria-label="下个月">
                <TypedFaChevronRight />
              </NavButton>
            </MonthNavigation>

            {isLoading && renderLoading()}
            {error && !isLoading && renderError()}

            {!isLoading && !error && (
              <CalendarView>
                <WeekdayHeader>日</WeekdayHeader>
                <WeekdayHeader>一</WeekdayHeader>
                <WeekdayHeader>二</WeekdayHeader>
                <WeekdayHeader>三</WeekdayHeader>
                <WeekdayHeader>四</WeekdayHeader>
                <WeekdayHeader>五</WeekdayHeader>
                <WeekdayHeader>六</WeekdayHeader>
                {renderCalendarCells()}
              </CalendarView>
            )}
          </motion.div>
        )}

        {view === 'detail' && (
          <motion.div key="detail" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
             <BackButton onClick={backToCalendar}>
               <TypedFaArrowLeft /> 返回日历
             </BackButton>
             {renderDiaryDetail()}
          </motion.div>
        )}
      </AnimatePresence>
    </DiaryContainer>
  );
};

export default Diary; 