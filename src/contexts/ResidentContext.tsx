import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockResidents, type ResidentProfile } from '@/data/mockResidents';

// Extended ResidentProfile type to include unitType
interface ExtendedResidentProfile extends ResidentProfile {
  unitType?: string;
  leaseStartDate?: string;
  moveInChecklistComplete?: boolean;
  moveOutChecklistComplete?: boolean;
  noticeToVacateSubmitted?: boolean;
  forwardingAddress?: string;
  finalInspectionComplete?: boolean;
  moveInChecklist?: {
    [key: string]: {
      completed: boolean;
      completedBy?: string;
      completedDate?: string;
    };
  };
  moveOutChecklist?: {
    [key: string]: {
      completed: boolean;
      completedBy?: string;
      completedDate?: string;
    };
  };
  balance: number; // Make this required to match ResidentProfile
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
  canMoveIn: (residentId: string) => { canMove: boolean; blockers: string[] };
  canMoveOut: (residentId: string) => { canMove: boolean; blockers: string[] };
  updateMoveInDate: (residentId: string, newDate: string) => void;
  submitNoticeToVacate: (residentId: string, data: any) => void;
  cancelMoveOut: (residentId: string) => void;
  cancelNotice: (residentId: string) => void;
  getMoveOutProgress: (residentId: string) => { completed: number; total: number; percentage: number };
  completeInspection: (residentId: string, type: 'moveIn' | 'moveOut', completedBy: string) => void;
  updateChecklistItem: (residentId: string, type: 'moveIn' | 'moveOut', itemId: string, completed: boolean, completedBy?: string) => void;
  generateMoveOutChecklist: (residentId: string) => void;
  markAsMoved: (residentId: string, type: 'in' | 'out') => { success: boolean; message: string };
  refreshResidentData: () => void;
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
  // Add unitType and move-in/out data to existing residents
  const enrichedResidents: ExtendedResidentProfile[] = mockResidents.map(resident => ({
    ...resident,
    unitType: getUnitType(resident.unitNumber),
    leaseStartDate: '2025-06-15', // Sample lease start date
    moveInChecklistComplete: resident.status === 'current',
    moveOutChecklistComplete: false,
    noticeToVacateSubmitted: resident.status === 'notice',
    forwardingAddress: resident.status === 'notice' ? '123 New Address St, New City, NY' : '',
    finalInspectionComplete: resident.status === 'current',
    moveInChecklist: {
      'sign-lease': { completed: resident.status === 'current', completedBy: 'resident', completedDate: '2025-06-01' },
      'payment': { completed: resident.status === 'current', completedBy: 'resident', completedDate: '2025-06-01' },
      'renters-insurance': { completed: resident.status === 'current', completedBy: 'resident', completedDate: '2025-06-02' },
      'book-movers': { completed: resident.status === 'current', completedBy: 'resident', completedDate: '2025-06-03' },
      'utilities': { completed: resident.status === 'current', completedBy: 'resident', completedDate: '2025-06-04' },
      'inspection': { completed: resident.status === 'current', completedBy: 'maintenance', completedDate: '2025-06-14' },
      'community-guidelines': { completed: resident.status === 'current', completedBy: 'resident', completedDate: '2025-06-14' },
      'move-in': { completed: resident.status === 'current', completedBy: 'leasing', completedDate: '2025-06-15' }
    },
    moveOutChecklist: resident.status === 'notice' ? {
      'notice-to-vacate': { completed: true, completedBy: 'resident', completedDate: new Date().toISOString().split('T')[0] },
      'forwarding-address': { completed: true, completedBy: 'resident', completedDate: new Date().toISOString().split('T')[0] },
      'final-inspection': { completed: false },
      'exit-survey': { completed: false },
      'key-return': { completed: false },
      'final-balance': { completed: false },
      'deposit-release': { completed: false },
      'move-out-confirmation': { completed: false }
    } : undefined
  }));

  const [allResidents, setAllResidents] = useState<ExtendedResidentProfile[]>(enrichedResidents);
  const [profile, setProfile] = useState<ExtendedResidentProfile>(enrichedResidents[0]);

  // Helper function to determine unit type based on unit number
  function getUnitType(unitNumber: string): string {
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

  // Helper function to update both profile and allResidents consistently
  const updateResidentData = (updatedResidents: ExtendedResidentProfile[]) => {
    setAllResidents(updatedResidents);
    localStorage.setItem('allResidents', JSON.stringify(updatedResidents));
    
    // Find and update the current profile if it's in the updated residents
    const updatedProfile = updatedResidents.find(r => r.id === profile.id);
    if (updatedProfile) {
      setProfile(updatedProfile);
      localStorage.setItem('residentProfile', JSON.stringify(updatedProfile));
    }
    
    console.log('Resident data updated across entire system');
  };

  const updateProfile = (updates: Partial<ExtendedResidentProfile>) => {
    const updatedProfile = { ...profile, ...updates };
    setProfile(updatedProfile);
    localStorage.setItem('residentProfile', JSON.stringify(updatedProfile));
    
    // Also update the resident in allResidents array
    const updatedResidents = allResidents.map(resident => 
      resident.id === updatedProfile.id ? updatedProfile : resident
    );
    setAllResidents(updatedResidents);
    localStorage.setItem('allResidents', JSON.stringify(updatedResidents));
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
    
    updateResidentData(updatedResidents);
    console.log(`Updated resident ${residentId} status to ${newStatus}`);
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

  const canMoveIn = (residentId: string) => {
    const resident = allResidents.find(r => r.id === residentId);
    if (!resident) return { canMove: false, blockers: ['Resident not found'] };

    const blockers: string[] = [];
    const today = new Date();
    const leaseStart = new Date(resident.leaseStartDate || '');

    // Check if lease start date is on or before today
    if (leaseStart > today) {
      blockers.push('Lease start date has not arrived yet');
    }

    // Check if balance is fully paid
    if (resident.balance > 0) {
      blockers.push('Outstanding balance must be paid in full');
    }

    // Check if move-in checklist is 100% complete
    if (!resident.moveInChecklistComplete) {
      const checklist = resident.moveInChecklist;
      if (checklist) {
        const incompleteItems = Object.entries(checklist)
          .filter(([_, item]) => !item.completed)
          .map(([key, _]) => key);
        
        if (incompleteItems.length > 0) {
          blockers.push('Move-in checklist must be 100% complete');
        }
      } else {
        blockers.push('Move-in checklist must be 100% complete');
      }
    }

    return { canMove: blockers.length === 0, blockers };
  };

  const canMoveOut = (residentId: string) => {
    const resident = allResidents.find(r => r.id === residentId);
    if (!resident) return { canMove: false, blockers: ['Resident not found'] };

    const blockers: string[] = [];

    // Check if Notice to Vacate is submitted
    if (!resident.noticeToVacateSubmitted) {
      blockers.push('Signed Notice to Vacate must be submitted');
    }

    // Check if forwarding address is provided
    if (!resident.forwardingAddress || resident.forwardingAddress.trim() === '') {
      blockers.push('Forwarding address must be provided');
    }

    // Check if final balance is paid
    if (resident.balance > 0) {
      blockers.push('Final balance must be paid in full');
    }

    // Check if move-out checklist is complete
    if (!resident.moveOutChecklistComplete) {
      const checklist = resident.moveOutChecklist;
      if (checklist) {
        const incompleteItems = Object.entries(checklist)
          .filter(([_, item]) => !item.completed)
          .map(([key, _]) => key);
        
        if (incompleteItems.length > 0) {
          blockers.push('Move-out checklist must be 100% complete');
        }
      } else {
        blockers.push('Move-out checklist must be created and completed');
      }
    }

    // Check if final inspection is complete
    if (!resident.finalInspectionComplete) {
      blockers.push('Final inspection must be completed');
    }

    return { canMove: blockers.length === 0, blockers };
  };

  const updateMoveInDate = (residentId: string, newDate: string) => {
    const updatedResidents = allResidents.map(resident => {
      if (resident.id === residentId) {
        return {
          ...resident,
          leaseStartDate: newDate,
          // Reset required items when move-in date changes
          moveInChecklist: {
            ...resident.moveInChecklist,
            'sign-lease': { completed: false },
            'payment': { completed: false },
            'renters-insurance': { completed: false }
          },
          moveInChecklistComplete: false,
          balance: 1550 // Reset balance when date changes
        };
      }
      return resident;
    });

    updateResidentData(updatedResidents);
    console.log(`Move-in date updated for resident ${residentId}. Lease re-signing and balance recalculation required.`);
  };

  const submitNoticeToVacate = (residentId: string, data: any) => {
    const updatedResidents = allResidents.map(resident => {
      if (resident.id === residentId) {
        return {
          ...resident,
          status: 'notice' as ResidentProfile['status'],
          noticeToVacateSubmitted: true,
          moveOutDate: data.moveOutDate,
          forwardingAddress: data.forwardingAddress || '',
          moveOutChecklist: {
            'notice-to-vacate': { completed: true, completedBy: 'resident', completedDate: new Date().toISOString().split('T')[0] },
            'forwarding-address': { completed: !!data.forwardingAddress, completedBy: 'resident', completedDate: data.forwardingAddress ? new Date().toISOString().split('T')[0] : undefined },
            'final-inspection': { completed: false },
            'exit-survey': { completed: false },
            'key-return': { completed: false },
            'final-balance': { completed: false },
            'deposit-release': { completed: false },
            'move-out-confirmation': { completed: false }
          }
        };
      }
      return resident;
    });
    
    updateResidentData(updatedResidents);
    console.log(`Notice to Vacate submitted for resident ${residentId}`);
  };

  const cancelMoveOut = (residentId: string) => {
    const updatedResidents = allResidents.map(resident => {
      if (resident.id === residentId) {
        return {
          ...resident,
          status: 'current' as ResidentProfile['status'],
          noticeToVacateSubmitted: false,
          moveOutDate: undefined,
          forwardingAddress: '',
          moveOutChecklist: undefined,
          moveOutChecklistComplete: false
        };
      }
      return resident;
    });
    
    updateResidentData(updatedResidents);
    console.log(`Move-out cancelled for resident ${residentId}`);
  };

  const cancelNotice = (residentId: string) => {
    const updatedResidents = allResidents.map(resident => {
      if (resident.id === residentId) {
        return {
          ...resident,
          status: 'current' as ResidentProfile['status'],
          noticeToVacateSubmitted: false,
          moveOutDate: undefined,
          forwardingAddress: '',
          moveOutChecklist: undefined,
          moveOutChecklistComplete: false
        };
      }
      return resident;
    });
    
    updateResidentData(updatedResidents);
    console.log(`Notice to Vacate cancelled for resident ${residentId}`);
  };

  const getMoveOutProgress = (residentId: string) => {
    const resident = allResidents.find(r => r.id === residentId);
    if (!resident || !resident.moveOutChecklist) {
      return { completed: 0, total: 0, percentage: 0 };
    }

    const checklistItems = Object.values(resident.moveOutChecklist);
    const completed = checklistItems.filter(item => item.completed).length;
    const total = checklistItems.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  };

  const generateMoveOutChecklist = (residentId: string) => {
    const updatedResidents = allResidents.map(resident => {
      if (resident.id === residentId && !resident.moveOutChecklist) {
        return {
          ...resident,
          moveOutChecklist: {
            'notice-to-vacate': { completed: resident.noticeToVacateSubmitted || false },
            'forwarding-address': { completed: !!resident.forwardingAddress },
            'final-inspection': { completed: false },
            'exit-survey': { completed: false },
            'key-return': { completed: false },
            'final-balance': { completed: false },
            'deposit-release': { completed: false },
            'move-out-confirmation': { completed: false }
          }
        };
      }
      return resident;
    });

    updateResidentData(updatedResidents);
  };

  const completeInspection = (residentId: string, type: 'moveIn' | 'moveOut', completedBy: string) => {
    const updatedResidents = allResidents.map(resident => {
      if (resident.id === residentId) {
        const updates: any = {
          finalInspectionComplete: true
        };

        if (type === 'moveIn' && resident.moveInChecklist) {
          updates.moveInChecklist = {
            ...resident.moveInChecklist,
            'inspection': { completed: true, completedBy, completedDate: new Date().toISOString().split('T')[0] }
          };
        } else if (type === 'moveOut' && resident.moveOutChecklist) {
          updates.moveOutChecklist = {
            ...resident.moveOutChecklist,
            'final-inspection': { completed: true, completedBy, completedDate: new Date().toISOString().split('T')[0] }
          };
        }

        return { ...resident, ...updates };
      }
      return resident;
    });

    updateResidentData(updatedResidents);
    console.log(`${type} inspection completed for resident ${residentId} by ${completedBy}`);
  };

  const updateChecklistItem = (residentId: string, type: 'moveIn' | 'moveOut', itemId: string, completed: boolean, completedBy?: string) => {
    const updatedResidents = allResidents.map(resident => {
      if (resident.id === residentId) {
        const checklistKey = type === 'moveIn' ? 'moveInChecklist' : 'moveOutChecklist';
        const currentChecklist = resident[checklistKey];

        if (currentChecklist) {
          const updatedChecklist = {
            ...currentChecklist,
            [itemId]: {
              completed,
              completedBy: completed ? (completedBy || 'system') : undefined,
              completedDate: completed ? new Date().toISOString().split('T')[0] : undefined
            }
          };

          // Check if all items are complete
          const allComplete = Object.values(updatedChecklist).every(item => item.completed);
          const completeKey = type === 'moveIn' ? 'moveInChecklistComplete' : 'moveOutChecklistComplete';

          return {
            ...resident,
            [checklistKey]: updatedChecklist,
            [completeKey]: allComplete
          };
        }
      }
      return resident;
    });

    updateResidentData(updatedResidents);
  };

  const markAsMoved = (residentId: string, type: 'in' | 'out') => {
    const canMoveCheck = type === 'in' ? canMoveIn(residentId) : canMoveOut(residentId);
    
    if (!canMoveCheck.canMove) {
      return {
        success: false,
        message: "Move-in cannot be completed until all required steps are fulfilled and the lease has begun."
      };
    }

    const updatedResidents = allResidents.map(resident => {
      if (resident.id === residentId) {
        return {
          ...resident,
          status: type === 'in' ? 'current' : 'moved_out' as ResidentProfile['status']
        };
      }
      return resident;
    });

    updateResidentData(updatedResidents);

    return {
      success: true,
      message: `Resident successfully marked as moved ${type}`
    };
  };

  const refreshResidentData = () => {
    // Force a re-render by updating the state
    const currentResidents = [...allResidents];
    updateResidentData(currentResidents);
    console.log('Resident data refreshed across entire system');
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
      getPPFProjections,
      canMoveIn,
      canMoveOut,
      updateMoveInDate,
      submitNoticeToVacate,
      cancelMoveOut,
      cancelNotice,
      getMoveOutProgress,
      completeInspection,
      updateChecklistItem,
      generateMoveOutChecklist,
      markAsMoved,
      refreshResidentData
    }}>
      {children}
    </ResidentContext.Provider>
  );
};

export { type ResidentProfile, type ExtendedResidentProfile };
