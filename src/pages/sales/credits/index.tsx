import React, { useState } from 'react';
import CreditNoteList from '../../../components/sales/credits/CreditNoteList';
import CreditNoteForm from '../../../components/sales/credits/CreditNoteForm';
import { CreditNote } from '../../../types';
import { Plus, X } from 'lucide-react';

const CreditNotesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<CreditNote | null>(null);
  const [creditNotes] = useState<CreditNote[]>([
    {
      id: 'AV2024-001',
      originalTransactionId: 'F2024-123',
      clientId: '1',
      date: '2024-03-15T10:30:00Z',
      items: [
        {
          productId: '1',
          quantity: 2,
          unitPrice: 45.500,
          total: 91.000,
          reason: 'Produit défectueux'
        }
      ],
      subtotal: 91.000,
      vat: 17.290,
      total: 108.290,
      status: 'pending',
      notes: 'Retour pour défaut de fabrication'
    }
  ]);

  const handleSave = (note: Partial<CreditNote>) => {
    console.log('Saving credit note:', note);
    setShowForm(false);
    setEditingNote(null);
  };

  const handleEdit = (note: CreditNote) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDelete = (noteId: string) => {
    console.log('Deleting credit note:', noteId);
  };

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Avoirs</h1>
            <p className="text-gray-600">Gérez les avoirs et les retours clients</p>
          </div>
          <button
            onClick={() => {
              setEditingNote(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus size={20} className="mr-2" />
            Nouvel Avoir
          </button>
        </div>

        {showForm ? (
          <div className="bg-white rounded-lg shadow p-6 relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingNote(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {editingNote ? 'Modifier l\'Avoir' : 'Nouvel Avoir'}
            </h2>
            <CreditNoteForm
              onSubmit={handleSave}
              initialData={editingNote || undefined}
            />
          </div>
        ) : (
          <CreditNoteList
            creditNotes={creditNotes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
  );
}

export default CreditNotesPage;