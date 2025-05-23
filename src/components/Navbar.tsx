import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const NavContainer = styled.nav<{ scrolled: boolean; visible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  height: 60px;
  z-index: 1010;
  transition: var(--transition);
  background: ${props => props.scrolled ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  backdrop-filter: blur(20px);
  border-bottom: ${props => props.scrolled ? '1px solid rgba(0, 0, 0, 0.1)' : 'none'};
  transform: translateY(${props => props.visible ? '0' : '-100%'});
  transition: transform 0.3s ease, background 0.3s ease, border-bottom 0.3s ease;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Logo = styled(Link)`
  font-family: var(--font-sans);
  font-size: 1.4rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--secondary-color);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    text-decoration: none;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  }
`;

const NavLinks = styled.div<{ isOpen: boolean }>`
  display: flex;
  gap: 2rem;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    position: fixed;
    flex-direction: column;
    top: 0;
    right: 0;
    height: 100vh;
    width: 50%;
    max-width: 220px;
    background: var(--background-color);
    padding: 6rem 1.2rem;
    gap: 2rem;
    z-index: 100;
    transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.3s ease-in-out;
    box-shadow: var(--box-shadow);
  }
`;

const NavLink = styled(motion.div)`
  position: relative;
  padding: 0 10px;
  height: 60px;
  display: flex;
  align-items: center;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 10px;
    right: 10px;
    height: 1px;
    background-color: var(--accent-color);
    transform: scaleX(0);
    transition: transform 0.2s ease;
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledLink = styled(Link)`
  font-family: var(--font-sans);
  font-size: 1rem;
  font-weight: 400;
  color: var(--secondary-color);
`;

const HamburgerIcon = styled.button<{ isOpen: boolean }>`
  display: none;
  z-index: 200;
  background: transparent;
  
  @media (max-width: 768px) {
    display: block;
    width: 24px;
    height: 24px;
    position: relative;
    
    span {
      position: absolute;
      width: 100%;
      height: 1px;
      background-color: var(--secondary-color);
      transition: all 0.3s ease;
      left: 0;
      
      &:nth-child(1) {
        top: ${({ isOpen }) => isOpen ? '50%' : '25%'};
        transform: ${({ isOpen }) => isOpen ? 'rotate(45deg)' : 'rotate(0)'};
      }
      
      &:nth-child(2) {
        top: 50%;
        transform: translateY(-50%);
        opacity: ${({ isOpen }) => isOpen ? '0' : '1'};
      }
      
      &:nth-child(3) {
        top: ${({ isOpen }) => isOpen ? '50%' : '75%'};
        transform: ${({ isOpen }) => isOpen ? 'rotate(-45deg)' : 'rotate(0)'};
      }
    }
  }
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 90;
    transition: all 0.3s ease;
  }
`;

const MenuItem = styled(Link)<{ isActive?: boolean }>`
  color: ${props => props.isActive ? '#000' : '#333'};
  font-weight: ${props => props.isActive ? '600' : '400'};
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  font-size: 14px;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    text-decoration: none;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  }
  
  @media (max-width: 768px) {
    font-size: 17px;
    padding: 10px 16px;
    font-weight: 500;
    display: block;
    text-align: center;
  }
`;

// 用户身份标签容器 - 移动端恢复正常大小并加大
const UserIdentityContainer = styled.div`
  position: relative;

  // PC端样式
  margin-left: auto; // 将用户标签推到最右侧
  order: 1; // 确保它在导航链接之后显示
  
  @media (max-width: 768px) {
    // 移动端样式
    margin: 0 auto 2.5rem auto; // 增加下边距，留出更多空间给下拉菜单
    order: 0;
    width: auto;
    align-self: center; // 居中对齐
    display: flex;
    justify-content: center; // 内容居中
    transform: scale(1.05); // 整体放大到105%
    z-index: 1100;
  }
`;

// 用户身份标签 - 移动端放大
const UserIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 6px 12px;
  border-radius: 20px;
  background-color: #f5f5f7;
  font-size: 0.85rem;
  color: #333;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #e5e5e7;
  }
  
  @media (max-width: 768px) {
    margin: 0;
    padding: 8px 16px; // 增大内边距
    min-width: 120px; // 增加最小宽度
    max-width: 180px; // 增加最大宽度
    font-size: 1.1rem; // 增大字体
    font-weight: 500; // 增加字重
    text-align: center;
    justify-content: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); // 增强阴影
  }
`;

// 认证点也放大
const IdentityDot = styled.span<{ identity: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => 
    props.identity === 'flisa' ? '#8519e3' : 
    props.identity === 'goree' ? '#3fd7eb' : 
    props.identity === 'green' ? '#3feb8f' : 
    '#b2bec3'};
    
  @media (max-width: 768px) {
    width: 10px; // 增大点的大小
    height: 10px;
    margin-right: 4px; // 增加间距
  }
`;

// 下拉菜单容器
const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: auto;
  min-width: 80px;
  max-width: 100%;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  padding: 6px;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.2s ease;
  z-index: 1100;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  @media (max-width: 768px) {
    position: absolute;
    width: auto;
    min-width: 80px;
    max-width: 100%;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-5px)'};
    opacity: ${props => props.isOpen ? 1 : 0};
    visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
    padding: 6px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.05);
    z-index: 1200;
  }
`;

// 注销按钮 - 修改样式，放入下拉菜单
const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
  position: relative;
  font-weight: 500;
  background-color: #f5f5f7;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  white-space: nowrap;
  
  &::before {
    content: '';
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 4px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'%3E%3C/path%3E%3Cpolyline points='16 17 21 12 16 7'%3E%3C/polyline%3E%3Cline x1='21' y1='12' x2='9' y2='12'%3E%3C/line%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    opacity: 0.8;
  }
  
  &:hover {
    background-color: rgba(255, 107, 107, 0.15);
    color: #e53e3e;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    
    &::before {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e53e3e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'%3E%3C/path%3E%3Cpolyline points='16 17 21 12 16 7'%3E%3C/polyline%3E%3Cline x1='21' y1='12' x2='9' y2='12'%3E%3C/line%3E%3C/svg%3E");
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px 8px;
    font-weight: 500;
    border-radius: 8px;
    background-color: #f5f5f7;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    
    &::before {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
    
    &:hover, &:active {
      background-color: #ffe5e5;
    }
  }
`;

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [userIdentity, setUserIdentity] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 获取用户身份
    const identity = localStorage.getItem('user_identity');
    setUserIdentity(identity);
    
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      
      if (currentScrollPos > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };
  
  // 注销处理
  const handleLogout = () => {
    // 清除认证信息
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_identity');
    
    // 关闭菜单
    closeMenu();
    
    // 导航到欢迎页面
    navigate('/');
  };

  // 处理用户菜单的显示和隐藏
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 切换下拉菜单
  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  // 鼠标悬停时显示下拉菜单
  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  // 鼠标离开时隐藏下拉菜单
  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <>
      <NavContainer scrolled={scrolled} visible={visible}>
        <Logo to="/home">CutCut</Logo>
        
        <HamburgerIcon onClick={toggleMenu} isOpen={isOpen}>
          <span></span>
          <span></span>
          <span></span>
        </HamburgerIcon>
        
        <NavLinks isOpen={isOpen}>
          {userIdentity && (
            <UserIdentityContainer 
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <UserIdentity onClick={toggleDropdown}>
                <IdentityDot identity={userIdentity} />
                {userIdentity === 'flisa' ? 'Flisa' : 
                 userIdentity === 'goree' ? 'Goree' : 
                 userIdentity === 'green' ? 'Green' : 
                 '访客'}
              </UserIdentity>
              
              <DropdownMenu isOpen={isDropdownOpen}>
                <LogoutButton onClick={handleLogout}>
                  退出
                </LogoutButton>
              </DropdownMenu>
            </UserIdentityContainer>
          )}
          
          <NavLink>
            <MenuItem 
              to="/home" 
              isActive={location.pathname === '/home'}
              onClick={closeMenu}
            >
              首页
            </MenuItem>
          </NavLink>
          <NavLink>
            <MenuItem 
              to="/gallery" 
              isActive={location.pathname === '/gallery'}
              onClick={closeMenu}
            >
              相册
            </MenuItem>
          </NavLink>
          <NavLink>
            <MenuItem 
              to="/diary" 
              isActive={location.pathname === '/diary'}
              onClick={closeMenu}
            >
              日记
            </MenuItem>
          </NavLink>
          <NavLink>
            <MenuItem 
              to="/timeline" 
              isActive={location.pathname === '/timeline'}
              onClick={closeMenu}
            >
              时刻
            </MenuItem>
          </NavLink>
          <NavLink>
            <MenuItem 
              to="/whisper" 
              isActive={location.pathname === '/whisper'}
              onClick={closeMenu}
            >
              悄悄话
            </MenuItem>
          </NavLink>
          
          {/* 移除这里的退出登录按钮，因为已经放入下拉菜单 */}
        </NavLinks>
      </NavContainer>
      <Overlay isOpen={isOpen} onClick={closeMenu} />
    </>
  );
};

export default Navbar; 