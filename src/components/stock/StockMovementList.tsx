import React from 'react';
import { StockMovement } from '../../hooks/useStock';
import { ArrowUpRight, ArrowDownRight, RefreshCw, RotateCcw } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency } from '../../lib/documents';

interface StockMovementListProps {
  movements: StockMovement[];
}

const StockMovementList: React.FC<StockMovementListProps> = ({ movements }) => {
  const { getProduct } = useProducts();

  const getMovementIcon = (type: StockMovement['movementType']) => {
    switch (type) {
      case 'purchase':
        return <ArrowUpRight className="h-5 w-5 text-green-600" />;
      case 'sale':
        return <ArrowDownRight className="h-5 w-5 text-red-600" />;
      case 'adjustment':
        return <RefreshCw className="h-5 w-5 text-yellow-600" />;
      case 'return':
        return <RotateCcw className="h-5 w-5 text-blue-600" />;
    }
  };

  const getMovementText = (type: StockMovement['movementType']) => {
    switch (type) {
      case 'purchase':
        return 'Achat';
      case 'sale':
        return 'Vente';
      case 'adjustment':
        return 'Ajustement';
      case 'return':
        return 'Retour';
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produit
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantité
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Coût Unit.
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {movements.map((movement) => {
            const product = getProduct(movement.productId);
            return (
              <tr key={movement.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(movement.createdAt).toLocaleDateString('fr-TN')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getMovementIcon(movement.movementType)}
                    <span className="ml-2 text-sm text-gray-900">
                      {getMovementText(movement.movementType)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product?.name}</div>
                  <div className="text-xs text-gray-500">{product?.brand}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <span className={`font-medium ${
                    movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {movement.unitCost ? formatCurrency(movement.unitCost) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {movement.unitCost ? formatCurrency(movement.unitCost * movement.quantity) : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StockMovementList;