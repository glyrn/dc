import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import Gallery from './pages/Gallery';
import Timeline from './pages/Timeline';
import Diary from './pages/Diary';
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
    </Router>
  );
}

export default App;
