export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  barcode?: string;
  technicalSpecs: Record<string, string>;
  images: string[];
  equivalents: string[];
  price: {
    retail: number;
    wholesale: number;
    bulk: number;
  };
  stock: number;
  minStock: number;
  lastUpdated: string;
}

export interface Supplier {
  id: string;
  name: string;
  type: 'manufacturer' | 'distributor' | 'importer';
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  taxInfo: {
    vatNumber: string;
    registrationNumber: string;
  };
  paymentTerms: {
    days: number;
    method: 'bank_transfer' | 'check' | 'cash';
  };
  brands: string[];
  rating: number;
  status: 'active' | 'inactive';
  lastOrder: string;
}

export interface Client {
  id: string;
  name: string;
  type: 'retail' | 'wholesale' | 'bulk';
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  taxInfo: {
    vatNumber: string;
    registrationNumber: string;
  };
  priceLevel: 'retail' | 'wholesale' | 'bulk';
  creditLimit: number;
  paymentTerms: number;
}

export interface Transaction {
  id: string;
  clientId: string;
  date: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    discountType: 'percentage' | 'amount';
    grossAmount: number;
    netAmount: number;
    vatAmount: number;
    total: number;
  }[];
  subtotal: number;
  vat: number;
  fiscalStamp: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: 'cib' | 'edinar' | 'cash' | 'credit';
}

export interface Quote {
  id: string;
  clientId: string;
  date: string;
  validUntil: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  vat: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  notes?: string;
}

export interface DeliveryNote {
  id: string;
  transactionId?: string;
  clientId: string;
  date: string;
  items: {
    productId: string;
    quantity: number;
  }[];
  status: 'pending' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  notes?: string;
  signedBy?: string;
  deliveryDate?: string;
}

export interface CreditNote {
  id: string;
  originalTransactionId: string;
  clientId: string;
  date: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    total: number;
    reason: string;
  }[];
  subtotal: number;
  vat: number;
  total: number;
  status: 'pending' | 'processed' | 'cancelled';
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  type: 'local' | 'international';
  date: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    total: number;
    currency?: string;
    exchangeRate?: number;
  }[];
  subtotal: number;
  vat: number;
  total: number;
  currency: string;
  exchangeRate: number;
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  notes?: string;
  expectedDeliveryDate?: string;
  // International purchase specific fields
  proformaInvoiceNumber?: string;
  incoterm?: string;
  customsDeclarationNumber?: string;
  shippingMethod?: string;
  estimatedArrivalDate?: string;
  documentsReceived?: {
    proformaInvoice?: boolean;
    billOfLading?: boolean;
    certificate?: boolean;
    packingList?: boolean;
  };
}

export interface PurchaseReceipt {
  id: string;
  purchaseOrderId: string;
  supplierId: string;
  type: 'local' | 'international';
  date: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    total: number;
    currency?: string;
    exchangeRate?: number;
  }[];
  subtotal: number;
  vat: number;
  total: number;
  currency: string;
  exchangeRate: number;
  status: 'pending' | 'completed' | 'cancelled';
  paymentMethod: 'bank_transfer' | 'check' | 'cash';
  notes?: string;
  // International purchase specific fields
  customsClearanceDate?: string;
  customsCharges?: number;
  shippingCharges?: number;
  otherCharges?: number;
  totalLandedCost?: number;
}

export interface PurchaseReturn {
  id: string;
  originalReceiptId: string;
  supplierId: string;
  type: 'local' | 'international';
  date: string;
  items: {
    productId: string;
    quantity: number;
    unitPrice: number;
    total: number;
    currency?: string;
    exchangeRate?: number;
    reason: string;
  }[];
  subtotal: number;
  vat: number;
  total: number;
  currency: string;
  exchangeRate: number;
  status: 'pending' | 'processed' | 'cancelled';
  notes?: string;
}

export interface SalesReport {
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalSales: number;
    totalVat: number;
    totalCredits: number;
    netSales: number;
  };
  bySalesperson: {
    userId: string;
    name: string;
    transactions: number;
    amount: number;
    commission?: number;
  }[];
  byProduct: {
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
    profit: number;
  }[];
  byClient: {
    clientId: string;
    name: string;
    transactions: number;
    amount: number;
  }[];
}