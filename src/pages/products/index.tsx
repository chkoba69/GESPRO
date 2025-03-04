import React, { useState } from 'react';
import ProductList from '../../components/products/ProductList';
import ProductForm from '../../components/products/ProductForm';
import { Product } from '../../types';
import { Plus, X } from 'lucide-react';

const ProductsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Roulement à billes SKF 6205',
      description: 'Roulement à billes à une rangée, étanche',
      brand: 'SKF',
      category: 'Roulements',
      barcode: '7316572605825',
      technicalSpecs: {
        'Diamètre intérieur': '25mm',
        'Diamètre extérieur': '52mm',
        'Largeur': '15mm',
        'Charge dynamique': '14.8kN',
        'Vitesse limite': '32000 tr/min'
      },
      images: [
        'https://images.unsplash.com/photo-1589042573123-655c0de761fe?auto=format&fit=crop&w=300&q=80'
      ],
      equivalents: ['FAG 6205-2RSR', 'NSK 6205DDU', 'NTN 6205LLU'],
      price: {
        retail: 45.500,
        wholesale: 38.750,
        bulk: 35.000
      },
      stock: 5,
      minStock: 10,
      lastUpdated: '2024-03-15T10:30:00Z'
    }
  ]);

  const handleSave = (product: Partial<Product>) => {
    console.log('Saving product:', product);
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (productId: string) => {
    console.log('Deleting product:', productId);
  };

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
            <p className="text-gray-600">Gérez votre catalogue de produits et leurs équivalences</p>
          </div>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus size={20} className="mr-2" />
            Nouveau Produit
          </button>
        </div>

        {showForm ? (
          <div className="bg-white rounded-lg shadow p-6 relative">
            <button
              onClick={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {editingProduct ? 'Modifier le Produit' : 'Nouveau Produit'}
            </h2>
            <ProductForm
              onSubmit={handleSave}
              initialData={editingProduct || undefined}
            />
          </div>
        ) : (
          <ProductList
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
  );
};

export default ProductsPage