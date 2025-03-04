import React from 'react';
import { Supplier } from '../../types';
import { Factory, Edit, Trash2, Star } from 'lucide-react';

interface SupplierListProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: string) => void;
}

const SupplierList: React.FC<SupplierListProps> = ({ suppliers, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fournisseur
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Marques
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Note
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Factory className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                    <div className="text-sm text-gray-500">
                      {supplier.type === 'manufacturer' && 'Fabricant'}
                      {supplier.type === 'distributor' && 'Distributeur'}
                      {supplier.type === 'importer' && 'Importateur'}
                    </div>
                    <div className={`text-xs ${
                      supplier.status === 'active' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {supplier.status === 'active' ? 'Actif' : 'Inactif'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{supplier.contact.email}</div>
                <div className="text-sm text-gray-500">{supplier.contact.phone}</div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {supplier.brands.map((brand, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= supplier.rating ? 'text-yellow-400' : 'text-gray-300'}
                      fill={star <= supplier.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(supplier)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(supplier.id)}
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

export default SupplierList