import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Book } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const FormContainer = styled.div`
  max-width: 400px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[6]};
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.primary[500]};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.neutral[800]};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.neutral[500]};
  font-size: ${({ theme }) => theme.fontSizes.base};
`;

const ErrorAlert = styled.div`
  background-color: ${({ theme }) => theme.colors.error[100]};
  color: ${({ theme }) => theme.colors.error[700]};
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const SignupLink = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.neutral[600]};
  
  a {
    color: ${({ theme }) => theme.colors.primary[500]};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading, error } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
  };
  
  return (
    <FormContainer>
      <Header>
        <Logo>
          <Book size={40} />
        </Logo>
        <Title>do-not-save</Title>
        <Subtitle>Sign in to access your bookmarks</Subtitle>
      </Header>
      
      {error && <ErrorAlert>{error}</ErrorAlert>}
      
      <Form onSubmit={handleSubmit}>
        <Input
          type="email"
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            // clearError();
          }}
          required
          fullWidth
        />
        
        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            // clearError();
          }}
          required
          fullWidth
        />
        
        <Button 
          type="submit" 
          isLoading={loading} 
          fullWidth
        >
          Sign In
        </Button>
      </Form>
      
      <SignupLink>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </SignupLink>
    </FormContainer>
  );
};

export default LoginForm;