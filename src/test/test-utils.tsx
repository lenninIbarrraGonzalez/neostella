import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import { SnackbarProvider } from 'notistack';
import i18n from '../i18n';
import { AuthProvider } from '../contexts/AuthContext';
import { AppProvider } from '../contexts/AppContext';

const theme = createTheme();

interface WrapperProps {
  children: ReactNode;
}

// Full wrapper with all providers
function AllProviders({ children }: WrapperProps) {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <SnackbarProvider>
            <AuthProvider>
              <AppProvider>
                {children}
              </AppProvider>
            </AuthProvider>
          </SnackbarProvider>
        </I18nextProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

// Basic providers without Auth/App context
function BasicProviders({ children }: WrapperProps) {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <I18nextProvider i18n={i18n}>
          <SnackbarProvider>
            {children}
          </SnackbarProvider>
        </I18nextProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

// Memory router wrapper for testing navigation
interface MemoryRouterWrapperProps extends WrapperProps {
  initialEntries?: string[];
}

export function createMemoryRouterWrapper(initialEntries: string[] = ['/']) {
  return function MemoryRouterWrapper({ children }: WrapperProps) {
    return (
      <MemoryRouter initialEntries={initialEntries}>
        <ThemeProvider theme={theme}>
          <I18nextProvider i18n={i18n}>
            <SnackbarProvider>
              {children}
            </SnackbarProvider>
          </I18nextProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
  };
}

// Custom render with all providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// Render with basic providers
const renderWithBasicProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: BasicProviders, ...options });

// Re-export everything from @testing-library/react
export * from '@testing-library/react';
export { customRender as render, renderWithBasicProviders };
