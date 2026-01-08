import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../hooks/useAuth';

interface LocationState {
  from?: { pathname: string };
}

export function Login() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as LocationState)?.from?.pathname || '/app/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login({ email, password });
      if (success) {
        enqueueSnackbar(t('login.success'), { variant: 'success' });
        navigate(from, { replace: true });
      } else {
        setError(t('login.error'));
      }
    } catch (err) {
      setError(t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    setLoading(true);

    try {
      const success = await login({ email: demoEmail, password: demoPassword });
      if (success) {
        enqueueSnackbar(t('login.success'), { variant: 'success' });
        navigate(from, { replace: true });
      } else {
        setError(t('login.error'));
      }
    } catch (err) {
      setError(t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'grey.100',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            component={RouterLink}
            to="/"
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              textDecoration: 'none',
            }}
          >
            Neostella
          </Typography>
        </Box>

        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {t('login.title')}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {t('login.subtitle')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('login.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={t('login.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? 'Signing in...' : t('login.submit')}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('login.noAccount')}{' '}
                <Link component={RouterLink} to="/register">
                  {t('login.signUp')}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {t('demoCredentials.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {t('demoCredentials.description')}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleDemoLogin('admin@garcialaw.com', 'admin123')}
                disabled={loading}
              >
                {t('demoCredentials.admin')}: admin@garcialaw.com
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleDemoLogin('carlos@garcialaw.com', 'abogado123')}
                disabled={loading}
              >
                {t('demoCredentials.attorney')}: carlos@garcialaw.com
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleDemoLogin('maria@garcialaw.com', 'paralegal123')}
                disabled={loading}
              >
                {t('demoCredentials.paralegal')}: maria@garcialaw.com
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default Login;
