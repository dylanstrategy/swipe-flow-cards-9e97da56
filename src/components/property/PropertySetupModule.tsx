
import React, { useState } from 'react';
import { ChevronLeft, Building, Upload, Palette, MessageSquare, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DocumentsSetup from './setup/DocumentsSetup';
import BrandingSetup from './setup/BrandingSetup';
import MessagingSetup from './setup/MessagingSetup';
import CRMSetup from './setup/CRMSetup';

interface PropertySetupModuleProps {
  onClose: () => void;
}

type SetupSection = 'overview' | 'documents' | 'branding' | 'messaging' | 'crm';

const PropertySetupModule = ({ onClose }: PropertySetupModuleProps) => {
  const [currentSection, setCurrentSection] = useState<SetupSection>('overview');

  const setupSections = [
    {
      id: 'documents' as const,
      title: 'Document Management',
      description: 'Upload W-9s, COIs, vendor contracts, lease files',
      icon: Upload,
      status: 'incomplete',
      completedItems: 2,
      totalItems: 5
    },
    {
      id: 'branding' as const,
      title: 'White-Label Branding',
      description: 'Logo, colors, favicon, domain branding',
      icon: Palette,
      status: 'complete',
      completedItems: 4,
      totalItems: 4
    },
    {
      id: 'messaging' as const,
      title: 'Message Automations',
      description: 'Templates for tours, move-ins, renewals',
      icon: MessageSquare,
      status: 'incomplete',
      completedItems: 1,
      totalItems: 6
    },
    {
      id: 'crm' as const,
      title: 'CRM & Follow-ups',
      description: 'Lead tracking, conversion, follow-up timing',
      icon: TrendingUp,
      status: 'incomplete',
      completedItems: 0,
      totalItems: 4
    }
  ];

  const getStatusColor = (status: string) => {
    return status === 'complete' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'documents':
        return <DocumentsSetup onBack={() => setCurrentSection('overview')} />;
      case 'branding':
        return <BrandingSetup onBack={() => setCurrentSection('overview')} />;
      case 'messaging':
        return <MessagingSetup onBack={() => setCurrentSection('overview')} />;
      case 'crm':
        return <CRMSetup onBack={() => setCurrentSection('overview')} />;
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Building className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Property Setup</h1>
                <p className="text-gray-600">Configure your property management settings</p>
              </div>
            </div>

            <div className="grid gap-4">
              {setupSections.map((section) => {
                const Icon = section.icon;
                const completionPercentage = Math.round((section.completedItems / section.totalItems) * 100);
                
                return (
                  <Card 
                    key={section.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setCurrentSection(section.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                              <Badge className={getStatusColor(section.status)}>
                                {section.status === 'complete' ? 'Complete' : 'Incomplete'}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{section.description}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${completionPercentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-500">
                                {section.completedItems}/{section.totalItems}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={currentSection === 'overview' ? onClose : () => setCurrentSection('overview')}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            {currentSection === 'overview' ? 'Back to Maintenance' : 'Back to Overview'}
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderCurrentSection()}
        </div>
      </div>
    </div>
  );
};

export default PropertySetupModule;
