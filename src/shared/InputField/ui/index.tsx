import { useState } from 'react';
import PasswordStrengthBar from 'react-password-strength-bar';
import { Input } from 'rsuite';

import type { InputFieldProps } from '../types';
import './input-field.scss';

export const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  placeholder,
  isPassword,
  showStrengthBar = false,
  value,
  onChange,
  error,
}: InputFieldProps) => {
  const [innerValue, setInnerValue] = useState(value);

  const handleChange = (v: string | number) => {
    const str = String(v);
    setInnerValue(str);
    onChange(str);
  };

  const displayValue = typeof value === 'string' ? value : innerValue;

  return (
    <div className="input-block">
      <label className="input-label" htmlFor={name}>
        {label}
      </label>
      <Input
        id={name}
        placeholder={placeholder}
        type={isPassword ? 'password' : 'text'}
        value={displayValue}
        onChange={handleChange}
        className={error ? 'input-error' : undefined}
      />
      {error ? <span className="input-error-text">{error}</span> : null}
      {isPassword && showStrengthBar && (
        <PasswordStrengthBar
          password={displayValue}
          shortScoreWord="Password is too short"
          scoreWords={['Очень слабый', 'Слабый', 'Нормальный', 'Сильный', 'Очень сильный']}
          className="sb"
        />
      )}
    </div>
  );
};
