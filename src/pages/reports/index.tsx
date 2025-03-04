import React, { useState } from 'react';
import { BarChart, LineChart, PieChart, TrendingUp, Users, Package, DollarSign } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('month');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports & Statistiques</h1>
          <p className="text-gray-600">Analysez vos données commerciales</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-md border-gray-300 text-sm"
          >
            <option value="week">7 derniers jours</option>
            <option value="month">30 derniers jours</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Chiffre d'Affaires</p>
              <p className="text-2xl font-bold mt-1">45,780 TND</p>
              <p className="text-sm text-green-600 mt-1">+12.5%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nouveaux Clients</p>
              <p className="text-2xl font-bold mt-1">24</p>
              <p className="text-sm text-green-600 mt-1">+8.3%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Articles Vendus</p>
              <p className="text-2xl font-bold mt-1">342</p>
              <p className="text-sm text-red-600 mt-1">-3.2%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Croissance</p>
              <p className="text-2xl font-bold mt-1">15.4%</p>
              <p className="text-sm text-green-600 mt-1">+2.1%</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <LineChart className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Évolution des Ventes</h2>
            </div>
          </div>
          <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500">Graphique d'évolution des ventes</p>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <PieChart className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Répartition des Ventes</h2>
            </div>
          </div>
          <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-500">Graphique de répartition des ventes</p>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <BarChart className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Meilleures Ventes</h2>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Roulement SKF 6205</p>
                    <p className="text-xs text-gray-500">234 unités vendues</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">12,450 TND</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Meilleurs Clients</h2>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">TechnoPlus SARL</p>
                    <p className="text-xs text-gray-500">15 commandes</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">45,780 TND</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReportsPage;