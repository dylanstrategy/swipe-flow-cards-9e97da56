
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
        .or(`created_by.eq.${user.id},user_id.eq.${user.id},related_user_id.eq.${user.id}`)
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true });

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
      event_date: string;
      event_time?: string;
      event_type: string;
      related_user_id?: string;
      related_unit_id?: string;
      property_id?: string;
      unit_id?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Calculate start_time and end_time from event_date and event_time
      const eventDateTime = eventData.event_time 
        ? `${eventData.event_date}T${eventData.event_time}:00`
        : `${eventData.event_date}T09:00:00`;
      
      const startTime = new Date(eventDateTime).toISOString();
      const endTime = new Date(new Date(eventDateTime).getTime() + 60 * 60 * 1000).toISOString(); // +1 hour

      const { data, error } = await supabase
        .from('calendar_events')
        .insert({
          ...eventData,
          created_by: user.id,
          user_id: user.id,
          start_time: startTime,
          end_time: endTime,
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
      // If updating event_date or event_time, recalculate start_time and end_time
      if (updates.event_date || updates.event_time) {
        const { data: currentEvent } = await supabase
          .from('calendar_events')
          .select('event_date, event_time')
          .eq('id', id)
          .single();

        const eventDate = updates.event_date || currentEvent?.event_date;
        const eventTime = updates.event_time || currentEvent?.event_time || '09:00';
        
        const eventDateTime = `${eventDate}T${eventTime}:00`;
        const startTime = new Date(eventDateTime).toISOString();
        const endTime = new Date(new Date(eventDateTime).getTime() + 60 * 60 * 1000).toISOString();
        
        updates.start_time = startTime;
        updates.end_time = endTime;
      }

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
