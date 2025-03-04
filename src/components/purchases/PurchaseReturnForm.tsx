import React, { useState } from 'react';
import { PurchaseReturn } from '../../types';
import { Plus, X, Eye } from 'lucide-react';
import DocumentPreview from '../transactions/DocumentPreview';
import DocumentActions from '../transactions/DocumentActions';

interface PurchaseReturnFormProps {
  onSubmit: (returnNote: Partial<PurchaseReturn>) => void;
  initialData?: Partial<PurchaseReturn>;
}

const PurchaseReturnForm: React.FC<PurchaseReturnFormProps> = ({ onSubmit, initialData = {} }) => {
  const [items, setItems] = useState<PurchaseReturn['items']>(initialData.items || []);
  const [showPreview, setShowPreview] = useState(false);
  const [type, setType] = useState<'local' | 'international'>(initialData.type || 'local');
  const [currency, setCurrency] = useState(initialData.currency || 'TND');
  const [exchangeRate, setExchangeRate] = useState(initialData.exchangeRate || 1);
  const previewRef = React.useRef<HTMLDivElement>(null);

  const currentReturn: PurchaseReturn = {
    id: initialData.id || 'DRAFT',
    originalReceiptId: initialData.originalReceiptId || '',
    supplierId: initialData.supplierId || '1',
    type,
    date: initialData.date || new Date().toISOString(),
    items,
    currency,
    exchangeRate,
    subtotal: items.reduce((sum, item) => sum + item.total, 0),
    vat: type === 'local' ? items.reduce((sum, item) => sum + item.total * 0.19, 0) : 0,
    total: type === 'local' 
      ? items.reduce((sum, item) => sum + item.total * 1.19, 0)
      : items.reduce((sum, item) => sum + item.total, 0),
    status: initialData.status || 'pending',
    notes: initialData.notes
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const returnNote: Partial<PurchaseReturn> = {
      ...currentReturn,
      originalReceiptId: formData.get('originalReceiptId') as string,
      supplierId: formData.get('supplierId') as string,
      type: formData.get('type') as 'local' | 'international',
      currency: formData.get('currency') as string,
      exchangeRate: Number(formData.get('exchangeRate')),
      notes: formData.get('notes') as string
    };

    onSubmit(returnNote);
  };

  const addItem = () => {
    setItems([...items, { 
      productId: '', 
      quantity: 1, 
      unitPrice: 0, 
      total: 0,
      currency,
      exchangeRate,
      reason: '' 
    }]);
  };

  const updateItem = (index: number, field: keyof typeof items[0], value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      currency,
      exchangeRate,
      total: field === 'quantity' ? items[index].unitPrice * Number(value) * exchangeRate :
             field === 'unitPrice' ? items[index].quantity * Number(value) * exchangeRate :
             items[index].total
    };
    setItems(newItems);
  };

  if (showPreview) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Aperçu du Retour</h2>
          <div className="flex space-x-4">
            <DocumentActions
              documentRef={previewRef}
              documentType="return"
              documentId={currentReturn.id}
              onSend={() => console.log('Sending...')}
              onShare={() => console.log('Sharing...')}
            />
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <DocumentPreview
          ref={previewRef}
          document={currentReturn}
          documentType="return"
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Bon de Réception</label>
          <select
            name="originalReceiptId"
            defaultValue={initialData.originalReceiptId}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="BR2024-001">BR #BR2024-001</option>
            {/* Add more receipts dynamically */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fournisseur</label>
          <select
            name="supplierId"
            defaultValue={initialData.supplierId}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="1">SKF Tunisie</option>
            {/* Add more suppliers dynamically */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type d'Achat</label>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as 'local' | 'international')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="local">Local</option>
            <option value="international">International</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Devise</label>
          <select
            name="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="TND">Dinar Tunisien (TND)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="USD">Dollar US (USD)</option>
          </select>
        </div>

        {type === 'international' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Taux de Change</label>
            <input
              type="number"
              name="exchangeRate"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(Number(e.target.value))}
              step="0.001"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        )}
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
            Sous-total: {items.reduce((sum, item) => sum + item.total, 0).toFixed(3)} {currency}
          </div>
          {type === 'local' && (
            <div className="text-gray-500">
              TVA (19%): {(items.reduce((sum, item) => sum + item.total, 0) * 0.19).toFixed(3)} {currency}
            </div>
          )}
          <div className="text-lg font-medium text-gray-900">
            Total: {(type === 'local' 
              ? items.reduce((sum, item) => sum + item.total, 0) * 1.19 
              : items.reduce((sum, item) => sum + item.total, 0)).toFixed(3)} {currency}
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="mr-3 inline-flex justify-center rounded-md border border-gray-300 py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Eye size={16} className="mr-2" />
            Aperçu
          </button>
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

export default PurchaseReturnForm;