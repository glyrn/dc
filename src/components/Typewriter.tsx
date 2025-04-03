import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TypewriterWrapper = styled.span`
  display: inline-block;
  position: relative;
`;

const Cursor = styled.span`
  display: inline-block;
  position: relative;
  margin-left: 2px;
  font-weight: 400;
  color: var(--secondary-color);
  animation: blink 1s step-start infinite;
  
  @keyframes blink {
    from, to {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`;

interface TypewriterProps {
  text: string;
  delay?: number;
  onComplete?: () => void;
  className?: string;
}

const Typewriter: React.FC<TypewriterProps> = ({ 
  text, 
  delay = 100, 
  onComplete,
  className
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // 重置状态当文本改变时
    setDisplayText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    // 如果打字完成
    if (currentIndex === text.length) {
      setIsComplete(true);
      onComplete && onComplete();
      return;
    }

    // 设置定时器添加下一个字符
    const timeout = setTimeout(() => {
      setDisplayText(prev => prev + text[currentIndex]);
      setCurrentIndex(prevIndex => prevIndex + 1);
    }, delay);

    // 清理定时器
    return () => clearTimeout(timeout);
  }, [currentIndex, delay, text, onComplete]);

  return (
    <TypewriterWrapper className={className}>
      {displayText}
      <Cursor>|</Cursor>
    </TypewriterWrapper>
  );
};

export default Typewriter; 