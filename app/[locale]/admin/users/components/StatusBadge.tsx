import React from 'react';

export type StatusType = 'verified' | 'unverified' | 'active' | 'suspended';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  t?: (key: string, defaultValue?: string) => string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, t }) => {
  const baseStyles = 'inline-flex items-center rounded-full text-xs font-medium px-3 py-1';
  
  const statusStyles = {
    verified: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    unverified: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    suspended: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  };

  return (
    <span className={`${baseStyles} ${statusStyles[status]} ${className || ''}`}>
      {t ? t(`admin.table.status.${status}`, status) : status}
    </span>
  );
};

export default StatusBadge;