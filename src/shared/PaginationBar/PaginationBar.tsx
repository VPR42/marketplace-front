import React from 'react';
import { Pagination } from 'rsuite';

import './pagination-bar.scss';

interface PaginationBarProps {
  page: number; // zero-based
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  disabled?: boolean;
  className?: string;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  page,
  pageSize,
  total,
  onChange,
  disabled = false,
  className,
}) => {
  const activePage = page + 1;
  const totalCount = Math.max(total, pageSize);

  return (
    <div className={`PaginationBar ${className ?? ''}`}>
      <Pagination
        prev
        next
        total={totalCount}
        limit={pageSize}
        activePage={activePage}
        maxButtons={5}
        onChangePage={(p) => onChange(p - 1)}
        disabled={disabled}
      />
    </div>
  );
};
