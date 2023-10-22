import { beforeEach, afterEach, it, expect, describe, vi } from 'vitest';
import type { Dispatch, ReactNode } from 'react';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  type RenderOptions,
  type RenderResult,
} from '@testing-library/react';
import {
  PackingItemsContext,
  PackingItemsDispatchContext,
  usePackingItems,
} from './packingItems';

export type PackingItemsProviderFixture = {
  dispatchMock: Dispatch<FarAway.PackingItemAction>;
  currentItems: FarAway.PackingItem[];
};

export type PackingItemActionsTestFixture = PackingItemsProviderFixture & {
  newItem: FarAway.PackingItem;
};

export function renderWithPackingItemsContext(
  ui: ReactNode,
  items: FarAway.PackingItem[],
  dispatch: Dispatch<FarAway.PackingItemAction>,
  renderOptions?: RenderOptions,
) {
  return render(
    <PackingItemsContext.Provider value={items}>
      <PackingItemsDispatchContext.Provider value={dispatch}>
        {ui}
      </PackingItemsDispatchContext.Provider>
    </PackingItemsContext.Provider>,
    renderOptions,
  );
}

export function renderWithMockedPackingItemsContext(
  ui: ReactNode,
  renderOptions?: RenderOptions,
): [RenderResult, FarAway.PackingItem[], Dispatch<FarAway.PackingItemAction>] {
  const items: FarAway.PackingItem[] = [
    { description: 'Item 1', quantity: 1, id: 1, packed: false },
    { description: 'Item 2', quantity: 2, id: 2, packed: true },
  ];
  const dispatchMock: Dispatch<FarAway.PackingItemAction> = vi.fn();
  return [
    renderWithPackingItemsContext(ui, items, dispatchMock, renderOptions),
    items,
    dispatchMock,
  ];
}

describe('Packing Items Context', () => {
  beforeEach<PackingItemActionsTestFixture>(context => {
    context.newItem = {
      description: 'Item 3',
      quantity: 3,
      id: 3,
      packed: false,
    };

    function TestComponent() {
      const { items, dispatch } = usePackingItems();

      return (
        <div>
          {items.map(item => (
            <p key={item.id}>{item.description}</p>
          ))}
          <button
            onClick={() =>
              dispatch({
                type: 'add',
                item: context.newItem,
              })
            }
            data-testid="add-btn">
            Add
          </button>
        </div>
      );
    }

    [, context.currentItems, context.dispatchMock] =
      renderWithMockedPackingItemsContext(<TestComponent />);
  });

  afterEach(cleanup);

  it<PackingItemActionsTestFixture>('should dispatch an action when an event occurs', ({
    newItem,
    dispatchMock,
  }) => {
    fireEvent.click(screen.getByTestId('add-btn'));
    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'add',
      item: newItem,
    });
  });

  it<PackingItemsProviderFixture>('should return the current items', ({
    currentItems,
  }) => {
    currentItems.forEach(item => {
      expect(screen.queryByText(item.description)).toBeDefined();
    });
  });
});
