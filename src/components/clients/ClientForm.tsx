import React from 'react';
import { Client } from '../../types';
import { X } from 'lucide-react';

interface ClientFormProps {
  onSubmit: (client: Partial<Client>) => void;
  initialData?: Partial<Client>;
}

const ClientForm: React.FC<ClientFormProps> = ({ onSubmit, initialData = {} }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const client: Partial<Client> = {
      name: formData.get('name') as string,
      type: formData.get('type') as 'retail' | 'wholesale' | 'bulk',
      contact: {
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
      },
      taxInfo: {
        vatNumber: formData.get('vatNumber') as string,
        registrationNumber: formData.get('registrationNumber') as string,
      },
      priceLevel: formData.get('priceLevel') as 'retail' | 'wholesale' | 'bulk',
      creditLimit: Number(formData.get('creditLimit')),
      paymentTerms: Number(formData.get('paymentTerms')),
    };

    onSubmit(client);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom du Client</label>
            <input
              type="text"
              name="name"
              defaultValue={initialData.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type de Client</label>
            <select
              name="type"
              defaultValue={initialData.type}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="retail">Détail</option>
              <option value="wholesale">Semi-Gros</option>
              <option value="bulk">Gros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Niveau de Prix</label>
            <select
              name="priceLevel"
              defaultValue={initialData.priceLevel}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="retail">Prix Détail</option>
              <option value="wholesale">Prix Semi-Gros</option>
              <option value="bulk">Prix Gros</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={initialData.contact?.email}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="tel"
              name="phone"
              defaultValue={initialData.contact?.phone}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <textarea
              name="address"
              defaultValue={initialData.contact?.address}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Informations Fiscales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Matricule Fiscal</label>
            <input
              type="text"
              name="vatNumber"
              defaultValue={initialData.taxInfo?.vatNumber}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Registre de Commerce</label>
            <input
              type="text"
              name="registrationNumber"
              defaultValue={initialData.taxInfo?.registrationNumber}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Conditions Commerciales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Limite de Crédit (TND)</label>
            <input
              type="number"
              name="creditLimit"
              defaultValue={initialData.creditLimit}
              min="0"
              step="0.001"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Délai de Paiement (jours)</label>
            <input
              type="number"
              name="paymentTerms"
              defaultValue={initialData.paymentTerms}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </form>
  );
};

export default ClientForm