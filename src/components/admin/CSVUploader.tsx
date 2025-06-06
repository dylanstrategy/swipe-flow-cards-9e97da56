import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Download, AlertCircle, CheckCircle, FileText } from 'lucide-react';
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
  const [useAdvancedIngestion, setUseAdvancedIngestion] = useState(false);
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
        'property_name,property_code,address_line_1,city,state,zip_code,timezone,property_type,door_access_system,on_site_support_hours,property_tags',
        'Le Leo,210,123 Main St,Jersey City,NJ,07302,America/New_York,apartment,ButterflyMX,"Mon-Fri 9am-6pm","concierge,secure-entry"'
      ],
      units: [
        'property_code,unit_number,unit_type,bedrooms,bathrooms,floor,sq_ft,market_rent,unit_status,unit_ready_status',
        '210,201,1B,1,1,2,660,2450,available,ready',
        '210,202,1B,1,1,2,660,2450,available,ready'
      ],
      residents: [
        'email,first_name,last_name,phone,unit_number,property_code,move_in_date,lease_start_date,lease_end_date,lease_term,monthly_rent,concession_amount,payment_status,status',
        'kiana@example.com,Kiana,Taveras,2012120935,201,210,2024-06-01,2024-06-01,2025-05-31,12,2450,0,current,active',
        'john@example.com,John,Smith,5551234567,202,210,2024-07-01,2024-07-01,2025-06-30,12,2450,100,current,active'
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

  const uploadFileToStorage = async (file: File): Promise<string> => {
    const fileName = `${Date.now()}_${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from('admin-uploads')
      .upload(fileName, file);

    if (uploadError) {
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    return fileName;
  };

  const processResidentsWithEdgeFunction = async (fileName: string): Promise<ImportResult> => {
    console.log('Calling ingest_residents Edge function with file:', fileName);
    
    const { data, error } = await supabase.functions.invoke('ingest_residents', {
      body: { file_path: fileName }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(`Edge function failed: ${error.message}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Edge function returned failure');
    }

    return {
      successful: data.successful,
      failed: data.failed,
      errors: data.errors || []
    };
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
        if (!row.property_name || !row.property_code || !row.address_line_1 || !row.city || !row.state || !row.zip_code) {
          throw new Error('Missing required fields: property_name, property_code, address_line_1, city, state, zip_code');
        }

        const propertyData = {
          property_name: row.property_name?.trim(),
          property_code: row.property_code?.trim(),
          address_line_1: row.address_line_1?.trim(),
          city: row.city?.trim(),
          state: row.state?.trim(),
          zip_code: row.zip_code?.trim(),
          timezone: row.timezone?.trim() || 'America/New_York',
          property_type: row.property_type?.trim() || 'apartment',
          door_access_system: row.door_access_system?.trim() || null,
          on_site_support_hours: row.on_site_support_hours?.trim() || null,
          property_tags: row.property_tags ? row.property_tags.split(',').map((tag: string) => tag.trim()) : null
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
        if (!row.property_code || !row.unit_number) {
          throw new Error('Missing required fields: property_code, unit_number');
        }

        // First, find the property by property_code
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('id')
          .eq('property_code', row.property_code.trim())
          .single();

        if (propertyError || !propertyData) {
          throw new Error(`Property with code "${row.property_code}" not found`);
        }

        const unitData = {
          property_id: propertyData.id,
          unit_number: row.unit_number?.trim(),
          unit_type: row.unit_type?.trim() || null,
          bedrooms: row.bedrooms ? parseInt(row.bedrooms) : null,
          bathrooms: row.bathrooms ? parseFloat(row.bathrooms) : null,
          floor: row.floor ? parseInt(row.floor) : null,
          sq_ft: row.sq_ft ? parseFloat(row.sq_ft) : null,
          market_rent: row.market_rent ? parseFloat(row.market_rent) : null,
          unit_status: validateUnitStatus(row.unit_status?.trim() || 'available'),
          unit_ready_status: row.unit_ready_status?.trim() || 'ready'
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
        if (!row.property_code || !row.first_name || !row.last_name || !row.email) {
          throw new Error('Missing required fields: property_code, first_name, last_name, email');
        }

        // Find the property
        const { data: propertyData, error: propertyError } = await supabase
          .from('properties')
          .select('id')
          .eq('property_code', row.property_code.trim())
          .single();

        if (propertyError || !propertyData) {
          throw new Error(`Property with code "${row.property_code}" not found`);
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
            throw new Error(`Unit "${row.unit_number}" not found in property "${row.property_code}"`);
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

      // For residents with advanced ingestion enabled, use the Edge function
      if (importType === 'residents' && useAdvancedIngestion) {
        const fileName = await uploadFileToStorage(selectedFile);
        const result = await processResidentsWithEdgeFunction(fileName);
        setImportResult(result);
        
        toast({
          title: "Import completed via Edge Function",
          description: `Successfully imported ${result.successful} residents. ${result.failed} failed.`,
          variant: result.failed > 0 ? "default" : "default",
        });
        
        return;
      }

      // Standard CSV processing
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

          {importType === 'residents' && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="advancedIngestion"
                checked={useAdvancedIngestion}
                onChange={(e) => setUseAdvancedIngestion(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="advancedIngestion" className="text-sm">
                Use Advanced Ingestion (Edge Function with auto user creation)
              </Label>
            </div>
          )}

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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Upload Workflow Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Phase 3: Upload Workflow by Stage</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div><strong>Step 1:</strong> Upload Properties (properties_upload.csv)</div>
                <div><strong>Step 2:</strong> Upload Units (units_upload.csv)</div>
                <div><strong>Step 3:</strong> Upload Residents/Rent Roll (residents_upload.csv)</div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Advanced Resident Ingestion</h3>
              <p className="text-sm text-green-800">
                When enabled, the system will automatically create user accounts for residents and link them properly.
                This uses the Edge Function for more robust processing and better error handling.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CSVUploader;
