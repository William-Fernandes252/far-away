import { beforeEach, afterEach, it, expect, describe, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import {
  renderWithMockedPackingItemsContext,
  type PackingItemsProviderFixture,
} from '@/contexts/packingItems.test';
import { clearScreenAndMocks } from '@/__tests__/utils';
import NewPackingItemForm from '.';

afterEach(clearScreenAndMocks);

it('renders correctly', () => {
  renderWithMockedPackingItemsContext(<NewPackingItemForm />);
  expect(screen.getByText(/.*What do you need for you trip?.*/g)).toBeDefined();
  expect(screen.getByPlaceholderText('Item...')).toBeDefined();
  expect(screen.getByRole('button')).toBeDefined();
});

it('updates state on input change', () => {
  renderWithMockedPackingItemsContext(<NewPackingItemForm />);
  fireEvent.input(screen.getByPlaceholderText('Item...'), {
    target: { value: 'test' },
  });
  expect(screen.getByDisplayValue('test')).toBeDefined();
});

it('updates state on select change', () => {
  renderWithMockedPackingItemsContext(<NewPackingItemForm />);
  fireEvent.change(screen.getByDisplayValue('1'), {
    target: { value: '2' },
  });
  expect(screen.getByDisplayValue('2')).toBeDefined();
});

describe('Submit with valid input', () => {
  const date = new Date(2023, 10, 21, 2, 25);

  beforeEach<Omit<PackingItemsProviderFixture, 'currentItems'>>(context => {
    [, , context.dispatchMock] = renderWithMockedPackingItemsContext(
      <NewPackingItemForm />,
    );
    fireEvent.input(screen.getByPlaceholderText('Item...'), {
      target: { value: 'test' },
    });
    fireEvent.change(screen.getByDisplayValue('1'), {
      target: { value: '2' },
    });
    vi.useFakeTimers();
  });

  afterEach(clearScreenAndMocks);

  it<
    Omit<PackingItemsProviderFixture, 'currentItems'>
  >('adds new item on submit', ({ dispatchMock }) => {
    vi.setSystemTime(date);
    fireEvent.click(screen.getByRole('button'));
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'add',
      item: {
        description: 'test',
        id: date.getTime(),
        quantity: 2,
        packed: false,
      },
    });
  });

  it<
    Omit<PackingItemsProviderFixture, 'currentItems'>
  >('does not show validation errors', () => {
    fireEvent.click(screen.getByRole('button'));
    [
      'Description cannot be empty',
      'Quantity must be a number',
      'Quantity cannot be empty',
    ].forEach(errorMessage => {
      expect(screen.queryByText(errorMessage)).toBeNull();
    });
  });
});

describe('Submit with invalid input', () => {
  beforeEach<Omit<PackingItemsProviderFixture, 'currentItems'>>(context => {
    [, , context.dispatchMock] = renderWithMockedPackingItemsContext(
      <NewPackingItemForm />,
    );
  });

  afterEach(clearScreenAndMocks);

  it('shows correct error messages', () => {
    const errorMessageToUserInputEmmiterMap = new Map<string, () => void>([
      [
        'Description cannot be empty',
        () =>
          fireEvent.input(screen.getByPlaceholderText('Item...'), {
            target: { value: '' },
          }),
      ],
      [
        'Quantity cannot be empty',
        () => {
          fireEvent.input(screen.getByPlaceholderText('Item...'), {
            target: { value: 'test' },
          });
          fireEvent.change(screen.getByDisplayValue('1'), {
            target: { value: '' },
          });
        },
      ],
    ]);
    errorMessageToUserInputEmmiterMap.forEach((emmiter, errorMessage) => {
      emmiter();
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText(errorMessage)).toBeDefined();
      emmiter();
    });
  });
});
