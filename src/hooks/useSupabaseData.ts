
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUsers = () => {
  const { data: users = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users from Supabase...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase users fetch error:', error);
        throw error;
      }

      console.log('✅ Users fetched successfully:', data);
      return data || [];
    },
  });

  return { users, loading, error, refetch };
};

export const useProperties = () => {
  const { data: properties = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log('Fetching properties from Supabase...');
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase properties fetch error:', error);
        throw error;
      }

      // Map new schema to legacy field names for backward compatibility
      const mappedData = data?.map(property => ({
        ...property,
        name: property.property_name, // Legacy compatibility
        address: property.address_line_1, // Legacy compatibility
      })) || [];

      console.log('✅ Properties fetched successfully:', mappedData);
      return mappedData;
    },
  });

  return { properties, loading, error, refetch };
};

export const useResidents = (propertyId?: string) => {
  const { data: residents = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['residents', propertyId],
    queryFn: async () => {
      console.log('Fetching residents from Supabase...');
      let query = supabase
        .from('residents')
        .select(`
          *,
          units (
            unit_number,
            bedrooms,
            bathrooms,
            sq_ft
          ),
          properties (
            property_name,
            address_line_1
          )
        `)
        .order('created_at', { ascending: false });

      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase residents fetch error:', error);
        throw error;
      }

      console.log('✅ Residents fetched successfully:', data);
      return data || [];
    },
  });

  return { residents, loading, error, refetch };
};

export const useCalendarEvents = () => {
  const { data: events = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['calendar_events'],
    queryFn: async () => {
      console.log('Fetching calendar events from Supabase...');
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Supabase calendar events fetch error:', error);
        throw error;
      }

      console.log('✅ Calendar events fetched successfully:', data);
      return data || [];
    },
  });

  return { events, loading, error, refetch };
};

export const useUnits = (propertyId?: string) => {
  const { data: units = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['units', propertyId],
    queryFn: async () => {
      console.log('Fetching units from Supabase...');
      let query = supabase
        .from('units')
        .select(`
          *,
          properties (
            property_name,
            address_line_1
          ),
          residents!units_unit_id_fkey (
            first_name,
            last_name,
            email,
            phone,
            lease_start_date,
            lease_end_date,
            monthly_rent,
            is_active
          )
        `)
        .order('unit_number');

      if (propertyId) {
        query = query.eq('property_id', propertyId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase units fetch error:', error);
        throw error;
      }

      // Map new schema to legacy field names for backward compatibility
      const mappedData = data?.map(unit => ({
        ...unit,
        status: unit.unit_status, // Legacy compatibility
        bedroom_type: unit.bedrooms ? `${unit.bedrooms}BR` : null,
        bath_type: unit.bathrooms ? `${unit.bathrooms}BA` : null,
      })) || [];

      console.log('✅ Units fetched successfully:', mappedData);
      return mappedData;
    },
  });

  return { units, loading, error, refetch };
};
