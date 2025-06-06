
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Resident } from '@/types/supabase';

interface LiveResidentContextType {
  resident: Resident | null;
  loading: boolean;
  updateResidentField: (field: string, value: any) => Promise<void>;
  refreshResident: () => Promise<void>;
}

const LiveResidentContext = createContext<LiveResidentContextType | undefined>(undefined);

export const LiveResidentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [resident, setResident] = useState<Resident | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchResident = async () => {
    if (!user) {
      setResident(null);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching resident data for user:', user.id);
      
      const { data, error } = await supabase
        .from('residents')
        .select(`
          *,
          units (
            id,
            unit_number,
            unit_type,
            bedrooms,
            bathrooms,
            unit_status,
            unit_ready_status
          ),
          properties (
            id,
            property_name,
            address_line_1,
            city,
            state
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching resident:', error);
        throw error;
      }

      console.log('✅ Live resident data fetched:', data);
      setResident(data || null);
    } catch (error) {
      console.error('Error in fetchResident:', error);
      setResident(null);
    } finally {
      setLoading(false);
    }
  };

  const updateResidentField = async (field: string, value: any) => {
    if (!resident) throw new Error('No resident data');

    const { data, error } = await supabase
      .from('residents')
      .update({
        [field]: value,
        updated_at: new Date().toISOString()
      })
      .eq('id', resident.id)
      .select()
      .single();

    if (error) throw error;

    setResident(data);
    console.log(`✅ Updated resident ${field}:`, value);
  };

  const refreshResident = async () => {
    setLoading(true);
    await fetchResident();
  };

  useEffect(() => {
    fetchResident();
  }, [user]);

  return (
    <LiveResidentContext.Provider value={{
      resident,
      loading,
      updateResidentField,
      refreshResident
    }}>
      {children}
    </LiveResidentContext.Provider>
  );
};

export const useLiveResident = () => {
  const context = useContext(LiveResidentContext);
  if (context === undefined) {
    throw new Error('useLiveResident must be used within a LiveResidentProvider');
  }
  return context;
};
