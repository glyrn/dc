import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Typewriter from '../components/Typewriter';
import ParticleBackground from '../components/ParticleBackground';

const WelcomeContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #000;
  color: #fff;
  padding: 0 1.5rem;
  position: relative;
  overflow: hidden;
`;

const BackgroundGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(30, 30, 30, 0.8) 0%, rgba(0, 0, 0, 1) 70%);
  z-index: 1;
`;

const ContentWrapper = styled(motion.div)`
  z-index: 2;
  text-align: center;
  max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(motion.h1)`
  font-size: 64px;
  font-weight: 700;
  margin-bottom: 2rem;
  background: linear-gradient(to right, #f5f5f5, #aaa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.2));
  
  @media (max-width: 768px) {
    font-size: 48px;
  }
  
  @media (max-width: 480px) {
    font-size: 36px;
  }
`;

const SubtitleWrapper = styled(motion.div)`
  margin-bottom: 3rem;
`;

const Subtitle = styled.div`
  font-size: 24px;
  font-weight: 400;
  color: #bbb;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const EnterButton = styled(motion.button)`
  background-color: transparent;
  color: white;
  font-size: 18px;
  font-weight: 500;
  border: 2px solid white;
  border-radius: 50px;
  padding: 15px 40px;
  cursor: pointer;
  margin-top: 20px;
  overflow: hidden;
  position: relative;
  z-index: 1;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.2);
    transition: width 0.5s ease;
    z-index: -1;
  }
  
  &:hover:before {
    width: 100%;
  }
`;

// 闪光效果
const Sparkle = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 0 10px white, 0 0 20px white;
  z-index: 3;
`;

// 新增登录模态框样式
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

// 定义自定义主题接口
interface CustomTheme {
  authSuccess?: boolean;
}

// 修改ModalContent样式，添加验证成功的效果
const ModalContent = styled(motion.div)<{ $authSuccess?: boolean }>`
  background-color: #1a1a1a;
  border-radius: 15px;
  padding: 30px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #6c5ce7, #00cec9);
    transform-origin: left;
    transform: scaleX(0);
    transition: transform 1.5s ease;
  }
  
  ${props => props.$authSuccess && `
    &:after {
      transform: scaleX(1);
      width: 100%;
    }
  `}
`;

const ModalTitle = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 20px;
  text-align: center;
`;

const PassphraseInput = styled.input`
  width: 100%;
  padding: 15px;
  margin: 10px 0 20px;
  border-radius: 8px;
  border: 1px solid #333;
  background-color: #222;
  color: white;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.3);
  }
`;

const ModalButton = styled(motion.button)`
  background-color: #6c5ce7;
  color: white;
  font-size: 16px;
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;
  
  &:disabled {
    background-color: #444;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled(motion.div)`
  color: #ff6b6b;
  margin-top: 15px;
  font-size: 14px;
  text-align: center;
`;

const IdentityTag = styled(motion.div)`
  background-color: #222;
  color: #6c5ce7;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IdentityIcon = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: #6c5ce7;
  border-radius: 50%;
  margin-right: 8px;
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);
  const [sparkles, setSparkles] = useState<{id: number; x: number; y: number}[]>([]);
  const [progressComplete, setProgressComplete] = useState(false);
  
  // 新增状态
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [identity, setIdentity] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [showExpiredNotice, setShowExpiredNotice] = useState(false); // 新增状态：是否显示过期提示
  
  // 清除之前保存在localStorage中的访问记录，并检查认证是否过期
  useEffect(() => {
    localStorage.removeItem('hasVisited');
    
    // 检查当前是否已经登录
    const token = localStorage.getItem('auth_token');
    const storedIdentity = localStorage.getItem('user_identity');
    
    if (token && storedIdentity) {
      // 已有token，直接设置身份
      setIdentity(storedIdentity);
    }
    
    // 检查是否是因为认证过期而跳转回来的
    const authExpired = localStorage.getItem('auth_expired');
    if (authExpired === 'true') {
      setShowExpiredNotice(true);
      // 显示认证过期的信息
      setError('您的登录已过期，请重新登录');
      // 自动打开登录模态框
      setShowLoginModal(true);
      // 清除标记，避免刷新页面后仍然显示
      localStorage.removeItem('auth_expired');
    }
  }, []);
  
  // 随机生成闪光效果
  useEffect(() => {
    const interval = setInterval(() => {
      if (sparkles.length >= 20) {
        // 限制最大闪光数量
        setSparkles(prev => prev.slice(1));
      }
      
      // 生成新闪光
      const newSparkle = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
      };
      
      setSparkles(prev => [...prev, newSparkle]);
      
      // 3秒后移除闪光
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => s.id !== newSparkle.id));
      }, 3000);
    }, 300);
    
    return () => clearInterval(interval);
  }, [sparkles.length]);
  
  const handleTypingComplete = () => {
    setShowButton(true);
  };
  
  const handleButtonHoverStart = () => {
    setProgressComplete(false);
    
    // 0.3秒后触发抖动效果
    setTimeout(() => {
      setProgressComplete(true);
    }, 300);
  };
  
  const handleButtonHoverEnd = () => {
    setProgressComplete(false);
  };
  
  // 点击进入按钮的处理函数
  const handleEnter = () => {
    // 检查是否已经登录
    const token = localStorage.getItem('auth_token');
    const storedIdentity = localStorage.getItem('user_identity');
    
    // 如果已经有身份和token，直接导航到主页
    if (token && storedIdentity) {
      setIdentity(storedIdentity); // 确保身份状态与localStorage同步
      navigate('/home');
      return;
    }
    
    // 否则显示登录模态框
    setShowLoginModal(true);
    setError(''); // 清除之前的错误信息
    setAuthSuccess(false); // 重置认证状态
    setIsLoading(false); // 确保加载状态被重置
    setPassphrase(''); // 清空输入框
  };
  
  // 处理登录验证
  const handleVerifyPassphrase = async () => {
    if (!passphrase.trim()) {
      setError('请输入口令');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // 从环境变量获取 API 基础 URL
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
    // 如果环境变量未设置，在控制台给出提示并阻止执行
    if (!apiBaseUrl) {
      console.error(
        'REACT_APP_API_BASE_URL is not defined. Cannot make API calls.'
      );
      setError('API 配置错误，无法登录');
      setIsLoading(false);
      return;
    }
    
    // 确保 API_BASE_URL 末尾没有斜杠
    const cleanApiBaseUrl = apiBaseUrl.endsWith('/')
      ? apiBaseUrl.slice(0, -1)
      : apiBaseUrl;
    
    const loginUrl = `${cleanApiBaseUrl}/api/login`;
    
    try {
      // 调用登录API
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passphrase }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '验证失败');
      }
      
      // 保存token和身份
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_identity', data.identity);
      
      // 设置身份状态
      setIdentity(data.identity);
      
      // 设置认证成功状态，不恢复isLoading为false，保持按钮加载状态
      setAuthSuccess(true);
      
      // 延迟一下再导航，以便用户看到身份信息
      setTimeout(() => {
        navigate('/home');
      }, 1500);
      
    } catch (err) {
      console.error('登录错误:', err);
      setError(err instanceof Error ? err.message : '验证失败，请重试');
      setIsLoading(false);
    }
  };
  
  // 处理输入框按下回车
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleVerifyPassphrase();
    }
  };
  
  return (
    <WelcomeContainer>
      <ParticleBackground />
      <BackgroundGradient />
      
      {/* 随机闪光效果 */}
      {sparkles.map(sparkle => (
        <Sparkle
          key={sparkle.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{ duration: 3 }}
          style={{
            left: sparkle.x,
            top: sparkle.y
          }}
        />
      ))}
      
      <ContentWrapper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Title
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          CutCut
        </Title>
        
        <SubtitleWrapper
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <Subtitle>
            <Typewriter 
              text="欢迎来到好运莲莲的空间" 
              delay={180}
              onComplete={handleTypingComplete}
            />
          </Subtitle>
        </SubtitleWrapper>
        
        {showButton && (
          <EnterButton
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              rotate: 0,
              x: 0,
              boxShadow: [
                "0 0 0 rgba(255, 255, 255, 0)",
                "0 0 20px rgba(255, 255, 255, 0.5)",
                "0 0 10px rgba(255, 255, 255, 0.3)"
              ]
            }}
            transition={{ 
              duration: 0.8,
              boxShadow: { duration: 2, repeat: Infinity, repeatType: "reverse" }
            }}
            whileHover={{ 
              boxShadow: "0 0 15px rgba(255, 255, 255, 0.8)",
              ...(progressComplete && {
                scale: [1, 1.1, 1.05, 1.15, 1.1],
                rotate: [0, -2, 2, -2, 0],
                x: [0, -5, 5, -5, 0],
                transition: { 
                  duration: 0.5, 
                  repeat: Infinity,
                  repeatType: "reverse" 
                }
              })
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEnter}
            onHoverStart={handleButtonHoverStart}
            onHoverEnd={handleButtonHoverEnd}
          >
            开启探索
          </EnterButton>
        )}
      </ContentWrapper>
      
      {/* 登录模态框 */}
      <AnimatePresence>
        {showLoginModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              // 只有在未加载和未验证成功的情况下才允许关闭
              if (!isLoading && !authSuccess) {
                setShowLoginModal(false);
                setError('');
                setPassphrase('');
              }
            }}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()} // 阻止点击内容区域时关闭模态框
              $authSuccess={authSuccess}
            >
              <ModalTitle>请输入访问口令</ModalTitle>
              
              <PassphraseInput
                type="password"
                placeholder="输入口令..."
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                onKeyDown={handleInputKeyDown}
                autoFocus
              />
              
              {identity && (
                <IdentityTag
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <IdentityIcon /> 身份识别: {identity}
                </IdentityTag>
              )}
              
              {error && (
                <ErrorMessage
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {error}
                </ErrorMessage>
              )}
              
              <ModalButton
                whileHover={!isLoading && !authSuccess ? { scale: 1.05 } : {}}
                whileTap={!isLoading && !authSuccess ? { scale: 0.95 } : {}}
                onClick={handleVerifyPassphrase}
                disabled={isLoading || !passphrase.trim() || authSuccess}
              >
                <ButtonContent>
                  {isLoading ? (authSuccess ? '跳转中...' : '验证中...') : '确认'}
                </ButtonContent>
              </ModalButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </WelcomeContainer>
  );
};

export default Welcome; 