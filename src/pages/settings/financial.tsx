import React from 'react';
import { useFinancialSettings } from '../../hooks/useFinancialSettings';
import MarginSettings from '../../components/settings/MarginSettings';
import DiscountSettings from '../../components/settings/DiscountSettings';
import VatSettings from '../../components/settings/VatSettings';
import FiscalStampSettings from '../../components/settings/FiscalStampSettings';

const FinancialSettingsPage: React.FC = () => {
  const {
    loading,
    error,
    getProductMargins,
    saveProductMargin,
    getDiscountRules,
    saveDiscountRule,
    getVatRates,
    saveVatRate,
    getFiscalStamps,
    saveFiscalStamp
  } = useFinancialSettings();

  const [margins, setMargins] = React.useState([]);
  const [discounts, setDiscounts] = React.useState([]);
  const [vatRates, setVatRates] = React.useState([]);
  const [fiscalStamps, setFiscalStamps] = React.useState([]);

  React.useEffect(() => {
    const loadData = async () => {
      const [margins, discounts, vatRates, stamps] = await Promise.all([
        getProductMargins(),
        getDiscountRules(),
        getVatRates(),
        getFiscalStamps()
      ]);

      setMargins(margins);
      setDiscounts(discounts);
      setVatRates(vatRates);
      setFiscalStamps(stamps);
    };

    loadData();
  }, [getProductMargins, getDiscountRules, getVatRates, getFiscalStamps]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres Financiers</h1>
        <p className="text-gray-600">Gérez les marges, remises, TVA et timbres fiscaux</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section className="bg-white rounded-lg shadow p-6">
          <MarginSettings
            margins={margins}
            onSave={async (margin) => {
              await saveProductMargin(margin);
              const updatedMargins = await getProductMargins();
              setMargins(updatedMargins);
            }}
          />
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <DiscountSettings
            rules={discounts}
            onSave={async (rule) => {
              await saveDiscountRule(rule);
              const updatedDiscounts = await getDiscountRules();
              setDiscounts(updatedDiscounts);
            }}
          />
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <VatSettings
            rates={vatRates}
            onSave={async (rate) => {
              await saveVatRate(rate);
              const updatedRates = await getVatRates();
              setVatRates(updatedRates);
            }}
          />
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <FiscalStampSettings
            stamps={fiscalStamps}
            onSave={async (stamp) => {
              await saveFiscalStamp(stamp);
              const updatedStamps = await getFiscalStamps();
              setFiscalStamps(updatedStamps);
            }}
          />
        </section>
      </div>
    </div>
  );
};

export default FinancialSettingsPage;