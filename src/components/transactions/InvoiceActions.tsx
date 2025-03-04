import React from 'react';
import { Download, Printer, Send, Share2 } from 'lucide-react';

interface InvoiceActionsProps {
  onDownload: () => void;
  onPrint: () => void;
  onSend: () => void;
  onShare: () => void;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  onDownload,
  onPrint,
  onSend,
  onShare
}) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={onDownload}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Download size={16} className="mr-2" />
        Télécharger
      </button>
      
      <button
        onClick={onPrint}
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

export default InvoiceActions;