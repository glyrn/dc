import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiPlusSquare, FiType, FiFileText } from 'react-icons/fi';

interface CreateAlbumModalProps {
  onClose: () => void;
  onCreate: (name: string, description?: string) => void | Promise<void>;
  isCreating: boolean;
}

const ModalOverlay = styled.div`
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
  animation: fadeIn 0.2s ease-out forwards;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 30px 35px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  animation: slideUp 0.3s ease-out forwards;

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
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
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
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
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
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

interface ButtonProps {
  variant?: 'primary' | 'secondary';
}

const Button = styled.button<ButtonProps>`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease, transform 0.1s ease;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  
  ${props => props.variant === 'primary' ? `
    background-color: #007bff;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: #0056b3;
    }
    
    &:disabled {
      background-color: #b8d9ff;
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
  onClose, 
  onCreate, 
  isCreating 
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), description.trim() || undefined);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          {FiX({})}
        </CloseButton>
        
        <ModalHeader>
          <ModalTitle>创建新相册</ModalTitle>
        </ModalHeader>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="album-name">
              {FiType({})} 相册名称
            </Label>
            <Input
              id="album-name"
              type="text"
              placeholder="给相册起个名字吧..."
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="album-description">
              {FiFileText({})} 相册描述（可选）
            </Label>
            <TextArea
              id="album-description"
              placeholder="写下这个相册的简介..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={200}
            />
          </InputGroup>
          
          <ButtonGroup>
            <Button 
              type="button" 
              onClick={onClose}
            >
              取消
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isCreating || !name.trim()}
            >
              {isCreating && <LoadingSpinner />}
              {isCreating ? '创建中...' : (
                <>
                  {FiPlusSquare({ style: { marginRight: '8px' } })}
                  创建相册
                </>
              )}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateAlbumModal; 