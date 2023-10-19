import { usePackingItems } from '@/contexts/packingItems';
import { useState, type FormEvent } from 'react';

type NewItemFormState = {
  [key in 'quantity' | 'description']: string;
};

export default function NewPackingItemForm() {
  const [newItemForm, setNewItemForm] = useState<NewItemFormState>({
    description: '',
    quantity: '1',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const { dispatch } = usePackingItems();

  function validateNewItemForm(item: NewItemFormState): string[] {
    const validationErrors = [];
    if (item.description.length === 0) {
      validationErrors.push('Description cannot be empty');
    }
    if (item.quantity.length === 0) {
      validationErrors.push('Quantity cannot be empty');
    }
    if (isNaN(Number(item.quantity))) {
      validationErrors.push('Quantity must be a number');
    }
    return validationErrors;
  }

  function createNewItemFromForm(): FarAway.PackingItem {
    return {
      description: newItemForm.description,
      quantity: Number(newItemForm.quantity),
      id: Date.now(),
      packed: false,
    };
  }

  function handleSubmit(event: FormEvent): void {
    event.preventDefault();

    const validationErrors = validateNewItemForm(newItemForm);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    dispatch({ type: 'add', item: createNewItemFromForm() });
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setNewItemForm(prevState => ({
      ...prevState,
      [event.target.name as keyof NewItemFormState]: event.target.value,
    }));
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for you trip?</h3>
      <select
        name="quantity"
        id="new-item-quantity"
        onChange={handleChange}
        value={newItemForm.quantity}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map(quantity => (
          <option key={quantity} value={quantity}>
            {quantity}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        name="description"
        onChange={handleChange}
        value={newItemForm.description}
      />
      <button type="submit">Add</button>
      <div className="add-form-errors">
        {errors.map(error => (
          <p key={error}>{error}</p>
        ))}
      </div>
    </form>
  );
}
