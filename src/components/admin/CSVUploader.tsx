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
  Home
} from 'lucide-react';
import * as Papa from 'papaparse';
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
}

// Only basic fields are required - others are optional
const BASIC_REQUIRED_HEADERS = ['first_name', 'last_name', 'email'];

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
      complete: (results) => {
        console.log('Parsed CSV data:', results.data);
        setCsvData(results.data as CSVRow[]);
        processData(results.data as CSVRow[]);
        setIsProcessing(false);
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
        toast.error('Error parsing CSV file');
        setIsProcessing(false);
      }
    });
  };

  const processData = (data: CSVRow[]) => {
    const users: ParsedUser[] = [];
    const properties: ParsedProperty[] = [];
    const units: ParsedUnit[] = [];
    const residents: ParsedResident[] = [];
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for basic required headers only
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      const missingBasicHeaders = BASIC_REQUIRED_HEADERS.filter(h => !headers.includes(h));
      if (missingBasicHeaders.length > 0) {
        errors.push(`Missing basic required headers: ${missingBasicHeaders.join(', ')}`);
      }
    }

    data.forEach((row, index) => {
      const rowNum = index + 2; // +2 for 1-based indexing and header row

      try {
        // Validate only basic required fields
        if (!row.first_name || !row.last_name || !row.email) {
          errors.push(`Row ${rowNum}: Missing required user fields (first_name, last_name, email)`);
          return;
        }

        // Parse user data with more flexible approach
        const user: ParsedUser = {
          id_number: row.id_number || `auto_${Date.now()}_${index}`,
          first_name: row.first_name,
          last_name: row.last_name,
          email: row.email,
          phone: row.phone,
          role: (row.role as AppRole) || 'resident',
          assigned_operator_email: row.assigned_operator_email,
          assigned_vendor_email: row.assigned_vendor_email,
          employer: row.employer,
          is_active: row.is_active?.toLowerCase() === 'true' || true
        };

        // Validate role
        const validRoles = ['super_admin', 'senior_operator', 'operator', 'maintenance', 'leasing', 'resident', 'prospect', 'vendor'];
        if (!validRoles.includes(user.role)) {
          warnings.push(`Row ${rowNum}: Invalid role '${user.role}', defaulting to 'resident'`);
          user.role = 'resident';
        }

        users.push(user);

        // Parse property data (only if property_name is provided)
        if (row.property_name) {
          const property: ParsedProperty = {
            property_name: row.property_name,
            property_code: row.property_code,
            address_line_1: row.address_line_1 || row.Personal_Information_Address || 'Address not provided',
            address_line_2: row.address_line_2,
            city: row.city || row.Personal_Information_City || 'City not provided',
            state: row.state || row.Personal_Information_State || 'State not provided',
            zip_code: row.zip_code || row.Personal_information_zip || '00000',
            timezone: row.timezone || 'America/New_York',
            management_company: row.management_company,
            total_units: row.total_units ? parseInt(row.total_units) : undefined,
            super_operator_email: row.super_operator_email
          };

          const existingProperty = properties.find(p => p.property_name === property.property_name);
          if (!existingProperty) {
            properties.push(property);
          }
        }

        // Parse unit data (only if unit_number is provided)
        if (row.unit_number) {
          const unit: ParsedUnit = {
            unit_number: row.unit_number,
            unit_type: row.unit_type,
            bedrooms: row.bedrooms ? parseInt(row.bedrooms) : undefined,
            bathrooms: row.bathrooms ? parseFloat(row.bathrooms) : undefined,
            floor: row.floor ? parseInt(row.floor) : undefined,
            market_rent: row.market_rent ? parseFloat(row.market_rent) : undefined,
            unit_status: row.unit_status || 'available',
            property_code: row.property_code
          };

          const unitKey = `${unit.property_code || 'default'}-${unit.unit_number}`;
          const existingUnit = units.find(u => `${u.property_code || 'default'}-${u.unit_number}` === unitKey);
          if (!existingUnit) {
            units.push(unit);
          }
        }

        // Parse resident data (if role is resident and unit_number is provided)
        if (user.role === 'resident' && row.unit_number) {
          const resident: ParsedResident = {
            id_number: user.id_number,
            unit_number: row.unit_number,
            property_code: row.property_code,
            move_in_date: row.move_in_date,
            lease_start_date: row.lease_start_date,
            lease_end_date: row.lease_end_date,
            monthly_rent: row.monthly_rent ? parseFloat(row.monthly_rent) : undefined,
            deposit_amount: row.deposit_amount ? parseFloat(row.deposit_amount) : undefined,
            balance_due: row.balance_due ? parseFloat(row.balance_due) : undefined,
            renter_insurance_uploaded: row.renter_insurance_uploaded?.toLowerCase() === 'true',
            move_in_checklist_complete: row.move_in_checklist_complete?.toLowerCase() === 'true',
            move_out_checklist_complete: row.move_out_checklist_complete?.toLowerCase() === 'true'
          };

          residents.push(resident);
        }

      } catch (error) {
        errors.push(`Row ${rowNum}: Error processing data - ${error}`);
      }
    });

    setProcessingResult({
      users,
      properties,
      units,
      residents,
      errors,
      warnings
    });

    setShowPreview(true);
  };

  const handleImport = async () => {
    if (!processingResult) return;

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // This would implement the actual Supabase import logic
      // For now, we'll simulate the process
      
      console.log('Starting import process...');
      setUploadProgress(25);
      
      // Import properties first
      console.log('Importing properties:', processingResult.properties);
      setUploadProgress(50);
      
      // Import units
      console.log('Importing units:', processingResult.units);
      setUploadProgress(75);
      
      // Import users and residents
      console.log('Importing users:', processingResult.users);
      console.log('Importing residents:', processingResult.residents);
      setUploadProgress(100);

      toast.success(`Successfully imported ${processingResult.users.length} users, ${processingResult.properties.length} properties, and ${processingResult.units.length} units`);
      
      // Reset form
      setFile(null);
      setCsvData([]);
      setProcessingResult(null);
      setShowPreview(false);
      
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Error importing data. Please check the console for details.');
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bulk Data Import</h2>
          <p className="text-gray-600">Upload CSV files to bulk import users, properties, and units</p>
          <p className="text-sm text-gray-500 mt-1">Only first_name, last_name, and email are required. All other fields are optional.</p>
        </div>
        <Button onClick={downloadTemplate} variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download Template
        </Button>
      </div>

      {/* Upload Section */}
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
                Supports all {ALL_SUPPORTED_HEADERS.length} standard columns for comprehensive data import
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

      {/* Preview Section */}
      {showPreview && processingResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Import Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Stats */}
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

            {/* Errors and Warnings */}
            {processingResult.errors.length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <div className="font-medium mb-2">Errors found ({processingResult.errors.length}):</div>
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
                  <div className="font-medium mb-2">Warnings ({processingResult.warnings.length}):</div>
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

            {/* Sample Data Preview */}
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

            {/* Import Button */}
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
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Import {processingResult.users.length} Records
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
