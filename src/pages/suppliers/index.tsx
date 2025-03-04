import React, { useState } from 'react';
import SupplierList from '../../components/suppliers/SupplierList';
import SupplierForm from '../../components/suppliers/SupplierForm';
import { Supplier } from '../../types';
import { Plus, X } from 'lucide-react';

const SuppliersPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [suppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'SKF Tunisie',
      type: 'manufacturer',
      contact: {
        email: 'contact@skf.tn',
        phone: '+216 71 234 567',
        address: 'Zone Industrielle, Tunis'
      },
      taxInfo: {
        vatNumber: '1234567/A/M/000',
        registrationNumber: 'B0123456789'
      },
      paymentTerms: {
        days: 60,
        method: 'bank_transfer'
      },
      brands: ['SKF', 'SKF Bearing', 'SKF Maintenance'],
      rating: 5,
      status: 'active',
      lastOrder: '2024-03-10T14:30:00Z'
    }
  ]);

  const handleSave = (supplier: Partial<Supplier>) => {
    console.log('Saving supplier:', supplier);
    setShowForm(false);
    setEditingSupplier(null);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleDelete = (supplierId: string) => {
    console.log('Deleting supplier:', supplierId);
  };

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Fournisseurs</h1>
            <p className="text-gray-600">Gérez vos relations avec les fournisseurs et fabricants</p>
          </div>
          <button
            onClick={() => {
              setEditingSupplier(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus size={20} className="mr-2" />
            Nouveau Fournisseur
          </button>
        </div>

        {showForm ? (
          <div className="bg-white rounded-lg shadow p-6 relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingSupplier(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {editingSupplier ? 'Modifier le Fournisseur' : 'Nouveau Fournisseur'}
            </h2>
            <SupplierForm
              onSubmit={handleSave}
              initialData={editingSupplier || undefined}
            />
          </div>
        ) : (
          <SupplierList
            suppliers={suppliers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
  );
};

export default SuppliersPage;