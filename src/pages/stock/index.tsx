import React, { useState } from 'react';
import { Package, ArrowUpRight, ArrowDownRight, BarChart3, AlertTriangle } from 'lucide-react';
import StockMovementList from '../../components/stock/StockMovementList';
import StockAdjustmentForm from '../../components/stock/StockAdjustmentForm';
import { useStock } from '../../hooks/useStock';
import { useProducts } from '../../hooks/useProducts';
import { formatCurrency } from '../../lib/documents';

const StockPage: React.FC = () => {
  const [showAdjustmentForm, setShowAdjustmentForm] = useState(false);
  const { products } = useProducts();
  const { createAdjustment } = useStock();

  const lowStockProducts = products.filter(product => product.stock <= product.minStock);
  const totalStockValue = products.reduce((total, product) => {
    return total + (product.stock * product.price.bulk);
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Stocks</h1>
        <p className="text-gray-600">Gérez vos stocks et suivez les mouvements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold mt-1">{products.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Valeur du Stock</p>
              <p className="text-2xl font-bold mt-1">{formatCurrency(totalStockValue)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Entrées (30j)</p>
              <p className="text-2xl font-bold mt-1 text-green-600">+234</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <ArrowUpRight className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sorties (30j)</p>
              <p className="text-2xl font-bold mt-1 text-red-600">-156</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <ArrowDownRight className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Alertes Stock</h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {lowStockProducts.length} articles
            </span>
          </div>
          <div className="space-y-4">
            {lowStockProducts.map(product => (
              <div key={product.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">Stock: {product.stock} | Min: {product.minStock}</p>
                  </div>
                </div>
                <button className="text-sm text-indigo-600 hover:text-indigo-900">
                  Commander
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Ajustement de Stock</h2>
            <button
              onClick={() => setShowAdjustmentForm(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Nouvel Ajustement
            </button>
          </div>
          {showAdjustmentForm ? (
            <StockAdjustmentForm
              onSubmit={async (adjustment) => {
                await createAdjustment(adjustment);
                setShowAdjustmentForm(false);
              }}
            />
          ) : (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Pas d'ajustement en cours</h3>
              <p className="mt-1 text-sm text-gray-500">
                Commencez par créer un nouvel ajustement de stock.
              </p>
            </div>
          )}
        </section>
      </div>

      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium text-gray-900">Derniers Mouvements</h2>
          <select className="rounded-md border-gray-300 text-sm">
            <option>7 derniers jours</option>
            <option>30 derniers jours</option>
            <option>Cette année</option>
          </select>
        </div>
        <StockMovementList movements={[]} />
      </section>
    </div>
  );
};

export default StockPage;