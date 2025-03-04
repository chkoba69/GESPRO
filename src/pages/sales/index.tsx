import React from 'react';
import { FileText, FileCheck, Truck as TruckDelivery, Receipt, BarChart3, Users, Package, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const SalesPage: React.FC = () => {
  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Ventes</h1>
          <p className="text-gray-600">Gérez vos factures, devis et livraisons</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/sales/invoices"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Factures</h3>
                <p className="text-sm text-gray-500">Gérer les factures clients</p>
              </div>
            </div>
          </Link>

          <Link
            to="/sales/quotes"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Devis</h3>
                <p className="text-sm text-gray-500">Créer et suivre les devis</p>
              </div>
            </div>
          </Link>

          <Link
            to="/sales/delivery"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TruckDelivery className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Livraisons</h3>
                <p className="text-sm text-gray-500">Bons de livraison</p>
              </div>
            </div>
          </Link>

          <Link
            to="/sales/credits"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Receipt className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Avoirs</h3>
                <p className="text-sm text-gray-500">Gérer les retours</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Aperçu des Ventes</h2>
              <select className="rounded-md border-gray-300 text-sm">
                <option>7 derniers jours</option>
                <option>30 derniers jours</option>
                <option>Cette année</option>
              </select>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Chiffre d'affaires</p>
                    <p className="text-xs text-gray-500">Total des ventes</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-900">45,780 TND</p>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nouveaux Clients</p>
                    <p className="text-xs text-gray-500">Cette période</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-900">12</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Articles Vendus</p>
                    <p className="text-xs text-gray-500">Quantité totale</p>
                  </div>
                </div>
                <p className="text-lg font-semibold text-gray-900">234</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Activité Récente</h2>
              <Link to="/sales/history" className="text-sm text-indigo-600 hover:text-indigo-900">
                Voir tout
              </Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <History className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Facture #F2024-0123</p>
                    <p className="text-xs text-gray-500">Il y a 2 heures</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Payée
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <History className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Devis #D2024-0089</p>
                    <p className="text-xs text-gray-500">Il y a 4 heures</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  En attente
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <History className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Livraison #L2024-0056</p>
                    <p className="text-xs text-gray-500">Il y a 6 heures</p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Livrée
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
  );
};

export default SalesPage;