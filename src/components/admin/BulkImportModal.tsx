
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Upload,
  Download,
  FileSpreadsheet,
  Users,
  Building,
  Home,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  importType?: 'properties' | 'residents' | 'clients' | 'users';
}

const BulkImportModal = ({ isOpen, onClose, importType = 'properties' }: BulkImportModalProps) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<string>('');
  const [importResults, setImportResults] = useState<any>(null);

  const importOptions = {
    properties: {
      title: 'Properties',
      icon: Building,
      description: 'Import property data including addresses, units, and management details',
      templateColumns: ['Property Name', 'Address', 'City', 'State', 'Zip', 'Units', 'Management Company', 'Property Type']
    },
    residents: {
      title: 'Residents',
      icon: Users,
      description: 'Import resident information, lease details, and contact data',
      templateColumns: ['First Name', 'Last Name', 'Email', 'Phone', 'Unit Number', 'Move In Date', 'Lease End', 'Monthly Rent']
    },
    clients: {
      title: 'Clients',
      icon: Building,
      description: 'Import client companies and management organizations',
      templateColumns: ['Company Name', 'Contact Name', 'Email', 'Phone', 'Address', 'Plan Type', 'Status']
    },
    users: {
      title: 'Users',
      icon: Users,
      description: 'Import user accounts for operators, maintenance staff, and vendors',
      templateColumns: ['First Name', 'Last Name', 'Email', 'Role', 'Property Assignment', 'Phone']
    }
  };

  const currentOption = importOptions[importType];
  const Icon = currentOption.icon;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.size);
      setSelectedFile(file);
      setImportResults(null);
      setImportProgress(0);
      
      toast({
        title: "File Selected",
        description: `Selected file: ${file.name}`,
      });
    }
  };

  const handleFileUpload = () => {
    const input = document.getElementById('file-upload') as HTMLInputElement;
    input?.click();
  };

  const handleDownloadTemplate = () => {
    // Create CSV template
    const headers = currentOption.templateColumns.join(',');
    const sampleRow = currentOption.templateColumns.map(() => 'Sample Data').join(',');
    const csvContent = `${headers}\n${sampleRow}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${importType}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: `${currentOption.title} import template has been downloaded`,
    });
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to import",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    setImportProgress(0);
    setImportResults(null);
    
    // Simulate import progress with realistic steps
    const progressSteps = [
      { progress: 20, status: 'Validating file format...' },
      { progress: 40, status: 'Processing data records...' },
      { progress: 60, status: 'Validating required fields...' },
      { progress: 80, status: 'Importing to database...' },
      { progress: 100, status: 'Import completed!' }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setImportProgress(step.progress);
      setImportStatus(step.status);
    }

    // Simulate final results
    setTimeout(() => {
      setImportResults({
        total: 156,
        successful: 148,
        failed: 8,
        errors: [
          'Row 12: Invalid email format for john.doe@invalid',
          'Row 23: Missing required field: Phone number',
          'Row 45: Duplicate entry detected',
          'Row 67: Invalid date format in Move In Date',
          'Row 89: Unit number does not exist',
        ]
      });
      setImporting(false);
      setImportStatus('');
      
      toast({
        title: "Import Completed",
        description: `Successfully imported 148 of 156 ${importType} records`,
      });
    }, 200);
  };

  const resetImport = () => {
    setSelectedFile(null);
    setImporting(false);
    setImportProgress(0);
    setImportStatus('');
    setImportResults(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            Bulk Import {currentOption.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="w-5 h-5" />
                Upload {currentOption.title} Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{currentOption.description}</p>
              
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center space-y-4">
                <FileSpreadsheet className="w-12 h-12 text-muted-foreground mx-auto" />
                <div className="space-y-2">
                  <p className="font-medium">Drop your CSV file here or click to browse</p>
                  <p className="text-sm text-muted-foreground">CSV, XLSX, XLS supported (Max 10MB)</p>
                  
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    disabled={importing}
                  />
                  
                  <Button 
                    variant="outline" 
                    onClick={handleFileUpload}
                    disabled={importing}
                    className="mt-2"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </Button>
                </div>
                
                {selectedFile && (
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">
                      Selected: {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Size: {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
              </div>

              {/* Import Progress */}
              {importing && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                      <span className="font-medium text-blue-800">Import in Progress</span>
                    </div>
                    <Progress value={importProgress} className="mb-2" />
                    <p className="text-sm text-blue-700">{importStatus}</p>
                    <p className="text-xs text-blue-600 mt-1">{importProgress}% complete</p>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                <Button 
                  onClick={handleImport} 
                  disabled={!selectedFile || importing}
                  className="w-full"
                >
                  {importing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Start Import
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleDownloadTemplate} 
                  disabled={importing}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
                
                {(selectedFile || importResults) && (
                  <Button variant="ghost" onClick={resetImport} disabled={importing} className="w-full">
                    Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Template Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Template Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Required Columns:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentOption.templateColumns.map((column, index) => (
                    <div key={index} className="text-sm">
                      • {column}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• All required columns must be present in your file</li>
                  <li>• Email addresses must be valid format</li>
                  <li>• Dates should be in MM/DD/YYYY format</li>
                  <li>• Remove the sample data row before uploading</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {importResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Import Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{importResults.total}</div>
                    <div className="text-sm text-blue-800">Total Records</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{importResults.successful}</div>
                    <div className="text-sm text-green-800">Successful</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{importResults.failed}</div>
                    <div className="text-sm text-red-800">Failed</div>
                  </div>
                </div>

                {importResults.errors.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Import Errors ({importResults.errors.length})
                    </h4>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {importResults.errors.map((error: string, index: number) => (
                        <p key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {error}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkImportModal;
