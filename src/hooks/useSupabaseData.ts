
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Property, Unit, Resident, MoveIn, MoveOut } from '@/types/supabase';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        setError(error.message);
        setUsers([]);
      } else {
        console.log('📊 Users fetched:', data?.length || 0);
        setUsers(data || []);
      }
    } catch (err) {
      console.error('Exception fetching users:', err);
      setError('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, error, refetch: fetchUsers };
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        setError(error.message);
        setProperties([]);
      } else {
        console.log('🏢 Properties fetched:', data?.length || 0);
        setProperties(data || []);
      }
    } catch (err) {
      console.error('Exception fetching properties:', err);
      setError('Failed to fetch properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return { properties, loading, error, refetch: fetchProperties };
}

export function useUnits() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('units')
        .select(`
          *,
          residents!inner(
            id,
            user_id,
            status,
            users!inner(
              id,
              first_name,
              last_name,
              email,
              phone
            )
          )
        `)
        .order('unit_number', { ascending: true });

      if (error) {
        console.error('Error fetching units:', error);
        setError(error.message);
        setUnits([]);
      } else {
        console.log('🏠 Units fetched:', data?.length || 0);
        setUnits(data || []);
      }
    } catch (err) {
      console.error('Exception fetching units:', err);
      setError('Failed to fetch units');
      setUnits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  return { units, loading, error, refetch: fetchUnits };
}

export function useResidents() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('residents')
        .select(`
          *,
          users!inner(
            id,
            first_name,
            last_name,
            email,
            phone
          ),
          units(
            id,
            unit_number,
            bedroom_type,
            bath_type
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching residents:', error);
        setError(error.message);
        setResidents([]);
      } else {
        console.log('👥 Residents fetched:', data?.length || 0);
        setResidents(data || []);
      }
    } catch (err) {
      console.error('Exception fetching residents:', err);
      setError('Failed to fetch residents');
      setResidents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  return { residents, loading, error, refetch: fetchResidents };
}

export function useMoveIns() {
  const [moveIns, setMoveIns] = useState<MoveIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoveIns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('move_ins')
        .select(`
          *,
          residents!inner(
            id,
            users!inner(
              id,
              first_name,
              last_name,
              email
            )
          ),
          units!inner(
            id,
            unit_number,
            bedroom_type
          )
        `)
        .order('lease_start_date', { ascending: true });

      if (error) {
        console.error('Error fetching move-ins:', error);
        setError(error.message);
        setMoveIns([]);
      } else {
        console.log('📦 Move-ins fetched:', data?.length || 0);
        setMoveIns(data || []);
      }
    } catch (err) {
      console.error('Exception fetching move-ins:', err);
      setError('Failed to fetch move-ins');
      setMoveIns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoveIns();
  }, []);

  return { moveIns, loading, error, refetch: fetchMoveIns };
}

export function useMoveOuts() {
  const [moveOuts, setMoveOuts] = useState<MoveOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoveOuts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('move_outs')
        .select(`
          *,
          residents!inner(
            id,
            users!inner(
              id,
              first_name,
              last_name,
              email
            )
          ),
          units!inner(
            id,
            unit_number,
            bedroom_type
          )
        `)
        .order('move_out_date', { ascending: true });

      if (error) {
        console.error('Error fetching move-outs:', error);
        setError(error.message);
        setMoveOuts([]);
      } else {
        console.log('📤 Move-outs fetched:', data?.length || 0);
        setMoveOuts(data || []);
      }
    } catch (err) {
      console.error('Exception fetching move-outs:', err);
      setError('Failed to fetch move-outs');
      setMoveOuts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoveOuts();
  }, []);

  return { moveOuts, loading, error, refetch: fetchMoveOuts };
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Error fetching calendar events:', error);
        setError(error.message);
        setEvents([]);
      } else {
        console.log('📅 Calendar events fetched:', data?.length || 0);
        setEvents(data || []);
      }
    } catch (err) {
      console.error('Exception fetching calendar events:', err);
      setError('Failed to fetch calendar events');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, error, refetch: fetchEvents };
}
