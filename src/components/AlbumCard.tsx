import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCamera, FiCalendar } from 'react-icons/fi';
import { Album } from '../services/albumService';

interface AlbumCardProps {
  album: Album;
  onClick: () => void;
}

const CardWrapper = styled(motion.div)`
  background: linear-gradient(135deg, #fff8f3 0%, #ffeef8 50%, #f0f8ff 100%);
  border-radius: 20px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 182, 193, 0.2);
  box-shadow: 0 8px 20px rgba(255, 105, 180, 0.1);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(255, 105, 180, 0.2);
    border-color: rgba(255, 105, 180, 0.4);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ff69b4, #ff8a80, #ffb6c1);
    border-radius: 20px 20px 0 0;
  }
`;

const CoverArea = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd9 50%, #e1bee7 100%);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%);
  }
`;

const CoverIcon = styled.div`
  color: #d63384;
  font-size: 3rem;
  margin-bottom: 10px;
  z-index: 1;
  opacity: 0.8;
`;

const CoverText = styled.div`
  color: #8e44ad;
  font-size: 0.9rem;
  font-weight: 500;
  z-index: 1;
  text-align: center;
`;

const AlbumInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AlbumName = styled.h3`
  color: #d63384;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AlbumDescription = styled.p`
  color: #8e44ad;
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.4;
  opacity: 0.8;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const AlbumMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #c39bd3;
  font-size: 0.75rem;
  margin-top: 5px;
`;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const AlbumCard: React.FC<AlbumCardProps> = ({ album, onClick }) => {
  const cardVariants = {
    hover: {
      y: -8,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <CardWrapper
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CoverArea>
        <CoverIcon>
          {(FiCamera as any)()}
        </CoverIcon>
        <CoverText>点击查看回忆</CoverText>
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
          {(FiCalendar as any)({ size: 12 })}
          创建于 {formatDate(album.created_at)}
        </AlbumMeta>
      </AlbumInfo>
    </CardWrapper>
  );
};

export default AlbumCard; 