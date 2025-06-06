
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUsers = () => {
  const { data: users = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users from Supabase...');
      try {
        // First check if the table exists by attempting a simple query
        const { data, error } = await supabase
          .from('api.users')
          .select('*')
          .limit(1);

        if (error) {
          console.error('Supabase users fetch error:', error);
          
          // If table doesn't exist, return empty array instead of throwing
          if (error.code === '42P01') {
            console.warn('api.users table does not exist yet');
            return [];
          }
          throw error;
        }

        // Now fetch all users
        const { data: allUsers, error: fetchError } = await supabase
          .from('api.users')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Error fetching all users:', fetchError);
          throw fetchError;
        }

        console.log('✅ Users fetched successfully:', allUsers);
        return allUsers || [];
      } catch (error) {
        console.error('Exception fetching users:', error);
        // Return empty array for missing table instead of throwing
        if (error?.code === '42P01') {
          return [];
        }
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
        // First check if the table exists
        const { data, error } = await supabase
          .from('api.properties')
          .select('*')
          .limit(1);

        if (error) {
          console.error('Supabase properties fetch error:', error);
          
          // If table doesn't exist, return empty array instead of throwing
          if (error.code === '42P01') {
            console.warn('api.properties table does not exist yet');
            return [];
          }
          throw error;
        }

        // Now fetch all properties
        const { data: allProperties, error: fetchError } = await supabase
          .from('api.properties')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Error fetching all properties:', fetchError);
          throw fetchError;
        }

        console.log('✅ Properties fetched successfully:', allProperties);
        return allProperties || [];
      } catch (error) {
        console.error('Exception fetching properties:', error);
        // Return empty array for missing table instead of throwing
        if (error?.code === '42P01') {
          return [];
        }
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
          if (error.code === '42P01') {
            console.warn('api.calendar_events table does not exist yet');
            return [];
          }
          throw error;
        }

        console.log('✅ Calendar events fetched successfully:', data);
        return data || [];
      } catch (error) {
        console.error('Exception fetching calendar events:', error);
        if (error?.code === '42P01') {
          return [];
        }
        throw error;
      }
    },
  });

  return { events, loading, error, refetch };
};
