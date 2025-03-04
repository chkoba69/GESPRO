import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { DiscountRule } from '../../hooks/useFinancialSettings';

interface DiscountSettingsProps {
  rules: DiscountRule[];
  onSave: (rule: Omit<DiscountRule, 'id'>) => void;
}

const DiscountSettings: React.FC<DiscountSettingsProps> = ({ rules, onSave }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState<DiscountRule | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const rule: Omit<DiscountRule, 'id'> = {
      name: formData.get('name') as string,
      type: formData.get('type') as DiscountRule['type'],
      clientType: formData.getAll('clientType') as DiscountRule['clientType'],
      minAmount: formData.get('minAmount') ? Number(formData.get('minAmount')) : undefined,
      minQuantity: formData.get('minQuantity') ? Number(formData.get('minQuantity')) : undefined,
      discountPercent: formData.get('discountPercent') ? Number(formData.get('discountPercent')) : undefined,
      discountAmount: formData.get('discountAmount') ? Number(formData.get('discountAmount')) : undefined,
      startDate: formData.get('startDate') as string || undefined,
      endDate: formData.get('endDate') as string || undefined,
      active: true
    };

    onSave(rule);
    setShowForm(false);
    setEditingRule(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Règles de Remise</h3>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus size={16} className="mr-2" />
          Nouvelle Remise
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                name="name"
                defaultValue={editingRule?.name}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                defaultValue={editingRule?.type}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="commercial">Commerciale</option>
                <option value="quantity">Quantitative</option>
                <option value="promotional">Promotionnelle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Types de Client</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="clientType"
                    value="retail"
                    defaultChecked={editingRule?.clientType.includes('retail')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Détail</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="clientType"
                    value="wholesale"
                    defaultChecked={editingRule?.clientType.includes('wholesale')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Semi-Gros</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="clientType"
                    value="bulk"
                    defaultChecked={editingRule?.clientType.includes('bulk')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Gros</label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Conditions</label>
              <div className="mt-2 space-y-2">
                <input
                  type="number"
                  name="minAmount"
                  defaultValue={editingRule?.minAmount}
                  placeholder="Montant minimum"
                  step="0.001"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  name="minQuantity"
                  defaultValue={editingRule?.minQuantity}
                  placeholder="Quantité minimum"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Remise</label>
              <div className="mt-2 space-y-2">
                <input
                  type="number"
                  name="discountPercent"
                  defaultValue={editingRule?.discountPercent}
                  placeholder="Pourcentage de remise"
                  step="0.01"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  name="discountAmount"
                  defaultValue={editingRule?.discountAmount}
                  placeholder="Montant de remise"
                  step="0.001"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Période</label>
              <div className="mt-2 space-y-2">
                <input
                  type="date"
                  name="startDate"
                  defaultValue={editingRule?.startDate?.split('T')[0]}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  type="date"
                  name="endDate"
                  defaultValue={editingRule?.endDate?.split('T')[0]}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingRule(null);
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
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remise
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
            {rules.map((rule) => (
              <tr key={rule.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{rule.name}</div>
                  <div className="text-sm text-gray-500">
                    {rule.clientType.join(', ')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    rule.type === 'commercial' ? 'bg-blue-100 text-blue-800' :
                    rule.type === 'quantity' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {rule.type === 'commercial' && 'Commerciale'}
                    {rule.type === 'quantity' && 'Quantitative'}
                    {rule.type === 'promotional' && 'Promotionnelle'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {rule.discountPercent ? `${rule.discountPercent}%` : `${rule.discountAmount} TND`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    rule.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {rule.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setEditingRule(rule);
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

export default DiscountSettings;