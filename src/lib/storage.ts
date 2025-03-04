import { Document, DocumentType } from './documents';

// In-memory storage until we implement Supabase
const storage: Record<string, Document[]> = {
  invoices: [],
  quotes: [],
  deliveries: [],
  credits: [],
  purchases: [],
  receipts: [],
  returns: []
};

const collectionMap: Record<DocumentType, keyof typeof storage> = {
  invoice: 'invoices',
  quote: 'quotes',
  delivery: 'deliveries',
  credit: 'credits',
  purchase: 'purchases',
  receipt: 'receipts',
  return: 'returns'
};

export const getDocuments = <T extends Document>(type: DocumentType): T[] => {
  const collection = collectionMap[type];
  return storage[collection] as T[];
};

export const getDocument = <T extends Document>(type: DocumentType, id: string): T | undefined => {
  const documents = getDocuments<T>(type);
  return documents.find(doc => doc.id === id);
};

export const saveDocument = <T extends Document>(type: DocumentType, document: T): T => {
  const collection = collectionMap[type];
  const documents = storage[collection];
  
  const index = documents.findIndex(doc => doc.id === document.id);
  if (index >= 0) {
    documents[index] = document;
  } else {
    documents.push(document);
  }
  
  return document;
};

export const deleteDocument = (type: DocumentType, id: string): boolean => {
  const collection = collectionMap[type];
  const documents = storage[collection];
  
  const index = documents.findIndex(doc => doc.id === id);
  if (index >= 0) {
    documents.splice(index, 1);
    return true;
  }
  return false;
};

export const getNextSequence = (type: DocumentType): number => {
  const documents = getDocuments(type);
  return documents.length + 1;
};