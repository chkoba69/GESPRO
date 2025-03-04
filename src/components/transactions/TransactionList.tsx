import React from 'react';
import { Transaction } from '../../types';
import { FileText, Edit, Trash2, CreditCard, Eye } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
  onPreview: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete, onPreview }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Référence
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
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
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      Facture #{transaction.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      {transaction.paymentMethod === 'cib' && 'Carte Bancaire'}
                      {transaction.paymentMethod === 'edinar' && 'E-Dinar'}
                      {transaction.paymentMethod === 'cash' && 'Espèces'}
                      {transaction.paymentMethod === 'credit' && 'Crédit'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {new Date(transaction.date).toLocaleDateString('fr-TN')}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleTimeString('fr-TN')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.total.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}
                    </div>
                    <div className="text-xs text-gray-500">
                      TVA: {transaction.vat.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                  transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {transaction.status === 'completed' && 'Complétée'}
                  {transaction.status === 'pending' && 'En attente'}
                  {transaction.status === 'cancelled' && 'Annulée'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onPreview(transaction)}
                  className="text-gray-600 hover:text-gray-900 mr-4"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => onEdit(transaction)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(transaction.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;