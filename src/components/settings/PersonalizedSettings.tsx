
import React, { useState } from 'react';
import ResidentIdentitySetup from '@/components/resident/ResidentIdentitySetup';

interface PersonalizedSettingsProps {
  onClose?: () => void;
  userRole?: string;
}

const PersonalizedSettings = ({ onClose }: PersonalizedSettingsProps) => {
  const [showIdentitySetup, setShowIdentitySetup] = useState(true);

  const handleBack = () => {
    setShowIdentitySetup(false);
    if (onClose) {
      onClose();
    }
  };

  if (showIdentitySetup) {
    return <ResidentIdentitySetup onBack={handleBack} />;
  }

  // This fallback shouldn't be reached since we're redirecting to ResidentIdentitySetup
  return null;
};

export default PersonalizedSettings;
