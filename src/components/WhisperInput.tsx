import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// 输入框容器
const InputContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px 20px;
  z-index: 100;
`;

// 输入框的表单
const Form = styled.form`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  gap: 10px;
`;

// 文本输入框
const TextArea = styled.textarea`
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 15px;
  resize: none;
  font-size: 1rem;
  font-family: inherit;
  height: 60px;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

// 发送按钮
const SendButton = styled(motion.button)`
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

// 消息计数
const CharCount = styled.div<{ $isWarning: boolean }>`
  position: absolute;
  right: 30px;
  bottom: 10px;
  font-size: 0.8rem;
  color: ${props => props.$isWarning ? '#e53e3e' : '#aaa'};
`;

interface WhisperInputProps {
  onSend: (message: string) => Promise<void>;
  isLoading: boolean;
}

const WhisperInput: React.FC<WhisperInputProps> = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');
  const maxLength = 200; // 最大字数限制
  
  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // 限制输入长度不超过最大值
    if (value.length <= maxLength) {
      setMessage(value);
    }
  };
  
  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !isLoading) {
      try {
        await onSend(message.trim());
        setMessage(''); // 清空输入框
      } catch (error) {
        console.error('发送悄悄话失败:', error);
        // 错误处理可以在这里实现，例如显示错误提示
      }
    }
  };
  
  // 计算剩余字数
  const remainingChars = maxLength - message.length;
  const isNearLimit = remainingChars <= 20;
  
  return (
    <InputContainer>
      <Form onSubmit={handleSubmit}>
        <TextArea
          value={message}
          onChange={handleInputChange}
          placeholder="在这里输入你的悄悄话..."
          disabled={isLoading}
        />
        <SendButton
          type="submit"
          disabled={!message.trim() || isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? '发送中...' : '发送'}
        </SendButton>
      </Form>
      <CharCount $isWarning={isNearLimit}>
        {remainingChars}/{maxLength}
      </CharCount>
    </InputContainer>
  );
};

export default WhisperInput; 