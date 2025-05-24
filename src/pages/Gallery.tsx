import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiImage } from 'react-icons/fi';
import AlbumCard from '../components/AlbumCard';
import CreateAlbumModal from '../components/CreateAlbumModal';
import AlbumDetail from '../components/AlbumDetail';
import imageCompression from 'browser-image-compression';
import { 
  getAlbums, 
  createAlbum, 
  getAlbumImages, 
  uploadImageToAlbum,
  Album, 
  AlbumImage, 
  CreateAlbumRequest 
} from '../services/albumService';

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
const FloatingActionButton = styled(motion.button)`
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

      // 为每个相册获取封面图片 (例如前5张)
      const albumsWithCovers: AlbumWithCoverImages[] = await Promise.all(
        rawAlbums.map(async (album) => {
          try {
            const images = await getAlbumImages(album.id);
            return {
              ...album,
              coverImages: images.slice(0, 5), // 取前5张作为封面轮播图
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
    setError(null);
  };

  // 上传图片
  const handleUploadImages = async (files: FileList) => {
    if (!selectedAlbum) return;

    try {
      setUploading(true);
      setError(null);

      const processedFiles: File[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          console.warn(`文件 ${file.name} 不是图片，已跳过压缩处理。`);
          // 决定是否依然上传非图片文件，或提示用户
          // processedFiles.push(file); // 如果仍要上传
          continue; // 这里选择跳过非图片文件
        }

        try {
          const options = {
            maxSizeMB: 0.1, // 目标最大 100KB
            maxWidthOrHeight: 1920, // 可选：限制图片最大尺寸，保持纵横比
            useWebWorker: true,
            fileType: 'image/webp', // 转换为 WebP
            initialQuality: 0.75, // 初始压缩质量，可以调整
            // webPModule: () => import('webp-converter-browser'), // 如果需要特定 WebP 模块
          };
          console.log(`正在压缩图片: ${file.name}`);
          const compressedBlob = await imageCompression(file, options);
          // 使用原始文件名（或生成新文件名），但扩展名更改为 .webp
          const newFileName = file.name.substring(0, file.name.lastIndexOf('.')) + '.webp';
          const compressedFile = new File([compressedBlob], newFileName, {
            type: 'image/webp',
            lastModified: Date.now(),
          });
          console.log(`图片压缩完成: ${compressedFile.name}, 大小: ${(compressedFile.size / 1024).toFixed(2)} KB`);
          processedFiles.push(compressedFile);
        } catch (compressionError) {
          console.error(`图片 ${file.name} 压缩失败:`, compressionError);
          setError(`图片 ${file.name} 压缩失败，将尝试上传原图。`);
          // 压缩失败，可以选择上传原图或不上传
          processedFiles.push(file); 
        }
      }

      if (processedFiles.length === 0) {
        setUploading(false);
        // 可以设置一个消息提示用户没有有效图片被处理
        setError("没有有效的图片被选中或处理成功。");
        return;
      }
      
      const uploadPromises = processedFiles.map(processedFile => 
        uploadImageToAlbum(selectedAlbum.id, processedFile)
      );

      const uploadedImageResults = await Promise.all(uploadPromises);
      // 假设 uploadImageToAlbum 返回的是 AlbumImage 类型或者包含其必要信息
      // 如果返回的不是完整的 AlbumImage，可能需要调整这里的逻辑
      // 或者在 uploadImageToAlbum 内部处理好返回的结构
      setAlbumImages(prev => [...uploadedImageResults, ...prev]);
    } catch (error) {
      console.error('上传图片失败:', error);
      // 更具体的错误信息
      if (error instanceof Error) {
        setError(`上传图片失败: ${error.message}`);
      } else {
        setError('上传图片失败，请稍后重试');
      }
    } finally {
      setUploading(false);
    }
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadAlbums();
  }, []);

  // 渲染相册列表页面
  const renderAlbumList = () => (
    <>
      {/* <PageHeader>
        <PageTitle>我们的照片墙</PageTitle>
        <PageSubtitle>用影像定格每一刻，记录爱的故事</PageSubtitle>
      </PageHeader> */}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading ? (
        <LoadingWrapper>加载中...</LoadingWrapper>
      ) : (
        <>
          {albums.length > 0 ? (
            <AlbumsGrid>
              {albums.map((album, index) => (
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
                {(FiImage as any)()}
              </EmptyIcon>
              <EmptyTitle>还没有相册回忆</EmptyTitle>
              <EmptyDescription>
                点击右下角的 "+" 按钮，开始创建您的第一本数字回忆录吧！
              </EmptyDescription>
            </EmptyState>
          )}
          
          <FloatingActionButton
            onClick={() => setShowCreateModal(true)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {(FiPlus as any)()}
          </FloatingActionButton>
        </>
      )}
    </>
  );

  // 渲染相册详情页面
  const renderAlbumDetail = () => {
    if (!selectedAlbum) return null;

    if (loadingImages) {
      return <LoadingWrapper>加载相册内容中...</LoadingWrapper>;
    }

    return (
      <AlbumDetail
        album={selectedAlbum}
        images={albumImages}
        onBack={handleBackToList}
        onUpload={handleUploadImages}
        uploading={uploading}
      />
    );
  };

  return (
    <Container>
      <AnimatePresence mode="wait">
        {pageState === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderAlbumList()}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {renderAlbumDetail()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 创建相册模态框 */}
      <CreateAlbumModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateAlbum}
        loading={creating}
      />

      {error && (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      )}
    </Container>
  );
};

export default Gallery; 