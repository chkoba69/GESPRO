import React from 'react';
import { Product } from '../../types';
import { Plus, X } from 'lucide-react';

interface ProductFormProps {
  onSubmit: (product: Partial<Product>) => void;
  initialData?: Partial<Product>;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, initialData = {} }) => {
  const [specs, setSpecs] = React.useState<[string, string][]>(
    Object.entries(initialData.technicalSpecs || {})
  );
  const [images, setImages] = React.useState<string[]>(initialData.images || []);
  const [equivalents, setEquivalents] = React.useState<string[]>(initialData.equivalents || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const specsObject = Object.fromEntries(specs);
    
    const product: Partial<Product> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      brand: formData.get('brand') as string,
      category: formData.get('category') as string,
      barcode: formData.get('barcode') as string,
      technicalSpecs: specsObject,
      images,
      equivalents,
      purchasePrice: {
        local: Number(formData.get('localPurchasePrice')),
        ...(formData.get('foreignPurchasePrice') ? {
          foreign: {
            amount: Number(formData.get('foreignPurchasePrice')),
            currency: formData.get('foreignPurchaseCurrency') as string
          }
        } : {})
      },
      margin: Number(formData.get('margin')),
      maxDiscount: Number(formData.get('maxDiscount')),
      price: {
        retail: Number(formData.get('retailPrice')),
        wholesale: Number(formData.get('wholesalePrice')),
        bulk: Number(formData.get('bulkPrice'))
      },
      stock: Number(formData.get('stock')),
      minStock: Number(formData.get('minStock'))
    };

    onSubmit(product);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom du Produit</label>
            <input
              type="text"
              name="name"
              defaultValue={initialData.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Marque</label>
            <input
              type="text"
              name="brand"
              defaultValue={initialData.brand}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Catégorie</label>
            <input
              type="text"
              name="category"
              defaultValue={initialData.category}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Code-barres</label>
            <input
              type="text"
              name="barcode"
              defaultValue={initialData.barcode}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              defaultValue={initialData.description}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock Actuel</label>
              <input
                type="number"
                name="stock"
                defaultValue={initialData.stock}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock Minimum</label>
              <input
                type="number"
                name="minStock"
                defaultValue={initialData.minStock}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Prix d'Achat</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prix d'Achat Local (TND)</label>
            <input
              type="number"
              name="localPurchasePrice"
              defaultValue={initialData.purchasePrice?.local}
              step="0.001"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Prix d'Achat en Devise</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                name="foreignPurchasePrice"
                defaultValue={initialData.purchasePrice?.foreign?.amount}
                step="0.001"
                placeholder="Montant"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <select
                name="foreignPurchaseCurrency"
                defaultValue={initialData.purchasePrice?.foreign?.currency}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Marges et Remises</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Marge (%)</label>
            <input
              type="number"
              name="margin"
              defaultValue={initialData.margin}
              step="0.01"
              min="0"
              max="100"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Remise Maximum (%)</label>
            <input
              type="number"
              name="maxDiscount"
              defaultValue={initialData.maxDiscount}
              step="0.01"
              min="0"
              max="100"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Prix de Vente</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prix Détail (TND)</label>
            <input
              type="number"
              name="retailPrice"
              defaultValue={initialData.price?.retail}
              step="0.001"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prix Semi-Gros (TND)</label>
            <input
              type="number"
              name="wholesalePrice"
              defaultValue={initialData.price?.wholesale}
              step="0.001"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prix Gros (TND)</label>
            <input
              type="number"
              name="bulkPrice"
              defaultValue={initialData.price?.bulk}
              step="0.001"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Spécifications Techniques</h3>
        <div className="space-y-2">
          {specs.map(([key, value], index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={key}
                onChange={(e) => {
                  const newSpecs = [...specs];
                  newSpecs[index][0] = e.target.value;
                  setSpecs(newSpecs);
                }}
                placeholder="Caractéristique"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => {
                  const newSpecs = [...specs];
                  newSpecs[index][1] = e.target.value;
                  setSpecs(newSpecs);
                }}
                placeholder="Valeur"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setSpecs(specs.filter((_, i) => i !== index))}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSpecs([...specs, ['', '']])}
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
          >
            <Plus size={16} className="mr-1" />
            Ajouter une spécification
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Images du Produit</h3>
        <div className="space-y-2">
          {images.map((url, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  const newImages = [...images];
                  newImages[index] = e.target.value;
                  setImages(newImages);
                }}
                placeholder="URL de l'image"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, i) => i !== index))}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setImages([...images, ''])}
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
          >
            <Plus size={16} className="mr-1" />
            Ajouter une image
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Produits Équivalents</h3>
        <div className="space-y-2">
          {equivalents.map((ref, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={ref}
                onChange={(e) => {
                  const newEquivalents = [...equivalents];
                  newEquivalents[index] = e.target.value;
                  setEquivalents(newEquivalents);
                }}
                placeholder="Référence du produit équivalent"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setEquivalents(equivalents.filter((_, i) => i !== index))}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setEquivalents([...equivalents, ''])}
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
          >
            <Plus size={16} className="mr-1" />
            Ajouter un équivalent
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

export default ProductForm