import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Navbar from './components/Navbar';
import { AnimatePresence } from 'framer-motion';
// 使用懒加载替代直接导入
const Home = lazy(() => import('./pages/Home'));
const Welcome = lazy(() => import('./pages/Welcome'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Timeline = lazy(() => import('./pages/Timeline'));
const Diary = lazy(() => import('./pages/Diary'));

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

function App() {
  return (
    <Router>
      <GlobalStyles />
      <Suspense fallback={<LoadingFallback />}>
        <AnimatePresence mode="wait">
          <Routes>
            {/* 欢迎页面作为默认路由 */}
            <Route path="/" element={<Welcome />} />
            
            {/* 其他页面使用导航栏布局 */}
            <Route path="/home" element={
              <NavbarLayout>
                <Home />
              </NavbarLayout>
            } />
            <Route path="/gallery" element={
              <NavbarLayout>
                <Gallery />
              </NavbarLayout>
            } />
            <Route path="/diary" element={
              <NavbarLayout>
                <Diary />
              </NavbarLayout>
            } />
            <Route path="/timeline" element={
              <NavbarLayout>
                <Timeline />
              </NavbarLayout>
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
