import React, { useState, useEffect } from 'react';
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

  @media (max-width: 768px) {
    position: fixed;
    flex-direction: column;
    top: 0;
    right: 0;
    height: 100vh;
    width: 70%;
    max-width: 300px;
    background: var(--background-color);
    padding: 6rem 2rem;
    gap: 2.5rem;
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
`;

// 用户身份标签
const UserIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 6px 12px;
  border-radius: 20px;
  background-color: #f5f5f7;
  margin-left: 1rem;
  font-size: 0.85rem;
  color: #333;
  
  @media (max-width: 768px) {
    margin: 0 0 1rem 0;
  }
`;

const IdentityDot = styled.span<{ identity: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.identity === 'flisa' ? '#6c5ce7' : props.identity === 'goree' ? '#00b894' : '#b2bec3'};
`;

// 注销按钮
const LogoutButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: rgba(255, 107, 107, 0.1);
    box-shadow: 0 0 10px rgba(255, 107, 107, 0.1);
  }
  
  @media (max-width: 768px) {
    margin-top: 2rem;
  }
`;

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [userIdentity, setUserIdentity] = useState<string | null>(null);
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
            <UserIdentity>
              <IdentityDot identity={userIdentity} />
              {userIdentity === 'flisa' ? 'Flisa' : userIdentity === 'goree' ? 'Goree' : '访客'}
            </UserIdentity>
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
              时间轴
            </MenuItem>
          </NavLink>
          
          <LogoutButton onClick={handleLogout}>
            退出登录
          </LogoutButton>
        </NavLinks>
      </NavContainer>
      <Overlay isOpen={isOpen} onClick={closeMenu} />
    </>
  );
};

export default Navbar; 