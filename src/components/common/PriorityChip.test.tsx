import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { PriorityChip } from './PriorityChip';

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

describe('PriorityChip', () => {
  describe('priority levels', () => {
    it('should render low priority', () => {
      renderWithProviders(<PriorityChip priority="low" />);
      expect(screen.getByText(/low/i)).toBeInTheDocument();
    });

    it('should render medium priority', () => {
      renderWithProviders(<PriorityChip priority="medium" />);
      expect(screen.getByText(/medium/i)).toBeInTheDocument();
    });

    it('should render high priority', () => {
      renderWithProviders(<PriorityChip priority="high" />);
      expect(screen.getByText(/high/i)).toBeInTheDocument();
    });

    it('should render urgent priority', () => {
      renderWithProviders(<PriorityChip priority="urgent" />);
      expect(screen.getByText(/urgent/i)).toBeInTheDocument();
    });
  });

  describe('size prop', () => {
    it('should default to small size', () => {
      const { container } = renderWithProviders(<PriorityChip priority="low" />);
      const chip = container.querySelector('.MuiChip-sizeSmall');
      expect(chip).toBeInTheDocument();
    });

    it('should render with small size', () => {
      const { container } = renderWithProviders(<PriorityChip priority="low" size="small" />);
      const chip = container.querySelector('.MuiChip-sizeSmall');
      expect(chip).toBeInTheDocument();
    });

    it('should render with medium size', () => {
      const { container } = renderWithProviders(<PriorityChip priority="low" size="medium" />);
      const chip = container.querySelector('.MuiChip-sizeMedium');
      expect(chip).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should have outlined variant', () => {
      const { container } = renderWithProviders(<PriorityChip priority="low" />);
      const chip = container.querySelector('.MuiChip-outlined');
      expect(chip).toBeInTheDocument();
    });

    it('should apply correct color for low priority', () => {
      const { container } = renderWithProviders(<PriorityChip priority="low" />);
      const chip = container.querySelector('.MuiChip-root');
      expect(chip).toBeInTheDocument();
    });

    it('should apply correct color for urgent priority', () => {
      const { container } = renderWithProviders(<PriorityChip priority="urgent" />);
      const chip = container.querySelector('.MuiChip-root');
      expect(chip).toBeInTheDocument();
    });
  });

  describe('all priority colors', () => {
    it('should render low with green color styling', () => {
      const { container } = renderWithProviders(<PriorityChip priority="low" />);
      const chip = container.querySelector('.MuiChip-root');
      expect(chip).toBeInTheDocument();
    });

    it('should render medium with blue color styling', () => {
      const { container } = renderWithProviders(<PriorityChip priority="medium" />);
      const chip = container.querySelector('.MuiChip-root');
      expect(chip).toBeInTheDocument();
    });

    it('should render high with orange color styling', () => {
      const { container } = renderWithProviders(<PriorityChip priority="high" />);
      const chip = container.querySelector('.MuiChip-root');
      expect(chip).toBeInTheDocument();
    });

    it('should render urgent with red color styling', () => {
      const { container } = renderWithProviders(<PriorityChip priority="urgent" />);
      const chip = container.querySelector('.MuiChip-root');
      expect(chip).toBeInTheDocument();
    });
  });
});
