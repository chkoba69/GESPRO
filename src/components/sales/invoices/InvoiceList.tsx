import React from 'react';
import { Transaction } from '../../../types';
import { FileText, Edit, Trash2, Eye, Send, Download, Printer } from 'lucide-react';

interface InvoiceListProps {
  invoices: Transaction[];
  onEdit: (invoice: Transaction) => void;
  onDelete: (invoiceId: string) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onEdit, onDelete }) => {
  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'Payée';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Référence
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
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
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      Facture #{invoice.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(invoice.date).toLocaleDateString('fr-TN')}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">SARL TechnoPlus</div>
                <div className="text-sm text-gray-500">
                  {invoice.paymentMethod === 'cib' && 'Carte Bancaire'}
                  {invoice.paymentMethod === 'edinar' && 'E-Dinar'}
                  {invoice.paymentMethod === 'cash' && 'Espèces'}
                  {invoice.paymentMethod === 'credit' && 'Crédit'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {invoice.total.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}
                </div>
                <div className="text-sm text-gray-500">
                  TVA: {invoice.vat.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                  {getStatusText(invoice.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => {/* Preview invoice */}}
                  className="text-gray-600 hover:text-gray-900 mx-2"
                  title="Aperçu"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => {/* Print invoice */}}
                  className="text-gray-600 hover:text-gray-900 mx-2"
                  title="Imprimer"
                >
                  <Printer size={18} />
                </button>
                <button
                  onClick={() => {/* Download invoice */}}
                  className="text-blue-600 hover:text-blue-900 mx-2"
                  title="Télécharger"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => {/* Send invoice */}}
                  className="text-green-600 hover:text-green-900 mx-2"
                  title="Envoyer"
                >
                  <Send size={18} />
                </button>
                <button
                  onClick={() => onEdit(invoice)}
                  className="text-indigo-600 hover:text-indigo-900 mx-2"
                  title="Modifier"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(invoice.id)}
                  className="text-red-600 hover:text-red-900 mx-2"
                  title="Supprimer"
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

export default InvoiceList;