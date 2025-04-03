import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import Upload from './pages/Upload';
import { AnimatePresence } from 'framer-motion';

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
          <Route path="/upload" element={
            <NavbarLayout>
              <Upload />
            </NavbarLayout>
          } />
          <Route path="/gallery" element={
            <NavbarLayout>
              <div style={{ paddingTop: '80px', textAlign: 'center' }}>相册页面 - 开发中</div>
            </NavbarLayout>
          } />
          <Route path="/diary" element={
            <NavbarLayout>
              <div style={{ paddingTop: '80px', textAlign: 'center' }}>日记页面 - 开发中</div>
            </NavbarLayout>
          } />
          <Route path="/story" element={
            <NavbarLayout>
              <div style={{ paddingTop: '80px', textAlign: 'center' }}>我们的故事页面 - 开发中</div>
            </NavbarLayout>
          } />
          <Route path="*" element={
            <NavbarLayout>
              <div style={{ paddingTop: '80px', textAlign: 'center' }}>页面不存在</div>
            </NavbarLayout>
          } />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
