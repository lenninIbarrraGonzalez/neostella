import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
  Checkbox,
} from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useTasks } from '../../hooks/useTasks';
import { useCases } from '../../hooks/useCases';
import { TaskStatus, Priority } from '../../types';
import { formatDate, isOverdue, isDueSoon } from '../../utils/dateFormatters';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import PriorityChip from '../../components/common/PriorityChip';

export function TaskList() {
  const { t, i18n } = useTranslation('tasks');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { getCaseById } = useCases();

  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | ''>('');

  const { tasks, completeTask, updateTask } = useTasks({
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
  });

  const handleComplete = (taskId: string) => {
    completeTask(taskId);
    enqueueSnackbar(t('messages.completed'), { variant: 'success' });
  };

  const columns: GridColDef[] = [
    {
      field: 'complete',
      headerName: '',
      width: 50,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Checkbox
          checked={params.row.status === 'completed'}
          disabled={params.row.status === 'completed' || params.row.status === 'cancelled'}
          onChange={() => handleComplete(params.row.id)}
          size="small"
        />
      ),
    },
    {
      field: 'title',
      headerName: t('list.title'),
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ textDecoration: params.row.status === 'completed' ? 'line-through' : 'none' }}>
          {params.value}
        </Box>
      ),
    },
    {
      field: 'caseId',
      headerName: t('list.case'),
      width: 150,
      renderCell: (params) => {
        const caseData = getCaseById(params.value);
        return caseData ? (
          <Chip
            label={caseData.caseNumber}
            size="small"
            variant="outlined"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/app/cases/${caseData.id}`);
            }}
          />
        ) : '-';
      },
    },
    {
      field: 'status',
      headerName: t('list.status'),
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <StatusChip status={params.value} type="task" />
      ),
    },
    {
      field: 'priority',
      headerName: t('list.priority'),
      width: 110,
      renderCell: (params: GridRenderCellParams) => (
        <PriorityChip priority={params.value} />
      ),
    },
    {
      field: 'deadline',
      headerName: t('list.deadline'),
      width: 220,
      renderCell: (params) => {
        if (!params.value) return t('list.noDeadline');
        const overdue = isOverdue(params.value);
        const dueSoon = isDueSoon(params.value, 3);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', color: overdue ? 'error.main' : dueSoon ? 'warning.main' : 'text.primary' }}>
            {formatDate(params.value, i18n.language)}
            {overdue && <Chip label={t('deadline.overdue')} size="small" color="error" sx={{ ml: 1 }} />}
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: '',
      width: 60,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        params.row.status !== 'completed' && params.row.status !== 'cancelled' && (
          <Tooltip title={t('actions.markComplete')}>
            <IconButton
              size="small"
              color="success"
              onClick={() => handleComplete(params.row.id)}
            >
              <CheckIcon />
            </IconButton>
          </Tooltip>
        )
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('filters.status')}</InputLabel>
            <Select
              value={statusFilter}
              label={t('filters.status')}
              onChange={(e) => setStatusFilter(e.target.value as TaskStatus | '')}
            >
              <MenuItem value="">{t('filters.all')}</MenuItem>
              <MenuItem value="pending">{t('status.pending')}</MenuItem>
              <MenuItem value="in_progress">{t('status.in_progress')}</MenuItem>
              <MenuItem value="completed">{t('status.completed')}</MenuItem>
              <MenuItem value="cancelled">{t('status.cancelled')}</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('filters.priority')}</InputLabel>
            <Select
              value={priorityFilter}
              label={t('filters.priority')}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | '')}
            >
              <MenuItem value="">{t('filters.all')}</MenuItem>
              <MenuItem value="low">{t('common:priority.low')}</MenuItem>
              <MenuItem value="medium">{t('common:priority.medium')}</MenuItem>
              <MenuItem value="high">{t('common:priority.high')}</MenuItem>
              <MenuItem value="urgent">{t('common:priority.urgent')}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper sx={{ height: 600 }}>
        <DataGrid
          rows={tasks}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
}

export default TaskList;
