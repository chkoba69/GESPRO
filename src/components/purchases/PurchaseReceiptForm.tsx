import React, { useState } from 'react';
import { PurchaseReceipt } from '../../types';
import { Plus, X, Eye } from 'lucide-react';
import DocumentPreview from '../transactions/DocumentPreview';
import DocumentActions from '../transactions/DocumentActions';

interface PurchaseReceiptFormProps {
  onSubmit: (receipt: Partial<PurchaseReceipt>) => void;
  initialData?: Partial<PurchaseReceipt>;
}

const PurchaseReceiptForm: React.FC<PurchaseReceiptFormProps> = ({ onSubmit, initialData = {} }) => {
  const [items, setItems] = useState<PurchaseReceipt['items']>(initialData.items || []);
  const [showPreview, setShowPreview] = useState(false);
  const [type, setType] = useState<'local' | 'international'>(initialData.type || 'local');
  const [currency, setCurrency] = useState(initialData.currency || 'TND');
  const [exchangeRate, setExchangeRate] = useState(initialData.exchangeRate || 1);
  const previewRef = React.useRef<HTMLDivElement>(null);

  const currentReceipt: PurchaseReceipt = {
    id: initialData.id || 'DRAFT',
    purchaseOrderId: initialData.purchaseOrderId || '',
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
    paymentMethod: initialData.paymentMethod || 'bank_transfer',
    notes: initialData.notes,
    customsClearanceDate: initialData.customsClearanceDate,
    customsCharges: initialData.customsCharges,
    shippingCharges: initialData.shippingCharges,
    otherCharges: initialData.otherCharges,
    totalLandedCost: initialData.totalLandedCost
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const receipt: Partial<PurchaseReceipt> = {
      ...currentReceipt,
      purchaseOrderId: formData.get('purchaseOrderId') as string,
      supplierId: formData.get('supplierId') as string,
      type: formData.get('type') as 'local' | 'international',
      currency: formData.get('currency') as string,
      exchangeRate: Number(formData.get('exchangeRate')),
      paymentMethod: formData.get('paymentMethod') as 'bank_transfer' | 'check' | 'cash',
      notes: formData.get('notes') as string,
      customsClearanceDate: type === 'international' ? formData.get('customsClearanceDate') as string : undefined,
      customsCharges: type === 'international' ? Number(formData.get('customsCharges')) : undefined,
      shippingCharges: type === 'international' ? Number(formData.get('shippingCharges')) : undefined,
      otherCharges: type === 'international' ? Number(formData.get('otherCharges')) : undefined
    };

    if (type === 'international') {
      receipt.totalLandedCost = (receipt.total || 0) + 
        (receipt.customsCharges || 0) + 
        (receipt.shippingCharges || 0) + 
        (receipt.otherCharges || 0);
    }

    onSubmit(receipt);
  };

  const addItem = () => {
    setItems([...items, { 
      productId: '', 
      quantity: 1, 
      unitPrice: 0, 
      total: 0,
      currency,
      exchangeRate 
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
          <h2 className="text-lg font-medium text-gray-900">Aperçu du Bon de Réception</h2>
          <div className="flex space-x-4">
            <DocumentActions
              documentRef={previewRef}
              documentType="receipt"
              documentId={currentReceipt.id}
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
          document={currentReceipt}
          documentType="receipt"
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Bon de Commande</label>
          <select
            name="purchaseOrderId"
            defaultValue={initialData.purchaseOrderId}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="BC2024-001">BC #BC2024-001</option>
            {/* Add more purchase orders dynamically */}
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
          <label className="block text-sm font-medium text-gray-700">Méthode de Paiement</label>
          <select
            name="paymentMethod"
            defaultValue={initialData.paymentMethod}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="bank_transfer">Virement Bancaire</option>
            <option value="check">Chèque</option>
            <option value="cash">Espèces</option>
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

      {type === 'international' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de Dédouanement</label>
            <input
              type="date"
              name="customsClearanceDate"
              defaultValue={initialData.customsClearanceDate?.split('T')[0]}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Frais de Douane</label>
            <input
              type="number"
              name="customsCharges"
              defaultValue={initialData.customsCharges}
              step="0.001"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Frais de Transport</label>
            <input
              type="number"
              name="shippingCharges"
              defaultValue={initialData.shippingCharges}
              step="0.001"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Autres Frais</label>
            <input
              type="number"
              name="otherCharges"
              defaultValue={initialData.otherCharges}
              step="0.001"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}

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
                  {(item.total).toFixed(3)} {currency}
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
          placeholder="Instructions ou remarques particulières..."
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

export default PurchaseReceiptForm;