import React from 'react';
import { Product } from '../../types';
import { Package, Edit, Trash2 } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produit
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prix (TND)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dernière MAJ
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-8 w-8 rounded object-cover"
                      />
                    ) : (
                      <Package className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.brand}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm ${product.stock <= product.minStock ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                  {product.stock} unités
                </div>
                {product.stock <= product.minStock && (
                  <div className="text-xs text-red-500">Stock bas</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="space-y-1">
                  <div className="text-sm text-gray-900">Détail: {product.price.retail.toFixed(3)}</div>
                  <div className="text-sm text-gray-500">Gros: {product.price.bulk.toFixed(3)}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(product.lastUpdated).toLocaleDateString('fr-FR')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(product)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDelete(product.id)}
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

export default ProductList