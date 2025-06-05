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
  forceStateUpdate: () => void;
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
  const [forceUpdateCounter, setForceUpdateCounter] = useState(0);

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

  // ENHANCED CENTRALIZED STATE UPDATE MECHANISM - This ensures ALL state changes go through here
  const updateResidentData = (updatedResidents: ExtendedResidentProfile[], skipProfileUpdate = false) => {
    console.log('🔄 UPDATING RESIDENT DATA - Central state update triggered');
    console.log('📊 Updated residents count:', updatedResidents.length);
    
    // Update allResidents state and localStorage IMMEDIATELY
    setAllResidents(updatedResidents);
    localStorage.setItem('allResidents', JSON.stringify(updatedResidents));
    console.log('✅ AllResidents updated in state and localStorage');
    
    // Update profile if it exists in the updated residents and not skipping
    if (!skipProfileUpdate) {
      const updatedProfile = updatedResidents.find(r => r.id === profile.id);
      if (updatedProfile) {
        setProfile(updatedProfile);
        localStorage.setItem('residentProfile', JSON.stringify(updatedProfile));
        console.log('✅ Profile updated - NEW STATUS:', updatedProfile.status);
      }
    }
    
    // Force a re-render by updating the counter
    setForceUpdateCounter(prev => {
      const newCounter = prev + 1;
      console.log('🚀 Force update counter:', newCounter);
      return newCounter;
    });
    
    // Additional force update after a small delay to ensure all components refresh
    setTimeout(() => {
      setForceUpdateCounter(prev => prev + 1);
      console.log('🔄 Secondary force update triggered for complete sync');
    }, 100);
    
    console.log('🚀 State update completed - all components should refresh now');
  };

  // Force state update function to trigger re-renders across all components
  const forceStateUpdate = () => {
    console.log('💪 FORCE STATE UPDATE triggered');
    setForceUpdateCounter(prev => prev + 1);
    
    // Refresh from localStorage to ensure consistency
    const savedResidents = localStorage.getItem('allResidents');
    const savedProfile = localStorage.getItem('residentProfile');
    
    if (savedResidents) {
      const parsedResidents = JSON.parse(savedResidents);
      setAllResidents(parsedResidents);
      console.log('🔄 AllResidents refreshed from localStorage');
    }
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      console.log('🔄 Profile refreshed from localStorage - STATUS:', parsedProfile.status);
    }
  };

  const updateProfile = (updates: Partial<ExtendedResidentProfile>) => {
    console.log('📝 Updating profile for:', profile.id, updates);
    const updatedProfile = { ...profile, ...updates };
    
    // Update the resident in allResidents array
    const updatedResidents = allResidents.map(resident => 
      resident.id === updatedProfile.id ? updatedProfile : resident
    );
    
    // Use centralized update mechanism
    updateResidentData(updatedResidents);
  };

  const updateResidentStatus = (residentId: string, newStatus: ResidentProfile['status']) => {
    console.log(`🏠 Updating resident ${residentId} status to ${newStatus}`);
    
    const updatedResidents = allResidents.map(resident => {
      if (resident.id === residentId) {
        const updated = { 
          ...resident, 
          status: newStatus,
          moveOutDate: newStatus === 'notice' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : resident.moveOutDate,
          noticeToVacateSubmitted: newStatus === 'notice' ? true : resident.noticeToVacateSubmitted
        };
        console.log(`✅ Updated resident ${residentId}: status=${newStatus}, moveOutDate=${updated.moveOutDate}`);
        return updated;
      }
      return resident;
    });
    
    updateResidentData(updatedResidents);
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
    console.log(`📅 MOVE-IN DATE UPDATE - Resident ${residentId} to ${newDate}`);
    
    const updatedResidents = allResidents.map(resident => {
      if (resident.id === residentId) {
        return {
          ...resident,
          leaseStartDate: newDate,
          moveInChecklist: {
            ...resident.moveInChecklist,
            'sign-lease': { completed: false },
            'payment': { completed: false },
            'renters-insurance': { completed: false }
          },
          moveInChecklistComplete: false,
          balance: 1550
        };
      }
      return resident;
    });

    updateResidentData(updatedResidents);
  };

  const submitNoticeToVacate = (residentId: string, data: any) => {
    console.log(`📋 SUBMIT NOTICE TO VACATE - Starting process for resident ${residentId}`, data);
    
    const updatedResidents = allResidents.map(resident => {
      if (resident.id === residentId) {
        console.log(`📋 SUBMIT NOTICE TO VACATE - Found resident ${residentId}, updating status and creating checklist`);
        
        const updatedResident = {
          ...resident,
          status: 'notice' as ResidentProfile['status'],
          noticeToVacateSubmitted: true,
          moveOutDate: data.moveOutDate,
          forwardingAddress: data.forwardingAddress || '',
          moveOutChecklistComplete: false,
          finalInspectionComplete: false,
          moveOutChecklist: {
            'notice-to-vacate': { 
              completed: true, 
              completedBy: 'resident', 
              completedDate: new Date().toISOString().split('T')[0] 
            },
            'forwarding-address': { 
              completed: !!data.forwardingAddress, 
              completedBy: data.forwardingAddress ? 'resident' : undefined, 
              completedDate: data.forwardingAddress ? new Date().toISOString().split('T')[0] : undefined 
            },
            'final-inspection': { completed: false },
            'exit-survey': { completed: false },
            'key-return': { completed: false },
            'final-balance': { completed: false },
            'deposit-release': { completed: false },
            'move-out-confirmation': { completed: false }
          }
        };
        
        console.log(`📋 SUBMIT NOTICE TO VACATE - Created complete resident update:`, updatedResident);
        return updatedResident;
      }
      return resident;
    });
    
    console.log('📋 SUBMIT NOTICE TO VACATE - Calling centralized update mechanism');
    updateResidentData(updatedResidents);
  };

  const cancelMoveOut = (residentId: string) => {
    console.log(`❌ CANCEL MOVE-OUT - Resident ${residentId}`);
    
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
  };

  const cancelNotice = (residentId: string) => {
    console.log(`❌ CANCEL NOTICE TO VACATE - Resident ${residentId}`);
    
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
    console.log(`📝 GENERATING MOVE-OUT CHECKLIST - Resident ${residentId}`);
    
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
    console.log(`🔍 COMPLETING ${type} INSPECTION - Resident ${residentId} by ${completedBy}`);
    
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
  };

  const updateChecklistItem = (residentId: string, type: 'moveIn' | 'moveOut', itemId: string, completed: boolean, completedBy?: string) => {
    console.log(`☑️ UPDATING ${type} CHECKLIST ITEM - Resident ${residentId}: ${completed}`);
    
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
        message: "Move cannot be completed until all required steps are fulfilled."
      };
    }

    console.log(`🚚 MARKING RESIDENT AS MOVED - Resident ${residentId} as moved ${type}`);

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
    console.log('🔄 MANUAL REFRESH OF RESIDENT DATA TRIGGERED');
    forceStateUpdate();
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
      refreshResidentData,
      forceStateUpdate
    }}>
      {children}
    </ResidentContext.Provider>
  );
};

export { type ResidentProfile, type ExtendedResidentProfile };
