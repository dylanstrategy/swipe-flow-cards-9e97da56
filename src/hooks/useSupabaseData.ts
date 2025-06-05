
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { User, Property, Unit, MoveIn, MoveOut, CalendarEvent } from '@/types/supabase';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [userProfile]);

  const fetchUsers = async () => {
    try {
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
  };

  return { users, loading, refetch: fetchUsers };
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
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
  };

  return { properties, loading, refetch: fetchProperties };
}

export function useUnits(propertyId?: string) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnits();
  }, [propertyId]);

  const fetchUnits = async () => {
    try {
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
  };

  return { units, loading, refetch: fetchUnits };
}

export function useMoveIns(residentId?: string) {
  const [moveIns, setMoveIns] = useState<MoveIn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoveIns();
  }, [residentId]);

  const fetchMoveIns = async () => {
    try {
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
  };

  return { moveIns, loading, refetch: fetchMoveIns };
}

export function useMoveOuts(residentId?: string) {
  const [moveOuts, setMoveOuts] = useState<MoveOut[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoveOuts();
  }, [residentId]);

  const fetchMoveOuts = async () => {
    try {
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
  };

  return { moveOuts, loading, refetch: fetchMoveOuts };
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();

  useEffect(() => {
    if (userProfile) {
      fetchEvents();
    }
  }, [userProfile]);

  const fetchEvents = async () => {
    try {
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
  };

  return { events, loading, refetch: fetchEvents };
}
