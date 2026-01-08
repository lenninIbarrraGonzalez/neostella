import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../hooks/useAuth';

export function Register() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const { register } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('common:validation.passwordMatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('common:validation.passwordLength'));
      return;
    }

    setLoading(true);

    try {
      const success = await register({ name, email, password });
      if (success) {
        enqueueSnackbar(t('register.success'), { variant: 'success' });
        navigate('/app/dashboard', { replace: true });
      } else {
        setError(t('register.error'));
      }
    } catch (err) {
      setError(t('register.error'));
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
            {t('register.title')}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {t('register.subtitle')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('register.name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={t('register.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={t('register.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              helperText={t('common:validation.passwordLength')}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={t('register.confirmPassword')}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
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
              {loading ? 'Creating account...' : t('register.submit')}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('register.hasAccount')}{' '}
                <Link component={RouterLink} to="/login">
                  {t('register.signIn')}
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
