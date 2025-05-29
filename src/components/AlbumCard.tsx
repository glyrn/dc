import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FiCalendar, FiHeart, FiImage } from 'react-icons/fi';
import { Album, AlbumImage } from '../services/albumService';

interface AlbumWithCoverImages extends Album {
  coverImages?: AlbumImage[];
}

interface AlbumCardProps {
  album: AlbumWithCoverImages;
  onClick: () => void;
}

const CardWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
`;

const CoverArea = styled.div`
  width: 100%;
  padding-top: 75%;
  position: relative;
  background-color: #e9ecef;
  overflow: hidden;
`;

const CarouselImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.7s ease-in-out;
  
  &.active {
    opacity: 1;
  }
`;

const PlaceholderIconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  color: #cccccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const PlaceholderText = styled.span`
  font-size: 0.9rem;
  color: #aaaaaa;
  margin-top: 8px;
`;

const AlbumInfo = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const AlbumName = styled.h3`
  color: #333333;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AlbumDescription = styled.p`
  color: #757575;
  font-size: 0.85rem;
  margin: 0 0 12px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-height: calc(0.85rem * 1.4 * 2);
`;

const AlbumMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #757575;
  font-size: 0.8rem;
  margin-top: auto;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const HeartIconWrapper = styled.div`
  margin-left: auto;
  color: #bdc3c7;
  font-size: 1.1rem;
  
  &:hover {
    color: #e74c3c;
  }
`;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '-');
};

const AlbumCard: React.FC<AlbumCardProps> = ({ album, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const coverImages = album.coverImages || [];
  const observerRef = useRef<IntersectionObserver | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // 使用IntersectionObserver实现懒加载
  useEffect(() => {
    if (cardRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      }, { threshold: 0.1 });
      
      observerRef.current.observe(cardRef.current);
    }
    
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // 轮播逻辑，只有在视图中才激活
  useEffect(() => {
    if (!isInView || coverImages.length <= 1) return;
    
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % coverImages.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [coverImages.length, isInView]);

  return (
    <CardWrapper
      onClick={onClick}
      ref={cardRef}
    >
      <CoverArea>
        {coverImages.length > 0 ? (
          coverImages.map((image, index) => (
            <CarouselImage
              key={`${image.url}-${index}`}
              src={isInView ? image.url : ''}
              alt={`${album.name} cover ${index + 1}`}
              className={index === currentImageIndex ? 'active' : ''}
              loading="lazy"
            />
          ))
        ) : (
          <PlaceholderIconWrapper>
            {FiImage({ size: 48 })}
            <PlaceholderText>暂无图片</PlaceholderText>
          </PlaceholderIconWrapper>
        )}
      </CoverArea>
      
      <AlbumInfo>
        <AlbumName title={album.name}>
          {album.name}
        </AlbumName>
        {album.description && (
          <AlbumDescription title={album.description}>
            {album.description}
          </AlbumDescription>
        )}
        <AlbumMeta>
          <MetaItem>
            {FiCalendar({ size: 14 })}
            <span>{formatDate(album.created_at)}</span>
          </MetaItem>
          <HeartIconWrapper>
            {FiHeart({ size: 18 })}
          </HeartIconWrapper>
        </AlbumMeta>
      </AlbumInfo>
    </CardWrapper>
  );
};

export default AlbumCard; 