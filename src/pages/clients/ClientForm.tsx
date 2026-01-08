import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useClients } from '../../hooks/useClients';
import { ClientType, CreateClientData } from '../../types';
import PageHeader from '../../components/common/PageHeader';

export function ClientForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('clients');
  const { enqueueSnackbar } = useSnackbar();
  const { getClientById, addClient, updateClient } = useClients();

  const isEdit = Boolean(id);
  const existingClient = isEdit ? getClientById(id!) : null;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    type: 'individual' as ClientType,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingClient) {
      setFormData({
        name: existingClient.name,
        email: existingClient.email,
        phone: existingClient.phone,
        address: existingClient.address,
        type: existingClient.type,
        notes: existingClient.notes,
      });
    }
  }, [existingClient]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('common:validation.required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('common:validation.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('common:validation.email');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const clientData: CreateClientData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      type: formData.type,
      notes: formData.notes,
    };

    if (isEdit && id) {
      updateClient(id, clientData);
      enqueueSnackbar(t('messages.updated'), { variant: 'success' });
    } else {
      addClient(clientData);
      enqueueSnackbar(t('messages.created'), { variant: 'success' });
    }

    navigate('/app/clients');
  };

  return (
    <Box>
      <PageHeader
        title={isEdit ? t('editClient') : t('newClient')}
        breadcrumbs={[
          { label: t('title'), href: '/app/clients' },
          { label: isEdit ? t('editClient') : t('newClient') },
        ]}
      />

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('form.name')}
                placeholder={t('form.namePlaceholder')}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={Boolean(errors.name)}
                helperText={errors.name}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>{t('form.type')}</InputLabel>
                <Select
                  value={formData.type}
                  label={t('form.type')}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ClientType })}
                >
                  <MenuItem value="individual">{t('common:clientType.individual')}</MenuItem>
                  <MenuItem value="business">{t('common:clientType.business')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('form.email')}
                placeholder={t('form.emailPlaceholder')}
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={Boolean(errors.email)}
                helperText={errors.email}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={t('form.phone')}
                placeholder={t('form.phonePlaceholder')}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label={t('form.address')}
                placeholder={t('form.addressPlaceholder')}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('form.notes')}
                placeholder={t('form.notesPlaceholder')}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>

            <Grid size={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button onClick={() => navigate('/app/clients')}>
                  {t('common:actions.cancel')}
                </Button>
                <Button type="submit" variant="contained">
                  {t('common:actions.save')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default ClientForm;
