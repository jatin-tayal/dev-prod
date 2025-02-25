import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '../../src/pages/NotFound';

describe('NotFound Component', () => {
  test('renders 404 page with correct message and home link', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );
    
    // Check for 404 text
    expect(screen.getByText('404')).toBeInTheDocument();
    
    // Check for error message
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    
    // Check for home link
    const homeLink = screen.getByRole('link', { name: /Go back home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});