import React from 'react';
import { Quote } from '../../../types';
import { FileCheck, Edit, Trash2, Eye, Send, ArrowRight } from 'lucide-react';

interface QuoteListProps {
  quotes: Quote[];
  onEdit: (quote: Quote) => void;
  onDelete: (quoteId: string) => void;
}

const QuoteList: React.FC<QuoteListProps> = ({ quotes, onEdit, onDelete }) => {
  const getStatusColor = (status: Quote['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Quote['status']) => {
    switch (status) {
      case 'draft':
        return 'Brouillon';
      case 'sent':
        return 'Envoyé';
      case 'accepted':
        return 'Accepté';
      case 'rejected':
        return 'Refusé';
      case 'expired':
        return 'Expiré';
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
          {quotes.map((quote) => (
            <tr key={quote.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      Devis #{quote.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      Valide jusqu'au {new Date(quote.validUntil).toLocaleDateString('fr-TN')}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">SARL TechnoPlus</div>
                <div className="text-sm text-gray-500">Client Pro</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {new Date(quote.date).toLocaleDateString('fr-TN')}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(quote.date).toLocaleTimeString('fr-TN')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {quote.total.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}
                </div>
                <div className="text-sm text-gray-500">
                  TVA: {quote.vat.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                  {getStatusText(quote.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => {/* Preview quote */}}
                  className="text-gray-600 hover:text-gray-900 mx-2"
                  title="Aperçu"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => {/* Send quote */}}
                  className="text-blue-600 hover:text-blue-900 mx-2"
                  title="Envoyer"
                >
                  <Send size={18} />
                </button>
                <button
                  onClick={() => {/* Convert to invoice */}}
                  className="text-green-600 hover:text-green-900 mx-2"
                  title="Convertir en facture"
                >
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => onEdit(quote)}
                  className="text-indigo-600 hover:text-indigo-900 mx-2"
                  title="Modifier"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(quote.id)}
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

export default QuoteList;