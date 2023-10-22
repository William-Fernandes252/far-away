import { afterEach, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithPackingItemsContext } from '@/contexts/packingItems.test';
import { clearScreenAndMocks } from '@/__tests__/utils';
import Stats from '.';

afterEach(clearScreenAndMocks);

it('renders message when there are no items', () => {
  renderWithPackingItemsContext(<Stats />, [], vi.fn());
  expect(
    screen.getByText('Start adding some items to your packing list 🚀'),
  ).toBeDefined();
});

it('renders message when all items are packed', () => {
  renderWithPackingItemsContext(
    <Stats />,
    [{ packed: true, id: 1, description: 'test', quantity: 1 }],
    vi.fn(),
  );
  expect(screen.getByText('You got everthing! Ready to go ✈️')).toBeDefined();
});

it('renders message with packing progress when all items are not packed', () => {
  renderWithPackingItemsContext(
    <Stats />,
    [
      { packed: false, id: 1, description: 'test', quantity: 1 },
      {
        packed: true,
        id: 2,
        description: 'test',
        quantity: 1,
      },
    ],
    vi.fn(),
  );
  expect(
    screen.getByText(
      '👜 You have 2 items on your list, and you already packed 1 (50%)',
    ),
  ).toBeDefined();
});
