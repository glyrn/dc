import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiUpload, FiX, FiChevronLeft, FiChevronRight, FiImage } from 'react-icons/fi';
import { Album, AlbumImage } from '../services/albumService';

interface AlbumDetailProps {
  album: Album;
  images: AlbumImage[];
  onBack: () => void;
  onUpload: (files: FileList) => void;
  uploading: boolean;
}

const Container = styled.div`
  padding: 60px 20px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
  color: #333;
  min-height: calc(100vh - 60px);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #dee2e6; // 浅色边框
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const BackButton = styled(motion.button)`
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #0056b3, #007bff);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
  }
`;

const AlbumTitle = styled.h1`
  color: #212529;
  font-size: 1.8rem; // 调整字号
  font-weight: 600;
  margin: 0;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
`;

const UploadButton = styled(motion.label)`
  background: linear-gradient(135deg, #007bff, #0056b3); // 蓝色系上传按钮
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #0056b3, #007bff);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
  }
  
  &[aria-disabled="true"] {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
    background: #6c757d;
    box-shadow: none;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); // 可以调整图片大小
  gap: 15px;
  margin-top: 20px;
`;

const PhotoCard = styled(motion.div)`
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
  aspect-ratio: 1 / 1; // 保持卡片为正方形，可调整
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const PhotoWrapper = styled.div`
  width: 100%;
  height: 100%; // 修改为100%以配合aspect-ratio
  position: relative;
  overflow: hidden;
`;

const Photo = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${PhotoCard}:hover & {
    transform: scale(1.05);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
`;

const EmptyIcon = styled.div`
  font-size: 3.5rem;
  margin-bottom: 15px;
  opacity: 0.7;
  color: #adb5bd;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  margin: 0;
  line-height: 1.5;
  color: #495057;
`;

// 大图查看模态框
const ImageModal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 10px;
`;

const CloseModalButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const NavButton = styled.button<{ $direction: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  ${props => props.$direction}: 20px;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: white;
  cursor: pointer;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const AlbumDetail: React.FC<AlbumDetailProps> = ({ 
  album, 
  images, 
  onBack, 
  onUpload, 
  uploading 
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files);
    }
    // 清空输入，允许重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    setSelectedImageIndex(prev => {
      if (prev === null) return null;
      
      if (direction === 'prev') {
        return prev > 0 ? prev - 1 : images.length - 1;
      } else {
        return prev < images.length - 1 ? prev + 1 : 0;
      }
    });
  }, [images.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        navigateImage('prev');
        break;
      case 'ArrowRight':
        navigateImage('next');
        break;
      case 'Escape':
        closeModal();
        break;
    }
  }, [navigateImage]);

  React.useEffect(() => {
    if (selectedImageIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedImageIndex, handleKeyDown]);

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {(FiArrowLeft as any)()}
          </BackButton>
          <AlbumTitle>{album.name}</AlbumTitle>
        </HeaderLeft>
        
        <UploadButton
          as="label"
          aria-disabled={uploading}
          whileHover={{ scale: uploading ? 1 : 1.05 }}
          whileTap={{ scale: uploading ? 1 : 0.95 }}
        >
          {(FiUpload as any)()}
          {uploading ? '上传中...' : '添加照片'}
          <HiddenInput
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </UploadButton>
      </Header>

      {images.length > 0 ? (
        <PhotoGrid>
          {images.map((image, index) => (
            <PhotoCard
              key={`${image.url}-${index}`}
              onClick={() => handleImageClick(index)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PhotoWrapper>
                <Photo
                  src={image.url}
                  alt={image.filename}
                  loading="lazy"
                />
              </PhotoWrapper>
            </PhotoCard>
          ))}
        </PhotoGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>
            {(FiImage as any)()}
          </EmptyIcon>
          <EmptyText>
            这个相册还没有照片<br />
            点击"添加照片"按钮开始记录美好回忆吧！
          </EmptyText>
        </EmptyState>
      )}

      {/* 大图查看模态框 */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <ImageModal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <CloseModalButton onClick={closeModal}>
              {(FiX as any)()}
            </CloseModalButton>
            
            {images.length > 1 && (
              <>
                <NavButton
                  $direction="left"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  disabled={images.length <= 1}
                >
                  {(FiChevronLeft as any)()}
                </NavButton>
                
                <NavButton
                  $direction="right"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  disabled={images.length <= 1}
                >
                  {(FiChevronRight as any)()}
                </NavButton>
              </>
            )}
            
            <ModalImage
              src={images[selectedImageIndex].url}
              alt={images[selectedImageIndex].filename}
              onClick={(e) => e.stopPropagation()}
            />
          </ImageModal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default AlbumDetail; 