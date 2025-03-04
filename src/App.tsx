import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/dashboard';
import ProductsPage from './pages/products';
import ClientsPage from './pages/clients';
import InvoicesPage from './pages/sales/invoices';
import CreditNotesPage from './pages/sales/credits';
import DeliveryNotesPage from './pages/sales/delivery';
import SuppliersPage from './pages/suppliers';
import SalesPage from './pages/sales';
import QuotesPage from './pages/sales/quotes';
import StockPage from './pages/stock';
import ReportsPage from './pages/reports';
import SettingsPage from './pages/settings';
import PurchasesPage from './pages/purchases';
import PurchaseOrdersPage from './pages/purchases/orders';
import PurchaseReceiptsPage from './pages/purchases/receipts';
import PurchaseReturnsPage from './pages/purchases/returns';

function App() {
  return (
    <Layout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="/sales/*" element={<SalesPage />} />
        <Route path="/sales/invoices" element={<InvoicesPage />} />
        <Route path="/sales/quotes" element={<QuotesPage />} />
        <Route path="/sales/delivery" element={<DeliveryNotesPage />} />
        <Route path="/sales/credits" element={<CreditNotesPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/suppliers" element={<SuppliersPage />} />
        <Route path="/purchases/*" element={<PurchasesPage />} />
        <Route path="/purchases/orders" element={<PurchaseOrdersPage />} />
        <Route path="/purchases/receipts" element={<PurchaseReceiptsPage />} />
        <Route path="/purchases/returns" element={<PurchaseReturnsPage />} />
        <Route path="/stock" element={<StockPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
