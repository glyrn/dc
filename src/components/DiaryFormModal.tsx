import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTimes, FaSpinner } from 'react-icons/fa';

interface DiaryEntry {
  date: string;
  title: string;
  content: string;
  mood: string;
  isEmpty?: boolean; // Reuse existing type
}

interface DiaryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<DiaryEntry, 'isEmpty'>) => Promise<void>; // Omit internal flag
  initialData?: DiaryEntry | null; // For editing
  date: string; // Always required for context
  isLoading: boolean;
}

// Add typed wrappers for icons used in this component
const TypedFaTimes = FaTimes as React.FC<any>;
const TypedFaSpinner = FaSpinner as React.FC<any>;

// Modal Overlay
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
`;

// Modal Content
const ModalContent = styled(motion.div)`
  background: white;
  padding: 30px 40px;
  border-radius: 16px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 550px;
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;

  h2 {
    margin: 0;
    font-size: 1.6rem;
    color: var(--secondary-color, #333);
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #aaa;
  transition: color 0.2s ease;

  &:hover {
    color: #333;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--accent-color, #6c5ce7);
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
  }
`;

const Textarea = styled.textarea`
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--accent-color, #6c5ce7);
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--accent-color, #6c5ce7);
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
  }
`;

const SubmitButton = styled.button`
  padding: 14px 20px;
  background-color: var(--accent-color, #6c5ce7);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #5a4cdb;
  }
  
  &:active {
      transform: scale(0.98);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 0.9rem;
    margin-top: 5px;
`;

// Mapping from mood keys to display names
const moodOptions: { [key: string]: string } = {
    happy: '开心',
    joyful: '愉悦',
    reflective: '沉思',
    accomplished: '成就感',
    excited: '兴奋',
    calm: '平静',
    tired: '疲惫',
    sad: '失落',
    neutral: '一般' // Added neutral
};


const DiaryFormModal: React.FC<DiaryFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  date,
  isLoading,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('neutral'); // Default mood
  const [formError, setFormError] = useState<string | null>(null);

  const isEditing = !!initialData && !initialData.isEmpty;

  useEffect(() => {
    if (isEditing && initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setMood(initialData.mood);
      setFormError(null); // Clear errors on open/mode change
    } else {
      // Reset form for new entry
      setTitle('');
      setContent('');
      setMood('neutral');
      setFormError(null);
    }
  }, [isOpen, isEditing, initialData]); // Rerun effect when modal opens or mode changes


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null); // Clear previous errors

    if (!title.trim() || !content.trim()) {
        setFormError("标题和内容不能为空。");
        return;
    }

    const diaryData = {
      date: date, // Use the provided date
      title: title.trim(),
      content: content.trim(),
      mood: mood,
    };

    try {
        await onSubmit(diaryData);
        // Let the parent handle closing and state updates
    } catch (error: any) {
        console.error("Form submission error:", error);
        setFormError(error.message || "提交日记时发生错误，请重试。");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalContent
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <ModalHeader>
          <h2>{isEditing ? '编辑日记' : '写新日记'} - {date}</h2>
          <CloseButton onClick={onClose} aria-label="关闭">
            <TypedFaTimes />
          </CloseButton>
        </ModalHeader>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">标题</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="content">内容</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={isLoading}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="mood">心情</Label>
            <Select
              id="mood"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              disabled={isLoading}
            >
              {Object.entries(moodOptions).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
              ))}
            </Select>
          </FormGroup>
          {formError && <ErrorMessage>{formError}</ErrorMessage>}
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? <TypedFaSpinner className="spin" /> : null}
            {isEditing ? '更新日记' : '保存日记'}
          </SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default DiaryFormModal; 