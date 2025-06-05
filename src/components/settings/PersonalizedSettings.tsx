
import React, { useState } from 'react';
import ResidentIdentitySetup from '@/components/resident/ResidentIdentitySetup';

const PersonalizedSettings = () => {
  const [showIdentitySetup, setShowIdentitySetup] = useState(true);

  if (showIdentitySetup) {
    return <ResidentIdentitySetup onBack={() => setShowIdentitySetup(false)} />;
  }

  // This fallback shouldn't be reached since we're redirecting to ResidentIdentitySetup
  return null;
};

export default PersonalizedSettings;
