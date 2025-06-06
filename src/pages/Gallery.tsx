import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiPlus, FiImage } from 'react-icons/fi';
import AlbumCard from '../components/AlbumCard';
import CreateAlbumModal from '../components/CreateAlbumModal';
import AlbumDetail from '../components/AlbumDetail';
import { 
  getAlbums, 
  createAlbum, 
  getAlbumImages, 
  uploadImageToAlbum,
  Album, 
  AlbumImage, 
  CreateAlbumRequest 
} from '../services/albumService';
import { compressImage, defaultCompressionOptions } from '../utils/imageUtils';

// 页面状态类型
type PageState = 'list' | 'detail';

// 扩展 Album 类型以包含封面图片信息
interface AlbumWithCoverImages extends Album {
  coverImages?: AlbumImage[];
}

const Container = styled.div`
  padding: 60px 20px 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 60px);
  background-color: #ffffff;
  color: #333;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const PageTitle = styled.h1`
  font-size: 2.8rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 0.5rem;
`;

const PageSubtitle = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  margin-bottom: 2rem;
`;

const AlbumsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 30px;
`;

// 替换原来的CreateAlbumCard组件，改为悬浮按钮样式
const FloatingActionButton = styled.button`
  position: fixed;
  right: 40px;
  bottom: 40px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff, #0056b3);
  border: none;
  color: white;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 123, 255, 0.4);
  z-index: 1000;
  transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #0056b3, #007bff);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba(0, 123, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0) scale(1);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  }
`;

const CreateIcon = styled.div`
  font-size: 3rem;
  color: #a29bfe;
  margin-bottom: 15px;
  opacity: 0.9;
`;

const CreateText = styled.div`
  color: #6c5ce7;
  font-size: 1.1rem;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #6c757d;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.7;
  color: #adb5bd;
`;

const EmptyTitle = styled.h3`
  font-size: 1.4rem;
  margin: 0 0 10px;
  color: #343a40;
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  margin: 0;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
  color: #495057;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #fd7e14;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 107, 107, 0.05);
  border: 1px solid rgba(220, 53, 69, 0.2);
  border-radius: 12px;
  padding: 15px 20px;
  margin: 20px 0;
  color: #dc3545;
  text-align: center;
`;

// 显示动画的包装器组件，只在首次渲染时应用淡入效果
const FadeIn = styled.div`
  opacity: 0;
  animation: fadeIn 0.5s ease-out forwards;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Gallery: React.FC = () => {
  const [pageState, setPageState] = useState<PageState>('list');
  const [albums, setAlbums] = useState<AlbumWithCoverImages[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumWithCoverImages | null>(null);
  const [albumImages, setAlbumImages] = useState<AlbumImage[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  
  const [error, setError] = useState<string | null>(null);

  // 加载相册列表
  const loadAlbums = async () => {
    try {
      setLoading(true);
      setError(null);
      const rawAlbums = await getAlbums();

      // 为每个相册获取封面图片 (例如前3张)
      const albumsWithCovers: AlbumWithCoverImages[] = await Promise.all(
        rawAlbums.map(async (album) => {
          try {
            const images = await getAlbumImages(album.id);
            return {
              ...album,
              coverImages: images.slice(0, 3), // 减少封面图片数量，只取前3张
            };
          } catch (imageError) {
            console.error(`加载相册 ${album.id} 的图片失败:`, imageError);
            return { ...album, coverImages: [] }; // 如果失败，则封面图片为空数组
          }
        })
      );
      setAlbums(albumsWithCovers);
    } catch (error) {
      console.error('加载相册列表失败:', error);
      setError('加载相册列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 加载相册图片
  const loadAlbumImages = async (albumId: number) => {
    try {
      setLoadingImages(true);
      setError(null);
      const images = await getAlbumImages(albumId);
      setAlbumImages(images);
    } catch (error) {
      console.error('加载相册图片失败:', error);
      setError('加载相册图片失败，请稍后重试');
      setAlbumImages([]);
    } finally {
      setLoadingImages(false);
    }
  };

  // 创建相册
  const handleCreateAlbum = async (name: string, description?: string) => {
    try {
      setCreating(true);
      setError(null);
      const albumData: CreateAlbumRequest = { name, description };
      const newAlbum = await createAlbum(albumData);
      setAlbums(prev => [newAlbum, ...prev]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('创建相册失败:', error);
      setError('创建相册失败，请稍后重试');
    } finally {
      setCreating(false);
    }
  };

  // 打开相册详情
  const handleAlbumClick = async (album: AlbumWithCoverImages) => {
    setSelectedAlbum(album);
    setPageState('detail');
    await loadAlbumImages(album.id);
  };

  // 返回相册列表
  const handleBackToList = () => {
    setPageState('list');
    setSelectedAlbum(null);
    setAlbumImages([]);
  };

  // 上传图片到相册
  const handleUploadImages = async (files: FileList) => {
    try {
      setUploading(true);
      setError(null);
      
      if (!selectedAlbum) {
        throw new Error('未选择相册');
      }
      
      // 显示上传进度信息
      console.log(`开始上传 ${files.length} 张图片到相册 "${selectedAlbum.name}"...`);
      
      // 将FileList转换为数组
      const fileArray = Array.from(files);

      // 对每个文件进行压缩和上传
      const uploadPromises = fileArray.map(async (file: File, index) => {
        try {
          // 使用工具函数压缩图片
          const compressedFile = await compressImage(file, defaultCompressionOptions);
          
          // 上传压缩后的图片
          return await uploadImageToAlbum(selectedAlbum.id, compressedFile);
        } catch (error) {
          console.error(`压缩或上传图片 ${file.name} 失败:`, error);
          throw error;
        }
      });

      // 等待所有上传完成
      const results = await Promise.allSettled(uploadPromises);
      
      // 检查结果
      const successfulUploads = results.filter(result => result.status === 'fulfilled');
      console.log(`成功上传 ${successfulUploads.length}/${files.length} 张图片`);
      
      // 如果有成功上传的图片，刷新相册图片列表
      if (successfulUploads.length > 0 && selectedAlbum) {
        await loadAlbumImages(selectedAlbum.id);
      }
      
      // 如果部分图片上传失败，显示警告
      if (successfulUploads.length < files.length) {
        setError(`部分图片上传失败，成功上传 ${successfulUploads.length}/${files.length} 张图片`);
      }
    } catch (error) {
      console.error('上传图片失败:', error);
      setError('上传图片失败，请稍后重试');
    } finally {
      setUploading(false);
    }
  };

  // 初始化加载相册列表
  useEffect(() => {
    loadAlbums();
  }, []);

  // 渲染相册列表
  const renderAlbumList = () => (
    <FadeIn>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading ? (
        <LoadingWrapper>
          <span>加载中...</span>
        </LoadingWrapper>
      ) : albums.length > 0 ? (
        <AlbumsGrid>
          {albums.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              onClick={() => handleAlbumClick(album)}
            />
          ))}
        </AlbumsGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>
            {FiImage({})}
          </EmptyIcon>
          <EmptyTitle>还没有相册</EmptyTitle>
          <EmptyDescription>
            创建您的第一个相册，开始收集珍贵的照片和回忆吧！
          </EmptyDescription>
        </EmptyState>
      )}
      
      <FloatingActionButton onClick={() => setShowCreateModal(true)}>
        {FiPlus({})}
      </FloatingActionButton>
      
      {showCreateModal && (
        <CreateAlbumModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateAlbum}
          isCreating={creating}
        />
      )}
    </FadeIn>
  );

  const renderAlbumDetail = () => {
    if (!selectedAlbum) return null;
    
    return (
      <FadeIn>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {loadingImages ? (
          <LoadingWrapper>
            <span>加载图片中...</span>
          </LoadingWrapper>
        ) : (
          <AlbumDetail
            album={selectedAlbum}
            images={albumImages}
            onBack={handleBackToList}
            onUpload={handleUploadImages}
            uploading={uploading}
          />
        )}
      </FadeIn>
    );
  };

  return (
    <Container>
      {pageState === 'list' ? renderAlbumList() : renderAlbumDetail()}
    </Container>
  );
};

export default Gallery; 