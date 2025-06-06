
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUsers = () => {
  const { data: users = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users from Supabase...');
      try {
        const { data, error } = await supabase
          .from('api.users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase users fetch error:', error);
          throw error;
        }

        console.log('✅ Users fetched successfully:', data);
        return data || [];
      } catch (error) {
        console.error('Exception fetching users:', error);
        throw error;
      }
    },
  });

  return { users, loading, error, refetch };
};

export const useProperties = () => {
  const { data: properties = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log('Fetching properties from Supabase...');
      try {
        const { data, error } = await supabase
          .from('api.properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase properties fetch error:', error);
          throw error;
        }

        console.log('✅ Properties fetched successfully:', data);
        return data || [];
      } catch (error) {
        console.error('Exception fetching properties:', error);
        throw error;
      }
    },
  });

  return { properties, loading, error, refetch };
};

export const useCalendarEvents = () => {
  const { data: events = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['calendar_events'],
    queryFn: async () => {
      console.log('Fetching calendar events from Supabase...');
      try {
        const { data, error } = await supabase
          .from('api.calendar_events')
          .select('*')
          .order('event_date', { ascending: true });

        if (error) {
          console.error('Supabase calendar events fetch error:', error);
          throw error;
        }

        console.log('✅ Calendar events fetched successfully:', data);
        return data || [];
      } catch (error) {
        console.error('Exception fetching calendar events:', error);
        throw error;
      }
    },
  });

  return { events, loading, error, refetch };
};
