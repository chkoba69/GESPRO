import React, { useState } from 'react';
import DeliveryNoteList from '../../../components/sales/delivery/DeliveryNoteList';
import DeliveryNoteForm from '../../../components/sales/delivery/DeliveryNoteForm';
import { DeliveryNote } from '../../../types';
import { Plus, X } from 'lucide-react';

const DeliveryNotesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<DeliveryNote | null>(null);
  const [deliveryNotes] = useState<DeliveryNote[]>([
    {
      id: 'BL2024-001',
      transactionId: 'F2024-123',
      clientId: '1',
      date: '2024-03-15T10:30:00Z',
      items: [
        {
          productId: '1',
          quantity: 5
        }
      ],
      status: 'pending',
      deliveryAddress: 'Rue de l\'Usine, 2035 Tunis',
      notes: 'Livraison urgente'
    }
  ]);

  const handleSave = (note: Partial<DeliveryNote>) => {
    console.log('Saving delivery note:', note);
    setShowForm(false);
    setEditingNote(null);
  };

  const handleEdit = (note: DeliveryNote) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDelete = (noteId: string) => {
    console.log('Deleting delivery note:', noteId);
  };

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bons de Livraison</h1>
            <p className="text-gray-600">Gérez vos bons de livraison et suivez les expéditions</p>
          </div>
          <button
            onClick={() => {
              setEditingNote(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus size={20} className="mr-2" />
            Nouveau Bon de Livraison
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
              {editingNote ? 'Modifier le Bon de Livraison' : 'Nouveau Bon de Livraison'}
            </h2>
            <DeliveryNoteForm
              onSubmit={handleSave}
              initialData={editingNote || undefined}
            />
          </div>
        ) : (
          <DeliveryNoteList
            deliveryNotes={deliveryNotes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
  );
};

export default DeliveryNotesPage;