
import React, { useState } from 'react';
import { ChevronLeft, Building, Upload, Palette, MessageSquare, TrendingUp, Calendar, Home, User, Bell, Settings, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DocumentsSetup from './DocumentsSetup';
import BrandingSetup from './BrandingSetup';
import MessagingSetup from './MessagingSetup';
import CRMSetup from './CRMSetup';
import AmenitiesSetup from './AmenitiesSetup';
import UnitDirectory from './UnitDirectory';
import PricingDashboard from './PricingDashboard';

interface PropertySetupModuleProps {
  onClose: () => void;
}

type SetupSection = 'overview' | 'units' | 'pricing' | 'documents' | 'branding' | 'messaging' | 'crm' | 'amenities' | 'identity' | 'schedule' | 'notifications' | 'privacy';

const PropertySetupModule = ({ onClose }: PropertySetupModuleProps) => {
  const [currentSection, setCurrentSection] = useState<SetupSection>('overview');

  const setupSections = [
    // Personal Configuration Sections
    {
      id: 'identity' as const,
      title: 'Identity & Profile',
      description: 'Personal information, contact details, emergency contacts',
      icon: User,
      status: 'incomplete',
      completedItems: 2,
      totalItems: 5,
      category: 'personal'
    },
    {
      id: 'schedule' as const,
      title: 'Scheduling Preferences',
      description: 'Work hours, availability, time zone, calendar integration',
      icon: Clock,
      status: 'incomplete',
      completedItems: 1,
      totalItems: 4,
      category: 'personal'
    },
    {
      id: 'notifications' as const,
      title: 'Notification Settings',
      description: 'Email alerts, SMS notifications, push notifications',
      icon: Bell,
      status: 'complete',
      completedItems: 3,
      totalItems: 3,
      category: 'personal'
    },
    {
      id: 'privacy' as const,
      title: 'Privacy & Security',
      description: 'Two-factor auth, session management, data preferences',
      icon: Shield,
      status: 'incomplete',
      completedItems: 1,
      totalItems: 3,
      category: 'personal'
    },
    
    // Property Management Sections
    {
      id: 'units' as const,
      title: 'Unit Directory',
      description: 'Manage unit types, floor plans, premiums and base pricing',
      icon: Home,
      status: 'complete',
      completedItems: 3,
      totalItems: 3,
      category: 'property'
    },
    {
      id: 'pricing' as const,
      title: 'Dynamic Pricing',
      description: 'Configure pricing based on comp analysis and occupancy',
      icon: TrendingUp,
      status: 'incomplete',
      completedItems: 1,
      totalItems: 4,
      category: 'property'
    },
    {
      id: 'documents' as const,
      title: 'Document Management',
      description: 'Upload W-9s, COIs, vendor contracts, lease files',
      icon: Upload,
      status: 'incomplete',
      completedItems: 2,
      totalItems: 5,
      category: 'property'
    },
    {
      id: 'branding' as const,
      title: 'White-Label Branding',
      description: 'Logo, colors, favicon, domain branding',
      icon: Palette,
      status: 'complete',
      completedItems: 4,
      totalItems: 4,
      category: 'property'
    },
    {
      id: 'amenities' as const,
      title: 'Amenities & Booking',
      description: 'Configure amenities, hours, booking requirements, pricing',
      icon: Calendar,
      status: 'incomplete',
      completedItems: 1,
      totalItems: 3,
      category: 'property'
    },
    {
      id: 'messaging' as const,
      title: 'Message Automations',
      description: 'Templates for tours, move-ins, renewals',
      icon: MessageSquare,
      status: 'incomplete',
      completedItems: 1,
      totalItems: 6,
      category: 'property'
    },
    {
      id: 'crm' as const,
      title: 'CRM & Follow-ups',
      description: 'Lead tracking, conversion, follow-up timing',
      icon: Building,
      status: 'incomplete',
      completedItems: 0,
      totalItems: 4,
      category: 'property'
    }
  ];

  const getStatusColor = (status: string) => {
    return status === 'complete' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
  };

  const getCategoryColor = (category: string) => {
    return category === 'personal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'units':
        return <UnitDirectory onBack={() => setCurrentSection('overview')} />;
      case 'pricing':
        return <PricingDashboard onBack={() => setCurrentSection('overview')} />;
      case 'documents':
        return <DocumentsSetup onBack={() => setCurrentSection('overview')} />;
      case 'branding':
        return <BrandingSetup onBack={() => setCurrentSection('overview')} />;
      case 'amenities':
        return <AmenitiesSetup onBack={() => setCurrentSection('overview')} />;
      case 'messaging':
        return <MessagingSetup onBack={() => setCurrentSection('overview')} />;
      case 'crm':
        return <CRMSetup onBack={() => setCurrentSection('overview')} />;
      case 'identity':
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Button variant="outline" size="sm" onClick={() => setCurrentSection('overview')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Identity & Profile Setup</h2>
                <p className="text-sm text-gray-600">Manage your personal information and contact details</p>
              </div>
            </div>
            <div className="text-center py-12 text-gray-500">
              Identity setup interface coming soon...
            </div>
          </div>
        );
      case 'schedule':
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Button variant="outline" size="sm" onClick={() => setCurrentSection('overview')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Scheduling Preferences</h2>
                <p className="text-sm text-gray-600">Configure your work hours and availability</p>
              </div>
            </div>
            <div className="text-center py-12 text-gray-500">
              Scheduling preferences interface coming soon...
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Button variant="outline" size="sm" onClick={() => setCurrentSection('overview')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Notification Settings</h2>
                <p className="text-sm text-gray-600">Manage your notification preferences</p>
              </div>
            </div>
            <div className="text-center py-12 text-gray-500">
              Notification settings interface coming soon...
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <Button variant="outline" size="sm" onClick={() => setCurrentSection('overview')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Privacy & Security</h2>
                <p className="text-sm text-gray-600">Manage your security settings and data preferences</p>
              </div>
            </div>
            <div className="text-center py-12 text-gray-500">
              Privacy & security interface coming soon...
            </div>
          </div>
        );
      default:
        return (
          <div className="max-w-full overflow-hidden">
            <div className="p-4 space-y-6 pb-24 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Settings className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Setup & Configuration</h1>
                  <p className="text-sm text-gray-600">Personal settings and property management configuration</p>
                </div>
              </div>

              {/* Personal Configuration Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Configuration
                </h3>
                {setupSections.filter(section => section.category === 'personal').map((section) => {
                  const Icon = section.icon;
                  const completionPercentage = Math.round((section.completedItems / section.totalItems) * 100);
                  
                  return (
                    <Card 
                      key={section.id}
                      className="cursor-pointer hover:shadow-md transition-shadow shadow-sm"
                      onClick={() => setCurrentSection(section.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg flex-shrink-0">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                              <Badge className={`${getStatusColor(section.status)} text-xs`}>
                                {section.status === 'complete' ? 'Complete' : 'Incomplete'}
                              </Badge>
                              <Badge className={`${getCategoryColor(section.category)} text-xs`}>
                                Personal
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">{section.description}</p>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${completionPercentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-500 flex-shrink-0 font-medium min-w-[3rem]">
                                {section.completedItems}/{section.totalItems}
                              </span>
                              <Button variant="outline" size="sm" className="text-sm px-4 py-2 flex-shrink-0">
                                Configure
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Property Management Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Property Management
                </h3>
                {setupSections.filter(section => section.category === 'property').map((section) => {
                  const Icon = section.icon;
                  const completionPercentage = Math.round((section.completedItems / section.totalItems) * 100);
                  
                  return (
                    <Card 
                      key={section.id}
                      className="cursor-pointer hover:shadow-md transition-shadow shadow-sm"
                      onClick={() => setCurrentSection(section.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg flex-shrink-0">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                              <Badge className={`${getStatusColor(section.status)} text-xs`}>
                                {section.status === 'complete' ? 'Complete' : 'Incomplete'}
                              </Badge>
                              <Badge className={`${getCategoryColor(section.category)} text-xs`}>
                                Property
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">{section.description}</p>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${completionPercentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-500 flex-shrink-0 font-medium min-w-[3rem]">
                                {section.completedItems}/{section.totalItems}
                              </span>
                              <Button variant="outline" size="sm" className="text-sm px-4 py-2 flex-shrink-0">
                                Configure
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <Button
            variant="ghost"
            size="sm"
            onClick={currentSection === 'overview' ? onClose : () => setCurrentSection('overview')}
            className="flex items-center gap-2 text-sm"
          >
            <ChevronLeft size={18} />
            {currentSection === 'overview' ? 'Back to Settings' : 'Back to Overview'}
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {renderCurrentSection()}
        </div>
      </div>
    </div>
  );
};

export default PropertySetupModule;
