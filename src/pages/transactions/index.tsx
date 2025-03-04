import React, { useState, useRef } from 'react';
import Layout from '../../components/Layout';
import TransactionList from '../../components/transactions/TransactionList';
import TransactionForm from '../../components/transactions/TransactionForm';
import InvoicePreview from '../../components/transactions/InvoicePreview';
import InvoiceActions from '../../components/transactions/InvoiceActions';
import { Transaction } from '../../types';
import { Plus, X, Printer } from 'lucide-react';

const TransactionsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [previewTransaction, setPreviewTransaction] = useState<Transaction | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
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

  const handleSave = (transaction: Partial<Transaction>) => {
    console.log('Saving transaction:', transaction);
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = (transactionId: string) => {
    console.log('Deleting transaction:', transactionId);
  };

  const handlePreview = (transaction: Transaction) => {
    setPreviewTransaction(transaction);
    setShowPreview(true);
  };

  const handlePrint = () => {
    const content = previewRef.current;
    if (content) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Facture</title>
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            </head>
            <body>
              ${content.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Transactions</h1>
            <p className="text-gray-600">Gérez vos factures et transactions commerciales</p>
          </div>
          <button
            onClick={() => {
              setEditingTransaction(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus size={20} className="mr-2" />
            Nouvelle Transaction
          </button>
        </div>

        {showForm ? (
          <div className="bg-white rounded-lg shadow p-6 relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingTransaction(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {editingTransaction ? 'Modifier la Transaction' : 'Nouvelle Transaction'}
            </h2>
            <TransactionForm
              onSubmit={handleSave}
              initialData={editingTransaction || undefined}
            />
          </div>
        ) : showPreview && previewTransaction ? (
          <div className="bg-gray-100 rounded-lg p-6 relative">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                Aperçu de la Facture
              </h2>
              <div className="flex space-x-4">
                <InvoiceActions
                  onDownload={() => console.log('Downloading...')}
                  onPrint={handlePrint}
                  onSend={() => console.log('Sending...')}
                  onShare={() => console.log('Sharing...')}
                />
                <button
                  onClick={() => {
                    setShowPreview(false);
                    setPreviewTransaction(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div ref={previewRef}>
              <InvoicePreview transaction={previewTransaction} />
            </div>
          </div>
        ) : (
          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPreview={handlePreview}
          />
        )}
      </div>
    </Layout>
  );
}

export default TransactionsPage;