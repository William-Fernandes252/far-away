import { beforeEach, afterEach, it, expect, describe, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import {
  renderWithMockedPackingItemsContext,
  type PackingItemsProviderFixture,
} from '@/contexts/packingItems.test';
import { clearScreenAndMocks } from '@/__tests__/utils';
import PackingList from '.';

afterEach(clearScreenAndMocks);

it('renders correctly', () => {
  const [, items] = renderWithMockedPackingItemsContext(<PackingList />);
  items.forEach(item => {
    expect(
      screen.getByText(new RegExp(`${item.quantity}.*${item.description}.*`)),
    ).toBeDefined();
  });
  expect(screen.getByDisplayValue('Sort by input order')).toBeDefined();
  expect(screen.getByText('Clear list')).toBeDefined();
});

describe.skip('Packing Items Sorting', () => {
  beforeEach<Omit<PackingItemsProviderFixture, 'dispatchMock'>>(context => {
    [, context.currentItems] = renderWithMockedPackingItemsContext(
      <PackingList />,
    );
  });

  afterEach(clearScreenAndMocks);

  it<
    Omit<PackingItemsProviderFixture, 'dispatchMock'>
  >('Sorts items correctly when user selects sorting option', ({
    currentItems,
  }) => {
    const sortingOptionsToValidatorMap = new Map<
      keyof FarAway.PackingItem,
      (i1: FarAway.PackingItem, i2: FarAway.PackingItem) => number
    >([
      [
        'packed',
        (i1: FarAway.PackingItem, i2: FarAway.PackingItem) =>
          Number(i2.packed >= i1.packed),
      ],
      [
        'id',
        (i1: FarAway.PackingItem, i2: FarAway.PackingItem) =>
          Number(i2.id >= i1.id),
      ],
      [
        'description',
        (i1: FarAway.PackingItem, i2: FarAway.PackingItem) =>
          i2.description.localeCompare(i1.description),
      ],
    ]);
    sortingOptionsToValidatorMap.forEach((validator, sortingOption) => {
      fireEvent.change(screen.getByPlaceholderText('Sort by'), {
        target: { value: sortingOption },
      });
      const packingItemsElements = screen.getAllByRole('listitem');
      const itemsSorted = packingItemsElements.map(
        el =>
          currentItems.filter(item =>
            el.innerHTML.includes(item.description),
          )[0],
      );
      expect(itemsSorted).toEqual([...itemsSorted].sort(validator));
    });
  });
});

describe('Clear list button', () => {
  const windowConfirmMock = vi.fn(() => true);

  beforeEach<Omit<PackingItemsProviderFixture, 'currentItems'>>(context => {
    [, , context.dispatchMock] = renderWithMockedPackingItemsContext(
      <PackingList />,
    );
    vi.stubGlobal('confirm', windowConfirmMock);
  });

  afterEach(clearScreenAndMocks);

  it<
    Omit<PackingItemsProviderFixture, 'dispatchMock'>
  >('Asks user to confirm', () => {
    fireEvent.click(screen.getByText('Clear list'));
    expect(windowConfirmMock).toHaveBeenCalled();
  });

  it<
    Omit<PackingItemsProviderFixture, 'currentItems'>
  >('Dispatches clear action when clear button is clicked and user confirms', ({
    dispatchMock,
  }) => {
    fireEvent.click(screen.getByText('Clear list'));
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'clear',
    });
  });

  it<
    Omit<PackingItemsProviderFixture, 'currentItems'>
  >('Do not dispatches clear action when clear button is clicked and user confirms', ({
    dispatchMock,
  }) => {
    windowConfirmMock.mockReturnValueOnce(false);
    fireEvent.click(screen.getByText('Clear list'));
    expect(dispatchMock).not.toHaveBeenCalled();
  });
});
