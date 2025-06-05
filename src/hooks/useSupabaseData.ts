
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeSync } from './useRealtimeSync';
import type { User, Property, Unit, MoveIn, MoveOut, CalendarEvent } from '@/types/supabase';

// Debounce utility
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useMemo(() => debounce(fetchUsers, 300), [fetchUsers]);

  const handleRealtimeChange = useCallback(() => {
    debouncedFetch();
  }, [debouncedFetch]);

  useRealtimeSync({
    tables: ['users'],
    onDataChange: handleRealtimeChange,
    enabled: !!userProfile
  });

  useEffect(() => {
    if (userProfile) {
      fetchUsers();
    }
  }, [userProfile, fetchUsers]);

  return { users, loading, refetch: fetchUsers };
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useMemo(() => debounce(fetchProperties, 300), [fetchProperties]);

  const handleRealtimeChange = useCallback(() => {
    debouncedFetch();
  }, [debouncedFetch]);

  useRealtimeSync({
    tables: ['properties'],
    onDataChange: handleRealtimeChange
  });

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, loading, refetch: fetchProperties };
}

export function useUnits(propertyId?: string) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUnits = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('units')
        .select('*')
        .order('unit_number', { ascending: true });

      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setUnits(data || []);
    } catch (error) {
      console.error('Error fetching units:', error);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  const debouncedFetch = useMemo(() => debounce(fetchUnits, 300), [fetchUnits]);

  const handleRealtimeChange = useCallback(() => {
    debouncedFetch();
  }, [debouncedFetch]);

  useRealtimeSync({
    tables: ['units'],
    onDataChange: handleRealtimeChange
  });

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  return { units, loading, refetch: fetchUnits };
}

export function useMoveIns(residentId?: string) {
  const [moveIns, setMoveIns] = useState<MoveIn[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMoveIns = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('move_ins')
        .select('*')
        .order('lease_start_date', { ascending: false });

      if (residentId) {
        query = query.eq('resident_id', residentId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMoveIns(data || []);
    } catch (error) {
      console.error('Error fetching move ins:', error);
    } finally {
      setLoading(false);
    }
  }, [residentId]);

  const debouncedFetch = useMemo(() => debounce(fetchMoveIns, 300), [fetchMoveIns]);

  const handleRealtimeChange = useCallback(() => {
    debouncedFetch();
  }, [debouncedFetch]);

  useRealtimeSync({
    tables: ['move_ins'],
    onDataChange: handleRealtimeChange
  });

  useEffect(() => {
    fetchMoveIns();
  }, [fetchMoveIns]);

  return { moveIns, loading, refetch: fetchMoveIns };
}

export function useMoveOuts(residentId?: string) {
  const [moveOuts, setMoveOuts] = useState<MoveOut[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMoveOuts = useCallback(async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('move_outs')
        .select('*')
        .order('move_out_date', { ascending: false });

      if (residentId) {
        query = query.eq('resident_id', residentId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMoveOuts(data || []);
    } catch (error) {
      console.error('Error fetching move outs:', error);
    } finally {
      setLoading(false);
    }
  }, [residentId]);

  const debouncedFetch = useMemo(() => debounce(fetchMoveOuts, 300), [fetchMoveOuts]);

  const handleRealtimeChange = useCallback(() => {
    debouncedFetch();
  }, [debouncedFetch]);

  useRealtimeSync({
    tables: ['move_outs'],
    onDataChange: handleRealtimeChange
  });

  useEffect(() => {
    fetchMoveOuts();
  }, [fetchMoveOuts]);

  return { moveOuts, loading, refetch: fetchMoveOuts };
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useMemo(() => debounce(fetchEvents, 300), [fetchEvents]);

  const handleRealtimeChange = useCallback(() => {
    debouncedFetch();
  }, [debouncedFetch]);

  useRealtimeSync({
    tables: ['calendar_events'],
    onDataChange: handleRealtimeChange,
    enabled: !!userProfile
  });

  useEffect(() => {
    if (userProfile) {
      fetchEvents();
    }
  }, [userProfile, fetchEvents]);

  return { events, loading, refetch: fetchEvents };
}
