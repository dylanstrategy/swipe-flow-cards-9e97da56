
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching users from Supabase...');
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase users fetch error:', fetchError);
        throw fetchError;
      }

      console.log('📊 Users fetched from database:', data?.length || 0);
      setUsers(data || []);
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
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching properties from Supabase...');
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase properties fetch error:', fetchError);
        throw fetchError;
      }

      console.log('🏢 Properties fetched from database:', data?.length || 0);
      setProperties(data || []);
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
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching units from Supabase...');
      const { data, error: fetchError } = await supabase
        .from('units')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase units fetch error:', fetchError);
        throw fetchError;
      }

      console.log('🏠 Units fetched from database:', data?.length || 0);
      setUnits(data || []);
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
  const [residents, setResidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching residents from Supabase...');
      const { data, error: fetchError } = await supabase
        .from('residents')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase residents fetch error:', fetchError);
        throw fetchError;
      }

      console.log('👥 Residents fetched from database:', data?.length || 0);
      setResidents(data || []);
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
  const [moveIns, setMoveIns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoveIns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching move-ins from Supabase...');
      const { data, error: fetchError } = await supabase
        .from('move_ins')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase move-ins fetch error:', fetchError);
        throw fetchError;
      }

      console.log('📦 Move-ins fetched from database:', data?.length || 0);
      setMoveIns(data || []);
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
  const [moveOuts, setMoveOuts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMoveOuts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching move-outs from Supabase...');
      const { data, error: fetchError } = await supabase
        .from('move_outs')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase move-outs fetch error:', fetchError);
        throw fetchError;
      }

      console.log('📤 Move-outs fetched from database:', data?.length || 0);
      setMoveOuts(data || []);
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
      
      console.log('Fetching calendar events from Supabase...');
      const { data, error: fetchError } = await supabase
        .from('calendar_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Supabase calendar events fetch error:', fetchError);
        throw fetchError;
      }

      console.log('📅 Calendar events fetched from database:', data?.length || 0);
      setEvents(data || []);
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
