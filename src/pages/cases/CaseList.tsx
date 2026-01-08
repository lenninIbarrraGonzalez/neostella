import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useCases } from '../../hooks/useCases';
import { useClients } from '../../hooks/useClients';
import { useAuth } from '../../hooks/useAuth';
import { CaseStatus, CaseType } from '../../types';
import { CASE_STATUSES } from '../../constants/caseStatuses';
import { CASE_TYPES } from '../../constants/caseTypes';
import { formatDate } from '../../utils/dateFormatters';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import PriorityChip from '../../components/common/PriorityChip';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export function CaseList() {
  const { t, i18n } = useTranslation('cases');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, canCreateCase, canDeleteCase, canEditCase } = useAuth();
  const { getClientById } = useClients();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<CaseType | ''>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<string | null>(null);

  const { cases, deleteCase } = useCases({
    status: statusFilter || undefined,
    type: typeFilter || undefined,
    searchTerm: searchTerm || undefined,
  });

  const handleDelete = (id: string) => {
    setCaseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (caseToDelete) {
      deleteCase(caseToDelete);
      enqueueSnackbar(t('messages.deleted'), { variant: 'success' });
    }
    setDeleteDialogOpen(false);
    setCaseToDelete(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
  };

  const columns: GridColDef[] = [
    {
      field: 'caseNumber',
      headerName: t('list.caseNumber'),
      width: 130,
      renderCell: (params) => (
        <Chip label={params.value} size="small" variant="outlined" />
      ),
    },
    {
      field: 'title',
      headerName: t('list.caseTitle'),
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'clientId',
      headerName: t('list.client'),
      width: 150,
      renderCell: (params) => {
        const client = getClientById(params.value);
        return client?.name || '-';
      },
    },
    {
      field: 'status',
      headerName: t('list.status'),
      width: 140,
      renderCell: (params: GridRenderCellParams) => (
        <StatusChip status={params.value} />
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
      width: 120,
      renderCell: (params) =>
        params.value ? formatDate(params.value, i18n.language) : t('list.noDeadline'),
    },
    {
      field: 'actions',
      headerName: t('list.actions'),
      width: 130,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title={t('common:actions.view')}>
            <IconButton
              size="small"
              onClick={() => navigate(`/app/cases/${params.row.id}`)}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          {canEditCase(params.row) && (
            <Tooltip title={t('common:actions.edit')}>
              <IconButton
                size="small"
                onClick={() => navigate(`/app/cases/${params.row.id}/edit`)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          )}
          {canDeleteCase && (
            <Tooltip title={t('common:actions.delete')}>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(params.row.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
        action={
          canCreateCase && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/app/cases/new')}
            >
              {t('newCase')}
            </Button>
          )
        }
      />

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder={t('common:actions.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('filters.status')}</InputLabel>
            <Select
              value={statusFilter}
              label={t('filters.status')}
              onChange={(e) => setStatusFilter(e.target.value as CaseStatus | '')}
            >
              <MenuItem value="">{t('filters.all')}</MenuItem>
              {CASE_STATUSES.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {t(`common:status.${status.value}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>{t('filters.type')}</InputLabel>
            <Select
              value={typeFilter}
              label={t('filters.type')}
              onChange={(e) => setTypeFilter(e.target.value as CaseType | '')}
            >
              <MenuItem value="">{t('filters.all')}</MenuItem>
              {CASE_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {t(`common:caseType.${type.value}`)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {(searchTerm || statusFilter || typeFilter) && (
            <Button startIcon={<ClearIcon />} onClick={clearFilters}>
              {t('filters.clearFilters')}
            </Button>
          )}
        </Box>
      </Paper>

      {/* Data Grid */}
      <Paper sx={{ height: 600 }}>
        <DataGrid
          rows={cases}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
            sorting: { sortModel: [{ field: 'updatedAt', sort: 'desc' }] },
          }}
          disableRowSelectionOnClick
          onRowDoubleClick={(params) => navigate(`/app/cases/${params.row.id}`)}
          sx={{
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
            },
          }}
        />
      </Paper>

      <ConfirmDialog
        open={deleteDialogOpen}
        title={t('common:messages.confirmDeleteTitle')}
        message={t('messages.confirmDelete')}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
}

export default CaseList;
