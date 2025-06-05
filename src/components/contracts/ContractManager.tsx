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
  Settings,
  PenTool
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SignatureRequestModal from './SignatureRequestModal';
import SignNowConfigModal from './SignNowConfigModal';
import DocumentFieldEditor from './DocumentFieldEditor';
import { signNowService } from '@/services/signNowService';

interface DocumentField {
  id: string;
  type: 'signature' | 'initial' | 'date' | 'text' | 'checkbox';
  x: number;
  y: number;
  width: number;
  height: number;
  role: string;
  mergeField?: string;
  required: boolean;
  placeholder?: string;
}

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
  fields?: DocumentField[];
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
  const [showFieldEditor, setShowFieldEditor] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ContractTemplate | null>(null);
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

  const handleEditFields = (template: ContractTemplate) => {
    setEditingTemplate(template);
    setShowFieldEditor(true);
  };

  const handleSaveFields = (fields: DocumentField[]) => {
    if (!editingTemplate) return;

    const updatedTemplates = templates.map(template =>
      template.id === editingTemplate.id
        ? { 
            ...template, 
            fields,
            status: 'active' as const,
            lastModified: new Date().toISOString()
          }
        : template
    );

    setTemplates(updatedTemplates);
    localStorage.setItem('applaud_contract_templates', JSON.stringify(updatedTemplates));
    
    setShowFieldEditor(false);
    setEditingTemplate(null);
    
    toast({
      title: "Template Updated",
      description: `${editingTemplate.name} has been configured with ${fields.length} fields`,
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

  if (showFieldEditor && editingTemplate) {
    return (
      <DocumentFieldEditor
        documentUrl={editingTemplate.fileUrl}
        documentName={editingTemplate.name}
        onSave={handleSaveFields}
        onBack={() => {
          setShowFieldEditor(false);
          setEditingTemplate(null);
        }}
        initialFields={editingTemplate.fields || []}
      />
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden space-y-6">
      {/* SignNow Configuration Status */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">SignNow Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={`p-3 sm:p-4 rounded-lg ${isSignNowConfigured ? 'bg-green-50' : 'bg-orange-50'}`}>
              <h4 className={`font-medium mb-2 text-sm sm:text-base ${isSignNowConfigured ? 'text-green-900' : 'text-orange-900'}`}>
                Configuration Status
              </h4>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {isSignNowConfigured ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-green-800 truncate">
                        SignNow is configured and ready to use
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-orange-800 truncate">
                        SignNow API credentials not configured
                      </span>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfigModal(true)}
                  className="flex-shrink-0 text-xs sm:text-sm"
                >
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  {isSignNowConfigured ? 'Update' : 'Configure'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Upload className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="truncate">Upload Contract Template</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 w-full">
              <Label htmlFor="contract-upload" className="sr-only">
                Choose contract file
              </Label>
              <Input
                id="contract-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="cursor-pointer w-full"
              />
            </div>
            {isUploading && (
              <div className="flex items-center gap-2 text-blue-600 flex-shrink-0">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-xs sm:text-sm whitespace-nowrap">Uploading...</span>
              </div>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Supported formats: PDF, DOC, DOCX. Max file size: 10MB
          </p>
        </CardContent>
      </Card>

      {/* Templates List */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="truncate text-base sm:text-lg">Contract Templates ({templates.length})</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
              <p className="text-sm sm:text-base text-gray-500">Upload your first contract template to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-3 sm:p-4 border rounded-lg gap-4">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm sm:text-base truncate">{template.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 break-words">{template.description}</p>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2">
                        <Badge className={`${getStatusColor(template.status)} text-xs`}>
                          {template.status}
                        </Badge>
                        <Badge variant="outline" className={`${getCategoryColor(template.category)} text-xs`}>
                          {template.category}
                        </Badge>
                        {template.fields && template.fields.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {template.fields.length} fields
                          </Badge>
                        )}
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          Uploaded {new Date(template.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditFields(template)}
                      className="text-xs sm:text-sm whitespace-nowrap"
                    >
                      <PenTool className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {template.fields?.length ? 'Edit Fields' : 'Add Fields'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSendForSignature(template)}
                      disabled={!isSignNowConfigured || !template.fields?.length}
                      className="text-xs sm:text-sm whitespace-nowrap"
                    >
                      <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Send for Signature
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="px-2">
                          <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
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
