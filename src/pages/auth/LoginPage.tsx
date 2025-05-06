import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import styled from 'styled-components';

const FormContainer = styled.div`
  max-width: 400px;
  margin: 80px auto;
  padding: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: white;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const Title = styled.h2`
  margin-bottom: 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary[700]};
`;

const ErrorMsg = styled.div`
  color: ${({ theme }) => theme.colors.error[500]};
  margin-bottom: 16px;
  text-align: center;
`;

const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const err = await signIn(email, password);
    setLoading(false);
    if (err) setError(err);
    else navigate('/');
  };

  return (
    <FormContainer>
      <Title>로그인</Title>
      <form onSubmit={handleSubmit}>
        <Input
          label="이메일"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          fullWidth
        />
        <Input
          label="비밀번호"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          fullWidth
          style={{ marginTop: 16 }}
        />
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Button type="submit" isLoading={loading} fullWidth style={{ marginTop: 16 }}>
          로그인
        </Button>
      </form>
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Link to="/signup">회원가입</Link>
      </div>
    </FormContainer>
  );
};

export default LoginPage; 