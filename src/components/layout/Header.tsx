import React from 'react';
import styled from 'styled-components';

const HeaderBar = styled.header`
  width: 100%;
  height: 64px;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.primary[700]});
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.07);
  user-select: none;
`;

const Logo = styled.span`
  font-family: 'Segoe UI', 'Pretendard', 'sans-serif';
  font-weight: 900;
  font-size: 2rem;
  letter-spacing: 0.08em;
  text-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

const Header: React.FC = () => {
  return (
    <HeaderBar>
      <Logo>do-not-save</Logo>
    </HeaderBar>
  );
};

export { Header }; 