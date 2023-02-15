import { render, screen } from '@testing-library/react';
import App from './App';

test('renders top nav header', () => {
  render(<App />);
  const linkElement = screen.getByText(/Strong-Die/i);
  expect(linkElement).toBeInTheDocument();
});
