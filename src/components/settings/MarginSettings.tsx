import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { ProductMargin } from '../../hooks/useFinancialSettings';

interface MarginSettingsProps {
  margins: ProductMargin[];
  onSave: (margin: Omit<ProductMargin, 'id'>) => void;
}

const MarginSettings: React.FC<MarginSettingsProps> = ({ margins, onSave }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingMargin, setEditingMargin] = useState<ProductMargin | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const margin: Omit<ProductMargin, 'id'> = {
      category: formData.get('category') as string,
      minMargin: Number(formData.get('minMargin')),
      targetMargin: Number(formData.get('targetMargin')),
      maxMargin: Number(formData.get('maxMargin'))
    };

    onSave(margin);
    setShowForm(false);
    setEditingMargin(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Marges par Catégorie</h3>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus size={16} className="mr-2" />
          Nouvelle Marge
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Catégorie</label>
              <input
                type="text"
                name="category"
                defaultValue={editingMargin?.category}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Marge Minimale (%)</label>
              <input
                type="number"
                name="minMargin"
                defaultValue={editingMargin?.minMargin}
                step="0.01"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Marge Cible (%)</label>
              <input
                type="number"
                name="targetMargin"
                defaultValue={editingMargin?.targetMargin}
                step="0.01"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Marge Maximale (%)</label>
              <input
                type="number"
                name="maxMargin"
                defaultValue={editingMargin?.maxMargin}
                step="0.01"
                min="0"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingMargin(null);
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
                Catégorie
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marge Min.
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marge Cible
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marge Max.
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {margins.map((margin) => (
              <tr key={margin.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {margin.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {margin.minMargin}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {margin.targetMargin}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {margin.maxMargin}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setEditingMargin(margin);
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

export default MarginSettings;