import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { PurchaseOrder } from '../../../types';
import PurchaseOrderForm from '../../../components/purchases/PurchaseOrderForm';

const PurchaseOrdersPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [orders] = useState<PurchaseOrder[]>([
    {
      id: 'BC2024-001',
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
      status: 'sent',
      notes: 'Commande urgente pour réapprovisionnement',
      expectedDeliveryDate: '2024-03-20T10:30:00Z'
    }
  ]);

  const handleSave = (order: Partial<PurchaseOrder>) => {
    console.log('Saving purchase order:', order);
    setShowForm(false);
    setEditingOrder(null);
  };

  const handleEdit = (order: PurchaseOrder) => {
    setEditingOrder(order);
    setShowForm(true);
  };

  const handleDelete = (orderId: string) => {
    console.log('Deleting purchase order:', orderId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bons de Commande</h1>
          <p className="text-gray-600">Gérez vos commandes fournisseurs</p>
        </div>
        <button
          onClick={() => {
            setEditingOrder(null);
            setShowForm(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus size={20} className="mr-2" />
          Nouveau Bon de Commande
        </button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow p-6 relative">
          <button
            onClick={() => {
              setShowForm(false);
              setEditingOrder(null);
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {editingOrder ? 'Modifier le Bon de Commande' : 'Nouveau Bon de Commande'}
          </h2>
          <PurchaseOrderForm
            onSubmit={handleSave}
            initialData={editingOrder || undefined}
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
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      BC #{order.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString('fr-TN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">SKF Tunisie</div>
                    <div className="text-sm text-gray-500">
                      Livraison prévue: {new Date(order.expectedDeliveryDate!).toLocaleDateString('fr-TN')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.total.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}
                    </div>
                    <div className="text-sm text-gray-500">
                      TVA: {order.vat.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      order.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      order.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      order.status === 'received' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status === 'draft' && 'Brouillon'}
                      {order.status === 'sent' && 'Envoyé'}
                      {order.status === 'confirmed' && 'Confirmé'}
                      {order.status === 'received' && 'Reçu'}
                      {order.status === 'cancelled' && 'Annulé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(order)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
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

export default PurchaseOrdersPage;