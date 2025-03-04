import React from 'react';
import { CreditNote } from '../../../types';
import { Receipt, Edit, Trash2, Eye, CheckCircle, Search } from 'lucide-react';

interface CreditNoteListProps {
  creditNotes: CreditNote[];
  onEdit: (note: CreditNote) => void;
  onDelete: (noteId: string) => void;
}

const CreditNoteList: React.FC<CreditNoteListProps> = ({ creditNotes, onEdit, onDelete }) => {
  const getStatusColor = (status: CreditNote['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: CreditNote['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'processed':
        return 'Traité';
      case 'cancelled':
        return 'Annulé';
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
          {creditNotes.map((note) => (
            <tr key={note.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Receipt className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      Avoir #{note.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      Facture #{note.originalTransactionId}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">SARL TechnoPlus</div>
                <div className="text-sm text-gray-500">
                  {new Date(note.date).toLocaleDateString('fr-TN')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {note.total.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}
                </div>
                <div className="text-sm text-gray-500">
                  TVA: {note.vat.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(note.status)}`}>
                  {getStatusText(note.status)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => {/* Preview note */}}
                  className="text-gray-600 hover:text-gray-900 mx-2"
                  title="Aperçu"
                >
                  <Eye size={18} />
                </button>
                {note.status === 'pending' && (
                  <button
                    onClick={() => {/* Mark as processed */}}
                    className="text-green-600 hover:text-green-900 mx-2"
                    title="Marquer comme traité"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}
                <button
                  onClick={() => onEdit(note)}
                  className="text-indigo-600 hover:text-indigo-900 mx-2"
                  title="Modifier"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(note.id)}
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

export default CreditNoteList;