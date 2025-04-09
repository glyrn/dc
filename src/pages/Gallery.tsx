import React from 'react';
import styled from 'styled-components';
import imageList from '../gallery-images.json'; // 导入生成的图片列表

const GalleryContainer = styled.div`
  padding: 100px 20px 20px; /* 增加顶部 padding 以避开 Navbar */
  max-width: 1200px;
  margin: 0 auto;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* 响应式网格布局 */
  gap: 15px; /* 网格间距 */
`;

const ImageWrapper = styled.div`
  width: 100%;
  padding-top: 100%; /* 创建 1:1 的方形容器 */
  position: relative;
  overflow: hidden;
  border-radius: 8px; /* 轻微的圆角 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 添加阴影 */
  cursor: pointer; /* 提示可以点击 */
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.03); /* 悬停时放大 */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;

const StyledImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 裁剪并覆盖整个容器 */
  display: block;
`;

const NoImagesMessage = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.1em;
  margin-top: 30px;
`;

const Gallery: React.FC = () => {
  // TODO: 添加点击图片放大或查看详情的功能
  const handleImageClick = (imagePath: string) => {
    console.log('Clicked image:', imagePath);
    // 在这里可以实现图片放大的逻辑，例如使用一个模态框(Modal)
  };

  return (
    <GalleryContainer>
      {imageList.length > 0 ? (
        <GalleryGrid>
          {imageList.map((imagePath, index) => (
            <ImageWrapper key={index} onClick={() => handleImageClick(imagePath)}>
              <StyledImage src={process.env.PUBLIC_URL + imagePath} alt={`Gallery image ${index + 1}`} />
            </ImageWrapper>
          ))}
        </GalleryGrid>
      ) : (
        <NoImagesMessage>
          相册里还没有照片呢！请将照片添加到 `public/gallery-images` 文件夹下，然后刷新页面。
        </NoImagesMessage>
      )}
    </GalleryContainer>
  );
};

export default Gallery; 