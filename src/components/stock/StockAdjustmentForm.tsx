import React, { useState } from 'react';
import { StockAdjustment } from '../../hooks/useStock';
import { Plus, X } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';

interface StockAdjustmentFormProps {
  onSubmit: (adjustment: Omit<StockAdjustment, 'id'>) => void;
  initialData?: Partial<StockAdjustment>;
}

const StockAdjustmentForm: React.FC<StockAdjustmentFormProps> = ({ onSubmit, initialData = {} }) => {
  const [items, setItems] = useState<StockAdjustment['items']>(initialData.items || []);
  const { products } = useProducts();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const adjustment: Omit<StockAdjustment, 'id'> = {
      date: new Date().toISOString(),
      reason: formData.get('reason') as StockAdjustment['reason'],
      notes: formData.get('notes') as string,
      status: 'pending',
      items
    };

    onSubmit(adjustment);
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 0 }]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Motif</label>
          <select
            name="reason"
            defaultValue={initialData.reason}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="damage">Dommage</option>
            <option value="loss">Perte</option>
            <option value="correction">Correction</option>
            <option value="expiry">Péremption</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            name="notes"
            rows={3}
            defaultValue={initialData.notes}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Articles</h3>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
          >
            <Plus size={16} className="mr-1" />
            Ajouter un article
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Produit</label>
                <select
                  value={item.productId}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index] = { ...item, productId: e.target.value };
                    setItems(newItems);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="">Sélectionner un produit</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Stock: {product.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700">Quantité</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index] = { ...item, quantity: Number(e.target.value) };
                    setItems(newItems);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Motif</label>
                <input
                  type="text"
                  value={item.reason || ''}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index] = { ...item, reason: e.target.value };
                    setItems(newItems);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Raison spécifique pour cet article"
                />
              </div>

              <button
                type="button"
                onClick={() => setItems(items.filter((_, i) => i !== index))}
                className="mt-7 p-1 text-red-600 hover:text-red-800"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </form>
  );
};

export default StockAdjustmentForm;