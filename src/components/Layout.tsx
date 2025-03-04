import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, Settings, LogOut, Factory, DollarSign, ShoppingCart, BarChart3, Boxes } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-indigo-700 text-white">
        <div className="p-4">
          <h1 className="text-2xl font-bold">GestionPro</h1>
          <p className="text-sm text-indigo-200">Gestion Commerciale</p>
        </div>
        
        <nav className="mt-8">
          <NavItem icon={<LayoutDashboard />} label="Tableau de Bord" to="/" />
          <NavItem icon={<DollarSign />} label="Ventes" to="/sales" />
          <NavItem icon={<ShoppingCart />} label="Achats" to="/purchases" />
          <NavItem icon={<Package />} label="Produits" to="/products" />
          <NavItem icon={<Factory />} label="Fournisseurs" to="/suppliers" />
          <NavItem icon={<Users />} label="Clients" to="/clients" />
          <NavItem icon={<Boxes />} label="Stocks" to="/stock" />
          <NavItem icon={<BarChart3 />} label="Rapports" to="/reports" />
          <NavItem icon={<Settings />} label="Paramètres" to="/settings" />
          
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <button className="flex items-center space-x-2 text-indigo-200 hover:text-white w-full px-4 py-2 rounded transition-colors">
              <LogOut size={20} />
              <span>Déconnexion</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
};

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  to: string;
}> = ({ icon, label, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
        isActive
          ? 'text-white bg-indigo-600'
          : 'text-indigo-200 hover:text-white hover:bg-indigo-600'
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, { size: 20 })}
      <span>{label}</span>
    </Link>
  );
};


export default Layout