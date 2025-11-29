import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { SearchInputProps } from '@/shared/SearchInput/types';
import './search-input.scss';

export const SearchInput = ({
  placeholder = 'Поиск...',
  onSearch,
  defaultValue = '',
}: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    onSearch?.(val);
  };

  return (
    <div className={`SearchInput ${isFocused ? 'focused' : ''}`}>
      <Search size={16} />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};
