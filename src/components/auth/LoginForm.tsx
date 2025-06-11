import React, { useState } from 'react';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import SubmitButton from './SubmitButton';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setError('');
    console.log('로그인 시도:', email, password);
    alert('로그인 요청 보냄 (콘솔 확인)');
  };

  return (
    <div>
      <h2>로그인</h2>
      <EmailInput value={email} onChange={setEmail} />
      <PasswordInput value={password} onChange={setPassword} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <SubmitButton label="로그인" onClick={handleLogin} />
    </div>
  );
};

export default LoginForm;
