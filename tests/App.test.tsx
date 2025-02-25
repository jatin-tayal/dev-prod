import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../src/App';

// Mock child components to simplify testing
jest.mock('../src/components/Layout', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="mock-layout">{children}</div>
    ),
  };
});

jest.mock('../src/pages/Home', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="mock-home">Home Page</div>,
  };
});

test('renders the application with layout', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  const layoutElement = screen.getByTestId('mock-layout');
  expect(layoutElement).toBeInTheDocument();
  
  const homeElement = screen.getByTestId('mock-home');
  expect(homeElement).toBeInTheDocument();
});
