import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

// theme.spacing의 key 타입 추출
// theme.shadows의 key 타입 추출

type SpacingKey = keyof typeof theme.spacing;
type ShadowKey = keyof typeof theme.shadows;

interface CardProps {
  children: React.ReactNode;
  padding?: SpacingKey;
  elevation?: ShadowKey;
}

const StyledCard = styled.div<{ padding: SpacingKey; elevation: ShadowKey }>`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ elevation, theme }) => theme.shadows[elevation]};
  padding: ${({ padding, theme }) => theme.spacing[padding]};
  transition: all ${({ theme }) => theme.transitions.normal};
`;

export const Card: React.FC<CardProps> = ({
  children,
  padding = 4,
  elevation = 'base',
}) => {
  return (
    <StyledCard padding={padding} elevation={elevation}>
      {children}
    </StyledCard>
  );
}; 