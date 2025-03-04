import React, { useState } from 'react';
import ClientList from '../../components/clients/ClientList';
import ClientForm from '../../components/clients/ClientForm';
import { Client } from '../../types';
import { Plus, X } from 'lucide-react';

const ClientsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'TechnoPlus SARL',
      type: 'wholesale',
      contact: {
        email: 'contact@technoplus.tn',
        phone: '+216 71 123 456',
        address: 'Rue de l\'Usine, 2035 Tunis'
      },
      taxInfo: {
        vatNumber: '1234567/A/P/000',
        registrationNumber: 'B0987654321'
      },
      priceLevel: 'wholesale',
      creditLimit: 50000,
      paymentTerms: 45
    }
  ]);

  const handleSave = (client: Partial<Client>) => {
    if (editingClient) {
      // Update existing client
      setClients(prevClients =>
        prevClients.map(c => c.id === editingClient.id ? { ...c, ...client } : c)
      );
    } else {
      // Create new client
      const newClient = {
        ...client,
        id: Date.now().toString() // Temporary ID until we implement proper database integration
      };
      setClients(prevClients => [...prevClients, newClient as Client]);
    }
    setShowForm(false);
    setEditingClient(null);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setShowForm(true);
  };

  const handleDelete = (clientId: string) => {
    setClients(prevClients => prevClients.filter(client => client.id !== clientId));
  };

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Clients</h1>
            <p className="text-gray-600">Gérez votre portefeuille clients et leurs conditions commerciales</p>
          </div>
          <button
            onClick={() => {
              setEditingClient(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus size={20} className="mr-2" />
            Nouveau Client
          </button>
        </div>

        {showForm ? (
          <div className="bg-white rounded-lg shadow p-6 relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingClient(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {editingClient ? 'Modifier le Client' : 'Nouveau Client'}
            </h2>
            <ClientForm
              onSubmit={handleSave}
              initialData={editingClient || undefined}
            />
          </div>
        ) : (
          <ClientList
            clients={clients}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
  );
};

export default ClientsPage