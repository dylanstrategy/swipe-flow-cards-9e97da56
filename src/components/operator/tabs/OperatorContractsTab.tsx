
import React from 'react';
import ContractManager from '@/components/contracts/ContractManager';

const OperatorContractsTab: React.FC = () => {
  const handleSendContract = (templateId: string, clientData: any) => {
    console.log('Contract sent:', { templateId, clientData });
    // Additional operator-specific logic can be added here
  };

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Contract & Document Management
        </h2>
        <p className="text-gray-600 mb-6">
          Manage contract templates and send documents to residents and vendors for signature.
        </p>
        
        <ContractManager onSendContract={handleSendContract} />
      </div>
    </div>
  );
};

export default OperatorContractsTab;
