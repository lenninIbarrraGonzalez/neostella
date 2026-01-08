import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { EmptyState } from './EmptyState';

const theme = createTheme();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      {ui}
    </ThemeProvider>
  );
};

describe('EmptyState', () => {
  describe('message prop', () => {
    it('should render message', () => {
      renderWithProviders(<EmptyState message="No items found" />);

      expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    it('should render different message', () => {
      renderWithProviders(<EmptyState message="No results to display" />);

      expect(screen.getByText('No results to display')).toBeInTheDocument();
    });
  });

  describe('title prop', () => {
    it('should render title when provided', () => {
      renderWithProviders(<EmptyState title="Empty List" message="No items found" />);

      expect(screen.getByText('Empty List')).toBeInTheDocument();
      expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    it('should not render title when not provided', () => {
      renderWithProviders(<EmptyState message="No items found" />);

      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    });
  });

  describe('icon prop', () => {
    it('should render default inbox icon when no icon provided', () => {
      const { container } = renderWithProviders(<EmptyState message="No items" />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render custom icon when provided', () => {
      renderWithProviders(
        <EmptyState
          message="No results"
          icon={<SearchIcon data-testid="custom-icon" />}
        />
      );

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('action button', () => {
    it('should render action button when both actionLabel and onAction are provided', () => {
      const onAction = vi.fn();
      renderWithProviders(
        <EmptyState
          message="No items"
          actionLabel="Add Item"
          onAction={onAction}
        />
      );

      expect(screen.getByRole('button', { name: 'Add Item' })).toBeInTheDocument();
    });

    it('should call onAction when button is clicked', () => {
      const onAction = vi.fn();
      renderWithProviders(
        <EmptyState
          message="No items"
          actionLabel="Add Item"
          onAction={onAction}
        />
      );

      const button = screen.getByRole('button', { name: 'Add Item' });
      fireEvent.click(button);

      expect(onAction).toHaveBeenCalledTimes(1);
    });

    it('should not render button without actionLabel', () => {
      const onAction = vi.fn();
      renderWithProviders(
        <EmptyState
          message="No items"
          onAction={onAction}
        />
      );

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should not render button without onAction', () => {
      renderWithProviders(
        <EmptyState
          message="No items"
          actionLabel="Add Item"
        />
      );

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should render button with contained variant', () => {
      const onAction = vi.fn();
      const { container } = renderWithProviders(
        <EmptyState
          message="No items"
          actionLabel="Add Item"
          onAction={onAction}
        />
      );

      const button = container.querySelector('.MuiButton-contained');
      expect(button).toBeInTheDocument();
    });
  });

  describe('layout', () => {
    it('should render message in a Box', () => {
      const { container } = renderWithProviders(<EmptyState message="No items" />);

      const box = container.querySelector('.MuiBox-root');
      expect(box).toBeInTheDocument();
    });

    it('should render title with h6 variant', () => {
      renderWithProviders(<EmptyState title="Title" message="No items" />);

      const title = screen.getByRole('heading', { level: 6 });
      expect(title).toHaveTextContent('Title');
    });
  });

  describe('complete scenarios', () => {
    it('should render all elements together', () => {
      const onAction = vi.fn();
      renderWithProviders(
        <EmptyState
          title="No Results"
          message="Try adjusting your search"
          icon={<SearchIcon data-testid="search-icon" />}
          actionLabel="Clear Filters"
          onAction={onAction}
        />
      );

      expect(screen.getByText('No Results')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search')).toBeInTheDocument();
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Clear Filters' })).toBeInTheDocument();
    });

    it('should render minimal configuration', () => {
      renderWithProviders(<EmptyState message="Empty" />);

      expect(screen.getByText('Empty')).toBeInTheDocument();
      expect(screen.queryByRole('heading')).not.toBeInTheDocument();
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
});
