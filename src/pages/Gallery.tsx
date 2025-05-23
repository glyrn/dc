import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiHeart, FiCamera } from 'react-icons/fi';
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

const Container = styled.div`
  padding: 100px 20px 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 100px);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const HeaderIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ff69b4, #ff8a80);
  border-radius: 50%;
  margin: 0 auto 20px;
  color: white;
  font-size: 2.5rem;
  box-shadow: 0 10px 25px rgba(255, 105, 180, 0.3);
`;

const Title = styled.h1`
  color: #d63384;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: linear-gradient(135deg, #d63384, #ff69b4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: #8e44ad;
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.8;
`;

const AlbumsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 30px;
`;

const CreateAlbumCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 105, 180, 0.1) 0%, rgba(255, 138, 128, 0.1) 100%);
  border: 2px dashed rgba(255, 105, 180, 0.4);
  border-radius: 20px;
  padding: 40px 20px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: all 0.3s ease;
  min-height: 320px;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 105, 180, 0.6);
    background: linear-gradient(135deg, rgba(255, 105, 180, 0.15) 0%, rgba(255, 138, 128, 0.15) 100%);
    box-shadow: 0 10px 25px rgba(255, 105, 180, 0.2);
  }
`;

const CreateIcon = styled.div`
  font-size: 3rem;
  color: #ff69b4;
  margin-bottom: 15px;
  opacity: 0.8;
`;

const CreateText = styled.div`
  color: #d63384;
  font-size: 1.1rem;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #c39bd3;
`;

const EmptyIcon = styled.div`
  font-size: 5rem;
  margin-bottom: 25px;
  opacity: 0.6;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 15px;
  color: #8e44ad;
`;

const EmptyDescription = styled.p`
  font-size: 1rem;
  margin: 0;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #ff69b4;
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  background: linear-gradient(135deg, #ffebee, #fce4ec);
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  color: #c62828;
  text-align: center;
`;

const Gallery: React.FC = () => {
  const [pageState, setPageState] = useState<PageState>('list');
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
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
      const albumsData = await getAlbums();
      setAlbums(albumsData);
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
  const handleAlbumClick = async (album: Album) => {
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
      <Header>
        <HeaderIcon>
          {(FiHeart as any)()}
        </HeaderIcon>
        <Title>情侣相册回忆空间</Title>
        <Subtitle>记录我们的美好时光，珍藏甜蜜回忆</Subtitle>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {loading ? (
        <LoadingWrapper>加载中...</LoadingWrapper>
      ) : (
        <AlbumsGrid>
          {/* 新建相册卡片 */}
          <CreateAlbumCard
            onClick={() => setShowCreateModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CreateIcon>
              {(FiPlus as any)()}
            </CreateIcon>
            <CreateText>新建相册</CreateText>
          </CreateAlbumCard>

          {/* 相册卡片列表 */}
          {albums.map((album, index) => (
            <AlbumCard
              key={album.id}
              album={album}
              onClick={() => handleAlbumClick(album)}
            />
          ))}
        </AlbumsGrid>
      )}

      {/* 空状态 */}
      {!loading && albums.length === 0 && (
        <EmptyState>
          <EmptyIcon>
            {(FiCamera as any)()}
          </EmptyIcon>
          <EmptyTitle>还没有相册</EmptyTitle>
          <EmptyDescription>
            点击"新建相册"按钮，开始创建你们的第一本回忆相册吧！
            记录每一个美好瞬间，让爱情故事永远闪闪发光。
          </EmptyDescription>
        </EmptyState>
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