
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ResidentProfile {
  id: string;
  fullName: string;
  preferredName: string;
  email: string;
  phone: string;
  unitNumber: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface ResidentContextType {
  profile: ResidentProfile;
  updateProfile: (updates: Partial<ResidentProfile>) => void;
}

const ResidentContext = createContext<ResidentContextType | undefined>(undefined);

export const useResident = () => {
  const context = useContext(ResidentContext);
  if (!context) {
    throw new Error('useResident must be used within a ResidentProvider');
  }
  return context;
};

export const ResidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ResidentProfile>({
    id: '1',
    fullName: 'John Doe',
    preferredName: 'John',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    unitNumber: '204',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '(555) 987-6543',
      relationship: 'Spouse'
    }
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('residentProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const updateProfile = (updates: Partial<ResidentProfile>) => {
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    localStorage.setItem('residentProfile', JSON.stringify(updatedProfile));
  };

  return (
    <ResidentContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ResidentContext.Provider>
  );
};
