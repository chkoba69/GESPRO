import React from 'react';
import { Client } from '../../types';
import { Users, Edit, Trash2, CreditCard } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Crédit
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                    <div className="text-sm text-gray-500">{client.taxInfo.vatNumber}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{client.contact.email}</div>
                <div className="text-sm text-gray-500">{client.contact.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  client.type === 'retail' ? 'bg-blue-100 text-blue-800' :
                  client.type === 'wholesale' ? 'bg-purple-100 text-purple-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {client.type === 'retail' && 'Détail'}
                  {client.type === 'wholesale' && 'Semi-Gros'}
                  {client.type === 'bulk' && 'Gros'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-900">
                      {client.creditLimit.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {client.paymentTerms} jours
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(client)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(client.id)}
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

export default ClientList