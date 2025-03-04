import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { FiscalStamp } from '../../hooks/useFinancialSettings';

interface FiscalStampSettingsProps {
  stamps: FiscalStamp[];
  onSave: (stamp: Omit<FiscalStamp, 'id'>) => void;
}

const FiscalStampSettings: React.FC<FiscalStampSettingsProps> = ({ stamps, onSave }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingStamp, setEditingStamp] = useState<FiscalStamp | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const stamp: Omit<FiscalStamp, 'id'> = {
      amount: Number(formData.get('amount')),
      effectiveDate: formData.get('effectiveDate') as string,
      endDate: formData.get('endDate') as string || undefined,
      description: formData.get('description') as string,
      active: true
    };

    onSave(stamp);
    setShowForm(false);
    setEditingStamp(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Timbre Fiscal</h3>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus size={16} className="mr-2" />
          Nouveau Timbre
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Montant</label>
              <input
                type="number"
                name="amount"
                defaultValue={editingStamp?.amount}
                step="0.001"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date d'Effet</label>
              <input
                type="date"
                name="effectiveDate"
                defaultValue={editingStamp?.effectiveDate.split('T')[0]}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date de Fin</label>
              <input
                type="date"
                name="endDate"
                defaultValue={editingStamp?.endDate?.split('T')[0]}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                name="description"
                defaultValue={editingStamp?.description}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingStamp(null);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Enregistrer
            </button>
          </div>
        </form>
      )}

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date d'Effet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date de Fin
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
            {stamps.map((stamp) => (
              <tr key={stamp.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {stamp.amount.toFixed(3)} TND
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(stamp.effectiveDate).toLocaleDateString('fr-TN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {stamp.endDate ? new Date(stamp.endDate).toLocaleDateString('fr-TN') : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    stamp.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {stamp.active ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setEditingStamp(stamp);
                      setShowForm(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Modifier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FiscalStampSettings;