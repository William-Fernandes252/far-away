declare namespace FarAway {
  interface PackingItem {
    description: string;
    id: number;
    quantity: number;
    packed: boolean;
  }

  type PackingItemAction =
    | { type: 'add'; item: FarAway.PackingItem }
    | { type: 'remove' | 'toggle'; id: FarAway.PackingItem['id'] }
    | { type: 'clear' };
}
