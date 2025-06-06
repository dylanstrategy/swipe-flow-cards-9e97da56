
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * Tries to fetch data from public schema first, then falls back to api schema if needed
 */
const fetchWithSchemaFallback = async (tableName: string, query: any) => {
  console.log(`Fetching ${tableName} with schema fallback...`);
  
  // Try public schema first
  const { data: publicData, error: publicError } = await query;
  
  if (publicData && publicData.length > 0) {
    console.log(`✅ ${tableName} fetched from public schema:`, publicData);
    return publicData;
  } 
  
  if (publicError) {
    console.error(`Error fetching from public.${tableName}:`, publicError);
  } else {
    console.log(`No data found in public.${tableName}, trying api schema...`);
  }
  
  // Fallback to api schema if public schema returned no data
  try {
    // Modify the query to use api schema instead
    const apiQuery = supabase
      .from(`api.${tableName}`)
      .select(query._query[0].columns.join(',')) // Get the columns from the original query
      .order(query._query[0].ordering?.[0]?.column || 'created_at', 
             { ascending: query._query[0].ordering?.[0]?.ascending || false });

    const { data: apiData, error: apiError } = await apiQuery;
    
    if (apiError) {
      console.error(`Error fetching from api.${tableName}:`, apiError);
      return publicData || []; // Return whatever we got from public schema (empty array if nothing)
    }
    
    if (apiData && apiData.length > 0) {
      console.log(`✅ ${tableName} fetched from api schema:`, apiData);
      return apiData;
    }
    
    console.log(`No data found in api.${tableName} either`);
    return [];
  } catch (error) {
    console.error(`Exception trying to access api.${tableName}:`, error);
    return publicData || []; // Return whatever we got from public schema (empty array if nothing)
  }
};

export const useUsers = () => {
  const { data: users = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching users with schema fallback...');
      const query = supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      return fetchWithSchemaFallback('users', query);
    },
  });

  return { users, loading, error, refetch };
};

export const useProperties = () => {
  const { data: properties = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log('Fetching properties with schema fallback...');
      const query = supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      const data = await fetchWithSchemaFallback('properties', query);

      // Map new schema to legacy field names for backward compatibility
      const mappedData = data?.map(property => ({
        ...property,
        name: property.property_name, // Legacy compatibility
        address: property.address_line_1, // Legacy compatibility
      })) || [];

      console.log('✅ Properties mapped for compatibility:', mappedData);
      return mappedData;
    },
  });

  return { properties, loading, error, refetch };
};

export const useResidents = (propertyId?: string) => {
  const { data: residents = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['residents', propertyId],
    queryFn: async () => {
      console.log('Fetching residents with schema fallback...');
      
      // Build the query for both schemas
      let baseQuery = supabase
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
        `);

      if (propertyId) {
        baseQuery = baseQuery.eq('property_id', propertyId);
      }
      
      baseQuery = baseQuery.order('created_at', { ascending: false });

      // Try to fetch with schema fallback
      return fetchWithSchemaFallback('residents', baseQuery);
    },
  });

  return { residents, loading, error, refetch };
};

export const useCalendarEvents = () => {
  const { data: events = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['calendar_events'],
    queryFn: async () => {
      console.log('Fetching calendar events with schema fallback...');
      const query = supabase
        .from('calendar_events')
        .select('*')
        .order('event_date', { ascending: true });

      return fetchWithSchemaFallback('calendar_events', query);
    },
  });

  return { events, loading, error, refetch };
};

export const useUnits = (propertyId?: string) => {
  const { data: units = [], isLoading: loading, error, refetch } = useQuery({
    queryKey: ['units', propertyId],
    queryFn: async () => {
      console.log('Fetching units with schema fallback...');
      
      // Build the query for both schemas
      let baseQuery = supabase
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
        `);

      if (propertyId) {
        baseQuery = baseQuery.eq('property_id', propertyId);
      }
      
      baseQuery = baseQuery.order('unit_number');

      // Try to fetch with schema fallback
      const data = await fetchWithSchemaFallback('units', baseQuery);

      // Map new schema to legacy field names for backward compatibility
      const mappedData = data?.map(unit => ({
        ...unit,
        status: unit.unit_status, // Legacy compatibility
        bedroom_type: unit.bedrooms ? `${unit.bedrooms}BR` : null,
        bath_type: unit.bathrooms ? `${unit.bathrooms}BA` : null,
      })) || [];

      console.log('✅ Units mapped for compatibility:', mappedData);
      return mappedData;
    },
  });

  return { units, loading, error, refetch };
};
