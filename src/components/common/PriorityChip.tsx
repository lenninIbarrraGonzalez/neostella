import { Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Priority } from '../../types';
import { PRIORITY_COLORS } from '../../utils/formatters';

interface PriorityChipProps {
  priority: Priority;
  size?: 'small' | 'medium';
}

export function PriorityChip({ priority, size = 'small' }: PriorityChipProps) {
  const { t } = useTranslation();

  const color = PRIORITY_COLORS[priority] || '#9e9e9e';

  return (
    <Chip
      label={t(`common:priority.${priority}`)}
      size={size}
      variant="outlined"
      sx={{
        borderColor: color,
        color: color,
        fontWeight: 500,
      }}
    />
  );
}

export default PriorityChip;
