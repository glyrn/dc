import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import { AnimatePresence } from 'framer-motion';

function App() {
  return (
    <Router>
      <GlobalStyles />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/gallery" element={<div style={{ paddingTop: '80px', textAlign: 'center' }}>相册页面 - 开发中</div>} />
          <Route path="/diary" element={<div style={{ paddingTop: '80px', textAlign: 'center' }}>日记页面 - 开发中</div>} />
          <Route path="/story" element={<div style={{ paddingTop: '80px', textAlign: 'center' }}>我们的故事页面 - 开发中</div>} />
          <Route path="*" element={<div style={{ paddingTop: '80px', textAlign: 'center' }}>页面不存在</div>} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
