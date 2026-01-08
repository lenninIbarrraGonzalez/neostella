import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Grid,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isAfter,
  isBefore,
} from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useCases } from '../../hooks/useCases';
import { useTasks } from '../../hooks/useTasks';
import { formatDate, isOverdue } from '../../utils/dateFormatters';
import PageHeader from '../../components/common/PageHeader';
import StatusChip from '../../components/common/StatusChip';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'case' | 'task';
  status: string;
  linkTo: string;
}

export function Calendar() {
  const { t, i18n } = useTranslation('calendar');
  const navigate = useNavigate();
  const { cases } = useCases();
  const { tasks } = useTasks();

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const events = useMemo((): CalendarEvent[] => {
    const caseEvents = cases
      .filter(c => c.deadline && c.status !== 'closed')
      .map(c => ({
        id: `case-${c.id}`,
        title: c.title,
        date: new Date(c.deadline!),
        type: 'case' as const,
        status: c.status,
        linkTo: `/app/cases/${c.id}`,
      }));

    const taskEvents = tasks
      .filter(t => t.deadline && t.status !== 'completed' && t.status !== 'cancelled')
      .map(t => ({
        id: `task-${t.id}`,
        title: t.title,
        date: new Date(t.deadline!),
        type: 'task' as const,
        status: t.status,
        linkTo: `/app/cases/${t.caseId}`,
      }));

    return [...caseEvents, ...taskEvents].sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [cases, tasks]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter(e => isAfter(e.date, now) || isSameDay(e.date, now))
      .slice(0, 10);
  }, [events]);

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToToday = () => setCurrentMonth(new Date());

  const renderHeader = () => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
      <IconButton onClick={prevMonth}>
        <ChevronLeftIcon />
      </IconButton>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          {format(currentMonth, 'MMMM yyyy')}
        </Typography>
        <Button size="small" onClick={goToToday}>
          {t('navigation.today')}
        </Button>
      </Box>
      <IconButton onClick={nextMonth}>
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );

  const renderDays = () => {
    const days = [];
    const dateFormat = 'EEE';
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });

    for (let i = 0; i < 7; i++) {
      days.push(
        <Box
          key={i}
          sx={{
            textAlign: 'center',
            py: 1,
            fontWeight: 600,
            color: 'text.secondary',
          }}
        >
          {format(addDays(startDate, i), dateFormat)}
        </Box>
      );
    }

    return <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>{days}</Box>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const dayEvents = events.filter(e => isSameDay(e.date, currentDay));
        const isToday = isSameDay(currentDay, new Date());
        const isCurrentMonth = isSameMonth(currentDay, monthStart);

        days.push(
          <Box
            key={currentDay.toString()}
            sx={{
              minHeight: 100,
              p: 0.5,
              border: 1,
              borderColor: 'divider',
              bgcolor: isToday ? 'primary.light' : isCurrentMonth ? 'background.paper' : 'grey.100',
              opacity: isCurrentMonth ? 1 : 0.5,
            }}
          >
            <Typography
              variant="body2"
              fontWeight={isToday ? 700 : 400}
              color={isToday ? 'primary.main' : 'text.primary'}
            >
              {format(currentDay, 'd')}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {dayEvents.slice(0, 3).map((event) => (
                <Chip
                  key={event.id}
                  label={event.title}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.7rem',
                    mb: 0.25,
                    width: '100%',
                    justifyContent: 'flex-start',
                    bgcolor: event.type === 'case'
                      ? (isOverdue(event.date) ? 'error.light' : 'primary.light')
                      : (isOverdue(event.date) ? 'error.light' : 'success.light'),
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(event.linkTo)}
                />
              ))}
              {dayEvents.length > 3 && (
                <Typography variant="caption" color="text.secondary">
                  +{dayEvents.length - 3} more
                </Typography>
              )}
            </Box>
          </Box>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <Box key={day.toString()} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {days}
        </Box>
      );
      days = [];
    }

    return <Box>{rows}</Box>;
  };

  return (
    <Box>
      <PageHeader
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 9 }}>
          <Paper sx={{ p: 2 }}>
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {t('sidebar.upcoming')}
            </Typography>
            {upcomingEvents.length === 0 ? (
              <Typography color="text.secondary">{t('empty.noUpcoming')}</Typography>
            ) : (
              <List disablePadding>
                {upcomingEvents.map((event) => (
                  <ListItem
                    key={event.id}
                    disablePadding
                    sx={{
                      py: 1,
                      borderBottom: 1,
                      borderColor: 'divider',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => navigate(event.linkTo)}
                  >
                    <ListItemText
                      primary={event.title}
                      secondary={formatDate(event.date, i18n.language)}
                      primaryTypographyProps={{ noWrap: true, variant: 'body2', fontWeight: 500 }}
                      secondaryTypographyProps={{
                        color: isOverdue(event.date) ? 'error' : 'text.secondary',
                      }}
                    />
                    <Chip
                      label={event.type === 'case' ? 'Case' : 'Task'}
                      size="small"
                      color={event.type === 'case' ? 'primary' : 'success'}
                      variant="outlined"
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {t('legend.title')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: 'primary.light' }} />
                <Typography variant="body2">{t('legend.case')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: 'success.light' }} />
                <Typography variant="body2">{t('legend.task')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 16, height: 16, borderRadius: 1, bgcolor: 'error.light' }} />
                <Typography variant="body2">{t('legend.overdue')}</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Calendar;
