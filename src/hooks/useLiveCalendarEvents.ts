
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { CalendarEvent } from '@/types/supabase';

export const useLiveCalendarEvents = () => {
  const { user } = useAuth();

  const { data: events = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['live_calendar_events', user?.id],
    queryFn: async () => {
      if (!user) return [];

      console.log('Fetching calendar events from public.calendar_events...');
      
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .or(`created_by.eq.${user.id},related_user_id.eq.${user.id}`)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching calendar events:', error);
        throw error;
      }

      console.log('✅ Calendar events fetched from live data:', data);
      return data as CalendarEvent[];
    },
    enabled: !!user,
  });

  return { events, loading, error, refetch };
};

export const useCreateCalendarEvent = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (eventData: {
      title: string;
      description?: string;
      start_time: string;
      end_time?: string;
      event_type: string;
      related_user_id?: string;
      related_unit_id?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          ...eventData,
          created_by: user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live_calendar_events'] });
    },
  });
};

export const useUpdateCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from('calendar_events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['live_calendar_events'] });
    },
  });
};
