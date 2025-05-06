import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const StyledButton = styled.button`
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background-color: #dc2626;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #b91c1c;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #fff, 0 0 0 4px #dc2626;
  }
`;

export const LogoutButton: React.FC = () => {
  const { signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    // 로그아웃 후 로그인 페이지로 리다이렉트
    window.location.href = '/login';
  };

  return (
    <StyledButton onClick={handleLogout}>
      로그아웃
    </StyledButton>
  );
}; 