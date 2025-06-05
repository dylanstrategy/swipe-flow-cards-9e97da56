
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import CompaniesTab from '@/components/admin/CompaniesTab';
import PropertiesTab from '@/components/admin/PropertiesTab';
import UsersOverviewTab from '@/components/admin/UsersOverviewTab';
import DashboardOverview from '@/components/admin/DashboardOverview';
import { Building2, Users, Home, BarChart3 } from 'lucide-react';

const SuperAdmin = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Applaud Super Admin</h1>
          <p className="text-sm text-gray-600">Manage all companies, properties, and users</p>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Companies
            </TabsTrigger>
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Properties
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="companies">
            <CompaniesTab />
          </TabsContent>

          <TabsContent value="properties">
            <PropertiesTab />
          </TabsContent>

          <TabsContent value="users">
            <UsersOverviewTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperAdmin;
