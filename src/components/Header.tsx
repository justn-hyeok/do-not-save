import React from 'react';
import styled from 'styled-components';
import { LogoutButton } from './LogoutButton';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
`;

export const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <Logo>do-not-save</Logo>
      <LogoutButton />
    </HeaderContainer>
  );
}; 