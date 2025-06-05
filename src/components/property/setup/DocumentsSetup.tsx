
import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DocumentsSetupProps {
  onBack: () => void;
}

const DocumentsSetup = ({ onBack }: DocumentsSetupProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<{[key: string]: string[]}>({
    'w9': ['W9_MaintenanceCompany.pdf'],
    'coi': [],
    'vendor': ['PlumbingContract_2024.pdf'],
    'lease': []
  });

  const documentCategories = [
    {
      id: 'w9',
      title: 'W-9 Forms',
      description: 'Tax forms for vendors and contractors',
      required: true,
      maxFiles: 10
    },
    {
      id: 'coi',
      title: 'Certificates of Insurance',
      description: 'Insurance certificates from vendors',
      required: true,
      maxFiles: 20
    },
    {
      id: 'vendor',
      title: 'Vendor Contracts',
      description: 'Service agreements and contracts',
      required: false,
      maxFiles: 50
    },
    {
      id: 'lease',
      title: 'Lease Templates',
      description: 'Standard lease agreements and addendums',
      required: true,
      maxFiles: 5
    }
  ];

  const handleFileUpload = (categoryId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setUploadedFiles(prev => ({
        ...prev,
        [categoryId]: [...(prev[categoryId] || []), ...fileNames]
      }));
    }
  };

  const removeFile = (categoryId: string, fileName: string) => {
    setUploadedFiles(prev => ({
      ...prev,
      [categoryId]: prev[categoryId].filter(file => file !== fileName)
    }));
  };

  const getStatusBadge = (category: any) => {
    const files = uploadedFiles[category.id] || [];
    if (category.required && files.length === 0) {
      return <Badge className="bg-red-100 text-red-800">Required</Badge>;
    }
    if (files.length > 0) {
      return <Badge className="bg-green-100 text-green-800">Complete</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">Optional</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Property Setup
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Management</h1>
          <p className="text-gray-600">Upload and organize property documents</p>
        </div>

        <div className="space-y-6">
          {documentCategories.map((category) => {
            const files = uploadedFiles[category.id] || [];
            
            return (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        {getStatusBadge(category)}
                      </div>
                      <p className="text-gray-600 mb-3">{category.description}</p>
                      <p className="text-sm text-gray-500">
                        {files.length}/{category.maxFiles} files uploaded
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-2">Drop files here or click to upload</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(category.id, e)}
                      className="hidden"
                      id={`upload-${category.id}`}
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById(`upload-${category.id}`)?.click()}
                    >
                      Choose Files
                    </Button>
                  </div>

                  {/* Uploaded Files */}
                  {files.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Uploaded Files</h4>
                      {files.map((fileName, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-900">{fileName}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(category.id, fileName)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-6">
          <Button onClick={onBack} variant="outline" className="flex-1">
            Back to Setup
          </Button>
          <Button className="flex-1">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentsSetup;
