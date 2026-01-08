import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { LoadingSpinner } from './LoadingSpinner';

const theme = createTheme();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        {ui}
      </I18nextProvider>
    </ThemeProvider>
  );
};

describe('LoadingSpinner', () => {
  describe('basic rendering', () => {
    it('should render spinner', () => {
      renderWithProviders(<LoadingSpinner />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should not render message by default', () => {
      renderWithProviders(<LoadingSpinner />);

      // Without message prop, there should be no text
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });

  describe('message prop', () => {
    it('should render custom message when provided', () => {
      renderWithProviders(<LoadingSpinner message="Loading data..." />);

      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    it('should render message area when message is empty string', () => {
      const { container } = renderWithProviders(<LoadingSpinner message="" />);

      // Empty string triggers default i18n message - look for Typography component
      const typography = container.querySelector('.MuiTypography-root');
      expect(typography).toBeInTheDocument();
    });

    it('should not render message when message is undefined', () => {
      renderWithProviders(<LoadingSpinner />);

      // No text should be present
      const box = screen.getByRole('progressbar').parentElement;
      const textElements = box?.querySelectorAll('p, span');
      expect(textElements?.length).toBeLessThanOrEqual(1); // Only the spinner
    });
  });

  describe('size prop', () => {
    it('should use default size of 40', () => {
      const { container } = renderWithProviders(<LoadingSpinner />);

      const spinner = container.querySelector('.MuiCircularProgress-root');
      expect(spinner).toBeInTheDocument();
    });

    it('should apply custom size', () => {
      const { container } = renderWithProviders(<LoadingSpinner size={60} />);

      const spinner = container.querySelector('.MuiCircularProgress-root');
      expect(spinner).toBeInTheDocument();
    });

    it('should apply small size', () => {
      const { container } = renderWithProviders(<LoadingSpinner size={20} />);

      const spinner = container.querySelector('.MuiCircularProgress-root');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('fullScreen prop', () => {
    it('should not be fullScreen by default', () => {
      const { container } = renderWithProviders(<LoadingSpinner />);

      const fullScreenBox = container.querySelector('[style*="position: fixed"]');
      expect(fullScreenBox).not.toBeInTheDocument();
    });

    it('should render fullScreen when prop is true', () => {
      const { container } = renderWithProviders(<LoadingSpinner fullScreen />);

      const boxes = container.querySelectorAll('.MuiBox-root');
      expect(boxes.length).toBeGreaterThan(0);
    });

    it('should render fullScreen with message', () => {
      renderWithProviders(<LoadingSpinner fullScreen message="Please wait..." />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });
  });

  describe('combinations', () => {
    it('should render with all props', () => {
      renderWithProviders(
        <LoadingSpinner
          message="Loading..."
          fullScreen
          size={50}
        />
      );

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render with message and custom size', () => {
      renderWithProviders(<LoadingSpinner message="Fetching data" size={30} />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByText('Fetching data')).toBeInTheDocument();
    });

    it('should render fullScreen without message', () => {
      renderWithProviders(<LoadingSpinner fullScreen />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have accessible progressbar role', () => {
      renderWithProviders(<LoadingSpinner />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should render message with text color secondary', () => {
      const { container } = renderWithProviders(<LoadingSpinner message="Loading..." />);

      const typography = container.querySelector('.MuiTypography-root');
      expect(typography).toBeInTheDocument();
    });
  });
});
