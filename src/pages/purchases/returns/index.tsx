import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { PurchaseReturn } from '../../../types';
import PurchaseReturnForm from '../../../components/purchases/PurchaseReturnForm';

const PurchaseReturnsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingReturn, setEditingReturn] = useState<PurchaseReturn | null>(null);
  const [returns] = useState<PurchaseReturn[]>([
    {
      id: 'RET2024-001',
      originalReceiptId: 'BR2024-001',
      supplierId: '1',
      date: '2024-03-15T10:30:00Z',
      items: [
        {
          productId: '1',
          quantity: 5,
          unitPrice: 35.000,
          total: 175.000,
          reason: 'Produits endommagés'
        }
      ],
      subtotal: 175.000,
      vat: 33.250,
      total: 208.250,
      status: 'pending',
      notes: 'Retour pour marchandise non conforme'
    }
  ]);

  const handleSave = (returnNote: Partial<PurchaseReturn>) => {
    console.log('Saving purchase return:', returnNote);
    setShowForm(false);
    setEditingReturn(null);
  };

  const handleEdit = (returnNote: PurchaseReturn) => {
    setEditingReturn(returnNote);
    setShowForm(true);
  };

  const handleDelete = (returnId: string) => {
    console.log('Deleting purchase return:', returnId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Retours Fournisseurs</h1>
          <p className="text-gray-600">Gérez vos retours de marchandises aux fournisseurs</p>
        </div>
        <button
          onClick={() => {
            setEditingReturn(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus size={20} className="mr-2" />
          Nouveau Retour
        </button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6 relative">
          <button
            onClick={() => {
              setShowForm(false);
              setEditingReturn(null);
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {editingReturn ? 'Modifier le Retour' : 'Nouveau Retour'}
          </h2>
          <PurchaseReturnForm
            onSubmit={handleSave}
            initialData={editingReturn || undefined}
          />
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Référence
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fournisseur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {returns.map((returnNote) => (
                <tr key={returnNote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      RET #{returnNote.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      BR #{returnNote.originalReceiptId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">SKF Tunisie</div>
                    <div className="text-sm text-gray-500">
                      {new Date(returnNote.date).toLocaleDateString('fr-TN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {returnNote.total.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}
                    </div>
                    <div className="text-sm text-gray-500">
                      TVA: {returnNote.vat.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      returnNote.status === 'processed' ? 'bg-green-100 text-green-800' :
                      returnNote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {returnNote.status === 'processed' && 'Traité'}
                      {returnNote.status === 'pending' && 'En attente'}
                      {returnNote.status === 'cancelled' && 'Annulé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(returnNote)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(returnNote.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchaseReturnsPage;