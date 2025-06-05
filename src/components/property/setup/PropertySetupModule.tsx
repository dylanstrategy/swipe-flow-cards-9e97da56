
import React, { useState } from 'react';
import { Settings, Building, Palette, MessageSquare, FileText, Users, ArrowLeft, Database, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AmenitiesSetup from './AmenitiesSetup';
import BrandingSetup from './BrandingSetup';
import MessagingSetup from './MessagingSetup';
import DocumentsSetup from './DocumentsSetup';
import CRMSetup from './CRMSetup';
import DataSourceManager from './DataSourceManager';
import PPFManager from './PPFManager';

interface PropertySetupModuleProps {
  onClose: () => void;
}

const PropertySetupModule = ({ onClose }: PropertySetupModuleProps) => {
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  const setupOptions = [
    {
      id: 'amenities',
      title: 'Amenities & Features',
      description: 'Configure property amenities, unit features, and community spaces',
      icon: Building,
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      id: 'branding',
      title: 'Branding & Design',
      description: 'Customize colors, logos, and visual identity',
      icon: Palette,
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      id: 'messaging',
      title: 'Message Automations',
      description: 'Set up automated messaging templates and workflows',
      icon: MessageSquare,
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      id: 'documents',
      title: 'Documents & Forms',
      description: 'Manage lease documents, forms, and digital signatures',
      icon: FileText,
      color: 'bg-orange-50 text-orange-600 border-orange-200'
    },
    {
      id: 'crm',
      title: 'CRM Integration',
      description: 'Connect with CRM systems and lead management tools',
      icon: Users,
      color: 'bg-red-50 text-red-600 border-red-200'
    },
    {
      id: 'datasources',
      title: 'Data Sources & PPF',
      description: 'Configure data integrations, pricing engine, and performance forecasting',
      icon: Database,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
      id: 'ppf',
      title: 'PPF Management',
      description: 'Manage Property Performance Forecast and occupancy targets',
      icon: Calendar,
      color: 'bg-teal-50 text-teal-600 border-teal-200'
    }
  ];

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'amenities':
        return <AmenitiesSetup onBack={() => setCurrentStep(null)} />;
      case 'branding':
        return <BrandingSetup onBack={() => setCurrentStep(null)} />;
      case 'messaging':
        return <MessagingSetup onBack={() => setCurrentStep(null)} />;
      case 'documents':
        return <DocumentsSetup onBack={() => setCurrentStep(null)} />;
      case 'crm':
        return <CRMSetup onBack={() => setCurrentStep(null)} />;
      case 'datasources':
        return <DataSourceManager onBack={() => setCurrentStep(null)} />;
      case 'ppf':
        return <PPFManager onClose={() => setCurrentStep(null)} />;
      default:
        return null;
    }
  };

  if (currentStep) {
    return renderCurrentStep();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center space-x-3 mb-6">
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Property Setup</h1>
            <p className="text-gray-600">Configure your property management settings and integrations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {setupOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Card 
                key={option.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border-2"
                onClick={() => setCurrentStep(option.id)}
              >
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${option.color} flex items-center justify-center mb-3`}>
                    <IconComponent size={24} />
                  </div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{option.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Complete setup to enable all property management features
            </p>
            <Button onClick={onClose}>
              <Settings className="w-4 h-4 mr-2" />
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertySetupModule;
