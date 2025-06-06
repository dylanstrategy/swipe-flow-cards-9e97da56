
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUsers = () => {
  const { data: users = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users from Supabase...');
      try {
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
          .from('properties')
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
