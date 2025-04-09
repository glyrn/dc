import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import diaryService from '../services/diaryService';

// 定义日记数据类型
interface DiaryEntry {
  date: string;
  title: string;
  content: string;
  mood: string;
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

const CalendarCell = styled.div<{ isCurrentMonth: boolean; hasEntry: boolean; isSelected: boolean }>`
  height: 80px;
  border-radius: 12px;
  padding: 8px;
  background-color: ${props => props.isSelected ? 'var(--accent-color, #6c5ce7)' : 'white'};
  color: ${props => props.isSelected ? 'white' : props.isCurrentMonth ? '#333' : '#aaa'};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: relative;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
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
  background-color: #FFF3F3;
  border-left: 4px solid #FF5252;
  padding: 15px 20px;
  margin: 20px 0;
  border-radius: 0 8px 8px 0;
  
  h3 {
    color: #D32F2F;
    margin-bottom: 5px;
    font-size: 1.1rem;
  }
  
  p {
    color: #555;
    font-size: 0.95rem;
  }
`;

// 周几标题
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

// 获取某月的天数
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

// 获取某月第一天是周几
const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

// 日记组件
const Diary: React.FC = () => {
  // 状态
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [entriesWithContent, setEntriesWithContent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 准备日历数据
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  
  // 准备上个月的数据（用于填充日历前几天）
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  
  // 格式化月份名称
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  
  // 加载当月有日记的日期
  useEffect(() => {
    const loadEntriesForMonth = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 获取当月所有日记
        const entries = await diaryService.getMonthEntries(year, month);
        
        // 提取有日记的日期
        const datesWithEntries = entries.map(entry => entry.date);
        setEntriesWithContent(datesWithEntries);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading diary entries:', err);
        setError('加载日记数据时发生错误，请稍后再试');
        setLoading(false);
      }
    };
    
    loadEntriesForMonth();
  }, [year, month]);
  
  // 处理日期点击
  const handleDateClick = async (dateStr: string) => {
    setSelectedDate(dateStr);
    
    try {
      setLoading(true);
      
      // 解析日期
      const [yearStr, monthStr, dayStr] = dateStr.split('-').map(str => parseInt(str, 10));
      const entry = await diaryService.getEntry(yearStr, monthStr - 1, dayStr);
      
      if (entry) {
        // 使用类型断言解决类型不匹配问题
        setSelectedEntry(entry as DiaryEntry);
        setShowDetail(true);
      } else {
        setSelectedEntry(null);
        setShowDetail(true); // 仍然显示详情页，但提示没有日记
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching diary entry:', err);
      setError('加载日记内容时发生错误');
      setLoading(false);
    }
  };
  
  // 前进到下个月
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  // 返回上个月
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  // 返回日历视图
  const backToCalendar = () => {
    setShowDetail(false);
    setError(null);
  };
  
  // 检查某日期是否有日记条目
  const hasEntryForDate = (dateStr: string) => {
    return entriesWithContent.includes(dateStr);
  };
  
  // 格式化日期为字符串 YYYY-MM-DD
  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  // 渲染加载状态
  const renderLoading = () => (
    <LoadingState
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.svg 
        viewBox="0 0 50 50" 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <circle 
          cx="25" cy="25" r="20" 
          fill="none" 
          stroke="var(--accent-color, #6c5ce7)" 
          strokeWidth="4"
          strokeDasharray="80, 125" 
        />
      </motion.svg>
      <p>加载中...</p>
    </LoadingState>
  );
  
  // 渲染错误状态
  const renderError = () => (
    <ErrorState
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
    >
      <h3>出错了</h3>
      <p>{error}</p>
    </ErrorState>
  );
  
  // 生成日历单元格
  const renderCalendarCells = () => {
    const cells = [];
    const today = new Date();
    const todayString = formatDate(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    
    // 添加上个月的天数（填充前几天）
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const prevMonthDay = daysInPrevMonth - i;
      const dateStr = formatDate(year, month - 1, prevMonthDay);
      const hasEntry = hasEntryForDate(dateStr);
      
      cells.push(
        <CalendarCell 
          key={`prev-${i}`} 
          isCurrentMonth={false}
          hasEntry={hasEntry}
          isSelected={dateStr === selectedDate}
          onClick={() => handleDateClick(dateStr)}
        >
          <DateNumber>{prevMonthDay}</DateNumber>
        </CalendarCell>
      );
    }
    
    // 添加当月的天数
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(year, month, day);
      const hasEntry = hasEntryForDate(dateStr);
      const isToday = dateStr === todayString;
      
      cells.push(
        <CalendarCell 
          key={`current-${day}`} 
          isCurrentMonth={true}
          hasEntry={hasEntry}
          isSelected={dateStr === selectedDate}
          onClick={() => handleDateClick(dateStr)}
        >
          <DateNumber className={isToday ? 'today' : ''}>{day}</DateNumber>
        </CalendarCell>
      );
    }
    
    // 添加下个月的天数（填充后几天）
    const totalCellsNeeded = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
    const nextMonthDays = totalCellsNeeded - (firstDayOfMonth + daysInMonth);
    
    for (let day = 1; day <= nextMonthDays; day++) {
      const dateStr = formatDate(year, month + 1, day);
      const hasEntry = hasEntryForDate(dateStr);
      
      cells.push(
        <CalendarCell 
          key={`next-${day}`} 
          isCurrentMonth={false}
          hasEntry={hasEntry}
          isSelected={dateStr === selectedDate}
          onClick={() => handleDateClick(dateStr)}
        >
          <DateNumber>{day}</DateNumber>
        </CalendarCell>
      );
    }
    
    return cells;
  };
  
  // 获取心情中文名称
  const getMoodLabel = (mood: string) => {
    switch(mood) {
      case 'happy': return '开心';
      case 'joyful': return '愉快';
      case 'reflective': return '沉思';
      case 'accomplished': return '成就感';
      case 'excited': return '兴奋';
      case 'calm': return '平静';
      case 'tired': return '疲惫';
      case 'sad': return '失落';
      default: return '平静';
    }
  };
  
  return (
    <DiaryContainer>
      {error && renderError()}
      
      <AnimatePresence mode="wait">
        {loading ? (
          renderLoading()
        ) : !showDetail ? (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <MonthNavigation>
              <NavButton onClick={goToPrevMonth}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </NavButton>
              <MonthTitle>{`${year}年${monthNames[month]}`}</MonthTitle>
              <NavButton onClick={goToNextMonth}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6L15 12L9 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </NavButton>
            </MonthNavigation>
            
            <CalendarView>
              {weekdays.map(day => (
                <WeekdayHeader key={day}>{day}</WeekdayHeader>
              ))}
              {renderCalendarCells()}
            </CalendarView>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
          >
            <BackButton onClick={backToCalendar}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              返回日历
            </BackButton>
            
            {selectedEntry ? (
              <DiaryDetailView>
                <DiaryHeader>
                  <DiaryTitle>{selectedEntry.title}</DiaryTitle>
                  <DiaryDate>{selectedEntry.date}</DiaryDate>
                </DiaryHeader>
                <DiaryContent>{selectedEntry.content}</DiaryContent>
                <MoodTag mood={selectedEntry.mood}>
                  {getMoodLabel(selectedEntry.mood)}
                </MoodTag>
              </DiaryDetailView>
            ) : (
              <DiaryDetailView>
                <DiaryTitle>这一天还没有日记</DiaryTitle>
                <DiaryContent>这一天还没有记录日记内容。</DiaryContent>
              </DiaryDetailView>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </DiaryContainer>
  );
};

export default Diary; 