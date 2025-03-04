import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { PurchaseReceipt } from '../../../types';

const PurchaseReceiptsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<PurchaseReceipt | null>(null);
  const [receipts] = useState<PurchaseReceipt[]>([
    {
      id: 'BR2024-001',
      purchaseOrderId: 'BC2024-001',
      supplierId: '1',
      date: '2024-03-15T10:30:00Z',
      items: [
        {
          productId: '1',
          quantity: 50,
          unitPrice: 35.000,
          total: 1750.000
        }
      ],
      subtotal: 1750.000,
      vat: 332.500,
      total: 2082.500,
      status: 'completed',
      paymentMethod: 'bank_transfer',
      notes: 'Réception conforme à la commande'
    }
  ]);

  const handleSave = (receipt: Partial<PurchaseReceipt>) => {
    console.log('Saving purchase receipt:', receipt);
    setShowForm(false);
    setEditingReceipt(null);
  };

  const handleEdit = (receipt: PurchaseReceipt) => {
    setEditingReceipt(receipt);
    setShowForm(true);
  };

  const handleDelete = (receiptId: string) => {
    console.log('Deleting purchase receipt:', receiptId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bons de Réception</h1>
          <p className="text-gray-600">Gérez vos réceptions de marchandises</p>
        </div>
        <button
          onClick={() => {
            setEditingReceipt(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus size={20} className="mr-2" />
          Nouveau Bon de Réception
        </button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6 relative">
          <button
            onClick={() => {
              setShowForm(false);
              setEditingReceipt(null);
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {editingReceipt ? 'Modifier le Bon de Réception' : 'Nouveau Bon de Réception'}
          </h2>
          {/* Add PurchaseReceiptForm component here */}
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
              {receipts.map((receipt) => (
                <tr key={receipt.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      BR #{receipt.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      BC #{receipt.purchaseOrderId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">SKF Tunisie</div>
                    <div className="text-sm text-gray-500">
                      {new Date(receipt.date).toLocaleDateString('fr-TN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {receipt.total.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}
                    </div>
                    <div className="text-sm text-gray-500">
                      TVA: {receipt.vat.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      receipt.status === 'completed' ? 'bg-green-100 text-green-800' :
                      receipt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {receipt.status === 'completed' && 'Complété'}
                      {receipt.status === 'pending' && 'En attente'}
                      {receipt.status === 'cancelled' && 'Annulé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(receipt)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(receipt.id)}
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

export default PurchaseReceiptsPage;