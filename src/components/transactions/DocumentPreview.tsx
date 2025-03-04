import React from 'react';
import { Document, DocumentType, formatCurrency } from '../../lib/documents';
import { FileText, Building2, Phone, Mail, Globe } from 'lucide-react';

interface DocumentPreviewProps {
  document: Document;
  documentType: DocumentType;
  companyInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    vatNumber: string;
    logo?: string;
  };
}

interface DocumentPreviewProps {
  document: Document;
  documentType: DocumentType;
  companyInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    vatNumber: string;
    logo?: string;
  };
}

const formatAmount = (amount: number | undefined): string => {
  return amount ? formatCurrency(amount) : '0.000 TND';
};

const defaultCompanyInfo = {
    name: 'GestionPro SARL',
    address: 'Rue de la République, 1002 Tunis',
    phone: '+216 71 234 567',
    email: 'contact@gestionpro.tn',
    website: 'www.gestionpro.tn',
    vatNumber: '1234567/A/B/000',
    logo: 'https://images.unsplash.com/photo-1563906267088-b029e7101114?auto=format&fit=crop&w=150&q=80'
};

const DocumentPreview = React.forwardRef<HTMLDivElement, DocumentPreviewProps>((props, ref) => {
  const { document, documentType, companyInfo = defaultCompanyInfo } = props;

  const getDocumentTitle = () => {
    switch (documentType) {
      case 'invoice': return 'FACTURE';
      case 'quote': return 'DEVIS';
      case 'delivery': return 'BON DE LIVRAISON';
      case 'credit': return 'AVOIR';
    }
  };

  const getDocumentPrefix = () => {
    switch (documentType) {
      case 'invoice': return 'FAC';
      case 'quote': return 'DEV';
      case 'delivery': return 'BL';
      case 'credit': return 'AV';
    }
  };

  return (
    <div ref={ref} className="bg-white p-8 shadow-lg rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-4">
          {companyInfo.logo && (
            <img
              src={companyInfo.logo}
              alt={companyInfo.name}
              className="h-16 w-16 object-contain"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{companyInfo.name}</h1>
            <div className="mt-2 text-sm text-gray-600 space-y-1">
              <div className="flex items-center">
                <Building2 size={16} className="mr-2" />
                {companyInfo.address}
              </div>
              <div className="flex items-center">
                <Phone size={16} className="mr-2" />
                {companyInfo.phone}
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2" />
                {companyInfo.email}
              </div>
              <div className="flex items-center">
                <Globe size={16} className="mr-2" />
                {companyInfo.website}
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end">
            <FileText className="h-8 w-8 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">{getDocumentTitle()}</h2>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <div>N° {getDocumentPrefix()}-{document.id}</div>
            <div>Date: {new Date(document.date).toLocaleDateString('fr-TN')}</div>
            <div>M.F.: {companyInfo.vatNumber}</div>
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div className="mt-8 border-t border-gray-200 pt-4">
        <h3 className="text-lg font-medium text-gray-900">Client</h3>
        <div className="mt-2 text-sm text-gray-600">
          <div>SARL TechnoPlus</div>
          <div>Rue de l'Usine, 2035 Tunis</div>
          <div>M.F.: 1234567/A/P/000</div>
        </div>
      </div>

      {/* Items */}
      <div className="mt-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 text-left text-sm font-semibold text-gray-900">Description</th>
              <th className="py-3 text-right text-sm font-semibold text-gray-900">Quantité</th>
              <th className="py-3 text-right text-sm font-semibold text-gray-900">Prix Unit.</th>
              <th className="py-3 text-right text-sm font-semibold text-gray-900">Remise</th>
              <th className="py-3 text-right text-sm font-semibold text-gray-900">Net HT</th>
              {documentType === 'invoice' && (
                <>
                  <th className="py-3 text-right text-sm font-semibold text-gray-900">Remise</th>
                  <th className="py-3 text-right text-sm font-semibold text-gray-900">Net HT</th>
                  <th className="py-3 text-right text-sm font-semibold text-gray-900">TVA</th>
                </>
              )}
              <th className="py-3 text-right text-sm font-semibold text-gray-900">Total</th>
            </tr>
          </thead>
          <tbody>
            {'items' in document && document.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-4 text-sm text-gray-600">Roulement à billes SKF 6205</td>
                <td className="py-4 text-right text-sm text-gray-600">{item.quantity}</td>
                <td className="py-4 text-right text-sm text-gray-600">
                  {formatAmount(item.unitPrice)}
                </td>
                <td className="py-4 text-right text-sm text-gray-600">
                  {item.discount ? (
                    item.discountType === 'percentage' 
                    ? `${item.discount}%` 
                    : formatAmount(item.discount)
                  ) : '-'}
                </td>
                <td className="py-4 text-right text-sm text-gray-900">
                  {formatAmount(item.netAmount)}
                </td>
              {documentType === 'invoice' && (
                <>
                  <td className="py-4 text-right text-sm text-gray-600">
                    {'discount' in item && item.discount ? (
                      item.discountType === 'percentage' 
                      ? `${item.discount}%` 
                      : formatAmount(item.discount)
                    ) : '-'}
                  </td>
                  <td className="py-4 text-right text-sm text-gray-900">
                    {formatAmount('netAmount' in item ? item.netAmount : undefined)}
                  </td>
                  <td className="py-4 text-right text-sm text-gray-600">
                    {formatAmount('vat' in item ? item.vat : undefined)}
                  </td>
                </>
              )}
                <td className="py-4 text-right text-sm text-gray-900">
                  {formatAmount(item.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {'subtotal' in document && 'vat' in document && 'total' in document && (
        <div className="mt-8 border-t border-gray-200 pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <div>Sous-total</div>
                <div>{formatAmount(document.subtotal)}</div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <div>TVA (19%)</div>
                <div>{formatAmount(document.vat)}</div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <div>Timbre Fiscal</div>
                <div>{formatAmount(document.fiscalStamp || 1.000)}</div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <div>Timbre Fiscal</div>
                <div>{formatAmount('fiscalStamp' in document ? document.fiscalStamp : undefined)}</div>
              </div>
              <div className="flex justify-between text-base font-semibold text-gray-900 border-t border-gray-200 pt-2">
                <div>Total</div>
                <div>{formatAmount(document.total)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 border-t border-gray-200 pt-4 text-sm text-gray-600">
        <div className="text-center">
          <p>Merci de votre confiance</p>
          <p className="mt-1">
            Pour toute question concernant ce document, veuillez nous contacter à{' '}
            <a href={`mailto:${companyInfo.email}`} className="text-indigo-600">
              {companyInfo.email}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
});

DocumentPreview.displayName = 'DocumentPreview';

export default DocumentPreview;