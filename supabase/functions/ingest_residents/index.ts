
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.10";
import Papa from "https://esm.sh/papaparse@5.4.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResidentRow {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  unit_number: string;
  property_code: string;
  move_in_date?: string;
  lease_start_date?: string;
  lease_end_date?: string;
  lease_term?: string;
  monthly_rent?: string;
  concession_amount?: string;
  payment_status?: string;
  status?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { file_path } = await req.json();
    
    if (!file_path) {
      throw new Error('file_path is required');
    }

    console.log(`Processing file: ${file_path}`);

    // Download the CSV file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('admin-uploads')
      .download(file_path);

    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }

    // Convert file to text
    const csvText = await fileData.text();
    console.log('CSV content length:', csvText.length);

    // Parse CSV
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase()
    });

    if (parseResult.errors.length > 0) {
      console.error('CSV parsing errors:', parseResult.errors);
      throw new Error(`CSV parsing failed: ${parseResult.errors[0].message}`);
    }

    const rows = parseResult.data as ResidentRow[];
    console.log(`Parsed ${rows.length} rows`);

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      
      try {
        console.log(`Processing row ${i + 1}:`, row);

        // Validate required fields
        if (!row.email || !row.first_name || !row.last_name || !row.unit_number || !row.property_code) {
          throw new Error('Missing required fields: email, first_name, last_name, unit_number, property_code');
        }

        // Find property by property_code
        const { data: property, error: propertyError } = await supabase
          .from('properties')
          .select('id')
          .eq('property_code', row.property_code.trim())
          .single();

        if (propertyError || !property) {
          throw new Error(`Property with code "${row.property_code}" not found`);
        }

        // Find unit by unit_number and property_id
        const { data: unit, error: unitError } = await supabase
          .from('units')
          .select('id')
          .eq('property_id', property.id)
          .eq('unit_number', row.unit_number.trim())
          .single();

        if (unitError || !unit) {
          throw new Error(`Unit "${row.unit_number}" not found in property "${row.property_code}"`);
        }

        // Create or find user
        let userId: string;
        
        // Check if user already exists
        const { data: existingUser, error: userCheckError } = await supabase
          .from('users')
          .select('id')
          .eq('email', row.email.trim().toLowerCase())
          .single();

        if (existingUser) {
          userId = existingUser.id;
          console.log(`Found existing user: ${userId}`);
        } else {
          // Create new user
          const { data: newUser, error: userError } = await supabase
            .from('users')
            .insert({
              email: row.email.trim().toLowerCase(),
              first_name: row.first_name.trim(),
              last_name: row.last_name.trim(),
              phone: row.phone?.trim() || null,
              role: 'resident'
            })
            .select('id')
            .single();

          if (userError) {
            console.error('Error creating user:', userError);
            throw new Error(`Failed to create user: ${userError.message}`);
          }

          userId = newUser.id;
          console.log(`Created new user: ${userId}`);
        }

        // Check if resident already exists
        const { data: existingResident } = await supabase
          .from('residents')
          .select('id')
          .eq('user_id', userId)
          .eq('property_id', property.id)
          .single();

        if (existingResident) {
          console.log(`Resident already exists for user ${userId}, skipping...`);
          successCount++;
          continue;
        }

        // Create resident record
        const residentData = {
          user_id: userId,
          property_id: property.id,
          unit_id: unit.id,
          first_name: row.first_name.trim(),
          last_name: row.last_name.trim(),
          email: row.email.trim().toLowerCase(),
          phone: row.phone?.trim() || null,
          move_in_date: row.move_in_date ? new Date(row.move_in_date).toISOString().split('T')[0] : null,
          lease_start_date: row.lease_start_date ? new Date(row.lease_start_date).toISOString().split('T')[0] : null,
          lease_end_date: row.lease_end_date ? new Date(row.lease_end_date).toISOString().split('T')[0] : null,
          lease_term: row.lease_term ? parseInt(row.lease_term) : null,
          monthly_rent: row.monthly_rent ? parseFloat(row.monthly_rent) : null,
          concession_amount: row.concession_amount ? parseFloat(row.concession_amount) : null,
          payment_status: (row.payment_status?.trim() as any) || 'current',
          status: (row.status?.trim() as any) || 'active',
          is_active: true
        };

        const { error: residentError } = await supabase
          .from('residents')
          .insert(residentData);

        if (residentError) {
          console.error('Error creating resident:', residentError);
          throw new Error(`Failed to create resident: ${residentError.message}`);
        }

        // Update unit status to occupied
        await supabase
          .from('units')
          .update({ unit_status: 'occupied' })
          .eq('id', unit.id);

        console.log(`✅ Successfully processed row ${i + 1}`);
        successCount++;

      } catch (error: any) {
        errorCount++;
        const errorMessage = `Row ${i + 1}: ${error.message}`;
        errors.push(errorMessage);
        console.error(`❌ Error processing row ${i + 1}:`, error);
      }
    }

    console.log(`Ingestion complete: ${successCount} successful, ${errorCount} failed`);

    return new Response(JSON.stringify({
      success: true,
      processed: rows.length,
      successful: successCount,
      failed: errorCount,
      errors: errors
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
};

serve(handler);
