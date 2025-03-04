import React, { useState } from 'react';
import QuoteList from '../../../components/sales/quotes/QuoteList';
import QuoteForm from '../../../components/sales/quotes/QuoteForm';
import { Quote } from '../../../types';
import { Plus, X } from 'lucide-react';

const QuotesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [quotes] = useState<Quote[]>([
    {
      id: 'Q2024-001',
      clientId: '1',
      date: '2024-03-15T10:30:00Z',
      validUntil: '2024-04-15T10:30:00Z',
      items: [
        {
          productId: '1',
          quantity: 10,
          unitPrice: 42.500,
          total: 425.000
        }
      ],
      subtotal: 425.000,
      vat: 80.750,
      total: 505.750,
      status: 'sent',
      notes: 'Offre spéciale pour commande en gros'
    }
  ]);

  const handleSave = (quote: Partial<Quote>) => {
    console.log('Saving quote:', quote);
    setShowForm(false);
    setEditingQuote(null);
  };

  const handleEdit = (quote: Quote) => {
    setEditingQuote(quote);
    setShowForm(true);
  };

  const handleDelete = (quoteId: string) => {
    console.log('Deleting quote:', quoteId);
  };

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Devis</h1>
            <p className="text-gray-600">Créez et gérez vos devis clients</p>
          </div>
          <button
            onClick={() => {
              setEditingQuote(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus size={20} className="mr-2" />
            Nouveau Devis
          </button>
        </div>

        {showForm ? (
          <div className="bg-white rounded-lg shadow p-6 relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingQuote(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {editingQuote ? 'Modifier le Devis' : 'Nouveau Devis'}
            </h2>
            <QuoteForm
              onSubmit={handleSave}
              initialData={editingQuote || undefined}
            />
          </div>
        ) : (
          <QuoteList
            quotes={quotes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
  );
};

export default QuotesPage;