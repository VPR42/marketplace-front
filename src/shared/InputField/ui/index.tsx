import { useState } from 'react';
import PasswordStrengthBar from 'react-password-strength-bar';
import { Button, Input } from 'rsuite';

import type { InputFieldProps } from '../types';

import './input-field.scss';
import { Eye, EyeOff } from 'lucide-react';

export const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  placeholder,
  isPassword,
  showStrengthBar = false,
  value,
  onChange,
  passwordVisible = false,
  onTogglePassword,
  error,
}: InputFieldProps) => {
  const [innerValue, setInnerValue] = useState(value);

  const handleChange = (v: string | number) => {
    const str = String(v);
    setInnerValue(str);
    onChange(str);
  };

  const displayValue = typeof value === 'string' ? value : innerValue;
  const EyeSize = 20;

  return (
    <div className="input-block">
      <label className="input-label" htmlFor={name}>
        {label}
      </label>
      <div className="input-inner">
        <Input
          id={name}
          placeholder={placeholder}
          type={isPassword ? (passwordVisible ? 'text' : 'password') : 'text'}
          value={displayValue}
          onChange={handleChange}
          className={`${error ? 'input-error' : ''} ${isPassword ? 'input-password' : ''}`.trim()}
        />
        {isPassword && onTogglePassword && (
          <Button className="password-toggle" onClick={onTogglePassword} appearance="subtle">
            {passwordVisible ? <EyeOff size={EyeSize} /> : <Eye size={EyeSize} />}
          </Button>
        )}
      </div>
      {error ? <span className="input-error-text">{error}</span> : null}
      {isPassword && showStrengthBar && (
        <PasswordStrengthBar
          password={displayValue}
          shortScoreWord="Password is too short"
          scoreWords={['Very weak', 'Weak', 'Normal', 'Good', 'Strong']}
          className="sb"
        />
      )}
    </div>
  );
};
