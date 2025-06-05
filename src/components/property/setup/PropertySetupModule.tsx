import React, { useState } from 'react';
import { X, Database, MessageSquare, Palette, FileText, Users, Wrench, Home, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataSourceManager from './DataSourceManager';
import PPFManager from './PPFManager';
import MessagingSetup from './MessagingSetup';
import BrandingSetup from './BrandingSetup';
import DocumentsSetup from './DocumentsSetup';
import CRMSetup from './CRMSetup';
import AmenitiesSetup from './AmenitiesSetup';
import PricingDashboard from './PricingDashboard';

interface PropertySetupModuleProps {
  onClose: () => void;
}

const PropertySetupModule = ({ onClose }: PropertySetupModuleProps) => {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const modules = [
    {
      id: 'data-sources',
      title: 'Data Source Management',
      description: 'Configure lease tracking, renewals, and notices to automate PPF',
      icon: Database,
      component: DataSourceManager
    },
    {
      id: 'pricing-dashboard',
      title: 'Dynamic Pricing Dashboard',
      description: 'Real-time pricing engine with occupancy, comps, and expiration controls',
      icon: DollarSign,
      component: PricingDashboard
    },
    {
      id: 'ppf-management',
      title: 'PPF & Pricing Strategy',
      description: 'Configure 18-week forecasting and automated pricing campaigns',
      icon: TrendingUp,
      component: PPFManager
    },
    {
      id: 'messaging',
      title: 'Message Automations',
      description: 'Set up automated messaging templates and workflows',
      icon: MessageSquare,
      component: MessagingSetup
    },
    {
      id: 'branding',
      title: 'Branding & Design',
      description: 'Customize your property branding and visual identity',
      icon: Palette,
      component: BrandingSetup
    },
    {
      id: 'amenities',
      title: 'Amenities Setup',
      description: 'Configure amenities, hours of operation, and booking requirements',
      icon: Home,
      component: AmenitiesSetup
    },
    {
      id: 'documents',
      title: 'Documents & Forms',
      description: 'Manage lease agreements, applications, and legal documents',
      icon: FileText,
      component: DocumentsSetup
    },
    {
      id: 'crm',
      title: 'CRM Integration',
      description: 'Connect with external CRM systems and manage lead workflows',
      icon: Users,
      component: CRMSetup
    }
  ];

  if (activeModule) {
    const module = modules.find(m => m.id === activeModule);
    if (module) {
      const Component = module.component;
      // PPFManager expects onClose, others expect onBack
      if (module.id === 'ppf-management') {
        return <Component onClose={() => setActiveModule(null)} />;
      }
      return <Component onBack={() => setActiveModule(null)} />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Property Setup</h1>
            <p className="text-gray-600">Configure your property management system</p>
          </div>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Card
                key={module.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-2 hover:border-blue-200"
                onClick={() => setActiveModule(module.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {module.description}
                  </p>
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModule(module.id);
                    }}
                  >
                    Configure
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PropertySetupModule;
