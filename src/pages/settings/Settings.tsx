import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
} from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { resetToSeedData } from '../../services/seedData';
import PageHeader from '../../components/common/PageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export function Settings() {
  const { t } = useTranslation('settings');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [firmInfo, setFirmInfo] = useState({
    name: 'García & Associates',
    email: 'info@garcialaw.com',
    phone: '555-0100',
    address: '100 Legal Way, Miami, FL 33101',
  });

  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleSaveFirmInfo = () => {
    enqueueSnackbar(t('messages.saved'), { variant: 'success' });
  };

  const handleResetData = () => {
    resetToSeedData();
    enqueueSnackbar(t('messages.dataReset'), { variant: 'success' });
    setResetDialogOpen(false);
    window.location.reload();
  };

  return (
    <Box>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <Grid container spacing={3}>
        {/* Navigation */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper>
            <List>
              <ListItem disablePadding>
                <ListItemButton selected>
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('sections.firm')} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate('/app/settings/users')}>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('sections.users')} />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Content */}
        <Grid size={{ xs: 12, md: 9 }}>
          {/* Firm Information */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {t('firm.title')}
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label={t('firm.name')}
                  value={firmInfo.name}
                  onChange={(e) => setFirmInfo({ ...firmInfo, name: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label={t('firm.email')}
                  type="email"
                  value={firmInfo.email}
                  onChange={(e) => setFirmInfo({ ...firmInfo, email: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label={t('firm.phone')}
                  value={firmInfo.phone}
                  onChange={(e) => setFirmInfo({ ...firmInfo, phone: e.target.value })}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label={t('firm.address')}
                  value={firmInfo.address}
                  onChange={(e) => setFirmInfo({ ...firmInfo, address: e.target.value })}
                />
              </Grid>
              <Grid size={12}>
                <Button variant="contained" onClick={handleSaveFirmInfo}>
                  {t('firm.save')}
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Danger Zone */}
          <Paper sx={{ p: 3, border: 2, borderColor: 'error.main' }}>
            <Typography variant="h6" fontWeight={600} color="error" gutterBottom>
              {t('danger.title')}
            </Typography>

            <Alert severity="warning" sx={{ mb: 2 }}>
              {t('danger.resetDataDescription')}
            </Alert>

            <Button
              variant="outlined"
              color="error"
              startIcon={<RefreshIcon />}
              onClick={() => setResetDialogOpen(true)}
            >
              {t('danger.resetDataButton')}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={resetDialogOpen}
        title={t('danger.resetData')}
        message={t('danger.resetDataConfirm')}
        confirmLabel={t('danger.resetDataButton')}
        onConfirm={handleResetData}
        onCancel={() => setResetDialogOpen(false)}
      />
    </Box>
  );
}

export default Settings;
