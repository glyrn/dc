import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
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

const BackButton = styled.button`
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

const UploadButton = styled.label`
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

const PhotoCard = styled.div`
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
interface ModalProps {
  visible: boolean;
}

const ImageModal = styled.div<ModalProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: ${props => props.visible ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
  transition: opacity 0.3s ease;
  opacity: ${props => props.visible ? 1 : 0};
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

interface NavButtonProps {
  direction: 'left' | 'right';
}

const NavButton = styled.button<NavButtonProps>`
  position: absolute;
  top: 50%;
  ${props => props.direction === 'left' ? 'left: 20px;' : 'right: 20px;'}
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

interface LazyImageProps {
  src: string;
  alt: string;
  onClick: () => void;
}

// 添加图片错误处理和懒加载功能
const LazyImage: React.FC<LazyImageProps> = ({ src, alt, onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const img = imgRef.current;
          if (img && !img.src) {
            img.src = src;
          }
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <PhotoWrapper>
      {!isLoaded && !hasError && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          {FiImage({ size: 24, color: "#adb5bd" })}
        </div>
      )}

      {hasError && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: '#f8d7da',
          padding: '10px'
        }}>
          {FiX({ size: 24, color: "#dc3545" })}
          <p style={{ fontSize: '12px', marginTop: '8px', color: '#842029', textAlign: 'center' }}>
            加载失败
          </p>
        </div>
      )}

      <Photo
        ref={imgRef}
        alt={alt}
        onClick={onClick}
        onLoad={handleLoad}
        onError={handleError}
        style={{ display: hasError ? 'none' : 'block' }}
      />
    </PhotoWrapper>
  );
};

const AlbumDetail: React.FC<AlbumDetailProps> = ({ 
  album, 
  images, 
  onBack, 
  onUpload, 
  uploading 
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files);
    }
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!images || images.length === 0) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = (selectedImageIndex! + 1) % images.length;
    } else {
      newIndex = (selectedImageIndex! - 1 + images.length) % images.length;
    }
    
    setSelectedImageIndex(newIndex);
  };

  // 当模态框隐藏后，延迟释放selectedImageIndex
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!showModal) {
      timer = setTimeout(() => {
        setSelectedImageIndex(null);
      }, 300);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showModal]);

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={onBack}>
            {FiArrowLeft({ style: { marginRight: '8px' } })} 返回
          </BackButton>
          <AlbumTitle>{album.name}</AlbumTitle>
        </HeaderLeft>
        
        <UploadButton aria-disabled={uploading}>
          {FiUpload({})}
          <span>{uploading ? '上传中...' : '上传图片'}</span>
          <HiddenInput
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
            ref={fileInputRef}
          />
        </UploadButton>
      </Header>
      
      {images.length === 0 ? (
        <EmptyState>
          <EmptyIcon>
            {FiImage({})}
          </EmptyIcon>
          <EmptyText>这个相册还没有图片，点击"上传图片"按钮添加您的第一张照片吧！</EmptyText>
        </EmptyState>
      ) : (
        <PhotoGrid>
          {images.map((image, index) => (
            <PhotoCard key={image.url}>
              <LazyImage
                src={image.url}
                alt={image.filename || '照片'}
                onClick={() => handleImageClick(index)}
              />
            </PhotoCard>
          ))}
        </PhotoGrid>
      )}
      
      {selectedImageIndex !== null && (
        <ImageModal visible={showModal}>
          <CloseModalButton onClick={closeModal}>
            {FiX({})}
          </CloseModalButton>
          
          <NavButton
            direction="left"
            onClick={() => navigateImage('prev')}
            disabled={images.length <= 1}
          >
            {FiChevronLeft({})}
          </NavButton>
          
          <ModalImage
            src={images[selectedImageIndex]?.url}
            alt={images[selectedImageIndex]?.filename || '照片'}
          />
          
          <NavButton
            direction="right"
            onClick={() => navigateImage('next')}
            disabled={images.length <= 1}
          >
            {FiChevronRight({})}
          </NavButton>
        </ImageModal>
      )}
    </Container>
  );
};

export default AlbumDetail; 