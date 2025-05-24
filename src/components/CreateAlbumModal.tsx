import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlusSquare, FiType, FiFileText } from 'react-icons/fi';

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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 30px 35px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  cursor: pointer;
  color: #adb5bd;
  font-size: 1.5rem;
  padding: 5px;
  border-radius: 50%;
  transition: color 0.2s ease, background-color 0.2s ease;
  
  &:hover {
    color: #495057;
    background-color: #e9ecef;
  }
`;

const ModalHeader = styled.div`
  text-align: center;
  margin-bottom: 25px;
`;

const ModalTitle = styled.h2`
  color: #212529;
  font-size: 1.6rem;
  margin: 0;
  font-weight: 600;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
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
  color: #495057;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f8f9fa;
  color: #343a40;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  
  &:focus {
    outline: none;
    border-color: #fd7e14;
    box-shadow: 0 0 0 0.2rem rgba(253, 126, 20, 0.25);
    background-color: #fff;
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 16px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 1rem;
  background-color: #f8f9fa;
  color: #343a40;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #fd7e14;
    box-shadow: 0 0 0 0.2rem rgba(253, 126, 20, 0.25);
    background-color: #fff;
  }
  
  &::placeholder {
    color: #adb5bd;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 15px;
  justify-content: flex-end;
`;

const Button = styled(motion.button)<{ $variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease, transform 0.1s ease;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  
  ${props => props.$variant === 'primary' ? `
    background-color: #fd7e14;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #e67e22;
    }
    
    &:disabled {
      background-color: #ffccbc;
      opacity: 0.7;
      cursor: not-allowed;
    }
  ` : `
    background-color: #e9ecef;
    color: #495057;
    border: 1px solid #dee2e6;

    &:hover:not(:disabled) {
      background-color: #ced4da;
    }
  `}
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
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
              <ModalTitle>
                创建新相册
              </ModalTitle>
            </ModalHeader>

            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Label htmlFor="albumName">
                  {(FiType as any)({ size: 16, style: { marginRight: '4px' } })}
                  相册名称
                </Label>
                <Input
                  id="albumName"
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
                <Label htmlFor="albumDescription">
                  {(FiFileText as any)({ size: 16, style: { marginRight: '4px' } })}
                  相册描述（可选）
                </Label>
                <TextArea
                  id="albumDescription"
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