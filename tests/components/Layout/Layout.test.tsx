import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../../../src/components/Layout';

// Mock child components
jest.mock('../../../src/components/Layout/Header', () => {
  return {
    __esModule: true,
    default: ({ title, toggleSidebar }: { title: string; toggleSidebar: () => void }) => (
      <header data-testid="mock-header">
        <h1>{title}</h1>
        <button onClick={toggleSidebar} data-testid="toggle-sidebar-button">
          Toggle
        </button>
      </header>
    ),
  };
});

jest.mock('../../../src/components/Layout/Sidebar', () => {
  return {
    __esModule: true,
    default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
      <div data-testid="mock-sidebar" className={isOpen ? 'open' : 'closed'}>
        <button onClick={onClose} data-testid="close-sidebar-button">
          Close
        </button>
      </div>
    ),
  };
});

jest.mock('../../../src/components/Layout/Main', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <main data-testid="mock-main">{children}</main>
    ),
  };
});

describe('Layout Component', () => {
  test('renders layout with header, sidebar, and main content', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div data-testid="content">Test Content</div>
        </Layout>
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-main')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  test('toggles sidebar when button is clicked', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </BrowserRouter>
    );
    
    // Sidebar should start closed
    expect(screen.getByTestId('mock-sidebar')).toHaveClass('closed');
    
    // Click toggle button
    fireEvent.click(screen.getByTestId('toggle-sidebar-button'));
    
    // Sidebar should be open
    expect(screen.getByTestId('mock-sidebar')).toHaveClass('open');
    
    // Click close button
    fireEvent.click(screen.getByTestId('close-sidebar-button'));
    
    // Sidebar should be closed again
    expect(screen.getByTestId('mock-sidebar')).toHaveClass('closed');
  });
});