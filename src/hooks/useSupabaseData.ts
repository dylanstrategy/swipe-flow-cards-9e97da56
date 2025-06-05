
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Property } from '@/types/supabase';

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
        
        // If there's a schema error, provide mock data for development
        if (error.message?.includes('schema') || error.message?.includes('relation')) {
          console.log('Using mock data for users due to schema issues');
          const mockUsers: User[] = [
            {
              id: '1',
              email: 'info@applaudliving.com',
              role: 'super_admin',
              first_name: 'Super',
              last_name: 'Admin',
              phone: '(555) 123-4567',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: '2',
              email: 'operator@meridian.com',
              role: 'operator',
              first_name: 'John',
              last_name: 'Operator',
              phone: '(555) 234-5678',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
          setUsers(mockUsers);
        } else {
          setUsers([]);
        }
      } else {
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
        
        // If there's a schema error, provide mock data for development
        if (error.message?.includes('schema') || error.message?.includes('relation')) {
          console.log('Using mock data for properties due to schema issues');
          const mockProperties: Property[] = [
            {
              id: '1',
              name: 'Le Leo Apartments',
              address: '123 Main Street, New York, NY 10001',
              website: 'https://www.leleoapartments.com',
              timezone: 'America/New_York',
              management_company: 'Meridian Property Management',
              property_manager_name: 'John Smith',
              property_manager_email: 'john.smith@meridian.com',
              property_manager_phone: '(555) 123-4567',
              emergency_contact: 'Emergency Services',
              emergency_phone: '(555) 999-0000',
              maintenance_company: 'ABC Maintenance Co',
              maintenance_contact: 'Mike Johnson',
              maintenance_phone: '(555) 777-8888',
              leasing_office_hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM, Sun: Closed',
              amenities: 'Pool, Gym, Concierge, Rooftop Deck, Package Room, Laundry Facilities',
              parking_info: 'Garage parking available, $150/month per space',
              pet_policy: 'Dogs and cats welcome, $500 deposit, 50lb weight limit',
              smoking_policy: 'Non-smoking building',
              special_instructions: 'Deliveries accepted at concierge desk during business hours',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
          setProperties(mockProperties);
        } else {
          setProperties([]);
        }
      } else {
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
