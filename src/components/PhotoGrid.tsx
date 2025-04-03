import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// 创建自定义图标组件
const IconContainer = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  font-size: 14px;
`;

// 使用简单的HTML符号替代图标
const MapPinIcon = () => <IconContainer>📍</IconContainer>;
const CalendarIcon = () => <IconContainer>📅</IconContainer>;
const HeartFillIcon = () => <IconContainer>❤️</IconContainer>;
const HeartOutlineIcon = () => <IconContainer>🤍</IconContainer>;

// 示例照片数据
const photos = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1682687982204-f1a77dcc3067?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    title: '山间漫步',
    location: '黄山',
    date: '2023-06-15',
    description: '晴空万里，漫步在黄山之巅，感受自然的壮美。'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1682686581362-796d1b88ffb1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: '城市夜景',
    location: '上海',
    date: '2023-07-20',
    description: '灯火璀璨的城市夜景，似乎诉说着无数故事。'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1682687220208-22d7a2543e88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: '海边漫步',
    location: '厦门',
    date: '2023-08-05',
    description: '蔚蓝的海岸线，柔软的沙滩，海风轻抚面颊。'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1683009427666-340595e57e43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: '湖边野餐',
    location: '杭州',
    date: '2023-09-10',
    description: '静谧的湖边，铺上野餐垫，享受悠闲的午后时光。'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: '古镇散步',
    location: '乌镇',
    date: '2023-10-25',
    description: '青石板路，小桥流水，仿佛穿越时光的隧道。'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1682687220566-5599dbbebf11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    title: '雪中漫步',
    location: '哈尔滨',
    date: '2023-12-30',
    description: '纷飞的雪花，洁白的世界，留下我们的足迹。'
  }
];

const GridContainer = styled.div`
  width: 980px;
  max-width: 90%;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  
  @media (max-width: 990px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PhotoCard = styled(motion.div)`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: transform 0.5s cubic-bezier(0.33, 1, 0.68, 1);
  cursor: pointer;
  background-color: #fff;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  }
`;

const PhotoImage = styled.div<{ image: string }>`
  width: 100%;
  height: 260px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  transition: transform 2s cubic-bezier(0.19, 1, 0.22, 1);
  
  ${PhotoCard}:hover & {
    transform: scale(1.03);
  }
`;

const PhotoInfo = styled.div`
  padding: 1.2rem;
  background-color: white;
`;

const PhotoTitle = styled.h3`
  font-size: 19px;
  line-height: 1.21053;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: var(--secondary-color);
  letter-spacing: -0.022em;
`;

const PhotoMeta = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
  font-size: 14px;
  color: var(--gray-text);
  
  svg {
    margin-right: 5px;
  }
`;

const HeartButton = styled.button`
  background: none;
  border: none;
  font-size: 1.2rem;
  color: ${props => props.color};
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    opacity: 1;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.8rem;
  font-size: 14px;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  backdrop-filter: blur(10px);
`;

const ModalContent = styled(motion.div)`
  background-color: white;
  border-radius: 20px;
  width: 90%;
  max-width: 1000px;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const ModalImage = styled.div<{ image: string }>`
  flex: 1;
  min-height: 300px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  
  @media (min-width: 768px) {
    min-height: 500px;
  }
`;

const ModalDetails = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  font-size: 32px;
  line-height: 1.125;
  font-weight: 600;
  letter-spacing: -0.022em;
  margin-bottom: 1rem;
`;

const ModalDescription = styled.p`
  font-size: 17px;
  line-height: 1.47059;
  margin-bottom: 2rem;
  color: var(--secondary-color);
`;

const ModalMeta = styled.div`
  margin-bottom: 2rem;
  display: flex;
  font-size: 14px;
  color: var(--gray-text);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    background-color: white;
    transform: scale(1.05);
  }
`;

const DiaryTextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  border: 1px solid #d2d2d7;
  border-radius: 12px;
  font-family: var(--font-family);
  font-size: 17px;
  margin-bottom: 1rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }
`;

const SaveButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: var(--accent-color);
  color: white;
  border: none;
  border-radius: 980px;
  font-family: var(--font-sans);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #0077ed;
  }
`;

const PhotoGrid: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<typeof photos[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [diaryEntries, setDiaryEntries] = useState<Record<number, string>>({});
  
  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes({
      ...likes,
      [id]: !likes[id]
    });
  };
  
  const openModal = (photo: typeof photos[0]) => {
    setSelectedPhoto(photo);
    setModalOpen(true);
  };
  
  const closeModal = () => {
    setModalOpen(false);
  };
  
  const handleDiaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedPhoto) {
      setDiaryEntries({
        ...diaryEntries,
        [selectedPhoto.id]: e.target.value
      });
    }
  };
  
  const saveDiary = () => {
    // 实际应用中，这里会将日记内容保存到后端
    alert('日记已保存！');
  };
  
  return (
    <GridContainer>
      <Grid>
        {photos.map(photo => (
          <PhotoCard
            key={photo.id}
            onClick={() => openModal(photo)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <PhotoImage image={photo.url} />
            <PhotoInfo>
              <PhotoTitle>{photo.title}</PhotoTitle>
              <PhotoMeta>
                <MetaItem>
                  <MapPinIcon />
                  {photo.location}
                </MetaItem>
                <MetaItem>
                  <CalendarIcon />
                  {photo.date}
                </MetaItem>
              </PhotoMeta>
              <HeartButton
                onClick={(e) => toggleLike(photo.id, e)}
                color={likes[photo.id] ? 'red' : 'gray'}
              >
                {likes[photo.id] ? <HeartFillIcon /> : <HeartOutlineIcon />}
              </HeartButton>
            </PhotoInfo>
          </PhotoCard>
        ))}
      </Grid>
      
      {modalOpen && selectedPhoto && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <ModalContent
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ModalImage image={selectedPhoto.url} />
            <ModalDetails>
              <ModalTitle>{selectedPhoto.title}</ModalTitle>
              <ModalMeta>
                <MetaItem>
                  <MapPinIcon />
                  {selectedPhoto.location}
                </MetaItem>
                <MetaItem>
                  <CalendarIcon />
                  {selectedPhoto.date}
                </MetaItem>
              </ModalMeta>
              <ModalDescription>{selectedPhoto.description}</ModalDescription>
              <h3>记录感受</h3>
              <DiaryTextArea
                placeholder="写下这一刻的感受..."
                value={diaryEntries[selectedPhoto.id] || ''}
                onChange={handleDiaryChange}
              />
              <SaveButton onClick={saveDiary}>保存</SaveButton>
            </ModalDetails>
            <CloseButton onClick={closeModal}>×</CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </GridContainer>
  );
};

export default PhotoGrid; 