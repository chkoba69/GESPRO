import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { Building2, Mail, Globe, Receipt, Bell, ImagePlus, Briefcase } from 'lucide-react';
import FinancialSettingsPage from './financial';

const SettingsPage: React.FC = () => {
  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
          <p className="text-gray-600">Gérez les paramètres de votre application</p>
        </div>

        <Routes>
          <Route path="/financial" element={<FinancialSettingsPage />} />
          <Route path="/" element={<GeneralSettings />} />
        </Routes>
      </div>
  );
};

const GeneralSettings: React.FC = () => {
  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <ImagePlus className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Logo & Marque</h2>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Logo Principal</label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <ImagePlus className="h-8 w-8 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Changer
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">Format PNG ou SVG recommandé. Max 2MB.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Logo pour Factures</label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <Receipt className="h-8 w-8 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Changer
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">Version haute résolution pour l'impression.</p>
              </div>
            </form>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Briefcase className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Marques Représentées</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="h-20 bg-gray-50 rounded-md flex items-center justify-center mb-2">
                    <img
                      src="https://images.unsplash.com/photo-1563906267088-b029e7101114?auto=format&fit=crop&w=150&q=80"
                      alt="SKF"
                      className="max-h-16 max-w-full"
                    />
                  </div>
                  <p className="text-sm font-medium text-center">SKF</p>
                </div>
                <div className="p-4 border rounded-lg border-dashed flex items-center justify-center">
                  <button
                    type="button"
                    className="text-indigo-600 hover:text-indigo-700 flex flex-col items-center"
                  >
                    <ImagePlus className="h-8 w-8 mb-1" />
                    <span className="text-sm">Ajouter</span>
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Ajoutez les logos des marques que vous représentez pour les afficher sur vos documents commerciaux.
              </p>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Building2 className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Informations de l'Entreprise</h2>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                <input
                  type="text"
                  defaultValue="GestionPro SARL"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Matricule Fiscal</label>
                <input
                  type="text"
                  defaultValue="1234567/A/B/000"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Adresse</label>
                <textarea
                  rows={3}
                  defaultValue="Rue de la République, 1002 Tunis"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </form>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Mail className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Paramètres de Communication</h2>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  defaultValue="contact@gestionpro.tn"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  type="tel"
                  defaultValue="+216 71 234 567"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Site Web</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    <Globe size={16} />
                  </span>
                  <input
                    type="text"
                    defaultValue="www.gestionpro.tn"
                    className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </form>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Receipt className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Paramètres de Facturation</h2>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Devise</label>
                <select
                  defaultValue="TND"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="TND">Dinar Tunisien (TND)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="USD">Dollar US (USD)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">TVA (%)</label>
                <input
                  type="number"
                  defaultValue="19"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Préfixe Facture</label>
                <input
                  type="text"
                  defaultValue="FAC-"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </form>
          </section>

          <section className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Bell className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
            </div>
            <form className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="stock"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="stock" className="font-medium text-gray-700">Alertes de stock</label>
                    <p className="text-gray-500">Recevoir des notifications quand le stock est bas</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="payments"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="payments" className="font-medium text-gray-700">Paiements</label>
                    <p className="text-gray-500">Notifications pour les nouveaux paiements</p>
                  </div>
                </div>
              </div>
            </form>
          </section>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Enregistrer les modifications
          </button>
        </div>
    </div>
  );
};

export default SettingsPage;