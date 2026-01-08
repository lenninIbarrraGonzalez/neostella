import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
} from '@mui/material';
import {
  Business as BusinessIcon,
  People as PeopleIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { getStorageItem, setStorageItem } from '../../services/storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { User, UserRole } from '../../types';
import { ROLES } from '../../constants/roles';
import { formatDate } from '../../utils/dateFormatters';
import PageHeader from '../../components/common/PageHeader';

export function UserManagement() {
  const { t, i18n } = useTranslation('settings');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [users, setUsers] = useState<User[]>(
    getStorageItem<User[]>(STORAGE_KEYS.USERS) || []
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'paralegal' as UserRole,
    isActive: true,
  });

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        isActive: user.isActive,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'paralegal',
        isActive: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
  };

  const handleSaveUser = () => {
    if (!formData.name || !formData.email) {
      return;
    }

    let updatedUsers: User[];

    if (editingUser) {
      updatedUsers = users.map(u =>
        u.id === editingUser.id
          ? {
              ...u,
              name: formData.name,
              email: formData.email,
              role: formData.role,
              isActive: formData.isActive,
              ...(formData.password && { password: formData.password }),
            }
          : u
      );
      enqueueSnackbar(t('users.messages.updated'), { variant: 'success' });
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        password: formData.password || 'password123',
        role: formData.role,
        isActive: formData.isActive,
        preferences: { language: 'en', theme: 'light' },
        createdAt: new Date(),
      };
      updatedUsers = [...users, newUser];
      enqueueSnackbar(t('users.messages.created'), { variant: 'success' });
    }

    setUsers(updatedUsers);
    setStorageItem(STORAGE_KEYS.USERS, updatedUsers);
    handleCloseDialog();
  };

  const handleToggleActive = (userId: string) => {
    const updatedUsers = users.map(u =>
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    );
    setUsers(updatedUsers);
    setStorageItem(STORAGE_KEYS.USERS, updatedUsers);
    enqueueSnackbar(
      updatedUsers.find(u => u.id === userId)?.isActive
        ? t('users.messages.activated')
        : t('users.messages.deactivated'),
      { variant: 'success' }
    );
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: t('users.list.name'),
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'email',
      headerName: t('users.list.email'),
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'role',
      headerName: t('users.list.role'),
      width: 130,
      renderCell: (params) => (
        <Chip
          label={t(`common:roles.${params.value}`)}
          size="small"
          color={params.value === 'admin' ? 'primary' : params.value === 'attorney' ? 'secondary' : 'default'}
        />
      ),
    },
    {
      field: 'isActive',
      headerName: t('users.list.status'),
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? t('common:status.active') : t('common:status.inactive')}
          size="small"
          color={params.value ? 'success' : 'default'}
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: t('users.list.createdAt'),
      width: 120,
      renderCell: (params) => formatDate(params.value, i18n.language),
    },
    {
      field: 'actions',
      headerName: t('users.list.actions'),
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title={t('common:actions.edit')}>
            <IconButton size="small" onClick={() => handleOpenDialog(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title={t('users.title')}
        subtitle={t('users.subtitle')}
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            {t('users.newUser')}
          </Button>
        }
      />

      <Grid container spacing={3}>
        {/* Navigation */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper>
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate('/app/settings')}>
                  <ListItemIcon>
                    <BusinessIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('sections.firm')} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton selected>
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
          <Paper sx={{ height: 500 }}>
            <DataGrid
              rows={users}
              columns={columns}
              pageSizeOptions={[10, 25]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              disableRowSelectionOnClick
            />
          </Paper>
        </Grid>
      </Grid>

      {/* User Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? t('users.editUser') : t('users.newUser')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label={t('users.form.name')}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label={t('users.form.email')}
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label={t('users.form.password')}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              helperText={editingUser ? 'Leave empty to keep current password' : 'Required for new users'}
              required={!editingUser}
            />
            <FormControl fullWidth>
              <InputLabel>{t('users.form.role')}</InputLabel>
              <Select
                value={formData.role}
                label={t('users.form.role')}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              >
                {ROLES.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {t(`common:roles.${role.value}`)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
              }
              label={t('users.form.active')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common:actions.cancel')}</Button>
          <Button variant="contained" onClick={handleSaveUser}>
            {t('common:actions.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserManagement;
