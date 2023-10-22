import { useReducer } from 'react';
import type { Reducer } from 'react';
import {
  PackingItemsContext,
  PackingItemsDispatchContext,
} from '@/contexts/packingItems';

function packingItemsReducer(
  state: FarAway.PackingItem[],
  action: FarAway.PackingItemAction,
): FarAway.PackingItem[] {
  switch (action.type) {
    case 'add': {
      const newState = [...state, action.item];
      localStorage.setItem('items', JSON.stringify(newState));
      return newState;
    }
    case 'remove': {
      const newState = state.filter(item => item.id !== action.id);
      localStorage.setItem('items', JSON.stringify(newState));
      return newState;
    }
    case 'toggle': {
      const newState = state.map(item => {
        if (item.id === action.id) {
          return { ...item, packed: !item.packed };
        }
        return item;
      });
      localStorage.setItem('items', JSON.stringify(newState));
      return newState;
    }
    case 'clear': {
      localStorage.setItem('items', JSON.stringify([]));
      return [];
    }
  }
}

export function PackingItemsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, dispatch] = useReducer<
    Reducer<FarAway.PackingItem[], FarAway.PackingItemAction>
  >(
    packingItemsReducer,
    (JSON.parse(localStorage.getItem('items') as string) ||
      []) as FarAway.PackingItem[],
  );

  return (
    <PackingItemsContext.Provider value={items}>
      <PackingItemsDispatchContext.Provider value={dispatch}>
        {children}
      </PackingItemsDispatchContext.Provider>
    </PackingItemsContext.Provider>
  );
}

if (import.meta.vitest) {
  const { it, expect, describe, afterEach, vi } = import.meta.vitest;

  const localStorageMock = {
    setItem: vi.fn(),
  };

  vi.stubGlobal('localStorage', localStorageMock);

  describe('Packing Items Reducer', () => {
    afterEach(() => {
      vi.clearAllMocks();
    });

    function assertPersistedLocally(items: FarAway.PackingItem[]) {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'items',
        JSON.stringify(items),
      );
    }

    describe('Add', () => {
      it('should add an item', () => {
        const items = packingItemsReducer([], {
          type: 'add',
          item: { id: 1, description: 'test', quantity: 1, packed: false },
        });
        expect(items).toEqual([
          { id: 1, description: 'test', quantity: 1, packed: false },
        ]);
        assertPersistedLocally(items);
      });
    });
    describe('Remove', () => {
      it('should remove an item', () => {
        const items = packingItemsReducer(
          [{ id: 1, description: 'test', quantity: 1, packed: false }],
          {
            type: 'remove',
            id: 1,
          },
        );
        expect(items).toEqual([]);
        assertPersistedLocally(items);
      });
      it('should not remove if does not exist', () => {
        const initialItems = [
          { id: 1, description: 'test', quantity: 1, packed: false },
        ];
        const items = packingItemsReducer(initialItems, {
          type: 'remove',
          id: 2,
        });
        expect(items).toEqual(initialItems);
        assertPersistedLocally(items);
      });
    });
    describe('Toggle', () => {
      it('should toggle an item', () => {
        [false, true].forEach(initialPackedState => {
          const items = packingItemsReducer(
            [
              {
                id: 1,
                description: 'test',
                quantity: 1,
                packed: initialPackedState,
              },
            ],
            {
              type: 'toggle',
              id: 1,
            },
          );
          expect(items).toEqual([
            {
              id: 1,
              description: 'test',
              quantity: 1,
              packed: !initialPackedState,
            },
          ]);
          assertPersistedLocally(items);
        });
      });
    });
  });
}
