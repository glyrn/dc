import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiHeart, FiCamera } from 'react-icons/fi';

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description?: string) => void;
  loading?: boolean;
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(135deg, #ffeef8 0%, #fff5f0 100%);
  border-radius: 20px;
  padding: 30px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  position: relative;
  border: 1px solid rgba(255, 182, 193, 0.3);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  cursor: pointer;
  color: #ff69b4;
  font-size: 20px;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(255, 105, 180, 0.1);
    transform: scale(1.1);
  }
`;

const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 25px;
`;

const ModalIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ff69b4, #ff8a80);
  border-radius: 50%;
  margin: 0 auto 15px;
  color: white;
  font-size: 24px;
  box-shadow: 0 8px 16px rgba(255, 105, 180, 0.3);
`;

const ModalTitle = styled.h2`
  color: #d63384;
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
`;

const TitleIcon = styled.span`
  margin-left: 8px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #8e44ad;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 2px solid #f8bbd9;
  border-radius: 12px;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  
  &:focus {
    outline: none;
    border-color: #ff69b4;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
    background-color: white;
  }
  
  &::placeholder {
    color: #c39bd3;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 2px solid #f8bbd9;
  border-radius: 12px;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #ff69b4;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
    background-color: white;
  }
  
  &::placeholder {
    color: #c39bd3;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;

const Button = styled(motion.button)<{ $variant?: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  
  ${props => props.$variant === 'primary' ? `
    background: linear-gradient(135deg, #ff69b4, #ff8a80);
    color: white;
    box-shadow: 0 4px 12px rgba(255, 105, 180, 0.3);
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(255, 105, 180, 0.4);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  ` : `
    background-color: rgba(255, 105, 180, 0.1);
    color: #d63384;
    border: 1px solid rgba(255, 105, 180, 0.3);
    
    &:hover {
      background-color: rgba(255, 105, 180, 0.2);
    }
  `}
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const CreateAlbumModal: React.FC<CreateAlbumModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading = false 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim(), description.trim() || undefined);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setName('');
      setDescription('');
      onClose();
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
        >
          <ModalContent
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={handleClose} disabled={loading}>
              {(FiX as any)()}
            </CloseButton>
            
            <ModalHeader>
              <ModalIcon>
                {(FiCamera as any)()}
              </ModalIcon>
              <ModalTitle>
                创建新相册
                <TitleIcon>
                  {(FiHeart as any)({ size: 14 })}
                </TitleIcon>
              </ModalTitle>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Label>
                  {(FiHeart as any)({ size: 14 })}
                  相册名称
                </Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="给这本相册起个温馨的名字..."
                  maxLength={50}
                  required
                  disabled={loading}
                />
              </InputGroup>

              <InputGroup>
                <Label>
                  相册描述（可选）
                </Label>
                <TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="记录下这本相册的特殊意义..."
                  maxLength={200}
                  disabled={loading}
                />
              </InputGroup>

              <ButtonGroup>
                <Button
                  type="button"
                  $variant="secondary"
                  onClick={handleClose}
                  disabled={loading}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  $variant="primary"
                  disabled={!name.trim() || loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading && <LoadingSpinner />}
                  {loading ? '创建中...' : '创建相册'}
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );
};

export default CreateAlbumModal; 