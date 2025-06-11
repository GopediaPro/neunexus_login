import React from 'react';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const EmailInput: React.FC<EmailInputProps> = ({ value, onChange, error }) => {
  return (
    <div>
      <label>이메일</label>
      <input
        type="email"
        placeholder="your@email.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default EmailInput;
