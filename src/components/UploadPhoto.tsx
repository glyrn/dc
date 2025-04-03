import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// 创建自定义图标容器
const IconContainer = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ccc;
`;

const UploadContainer = styled.div`
  padding: 4rem 0;
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 1px;
    background-color: var(--accent-color);
  }
`;

const Form = styled.form`
  background-color: white;
  padding: 2.5rem;
  border-radius: 10px;
  box-shadow: var(--box-shadow);
`;

const DropArea = styled.div<{ isDragging: boolean, hasFile: boolean }>`
  border: 2px dashed ${props => props.isDragging ? 'var(--accent-color)' : '#ddd'};
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  background-color: ${props => props.isDragging ? 'rgba(212, 175, 55, 0.05)' : 'transparent'};
  position: relative;
  
  &:hover {
    border-color: var(--accent-color);
    background-color: rgba(212, 175, 55, 0.05);
  }
`;

const UploadIconWrapper = styled.div`
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const UploadSubText = styled.p`
  font-size: 0.9rem;
  color: #999;
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewContainer = styled.div`
  margin-bottom: 2rem;
  position: relative;
`;

const Preview = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: var(--box-shadow);
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: var(--transition);
  
  &:hover {
    background-color: white;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  color: var(--secondary-color);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: var(--font-sans);
  font-size: 1rem;
  transition: var(--transition);
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-family: var(--font-sans);
  font-size: 1rem;
  transition: var(--transition);
  min-height: 150px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 5px;
  font-family: var(--font-sans);
  font-size: 1.1rem;
  cursor: pointer;
  transition: var(--transition);
  
  &:hover {
    background-color: #c19e2d;
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled(motion.div)`
  background-color: #e6f7e6;
  color: #2e7d32;
  padding: 1rem;
  border-radius: 5px;
  text-align: center;
  margin-top: 1rem;
`;

const UploadPhoto: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('请选择图片文件！');
    }
  };
  
  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title || !location || !date) {
      alert('请填写所有必填字段！');
      return;
    }
    
    setIsSubmitting(true);
    
    // 模拟上传过程
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // 重置表单
      setTimeout(() => {
        setFile(null);
        setPreview(null);
        setTitle('');
        setLocation('');
        setDate('');
        setDescription('');
        setIsSuccess(false);
      }, 3000);
    }, 1500);
  };
  
  return (
    <UploadContainer>
      <Title>上传照片</Title>
      <Form onSubmit={handleSubmit}>
        <DropArea
          isDragging={isDragging}
          hasFile={!!file}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadIconWrapper>
            <IconContainer>📤</IconContainer>
          </UploadIconWrapper>
          <UploadText>点击或拖拽照片到这里上传</UploadText>
          <UploadSubText>支持 JPG、PNG 格式</UploadSubText>
          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
          />
        </DropArea>
        
        {preview && (
          <PreviewContainer>
            <Preview src={preview} alt="预览" />
            <RemoveButton onClick={removeFile}>×</RemoveButton>
          </PreviewContainer>
        )}
        
        <InputGroup>
          <Label htmlFor="title">标题 *</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="给这张照片起个名字..."
            required
          />
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="location">位置 *</Label>
          <Input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="这张照片在哪里拍摄的？"
            required
          />
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="date">日期 *</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </InputGroup>
        
        <InputGroup>
          <Label htmlFor="description">描述</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="记录下这一刻的故事和感受..."
          />
        </InputGroup>
        
        <SubmitButton
          type="submit"
          disabled={isSubmitting || !file || !title || !location || !date}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? '上传中...' : '上传照片'}
        </SubmitButton>
        
        {isSuccess && (
          <SuccessMessage
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            照片上传成功！
          </SuccessMessage>
        )}
      </Form>
    </UploadContainer>
  );
};

export default UploadPhoto; 