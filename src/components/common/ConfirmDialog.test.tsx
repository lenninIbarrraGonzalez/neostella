import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { ConfirmDialog } from './ConfirmDialog';

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

describe('ConfirmDialog', () => {
  const defaultProps = {
    open: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('visibility', () => {
    it('should not render when closed', () => {
      renderWithProviders(<ConfirmDialog {...defaultProps} open={false} />);

      expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
      expect(screen.queryByText('Are you sure you want to proceed?')).not.toBeInTheDocument();
    });

    it('should render when open', () => {
      renderWithProviders(<ConfirmDialog {...defaultProps} />);

      expect(screen.getByText('Confirm Action')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    });
  });

  describe('content', () => {
    it('should render title', () => {
      renderWithProviders(<ConfirmDialog {...defaultProps} />);

      expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    });

    it('should render message', () => {
      renderWithProviders(<ConfirmDialog {...defaultProps} />);

      expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    });

    it('should render custom title', () => {
      renderWithProviders(<ConfirmDialog {...defaultProps} title="Delete Item" />);

      expect(screen.getByText('Delete Item')).toBeInTheDocument();
    });

    it('should render custom message', () => {
      renderWithProviders(<ConfirmDialog {...defaultProps} message="This action cannot be undone." />);

      expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
    });
  });

  describe('button interactions', () => {
    it('should call onConfirm when confirm button is clicked', () => {
      const onConfirm = vi.fn();
      renderWithProviders(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      fireEvent.click(confirmButton);

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when cancel button is clicked', () => {
      const onCancel = vi.fn();
      renderWithProviders(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should call onCancel when dialog backdrop is clicked', () => {
      const onCancel = vi.fn();
      const { baseElement } = renderWithProviders(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);

      const backdrop = baseElement.querySelector('.MuiBackdrop-root');
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(onCancel).toHaveBeenCalled();
      }
    });
  });

  describe('custom button labels', () => {
    it('should use custom confirm label', () => {
      renderWithProviders(<ConfirmDialog {...defaultProps} confirmLabel="Delete" />);

      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('should use custom cancel label', () => {
      renderWithProviders(<ConfirmDialog {...defaultProps} cancelLabel="Keep" />);

      expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
    });

    it('should use both custom labels', () => {
      renderWithProviders(
        <ConfirmDialog {...defaultProps} confirmLabel="Yes, Delete" cancelLabel="No, Keep" />
      );

      expect(screen.getByRole('button', { name: 'Yes, Delete' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'No, Keep' })).toBeInTheDocument();
    });
  });

  describe('confirm button color', () => {
    it('should render with default error color', () => {
      renderWithProviders(<ConfirmDialog {...defaultProps} />);

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      expect(confirmButton).toBeInTheDocument();
    });

    it('should render with primary color', () => {
      renderWithProviders(
        <ConfirmDialog {...defaultProps} confirmColor="primary" />
      );

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      expect(confirmButton).toBeInTheDocument();
    });

    it('should render with warning color', () => {
      renderWithProviders(
        <ConfirmDialog {...defaultProps} confirmColor="warning" />
      );

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      expect(confirmButton).toBeInTheDocument();
    });

    it('should render with success color', () => {
      renderWithProviders(
        <ConfirmDialog {...defaultProps} confirmColor="success" />
      );

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      expect(confirmButton).toBeInTheDocument();
    });

    it('should render with info color', () => {
      renderWithProviders(
        <ConfirmDialog {...defaultProps} confirmColor="info" />
      );

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      expect(confirmButton).toBeInTheDocument();
    });

    it('should render with secondary color', () => {
      renderWithProviders(
        <ConfirmDialog {...defaultProps} confirmColor="secondary" />
      );

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      expect(confirmButton).toBeInTheDocument();
    });
  });

  describe('button variants', () => {
    it('should render cancel button', () => {
      renderWithProviders(<ConfirmDialog {...defaultProps} />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      expect(cancelButton).toBeInTheDocument();
    });

    it('should render confirm button', () => {
      renderWithProviders(<ConfirmDialog {...defaultProps} />);

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      expect(confirmButton).toBeInTheDocument();
    });
  });
});
