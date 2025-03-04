import React, { useState } from 'react';
import { BarChart3, Package, Users, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats] = useState({
    totalProducts: 1234,
    activeClients: 456,
    monthlyRevenue: 789000,
    growth: 23.5
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
        <p className="text-gray-600">Aperçu de votre activité commerciale</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Produits Total"
          value={stats.totalProducts.toLocaleString()}
          icon={<Package className="text-blue-600" />}
          trend="+12%"
        />
        <StatCard
          title="Clients Actifs"
          value={stats.activeClients.toLocaleString()}
          icon={<Users className="text-green-600" />}
          trend="+8%"
        />
        <StatCard
          title="Revenu Mensuel"
          value={`${(stats.monthlyRevenue / 1000).toLocaleString()} k TND`}
          icon={<BarChart3 className="text-purple-600" />}
          trend="+15%"
        />
        <StatCard
          title="Croissance"
          value={`${stats.growth}%`}
          icon={<TrendingUp className="text-orange-600" />}
          trend="+2.5%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Alertes Stock</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div>
                <h3 className="font-medium text-red-700">Stock Critique</h3>
                <p className="text-sm text-red-600">Roulement à billes SKF 6205</p>
              </div>
              <span className="text-red-700 font-semibold">5 unités</span>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Dernières Transactions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-medium">SARL TechnoPlus</h3>
                <p className="text-sm text-gray-600">Facture #F2024-0123</p>
              </div>
              <span className="font-semibold text-green-600">12,450 TND</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}> = ({ title, value, icon, trend }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
      {icon}
    </div>
    <div className="mt-4">
      <span className="text-sm text-green-600 font-medium">{trend}</span>
      <span className="text-sm text-gray-600 ml-2">vs mois dernier</span>
    </div>
  </div>
);

export default Dashboard;