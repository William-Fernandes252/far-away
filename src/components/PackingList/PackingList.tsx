import PackingItem from '@/components/PackingItem';
import { usePackingItems } from '@/contexts/packingItems';
import { useState } from 'react';

export default function PackingList() {
  const { items, dispatch } = usePackingItems();
  const [sortBy, setSortBy] = useState<keyof FarAway.PackingItem>('id');

  let sortedItems: FarAway.PackingItem[];
  switch (sortBy) {
    case 'id':
      sortedItems = [...items].sort((a, b) => a.id - b.id);
      break;
    case 'description':
      sortedItems = [...items].sort((a, b) =>
        a.description.localeCompare(b.description),
      );
      break;
    case 'packed':
      sortedItems = [...items].sort(a => (a.packed ? -1 : 1));
      break;
    default:
      sortedItems = [...items];
      break;
  }

  function handleClear() {
    const confirmed = window.confirm(
      'Are you sure you want to clear the packing list?',
    );
    if (confirmed) {
      dispatch({ type: 'clear' });
    }
  }

  return (
    <div className="list">
      <ul>
        {sortedItems.map(item => (
          <PackingItem key={item.id} item={item} />
        ))}
      </ul>
      <div className="actions">
        <select
          name="sortBy"
          id="sort-by"
          value={sortBy}
          placeholder="Sort by"
          onChange={e =>
            setSortBy(e.target.value as keyof FarAway.PackingItem)
          }>
          <option value="id">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="packed">Sort by packed status</option>
        </select>
        <button onClick={handleClear}>Clear list</button>
      </div>
    </div>
  );
}
