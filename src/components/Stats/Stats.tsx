import { usePackingItems } from '@/contexts/packingItems';

export default function Stats() {
  const { items } = usePackingItems();
  const packedCount = items.filter(item => item.packed).length;
  const packedPercentage = Math.round(
    (packedCount / (items.length || 1)) * 100,
  );
  return (
    <footer className="stats">
      <em>
        👜 You have {items.length} items on your list, and you already packed{' '}
        {packedCount} ({packedPercentage}%)
      </em>
    </footer>
  );
}
