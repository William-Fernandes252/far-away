import { beforeEach, afterEach, it, expect } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import Logo from '.';

beforeEach(() => {
  render(<Logo />);
});

afterEach(() => {
  cleanup();
});

it('renders correctly', () => {
  expect(screen.getByText(/.*Far Away.*/g)).toBeDefined();
});
