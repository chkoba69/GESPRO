import React from 'react';
import { Download, Printer, Send, Share2 } from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import { DocumentType, getDocumentPrefix } from '../../lib/documents';

const getDocumentTitle = (documentType: DocumentType, documentId: string) => {
  const prefix = getDocumentPrefix(documentType);
  return `${prefix}-${documentId}.pdf`;
};

interface DocumentActionsProps {
  documentRef: React.RefObject<HTMLDivElement>;
  documentType: DocumentType;
  documentId: string;
  onSend: () => void;
  onShare: () => void;
}

const DocumentActions: React.FC<DocumentActionsProps> = ({
  documentRef,
  documentType,
  documentId,
  onSend,
  onShare
}) => {
  const { toPDF, targetRef } = usePDF({
    filename: getDocumentTitle(documentType, documentId),
    page: { 
      margin: 20,
      format: 'a4'
    }
  });

  const handlePrint = () => {
    if (documentRef.current) {
      const content = documentRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${getDocumentTitle(documentType, documentId)}</title>
              <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
              <style>
                @media print {
                  body { margin: 20mm; }
                  @page { size: A4; margin: 20mm; }
                }
              </style>
            </head>
            <body>
              ${content}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => toPDF()}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Download size={16} className="mr-2" />
        Télécharger
      </button>
      
      <button
        onClick={handlePrint}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Printer size={16} className="mr-2" />
        Imprimer
      </button>
      
      <button
        onClick={onSend}
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Send size={16} className="mr-2" />
        Envoyer
      </button>
      
      <button
        onClick={onShare}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Share2 size={16} className="mr-2" />
        Partager
      </button>
    </div>
  );
};

export default DocumentActions;