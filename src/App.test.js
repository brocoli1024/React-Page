import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders main navigation links', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText('首頁')).toBeInTheDocument();
  expect(screen.getByText('產品頁面')).toBeInTheDocument();
  expect(screen.getByText('購物車')).toBeInTheDocument();
});
