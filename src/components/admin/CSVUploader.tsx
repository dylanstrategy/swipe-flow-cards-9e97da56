import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';
import type { AppRole, UnitStatus } from '@/types/supabase';

type ImportType = 'users' | 'properties' | 'units' | 'residents';

interface ImportResult {
  successful: number;
  failed: number;
  errors: string[];
}

const CSVUploader = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<ImportType>('users');
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
    setImportResult(null);
  };

  const downloadTemplate = (type: ImportType) => {
    const templates = {
      users: [
        'first_name,last_name,email,phone,role,company_domain',
        'John,Doe,john.doe@example.com,555-0123,resident,',
        'Jane,Smith,jane.smith@example.com,555-0124,operator,property-management.com'
      ],
      properties: [
        'property_name,address_line_1,city,state,zip_code,timezone,website,management_company,property_manager_name,property_manager_email,property_manager_phone,emergency_contact,emergency_phone,maintenance_company,maintenance_contact,maintenance_phone,leasing_office_hours,amenities,parking_info,pet_policy,smoking_policy,special_instructions',
        'Sunset Apartments,123 Main St,City,State,12345,America/New_York,https://sunset-apts.com,ABC Property Management,John Manager,john@abc-pm.com,555-0100,Emergency Line,555-0911,Fix-It-All,Bob Maintenance,555-0200,Mon-Fri: 9AM-6PM\\, Sat: 10AM-4PM,Pool\\, Gym\\, Concierge,Covered parking available,$50/month,Pets allowed with deposit,No smoking in units,Key pickup at front desk'
      ],
      units: [
        'property_name,unit_number,unit_type,bedrooms,bathrooms,sq_ft,floor,unit_status,market_rent',
        'Sunset Apartments,101,1BR,1,1,850,1,available,2500.00',
        'Sunset Apartments,102,2BR,2,2,1200,1,occupied,3200.00'
      ],
      residents: [
        'property_name,unit_number,first_name,last_name,email,phone,lease_start_date,lease_end_date,monthly_rent,move_in_date,is_active',
        'Sunset Apartments,101,John,Doe,john.doe@example.com,555-0123,2024-01-01,2024-12-31,2500.00,2024-01-01,true',
        'Sunset Apartments,102,Jane,Smith,jane.smith@example.com,555-0124,2024-02-01,2025-01-31,3200.00,2024-02-01,true'
      ]
    };

    const csvContent = templates[type].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}_template.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const validateRole = (role: string): AppRole => {
    const validRoles: AppRole[] = ['super_admin', 'senior_operator', 'operator', 'maintenance', 'leasing', 'prospect', 'resident', 'former_resident', 'vendor'];
    return validRoles.includes(role as AppRole) ? role as AppRole : 'prospect';
  };

  const validateUnitStatus = (status: string): UnitStatus => {
    const validStatuses: UnitStatus[] = ['available', 'occupied', 'maintenance', 'turn', 'leased_not_moved_in', 'off_market'];
    return validStatuses.includes(status as UnitStatus) ? status as UnitStatus : 'available';
  };

  const processUsers = async (data: any[]): Promise<ImportResult> => {
    let successful = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        if (!row.first_name || !row.last_name || !row.email) {
          throw new Error('Missing required fields: first_name, last_name, email');
        }

        const userData = {
          first_name: row.first_name?.trim(),
          last_name: row.last_name?.trim(),
          email: row.email?.trim().toLowerCase(),
          phone: row.phone?.trim() || null,
          role: validateRole(row.role?.trim() || 'prospect'),
          company_domain: row.company_domain?.trim() || null
        };

        console.log(`Creating user ${i + 1}:`, userData);

        const { error } = await supabase
          .from('users')
          .insert([userData]);

        if (error) {
          throw error;
        }

        successful++;
      } catch (error: any) {
        failed++;
        const errorMessage = `Row ${i + 1}: ${error.message}`;
        errors.push(errorMessage);
        console.error(`Error processing user row ${i + 1}:`, error);
      }
    }

    return { successful, failed, errors };
  };

  const processProperties = async (data: any[]): Promise<ImportResult> => {
    let successful = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        if (!row.property_name || !row.address_line_1 || !row.city || !row.state || !row.zip_code) {
          throw new Error('Missing required fields: property_name, address_line_1, city, state, zip_code');
        }

        const propertyData = {
          property_name: row.property_name?.trim(),
          address_line_1: row.address_line_1?.trim(),
          address_line_2: row.address_line_2?.trim() || null,
          city: row.city?.trim(),
          state: row.state?.trim(),
          zip_code: row.zip_code?.trim(),
          timezone: row.timezone?.trim() || 'America/New_York',
          website: row.website?.trim() || null,
          management_company: row.management_company?.trim() || null,
          property_manager_name: row.property_manager_name?.trim() || null,
          property_manager_email: row.property_manager_email?.trim() || null,
          property_manager_phone: row.property_manager_phone?.trim() || null,
          emergency_contact: row.emergency_contact?.trim() || null,
          emergency_phone: row.emergency_phone?.trim() || null,
          maintenance_company: row.maintenance_company?.trim() || null,
          maintenance_contact: row.maintenance_contact?.trim() || null,
          maintenance_phone: row.maintenance_phone?.trim() || null,
          leasing_office_hours: row.leasing_office_hours?.trim() || null,
          amenities: row.amenities?.trim() || null,
          parking_info: row.parking_info?.trim() || null,
          pet_policy: row.pet_policy?.trim() || null,
          smoking_policy: row.smoking_policy?.trim() || null,
          special_instructions: row.special_instructions?.trim() || null
        };

        console.log(`Creating property ${i + 1}:`, propertyData);

        const { error } = await supabase
          .from('properties')
          .insert([propertyData]);

        if (error) {
          throw error;
        }

        successful++;
      } catch (error: any) {
        failed++;
        const errorMessage = `Row ${i + 1}: ${error.message}`;
        errors.push(errorMessage);
        console.error(`Error processing property row ${i + 1}:`, error);
      }
    }

    return { successful, failed, errors };
  };

  const processUnits = async (data: any[]): Promise<ImportResult> => {
    let successful = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        if (!row.property_name || !row.unit_number) {
          throw new Error('Missing required fields: property_name, unit_number');
        }

        // First, find the property by name
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('id')
          .eq('property_name', row.property_name.trim())
          .single();

        if (propertyError || !propertyData) {
          throw new Error(`Property "${row.property_name}" not found`);
        }

        const unitData = {
          property_id: propertyData.id,
          unit_number: row.unit_number?.trim(),
          unit_type: row.unit_type?.trim() || null,
          bedrooms: row.bedrooms ? parseInt(row.bedrooms) : null,
          bathrooms: row.bathrooms ? parseFloat(row.bathrooms) : null,
          sq_ft: row.sq_ft ? parseFloat(row.sq_ft) : null,
          floor: row.floor ? parseInt(row.floor) : null,
          unit_status: validateUnitStatus(row.unit_status?.trim() || 'available'),
          market_rent: row.market_rent ? parseFloat(row.market_rent) : null
        };

        console.log(`Creating unit ${i + 1}:`, unitData);

        const { error } = await supabase
          .from('units')
          .insert([unitData]);

        if (error) {
          throw error;
        }

        successful++;
      } catch (error: any) {
        failed++;
        const errorMessage = `Row ${i + 1}: ${error.message}`;
        errors.push(errorMessage);
        console.error(`Error processing unit row ${i + 1}:`, error);
      }
    }

    return { successful, failed, errors };
  };

  const processResidents = async (data: any[]): Promise<ImportResult> => {
    let successful = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      try {
        if (!row.property_name || !row.first_name || !row.last_name || !row.email) {
          throw new Error('Missing required fields: property_name, first_name, last_name, email');
        }

        // Find the property
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('id')
          .eq('property_name', row.property_name.trim())
          .single();

        if (propertyError || !propertyData) {
          throw new Error(`Property "${row.property_name}" not found`);
        }

        // Find the unit if specified
        let unitId = null;
        if (row.unit_number) {
          const { data: unitData, error: unitError } = await supabase
            .from('units')
            .select('id')
            .eq('property_id', propertyData.id)
            .eq('unit_number', row.unit_number.trim())
            .single();

          if (unitError || !unitData) {
            throw new Error(`Unit "${row.unit_number}" not found in property "${row.property_name}"`);
          }
          unitId = unitData.id;
        }

        const residentData = {
          property_id: propertyData.id,
          unit_id: unitId,
          first_name: row.first_name?.trim(),
          last_name: row.last_name?.trim(),
          email: row.email?.trim().toLowerCase(),
          phone: row.phone?.trim() || null,
          lease_start_date: row.lease_start_date ? new Date(row.lease_start_date).toISOString().split('T')[0] : null,
          lease_end_date: row.lease_end_date ? new Date(row.lease_end_date).toISOString().split('T')[0] : null,
          monthly_rent: row.monthly_rent ? parseFloat(row.monthly_rent) : null,
          move_in_date: row.move_in_date ? new Date(row.move_in_date).toISOString().split('T')[0] : null,
          is_active: row.is_active ? row.is_active.toLowerCase() === 'true' : true
        };

        console.log(`Creating resident ${i + 1}:`, residentData);

        const { error } = await supabase
          .from('residents')
          .insert([residentData]);

        if (error) {
          throw error;
        }

        successful++;
      } catch (error: any) {
        failed++;
        const errorMessage = `Row ${i + 1}: ${error.message}`;
        errors.push(errorMessage);
        console.error(`Error processing resident row ${i + 1}:`, error);
      }
    }

    return { successful, failed, errors };
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setImportResult(null);

    try {
      console.log(`Starting ${importType} import from file:`, selectedFile.name);

      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase(),
        complete: async (results) => {
          try {
            if (results.errors.length > 0) {
              console.error('CSV parsing errors:', results.errors);
              throw new Error(`CSV parsing failed: ${results.errors[0].message}`);
            }

            if (!results.data || results.data.length === 0) {
              throw new Error('No data found in CSV file');
            }

            console.log(`Parsed ${results.data.length} rows from CSV`);
            console.log('Sample data:', results.data[0]);

            let result: ImportResult;

            switch (importType) {
              case 'users':
                result = await processUsers(results.data);
                break;
              case 'properties':
                result = await processProperties(results.data);
                break;
              case 'units':
                result = await processUnits(results.data);
                break;
              case 'residents':
                result = await processResidents(results.data);
                break;
              default:
                throw new Error(`Unsupported import type: ${importType}`);
            }

            setImportResult(result);

            toast({
              title: "Import completed",
              description: `Successfully imported ${result.successful} ${importType}. ${result.failed} failed.`,
              variant: result.failed > 0 ? "default" : "default",
            });

          } catch (error: any) {
            console.error('Import error:', error);
            setImportResult({
              successful: 0,
              failed: 1,
              errors: [error.message]
            });

            toast({
              title: "Import failed",
              description: error.message,
              variant: "destructive",
            });
          } finally {
            setIsUploading(false);
          }
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          toast({
            title: "File parsing failed",
            description: "Could not parse the CSV file. Please check the format.",
            variant: "destructive",
          });
          setIsUploading(false);
        }
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Bulk Import Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="importType">Import Type</Label>
            <Select value={importType} onValueChange={(value) => setImportType(value as ImportType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="properties">Properties</SelectItem>
                <SelectItem value="units">Units</SelectItem>
                <SelectItem value="residents">Residents</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="csvFile">CSV File</Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1"
            >
              {isUploading ? 'Importing...' : `Import ${importType}`}
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadTemplate(importType)}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Template
            </Button>
          </div>

          {importResult && (
            <Alert className={importResult.failed > 0 ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}>
              <div className="flex items-center gap-2">
                {importResult.failed > 0 ? (
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                <AlertDescription className={importResult.failed > 0 ? "text-orange-800" : "text-green-800"}>
                  <div className="font-medium mb-1">
                    Import Results: {importResult.successful} successful, {importResult.failed} failed
                  </div>
                  {importResult.errors.length > 0 && (
                    <div className="text-sm">
                      <div className="font-medium mb-1">Errors:</div>
                      <ul className="list-disc list-inside space-y-1">
                        {importResult.errors.slice(0, 5).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                        {importResult.errors.length > 5 && (
                          <li>... and {importResult.errors.length - 5} more errors</li>
                        )}
                      </ul>
                    </div>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CSVUploader;
