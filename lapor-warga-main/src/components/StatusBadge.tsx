import { ComplaintStatus, statusLabels, statusColors } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ComplaintStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
        statusColors[status],
        className
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
