import React, { useState } from 'react';
import { CreditNote } from '../../../types';
import { Plus, X, Search } from 'lucide-react';

interface CreditNoteFormProps {
  onSubmit: (note: Partial<CreditNote>) => void;
  initialData?: Partial<CreditNote>;
}

const CreditNoteForm: React.FC<CreditNoteFormProps> = ({ onSubmit, initialData = {} }) => {
  const [items, setItems] = useState<CreditNote['items']>(initialData.items || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const note: Partial<CreditNote> = {
      originalTransactionId: formData.get('originalTransactionId') as string,
      clientId: formData.get('clientId') as string,
      date: new Date().toISOString(),
      items,
      subtotal: items.reduce((sum, item) => sum + item.total, 0),
      vat: items.reduce((sum, item) => sum + item.total * 0.19, 0),
      total: items.reduce((sum, item) => sum + item.total * 1.19, 0),
      status: 'pending',
      notes: formData.get('notes') as string
    };

    onSubmit(note);
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1, unitPrice: 0, total: 0, reason: '' }]);
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
          <label className="block text-sm font-medium text-gray-700">Facture d'Origine</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <div className="relative flex items-stretch flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="originalTransactionId"
                defaultValue={initialData.originalTransactionId}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md pl-10 sm:text-sm border-gray-300"
                placeholder="Rechercher une facture..."
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Articles Retournés</h3>
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
            <div key={index} className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
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

              <div className="col-span-2">
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

              <div className="col-span-2">
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

              <div className="col-span-3">
                <label className="block text-sm font-medium text-gray-700">Motif</label>
                <input
                  type="text"
                  value={item.reason}
                  onChange={(e) => updateItem(index, 'reason', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Raison du retour"
                  required
                />
              </div>

              <div className="col-span-1 flex items-end justify-end">
                <button
                  type="button"
                  onClick={() => setItems(items.filter((_, i) => i !== index))}
                  className="mb-1 p-1 text-red-600 hover:text-red-800"
                >
                  <X size={20} />
                </button>
              </div>
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
          placeholder="Informations complémentaires..."
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

export default CreditNoteForm;