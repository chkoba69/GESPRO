import React, { useState } from 'react';
import { Quote } from '../../../types';
import { Plus, X } from 'lucide-react';

interface QuoteFormProps {
  onSubmit: (quote: Partial<Quote>) => void;
  initialData?: Partial<Quote>;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ onSubmit, initialData = {} }) => {
  const [items, setItems] = useState<Quote['items']>(initialData.items || []);
  const [validityDays, setValidityDays] = useState(30);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validityDays);

    const quote: Partial<Quote> = {
      clientId: formData.get('clientId') as string,
      date: new Date().toISOString(),
      validUntil: validUntil.toISOString(),
      items,
      notes: formData.get('notes') as string,
      status: 'draft',
      subtotal: items.reduce((sum, item) => sum + item.total, 0),
      vat: items.reduce((sum, item) => sum + item.total * 0.19, 0),
      total: items.reduce((sum, item) => sum + item.total * 1.19, 0)
    };

    onSubmit(quote);
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const updateItem = (index: number, field: keyof typeof items[0], value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      total: field === 'quantity' ? items[index].unitPrice * Number(value) :
             field === 'unitPrice' ? items[index].quantity * Number(value) :
             items[index].total
    };
    setItems(newItems);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Client</label>
          <select
            name="clientId"
            defaultValue={initialData.clientId}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="1">TechnoPlus SARL</option>
            {/* Add more clients dynamically */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Validité (jours)</label>
          <input
            type="number"
            value={validityDays}
            onChange={(e) => setValidityDays(Number(e.target.value))}
            min="1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
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
                  onChange={(e) => updateItem(index, 'productId', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  <option value="1">Roulement à billes SKF 6205</option>
                  {/* Add more products dynamically */}
                </select>
              </div>

              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700">Quantité</label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700">Prix Unit.</label>
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                  step="0.001"
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700">Total</label>
                <div className="mt-1 block w-full py-2 px-3 text-gray-700">
                  {item.total.toFixed(3)} TND
                </div>
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

      <div>
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          name="notes"
          rows={3}
          defaultValue={initialData.notes}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="Conditions spéciales, remarques..."
        />
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-end space-x-4 text-sm">
          <div className="text-gray-500">
            Sous-total: {items.reduce((sum, item) => sum + item.total, 0).toFixed(3)} TND
          </div>
          <div className="text-gray-500">
            TVA (19%): {(items.reduce((sum, item) => sum + item.total, 0) * 0.19).toFixed(3)} TND
          </div>
          <div className="text-lg font-medium text-gray-900">
            Total: {(items.reduce((sum, item) => sum + item.total, 0) * 1.19).toFixed(3)} TND
          </div>
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

export default QuoteForm;