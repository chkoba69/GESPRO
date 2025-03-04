import React, { useState } from 'react';
import { Quote } from '../../../types';
import { Plus, X, Eye } from 'lucide-react';
import DocumentPreview from '../../../components/transactions/DocumentPreview';
import DocumentActions from '../../../components/transactions/DocumentActions';

interface QuoteFormProps {
  onSubmit: (quote: Partial<Quote>) => void;
  initialData?: Partial<Quote>;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ onSubmit, initialData = {} }) => {
  const [items, setItems] = useState<Quote['items']>(initialData.items || []);
  const [validityDays, setValidityDays] = useState(30);
  const [showPreview, setShowPreview] = useState(false);
  const [fiscalStamp] = useState(1.000); // Valeur par défaut du timbre fiscal
  const previewRef = React.useRef<HTMLDivElement>(null);
  
  const currentQuote: Quote = {
    id: initialData.id || 'DRAFT',
    clientId: initialData.clientId || '1',
    date: initialData.date || new Date().toISOString(),
    validUntil: initialData.validUntil || (() => {
      const date = new Date();
      date.setDate(date.getDate() + validityDays);
      return date.toISOString();
    })(),
    items,
    status: initialData.status || 'draft',
    notes: initialData.notes,
    subtotal: items.reduce((sum, item) => sum + (item.netAmount || item.total), 0),
    vat: items.reduce((sum, item) => sum + (item.vatAmount || (item.total * 0.19)), 0),
    fiscalStamp,
    total: items.reduce((sum, item) => sum + (item.netAmount || item.total) + (item.vatAmount || (item.total * 0.19)), 0) + fiscalStamp
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validityDays);

    const quote: Partial<Quote> = {
      ...currentQuote,
      clientId: formData.get('clientId') as string,
      date: new Date().toISOString(),
      validUntil: validUntil.toISOString(),
      items,
      notes: formData.get('notes') as string,
      status: 'draft'
    };

    onSubmit(quote);
  };

  const addItem = () => {
    setItems([...items, {
      productId: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      discountType: 'percentage',
      grossAmount: 0,
      netAmount: 0,
      vatAmount: 0,
      total: 0
    }]);
  };

  const updateItem = (index: number, field: keyof typeof items[0], value: string | number) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };
    
    // Calculer le montant brut
    const grossAmount = item.quantity * item.unitPrice;
    item.grossAmount = grossAmount;
    
    // Calculer la remise
    const discountAmount = item.discountType === 'percentage' 
      ? grossAmount * (item.discount / 100)
      : Math.min(item.discount, grossAmount);
    
    // Calculer le montant net
    const netAmount = grossAmount - discountAmount;
    item.netAmount = netAmount;
    
    // Calculer la TVA
    const vatAmount = netAmount * 0.19;
    item.vatAmount = vatAmount;
    
    // Calculer le total TTC
    item.total = netAmount + vatAmount;

    newItems[index] = item;
    setItems(newItems);
  };

  if (showPreview) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Aperçu du Devis</h2>
          <div className="flex space-x-4">
            <DocumentActions
              documentRef={previewRef}
              documentType="quote"
              documentId={currentQuote.id}
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
          document={currentQuote}
          documentType="quote"
        />
      </div>
    );
  }

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

              <div className="w-48">
                <label className="block text-sm font-medium text-gray-700">Remise</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) => updateItem(index, 'discount', Number(e.target.value))}
                    step="0.001"
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <select
                    value={item.discountType}
                    onChange={(e) => updateItem(index, 'discountType', e.target.value as 'percentage' | 'amount')}
                    className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="percentage">%</option>
                    <option value="amount">TND</option>
                  </select>
                </div>
              </div>

              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700">Net HT</label>
                <div className="mt-1 block w-full py-2 px-3 text-gray-700">
                  {(item.netAmount || 0).toFixed(3)} TND
                </div>
              </div>

              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700">TVA</label>
                <div className="mt-1 block w-full py-2 px-3 text-gray-700">
                  {(item.vatAmount || 0).toFixed(3)} TND
                </div>
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
            Total HT: {items.reduce((sum, item) => sum + (item.netAmount || item.total), 0).toFixed(3)} TND
          </div>
          <div className="text-gray-500">
            TVA: {items.reduce((sum, item) => sum + (item.vatAmount || (item.total * 0.19)), 0).toFixed(3)} TND
          </div>
          <div className="text-gray-500">
            Timbre Fiscal: {fiscalStamp.toFixed(3)} TND
          </div>
          <div className="text-lg font-medium text-gray-900">
            Total TTC: {(
              items.reduce((sum, item) => sum + (item.netAmount || item.total) + (item.vatAmount || (item.total * 0.19)), 0) + fiscalStamp
            ).toFixed(3)} TND
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

export default QuoteForm;