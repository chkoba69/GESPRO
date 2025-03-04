import React from 'react';
import { Supplier } from '../../types';
import { Star, X } from 'lucide-react';

interface SupplierFormProps {
  onSubmit: (supplier: Partial<Supplier>) => void;
  initialData?: Partial<Supplier>;
}

const SupplierForm: React.FC<SupplierFormProps> = ({ onSubmit, initialData = {} }) => {
  const [brands, setBrands] = React.useState<string[]>(initialData.brands || []);
  const [rating, setRating] = React.useState(initialData.rating || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const supplier: Partial<Supplier> = {
      name: formData.get('name') as string,
      type: formData.get('type') as 'manufacturer' | 'distributor' | 'importer',
      contact: {
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
      },
      taxInfo: {
        vatNumber: formData.get('vatNumber') as string,
        registrationNumber: formData.get('registrationNumber') as string,
      },
      paymentTerms: {
        days: Number(formData.get('paymentDays')),
        method: formData.get('paymentMethod') as 'bank_transfer' | 'check' | 'cash',
      },
      brands,
      rating,
      status: formData.get('status') as 'active' | 'inactive',
    };

    onSubmit(supplier);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom du Fournisseur</label>
            <input
              type="text"
              name="name"
              defaultValue={initialData.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              defaultValue={initialData.type}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="manufacturer">Fabricant</option>
              <option value="distributor">Distributeur</option>
              <option value="importer">Importateur</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            <select
              name="status"
              defaultValue={initialData.status}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Note</label>
            <div className="flex items-center mt-1 space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <Star size={20} fill={star <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              defaultValue={initialData.contact?.email}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="tel"
              name="phone"
              defaultValue={initialData.contact?.phone}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <textarea
              name="address"
              defaultValue={initialData.contact?.address}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Informations Fiscales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Matricule Fiscal</label>
            <input
              type="text"
              name="vatNumber"
              defaultValue={initialData.taxInfo?.vatNumber}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Registre de Commerce</label>
            <input
              type="text"
              name="registrationNumber"
              defaultValue={initialData.taxInfo?.registrationNumber}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Conditions de Paiement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Délai (jours)</label>
            <input
              type="number"
              name="paymentDays"
              defaultValue={initialData.paymentTerms?.days}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Méthode</label>
            <select
              name="paymentMethod"
              defaultValue={initialData.paymentTerms?.method}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            >
              <option value="bank_transfer">Virement Bancaire</option>
              <option value="check">Chèque</option>
              <option value="cash">Espèces</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Marques Représentées</h3>
        <div className="space-y-2">
          {brands.map((brand, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={brand}
                onChange={(e) => {
                  const newBrands = [...brands];
                  newBrands[index] = e.target.value;
                  setBrands(newBrands);
                }}
                placeholder="Nom de la marque"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setBrands(brands.filter((_, i) => i !== index))}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setBrands([...brands, ''])}
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
          >
            + Ajouter une marque
          </button>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </form>
  );
};

export default SupplierForm