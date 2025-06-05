
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockResidents, type ResidentProfile } from '@/data/mockResidents';

interface ResidentContextType {
  profile: ResidentProfile;
  allResidents: ResidentProfile[];
  updateProfile: (updates: Partial<ResidentProfile>) => void;
  getResidentByUnit: (unitNumber: string) => ResidentProfile | undefined;
  getCurrentResidents: () => ResidentProfile[];
  getFutureResidents: () => ResidentProfile[];
  getVacantUnits: () => string[];
  getOccupancyRate: () => number;
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
  const [allResidents, setAllResidents] = useState<ResidentProfile[]>(mockResidents);
  const [profile, setProfile] = useState<ResidentProfile>(mockResidents[0]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('residentProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
    }
  }, []);

  const updateProfile = (updates: Partial<ResidentProfile>) => {
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    localStorage.setItem('residentProfile', JSON.stringify(updatedProfile));
  };

  const getResidentByUnit = (unitNumber: string) => {
    return allResidents.find(resident => resident.unitNumber === unitNumber);
  };

  const getCurrentResidents = () => {
    return allResidents.filter(resident => resident.status === 'current');
  };

  const getFutureResidents = () => {
    return allResidents.filter(resident => resident.status === 'future');
  };

  const getVacantUnits = () => {
    // Total units (100) minus occupied units
    const occupiedUnits = allResidents.length;
    const totalUnits = 100;
    const vacantCount = totalUnits - occupiedUnits;
    
    // Generate vacant unit numbers
    const vacantUnits = [];
    for (let i = occupiedUnits + 1; i <= totalUnits; i++) {
      const floor = Math.floor((i - 1) / 10) + 1;
      const unitOnFloor = ((i - 1) % 10) + 1;
      const unitNumber = `${floor}${unitOnFloor.toString().padStart(2, '0')}`;
      vacantUnits.push(unitNumber);
    }
    
    return vacantUnits.slice(0, 5); // Return only 5 vacant units as specified
  };

  const getOccupancyRate = () => {
    const currentResidents = getCurrentResidents().length;
    const totalUnits = 100;
    return (currentResidents / totalUnits) * 100;
  };

  return (
    <ResidentContext.Provider value={{ 
      profile, 
      allResidents,
      updateProfile, 
      getResidentByUnit,
      getCurrentResidents,
      getFutureResidents,
      getVacantUnits,
      getOccupancyRate
    }}>
      {children}
    </ResidentContext.Provider>
  );
};

export { type ResidentProfile };
