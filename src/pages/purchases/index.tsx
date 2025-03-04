import React from 'react';
import { FileText, FileCheck, Truck as TruckDelivery, Receipt, BarChart3, Factory, Package, History } from 'lucide-react';
import { Link } from 'react-router-dom';

const PurchasesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Achats</h1>
        <p className="text-gray-600">Gérez vos commandes et réceptions fournisseurs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/purchases/orders"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Bons de Commande</h3>
              <p className="text-sm text-gray-500">Gérer les commandes fournisseurs</p>
            </div>
          </div>
        </Link>

        <Link
          to="/purchases/receipts"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <TruckDelivery className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Réceptions</h3>
              <p className="text-sm text-gray-500">Bons de réception</p>
            </div>
          </div>
        </Link>

        <Link
          to="/purchases/returns"
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-lg">
              <Receipt className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Retours</h3>
              <p className="text-sm text-gray-500">Gérer les retours fournisseurs</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Aperçu des Achats</h2>
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
                  <p className="text-sm font-medium text-gray-900">Total Achats</p>
                  <p className="text-xs text-gray-500">Montant des commandes</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-900">38,450 TND</p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Factory className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Fournisseurs Actifs</p>
                  <p className="text-xs text-gray-500">Cette période</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-900">8</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Articles Commandés</p>
                  <p className="text-xs text-gray-500">Quantité totale</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-900">156</p>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Activité Récente</h2>
            <Link to="/purchases/history" className="text-sm text-indigo-600 hover:text-indigo-900">
              Voir tout
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center">
                <History className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Commande #BC2024-0045</p>
                  <p className="text-xs text-gray-500">Il y a 3 heures</p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                En attente
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center">
                <History className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Réception #BR2024-0032</p>
                  <p className="text-xs text-gray-500">Il y a 5 heures</p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Complétée
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <History className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Retour #RET2024-0008</p>
                  <p className="text-xs text-gray-500">Il y a 8 heures</p>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Traité
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PurchasesPage;