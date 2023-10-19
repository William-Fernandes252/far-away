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
    case 'update': {
      const newState = state.map(item => {
        if (item.id === action.item.id) {
          return action.item;
        }
        return item;
      });
      localStorage.setItem('items', JSON.stringify(newState));
      return newState;
    }
    case 'remove': {
      const newState = state.filter(item => item.id !== action.id);
      localStorage.setItem('items', JSON.stringify(newState));
      return newState;
    }
    case 'pack': {
      const newState = state.map(item => {
        if (item.id === action.id) {
          return { ...item, packed: true };
        }
        return item;
      });
      localStorage.setItem('items', JSON.stringify(newState));
      return newState;
    }
    case 'unpack': {
      const newState = state.map(item => {
        if (item.id === action.id) {
          return { ...item, packed: false };
        }
        return item;
      });
      localStorage.setItem('items', JSON.stringify(newState));
      return newState;
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
