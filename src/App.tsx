import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Navbar from './components/Navbar';
import { AnimatePresence } from 'framer-motion';
// 使用懒加载替代直接导入
const Home = lazy(() => import('./pages/Home'));
const Welcome = lazy(() => import('./pages/Welcome'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Diary = lazy(() => import('./pages/Diary'));
const Whisper = lazy(() => import('./pages/Whisper'));

// 加载指示器组件
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2rem',
    color: 'var(--accent-color)'
  }}>
    加载中...
  </div>
);

// 创建一个带导航栏的布局组件
const NavbarLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
  </>
);

// 受保护的路由组件，检查用户是否登录
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // 检查本地存储中是否有有效的认证 token
    const token = localStorage.getItem('auth_token');
    const identity = localStorage.getItem('user_identity');
    
    setIsAuthenticated(!!token && !!identity);
  }, []);
  
  // 加载中状态
  if (isAuthenticated === null) {
    return <LoadingFallback />;
  }
  
  // 如果未登录，重定向到欢迎页面
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  
  // 已登录，渲染子组件
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <GlobalStyles />
      <Suspense fallback={<LoadingFallback />}>
        <AnimatePresence mode="wait">
          <Routes>
            {/* 欢迎页面作为默认路由 */}
            <Route path="/" element={<Welcome />} />
            
            {/* 其他页面使用导航栏布局并添加认证保护 */}
            <Route path="/home" element={
              <ProtectedRoute>
                <NavbarLayout>
                  <Home />
                </NavbarLayout>
              </ProtectedRoute>
            } />
            <Route path="/gallery" element={
              <ProtectedRoute>
                <NavbarLayout>
                  <Gallery />
                </NavbarLayout>
              </ProtectedRoute>
            } />
            <Route path="/diary" element={
              <ProtectedRoute>
                <NavbarLayout>
                  <Diary />
                </NavbarLayout>
              </ProtectedRoute>
            } />
            <Route path="/timeline" element={
              <ProtectedRoute>
                <NavbarLayout>
                  <Timeline />
                </NavbarLayout>
              </ProtectedRoute>
            } />
            <Route path="/whisper" element={
              <ProtectedRoute>
                <NavbarLayout>
                  <Whisper />
                </NavbarLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={
              <NavbarLayout>
                <div style={{ paddingTop: '80px', textAlign: 'center' }}>页面不存在</div>
              </NavbarLayout>
            } />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Router>
  );
}

export default App;
