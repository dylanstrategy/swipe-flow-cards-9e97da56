
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Property, Unit, Resident, CalendarEvent } from '@/types/supabase';

/**
 * Hook to fetch users data from Supabase
 */
export const useUsers = () => {
  const { data: users = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      console.log('✅ Users fetched:', data);
      return data || [];
    },
  });

  return { users, loading, error, refetch };
};

/**
 * Hook to fetch properties data from Supabase with complete field mapping
 */
export const useProperties = () => {
  const { data: properties = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log('Fetching properties...');
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
        return [];
      }

      // Map new schema to legacy field names for backward compatibility
      const mappedData = data?.map(property => ({
        ...property,
        name: property.property_name, // Legacy compatibility
        address: property.address_line_1, // Legacy compatibility
      })) as Property[];

      console.log('✅ Properties mapped for compatibility:', mappedData);
      return mappedData;
    },
  });

  return { properties, loading, error, refetch };
};

/**
 * Hook to fetch residents data from Supabase with optional property filter
 * Includes unit and property relationship data
 */
export const useResidents = (propertyId?: string) => {
  const { data: residents = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['residents', propertyId],
    queryFn: async () => {
      console.log('Fetching residents...');
      
      // Build the query
      let query = supabase
        .from('residents')
        .select(`
          *,
          units (
            id,
            unit_number,
            unit_type,
            bedrooms,
            bathrooms,
            sq_ft,
            floor,
            unit_status,
            unit_ready_status,
            market_rent,
            inspection_completed
          ),
          properties (
            id,
            property_name,
            address_line_1,
            city,
            state,
            zip_code
          )
        `);

      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching residents:', error);
        return [];
      }

      console.log('✅ Residents fetched:', data);
      return data as Resident[];
    },
  });

  return { residents, loading, error, refetch };
};

/**
 * Hook to fetch calendar events from Supabase
 */
export const useCalendarEvents = () => {
  const { data: events = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['calendar_events'],
    queryFn: async () => {
      console.log('Fetching calendar events...');
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Error fetching calendar events:', error);
        return [];
      }

      console.log('✅ Calendar events fetched:', data);
      return data as CalendarEvent[];
    },
  });

  return { events, loading, error, refetch };
};

/**
 * Hook to fetch units data from Supabase with optional property filter
 * Includes property and resident relationship data
 */
export const useUnits = (propertyId?: string) => {
  const { data: units = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['units', propertyId],
    queryFn: async () => {
      console.log('Fetching units...');
      
      // Build the query
      let query = supabase
        .from('units')
        .select(`
          *,
          properties (
            id,
            property_name,
            address_line_1,
            city,
            state,
            zip_code
          ),
          residents (
            id,
            first_name,
            last_name,
            email,
            phone,
            lease_start_date,
            lease_end_date,
            monthly_rent,
            is_active
          )
        `);

      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }
      
      const { data, error } = await query.order('unit_number');

      if (error) {
        console.error('Error fetching units:', error);
        return [];
      }

      // Map new schema to legacy field names for backward compatibility
      const mappedData = data?.map(unit => ({
        ...unit,
        status: unit.unit_status, // Legacy compatibility
        bedroom_type: unit.bedrooms ? `${unit.bedrooms}BR` : null,
        bath_type: unit.bathrooms ? `${unit.bathrooms}BA` : null,
      })) as Unit[];

      console.log('✅ Units mapped for compatibility:', mappedData);
      return mappedData;
    },
  });

  return { units, loading, error, refetch };
};
