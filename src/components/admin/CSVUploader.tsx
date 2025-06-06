import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Users,
  Building2,
  Home,
  Database
} from 'lucide-react';
import * as Papa from 'papaparse';
import { supabase } from '@/integrations/supabase/client';
import type { AppRole } from '@/types/supabase';

interface CSVRow {
  [key: string]: string;
}

interface ParsedUser {
  id_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: AppRole;
  assigned_operator_email?: string;
  assigned_vendor_email?: string;
  employer?: string;
  is_active: boolean;
}

interface ParsedProperty {
  property_name: string;
  property_code?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  zip_code: string;
  timezone?: string;
  management_company?: string;
  total_units?: number;
  super_operator_email?: string;
}

interface ParsedUnit {
  unit_number: string;
  unit_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  market_rent?: number;
  unit_status: string;
  property_code?: string;
}

interface ParsedResident {
  id_number: string;
  unit_number: string;
  property_code?: string;
  move_in_date?: string;
  lease_start_date?: string;
  lease_end_date?: string;
  monthly_rent?: number;
  deposit_amount?: number;
  balance_due?: number;
  renter_insurance_uploaded: boolean;
  move_in_checklist_complete: boolean;
  move_out_checklist_complete: boolean;
}

interface ProcessingResult {
  users: ParsedUser[];
  properties: ParsedProperty[];
  units: ParsedUnit[];
  residents: ParsedResident[];
  errors: string[];
  warnings: string[];
  skippedRows: number;
}

const ALL_SUPPORTED_HEADERS = [
  'id_number', 'unit_status', 'first_name', 'last_name', 'email', 'phone', 
  'property_name', 'property_code', 'unit_number', 'unit_type', 'bedrooms', 
  'bathrooms', 'floor', 'move_in_date', 'move_out_date', 'lease_start_date', 
  'lease_end_date', 'lease_term', 'months_at_property', 'is_active',
  'market_rent', 'monthly_rent', 'concession_amount', 'net_effective_rent', 
  'deposit_amount', 'balance_due', 'additional_charges', 'late_fee_count', 
  'loss_to_lease', 'payment_status', 'payment_method', 'last_payment_amount', 
  'last_payment_date', 'auto_pay_enabled', 'delinquency_status', 
  'utilities_account_number', 'renter_insurance_uploaded', 'PSEG_setup',
  'unit_ready_status', 'inspection_completed', 'move_in_checklist_complete', 
  'move_out_checklist_complete', 'smart_access_setup', 'carson_app_setup', 
  'gift_delivered', 'welcome_email_sent', 'assigned_operator_name', 
  'assigned_operator_email', 'assigned_vendor_name', 'assigned_vendor_email',
  'maintenance_provider', 'cleaning_provider', 'employer', 'role',
  'Personal_Information_Address', 'Personal_Information_City', 
  'Personal_Information_State', 'Personal_information_zip',
  'Company_Information_Company', 'Company_Information_Address', 
  'Company_Information_City', 'Company_Information_State',
  'Company_information_Zip', 'Gross Monthly Income', 'Marketing_Source', 
  'Resident_Tags', 'property_type', 'management_company', 'total_units', 
  'address_line_1', 'address_line_2', 'city', 'state', 'zip_code', 
  'timezone', 'default_rent_due_day', 'default_late_fee_policy',
  'maintenance_contact_email', 'cleaning_contact_email', 'on_site_contact_phone',
  'auto_late_fee_threshold', 'auto_legal_threshold', 'allow_guests', 
  'default_inspection_required', 'property_tags', 'super_operator_email', 
  'concierge_available', 'concierge_hours', 'concierge_contact',
  'available_wifi_providers', 'preferred_wifi_provider', 'amenity_wifi_name', 
  'amenity_wifi_password', 'guest_wifi_available', 'wifi_help_contact', 
  'trash_pickup_schedule', 'recycling_schedule', 'move_in_instructions', 
  'package_room_info', 'door_access_system', 'wifi_management_vendor',
  'shared_tv_login_credentials', 'on_site_support_hours',
  'unit_feature_tags', 'lifestyle_tags', 'Custom_Notes'
];

const CSVUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [importResults, setImportResults] = useState<{[key: string]: number}>({});
  const [systemStatus, setSystemStatus] = useState<{
    tablesExist: boolean;
    authWorking: boolean;
    permissionsOk: boolean;
    error?: string;
  } | null>(null);

  // System audit function
  const auditSystem = async () => {
    console.log('🔍 Starting system audit...');
    const status = {
      tablesExist: false,
      authWorking: false,
      permissionsOk: false,
      error: undefined as string | undefined
    };

    try {
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Auth session:', session ? 'Found' : 'Not found');
      status.authWorking = !!session;

      // Check if tables exist and are accessible
      console.log('🔍 Checking table accessibility...');
      
      const tableChecks = await Promise.allSettled([
        supabase.from('api.users').select('count', { count: 'exact', head: true }),
        supabase.from('api.properties').select('count', { count: 'exact', head: true }),
        supabase.from('api.units').select('count', { count: 'exact', head: true }),
        supabase.from('api.residents').select('count', { count: 'exact', head: true })
      ]);

      const allTablesOk = tableChecks.every(result => 
        result.status === 'fulfilled' && !result.value.error
      );

      status.tablesExist = allTablesOk;
      status.permissionsOk = allTablesOk;

      if (!allTablesOk) {
        const errors = tableChecks
          .filter(result => result.status === 'rejected' || result.value.error)
          .map(result => 
            result.status === 'rejected' 
              ? result.reason?.message 
              : result.value.error?.message
          );
        
        status.error = `Table access issues: ${errors.join(', ')}`;
        console.error('❌ Table check errors:', errors);
      } else {
        console.log('✅ All tables accessible');
      }

    } catch (error) {
      console.error('❌ System audit failed:', error);
      status.error = `System audit failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }

    setSystemStatus(status);
    return status;
  };

  const downloadTemplate = () => {
    const csvContent = ALL_SUPPORTED_HEADERS.join(',');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded successfully');
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === 'text/csv') {
      setFile(uploadedFile);
      parseCSV(uploadedFile);
    } else {
      toast.error('Please upload a valid CSV file');
    }
  }, []);

  const parseCSV = (file: File) => {
    setIsProcessing(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => {
        return header.trim().toLowerCase();
      },
      complete: (results) => {
        console.log('Parsed CSV data:', results.data);
        console.log('CSV headers found:', results.meta.fields);
        setCsvData(results.data as CSVRow[]);
        processData(results.data as CSVRow[], results.meta.fields || []);
        setIsProcessing(false);
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        toast.error('Error parsing CSV file');
        setIsProcessing(false);
      }
    });
  };

  const isVacantUnit = (row: CSVRow): boolean => {
    const status = row.unit_status?.toLowerCase().trim();
    const firstName = row.first_name?.trim();
    const lastName = row.last_name?.trim();
    const email = row.email?.trim();
    
    return status === 'vacant' || 
           status === 'available' || 
           status === 'empty' ||
           (!firstName && !lastName && !email);
  };

  const processData = (data: CSVRow[], headers: string[]) => {
    const users: ParsedUser[] = [];
    const properties: ParsedProperty[] = [];
    const units: ParsedUnit[] = [];
    const residents: ParsedResident[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];
    let skippedRows = 0;

    console.log('Processing data with headers:', headers);

    data.forEach((row, index) => {
      const rowNum = index + 2;

      try {
        const isVacant = isVacantUnit(row);
        
        console.log(`Row ${rowNum}: isVacant=${isVacant}, status=${row.unit_status}, first_name=${row.first_name}`);

        if (row.property_name?.trim()) {
          const property: ParsedProperty = {
            property_name: row.property_name.trim(),
            property_code: row.property_code?.trim(),
            address_line_1: row.address_line_1?.trim() || row.personal_information_address?.trim() || 'Address not provided',
            address_line_2: row.address_line_2?.trim(),
            city: row.city?.trim() || row.personal_information_city?.trim() || 'City not provided',
            state: row.state?.trim() || row.personal_information_state?.trim() || 'State not provided',
            zip_code: row.zip_code?.trim() || row.personal_information_zip?.trim() || '00000',
            timezone: row.timezone?.trim() || 'America/New_York',
            management_company: row.management_company?.trim(),
            total_units: row.total_units ? parseInt(row.total_units) : undefined,
            super_operator_email: row.super_operator_email?.trim()
          };

          const existingProperty = properties.find(p => p.property_name === property.property_name);
          if (!existingProperty) {
            properties.push(property);
          }
        }

        if (row.unit_number?.trim()) {
          const unit: ParsedUnit = {
            unit_number: row.unit_number.trim(),
            unit_type: row.unit_type?.trim(),
            bedrooms: row.bedrooms ? parseInt(row.bedrooms) : undefined,
            bathrooms: row.bathrooms ? parseFloat(row.bathrooms) : undefined,
            floor: row.floor ? parseInt(row.floor) : undefined,
            market_rent: row.market_rent ? parseFloat(row.market_rent) : undefined,
            unit_status: row.unit_status?.trim() || (isVacant ? 'vacant' : 'occupied'),
            property_code: row.property_code?.trim()
          };

          const unitKey = `${unit.property_code || 'default'}-${unit.unit_number}`;
          const existingUnit = units.find(u => `${u.property_code || 'default'}-${u.unit_number}` === unitKey);
          if (!existingUnit) {
            units.push(unit);
          }
        }

        if (isVacant) {
          warnings.push(`Row ${rowNum}: Vacant unit detected, skipping resident data`);
          return;
        }

        const firstName = row.first_name?.trim();
        const lastName = row.last_name?.trim();
        const email = row.email?.trim();

        if (!firstName || !lastName || !email) {
          warnings.push(`Row ${rowNum}: Missing required user fields (first_name, last_name, email) - skipping user creation`);
          skippedRows++;
          return;
        }

        const user: ParsedUser = {
          id_number: row.id_number?.trim() || `auto_${Date.now()}_${index}`,
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: row.phone?.trim(),
          role: (row.role?.trim() as AppRole) || 'resident',
          assigned_operator_email: row.assigned_operator_email?.trim(),
          assigned_vendor_email: row.assigned_vendor_email?.trim(),
          employer: row.employer?.trim(),
          is_active: row.is_active?.toLowerCase().trim() === 'true' || true
        };

        const validRoles = ['super_admin', 'senior_operator', 'operator', 'maintenance', 'leasing', 'resident', 'prospect', 'vendor'];
        if (row.role?.trim() && !validRoles.includes(user.role)) {
          warnings.push(`Row ${rowNum}: Invalid role '${row.role}', defaulting to 'resident'`);
          user.role = 'resident';
        }

        users.push(user);

        if (user.role === 'resident' && row.unit_number?.trim()) {
          const resident: ParsedResident = {
            id_number: user.id_number,
            unit_number: row.unit_number.trim(),
            property_code: row.property_code?.trim(),
            move_in_date: row.move_in_date?.trim(),
            lease_start_date: row.lease_start_date?.trim(),
            lease_end_date: row.lease_end_date?.trim(),
            monthly_rent: row.monthly_rent ? parseFloat(row.monthly_rent) : undefined,
            deposit_amount: row.deposit_amount ? parseFloat(row.deposit_amount) : undefined,
            balance_due: row.balance_due ? parseFloat(row.balance_due) : undefined,
            renter_insurance_uploaded: row.renter_insurance_uploaded?.toLowerCase().trim() === 'true',
            move_in_checklist_complete: row.move_in_checklist_complete?.toLowerCase().trim() === 'true',
            move_out_checklist_complete: row.move_out_checklist_complete?.toLowerCase().trim() === 'true'
          };

          residents.push(resident);
        }

      } catch (error) {
        warnings.push(`Row ${rowNum}: Error processing data - ${error}`);
        skippedRows++;
      }
    });

    if (users.length === 0 && properties.length === 0 && units.length === 0) {
      errors.push('No valid data found to import. Please check your CSV format.');
    }

    setProcessingResult({
      users,
      properties,
      units,
      residents,
      errors,
      warnings,
      skippedRows
    });

    setShowPreview(true);
  };

  const handleImport = async () => {
    if (!processingResult) return;

    // Run system audit first
    console.log('🔍 Running pre-import system audit...');
    const systemCheck = await auditSystem();
    
    if (!systemCheck.tablesExist || !systemCheck.permissionsOk) {
      toast.error(`System not ready for import: ${systemCheck.error || 'Unknown issue'}`);
      return;
    }

    if (!systemCheck.authWorking) {
      toast.error('Authentication required. Please make sure you are logged in.');
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      console.log('🚀 Starting import with system check passed...');
      let importedCounts = { users: 0, properties: 0, units: 0, residents: 0 };
      const detailedErrors: string[] = [];
      
      // Import properties first
      setUploadProgress(15);
      if (processingResult.properties.length > 0) {
        console.log('📍 Importing properties:', processingResult.properties.length);
        
        for (const property of processingResult.properties) {
          try {
            console.log(`Creating property: ${property.property_name}`);
            
            const { data, error } = await supabase
              .from('api.properties')
              .upsert({
                name: property.property_name,
                address: `${property.address_line_1}${property.address_line_2 ? ', ' + property.address_line_2 : ''}, ${property.city}, ${property.state} ${property.zip_code}`,
                timezone: property.timezone || 'America/New_York',
                management_company: property.management_company,
              }, {
                onConflict: 'name',
                ignoreDuplicates: false
              })
              .select();

            if (error) {
              console.error('❌ Property upsert error:', error);
              detailedErrors.push(`Property "${property.property_name}": ${error.message} (Code: ${error.code})`);
            } else {
              console.log('✅ Successfully upserted property:', property.property_name);
              importedCounts.properties++;
            }
          } catch (error) {
            console.error('❌ Exception importing property:', property.property_name, error);
            detailedErrors.push(`Property "${property.property_name}": ${error}`);
          }
        }
      }
      
      // Get all properties for linking
      console.log('🔍 Fetching properties for linking...');
      const { data: allProperties, error: propError } = await supabase
        .from('api.properties')
        .select('id, name');
      
      if (propError) {
        console.error('❌ Error fetching properties:', propError);
        detailedErrors.push(`Failed to fetch properties: ${propError.message}`);
      }
      
      // Import units
      setUploadProgress(35);
      if (processingResult.units.length > 0) {
        console.log('📍 Importing units:', processingResult.units.length);
        
        for (const unit of processingResult.units) {
          try {
            console.log(`Creating unit: ${unit.unit_number}`);
            
            // Find property by name
            const propertyName = processingResult.properties.find(p => 
              p.property_code === unit.property_code
            )?.property_name;
            
            const property = allProperties?.find(p => 
              p.name === propertyName || 
              (unit.property_code && p.name.includes(unit.property_code))
            );
            
            if (!property) {
              detailedErrors.push(`Unit ${unit.unit_number}: No matching property found`);
              continue;
            }

            // Convert unit status to match enum
            let unitStatus = 'available';
            if (unit.unit_status) {
              const status = unit.unit_status.toLowerCase();
              if (['occupied', 'maintenance', 'turn', 'leased_not_moved_in', 'off_market'].includes(status)) {
                unitStatus = status;
              } else if (['vacant', 'empty'].includes(status)) {
                unitStatus = 'available';
              }
            }

            const { data, error } = await supabase
              .from('api.units')
              .upsert({
                property_id: property?.id,
                unit_number: unit.unit_number,
                floor: unit.floor,
                bedroom_type: unit.bedrooms?.toString(),
                bath_type: unit.bathrooms?.toString(),
                sq_ft: unit.market_rent, 
                status: unitStatus
              }, {
                onConflict: 'property_id,unit_number',
                ignoreDuplicates: false
              })
              .select();

            if (error) {
              console.error('❌ Unit upsert error:', error);
              detailedErrors.push(`Unit ${unit.unit_number}: ${error.message} (Code: ${error.code})`);
            } else {
              console.log('✅ Successfully upserted unit:', unit.unit_number);
              importedCounts.units++;
            }
          } catch (error) {
            console.error('❌ Exception importing unit:', unit.unit_number, error);
            detailedErrors.push(`Unit ${unit.unit_number}: ${error}`);
          }
        }
      }
      
      // Import users
      setUploadProgress(65);
      if (processingResult.users.length > 0) {
        console.log('👥 Importing users:', processingResult.users.length);
        
        for (const user of processingResult.users) {
          try {
            console.log(`Creating user: ${user.email}`);
            
            const { data, error } = await supabase
              .from('api.users')
              .upsert({
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone || null,
                role: user.role,
              }, {
                onConflict: 'email',
                ignoreDuplicates: false
              })
              .select();

            if (error) {
              console.error('❌ User upsert error:', error);
              detailedErrors.push(`User ${user.email}: ${error.message} (Code: ${error.code})`);
            } else {
              console.log('✅ Successfully upserted user:', user.email);
              importedCounts.users++;
            }
          } catch (error) {
            console.error('❌ Exception importing user:', user.email, error);
            detailedErrors.push(`User ${user.email}: ${error}`);
          }
        }
      }
      
      // Get all data for resident linking
      console.log('🔍 Fetching users and units for linking...');
      const { data: allUsers, error: userError } = await supabase
        .from('api.users')
        .select('id, email');
        
      if (userError) {
        console.error('❌ Error fetching users:', userError);
        detailedErrors.push(`Failed to fetch users: ${userError.message}`);
      }
      
      const { data: allUnits, error: unitError } = await supabase
        .from('api.units')
        .select('id, unit_number, property_id');
      
      if (unitError) {
        console.error('❌ Error fetching units:', unitError);
        detailedErrors.push(`Failed to fetch units: ${unitError.message}`);
      }
      
      // Import residents
      setUploadProgress(85);
      if (processingResult.residents.length > 0) {
        console.log('📍 Importing residents:', processingResult.residents.length);
        
        for (const resident of processingResult.residents) {
          try {
            // Find user by email
            const user = allUsers?.find(u => 
              processingResult.users.find(pu => 
                pu.id_number === resident.id_number && pu.email === u.email
              )
            );
            
            if (!user) {
              detailedErrors.push(`Resident ${resident.id_number}: No matching user found`);
              continue;
            }

            // Find property and unit
            const propertyName = processingResult.properties.find(p => 
              p.property_code === resident.property_code
            )?.property_name;
            
            const property = allProperties?.find(p => 
              p.name === propertyName || 
              (resident.property_code && p.name.includes(resident.property_code))
            );
            
            const unit = allUnits?.find(u => 
              u.unit_number === resident.unit_number && 
              u.property_id === property?.id
            );

            const { data, error } = await supabase
              .from('api.residents')
              .upsert({
                user_id: user.id,
                property_id: property?.id || null,
                unit_id: unit?.id || null,
                lease_start: resident.lease_start_date ? new Date(resident.lease_start_date).toISOString().split('T')[0] : null,
                lease_end: resident.lease_end_date ? new Date(resident.lease_end_date).toISOString().split('T')[0] : null,
                status: 'active',
                insurance_uploaded: resident.renter_insurance_uploaded || false,
                move_in_checklist_complete: resident.move_in_checklist_complete || false,
                move_out_checklist_complete: resident.move_out_checklist_complete || false,
              }, {
                onConflict: 'user_id',
                ignoreDuplicates: false
              })
              .select();

            if (error) {
              console.error('❌ Resident upsert error:', error);
              detailedErrors.push(`Resident ${resident.id_number}: ${error.message} (Code: ${error.code})`);
            } else {
              console.log('✅ Successfully upserted resident:', resident.id_number);
              importedCounts.residents++;
            }
          } catch (error) {
            console.error('❌ Exception importing resident:', resident.id_number, error);
            detailedErrors.push(`Resident ${resident.id_number}: ${error}`);
          }
        }
      }

      setUploadProgress(100);
      setImportResults(importedCounts);

      const totalImported = Object.values(importedCounts).reduce((sum, count) => sum + count, 0);
      const errorCount = detailedErrors.length;
      
      console.log('📊 Import Summary:', {
        totalImported,
        errorCount,
        details: importedCounts,
        errors: detailedErrors
      });
      
      if (totalImported > 0) {
        toast.success(`Successfully imported ${totalImported} records! Details: ${importedCounts.users} users, ${importedCounts.properties} properties, ${importedCounts.units} units, ${importedCounts.residents} residents.`);
        
        if (errorCount > 0) {
          console.warn('⚠️ Import errors:', detailedErrors);
          toast.warning(`${errorCount} records had issues. Check console for details.`);
        }
      } else {
        toast.error(`No records were imported. ${errorCount} errors occurred. Check console for details.`);
        console.error('❌ All import errors:', detailedErrors);
      }
      
      // Reset form
      setFile(null);
      setCsvData([]);
      setProcessingResult(null);
      setShowPreview(false);
      
      // Refresh the page to show new data
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('💥 Critical import error:', error);
      toast.error(`Critical import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bulk Data Import</h2>
          <p className="text-gray-600">Upload CSV files to bulk import users, properties, and units</p>
          <p className="text-sm text-gray-500 mt-1">
            Smart processing: vacant units are detected automatically, incomplete rows are skipped intelligently
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={auditSystem} variant="outline" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Test System
          </Button>
          <Button onClick={downloadTemplate} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Template
          </Button>
        </div>
      </div>

      {/* System Status Display */}
      {systemStatus && (
        <Card className={`border-2 ${systemStatus.tablesExist && systemStatus.authWorking && systemStatus.permissionsOk ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {systemStatus.tablesExist && systemStatus.authWorking && systemStatus.permissionsOk ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {systemStatus.authWorking ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                <span>Authentication: {systemStatus.authWorking ? 'Working' : 'Not authenticated'}</span>
              </div>
              <div className="flex items-center gap-2">
                {systemStatus.tablesExist ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                <span>Database Tables: {systemStatus.tablesExist ? 'Available' : 'Missing or inaccessible'}</span>
              </div>
              <div className="flex items-center gap-2">
                {systemStatus.permissionsOk ? <CheckCircle className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                <span>Permissions: {systemStatus.permissionsOk ? 'OK' : 'Access denied'}</span>
              </div>
              {systemStatus.error && (
                <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-sm text-red-800">
                  <strong>Error:</strong> {systemStatus.error}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload CSV File
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csv-upload"
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                {file ? file.name : 'Choose CSV file to upload'}
              </p>
              <p className="text-sm text-gray-500">
                Supports all {ALL_SUPPORTED_HEADERS.length} standard columns with intelligent data detection
              </p>
            </label>
          </div>
          
          {isProcessing && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Processing CSV file...</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {showPreview && processingResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Import Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-blue-900">{processingResult.users.length}</div>
                <div className="text-sm text-blue-700">Users</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <Building2 className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-green-900">{processingResult.properties.length}</div>
                <div className="text-sm text-green-700">Properties</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <Home className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-purple-900">{processingResult.units.length}</div>
                <div className="text-sm text-purple-700">Units</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold text-orange-900">{processingResult.residents.length}</div>
                <div className="text-sm text-orange-700">Residents</div>
              </div>
            </div>

            {processingResult.skippedRows > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Smart Processing Summary</span>
                </div>
                <p className="text-sm text-blue-800">
                  Successfully processed {processingResult.users.length + processingResult.properties.length + processingResult.units.length} records. 
                  {processingResult.skippedRows > 0 && ` Intelligently skipped ${processingResult.skippedRows} problematic rows.`}
                </p>
              </div>
            )}

            {processingResult.errors.length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <div className="font-medium mb-2">Critical Errors ({processingResult.errors.length}):</div>
                  <ScrollArea className="h-32">
                    <ul className="space-y-1 text-sm">
                      {processingResult.errors.map((error, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-600">•</span>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </AlertDescription>
              </Alert>
            )}

            {processingResult.warnings.length > 0 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <div className="font-medium mb-2">Processing Notes ({processingResult.warnings.length}):</div>
                  <ScrollArea className="h-24">
                    <ul className="space-y-1 text-sm">
                      {processingResult.warnings.map((warning, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-yellow-600">•</span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </ScrollArea>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Sample Records:</h4>
              <ScrollArea className="h-64 border rounded-lg">
                <div className="p-4 space-y-4">
                  {processingResult.users.slice(0, 3).map((user, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{user.role}</Badge>
                        <span className="font-medium">{user.first_name} {user.last_name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {user.email} • ID: {user.id_number}
                      </div>
                    </div>
                  ))}
                  {processingResult.users.length > 3 && (
                    <div className="text-sm text-gray-500 text-center">
                      ... and {processingResult.users.length - 3} more records
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="flex items-center justify-end gap-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowPreview(false);
                  setProcessingResult(null);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleImport}
                disabled={processingResult.errors.length > 0 || isProcessing}
                className="flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Importing to Database...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Import {processingResult.users.length + processingResult.properties.length + processingResult.units.length} Records to Database
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CSVUploader;
