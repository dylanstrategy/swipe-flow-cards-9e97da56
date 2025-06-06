
import { useState, useEffect } from 'react';

// Mock data since Supabase tables don't exist or aren't accessible
const mockUsers = [
  {
    id: '1',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    role: 'super_admin',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 234-5678',
    role: 'operator',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    first_name: 'Mike',
    last_name: 'Johnson',
    email: 'mike.johnson@example.com',
    phone: '(555) 345-6789',
    role: 'maintenance',
    created_at: '2024-02-01T00:00:00Z'
  }
];

const mockProperties = [
  {
    id: '1',
    name: 'Sunset Apartments',
    address: '123 Main St, City, State 12345',
    website: 'https://sunsetapts.com',
    timezone: 'America/New_York',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Riverside Complex',
    address: '456 River Rd, City, State 12346',
    website: 'https://riverside.com',
    timezone: 'America/Chicago',
    created_at: '2024-01-10T00:00:00Z'
  }
];

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('📊 Users fetched (mock data):', mockUsers.length);
      setUsers(mockUsers);
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
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('🏢 Properties fetched (mock data):', mockProperties.length);
      setProperties(mockProperties);
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
      
      console.log('🏠 Units fetched (mock data):', 0);
      setUnits([]);
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
      
      console.log('👥 Residents fetched (mock data):', 0);
      setResidents([]);
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
      
      console.log('📦 Move-ins fetched (mock data):', 0);
      setMoveIns([]);
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
      
      console.log('📤 Move-outs fetched (mock data):', 0);
      setMoveOuts([]);
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
      
      console.log('📅 Calendar events fetched (mock data):', 0);
      setEvents([]);
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
