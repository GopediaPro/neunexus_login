import React from 'react';

interface SubmitButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ label, onClick, disabled }) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default SubmitButton;
