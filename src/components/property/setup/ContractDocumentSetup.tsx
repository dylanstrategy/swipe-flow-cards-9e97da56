
import React from 'react';
import ContractManager from '@/components/contracts/ContractManager';

interface ContractDocumentSetupProps {
  onBack: () => void;
}

const ContractDocumentSetup: React.FC<ContractDocumentSetupProps> = ({ onBack }) => {
  const handleSendContract = (templateId: string, clientData: any) => {
    console.log('Contract template configured:', { templateId, clientData });
    // This is just template management - actual sending happens through schedule menu
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Contract & Document Templates</h1>
          <p className="text-sm text-gray-600">
            Manage contract templates and document configurations. Send documents through the Schedule menu.
          </p>
        </div>
      </div>
      
      <ContractManager onSendContract={handleSendContract} />
    </div>
  );
};

export default ContractDocumentSetup;
