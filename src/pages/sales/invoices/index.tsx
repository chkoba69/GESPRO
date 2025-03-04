import React, { useState } from 'react';
import InvoiceList from '../../../components/sales/invoices/InvoiceList';
import InvoiceForm from '../../../components/sales/invoices/InvoiceForm';
import { Transaction } from '../../../types';
import { Plus, X } from 'lucide-react';

const InvoicesPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Transaction | null>(null);
  const [invoices] = useState<Transaction[]>([
    {
      id: 'F2024-001',
      clientId: '1',
      date: '2024-03-15T10:30:00Z',
      items: [
        {
          productId: '1',
          quantity: 5,
          unitPrice: 45.500,
          total: 227.500
        }
      ],
      subtotal: 227.500,
      vat: 43.225,
      total: 270.725,
      status: 'completed',
      paymentMethod: 'cib'
    }
  ]);

  const handleSave = (invoice: Partial<Transaction>) => {
    console.log('Saving invoice:', invoice);
    setShowForm(false);
    setEditingInvoice(null);
  };

  const handleEdit = (invoice: Transaction) => {
    setEditingInvoice(invoice);
    setShowForm(true);
  };

  const handleDelete = (invoiceId: string) => {
    console.log('Deleting invoice:', invoiceId);
  };

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Factures</h1>
            <p className="text-gray-600">Gérez vos factures clients</p>
          </div>
          <button
            onClick={() => {
              setEditingInvoice(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus size={20} className="mr-2" />
            Nouvelle Facture
          </button>
        </div>

        {showForm ? (
          <div className="bg-white rounded-lg shadow p-6 relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingInvoice(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {editingInvoice ? 'Modifier la Facture' : 'Nouvelle Facture'}
            </h2>
            <InvoiceForm
              onSubmit={handleSave}
              initialData={editingInvoice || undefined}
            />
          </div>
        ) : (
          <InvoiceList
            invoices={invoices}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
  );
};

export default InvoicesPage;