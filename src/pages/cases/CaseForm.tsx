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
  Autocomplete,
  Chip,
  Avatar,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useCases } from '../../hooks/useCases';
import { useClients } from '../../hooks/useClients';
import { useAuth } from '../../hooks/useAuth';
import { getStorageItem } from '../../services/storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { User, CaseType, Priority, CreateCaseData } from '../../types';
import { CASE_TYPES } from '../../constants/caseTypes';
import PageHeader from '../../components/common/PageHeader';

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export function CaseForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('cases');
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { getCaseById, addCase, updateCase } = useCases();
  const { allClients } = useClients();

  const isEdit = Boolean(id);
  const existingCase = isEdit ? getCaseById(id!) : null;
  const users = getStorageItem<User[]>(STORAGE_KEYS.USERS) || [];
  const attorneys = users.filter(u => u.role === 'admin' || u.role === 'attorney');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    clientId: '',
    type: 'personal_injury' as CaseType,
    priority: 'medium' as Priority,
    assignedTo: [] as string[],
    deadline: null as Date | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existingCase) {
      setFormData({
        title: existingCase.title,
        description: existingCase.description,
        clientId: existingCase.clientId,
        type: existingCase.type,
        priority: existingCase.priority,
        assignedTo: existingCase.assignedTo,
        deadline: existingCase.deadline,
      });
    }
  }, [existingCase]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = t('common:validation.required');
    } else if (formData.title.length < 3) {
      newErrors.title = t('common:validation.minLength', { min: 3 });
    }

    if (!formData.clientId) {
      newErrors.clientId = t('common:validation.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate() || !user) return;

    const caseData: CreateCaseData = {
      title: formData.title,
      description: formData.description,
      clientId: formData.clientId,
      type: formData.type,
      status: existingCase?.status || 'new',
      priority: formData.priority,
      assignedTo: formData.assignedTo.length > 0 ? formData.assignedTo : [user.id],
      deadline: formData.deadline,
      createdBy: existingCase?.createdBy || user.id,
    };

    if (isEdit && id) {
      updateCase(id, caseData);
      enqueueSnackbar(t('messages.updated'), { variant: 'success' });
    } else {
      addCase(caseData);
      enqueueSnackbar(t('messages.created'), { variant: 'success' });
    }

    navigate('/app/cases');
  };

  const selectedClient = allClients.find(c => c.id === formData.clientId) || null;
  const selectedAttorneys = attorneys.filter(a => formData.assignedTo.includes(a.id));

  return (
    <Box>
      <PageHeader
        title={isEdit ? t('editCase') : t('newCase')}
        breadcrumbs={[
          { label: t('title'), href: '/app/cases' },
          { label: isEdit ? t('editCase') : t('newCase') },
        ]}
      />

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <TextField
                fullWidth
                label={t('form.title')}
                placeholder={t('form.titlePlaceholder')}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={Boolean(errors.title)}
                helperText={errors.title}
                required
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label={t('form.description')}
                placeholder={t('form.descriptionPlaceholder')}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Autocomplete
                options={allClients}
                getOptionLabel={(option) => option.name}
                value={selectedClient}
                onChange={(_, value) => setFormData({ ...formData, clientId: value?.id || '' })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('form.client')}
                    placeholder={t('form.clientPlaceholder')}
                    error={Boolean(errors.clientId)}
                    helperText={errors.clientId}
                    required
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>{t('form.type')}</InputLabel>
                <Select
                  value={formData.type}
                  label={t('form.type')}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as CaseType })}
                >
                  {CASE_TYPES.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {t(`common:caseType.${type.value}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>{t('form.priority')}</InputLabel>
                <Select
                  value={formData.priority}
                  label={t('form.priority')}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                >
                  {PRIORITIES.map((priority) => (
                    <MenuItem key={priority.value} value={priority.value}>
                      {t(`common:priority.${priority.value}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <DatePicker
                label={t('form.deadline')}
                value={formData.deadline}
                onChange={(date) => setFormData({ ...formData, deadline: date })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </Grid>

            <Grid size={12}>
              <Autocomplete
                multiple
                options={attorneys}
                getOptionLabel={(option) => option.name}
                value={selectedAttorneys}
                onChange={(_, value) => setFormData({ ...formData, assignedTo: value.map(v => v.id) })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('form.assignedTo')}
                    placeholder={t('form.assignedToPlaceholder')}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.id}
                      avatar={<Avatar>{option.name[0]}</Avatar>}
                      label={option.name}
                    />
                  ))
                }
              />
            </Grid>

            <Grid size={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button onClick={() => navigate('/app/cases')}>
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

export default CaseForm;
