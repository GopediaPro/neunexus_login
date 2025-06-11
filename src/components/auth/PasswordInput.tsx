import React, { useState } from 'react';

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange, error }) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label>비밀번호</label>
      <input
        type={show ? 'text' : 'password'}
        placeholder="비밀번호"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="button" onClick={() => setShow(!show)}>
        {show ? '숨기기' : '보기'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PasswordInput;
