import React from 'react';
import styled from 'styled-components';
import UploadPhoto from '../components/UploadPhoto';

const UploadPageContainer = styled.div`
  padding-top: 80px; // 为导航栏留出空间
  min-height: 100vh;
  background-color: var(--background-color);
`;

const Upload: React.FC = () => {
  return (
    <UploadPageContainer>
      <UploadPhoto />
    </UploadPageContainer>
  );
};

export default Upload; 