
import React from 'react';
import ResidentIdentitySetup from '@/components/resident/ResidentIdentitySetup';

interface PersonalizedSettingsProps {
  onClose?: () => void;
  userRole?: string;
}

const PersonalizedSettings = ({ onClose }: PersonalizedSettingsProps) => {
  const handleBack = () => {
    if (onClose) {
      onClose();
    }
  };

  return <ResidentIdentitySetup onBack={handleBack} />;
};

export default PersonalizedSettings;
