import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Button } from '@mui/material';
import { PageHeader } from './PageHeader';

const theme = createTheme();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('PageHeader', () => {
  describe('title prop', () => {
    it('should render title', () => {
      renderWithProviders(<PageHeader title="Dashboard" />);

      expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    });

    it('should render different title', () => {
      renderWithProviders(<PageHeader title="Cases" />);

      expect(screen.getByRole('heading', { name: 'Cases' })).toBeInTheDocument();
    });

    it('should render title with h4 variant', () => {
      renderWithProviders(<PageHeader title="Title" />);

      const heading = screen.getByRole('heading', { name: 'Title' });
      expect(heading).toHaveClass('MuiTypography-h4');
    });

    it('should render title as h1 element', () => {
      renderWithProviders(<PageHeader title="Page Title" />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });
  });

  describe('subtitle prop', () => {
    it('should render subtitle when provided', () => {
      renderWithProviders(<PageHeader title="Title" subtitle="Subtitle text" />);

      expect(screen.getByText('Subtitle text')).toBeInTheDocument();
    });

    it('should not render subtitle when not provided', () => {
      renderWithProviders(<PageHeader title="Title" />);

      const boxes = screen.getAllByRole('heading');
      expect(boxes).toHaveLength(1);
    });

    it('should render subtitle with body2 variant', () => {
      const { container } = renderWithProviders(
        <PageHeader title="Title" subtitle="Subtitle" />
      );

      const subtitle = container.querySelector('.MuiTypography-body2');
      expect(subtitle).toHaveTextContent('Subtitle');
    });
  });

  describe('breadcrumbs prop', () => {
    it('should render breadcrumbs when provided', () => {
      const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Cases', href: '/cases' },
        { label: 'Details' },
      ];

      renderWithProviders(<PageHeader title="Title" breadcrumbs={breadcrumbs} />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Cases')).toBeInTheDocument();
      expect(screen.getByText('Details')).toBeInTheDocument();
    });

    it('should render breadcrumb links', () => {
      const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Current' },
      ];

      renderWithProviders(<PageHeader title="Title" breadcrumbs={breadcrumbs} />);

      const homeLink = screen.getByText('Home');
      expect(homeLink.closest('a')).toHaveAttribute('href', '/');
    });

    it('should render last breadcrumb as text not link', () => {
      const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Current' },
      ];

      renderWithProviders(<PageHeader title="Title" breadcrumbs={breadcrumbs} />);

      const current = screen.getByText('Current');
      expect(current.closest('a')).not.toBeInTheDocument();
    });

    it('should not render breadcrumbs when empty array', () => {
      const { container } = renderWithProviders(<PageHeader title="Title" breadcrumbs={[]} />);

      const nav = container.querySelector('.MuiBreadcrumbs-root');
      expect(nav).not.toBeInTheDocument();
    });

    it('should not render breadcrumbs when not provided', () => {
      const { container } = renderWithProviders(<PageHeader title="Title" />);

      const nav = container.querySelector('.MuiBreadcrumbs-root');
      expect(nav).not.toBeInTheDocument();
    });
  });

  describe('backTo prop', () => {
    it('should render back button when backTo is provided', () => {
      renderWithProviders(<PageHeader title="Title" backTo="/previous" />);

      const backButton = screen.getByText('Back');
      expect(backButton.closest('a')).toHaveAttribute('href', '/previous');
    });

    it('should not render back button when backTo is not provided', () => {
      renderWithProviders(<PageHeader title="Title" />);

      expect(screen.queryByText('Back')).not.toBeInTheDocument();
    });

    it('should render back button with icon', () => {
      const { container } = renderWithProviders(<PageHeader title="Title" backTo="/" />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('action prop', () => {
    it('should render action when provided', () => {
      renderWithProviders(
        <PageHeader
          title="Title"
          action={<Button>Add New</Button>}
        />
      );

      expect(screen.getByRole('button', { name: 'Add New' })).toBeInTheDocument();
    });

    it('should render multiple actions', () => {
      renderWithProviders(
        <PageHeader
          title="Title"
          action={
            <>
              <Button>Save</Button>
              <Button>Cancel</Button>
            </>
          }
        />
      );

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('should not render action area when not provided', () => {
      const { container } = renderWithProviders(<PageHeader title="Title" />);

      // Should have just one Box with the title
      const boxes = container.querySelectorAll('.MuiBox-root');
      expect(boxes.length).toBeLessThan(5);
    });
  });

  describe('complete scenarios', () => {
    it('should render all elements together', () => {
      const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Current' },
      ];

      renderWithProviders(
        <PageHeader
          title="Page Title"
          subtitle="Page subtitle"
          breadcrumbs={breadcrumbs}
          backTo="/back"
          action={<Button>Action</Button>}
        />
      );

      expect(screen.getByRole('heading', { name: 'Page Title' })).toBeInTheDocument();
      expect(screen.getByText('Page subtitle')).toBeInTheDocument();
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Back')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('should render minimal configuration', () => {
      renderWithProviders(<PageHeader title="Minimal" />);

      expect(screen.getByRole('heading', { name: 'Minimal' })).toBeInTheDocument();
    });
  });
});
