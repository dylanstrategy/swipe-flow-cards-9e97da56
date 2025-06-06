
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Resident } from '@/types/supabase';

export const useResidents = (propertyId?: string) => {
  const { data: residents = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['residents', propertyId],
    queryFn: async () => {
      console.log('Fetching residents from public.residents...');
      
      let query = supabase
        .from('residents')
        .select(`
          *,
          units (
            id,
            unit_number,
            unit_type,
            bedrooms,
            bathrooms,
            sq_ft,
            floor,
            unit_status,
            unit_ready_status,
            market_rent,
            inspection_completed
          ),
          properties (
            id,
            property_name,
            address_line_1,
            city,
            state,
            zip_code
          )
        `);

      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching residents:', error);
        throw error;
      }

      console.log('✅ Residents fetched from live data:', data);
      return data as Resident[];
    },
  });

  return { residents, loading, error, refetch };
};

export const useUpdateResident = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: { id: string; [key: string]: any }) => {
      const { id, ...updateData } = updates;
      
      const { data, error } = await supabase
        .from('residents')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['residents'] });
    },
  });
};

export const useResidentChecklists = (residentId: string) => {
  const { data: moveInChecklist = [], isLoading: moveInLoading } = useQuery({
    queryKey: ['move_in_checklists', residentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('move_in_checklists')
        .select('*')
        .eq('resident_id', residentId)
        .order('created_at');

      if (error) throw error;
      return data;
    },
    enabled: !!residentId,
  });

  const { data: moveOutChecklist = [], isLoading: moveOutLoading } = useQuery({
    queryKey: ['move_out_checklists', residentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('move_out_checklists')
        .select('*')
        .eq('resident_id', residentId)
        .order('created_at');

      if (error) throw error;
      return data;
    },
    enabled: !!residentId,
  });

  return {
    moveInChecklist,
    moveOutChecklist,
    loading: moveInLoading || moveOutLoading
  };
};
