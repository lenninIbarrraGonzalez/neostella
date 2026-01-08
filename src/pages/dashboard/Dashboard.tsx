import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Paper,
} from '@mui/material';
import {
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Assignment as TaskIcon,
  Timer as TimerIcon,
  Add as AddIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import { useCases } from '../../hooks/useCases';
import { useTasks } from '../../hooks/useTasks';
import { useTimeTracking } from '../../hooks/useTimeTracking';
import { useApp } from '../../contexts/AppContext';
import { useClients } from '../../hooks/useClients';
import { formatDuration } from '../../utils/formatters';
import { formatDate, formatRelative, isOverdue, isDueSoon } from '../../utils/dateFormatters';
import { STATUS_COLORS } from '../../constants/caseStatuses';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';

const CHART_COLORS = ['#2196f3', '#ff9800', '#9c27b0', '#795548', '#4caf50', '#9e9e9e'];

export function Dashboard() {
  const { t, i18n } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { user, canViewAllCases, canCreateCase, canCreateClient } = useAuth();
  const { cases, openCases, casesByStatus } = useCases();
  const { pendingTasks, overdueTasks } = useTasks();
  const { todayMinutes, thisWeekMinutes } = useTimeTracking();
  const { activities } = useApp();
  const { allClients } = useClients();

  const isAdmin = user?.role === 'admin';

  // Stats cards data
  const statsCards = useMemo(() => {
    if (isAdmin) {
      const closedThisMonth = cases.filter(c => {
        if (c.status !== 'closed') return false;
        const now = new Date();
        const caseDate = new Date(c.updatedAt);
        return caseDate.getMonth() === now.getMonth() && caseDate.getFullYear() === now.getFullYear();
      }).length;

      return [
        { title: t('stats.totalCases'), value: cases.length, icon: <FolderIcon />, color: '#1976d2' },
        { title: t('stats.openCases'), value: openCases.length, icon: <FolderOpenIcon />, color: '#4caf50' },
        { title: t('stats.closedThisMonth'), value: closedThisMonth, icon: <FolderIcon />, color: '#9e9e9e' },
        { title: t('stats.overdueTasks'), value: overdueTasks.length, icon: <WarningIcon />, color: '#f44336' },
      ];
    } else {
      return [
        { title: t('stats.myCases'), value: cases.length, icon: <FolderIcon />, color: '#1976d2' },
        { title: t('stats.pendingTasks'), value: pendingTasks.length, icon: <TaskIcon />, color: '#ff9800' },
        { title: t('stats.hoursToday'), value: formatDuration(todayMinutes), icon: <TimerIcon />, color: '#4caf50' },
        { title: t('stats.hoursThisWeek'), value: formatDuration(thisWeekMinutes), icon: <TimerIcon />, color: '#9c27b0' },
      ];
    }
  }, [isAdmin, cases, openCases, pendingTasks, overdueTasks, todayMinutes, thisWeekMinutes, t]);

  // Pipeline chart data
  const pipelineData = useMemo(() => {
    return Object.entries(casesByStatus).map(([status, casesInStatus]) => ({
      name: t(`common:status.${status}`),
      value: casesInStatus.length,
      fill: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
    }));
  }, [casesByStatus, t]);

  // Upcoming deadlines
  const upcomingDeadlines = useMemo(() => {
    return cases
      .filter(c => c.deadline && c.status !== 'closed')
      .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
      .slice(0, 5);
  }, [cases]);

  // Recent activities
  const recentActivities = useMemo(() => {
    return activities.slice(0, 5);
  }, [activities]);

  return (
    <Box>
      <PageHeader
        title={t('title')}
        subtitle={isAdmin ? t('overview') : t('overviewPersonal')}
        action={
          <Box sx={{ display: 'flex', gap: 1 }}>
            {canCreateCase && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/app/cases/new')}
              >
                {t('quickActions.newCase')}
              </Button>
            )}
          </Box>
        }
      />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: stat.color, width: 48, height: 48 }}>
                    {stat.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Pipeline Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {t('charts.casePipeline')}
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1976d2">
                    {pipelineData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                {t('sections.upcomingDeadlines')}
              </Typography>
              <Button size="small" onClick={() => navigate('/app/calendar')}>
                {t('common:actions.viewAll')}
              </Button>
            </Box>
            {upcomingDeadlines.length === 0 ? (
              <Typography color="text.secondary">{t('noUpcomingDeadlines')}</Typography>
            ) : (
              <List disablePadding>
                {upcomingDeadlines.map((caseItem) => (
                  <ListItem
                    key={caseItem.id}
                    disablePadding
                    sx={{
                      py: 1,
                      borderBottom: 1,
                      borderColor: 'divider',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => navigate(`/app/cases/${caseItem.id}`)}
                  >
                    <ListItemText
                      primary={caseItem.title}
                      secondary={formatDate(caseItem.deadline, i18n.language)}
                      primaryTypographyProps={{ noWrap: true, fontWeight: 500 }}
                      secondaryTypographyProps={{
                        color: isOverdue(caseItem.deadline) ? 'error' : isDueSoon(caseItem.deadline) ? 'warning.main' : 'text.secondary',
                      }}
                    />
                    <StatusChip status={caseItem.status} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* My Tasks */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                {t('sections.myTasks')}
              </Typography>
              <Button size="small" onClick={() => navigate('/app/tasks')}>
                {t('common:actions.viewAll')}
              </Button>
            </Box>
            {pendingTasks.length === 0 ? (
              <Typography color="text.secondary">{t('noPendingTasks')}</Typography>
            ) : (
              <List disablePadding>
                {pendingTasks.slice(0, 5).map((task) => (
                  <ListItem
                    key={task.id}
                    disablePadding
                    sx={{ py: 1, borderBottom: 1, borderColor: 'divider' }}
                  >
                    <ListItemText
                      primary={task.title}
                      secondary={task.deadline ? formatDate(task.deadline, i18n.language) : 'No deadline'}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                    <Chip
                      label={t(`common:priority.${task.priority}`)}
                      size="small"
                      color={task.priority === 'urgent' ? 'error' : task.priority === 'high' ? 'warning' : 'default'}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {t('sections.recentActivity')}
            </Typography>
            {recentActivities.length === 0 ? (
              <Typography color="text.secondary">{t('noRecentActivity')}</Typography>
            ) : (
              <List disablePadding>
                {recentActivities.map((activity) => (
                  <ListItem key={activity.id} disablePadding sx={{ py: 1 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                        <FolderIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.details}
                      secondary={formatRelative(activity.timestamp, i18n.language)}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
