import React from 'react';
import { Loader as RsuiteLoader } from 'rsuite';

import './custom-loader.scss';
import type { CustomLoaderProps } from '@/components/CustomLoader/types';

export const CustomLoader: React.FC<CustomLoaderProps> = ({
  size = 'md',
  content = '',
  className,
}) => (
  <div className={`CustomLoader ${className || ''}`}>
    <RsuiteLoader size={size} content={content} />
  </div>
);
