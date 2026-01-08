import { useState } from 'react';
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
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useClients } from '../../hooks/useClients';
import { useAuth } from '../../hooks/useAuth';
import { ClientType } from '../../types';
import { formatDate } from '../../utils/dateFormatters';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export function ClientList() {
  const { t, i18n } = useTranslation('clients');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { canCreateClient, canDeleteClient } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<ClientType | ''>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const { clients, deleteClient, getActiveCasesCount } = useClients({
    type: typeFilter || undefined,
    searchTerm: searchTerm || undefined,
  });

  const handleDelete = (id: string) => {
    setClientToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete);
      enqueueSnackbar(t('messages.deleted'), { variant: 'success' });
    }
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('list.name'),
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'email',
      headerName: t('list.email'),
      width: 200,
    },
    {
      field: 'phone',
      headerName: t('list.phone'),
      width: 130,
    },
    {
      field: 'type',
      headerName: t('list.type'),
      width: 120,
      renderCell: (params) => (
        <Chip
          label={t(`common:clientType.${params.value}`)}
          size="small"
          color={params.value === 'business' ? 'primary' : 'default'}
          variant="outlined"
        />
      ),
    },
    {
      field: 'activeCases',
      headerName: t('list.activeCases'),
      width: 120,
      renderCell: (params) => getActiveCasesCount(params.row.id),
    },
    {
      field: 'createdAt',
      headerName: t('list.createdAt'),
      width: 120,
      renderCell: (params) => formatDate(params.value, i18n.language),
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
              onClick={() => navigate(`/app/clients/${params.row.id}`)}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common:actions.edit')}>
            <IconButton
              size="small"
              onClick={() => navigate(`/app/clients/${params.row.id}/edit`)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          {canDeleteClient && (
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
          canCreateClient && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/app/clients/new')}
            >
              {t('newClient')}
            </Button>
          )
        }
      />

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
            <InputLabel>{t('filters.type')}</InputLabel>
            <Select
              value={typeFilter}
              label={t('filters.type')}
              onChange={(e) => setTypeFilter(e.target.value as ClientType | '')}
            >
              <MenuItem value="">{t('filters.all')}</MenuItem>
              <MenuItem value="individual">{t('filters.individual')}</MenuItem>
              <MenuItem value="business">{t('filters.business')}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Paper sx={{ height: 600 }}>
        <DataGrid
          rows={clients}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          disableRowSelectionOnClick
          onRowDoubleClick={(params) => navigate(`/app/clients/${params.row.id}`)}
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

export default ClientList;
