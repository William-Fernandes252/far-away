import { usePackingItems } from '@/contexts/packingItems';

type Props = {
  item: FarAway.PackingItem;
};

export default function PackingItem({ item }: Props) {
  const { dispatch } = usePackingItems();

  function handleCheckboxChange() {
    dispatch({ type: 'toggle', id: item.id });
  }

  return (
    <li>
      <input
        type="checkbox"
        value={Number(item.packed)}
        onChange={handleCheckboxChange}
      />
      <span style={item.packed ? { textDecoration: 'line-through' } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => dispatch({ type: 'remove', id: item.id })}>
        ❌
      </button>
    </li>
  );
}
