import { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { useCases } from '../../hooks/useCases';
import { useAuth } from '../../hooks/useAuth';
import { getStorageItem } from '../../services/storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { User } from '../../types';
import { formatDate } from '../../utils/dateFormatters';
import { formatDuration, parseDuration } from '../../utils/formatters';
import PageHeader from '../../components/common/PageHeader';

export function TimeTracking() {
  const { t, i18n } = useTranslation('timeTracking');
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();
  const { cases } = useCases();
  const {
    timeEntries,
    addTimeEntry,
    todayMinutes,
    thisWeekMinutes,
    thisMonthMinutes,
    billableMinutes,
  } = useTimeTracking();

  const users = getStorageItem<User[]>(STORAGE_KEYS.USERS) || [];

  const [formData, setFormData] = useState({
    caseId: '',
    description: '',
    duration: '',
    date: new Date(),
    billable: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.caseId || !formData.description || !formData.duration || !user) {
      return;
    }

    const durationMinutes = parseDuration(formData.duration);
    if (durationMinutes <= 0) {
      enqueueSnackbar('Please enter a valid duration', { variant: 'error' });
      return;
    }

    addTimeEntry({
      caseId: formData.caseId,
      userId: user.id,
      description: formData.description,
      duration: durationMinutes,
      date: formData.date,
      billable: formData.billable,
    });

    enqueueSnackbar(t('messages.created'), { variant: 'success' });

    setFormData({
      caseId: '',
      description: '',
      duration: '',
      date: new Date(),
      billable: true,
    });
  };

  const selectedCase = cases.find(c => c.id === formData.caseId) || null;

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: t('list.date'),
      width: 120,
      renderCell: (params) => formatDate(params.value, i18n.language),
    },
    {
      field: 'caseId',
      headerName: t('list.case'),
      width: 150,
      renderCell: (params) => {
        const caseData = cases.find(c => c.id === params.value);
        return caseData?.caseNumber || '-';
      },
    },
    {
      field: 'description',
      headerName: t('list.description'),
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'duration',
      headerName: t('list.duration'),
      width: 100,
      renderCell: (params) => formatDuration(params.value),
    },
    {
      field: 'billable',
      headerName: t('list.billable'),
      width: 100,
      renderCell: (params) => (params.value ? 'Yes' : 'No'),
    },
    {
      field: 'userId',
      headerName: t('list.user'),
      width: 150,
      renderCell: (params) => {
        const entryUser = users.find(u => u.id === params.value);
        return entryUser?.name || '-';
      },
    },
  ];

  return (
    <Box>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
      />

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t('summary.today')}
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {formatDuration(todayMinutes)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t('summary.thisWeek')}
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {formatDuration(thisWeekMinutes)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t('summary.thisMonth')}
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {formatDuration(thisMonthMinutes)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {t('summary.billable')}
              </Typography>
              <Typography variant="h4" fontWeight={700} color="success.main">
                {formatDuration(billableMinutes)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Log Time Form */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {t('logTime')}
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Autocomplete
                options={cases}
                getOptionLabel={(option) => `${option.caseNumber} - ${option.title}`}
                value={selectedCase}
                onChange={(_, value) => setFormData({ ...formData, caseId: value?.id || '' })}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('form.case')}
                    placeholder={t('form.casePlaceholder')}
                    required
                    sx={{ mb: 2 }}
                  />
                )}
              />

              <TextField
                fullWidth
                label={t('form.description')}
                placeholder={t('form.descriptionPlaceholder')}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label={t('form.duration')}
                placeholder={t('form.durationPlaceholder')}
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                helperText={t('form.durationHint')}
                required
                sx={{ mb: 2 }}
              />

              <DatePicker
                label={t('form.date')}
                value={formData.date}
                onChange={(date) => setFormData({ ...formData, date: date || new Date() })}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { mb: 2 },
                  },
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.billable}
                    onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                  />
                }
                label={t('form.billable')}
                sx={{ mb: 2 }}
              />
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2, mt: -1 }}>
                {t('form.billableHint')}
              </Typography>

              <Button type="submit" variant="contained" fullWidth>
                {t('logTime')}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Time Entries List */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ height: 500 }}>
            <DataGrid
              rows={timeEntries}
              columns={columns}
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
                sorting: { sortModel: [{ field: 'date', sort: 'desc' }] },
              }}
              disableRowSelectionOnClick
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TimeTracking;
