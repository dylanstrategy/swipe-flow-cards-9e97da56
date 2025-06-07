
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockResidents, type ResidentProfile } from '@/data/mockResidents';

// Extended ResidentProfile type to include unitType
interface ExtendedResidentProfile extends ResidentProfile {
  unitType?: string;
}

interface ResidentContextType {
  profile: ExtendedResidentProfile;
  allResidents: ExtendedResidentProfile[];
  updateProfile: (updates: Partial<ExtendedResidentProfile>) => void;
  updateResidentStatus: (residentId: string, newStatus: ResidentProfile['status']) => void;
  getResidentByUnit: (unitNumber: string) => ExtendedResidentProfile | undefined;
  getCurrentResidents: () => ExtendedResidentProfile[];
  getFutureResidents: () => ExtendedResidentProfile[];
  getVacantUnits: () => string[];
  getOccupancyRate: () => number;
  getNoticeResidents: () => ExtendedResidentProfile[];
  getAvailableUnits: () => string[];
  getPPFProjections: (timeframe: number) => {
    expectedMoveOuts: number;
    expectedMoveIns: number;
    projectedOccupancy: number;
    requiredLeases: number;
  };
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
  // Add unitType to existing residents
  const enrichedResidents: ExtendedResidentProfile[] = mockResidents.map(resident => ({
    ...resident,
    unitType: getUnitType(resident.unitNumber)
  }));

  const [allResidents, setAllResidents] = useState<ExtendedResidentProfile[]>(enrichedResidents);
  const [profile, setProfile] = useState<ExtendedResidentProfile>(enrichedResidents[0]);

  // Helper function to determine unit type based on unit number
  function getUnitType(unitNumber: string): string {
    // Simple logic to assign unit types based on unit number
    const num = parseInt(unitNumber);
    if (num % 10 <= 2) return '1BR';
    if (num % 10 <= 6) return '2BR';
    return '3BR';
  }

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('residentProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
    }
    
    const savedResidents = localStorage.getItem('allResidents');
    if (savedResidents) {
      const parsed = JSON.parse(savedResidents);
      setAllResidents(parsed);
    }
  }, []);

  const updateProfile = (updates: Partial<ExtendedResidentProfile>) => {
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    localStorage.setItem('residentProfile', JSON.stringify(updatedProfile));
  };

  const updateResidentStatus = (residentId: string, newStatus: ResidentProfile['status']) => {
    const updatedResidents = allResidents.map(resident => {
      if (resident.id === residentId) {
        return { 
          ...resident, 
          status: newStatus,
          // If moving to notice, set move out date
          moveOutDate: newStatus === 'notice' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : resident.moveOutDate
        };
      }
      return resident;
    });
    
    setAllResidents(updatedResidents);
    localStorage.setItem('allResidents', JSON.stringify(updatedResidents));
    
    console.log(`Updated resident ${residentId} status to ${newStatus}`);
    console.log('Updated residents list:', updatedResidents.filter(r => r.id === residentId));
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

  const getNoticeResidents = () => {
    return allResidents.filter(resident => resident.status === 'notice');
  };

  const getVacantUnits = () => {
    // Get all unit numbers that don't have current or future residents
    const occupiedUnits = allResidents
      .filter(resident => resident.status === 'current' || resident.status === 'future')
      .map(resident => resident.unitNumber);
    
    const totalUnits = 100;
    const vacantUnits = [];
    
    for (let i = 1; i <= totalUnits; i++) {
      const floor = Math.floor((i - 1) / 10) + 1;
      const unitOnFloor = ((i - 1) % 10) + 1;
      const unitNumber = `${floor}${unitOnFloor.toString().padStart(2, '0')}`;
      
      if (!occupiedUnits.includes(unitNumber)) {
        vacantUnits.push(unitNumber);
      }
    }
    
    return vacantUnits;
  };

  const getAvailableUnits = () => {
    // Available units are vacant units that are move-in ready
    const vacantUnits = getVacantUnits();
    // For now, assume all vacant units are available (in real app, would check maintenance status)
    return vacantUnits;
  };

  const getOccupancyRate = () => {
    const currentResidents = getCurrentResidents().length;
    const totalUnits = 100;
    return (currentResidents / totalUnits) * 100;
  };

  const getPPFProjections = (timeframeDays: number) => {
    const noticeResidents = getNoticeResidents();
    const futureResidents = getFutureResidents();
    const currentOccupancy = getOccupancyRate();
    
    // Calculate expected move-outs based on notice residents and lease expirations
    const expectedMoveOuts = noticeResidents.length + Math.floor(timeframeDays / 365 * getCurrentResidents().length * 0.25); // 25% annual turnover
    
    // Future move-ins already scheduled
    const expectedMoveIns = futureResidents.length;
    
    // Calculate net change and projected occupancy
    const netChange = expectedMoveIns - expectedMoveOuts;
    const projectedOccupancy = Math.max(0, Math.min(100, currentOccupancy + (netChange / 100) * 100));
    
    // Required leases to maintain/improve occupancy
    const targetOccupancy = 97; // Target 97% occupancy
    const currentOccupied = getCurrentResidents().length;
    const targetOccupied = Math.ceil((targetOccupancy / 100) * 100);
    const requiredLeases = Math.max(0, targetOccupied - currentOccupied - netChange);
    
    return {
      expectedMoveOuts,
      expectedMoveIns,
      projectedOccupancy: Math.round(projectedOccupancy * 10) / 10,
      requiredLeases
    };
  };

  return (
    <ResidentContext.Provider value={{ 
      profile, 
      allResidents,
      updateProfile, 
      updateResidentStatus,
      getResidentByUnit,
      getCurrentResidents,
      getFutureResidents,
      getNoticeResidents,
      getVacantUnits,
      getAvailableUnits,
      getOccupancyRate,
      getPPFProjections
    }}>
      {children}
    </ResidentContext.Provider>
  );
};

export { type ResidentProfile, type ExtendedResidentProfile };
