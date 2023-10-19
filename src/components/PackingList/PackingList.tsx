import PackingItem from '@/components/PackingItem';
import { usePackingItems } from '@/contexts/packingItems';

export default function PackingList() {
  const { items } = usePackingItems();
  return (
    <div className="list">
      <ul>
        {items.map(item => (
          <PackingItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}
