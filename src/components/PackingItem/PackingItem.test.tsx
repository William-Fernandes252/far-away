import { beforeEach, afterEach, it, expect, describe } from 'vitest';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithMockedPackingItemsContext } from '@/contexts/packingItems.test';
import PackingItem from '.';
import type { Dispatch } from 'react';
import { clearScreenAndMocks } from '@/__tests__/utils';

type PackingItemFixture = {
  item: FarAway.PackingItem;
  dispatchMock: Dispatch<FarAway.PackingItemAction>;
};

it('renders correctly', () => {
  const item = {
    description: 'test',
    id: 1,
    quantity: 1,
    packed: false,
  };
  renderWithMockedPackingItemsContext(<PackingItem item={item} />);
  expect(
    screen.getByText(new RegExp(`${item.quantity}.*${item.description}.*`)),
  ).toBeDefined();
});

afterEach(clearScreenAndMocks);

describe('Toggle item', () => {
  beforeEach<PackingItemFixture>(context => {
    context.item = {
      description: 'test',
      id: 1,
      quantity: 1,
      packed: false,
    };
  });

  afterEach(clearScreenAndMocks);

  it<
    Pick<PackingItemFixture, 'item'>
  >('dispatches toggle action when the checkbox is clicked', ({ item }) => {
    const [, , dispatchMock] = renderWithMockedPackingItemsContext(
      <PackingItem item={item} />,
    );
    fireEvent.click(screen.getByRole('checkbox'));
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'toggle',
      id: item.id,
    });
  });

  it<
    Pick<PackingItemFixture, 'item'>
  >('Adds line-through style when item is packed', ({ item }) => {
    const packedItem = { ...item, packed: true };

    renderWithMockedPackingItemsContext(<PackingItem item={packedItem} />);
    expect(
      screen.getByText(new RegExp(`${item.quantity}.*${item.description}.*`))
        .style,
    ).toHaveProperty('textDecoration', 'line-through');
  });
});

describe('Remove Item', () => {
  beforeEach<PackingItemFixture>(context => {
    context.item = {
      description: 'test',
      id: 1,
      quantity: 1,
      packed: false,
    };
    [, , context.dispatchMock] = renderWithMockedPackingItemsContext(
      <PackingItem item={context.item} />,
    );
  });

  afterEach(clearScreenAndMocks);

  it<PackingItemFixture>('dispatches remove action when the remove button is clicked', ({
    item,
    dispatchMock,
  }) => {
    fireEvent.click(screen.getByRole('button'));
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'remove',
      id: item.id,
    });
  });
});
