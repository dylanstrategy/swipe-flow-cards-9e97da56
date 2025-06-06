
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
      console.log('Fetching users from public.users...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      console.log('✅ Users fetched from live data:', data);
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
      console.log('Fetching properties from public.properties...');
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

      console.log('✅ Properties fetched and mapped for compatibility:', mappedData);
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
      console.log('Fetching residents from public.residents...');
      
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

      console.log('✅ Residents fetched from live data:', data);
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
      console.log('Fetching calendar events from public.calendar_events...');
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('event_date', { ascending: true })
        .order('event_time', { ascending: true });

      if (error) {
        console.error('Error fetching calendar events:', error);
        return [];
      }

      console.log('✅ Calendar events fetched from live data:', data);
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
      console.log('Fetching units from public.units...');
      
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
            is_active,
            status
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

      console.log('✅ Units fetched and mapped for compatibility:', mappedData);
      return mappedData;
    },
  });

  return { units, loading, error, refetch };
};

/**
 * Hook to fetch service orders (work orders) from Supabase
 */
export const useServiceOrders = (userId?: string) => {
  const { data: serviceOrders = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['service_orders', userId],
    queryFn: async () => {
      console.log('Fetching service orders from public.service_orders...');
      
      let query = supabase
        .from('service_orders')
        .select(`
          *,
          units (
            id,
            unit_number,
            property_id,
            properties (
              id,
              property_name,
              address_line_1
            )
          ),
          vendors (
            id,
            name,
            email,
            phone,
            category
          )
        `);

      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching service orders:', error);
        return [];
      }

      console.log('✅ Service orders fetched from live data:', data);
      return data;
    },
    enabled: !!userId,
  });

  return { serviceOrders, loading, error, refetch };
};

/**
 * Hook to fetch vendors from Supabase
 */
export const useVendors = () => {
  const { data: vendors = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      console.log('Fetching vendors from public.vendors...');
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        console.error('Error fetching vendors:', error);
        return [];
      }

      console.log('✅ Vendors fetched from live data:', data);
      return data;
    },
  });

  return { vendors, loading, error, refetch };
};
