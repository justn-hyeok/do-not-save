import React from 'react';
import styled, { css } from 'styled-components';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const getVariantStyles = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${({ theme }) => theme.colors.primary[500]};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.primary[600]};
        }
        &:active:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.primary[700]};
        }
      `;
    case 'secondary':
      return css`
        background-color: ${({ theme }) => theme.colors.neutral[200]};
        color: ${({ theme }) => theme.colors.neutral[900]};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.neutral[300]};
        }
        &:active:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.neutral[400]};
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        border: 1px solid ${({ theme }) => theme.colors.neutral[300]};
        color: ${({ theme }) => theme.colors.neutral[900]};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.neutral[100]};
        }
        &:active:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.neutral[200]};
        }
      `;
    case 'ghost':
      return css`
        background-color: transparent;
        color: ${({ theme }) => theme.colors.neutral[900]};
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.neutral[100]};
        }
        &:active:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.neutral[200]};
        }
      `;
    case 'danger':
      return css`
        background-color: ${({ theme }) => theme.colors.error[500]};
        color: white;
        &:hover:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.error[600]};
        }
        &:active:not(:disabled) {
          background-color: ${({ theme }) => theme.colors.error[700]};
        }
      `;
  }
};

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
        font-size: ${({ theme }) => theme.fontSizes.sm};
        gap: ${({ theme }) => theme.spacing[1]};
      `;
    case 'md':
      return css`
        padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
        font-size: ${({ theme }) => theme.fontSizes.base};
        gap: ${({ theme }) => theme.spacing[2]};
      `;
    case 'lg':
      return css`
        padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
        font-size: ${({ theme }) => theme.fontSizes.lg};
        gap: ${({ theme }) => theme.spacing[2]};
      `;
  }
};

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth?: boolean;
  $isLoading?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
  opacity: ${({ $isLoading }) => ($isLoading ? 0.7 : 1)};
  pointer-events: ${({ $isLoading }) => ($isLoading ? 'none' : 'auto')};

  ${({ $variant }) => getVariantStyles($variant)}
  ${({ $size }) => getSizeStyles($size)}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled(Loader2)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $isLoading={isLoading}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner size={16} />}
      {!isLoading && leftIcon}
      {children}
      {!isLoading && rightIcon}
    </StyledButton>
  );
};