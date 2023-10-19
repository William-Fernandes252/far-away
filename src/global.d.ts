declare namespace FarAway {
  interface PackingItem {
    description: string;
    id: number;
    quantity: number;
    packed: boolean;
  }

  type PackingItemAction =
    | { type: 'add' | 'update'; item: FarAway.PackingItem }
    | { type: 'remove' | 'pack' | 'unpack'; id: FarAway.PackingItem['id'] };
}
