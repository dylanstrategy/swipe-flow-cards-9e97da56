import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SignatureRequestModal from './SignatureRequestModal';
import SignNowConfigModal from './SignNowConfigModal';
import { signNowService } from '@/services/signNowService';

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
  fileName: string;
  uploadedAt: string;
  lastModified: string;
  status: 'active' | 'draft' | 'archived';
  category: 'lease' | 'service' | 'vendor' | 'other';
}

interface ContractManagerProps {
  onSendContract?: (templateId: string, clientData: any) => void;
}

const ContractManager: React.FC<ContractManagerProps> = ({ onSendContract }) => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isSignNowConfigured, setIsSignNowConfigured] = useState(false);

  useEffect(() => {
    loadTemplates();
    checkSignNowConfiguration();
  }, []);

  const loadTemplates = () => {
    const stored = localStorage.getItem('applaud_contract_templates');
    if (stored) {
      setTemplates(JSON.parse(stored));
    } else {
      // Sample templates
      const sampleTemplates: ContractTemplate[] = [
        {
          id: '1',
          name: 'Standard Lease Agreement',
          description: 'Standard residential lease agreement template',
          fileUrl: '/contracts/standard-lease.pdf',
          fileName: 'standard-lease-template.pdf',
          uploadedAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          status: 'active',
          category: 'lease'
        },
        {
          id: '2',
          name: 'Property Management Service Agreement',
          description: 'Service agreement for property management clients',
          fileUrl: '/contracts/service-agreement.pdf',
          fileName: 'service-agreement-template.pdf',
          uploadedAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          status: 'active',
          category: 'service'
        }
      ];
      setTemplates(sampleTemplates);
      localStorage.setItem('applaud_contract_templates', JSON.stringify(sampleTemplates));
    }
  };

  const checkSignNowConfiguration = () => {
    // Check if SignNow is configured using the service method
    setIsSignNowConfigured(signNowService.isConfigured());
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // In a real implementation, you'd upload to your storage service
      const fileUrl = URL.createObjectURL(file);
      
      const newTemplate: ContractTemplate = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        description: `Uploaded contract template: ${file.name}`,
        fileUrl,
        fileName: file.name,
        uploadedAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        status: 'draft',
        category: 'other'
      };

      const updatedTemplates = [...templates, newTemplate];
      setTemplates(updatedTemplates);
      localStorage.setItem('applaud_contract_templates', JSON.stringify(updatedTemplates));

      toast({
        title: "Template Uploaded",
        description: `${file.name} has been uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "Failed to upload contract template",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = '';
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    localStorage.setItem('applaud_contract_templates', JSON.stringify(updatedTemplates));
    
    toast({
      title: "Template Deleted",
      description: "Contract template has been removed",
    });
  };

  const handleSendForSignature = (template: ContractTemplate) => {
    if (!isSignNowConfigured) {
      toast({
        title: "SignNow Not Configured",
        description: "Please configure your SignNow API credentials first",
        variant: "destructive",
      });
      return;
    }

    setSelectedTemplate(template);
    setShowSignatureModal(true);
  };

  const handleSignatureRequested = (templateId: string, signerData: any) => {
    toast({
      title: "Signature Request Sent",
      description: `Contract sent to ${signerData.signerEmail} for signature`,
    });
    
    if (onSendContract) {
      onSendContract(templateId, signerData);
    }
  };

  const handleConfigured = () => {
    checkSignNowConfiguration();
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      lease: 'bg-blue-100 text-blue-800',
      service: 'bg-purple-100 text-purple-800',
      vendor: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* SignNow Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            SignNow Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${isSignNowConfigured ? 'bg-green-50' : 'bg-orange-50'}`}>
              <h4 className={`font-medium mb-2 ${isSignNowConfigured ? 'text-green-900' : 'text-orange-900'}`}>
                Configuration Status
              </h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isSignNowConfigured ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-800">
                        SignNow is configured and ready to use
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-800">
                        SignNow API credentials not configured
                      </span>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfigModal(true)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {isSignNowConfigured ? 'Update' : 'Configure'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Contract Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="contract-upload" className="sr-only">
                Choose contract file
              </Label>
              <Input
                id="contract-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="cursor-pointer"
              />
            </div>
            {isUploading && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Uploading...</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Supported formats: PDF, DOC, DOCX. Max file size: 10MB
          </p>
        </CardContent>
      </Card>

      {/* Templates List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Contract Templates ({templates.length})
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
              <p className="text-gray-500">Upload your first contract template to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getStatusColor(template.status)}>
                          {template.status}
                        </Badge>
                        <Badge variant="outline" className={getCategoryColor(template.category)}>
                          {template.category}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          Uploaded {new Date(template.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSendForSignature(template)}
                      disabled={!isSignNowConfigured}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send for Signature
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signature Request Modal */}
      <SignatureRequestModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        template={selectedTemplate}
        onSignatureRequested={handleSignatureRequested}
      />

      {/* SignNow Configuration Modal */}
      <SignNowConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        onConfigured={handleConfigured}
      />
    </div>
  );
};

export default ContractManager;
