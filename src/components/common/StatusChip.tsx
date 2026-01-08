import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CaseStatus, TaskStatus } from '../../types';
import { STATUS_COLORS } from '../../constants/caseStatuses';
import { TASK_STATUS_COLORS } from '../../utils/formatters';

interface StatusChipProps {
  status: CaseStatus | TaskStatus;
  type?: 'case' | 'task';
  size?: 'small' | 'medium';
}

export function StatusChip({ status, type = 'case', size = 'small' }: StatusChipProps) {
  const { t } = useTranslation();

  const colors = type === 'case' ? STATUS_COLORS : TASK_STATUS_COLORS;
  const color = colors[status as keyof typeof colors] || '#9e9e9e';

  return (
    <Chip
      label={t(`common:status.${status}`)}
      size={size}
      sx={{
        backgroundColor: color,
        color: '#ffffff',
        fontWeight: 500,
        textTransform: 'capitalize',
      }}
    />
  );
}

export default StatusChip;
