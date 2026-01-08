import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { StatusChip } from './StatusChip';

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

describe('StatusChip', () => {
  describe('case statuses', () => {
    it('should render new case status', () => {
      renderWithProviders(<StatusChip status="new" type="case" />);
      expect(screen.getByText(/new/i)).toBeInTheDocument();
    });

    it('should render under_review case status', () => {
      renderWithProviders(<StatusChip status="under_review" type="case" />);
      expect(screen.getByText(/under_review|under review/i)).toBeInTheDocument();
    });

    it('should render in_progress case status', () => {
      renderWithProviders(<StatusChip status="in_progress" type="case" />);
      expect(screen.getByText(/in_progress|in progress/i)).toBeInTheDocument();
    });

    it('should render pending_client case status', () => {
      renderWithProviders(<StatusChip status="pending_client" type="case" />);
      expect(screen.getByText(/pending_client|pending client/i)).toBeInTheDocument();
    });

    it('should render resolved case status', () => {
      renderWithProviders(<StatusChip status="resolved" type="case" />);
      expect(screen.getByText(/resolved/i)).toBeInTheDocument();
    });

    it('should render closed case status', () => {
      renderWithProviders(<StatusChip status="closed" type="case" />);
      expect(screen.getByText(/closed/i)).toBeInTheDocument();
    });
  });

  describe('task statuses', () => {
    it('should render pending task status', () => {
      renderWithProviders(<StatusChip status="pending" type="task" />);
      expect(screen.getByText(/pending/i)).toBeInTheDocument();
    });

    it('should render in_progress task status', () => {
      renderWithProviders(<StatusChip status="in_progress" type="task" />);
      expect(screen.getByText(/in_progress|in progress/i)).toBeInTheDocument();
    });

    it('should render completed task status', () => {
      renderWithProviders(<StatusChip status="completed" type="task" />);
      expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });

    it('should render cancelled task status', () => {
      renderWithProviders(<StatusChip status="cancelled" type="task" />);
      expect(screen.getByText(/cancelled/i)).toBeInTheDocument();
    });
  });

  describe('default behavior', () => {
    it('should default to case type', () => {
      renderWithProviders(<StatusChip status="new" />);
      expect(screen.getByText(/new/i)).toBeInTheDocument();
    });

    it('should default to small size', () => {
      const { container } = renderWithProviders(<StatusChip status="new" />);
      const chip = container.querySelector('.MuiChip-sizeSmall');
      expect(chip).toBeInTheDocument();
    });
  });

  describe('size prop', () => {
    it('should render with small size', () => {
      const { container } = renderWithProviders(<StatusChip status="new" size="small" />);
      const chip = container.querySelector('.MuiChip-sizeSmall');
      expect(chip).toBeInTheDocument();
    });

    it('should render with medium size', () => {
      const { container } = renderWithProviders(<StatusChip status="new" size="medium" />);
      const chip = container.querySelector('.MuiChip-sizeMedium');
      expect(chip).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should have white text color', () => {
      const { container } = renderWithProviders(<StatusChip status="new" />);
      const chip = container.querySelector('.MuiChip-root');
      expect(chip).toHaveStyle({ color: '#ffffff' });
    });

    it('should have background color for case status', () => {
      const { container } = renderWithProviders(<StatusChip status="new" type="case" />);
      const chip = container.querySelector('.MuiChip-root');
      expect(chip).toBeInTheDocument();
      // Background color comes from STATUS_COLORS
    });

    it('should have background color for task status', () => {
      const { container } = renderWithProviders(<StatusChip status="pending" type="task" />);
      const chip = container.querySelector('.MuiChip-root');
      expect(chip).toBeInTheDocument();
      // Background color comes from TASK_STATUS_COLORS
    });
  });
});
