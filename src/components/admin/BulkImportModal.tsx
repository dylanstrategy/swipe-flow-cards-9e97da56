
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  CheckCircle
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
      setSelectedFile(file);
    }
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
    
    // Simulate import process
    setTimeout(() => {
      setImportResults({
        total: 156,
        successful: 148,
        failed: 8,
        errors: [
          'Row 12: Invalid email format',
          'Row 23: Missing required field: Phone',
          'Row 45: Duplicate entry',
        ]
      });
      setImporting(false);
      
      toast({
        title: "Import Completed",
        description: `Successfully imported 148 of 156 ${importType} records`,
      });
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            Bulk Import {currentOption.title}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="template">Download Template</TabsTrigger>
            <TabsTrigger value="history">Import History</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload {currentOption.title} Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{currentOption.description}</p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Drop your CSV file here</p>
                    <p className="text-gray-600">or click to browse</p>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer">
                        Choose File
                      </Button>
                    </label>
                  </div>
                  {selectedFile && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-800">
                        Selected: {selectedFile.name}
                      </p>
                      <p className="text-xs text-blue-600">
                        Size: {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleImport} 
                    disabled={!selectedFile || importing}
                    className="flex-1"
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
                  <Button variant="outline" onClick={handleDownloadTemplate}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </CardContent>
            </Card>

            {importResults && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
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
                        Import Errors
                      </h4>
                      <div className="space-y-1">
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
          </TabsContent>

          <TabsContent value="template" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Import Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Download the template file to ensure your data is formatted correctly for import.
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Required Columns:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {currentOption.templateColumns.map((column, index) => (
                      <div key={index} className="text-sm text-gray-700">
                        • {column}
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleDownloadTemplate} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download {currentOption.title} Template
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Imports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Properties Import</p>
                      <p className="text-sm text-gray-600">December 15, 2024 • 156 records</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Residents Import</p>
                      <p className="text-sm text-gray-600">December 12, 2024 • 340 records</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Users Import</p>
                      <p className="text-sm text-gray-600">December 10, 2024 • 45 records</p>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">Partial</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BulkImportModal;
