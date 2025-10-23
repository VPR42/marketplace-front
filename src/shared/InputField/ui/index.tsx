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
}: InputFieldProps) => {
  const [value, setValue] = useState('');
  return (
    <div className="input-block">
      <label className="input-label" htmlFor={name}>
        {label}
      </label>
      <Input
        id={name}
        placeholder={placeholder}
        type={isPassword ? 'password' : 'text'}
        value={value}
        onChange={(v) => setValue(String(v))}
      />
      {isPassword && showStrengthBar && (
        <PasswordStrengthBar
          password={value}
          shortScoreWord="Слишком короткий"
          scoreWords={['Очень слабый', 'Слабый', 'Средний', 'Хороший', 'Отличный']}
          className="sb"
        />
      )}
    </div>
  );
};
