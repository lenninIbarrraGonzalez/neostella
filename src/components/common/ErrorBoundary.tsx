import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

interface ErrorFallbackProps {
  error: Error | null;
  onReset: () => void;
  onReload: () => void;
}

function ErrorFallback({ error, onReset, onReload }: ErrorFallbackProps) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        p: 3,
      }}
    >
      <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
        <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom fontWeight={600}>
          {t('common:error.title')}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {t('common:error.description')}
        </Typography>
        {error && (
          <Typography
            variant="caption"
            component="pre"
            sx={{
              mb: 3,
              p: 1,
              bgcolor: 'grey.100',
              borderRadius: 1,
              overflow: 'auto',
              maxWidth: '100%',
              textAlign: 'left'
            }}
          >
            {error.message}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="outlined" onClick={onReset}>
            {t('common:error.tryAgain')}
          </Button>
          <Button variant="contained" onClick={onReload}>
            {t('common:error.reloadPage')}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          onReset={this.handleReset}
          onReload={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
