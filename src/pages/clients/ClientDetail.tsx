import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useClients } from '../../hooks/useClients';
import { useAuth } from '../../hooks/useAuth';
import { formatDate } from '../../utils/dateFormatters';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('clients');
  const { enqueueSnackbar } = useSnackbar();
  const { canEditClient, canDeleteClient } = useAuth();
  const { getClientById, getClientCases, deleteClient } = useClients();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const client = getClientById(id || '');
  const clientCases = client ? getClientCases(client.id) : [];

  if (!client) {
    return (
      <Box>
        <PageHeader title={t('clientNotFound')} backTo="/app/clients" />
        <EmptyState message={t('clientNotFound')} />
      </Box>
    );
  }

  const handleDelete = () => {
    deleteClient(client.id);
    enqueueSnackbar(t('messages.deleted'), { variant: 'success' });
    navigate('/app/clients');
  };

  const activeCases = clientCases.filter(c => c.status !== 'closed');

  return (
    <Box>
      <PageHeader
        title={client.name}
        breadcrumbs={[
          { label: t('title'), href: '/app/clients' },
          { label: client.name },
        ]}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {canEditClient && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/app/clients/${id}/edit`)}
              >
                {t('common:actions.edit')}
              </Button>
            )}
            {canDeleteClient && (
              <Button
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                {t('common:actions.delete')}
              </Button>
            )}
          </Box>
        }
      />

      <Grid container spacing={3}>
        {/* Client Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                {t('detail.contactInfo')}
              </Typography>
              <Chip
                label={t(`common:clientType.${client.type}`)}
                color={client.type === 'business' ? 'primary' : 'default'}
                size="small"
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <EmailIcon color="action" fontSize="small" />
              <Typography>{client.email}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PhoneIcon color="action" fontSize="small" />
              <Typography>{client.phone}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
              <LocationIcon color="action" fontSize="small" />
              <Typography>{client.address || 'No address'}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary" gutterBottom>
              {t('detail.clientSince')}
            </Typography>
            <Typography>{formatDate(client.createdAt, i18n.language)}</Typography>

            <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('detail.totalCases')}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {clientCases.length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('detail.activeCases')}
                </Typography>
                <Typography variant="h5" fontWeight={600} color="primary">
                  {activeCases.length}
                </Typography>
              </Box>
            </Box>

            {client.notes && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Notes
                </Typography>
                <Typography>{client.notes}</Typography>
              </>
            )}
          </Paper>
        </Grid>

        {/* Associated Cases */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {t('detail.associatedCases')}
            </Typography>

            {clientCases.length === 0 ? (
              <EmptyState message={t('detail.noCases')} />
            ) : (
              <List>
                {clientCases.map((caseItem) => (
                  <ListItem
                    key={caseItem.id}
                    sx={{
                      borderBottom: 1,
                      borderColor: 'divider',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => navigate(`/app/cases/${caseItem.id}`)}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label={caseItem.caseNumber} size="small" variant="outlined" />
                          <Typography fontWeight={500}>{caseItem.title}</Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {t(`common:caseType.${caseItem.type}`)} • Created {formatDate(caseItem.createdAt, i18n.language)}
                          </Typography>
                        </Box>
                      }
                    />
                    <StatusChip status={caseItem.status} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={deleteDialogOpen}
        title={t('common:messages.confirmDeleteTitle')}
        message={t('messages.confirmDelete')}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
}

export default ClientDetail;
