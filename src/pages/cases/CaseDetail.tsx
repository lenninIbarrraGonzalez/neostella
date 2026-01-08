import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useCases } from '../../hooks/useCases';
import { useClients } from '../../hooks/useClients';
import { useTasks } from '../../hooks/useTasks';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../hooks/useAuth';
import { getStorageItem } from '../../services/storage';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { User, CaseStatus } from '../../types';
import { CASE_STATUSES } from '../../constants/caseStatuses';
import { formatDate, formatRelative } from '../../utils/dateFormatters';
import { formatDuration } from '../../utils/formatters';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';
import PriorityChip from '../../components/common/PriorityChip';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index} style={{ paddingTop: 16 }}>
      {value === index && children}
    </div>
  );
}

export function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('cases');
  const { enqueueSnackbar } = useSnackbar();
  const { user, canEditCase, canDeleteCase, canChangeCaseStatus } = useAuth();
  const { getCaseById, deleteCase, changeCaseStatus } = useCases();
  const { getClientById } = useClients();
  const { tasksByCase, completeTask, addTask } = useTasks();
  const { entriesByCase, totalMinutesByCase } = useTimeTracking();
  const { activities, notes, addNote } = useApp();

  const [activeTab, setActiveTab] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const caseData = getCaseById(id || '');
  const client = caseData ? getClientById(caseData.clientId) : null;
  const caseTasks = caseData ? tasksByCase(caseData.id) : [];
  const caseTimeEntries = caseData ? entriesByCase(caseData.id) : [];
  const caseNotes = caseData ? notes.filter(n => n.caseId === caseData.id) : [];
  const caseActivities = caseData ? activities.filter(a => a.caseId === caseData.id) : [];
  const totalTime = caseData ? totalMinutesByCase(caseData.id) : 0;

  const users = getStorageItem<User[]>(STORAGE_KEYS.USERS) || [];
  const assignedUsers = caseData?.assignedTo.map(userId => users.find(u => u.id === userId)).filter(Boolean) || [];

  if (!caseData) {
    return (
      <Box>
        <PageHeader title={t('caseNotFound')} backTo="/app/cases" />
        <EmptyState message={t('caseNotFound')} />
      </Box>
    );
  }

  const canEdit = canEditCase(caseData);
  const canDelete = canDeleteCase;
  const canChangeStatus = canChangeCaseStatus(caseData);

  const handleDelete = () => {
    deleteCase(caseData.id);
    enqueueSnackbar(t('messages.deleted'), { variant: 'success' });
    navigate('/app/cases');
  };

  const handleStatusChange = (status: CaseStatus) => {
    changeCaseStatus(caseData.id, status);
    enqueueSnackbar(t('messages.statusChanged', { status: t(`common:status.${status}`) }), { variant: 'success' });
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !user) return;
    addNote({ caseId: caseData.id, userId: user.id, content: newNote });
    setNewNote('');
    enqueueSnackbar('Note added', { variant: 'success' });
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !user) return;
    addTask({
      caseId: caseData.id,
      title: newTaskTitle,
      description: '',
      status: 'pending',
      priority: 'medium',
      assignedTo: user.id,
      deadline: null,
    });
    setNewTaskTitle('');
    enqueueSnackbar('Task added', { variant: 'success' });
  };

  return (
    <Box>
      <PageHeader
        title={`${caseData.caseNumber} - ${caseData.title}`}
        breadcrumbs={[
          { label: t('title'), href: '/app/cases' },
          { label: caseData.caseNumber },
        ]}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {canChangeStatus && (
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>{t('actions.changeStatus')}</InputLabel>
                <Select
                  value={caseData.status}
                  label={t('actions.changeStatus')}
                  onChange={(e) => handleStatusChange(e.target.value as CaseStatus)}
                >
                  {CASE_STATUSES.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {t(`common:status.${status.value}`)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {canEdit && (
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/app/cases/${id}/edit`)}
              >
                {t('common:actions.edit')}
              </Button>
            )}
            {canDelete && (
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
        {/* Case Info Panel */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {t('detail.caseInfo')}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Status</Typography>
              <StatusChip status={caseData.status} />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Priority</Typography>
              <PriorityChip priority={caseData.priority} />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Type</Typography>
              <Typography>{t(`common:caseType.${caseData.type}`)}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">Deadline</Typography>
              <Typography>
                {caseData.deadline ? formatDate(caseData.deadline, i18n.language) : 'No deadline'}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              {t('detail.clientInfo')}
            </Typography>
            {client ? (
              <Box
                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                onClick={() => navigate(`/app/clients/${client.id}`)}
              >
                <Typography fontWeight={500}>{client.name}</Typography>
                <Typography variant="body2" color="text.secondary">{client.email}</Typography>
                <Typography variant="body2" color="text.secondary">{client.phone}</Typography>
              </Box>
            ) : (
              <Typography color="text.secondary">No client</Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Assigned To
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {assignedUsers.map((u) => (
                <Chip key={u!.id} avatar={<Avatar>{u!.name[0]}</Avatar>} label={u!.name} size="small" />
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary">
              {t('detail.created')}: {formatDate(caseData.createdAt, i18n.language)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('detail.updated')}: {formatRelative(caseData.updatedAt, i18n.language)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Time: {formatDuration(totalTime)}
            </Typography>
          </Paper>
        </Grid>

        {/* Tabs Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label={t('tabs.summary')} />
              <Tab label={t('tabs.activity')} />
              <Tab label={`${t('tabs.tasks')} (${caseTasks.length})`} />
              <Tab label={t('tabs.notes')} />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* Summary */}
              <TabPanel value={activeTab} index={0}>
                <Typography variant="h6" gutterBottom>Description</Typography>
                <Typography color={caseData.description ? 'text.primary' : 'text.secondary'}>
                  {caseData.description || t('detail.noDescription')}
                </Typography>
              </TabPanel>

              {/* Activity */}
              <TabPanel value={activeTab} index={1}>
                {caseActivities.length === 0 ? (
                  <EmptyState message={t('activity.noActivity')} />
                ) : (
                  <List>
                    {caseActivities.map((activity) => {
                      const activityUser = users.find(u => u.id === activity.userId);
                      return (
                        <ListItem key={activity.id} alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar>{activityUser?.name[0] || '?'}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={activity.details}
                            secondary={
                              <>
                                {activityUser?.name || 'Unknown'} • {formatRelative(activity.timestamp, i18n.language)}
                              </>
                            }
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </TabPanel>

              {/* Tasks */}
              <TabPanel value={activeTab} index={2}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Add a task..."
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                    sx={{ flex: 1 }}
                  />
                  <Button variant="contained" onClick={handleAddTask} startIcon={<AddIcon />}>
                    Add
                  </Button>
                </Box>
                {caseTasks.length === 0 ? (
                  <EmptyState message={t('tasks.noTasks')} />
                ) : (
                  <List>
                    {caseTasks.map((task) => (
                      <ListItem
                        key={task.id}
                        secondaryAction={
                          task.status !== 'completed' && (
                            <IconButton onClick={() => completeTask(task.id)}>
                              <CheckIcon />
                            </IconButton>
                          )
                        }
                      >
                        <ListItemText
                          primary={task.title}
                          secondary={task.deadline ? formatDate(task.deadline, i18n.language) : 'No deadline'}
                          sx={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}
                        />
                        <StatusChip status={task.status} type="task" />
                      </ListItem>
                    ))}
                  </List>
                )}
              </TabPanel>

              {/* Notes */}
              <TabPanel value={activeTab} index={3}>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder={t('notes.placeholder')}
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    sx={{ mt: 1 }}
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                  >
                    {t('notes.addNote')}
                  </Button>
                </Box>
                {caseNotes.length === 0 ? (
                  <EmptyState message={t('notes.noNotes')} />
                ) : (
                  <List>
                    {caseNotes.map((note) => {
                      const noteUser = users.find(u => u.id === note.userId);
                      return (
                        <ListItem key={note.id} alignItems="flex-start" sx={{ bgcolor: 'grey.50', mb: 1, borderRadius: 1 }}>
                          <ListItemAvatar>
                            <Avatar>{noteUser?.name[0] || '?'}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={note.content}
                            secondary={`${noteUser?.name || 'Unknown'} • ${formatRelative(note.createdAt, i18n.language)}`}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                )}
              </TabPanel>
            </Box>
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

export default CaseDetail;
