
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUsers = () => {
  const { data: users = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users from Supabase...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase users fetch error:', error);
        throw error;
      }

      console.log('✅ Users fetched successfully:', data);
      return data || [];
    },
  });

  return { users, loading, error, refetch };
};

export const useProperties = () => {
  const { data: properties = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log('Fetching properties from Supabase...');
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase properties fetch error:', error);
        throw error;
      }

      console.log('✅ Properties fetched successfully:', data);
      return data || [];
    },
  });

  return { properties, loading, error, refetch };
};

export const useCalendarEvents = () => {
  const { data: events = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['calendar_events'],
    queryFn: async () => {
      console.log('Fetching calendar events from Supabase...');
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Supabase calendar events fetch error:', error);
        throw error;
      }

      console.log('✅ Calendar events fetched successfully:', data);
      return data || [];
    },
  });

  return { events, loading, error, refetch };
};

export const useUnits = (propertyId?: string) => {
  const { data: units = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['units', propertyId],
    queryFn: async () => {
      console.log('Fetching units from Supabase...');
      let query = supabase
        .from('units')
        .select('*')
        .order('unit_number');

      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase units fetch error:', error);
        throw error;
      }

      console.log('✅ Units fetched successfully:', data);
      return data || [];
    },
  });

  return { units, loading, error, refetch };
};
