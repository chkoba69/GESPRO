import { Transaction, Quote, DeliveryNote, CreditNote, PurchaseOrder, PurchaseReceipt, PurchaseReturn } from '../types';

export type DocumentType = 
  | 'invoice' 
  | 'quote' 
  | 'delivery' 
  | 'credit'
  | 'purchase'
  | 'receipt'
  | 'return';

export type Document = 
  | Transaction 
  | Quote 
  | DeliveryNote 
  | CreditNote
  | PurchaseOrder
  | PurchaseReceipt
  | PurchaseReturn;

export const getDocumentPrefix = (type: DocumentType): string => {
  const prefixes: Record<DocumentType, string> = {
    invoice: 'FAC',
    quote: 'DEV',
    delivery: 'BL',
    credit: 'AV',
    purchase: 'BC',
    receipt: 'BR',
    return: 'RET'
  };
  return prefixes[type];
};

export const generateDocumentNumber = (type: DocumentType, sequence: number): string => {
  const prefix = getDocumentPrefix(type);
  const year = new Date().getFullYear();
  const paddedSequence = String(sequence).padStart(4, '0');
  return `${prefix}${year}-${paddedSequence}`;
};

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('fr-TN', {
    style: 'currency',
    currency: 'TND'
  });
};

export const calculateTotals = (items: any[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.netAmount, 0);
  const vat = items.reduce((sum, item) => sum + item.vat, 0);
  const fiscalStamp = 1.000; // Valeur par défaut du timbre fiscal
  const total = subtotal + vat + fiscalStamp;

  return {
    subtotal,
    vat,
    fiscalStamp,
    total
  };
};