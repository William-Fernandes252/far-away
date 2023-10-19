import { usePackingItems } from '@/contexts/packingItems';

export default function Stats() {
  const { items } = usePackingItems();
  const packedCount = items.filter(item => item.packed).length;
  const packedPercentage = Math.round(
    (packedCount / (items.length || 1)) * 100,
  );

  let footerContent: string;
  if (items.length === 0) {
    footerContent = 'Start adding some items to your packing list 🚀';
  } else if (packedPercentage === 100) {
    footerContent = 'You got everthing! Ready to go ✈️';
  } else {
    footerContent = `👜 You have ${items.length} items on your list, and you already packed ${packedCount} (${packedPercentage}%)`;
  }

  return (
    <footer className="stats">
      <em>{footerContent}</em>
    </footer>
  );
}
