import { createContext, useContext } from 'react';
import type { Dispatch } from 'react';

export const PackingItemsContext = createContext<null | FarAway.PackingItem[]>(
  null,
);
export const PackingItemsDispatchContext =
  createContext<null | Dispatch<FarAway.PackingItemAction>>(null);

export function usePackingItems(): {
  items: FarAway.PackingItem[];
  dispatch: Dispatch<FarAway.PackingItemAction>;
} {
  const items = useContext(PackingItemsContext);
  const dispatch = useContext(PackingItemsDispatchContext);
  return { items, dispatch } as {
    items: FarAway.PackingItem[];
    dispatch: Dispatch<FarAway.PackingItemAction>;
  };
}
