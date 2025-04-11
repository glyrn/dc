import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// 悄悄话按钮
const WhisperButton = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  z-index: 100;
`;

// 弹窗背景
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;

// 弹窗容器
const ModalContainer = styled(motion.div)`
  background-color: white;
  border-radius: 12px;
  padding: 25px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
`;

// 弹窗标题
const ModalTitle = styled.h3`
  font-size: 1.4rem;
  margin-bottom: 20px;
  color: var(--text-color);
`;

// 弹窗关闭按钮
const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #888;
  
  &:hover {
    color: #333;
  }
`;

// 文本输入框
const TextArea = styled.textarea`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 15px;
  resize: none;
  font-size: 1rem;
  font-family: inherit;
  height: 120px;
  transition: border-color 0.2s;
  margin-bottom: 20px;
  
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
  padding: 12px 20px;
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

// 按钮容器
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

// 取消按钮
const CancelButton = styled(motion.button)`
  background-color: #f2f2f2;
  color: #666;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 1rem;
  cursor: pointer;
`;

// 消息计数
const CharCount = styled.div<{ $isWarning: boolean }>`
  text-align: right;
  margin-bottom: 10px;
  font-size: 0.8rem;
  color: ${props => props.$isWarning ? '#e53e3e' : '#aaa'};
`;

interface WhisperInputProps {
  onSend: (message: string) => Promise<void>;
  isLoading: boolean;
}

const WhisperInput: React.FC<WhisperInputProps> = ({ onSend, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  const handleSubmit = async () => {
    if (message.trim() && !isLoading) {
      try {
        await onSend(message.trim());
        setMessage(''); // 清空输入框
        setIsModalOpen(false); // 关闭弹窗
      } catch (error) {
        console.error('发送悄悄话失败:', error);
        // 错误处理可以在这里实现，例如显示错误提示
      }
    }
  };
  
  // 打开弹窗
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  // 关闭弹窗
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMessage(''); // 清空输入框
  };
  
  // 计算剩余字数
  const remainingChars = maxLength - message.length;
  const isNearLimit = remainingChars <= 20;
  
  return (
    <>
      <WhisperButton
        onClick={handleOpenModal}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </WhisperButton>
      
      <AnimatePresence>
        {isModalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseModal}
          >
            <ModalContainer
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()} // 防止点击内容区域关闭弹窗
            >
              <ModalTitle>发送悄悄话</ModalTitle>
              
              <TextArea
                value={message}
                onChange={handleInputChange}
                placeholder="在这里输入你的悄悄话..."
                disabled={isLoading}
                autoFocus
              />
              
              <CharCount $isWarning={isNearLimit}>
                {remainingChars}/{maxLength}
              </CharCount>
              
              <ButtonContainer>
                <CancelButton
                  onClick={handleCloseModal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  取消
                </CancelButton>
                <SendButton
                  onClick={handleSubmit}
                  disabled={!message.trim() || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? '发送中...' : '发送'}
                </SendButton>
              </ButtonContainer>
            </ModalContainer>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default WhisperInput; 