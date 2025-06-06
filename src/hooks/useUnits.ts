
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Unit } from '@/types/supabase';

export const useUnits = (propertyId?: string) => {
  const { data: units = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['units', propertyId],
    queryFn: async () => {
      console.log('Fetching units from public.units...');
      
      let query = supabase
        .from('units')
        .select(`
          *,
          properties (
            id,
            property_name,
            address_line_1,
            city,
            state,
            zip_code
          ),
          residents (
            id,
            first_name,
            last_name,
            email,
            phone,
            lease_start_date,
            lease_end_date,
            monthly_rent,
            is_active,
            status
          )
        `);

      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }
      
      const { data, error } = await query.order('unit_number');

      if (error) {
        console.error('Error fetching units:', error);
        throw error;
      }

      // Map to include legacy compatibility fields
      const mappedData = data?.map(unit => ({
        ...unit,
        status: unit.unit_status, // Legacy compatibility
        bedroom_type: unit.bedrooms ? `${unit.bedrooms}BR` : null,
        bath_type: unit.bathrooms ? `${unit.bathrooms}BA` : null,
      })) as Unit[];

      console.log('✅ Units fetched from live data:', mappedData);
      return mappedData;
    },
  });

  return { units, loading, error, refetch };
};

export const useUpdateUnitStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      unitId, 
      newStatus, 
      newReadyStatus,
      changedBy, 
      notes 
    }: {
      unitId: string;
      newStatus?: string;
      newReadyStatus?: string;
      changedBy: string;
      notes?: string;
    }) => {
      // Get current status for logging
      const { data: currentUnit } = await supabase
        .from('units')
        .select('unit_status, unit_ready_status')
        .eq('id', unitId)
        .single();

      // Update the unit
      const updateData: any = { updated_at: new Date().toISOString() };
      if (newStatus) updateData.unit_status = newStatus;
      if (newReadyStatus) updateData.unit_ready_status = newReadyStatus;

      const { data: updatedUnit, error: updateError } = await supabase
        .from('units')
        .update(updateData)
        .eq('id', unitId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Log the status change
      if (newStatus && currentUnit?.unit_status !== newStatus) {
        const { error: logError } = await supabase
          .from('unit_status_logs')
          .insert({
            unit_id: unitId,
            status: newStatus,
            changed_by: changedBy,
            notes: notes || `Status changed from ${currentUnit?.unit_status} to ${newStatus}`,
            changed_at: new Date().toISOString()
          });

        if (logError) console.error('Error logging status change:', logError);
      }

      return updatedUnit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['unit_status_logs'] });
    },
  });
};

export const useUnitStatusLogs = (unitId: string) => {
  return useQuery({
    queryKey: ['unit_status_logs', unitId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unit_status_logs')
        .select(`
          *,
          users!unit_status_logs_changed_by_fkey (
            first_name,
            last_name,
            email
          )
        `)
        .eq('unit_id', unitId)
        .order('changed_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!unitId,
  });
};
