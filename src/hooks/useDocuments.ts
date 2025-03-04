import { useState, useCallback } from 'react';
import { Document, DocumentType, generateDocumentNumber } from '../lib/documents';
import { getDocuments, saveDocument, deleteDocument, getNextSequence } from '../lib/storage';

export function useDocuments<T extends Document>(type: DocumentType) {
  const [documents, setDocuments] = useState<T[]>(() => getDocuments<T>(type));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    try {
      setLoading(true);
      const docs = getDocuments<T>(type);
      setDocuments(docs);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, [type]);

  const create = useCallback((data: Partial<T>) => {
    try {
      setLoading(true);
      const sequence = getNextSequence(type);
      const id = generateDocumentNumber(type, sequence);
      const document = saveDocument<T>(type, { ...data, id } as T);
      setDocuments(prev => [...prev, document]);
      setError(null);
      return document;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  }, [type]);

  const update = useCallback((id: string, data: Partial<T>) => {
    try {
      setLoading(true);
      const document = saveDocument<T>(type, { ...data, id } as T);
      setDocuments(prev => prev.map(doc => doc.id === id ? document : doc));
      setError(null);
      return document;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return null;
    } finally {
      setLoading(false);
    }
  }, [type]);

  const remove = useCallback((id: string) => {
    try {
      setLoading(true);
      const success = deleteDocument(type, id);
      if (success) {
        setDocuments(prev => prev.filter(doc => doc.id !== id));
        setError(null);
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      return false;
    } finally {
      setLoading(false);
    }
  }, [type]);

  return {
    documents,
    loading,
    error,
    refresh,
    create,
    update,
    remove
  };
}